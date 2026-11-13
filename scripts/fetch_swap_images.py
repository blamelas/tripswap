#!/usr/bin/env python3
"""Fetch narrow, freely licensed Wikimedia Commons images for swap cards."""
from __future__ import annotations

import html
import json
import re
import urllib.parse
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'images' / 'swaps'
OUT.mkdir(parents=True, exist_ok=True)
CREDITS = ROOT / 'docs' / 'IMAGE-CREDITS.md'

QUERIES = {
    'uber-public-transport': 'city bus',
    'walk-short-distances': 'pedestrian street',
    'coffee-at-home': 'coffee cup',
    'replace-bought-snacks': 'mixed nuts',
    'reduce-takeaway': 'takeaway food',
    'lunch-from-home': 'lunch box',
    'reduce-alcohol': 'beer glass',
    'water-instead-of-soft-drinks': 'glass of water',
    'cook-instead-of-ready-meals': 'cooking vegetables',
    'simpler-snacks': 'fruit bowl',
    'half-nights-out': 'restaurant table',
    'cancel-streaming': 'television remote control',
    'smaller-tv-package': 'television living room',
    'cancel-forgotten-subscriptions': 'smartphone credit card',
    'repair-shoes': 'shoe repair',
    'reduce-impulse-clothing': 'clothes rack',
    'repair-equipment': 'laptop repair',
    'reduce-food-waste': 'vegetables',
    'cheaper-mobile-plan': 'sim card',
    'repair-clothing': 'sewing machine',
    'second-hand-instead-of-new': 'flea market',
    'sell-unused-items': 'flea market',
    'stop-tobacco': 'cigarette',
    'games-betting': 'lottery tickets',
    'exercise-at-home': 'exercise mat',
}


def clean(value: str | None) -> str:
    if not value:
        return ''
    return re.sub(r'<[^>]+>', '', html.unescape(value)).strip()


def search(term: str) -> list[dict]:
    params = urllib.parse.urlencode({
        'action': 'query',
        'generator': 'search',
        'gsrsearch': f'filetype:bitmap {term}',
        'gsrnamespace': '6',
        'gsrlimit': '8',
        'prop': 'imageinfo',
        'iiprop': 'url|mime|extmetadata|size',
        'iiurlwidth': '320',
        'format': 'json',
        'formatversion': '2',
    })
    url = f'https://commons.wikimedia.org/w/api.php?{params}'
    ctx = __import__('ssl')._create_unverified_context()
    req = urllib.request.Request(url, headers={'User-Agent': 'TripSwap/1.0 (course project)'})
    with urllib.request.urlopen(req, timeout=30, context=ctx) as response:
        data = json.load(response)
    pages = data.get('query', {}).get('pages', [])
    return pages


def main() -> None:
    credits = [
        '# Image credits — swap strips',
        '',
        'The 25 swap cards use a narrow, masked strip from Wikimedia Commons. The strip is',
        'a texture, not a full stock-photo tile. Licenses and authors are listed below.',
        '',
        '| Habit | File | Author | License | Source |',
        '|---|---|---|---|---|',
    ]
    failures = []
    for habit, term in QUERIES.items():
        try:
            pages = search(term)
        except Exception as error:  # noqa: BLE001
            failures.append((habit, str(error)))
            continue
        chosen = None
        for page in pages:
            info = (page.get('imageinfo') or [{}])[0]
            mime = info.get('mime', '')
            thumb = info.get('thumburl')
            width = info.get('thumbwidth') or info.get('width') or 0
            height = info.get('thumbheight') or info.get('height') or 0
            if mime not in ('image/jpeg', 'image/png') or not thumb or width < 240:
                continue
            if height < 120:
                continue
            chosen = (page, info)
            break
        if not chosen:
            failures.append((habit, 'no bitmap result'))
            continue
        page, info = chosen
        ctx = __import__('ssl')._create_unverified_context()
        req = urllib.request.Request(info['thumburl'], headers={'User-Agent': 'TripSwap/1.0 (course project)'})
        with urllib.request.urlopen(req, timeout=30, context=ctx) as response:
            raw = response.read()
        image = Image.open(BytesIO(raw)).convert('RGB')
        image.thumbnail((640, 640), Image.Resampling.LANCZOS)
        target = OUT / f'{habit}.jpg'
        image.save(target, 'JPEG', quality=82, optimize=True)
        meta = info.get('extmetadata', {})
        author = clean(meta.get('Artist', {}).get('value')) or 'Unknown'
        license_name = clean(meta.get('LicenseShortName', {}).get('value')) or 'See source'
        source = info.get('descriptionurl') or ''
        credits.append(
            f"| `{habit}` | `{target.name}` | {author.replace('|', '/')} | {license_name} | {source} |"
        )
        print(f'{habit}: {target.name} ({license_name})')
    CREDITS.write_text('\n'.join(credits) + '\n', encoding='utf-8')
    if failures:
        print('\nFAILURES:')
        for habit, error in failures:
            print(f'  {habit}: {error}')
        raise SystemExit(1)


if __name__ == '__main__':
    main()

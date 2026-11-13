#!/usr/bin/env python3
"""Build the English TripSwap defence deck (HTML -> PNG -> PDF + PPTX).

Requires: playwright (Python), Pillow, python-pptx, local npm fonts.
Run: python3 scripts/build_defense_deck.py
"""
from pathlib import Path
from urllib.parse import quote

from PIL import Image
from playwright.sync_api import sync_playwright
from pptx import Presentation
from pptx.util import Inches

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / 'docs' / 'assets'
OUT = ROOT / 'docs'
TMP = Path('/tmp/tripswap-deck')
TMP.mkdir(exist_ok=True)

FONT_DIR = ROOT / 'node_modules' / '@fontsource'


def font(package: str, file: str) -> str:
    return (FONT_DIR / package / 'files' / file).as_uri()


BARLOW_600 = font('barlow-condensed', 'barlow-condensed-latin-600-normal.woff2')
BARLOW_700 = font('barlow-condensed', 'barlow-condensed-latin-700-normal.woff2')
PLEX_400 = font('ibm-plex-sans', 'ibm-plex-sans-latin-400-normal.woff2')
PLEX_500 = font('ibm-plex-sans', 'ibm-plex-sans-latin-500-normal.woff2')
PLEX_600 = font('ibm-plex-sans', 'ibm-plex-sans-latin-600-normal.woff2')
MONO_400 = font('ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff2')


def img(name: str) -> str:
    return (ASSETS / name).as_uri()


def public_img(name: str) -> str:
    return (ROOT / 'public' / 'images' / name).as_uri()


def brand(dark: bool = False) -> str:
    bg = '#F7F6F2' if dark else '#151A19'
    fg = '#151A19' if dark else '#F7F6F2'
    return f'''<div class="brand">
      <svg width="30" height="30" viewBox="0 0 32 32"><rect width="32" height="32" fill="{bg}"/><circle cx="16" cy="13" r="8" fill="{fg}"/><rect y="20" width="32" height="3" fill="#F04A28"/></svg>
      <span>TRIP<span class="accent">SWAP</span></span>
    </div>'''


def top(kicker: str, dark: bool = False) -> str:
    return f'<div class="top">{brand(dark)}<div class="kicker">{kicker}</div></div>'


CSS = f'''
@font-face {{ font-family:'Barlow'; src:url("{BARLOW_600}") format("woff2"); font-weight:600; }}
@font-face {{ font-family:'Barlow'; src:url("{BARLOW_700}") format("woff2"); font-weight:700; }}
@font-face {{ font-family:'Plex'; src:url("{PLEX_400}") format("woff2"); font-weight:400; }}
@font-face {{ font-family:'Plex'; src:url("{PLEX_500}") format("woff2"); font-weight:500; }}
@font-face {{ font-family:'Plex'; src:url("{PLEX_600}") format("woff2"); font-weight:600; }}
@font-face {{ font-family:'Mono'; src:url("{MONO_400}") format("woff2"); font-weight:400; }}
* {{ box-sizing:border-box; margin:0; padding:0; }}
body {{ background:#151A19; }}
.slide {{ width:1600px; height:900px; background:#F7F6F2; color:#151A19; padding:58px 72px 54px; position:relative; overflow:hidden; page-break-after:always; }}
.slide.dark {{ background:#151A19; color:#F7F6F2; }}
.top {{ display:flex; justify-content:space-between; align-items:center; }}
.brand {{ display:flex; align-items:center; gap:12px; font-family:'Barlow'; font-weight:700; font-size:27px; letter-spacing:.01em; }}
.brand .accent {{ color:#F04A28; }}
.kicker {{ font-family:'Plex'; font-size:11px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:#B83417; }}
.dark .kicker {{ color:#F04A28; }}
h1 {{ font-family:'Barlow'; font-weight:600; text-transform:uppercase; font-size:74px; line-height:.84; letter-spacing:-.02em; }}
h2 {{ font-family:'Barlow'; font-weight:600; text-transform:uppercase; line-height:.88; }}
.lede {{ font-family:'Plex'; font-size:18px; line-height:1.5; color:#3B423D; }}
.dark .lede {{ color:rgba(247,246,242,.68); }}
.muted {{ color:#6C716D; }}
.dark .muted {{ color:rgba(247,246,242,.55); }}
.accent {{ color:#F04A28; }}
.signal-bg {{ background:#F04A28; color:#151A19; }}
.sky-bg {{ background:#D8E8EE; }}
.hr {{ border-top:1px solid #DAD8CF; }}
.dark .hr {{ border-top:1px solid rgba(247,246,242,.18); }}
.label {{ font-family:'Plex'; font-size:10px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:#6C716D; }}
.dark .label {{ color:rgba(247,246,242,.55); }}
.num {{ font-family:'Mono'; font-variant-numeric:tabular-nums; letter-spacing:-.04em; }}
.card {{ border:1px solid #DAD8CF; padding:22px 24px; }}
.dark .card {{ border:1px solid rgba(247,246,242,.18); }}
.frame {{ overflow:hidden; background:#151A19; }}
.frame img {{ width:100%; height:100%; object-fit:cover; display:block; }}
.footer {{ position:absolute; left:72px; right:150px; bottom:26px; display:flex; justify-content:space-between; font-family:'Plex'; font-size:9px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:#6C716D; }}
.dark .footer {{ color:rgba(247,246,242,.45); }}
.pagenum {{ position:absolute; right:72px; bottom:26px; font-family:'Mono'; font-size:10px; color:#6C716D; }}
.dark .pagenum {{ color:rgba(247,246,242,.45); }}
.grid {{ display:grid; gap:30px; }}
.cols2 {{ grid-template-columns:1fr 1fr; }}
.cols3 {{ grid-template-columns:repeat(3,1fr); }}
.cols4 {{ grid-template-columns:repeat(4,1fr); }}
.tiny {{ font-family:'Plex'; font-size:12px; line-height:1.5; color:#3B423D; }}
.dark .tiny {{ color:rgba(247,246,242,.68); }}
.stat {{ font-family:'Mono'; font-size:42px; line-height:1; }}
.stat-label {{ font-family:'Plex'; font-size:9px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:#6C716D; margin-top:7px; }}
.dark .stat-label {{ color:rgba(247,246,242,.5); }}
.step-num {{ font-family:'Mono'; font-size:11px; color:#B83417; }}
.box {{ border:1px solid #DAD8CF; padding:15px 18px; font-family:'Plex'; font-size:13px; font-weight:500; }}
.arrow {{ font-family:'Mono'; font-size:16px; color:#F04A28; align-self:center; }}
.swatch {{ height:42px; border:1px solid #DAD8CF; }}
.checklist {{ display:flex; flex-direction:column; gap:9px; }}
.checklist div {{ font-family:'Plex'; font-size:14px; line-height:1.35; }}
.checklist b {{ color:#151A19; }}
.tag {{ display:inline-block; border:1px solid #DAD8CF; padding:4px 7px; margin:0 5px 5px 0; font-family:'Plex'; font-size:9px; font-weight:600; letter-spacing:.11em; text-transform:uppercase; }}
.dark .tag {{ border-color:rgba(247,246,242,.25); }}
'''


def slide(content: str, number: int, dark: bool = False, footer: str = '') -> str:
    return f'''<section class="slide {'dark' if dark else ''}" id="s{number}">
      {content}
      <div class="footer"><span>{footer or 'TripSwap · final project · 2026'}</span><span>tripswap-home.vercel.app</span></div>
      <div class="pagenum">{number:02d} / 10</div>
    </section>'''


slides = []

# 1 Title
slides.append(slide(f'''
  {top('FINAL PROJECT · EUNICE NETWORK · 2026', True)}
  <div style="display:grid;grid-template-columns:1.1fr .9fr;gap:44px;height:660px;margin-top:42px;">
    <div style="display:flex;flex-direction:column;justify-content:space-between;min-width:0;">
      <div>
        <h1 style="font-size:112px;">Trip<br>Swap</h1>
        <h2 class="accent" style="font-size:44px;margin-top:14px;">Small changes.<br>Bigger journeys.</h2>
      </div>
      <div>
        <p class="lede" style="max-width:630px;">A travel discovery product that turns everyday swaps into future experiences — with the real cost always visible.</p>
        <div class="grid cols4" style="margin-top:28px;gap:16px;">
          <div><div class="stat">8</div><div class="stat-label">destinations</div></div>
          <div><div class="stat">25</div><div class="stat-label">swaps</div></div>
          <div><div class="stat">6</div><div class="stat-label">categories</div></div>
          <div><div class="stat">42</div><div class="stat-label">tests</div></div>
        </div>
      </div>
    </div>
    <div class="frame" style="height:100%;"><img src="{public_img('paris.webp')}" alt="Paris at dusk"></div>
  </div>
''', 1, True, 'Bruno Lamelas · github.com/blamelas/tripswap'))

# 2 Problem
slides.append(slide(f'''
  {top('THE PROBLEM')}
  <div style="display:grid;grid-template-columns:1.18fr .82fr;gap:44px;margin-top:46px;height:640px;">
    <div>
      <h1 style="font-size:64px;max-width:820px;">You know where you want to go. The gap is knowing if you can afford it.</h1>
      <p class="lede" style="margin-top:24px;max-width:700px;">Budget tools start with spending. Travellers start with desire. The missing piece is a plan with a timeline.</p>
      <div class="grid" style="gap:12px;margin-top:28px;">
        <div class="card"><div class="label">01 · Bank</div><div class="tiny" style="margin-top:7px;">Shows what you already spent. Not what is missing, or when it becomes possible.</div></div>
        <div class="card"><div class="label">02 · Spreadsheet</div><div class="tiny" style="margin-top:7px;">Asks for salary, statements and categories. It loses the person on the first screen.</div></div>
        <div class="card"><div class="label">03 · Inspiration</div><div class="tiny" style="margin-top:7px;">Shows photographs and prices. It does not turn desire into a decision.</div></div>
      </div>
    </div>
    <div class="frame" style="height:100%;"><img src="{public_img('douro.webp')}" alt="Douro valley"></div>
  </div>
  <div style="position:absolute;left:72px;right:72px;bottom:76px;border-top:2px solid #F04A28;padding-top:13px;font-family:'Barlow';font-size:24px;font-weight:600;text-transform:uppercase;">The bridge: a plan with a timeline.</div>
''', 2))

# 3 Idea
slides.append(slide(f'''
  {top('THE IDEA')}
  <div style="display:grid;grid-template-columns:.95fr 1.05fr;gap:54px;margin-top:54px;height:610px;">
    <div style="border-right:1px solid #DAD8CF;padding-right:48px;">
      <div class="label">The signal</div>
      <div style="font-family:'Barlow';font-size:250px;line-height:.72;color:#F04A28;margin-top:18px;">€0<span style="font-size:80px;vertical-align:top;">*</span></div>
      <div style="margin-top:18px;font-family:'Mono';font-size:24px;color:#6C716D;text-decoration:line-through;">€650 planning target</div>
      <p class="lede" style="margin-top:24px;max-width:420px;">The €0* is a metaphor, not a discount. The real planning cost stays visible on every surface.</p>
    </div>
    <div>
      <h1 style="font-size:64px;">The world is the reward.</h1>
      <p class="lede" style="margin-top:20px;max-width:670px;">TripSwap starts with a destination and reveals the everyday choices that could fund it.</p>
      <div class="grid cols3" style="margin-top:34px;gap:18px;">
        <div><div class="step-num">01</div><div style="font-family:'Barlow';font-size:25px;font-weight:600;text-transform:uppercase;margin-top:5px;">Spend smarter</div><div class="tiny" style="margin-top:6px;">Less unnecessary transport, forgotten subscriptions and impulse purchases.</div></div>
        <div><div class="step-num">02</div><div style="font-family:'Barlow';font-size:25px;font-weight:600;text-transform:uppercase;margin-top:5px;">Live healthier</div><div class="tiny" style="margin-top:6px;">More walking, home cooking and fewer sugary drinks. Voluntary, never prescriptive.</div></div>
        <div><div class="step-num">03</div><div style="font-family:'Barlow';font-size:25px;font-weight:600;text-transform:uppercase;margin-top:5px;">Consume consciously</div><div class="tiny" style="margin-top:6px;">Repair, reuse and reduce waste. Fewer things, more life.</div></div>
      </div>
      <div style="margin-top:26px;background:#D8E8EE;padding:14px 20px;font-family:'Barlow';font-size:23px;font-weight:600;text-transform:uppercase;">Less of this. More of the world.</div>
    </div>
  </div>
  <div style="position:absolute;left:72px;right:72px;bottom:74px;">
    <div class="label" style="margin-bottom:8px;">The destinations are the reward</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:3px;height:150px;">
      <div class="frame"><img src="{public_img('douro.webp')}" alt="Douro"></div>
      <div class="frame"><img src="{public_img('lisbon.webp')}" alt="Lisbon"></div>
      <div class="frame"><img src="{public_img('alps.webp')}" alt="Alps"></div>
    </div>
  </div>
''', 3))

# 4 Experience
slides.append(slide(f'''
  {top('THE EXPERIENCE')}
  <div style="display:grid;grid-template-columns:.9fr 1.1fr;gap:44px;margin-top:44px;height:650px;">
    <div>
      <h1 style="font-size:62px;">Desire → everyday choices → a trip within reach.</h1>
      <div style="display:flex;flex-direction:column;gap:18px;margin-top:26px;">
        <div style="display:flex;gap:16px;"><div class="step-num">01</div><div><b style="font-family:'Barlow';font-size:23px;text-transform:uppercase;">Discover</b><div class="tiny">A place, a photograph, a planning target.</div></div></div>
        <div style="display:flex;gap:16px;"><div class="step-num">02</div><div><b style="font-family:'Barlow';font-size:23px;text-transform:uppercase;">Swap</b><div class="tiny">Choose changes you would actually make. No salary, no statements.</div></div></div>
        <div style="display:flex;gap:16px;"><div class="step-num">03</div><div><b style="font-family:'Barlow';font-size:23px;text-transform:uppercase;">Unlock</b><div class="tiny">The destination photograph, the months and the projected saving.</div></div></div>
      </div>
      <div style="margin-top:26px;border-top:1px solid #DAD8CF;padding-top:14px;">
        <div class="label">Example · Paris, Balanced</div>
        <div class="grid cols3" style="margin-top:10px;gap:12px;">
          <div><div class="stat">3</div><div class="stat-label">swaps</div></div>
          <div><div class="stat">€122</div><div class="stat-label">/ month</div></div>
          <div><div class="stat">6</div><div class="stat-label">months</div></div>
        </div>
        <div class="tiny" style="margin-top:10px;">Projection, not money already saved.</div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;">
      <div class="label" style="margin-bottom:8px;">The reward card</div>
      <div class="frame" style="height:430px;background:#F7F6F2;"><img src="{img('success.jpg')}" alt="Reward card and swaps" style="object-fit:contain;"></div>
      <div class="tiny" style="margin-top:10px;">Paris, Balanced. Same photo, same card height; every unlock is a projection.</div>
    </div>
  </div>
  <div style="position:absolute;left:72px;right:72px;bottom:76px;border-top:2px solid #F04A28;padding-top:11px;font-family:'Plex';font-size:13px;font-weight:500;">The reward card transforms in place: same photo, same height, no extra section.</div>
''', 4))

# 5 Scope
slides.append(slide(f'''
  {top('SCOPE')}
  <h1 style="font-size:66px;margin-top:44px;max-width:1150px;">A small product with a sharp boundary.</h1>
  <div class="grid cols2" style="margin-top:28px;gap:26px;">
    <div class="card" style="min-height:330px;">
      <div class="label" style="color:#B83417;">In the MVP</div>
      <div class="checklist" style="margin-top:14px;">
        <div>8 destinations with illustrative planning targets</div>
        <div>25 swaps · 6 categories · deterministic engine</div>
        <div>Overlap groups, one-time savings, receipts</div>
        <div>The swaps catalogue · selection carried to plans</div>
        <div>Saved plans, PT/EN toggle, calendar reminders</div>
        <div>42 tests · CI · Vercel · mobile</div>
      </div>
    </div>
    <div class="card" style="min-height:330px;">
      <div class="label">Deliberately out</div>
      <div class="checklist" style="margin-top:14px;">
        <div>Authentication, accounts or sync</div>
        <div>Booking, payments or real fares</div>
        <div>Live prices, maps, weather or external APIs</div>
        <div>Push notifications or a backend</div>
        <div>Custom swaps and dream trips (roadmap only)</div>
        <div>Social feed, CMS or admin panel</div>
      </div>
    </div>
  </div>
  <div style="margin-top:20px;border-top:1px solid #DAD8CF;padding-top:13px;" class="tiny"><b>Criterion:</b> without this, does the user still get the core value?</div>
  <div class="grid cols4" style="margin-top:20px;gap:18px;">
    <div><div class="step-num">01</div><div style="font-family:'Barlow';font-size:21px;font-weight:600;text-transform:uppercase;margin-top:4px;">Discover</div><div class="tiny">Inspiring destinations with transparent targets.</div></div>
    <div><div class="step-num">02</div><div style="font-family:'Barlow';font-size:21px;font-weight:600;text-transform:uppercase;margin-top:4px;">Select</div><div class="tiny">Realistic swaps, no financial data.</div></div>
    <div><div class="step-num">03</div><div style="font-family:'Barlow';font-size:21px;font-weight:600;text-transform:uppercase;margin-top:4px;">Understand</div><div class="tiny">Savings, horizon and the receipt.</div></div>
    <div><div class="step-num">04</div><div style="font-family:'Barlow';font-size:21px;font-weight:600;text-transform:uppercase;margin-top:4px;">Save</div><div class="tiny">Plans and reminders, locally.</div></div>
  </div>
''', 5))

# 6 Architecture
slides.append(slide(f'''
  {top('ARCHITECTURE & DESIGN')}
  <h1 style="font-size:62px;margin-top:44px;">Static, deterministic, photography-led.</h1>
  <div class="grid cols2" style="margin-top:30px;gap:40px;">
    <div>
      <div style="display:flex;flex-direction:column;gap:9px;">
        <div class="box">React 19 + TypeScript + Vite + Tailwind</div>
        <div class="arrow">↓</div>
        <div class="box" style="border-color:#F04A28;">Pure savings engine · conflicts · projections</div>
        <div class="arrow">↓</div>
        <div class="box">Typed data · PT/EN i18n · localStorage</div>
        <div class="arrow">↓</div>
        <div class="box">Static Vercel deployment · no server</div>
      </div>
      <p class="tiny" style="margin-top:18px;max-width:550px;">No backend, no auth, no live prices. The result is reproducible from the visible assumptions and does not use generative AI for arithmetic.</p>
    </div>
    <div>
      <div class="label">Design tokens</div>
      <div class="grid cols4" style="margin-top:10px;gap:8px;">
        <div><div class="swatch" style="background:#F7F6F2;"></div><div class="tiny" style="margin-top:4px;">Canvas</div></div>
        <div><div class="swatch" style="background:#151A19;"></div><div class="tiny" style="margin-top:4px;">Ink</div></div>
        <div><div class="swatch" style="background:#F04A28;"></div><div class="tiny" style="margin-top:4px;">Signal</div></div>
        <div><div class="swatch" style="background:#D8E8EE;"></div><div class="tiny" style="margin-top:4px;">Pale blue</div></div>
      </div>
      <div class="hr" style="margin-top:18px;padding-top:14px;"><div class="label">Type</div><div class="tiny" style="margin-top:6px;">Barlow Condensed · IBM Plex Sans · IBM Plex Mono</div></div>
      <div class="hr" style="margin-top:14px;padding-top:14px;"><div class="label">Category colours</div><div class="tiny" style="margin-top:6px;">Teal · apricot · violet · sage · rose · gold</div></div>
      <div style="margin-top:18px;background:#151A19;color:#F7F6F2;padding:14px 18px;font-family:'Barlow';font-size:22px;text-transform:uppercase;">One accent. No dashboard.</div>
    </div>
  </div>
  <div style="position:absolute;left:72px;right:72px;bottom:74px;border-top:1px solid #DAD8CF;padding-top:14px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
    <div><div class="label">Static</div><div class="tiny" style="margin-top:4px;">Built once, shipped as static files. No server to operate.</div></div>
    <div><div class="label">Deterministic</div><div class="tiny" style="margin-top:4px;">The engine answers every number; AI does not calculate at runtime.</div></div>
    <div><div class="label">Local-first</div><div class="tiny" style="margin-top:4px;">Plans and reminders stay in the browser. No account required.</div></div>
  </div>
''', 6))

# 7 Calculation
slides.append(slide(f'''
  {top('CALCULATION & GUARDRAILS')}
  <h1 style="font-size:64px;margin-top:44px;">Every number is reproducible.</h1>
  <div class="grid cols2" style="margin-top:24px;gap:38px;">
    <div>
      <div class="card" style="margin-bottom:10px;"><div class="label">Recurring</div><div class="num" style="font-size:18px;margin-top:6px;">(original − alternative) × frequency</div></div>
      <div class="card" style="margin-bottom:10px;"><div class="label">One-time</div><div class="num" style="font-size:18px;margin-top:6px;">original − alternative · once</div></div>
      <div class="card" style="margin-bottom:10px;"><div class="label">Projection</div><div class="num" style="font-size:18px;margin-top:6px;">monthly × months + one-time</div></div>
      <div class="card"><div class="label">Horizon</div><div class="num" style="font-size:18px;margin-top:6px;">first whole month at the target</div></div>
    </div>
    <div>
      <div class="label">Guardrails</div>
      <div class="checklist" style="margin-top:12px;">
        <div><b>Overlaps:</b> meals, snacks, nights, subscriptions, repairs, trips. One per group.</div>
        <div><b>One-time:</b> counted once, never as monthly income.</div>
        <div><b>Games of chance:</b> a fixed conservative estimate: €40 → €20 = €20/month. No inputs, no invented average.</div>
        <div><b>€0*:</b> a metaphor for a cost covered by swaps. Not a discount, not a free trip.</div>
        <div><b>No claims:</b> no medical promises, weight loss or avoided emissions.</div>
      </div>
      <div style="margin-top:16px;background:#D8E8EE;padding:12px 16px;font-family:'Barlow';font-size:20px;font-weight:600;text-transform:uppercase;">The receipt shows the formula. The result is not generated.</div>
    </div>
  </div>
  <div class="grid cols3" style="margin-top:22px;gap:16px;">
    <div class="card"><div class="label">Paris · Balanced</div><div class="stat" style="font-size:30px;margin-top:5px;">6 months</div><div class="tiny">€122 / month · €650 target</div></div>
    <div class="card"><div class="label">Douro · Balanced</div><div class="stat" style="font-size:30px;margin-top:5px;">5 months</div><div class="tiny">€87 / month · €420 target</div></div>
    <div class="card"><div class="label">Iceland · Balanced</div><div class="stat" style="font-size:30px;margin-top:5px;">21 months</div><div class="tiny">€94 / month · €1,900 target</div></div>
  </div>
''', 7))

# 8 Swaps
slides.append(slide(f'''
  {top('THE SWAPS CATALOGUE')}
  <h1 style="font-size:64px;margin-top:42px;">25 changes. 6 categories. One plan.</h1>
  <div class="grid cols2" style="margin-top:22px;gap:22px;">
    <div class="frame" style="height:310px;"><img src="{img('swaps.jpg')}" alt="Swaps catalogue"></div>
    <div class="frame" style="height:310px;"><img src="{img('swaps-games.jpg')}" alt="Games of chance and betting"></div>
  </div>
  <div class="grid cols4" style="margin-top:20px;gap:18px;">
    <div><div class="step-num">01</div><div class="tiny" style="margin-top:4px;">An independent catalogue, not a destination dashboard.</div></div>
    <div><div class="step-num">02</div><div class="tiny" style="margin-top:4px;">Select swaps, see monthly and one-time savings separately.</div></div>
    <div><div class="step-num">03</div><div class="tiny" style="margin-top:4px;">Carry the selection into any destination plan.</div></div>
    <div><div class="step-num">04</div><div class="tiny" style="margin-top:4px;">Games of chance with a fixed €20/month estimate; roadmap cards are not interactive.</div></div>
  </div>
  <div style="position:absolute;left:72px;right:72px;bottom:74px;border-top:2px solid #F04A28;padding-top:14px;font-family:'Barlow';font-size:30px;font-weight:600;text-transform:uppercase;">The swaps are the actions. The destination is the reward.</div>
''', 8))

# 9 Process
slides.append(slide(f'''
  {top('PROCESS WITH AI')}
  <h1 style="font-size:64px;margin-top:42px;">The repository is the evidence.</h1>
  <div class="grid cols4" style="margin-top:28px;gap:18px;">
    <div class="card"><div class="stat">110+</div><div class="stat-label">conventional commits</div></div>
    <div class="card"><div class="stat">20+</div><div class="stat-label">merged PRs</div></div>
    <div class="card"><div class="stat">42</div><div class="stat-label">tests</div></div>
    <div class="card"><div class="stat">3 + 3</div><div class="stat-label">agents + skills</div></div>
  </div>
  <div class="grid cols2" style="margin-top:26px;gap:36px;">
    <div>
      <div class="label">Two real AI failures</div>
      <div class="checklist" style="margin-top:12px;">
        <div><b>1 · Overlap:</b> the engine summed two swaps from the same group. A test failed with two lines instead of one. Fixed the engine, not the test.</div>
        <div><b>2 · i18n:</b> a literal return type made the EN dictionary invalid. <span class="num">tsc</span> caught it; widened the type and added a parity test.</div>
      </div>
    </div>
    <div>
      <div class="label">The process</div>
      <div class="checklist" style="margin-top:12px;">
        <div><b>CLAUDE.md:</b> stack, rules, design guardrails and non-negotiables.</div>
        <div><b>Iterations:</b> requirement → prompt → plan → test → commit.</div>
        <div><b>Evidence:</b> ITERATIONS, PROMPTS, DECISIONS, TESTING.</div>
        <div><b>Delivery:</b> CI on every PR; Vercel on main.</div>
      </div>
    </div>
  </div>
  <div style="position:absolute;left:72px;right:72px;bottom:74px;border-top:2px solid #F04A28;padding-top:16px;font-family:'Barlow';font-size:36px;font-weight:600;text-transform:uppercase;line-height:.95;">AI wrote code. Tests and commits made it accountable.</div>
''', 9))

# 10 Close
slides.append(slide(f'''
  {top('LIMITATIONS & NEXT', True)}
  <h1 style="font-size:66px;margin-top:46px;max-width:1100px;">What this is. What it is not.</h1>
  <div class="grid cols2" style="margin-top:26px;gap:36px;">
    <div>
      <div class="label">Honest limits</div>
      <div class="checklist" style="margin-top:12px;">
        <div>Illustrative planning targets, not verified prices</div>
        <div>No accounts, backend, booking or payments</div>
        <div>No live fares, maps or push notifications</div>
        <div>No actual savings tracking; every unlock is a simulation</div>
        <div>Calendar reminders are .ics files, opened by the user</div>
      </div>
    </div>
    <div>
      <div class="label">Next</div>
      <div class="checklist" style="margin-top:12px;">
        <div>Savings tracking against real balances</div>
        <div>Create your own swap · add your dream trip</div>
        <div>Accounts, sync and shared plans</div>
        <div>End-to-end tests and pre-rendering</div>
      </div>
    </div>
  </div>
  <div style="position:absolute;left:72px;right:72px;top:400px;font-family:'Barlow';font-size:76px;font-weight:600;text-transform:uppercase;line-height:.84;color:rgba(247,246,242,.10);">The world<br>is the reward.</div>
  <div style="position:absolute;left:72px;right:72px;bottom:78px;border-top:1px solid rgba(247,246,242,.2);padding-top:20px;">
    <div style="font-family:'Barlow';font-size:44px;font-weight:600;text-transform:uppercase;line-height:.88;">Small changes.<br><span class="accent">Bigger journeys.</span></div>
    <div class="tiny" style="margin-top:12px;">Thank you. · tripswap-home.vercel.app · github.com/blamelas/tripswap</div>
  </div>
''', 10, True))

html = f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{"".join(slides)}</body></html>'
html_path = TMP / 'deck.html'
html_path.write_text(html, encoding='utf-8')

pngs = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1600, 'height': 900}, device_scale_factor=1)
    page.goto(html_path.as_uri(), wait_until='networkidle')
    page.evaluate('document.fonts.ready')
    page.wait_for_timeout(500)
    for i in range(1, 11):
        png = TMP / f'slide-{i:02d}.png'
        page.locator(f'#s{i}').screenshot(path=str(png))
        pngs.append(png)
    browser.close()

# PDF
images = [Image.open(png).convert('RGB') for png in pngs]
images[0].save(OUT / 'TripSwap-Defense.pdf', save_all=True, append_images=images[1:], resolution=120)

# PPTX
prs = Presentation()
prs.slide_width = Inches(13.3333)
prs.slide_height = Inches(7.5)
notes = [
    'TripSwap — small changes, bigger journeys. A travel discovery product funded by everyday swaps.',
    'The problem: desire exists, but there is no plan with a timeline. Budget tools lose the person.',
    'The idea: the destination is the reward. €0* is a metaphor; the planning target stays visible.',
    'The flow: discover, swap, unlock. Example: Paris, Balanced, 3 swaps, €122/month, 6 months.',
    'Scope: a four-story MVP with a sharp boundary. No backend, booking or live prices.',
    'Architecture: static React/TypeScript app, deterministic engine, localStorage, Vercel. Design is photography-led.',
    'Calculation and guardrails: recurring and one-time savings, overlap groups, a fixed €20/month games estimate, honest €0*.',
    'The swaps catalogue: 25 changes, 6 categories, carry-over into plans, fixed games estimate, roadmap cards.',
    'Process: CLAUDE.md, agents, skills, iterations, 42 tests and two real AI failures caught by checks.',
    'Limits and next steps. Thank you.',
]
for i, png in enumerate(pngs):
    slide_obj = prs.slides.add_slide(prs.slide_layouts[6])
    slide_obj.shapes.add_picture(str(png), 0, 0, width=prs.slide_width, height=prs.slide_height)
    slide_obj.notes_slide.notes_text_frame.text = notes[i]
prs.core_properties.title = 'TripSwap — Final Project'
prs.core_properties.author = 'Bruno Lamelas'
prs.core_properties.subject = 'Building Digital Products with Generative AI — EUNICE Network 2026'
prs.save(OUT / 'TripSwap-Defense.pptx')

print('Built', len(prs.slides), 'slides')
print(OUT / 'TripSwap-Defense.pdf')
print(OUT / 'TripSwap-Defense.pptx')

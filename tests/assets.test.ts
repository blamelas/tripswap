import { statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { DESTINATIONS } from '../src/data/destinations'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

describe('destination photography', () => {
  it('ships a local, non-trivial image for every destination', () => {
    for (const destination of DESTINATIONS) {
      const relative = destination.image.replace(/^\/+/, '')
      const file = path.join(root, 'public', relative)
      const stats = statSync(file)
      expect(stats.size, `${destination.id} -> ${file}`).toBeGreaterThan(20_000)
    }
  })

  it('never points a destination at an external image host', () => {
    for (const destination of DESTINATIONS) {
      expect(destination.image.startsWith('/images/'), destination.id).toBe(true)
    }
  })
})

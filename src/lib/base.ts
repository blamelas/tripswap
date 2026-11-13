/**
 * Prefixes a public asset with Vite's base path. Keeps `/images/x.webp`
 * working both at the domain root and under a GitHub Pages project subpath.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\/+/, '')}`
}

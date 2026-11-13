import { useEffect, useRef, useState } from 'react'

export function useAnimatedNumber(value: number, duration = 600): number {
  const [display, setDisplay] = useState(value)
  const [reduce] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const fromRef = useRef(value)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (reduce) {
      fromRef.current = value
      return
    }

    const from = fromRef.current
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(from + (value - from) * eased)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = value
      }
    }

    frameRef.current = requestAnimationFrame(tick)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      fromRef.current = value
    }
  }, [value, duration, reduce])

  return reduce ? value : display
}

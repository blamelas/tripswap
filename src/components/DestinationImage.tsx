import { useState } from 'react'
import { cn } from '../lib/cn'

interface DestinationImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

/**
 * Local photography with a graceful failure state. While the image loads, the
 * parent's neutral background acts as the placeholder; if it fails, the caption
 * keeps the layout and the meaning intact.
 */
export function DestinationImage({
  src,
  alt,
  className,
  priority = false,
}: DestinationImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex h-full w-full items-end bg-gradient-to-br from-paper-2 via-line to-paper-2 p-6',
          className,
        )}
      >
        <span className="font-display text-lg leading-tight text-ink-soft">{alt}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={1600}
      height={1067}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('h-full w-full object-cover', className)}
    />
  )
}

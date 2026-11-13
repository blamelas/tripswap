import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useI18n } from '../i18n/context'

interface NotFoundProps {
  title?: string
  body?: string
}

export function NotFound({ title, body }: NotFoundProps) {
  const { copy } = useI18n()

  return (
    <div className="page flex min-h-[70vh] flex-col justify-center py-20">
      <p className="font-display text-[clamp(6rem,18vw,14rem)] font-semibold leading-[0.65] text-line">
        404
      </p>
      <h1 className="mt-4 max-w-2xl text-[clamp(2.4rem,5vw,4rem)] leading-[0.86] text-ink">
        {title ?? copy.notFound.title}
      </h1>
      <p className="mt-4 max-w-md text-[13px] leading-relaxed text-muted">
        {body ?? copy.notFound.body}
      </p>
      <Link to="/" className="btn-primary mt-8 w-fit">
        <ArrowLeft className="h-3.5 w-3.5" />
        {copy.notFound.cta}
      </Link>
    </div>
  )
}

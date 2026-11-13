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
    <div className="page flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="eyebrow">{copy.notFound.eyebrow}</p>
      <h1 className="mt-4 max-w-xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-tight text-ink">
        {title ?? copy.notFound.title}
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
        {body ?? copy.notFound.body}
      </p>
      <Link to="/" className="btn-primary mt-8">
        <ArrowLeft className="h-4 w-4" />
        {copy.notFound.cta}
      </Link>
    </div>
  )
}

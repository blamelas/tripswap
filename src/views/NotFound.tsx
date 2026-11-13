import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface NotFoundProps {
  title?: string
  body?: string
}

export function NotFound({
  title = 'Página não encontrada.',
  body = 'O endereço pode estar incompleto. O catálogo continua à espera.',
}: NotFoundProps) {
  return (
    <div className="page flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="eyebrow">Erro 404</p>
      <h1 className="mt-4 max-w-xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-tight text-ink">
        {title}
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">{body}</p>
      <Link to="/" className="btn-primary mt-8">
        <ArrowLeft className="h-4 w-4" />
        Voltar ao catálogo
      </Link>
    </div>
  )
}

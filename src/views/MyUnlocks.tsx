import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, BookmarkX, Compass } from 'lucide-react'
import type { SavedPlan } from '../types'
import { getDestination } from '../data/destinations'
import { getHabit } from '../data/habits'
import { calculatePlan } from '../lib/calc'
import { formatDate, formatEUR, formatMonths } from '../lib/format'
import { DestinationImage } from '../components/DestinationImage'
import { clearPlans, readPlans, removePlan } from '../lib/storage'
import { ProgressRail } from '../components/ProgressRail'

interface PlanView {
  saved: SavedPlan
  name: string
  country: string
  image: string
  target: number
  monthly: number
  months: number | null
  progress: number
  unlocked: boolean
}

function buildViews(plans: SavedPlan[]): PlanView[] {
  return plans.flatMap((saved) => {
    const destination = getDestination(saved.destinationId)
    if (!destination) return []
    const habits = saved.habitIds
      .map((id) => getHabit(id))
      .filter((habit) => habit !== undefined)
    const plan = calculatePlan(destination.budget, habits, saved.horizonMonths)
    return [
      {
        saved,
        name: destination.name,
        country: destination.country,
        image: destination.image,
        target: destination.budget,
        monthly: plan.monthly,
        months: plan.monthsToTarget,
        progress: plan.progress,
        unlocked: plan.unlocked,
      },
    ]
  })
}

export function MyUnlocks() {
  const [plans, setPlans] = useState<SavedPlan[]>(() => readPlans())
  const views = buildViews(plans)

  function handleRemove(destinationId: string) {
    setPlans(removePlan(destinationId))
  }

  function handleClear() {
    const confirmed = window.confirm(
      'Remover todos os planos guardados neste dispositivo? Esta ação não pode ser anulada.',
    )
    if (!confirmed) return
    clearPlans()
    setPlans([])
  }

  return (
    <div className="page py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
        <div>
          <p className="eyebrow">Passo 3 — desbloquear</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,5.5vw,4rem)] leading-none tracking-tightest text-ink">
            Os meus unlocks
          </h1>
          <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-ink-soft">
            Planos guardados apenas neste dispositivo. São simulações de poupança, não
            reservas nem dinheiro já poupado.
          </p>
        </div>
        {views.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] uppercase tracking-[0.14em] text-muted underline decoration-line underline-offset-4 hover:text-clay"
          >
            Limpar tudo
          </button>
        )}
      </div>

      {views.length === 0 ? (
        <div className="mt-16 flex flex-col items-start border border-dashed border-line p-8 sm:p-14">
          <Compass className="h-8 w-8 text-clay" aria-hidden="true" />
          <h2 className="mt-5 max-w-md font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight text-ink">
            Ainda não guardaste nenhum futuro.
          </h2>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted">
            Abre um destino, escolhe as trocas que farias e guarda o plano. Fica aqui, à
            espera de ser revisto.
          </p>
          <Link to="/" className="btn-primary mt-7">
            Explorar destinos
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5">
          {views.map((view) => (
            <article
              key={view.saved.destinationId}
              className="grid gap-5 border border-line bg-white/50 p-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:p-5"
            >
              <Link
                to={`/destination/${view.saved.destinationId}${
                  view.saved.habitIds.length
                    ? `?h=${view.saved.habitIds.join(',')}`
                    : ''
                }`}
                className="relative block aspect-[4/3] overflow-hidden bg-paper-2 sm:aspect-auto sm:h-full"
                aria-label={`Abrir ${view.name}`}
              >
                <DestinationImage
                  src={view.image}
                  alt={`${view.name}, ${view.country}`}
                  className="transition-transform duration-700 hover:scale-[1.03]"
                />
              </Link>

              <div className="flex min-w-0 flex-col">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
                      {view.country} · guardado a {formatDate(view.saved.savedAt)}
                    </p>
                    <h2 className="mt-1 font-display text-2xl leading-tight text-ink">
                      {view.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                      Prazo estimado
                    </p>
                    <p className="nums mt-1 text-lg text-ink">
                      {formatMonths(view.months)}
                    </p>
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-3 border-y border-line py-3">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">
                      Objetivo
                    </dt>
                    <dd className="nums mt-0.5 text-[13px] text-ink">
                      {formatEUR(view.target)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">
                      Por mês
                    </dt>
                    <dd className="nums mt-0.5 text-[13px] text-ink">
                      {formatEUR(view.monthly)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">
                      Trocas
                    </dt>
                    <dd className="nums mt-0.5 text-[13px] text-ink">
                      {view.saved.habitIds.length}
                    </dd>
                  </div>
                </dl>

                <ProgressRail
                  className="mt-4"
                  progress={view.progress}
                  unlocked={view.unlocked}
                  label={`Progresso de ${view.name}`}
                />

                <div className="mt-auto flex flex-wrap items-center gap-4 pt-5">
                  <Link
                    to={`/destination/${view.saved.destinationId}${
                      view.saved.habitIds.length
                        ? `?h=${view.saved.habitIds.join(',')}`
                        : ''
                    }`}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-clay"
                  >
                    Abrir plano
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(view.saved.destinationId)}
                    className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-muted hover:text-ink"
                  >
                    <BookmarkX className="h-3.5 w-3.5" />
                    Remover
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

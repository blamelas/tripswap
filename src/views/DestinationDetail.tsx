import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Info, MapPin } from 'lucide-react'
import type { Destination, Habit } from '../types'
import { HABITS, getHabit } from '../data/habits'
import { DESTINATION_CATEGORY_LABELS, getDestination } from '../data/destinations'
import { calculatePlan } from '../lib/calc'
import { sanitizeSelection, toggleHabit } from '../lib/conflicts'
import { getPresets } from '../lib/presets'
import { formatEUR, formatMonths } from '../lib/format'
import { withBase } from '../lib/base'
import { getPlan, savePlan } from '../lib/storage'
import { HabitSelector } from '../components/HabitSelector'
import { FundingPanel, MobileFundingBar } from '../components/FundingPanel'
import { planState } from '../lib/planState'
import { PresetButtons } from '../components/PresetButtons'
import { ProjectionChart } from '../components/ProjectionChart'
import { UnlockReceipt } from '../components/UnlockReceipt'
import { NotFound } from './NotFound'

function UnlockMoment({
  destination,
  months,
  saved,
  onSave,
}: {
  destination: Destination
  months: number
  saved: boolean
  onSave: () => void
}) {
  return (
    <section className="relative mt-6 overflow-hidden border border-clay/30 bg-clay-soft/50 p-6 sm:p-8 animate-rise">
      <div className="relative z-10">
        <p className="eyebrow text-clay-dark">Desbloqueado na simulação</p>
        <p className="mt-3 max-w-xl font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight text-ink">
          Este plano coloca {destination.name} ao teu alcance em aproximadamente{' '}
          {formatMonths(months)}.
        </p>
        <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-ink-soft">
          Ainda não poupaste nada — isto é o plano, não o saldo. Guarda-o para voltares
          quando quiseres rever as trocas.
        </p>
        <button type="button" onClick={onSave} className="btn-primary mt-5">
          {saved ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          {saved ? 'Plano guardado' : 'Guardar este futuro'}
        </button>
      </div>
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border border-clay/20"
        aria-hidden="true"
      />
    </section>
  )
}

function DetailView({ destination }: { destination: Destination }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialIds = useMemo(() => {
    const raw = searchParams.get('h')
    if (!raw) return []
    return sanitizeSelection(raw.split(',').filter(Boolean), HABITS)
    // Read the deep link once; later changes are owned by local state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [selected, setSelected] = useState<string[]>(initialIds)
  const [horizon, setHorizon] = useState(12)
  const [saved, setSaved] = useState(() => Boolean(getPlan(destination.id)))

  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    if (selected.length > 0) next.set('h', selected.join(','))
    else next.delete('h')

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true })
    }
  }, [selected, searchParams, setSearchParams])

  const selectedHabits = useMemo(
    () =>
      selected
        .map((id) => getHabit(id))
        .filter((habit): habit is Habit => habit !== undefined),
    [selected],
  )

  const plan = useMemo(
    () => calculatePlan(destination.budget, selectedHabits, horizon),
    [destination.budget, selectedHabits, horizon],
  )

  const presets = useMemo(
    () =>
      getPresets(destination).map((preset) => {
        const habits = preset.habitIds
          .map((id) => getHabit(id))
          .filter((habit): habit is Habit => habit !== undefined)
        return {
          ...preset,
          months: calculatePlan(destination.budget, habits, horizon).monthsToTarget,
        }
      }),
    [destination, horizon],
  )

  const state = planState(plan)

  function handleToggle(habit: Habit) {
    setSelected((previous) => toggleHabit(previous, habit, HABITS))
  }

  function handleSave() {
    savePlan({
      destinationId: destination.id,
      habitIds: selected,
      horizonMonths: horizon,
      savedAt: new Date().toISOString(),
    })
    setSaved(true)
  }

  return (
    <article className="pb-28 lg:pb-16">
      <div className="relative h-[52vh] min-h-[340px] max-h-[580px] w-full overflow-hidden bg-ink">
        <img
          src={withBase(destination.image)}
          alt={destination.imageAlt}
          width={1600}
          height={1067}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/20" />

        <div className="page absolute inset-x-0 top-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-paper/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-paper"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Catálogo
          </Link>
        </div>

        <div className="page absolute inset-x-0 bottom-0 pb-8 text-paper">
          <p className="text-[10px] uppercase tracking-[0.2em] text-paper/75">
            {DESTINATION_CATEGORY_LABELS[destination.category]} · {destination.duration}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.95] tracking-tightest">
            {destination.name}
          </h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-paper/80">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {destination.country}
            </span>
            <span aria-hidden="true" className="text-paper/40">·</span>
            <span>Objetivo de planeamento: {formatEUR(destination.budget)}</span>
            <span aria-hidden="true" className="text-paper/40">·</span>
            <span>financiado por trocas</span>
          </p>
        </div>
      </div>

      <div className="page grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_368px] lg:gap-14">
        <div className="min-w-0">
          <p className="max-w-2xl font-display text-[clamp(1.35rem,2.4vw,1.75rem)] leading-snug text-ink">
            {destination.quote}
          </p>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
            {destination.description}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-5 sm:grid-cols-4">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.14em] text-muted">Partida</dt>
              <dd className="mt-1 text-[13px] text-ink">{destination.departureCity}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.14em] text-muted">Viajantes</dt>
              <dd className="nums mt-1 text-[13px] text-ink">{destination.travelers}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.14em] text-muted">Noites</dt>
              <dd className="nums mt-1 text-[13px] text-ink">{destination.nights}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.14em] text-muted">Inclui</dt>
              <dd className="mt-1 text-[13px] text-ink">{destination.includes.join(', ')}</dd>
            </div>
          </dl>

          <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-muted">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Objetivo ilustrativo de planeamento. Não é um preço verificado, uma tarifa
            atual nem uma oferta de viagem. O TripSwap não reserva viagens.
          </p>

          <div className="mt-10">
            <PresetButtons
              presets={presets}
              activeIds={selected}
              onApply={(habitIds) => setSelected(habitIds)}
            />
          </div>

          <div className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink/15 pb-4">
              <div>
                <p className="eyebrow">Passo 2 — trocar</p>
                <h2 className="mt-2 font-display text-[clamp(1.7rem,3vw,2.3rem)] leading-none text-ink">
                  O que mudarias?
                </h2>
              </div>
              <p className="max-w-xs text-[12px] leading-relaxed text-muted">
                Escolhe só o que farias mesmo. Nada aqui é obrigatório e nada é enviado
                para fora do teu dispositivo.
              </p>
            </div>
            <div className="mt-8">
              <HabitSelector selectedIds={selected} onToggle={handleToggle} />
            </div>
          </div>

          {plan.monthsToTarget !== null && (
            <div className="mt-12">
              <p className="eyebrow">A projeção</p>
              <div className="mt-3 border border-line bg-white/50 p-5">
                <ProjectionChart
                  monthly={plan.monthly}
                  oneTime={plan.oneTime}
                  target={plan.target}
                  horizonMonths={horizon}
                  monthsToTarget={plan.monthsToTarget}
                  unlocked={plan.unlocked}
                />
              </div>
            </div>
          )}

          {state === 'unlocked' && plan.monthsToTarget !== null && (
            <UnlockMoment
              destination={destination}
              months={plan.monthsToTarget}
              saved={saved}
              onSave={handleSave}
            />
          )}

          <div className="mt-12">
            <UnlockReceipt plan={plan} />
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <FundingPanel
              plan={plan}
              horizon={horizon}
              onHorizon={setHorizon}
              saved={saved}
              onSave={handleSave}
            />
            <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-muted">
              Passo 3 — desbloquear
            </p>
          </div>
        </aside>
      </div>

      <MobileFundingBar plan={plan} saved={saved} onSave={handleSave} />
    </article>
  )
}

export function DestinationDetail() {
  const { id } = useParams()
  const destination = id ? getDestination(id) : undefined

  if (!destination) {
    return (
      <NotFound
        title="Este destino não existe."
        body="O link pode estar incompleto. Volta ao catálogo e escolhe uma experiência."
      />
    )
  }

  return <DetailView destination={destination} />
}

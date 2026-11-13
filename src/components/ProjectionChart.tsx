import { projectedSavings } from '../lib/calc'
import { useI18n } from '../i18n/context'

interface ProjectionChartProps {
  monthly: number
  oneTime: number
  target: number
  horizonMonths: number
  monthsToTarget: number | null
  unlocked: boolean
}

const W = 340
const H = 150
const PAD_X = 6
const PAD_TOP = 12
const PAD_BOTTOM = 22

export function ProjectionChart({
  monthly,
  oneTime,
  target,
  horizonMonths,
  monthsToTarget,
  unlocked,
}: ProjectionChartProps) {
  const { copy, fmt } = useI18n()
  const maxValue = Math.max(target, projectedSavings(monthly, oneTime, horizonMonths), 1)
  const yMax = maxValue * 1.08
  const usableW = W - PAD_X * 2
  const usableH = H - PAD_TOP - PAD_BOTTOM

  const x = (month: number) => PAD_X + (month / Math.max(1, horizonMonths)) * usableW
  const y = (value: number) => PAD_TOP + usableH - (value / yMax) * usableH

  const points = Array.from({ length: horizonMonths + 1 }, (_, month) => {
    const value = projectedSavings(monthly, oneTime, month)
    return `${x(month).toFixed(1)},${y(value).toFixed(1)}`
  }).join(' ')

  const targetY = y(target)
  const crossing =
    monthsToTarget !== null && monthsToTarget <= horizonMonths ? monthsToTarget : null
  const horizonText = fmt.months(horizonMonths)

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={copy.projection.aria(fmt.eur(target), horizonText)}
      >
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={PAD_X}
            x2={W - PAD_X}
            y1={PAD_TOP + usableH * ratio}
            y2={PAD_TOP + usableH * ratio}
            stroke="#DCD2C1"
            strokeWidth="1"
            strokeDasharray="2 5"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <line
          x1={PAD_X}
          x2={W - PAD_X}
          y1={targetY}
          y2={targetY}
          stroke="#AC4620"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          vectorEffect="non-scaling-stroke"
        />
        <text
          x={W - PAD_X}
          y={targetY - 6}
          textAnchor="end"
          className="fill-clay text-[9px] uppercase"
          style={{ letterSpacing: '0.12em' }}
        >
          {copy.common.target}
        </text>

        <polyline
          points={points}
          fill="none"
          stroke={unlocked ? '#AC4620' : '#151310'}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <circle
          cx={x(0)}
          cy={y(oneTime)}
          r="3"
          fill="#151310"
          stroke="#F6F2E9"
          strokeWidth="1.5"
        />

        {crossing !== null && (
          <>
            <circle
              cx={x(crossing)}
              cy={y(projectedSavings(monthly, oneTime, crossing))}
              r="5"
              fill="#AC4620"
              stroke="#F6F2E9"
              strokeWidth="2"
            />
            <line
              x1={x(crossing)}
              x2={x(crossing)}
              y1={y(projectedSavings(monthly, oneTime, crossing))}
              y2={H - PAD_BOTTOM}
              stroke="#AC4620"
              strokeWidth="1"
              strokeDasharray="2 3"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}

        <line
          x1={PAD_X}
          x2={W - PAD_X}
          y1={H - PAD_BOTTOM}
          y2={H - PAD_BOTTOM}
          stroke="#151310"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        <text x={PAD_X} y={H - 6} className="fill-muted text-[9px]">
          {copy.common.today}
        </text>
        <text x={W - PAD_X} y={H - 6} textAnchor="end" className="fill-muted text-[9px]">
          {horizonText}
        </text>
      </svg>

      <p className="mt-2 text-[11px] leading-relaxed text-muted">{copy.projection.note}</p>
    </div>
  )
}

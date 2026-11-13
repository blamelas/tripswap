#!/usr/bin/env node
/**
 * Prints docs/ASSUMPTIONS.md from the single source of truth.
 * Requires Node 22+ for native TypeScript type stripping.
 *
 *   node scripts/assumptions.mjs > docs/ASSUMPTIONS.md
 */
import { HABITS } from '../src/data/habits.ts'
import { DESTINATIONS } from '../src/data/destinations.ts'

const labels = {
  mobility: 'Mobilidade',
  food: 'Comida e bebida',
  entertainment: 'Lazer e subscrições',
  shopping: 'Compras e reparações',
  wellbeing: 'Bem-estar',
}

const eur = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

function derived(habit) {
  if (habit.kind === 'recurring') {
    return Math.round(((habit.originalCost - habit.alternativeCost) * habit.monthlyFrequency + Number.EPSILON) * 100) / 100
  }
  return Math.round((habit.originalCost - habit.alternativeCost + Number.EPSILON) * 100) / 100
}

let failures = 0

const lines = []
lines.push('# Pressupostos de cálculo')
lines.push('')
lines.push(
  '> Documento gerado a partir de `src/data/habits.ts` e `src/data/destinations.ts` com',
)
lines.push('> `node scripts/assumptions.mjs > docs/ASSUMPTIONS.md`. Não editar à mão.')
lines.push('')
lines.push(
  'Todos os valores são **ilustrativos e fictícios**, definidos para este projeto. Não são médias de mercado, não são preços verificados e não representam uma oferta de viagem.',
)
lines.push('')
lines.push('## Fórmulas')
lines.push('')
lines.push('- **Recorrente:** `(custo original − alternativa) × frequência mensal`')
lines.push('- **Pontual:** `custo original − alternativa`, aplicado uma única vez')
lines.push('- **Projeção:** `poupança mensal × meses + poupanças pontuais`')
lines.push('- **Prazo:** o primeiro mês inteiro em que a projeção atinge o objetivo')
lines.push('')
lines.push('## Trocas')
lines.push('')
lines.push('| ID | Categoria | Tipo | Original | Alternativa | Freq. | Poupança | Grupo |')
lines.push('|---|---|---|---:|---:|---:|---:|---|')

for (const habit of HABITS) {
  const computed = derived(habit)
  const ok = Math.abs(computed - habit.saving) < 1e-9
  if (!ok) {
    failures += 1
    console.error(`MISMATCH ${habit.id}: stored=${habit.saving} computed=${computed}`)
  }
  lines.push(
    `| \`${habit.id}\` | ${labels[habit.category]} | ${habit.kind === 'recurring' ? 'mensal' : 'pontual'} | ${eur.format(
      habit.originalCost,
    )} | ${eur.format(habit.alternativeCost)} | ${
      habit.kind === 'recurring' ? `${habit.monthlyFrequency}/mês` : '—'
    } | ${eur.format(habit.saving)} | ${habit.exclusiveGroup ?? '—'} |`,
  )
}

lines.push('')
lines.push('## Destinos')
lines.push('')
lines.push('| ID | Destino | Partida | Viajantes | Noites | Objetivo | Inclui |')
lines.push('|---|---|---|---:|---:|---:|---|')

for (const destination of DESTINATIONS) {
  lines.push(
    `| \`${destination.id}\` | ${destination.name} (${destination.country}) | ${destination.departureCity} | ${destination.travelers} | ${destination.nights} | ${eur.format(
      destination.budget,
    )} | ${destination.includes.join(', ')} |`,
  )
}

lines.push('')
lines.push('## Grupos de sobreposição')
lines.push('')
lines.push(
  'Duas trocas do mesmo grupo assumem a mesma despesa. Só uma pode estar ativa; escolher outra substitui a anterior.',
)
lines.push('')

const groups = new Map()
for (const habit of HABITS) {
  if (!habit.exclusiveGroup) continue
  const list = groups.get(habit.exclusiveGroup) ?? []
  list.push(habit.title)
  groups.set(habit.exclusiveGroup, list)
}

for (const [group, items] of groups) {
  lines.push(`- **${group}**: ${items.join(' · ')}`)
}

lines.push('')
lines.push(`Total: ${HABITS.length} trocas, ${DESTINATIONS.length} destinos.`)

process.stdout.write(`${lines.join('\n')}\n`)

if (failures > 0) {
  console.error(`\n${failures} mismatch(es) between stored savings and formulas.`)
  process.exit(1)
}

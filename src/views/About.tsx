import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, Minus } from 'lucide-react'
import { DESTINATIONS } from '../data/destinations'
import { HABITS } from '../data/habits'
import { formatEUR } from '../lib/format'

const PILLARS = [
  {
    title: 'Gastar melhor',
    body: 'Menos transporte desnecessário, subscrições esquecidas e compras por impulso. O dinheiro fica para o que realmente queres.',
  },
  {
    title: 'Viver melhor',
    body: 'Mais caminhada, mais cozinha em casa, menos tabaco e menos bebidas açucaradas. Mudanças voluntárias, sem promessas médicas.',
  },
  {
    title: 'Consumir melhor',
    body: 'Reparar antes de substituir, reutilizar o que já existe e reduzir desperdício. Menos coisas, mais vida.',
  },
]

const NOT_DONE = [
  'Não reserva viagens nem consulta tarifas em tempo real.',
  'Não pede salário, extratos bancários ou dados pessoais.',
  'Não guarda nada num servidor: os planos ficam no teu navegador.',
  'Não usa IA generativa para fazer aritmética.',
  'Não faz promessas de saúde, perda de peso ou emissões evitadas.',
  'Não apresenta valores ilustrativos como preços verificados.',
]

export function About() {
  const budgetRange = DESTINATIONS.map((destination) => destination.budget)
  const minBudget = Math.min(...budgetRange)
  const maxBudget = Math.max(...budgetRange)

  return (
    <div className="pb-16">
      <section className="page pt-12 lg:pt-16">
        <p className="eyebrow">Sobre o TripSwap</p>
        <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,5.5vw,4.4rem)] leading-[1.02] tracking-tightest text-ink">
          Não é uma app de finanças.
          <br />
          É uma forma de ver o que{' '}
          <em className="italic text-clay">as pequenas decisões pagam.</em>
        </h1>
        <p className="mt-6 max-w-2xl text-[15.5px] leading-relaxed text-ink-soft">
          O TripSwap parece uma plataforma de descoberta de viagens — e é. Por baixo,
          faz outra coisa: mostra que mudar hábitos comuns pode financiar experiências
          que pareciam distantes. Sem orçamentos, sem folhas de cálculo e sem culpa.
        </p>
      </section>

      <section className="page mt-16" aria-labelledby="pilares">
        <div className="border-b border-line pb-4">
          <p className="eyebrow">Os três pilares</p>
          <h2 id="pilares" className="mt-2 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none text-ink">
            O que está por baixo do catálogo
          </h2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <div key={pillar.title} className="border border-line bg-white/50 p-6">
              <span className="nums text-[11px] text-clay">0{index + 1}</span>
              <h3 className="mt-3 font-display text-2xl text-ink">{pillar.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{pillar.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-[11px] leading-relaxed text-muted">
          Os benefícios além do dinheiro aparecem como etiquetas qualitativas. Não são
          alegações médicas, nem métricas de saúde, nem evidência científica.
        </p>
      </section>

      <section className="page mt-16" aria-labelledby="calculo">
        <div className="grid gap-10 border border-line bg-white/50 p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="eyebrow">Transparência</p>
            <h2 id="calculo" className="mt-2 font-display text-[clamp(1.8rem,3.2vw,2.5rem)] leading-tight text-ink">
              Como o número aparece
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
              O motor é determinístico e vive no browser. Cada troca tem um custo
              original, uma alternativa e uma frequência. O resultado é sempre
              reproduzível a partir das premissas visíveis.
            </p>

            <div className="mt-6 space-y-3">
              <div className="border-l-2 border-clay pl-4">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                  Poupança recorrente
                </p>
                <p className="nums mt-1 text-[13px] text-ink">
                  (custo original − alternativa) × frequência mensal
                </p>
              </div>
              <div className="border-l-2 border-clay pl-4">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                  Poupança pontual
                </p>
                <p className="nums mt-1 text-[13px] text-ink">
                  custo evitado − custo da alternativa · uma única vez
                </p>
              </div>
              <div className="border-l-2 border-clay pl-4">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                  Projeção
                </p>
                <p className="nums mt-1 text-[13px] text-ink">
                  poupança mensal × meses + poupanças pontuais
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="eyebrow">Sem duplicar</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
              Duas trocas que assumem a mesma despesa nunca são somadas. Cada grupo de
              sobreposição — refeições, snacks, noites, subscrições, reparações,
              deslocações — só aceita uma escolha de cada vez.
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
              Quando escolhes outra opção do mesmo grupo, a anterior é substituída, e a
              interface explica porquê.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Refeições', 'Snacks', 'Noites', 'Subscrições', 'Reparações', 'Deslocações'].map(
                (group) => (
                  <span
                    key={group}
                    className="border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-muted"
                  >
                    {group}
                  </span>
                ),
              )}
            </div>
            <p className="mt-5 text-[11px] leading-relaxed text-muted">
              {HABITS.length} trocas no catálogo, {DESTINATIONS.length} destinos,{' '}
              {formatEUR(minBudget)} a {formatEUR(maxBudget)} de objetivo ilustrativo.
            </p>
          </div>
        </div>
      </section>

      <section className="page mt-16" aria-labelledby="zero">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="border border-clay/30 bg-clay-soft/40 p-6 sm:p-8">
            <p className="font-display text-[clamp(3rem,7vw,4.6rem)] leading-none text-clay">
              €0<span className="align-top text-xl">*</span>
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-clay-dark">
              uma metáfora, não um preço
            </p>
          </div>
          <div>
            <h2 id="zero" className="font-display text-[clamp(1.7rem,3vw,2.3rem)] leading-tight text-ink">
              A viagem não é gratuita.
            </h2>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-ink-soft">
              O <strong>€0*</strong> descreve um cenário: o custo do destino seria
              coberto pelo dinheiro que deixarias de gastar nas trocas selecionadas. O
              orçamento real continua visível em cada cartão e em cada detalhe.
            </p>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-ink-soft">
              Não há desconto, nem preço anterior, nem oferta. Não há reserva. Há um
              plano.
            </p>
          </div>
        </div>
      </section>

      <section className="page mt-16" aria-labelledby="limites">
        <div className="border-b border-line pb-4">
          <p className="eyebrow">Limites explícitos</p>
          <h2 id="limites" className="mt-2 font-display text-[clamp(1.8rem,3.2vw,2.4rem)] leading-none text-ink">
            O que este projeto não faz
          </h2>
        </div>
        <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {NOT_DONE.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-soft">
              <Minus className="mt-1 h-3.5 w-3.5 shrink-0 text-clay" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-start gap-2.5 border border-line bg-white/50 p-4 text-[12px] leading-relaxed text-muted">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden="true" />
          <p>
            Os orçamentos assumem uma cidade de partida (Lisboa), dois viajantes e o
            âmbito indicado em cada destino. São valores fictícios de planeamento, não
            médias de mercado. A moeda é o euro e os cálculos usam aritmética simples,
            validada por testes.
          </p>
        </div>
      </section>

      <section className="page mt-16" aria-labelledby="creditos">
        <div className="border-b border-line pb-4">
          <p className="eyebrow">Fotografia</p>
          <h2 id="creditos" className="mt-2 font-display text-xl text-ink">
            Créditos das imagens
          </h2>
        </div>
        <ul className="mt-5 grid gap-2 text-[11.5px] leading-relaxed text-muted sm:grid-cols-2">
          {DESTINATIONS.map((destination) => (
            <li key={destination.id}>
              <span className="text-ink">{destination.name}:</span> {destination.imageCredit}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] leading-relaxed text-muted">
          Fotografias locais, servidas a partir do próprio site, para que a demonstração
          funcione sem rede externa. As licenças completas estão em{' '}
          <code className="bg-paper-2 px-1 py-0.5 text-[10.5px]">docs/CREDITS.md</code>.
        </p>
      </section>

      <section className="page mt-16">
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
          <div>
            <p className="eyebrow">Small changes. Bigger journeys.</p>
            <p className="mt-2 max-w-md font-display text-xl leading-snug text-ink">
              Chega de poupar para nada. Escolhe uma viagem e vê o que já podes mudar.
            </p>
          </div>
          <Link to="/" className="btn-primary">
            Ver o catálogo
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

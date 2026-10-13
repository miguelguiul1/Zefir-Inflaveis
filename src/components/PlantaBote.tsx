import { useId } from 'react'
import type { Modelo } from '../content/catalogo'

interface Props {
  modelo: Modelo
  /** horizontal: proa para a direita. vertical: proa para cima. */
  orientacao?: 'horizontal' | 'vertical'
  /** espessura do traço, em cm do desenho */
  traco?: number
  className?: string
}

const FOLGA = 34 // cm de folga acima/abaixo para a linha de centro e as cotas

/**
 * Planta (vista de cima) esquemática de um bote. Unidade do desenho: cm.
 * O comprimento total vai de x=0 (popa) a x=L (proa): é o que fica em escala.
 */
export function PlantaBote({ modelo, orientacao = 'horizontal', traco = 1.6, className = '' }: Props) {
  const uid = useId().replace(/:/g, '')
  const L = Math.round(modelo.comprimentoM * 100)
  const B = Math.round(modelo.desenho.bocaM * 100)
  const t = modelo.desenho.tuboM * 100
  const r = t / 2
  const [c0, c1] = modelo.desenho.console

  // linha de centro do tubo (U com proa em bico arredondado)
  const tubo = [
    `M ${r} ${r}`,
    `L ${L * 0.58} ${r}`,
    `C ${L * 0.86} ${r} ${L - r} ${B * 0.26} ${L - r} ${B / 2}`,
    `C ${L - r} ${B * 0.74} ${L * 0.86} ${B - r} ${L * 0.58} ${B - r}`,
    `L ${r} ${B - r}`,
  ].join(' ')

  // borda interna do casco (convés), acompanhando o tubo por dentro
  const ri = t + traco * 2
  const conves = [
    `M ${r * 1.2} ${ri}`,
    `L ${L * 0.56} ${ri}`,
    `C ${L * 0.8} ${ri} ${L - t - r} ${B * 0.34} ${L - t - r * 0.6} ${B / 2}`,
    `C ${L - t - r} ${B * 0.66} ${L * 0.8} ${B - ri} ${L * 0.56} ${B - ri}`,
    `L ${r * 1.2} ${B - ri}`,
    'Z',
  ].join(' ')

  const consoleY = B * 0.33
  const consoleH = B * 0.34

  const vertical = orientacao === 'vertical'
  const viewBox = vertical
    ? `${-FOLGA} 0 ${B + FOLGA * 2} ${L}`
    : `0 ${-FOLGA} ${L} ${B + FOLGA * 2}`
  // vertical: (x, y) -> (y, L - x)  => proa no topo
  const transform = vertical ? `translate(0 ${L}) rotate(-90)` : undefined

  return (
    <svg
      viewBox={viewBox}
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMinYMid meet"
    >
      <defs>
        <pattern id={`hachura-${uid}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth={traco * 0.7} />
        </pattern>
      </defs>
      <g transform={transform} fill="none" stroke="currentColor" strokeWidth={traco}>
        {/* linha de centro (traço-ponto) */}
        <line
          x1={-FOLGA * 0.6}
          y1={B / 2}
          x2={L + FOLGA * 0.6}
          y2={B / 2}
          strokeWidth={traco * 0.6}
          strokeDasharray={`${traco * 14} ${traco * 4} ${traco * 2} ${traco * 4}`}
          className="opacity-60"
        />
        {/* casco/convés */}
        <path d={conves} className="fill-papel" />
        {/* espelho de popa */}
        <line x1={r * 1.2} y1={ri} x2={r * 1.2} y2={B - ri} strokeWidth={traco * 1.4} />
        {/* tubo: traço grosso da cor da tinta + traço interno da cor do papel = contorno duplo */}
        <path d={tubo} strokeWidth={t} strokeLinecap="round" strokeLinejoin="round" />
        <path
          d={tubo}
          strokeWidth={t - traco * 2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-papel"
        />
        {/* console central */}
        <rect
          x={L * c0}
          y={consoleY}
          width={L * (c1 - c0)}
          height={consoleH}
          fill={`url(#hachura-${uid})`}
          rx={traco * 2}
        />
      </g>
    </svg>
  )
}

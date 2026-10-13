interface Props {
  metros: number
  orientacao?: 'horizontal' | 'vertical'
  className?: string
}

/**
 * Régua em metros. Traço a cada 10 cm, maior a cada 50 cm, número a cada metro.
 * Horizontal: ocupa 100% da largura da trilha (0 m à esquerda).
 * Vertical: ocupa 100% da altura (0 m embaixo, como a popa do bote).
 */
export function Regua({ metros, orientacao = 'horizontal', className = '' }: Props) {
  const passos = metros * 10
  const marcas = Array.from({ length: passos + 1 }, (_, i) => i)
  const numeros = Array.from({ length: metros + 1 }, (_, i) => i)
  const vertical = orientacao === 'vertical'

  if (vertical) {
    return (
      <div className={`relative ${className}`} aria-hidden="true">
        <svg
          className="absolute inset-y-0 right-0 h-full w-3"
          viewBox={`0 0 10 ${passos}`}
          preserveAspectRatio="none"
        >
          <line x1="10" y1="0" x2="10" y2={passos} stroke="currentColor" vectorEffect="non-scaling-stroke" />
          {marcas.map((i) => (
            <line
              key={i}
              x1={i % 10 === 0 ? 0 : i % 5 === 0 ? 4 : 7}
              x2="10"
              y1={passos - i}
              y2={passos - i}
              stroke="currentColor"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        {numeros.map((m) => (
          <span
            key={m}
            className="ficha absolute right-4 -translate-y-1/2 text-[0.6875rem] leading-none"
            style={{ top: `${100 - (m / metros) * 100}%` }}
          >
            {m}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg className="absolute inset-x-0 bottom-0 h-3 w-full" viewBox={`0 0 ${passos} 10`} preserveAspectRatio="none">
        <line x1="0" y1="10" x2={passos} y2="10" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        {marcas.map((i) => (
          <line
            key={i}
            x1={i}
            x2={i}
            y1={i % 10 === 0 ? 0 : i % 5 === 0 ? 4 : 7}
            y2="10"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {numeros.map((m) => (
        <span
          key={m}
          className="ficha absolute top-0 -translate-x-1/2 text-xs leading-none first:translate-x-0"
          style={{ left: `${(m / metros) * 100}%` }}
        >
          {m === 0 ? '0 m' : m}
        </span>
      ))}
    </div>
  )
}

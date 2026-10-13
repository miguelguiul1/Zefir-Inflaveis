import type { ReactNode } from 'react'
import { PROPOSTA } from '../config'

/**
 * Marca TODO-CONFIRMAR. Só existe no modo proposta; no modo público não
 * renderiza nada (o dado não confirmado some do site).
 */
export function Todo({ children, className = '' }: { children?: ReactNode; className?: string }) {
  if (!PROPOSTA) return null
  return (
    <span className={`ficha inline text-[0.8125rem] leading-snug text-tinta ${className}`}>
      <mark className="bg-todo px-1 py-px font-medium tracking-tight text-tinta">TODO-CONFIRMAR</mark>
      {children ? <span className="bg-todo-claro px-1 box-decoration-clone">{children}</span> : null}
    </span>
  )
}

/** Bloco só do modo proposta. */
export function SoProposta({ children }: { children: ReactNode }) {
  return PROPOSTA ? <>{children}</> : null
}

import { PROPOSTA } from '../config'

export function FaixaProposta() {
  if (!PROPOSTA) return null
  return (
    <div className="ficha bg-tinta px-4 py-1.5 text-center text-[0.6875rem] text-papel md:text-xs" role="note">
      protótipo de proposta · itens marcados <span className="bg-todo px-1 text-tinta">TODO-CONFIRMAR</span>{' '}
      dependem de confirmação da Zefir
    </div>
  )
}

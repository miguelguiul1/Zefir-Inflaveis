import { PROPOSTA } from '../config'
import { foto, type FotoId } from '../content/fotos'

interface Props {
  id: FotoId
  sizes: string
  className?: string
  /** Inclua `relative` ou `absolute`: o selo "provisória" se posiciona por ele. */
  /** true só para a foto da entrada (acima da dobra). */
  prioridade?: boolean
  /** false quando a seção mostra o aviso "provisória" por conta própria */
  selo?: boolean
}

export function Foto({ id, sizes, className = '', prioridade = false, selo = true }: Props) {
  const f = foto(id)
  if (!f) return null
  return (
    <figure className={`m-0 ${className}`}>
      <picture>
        <source type="image/avif" srcSet={f.avif} sizes={sizes} />
        <source type="image/webp" srcSet={f.webp} sizes={sizes} />
        <img
          src={f.padrao}
          alt={f.alt}
          width={f.largura}
          height={f.altura}
          loading={prioridade ? 'eager' : 'lazy'}
          fetchPriority={prioridade ? 'high' : 'auto'}
          decoding="async"
          className="block h-full w-full object-cover"
        />
      </picture>
      {PROPOSTA && f.provisoria && selo ? (
        <figcaption className="ficha absolute right-3 bottom-3 bg-todo px-2 py-0.5 text-xs text-tinta">
          provisória (foto do site atual)
        </figcaption>
      ) : null}
    </figure>
  )
}

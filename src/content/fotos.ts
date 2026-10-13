import gerado from './fotos.gerado.json'

/**
 * Fotos processadas por `npm run fotos:processar` (sem EXIF/GPS, AVIF + WebP).
 * Só entra aqui foto marcada como `aprovada: true` em fotos/fontes.json depois
 * de revisão humana (pessoas, placas, rostos, marcas de terceiros).
 */
export interface FotoGerada {
  alt: string
  largura: number
  altura: number
  provisoria: boolean
  avif: string
  webp: string
  padrao: string
}

export type FotoId = 'entrada' | 'uso' | 'fabrica'

const fotos = gerado as Partial<Record<string, FotoGerada>>

export function foto(id: FotoId): FotoGerada | undefined {
  return fotos[id]
}

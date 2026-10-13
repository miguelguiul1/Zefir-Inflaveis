import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const ORIGINAIS = path.join(RAIZ, 'fotos', 'originais')

export function lerFontes() {
  const { itens } = JSON.parse(fs.readFileSync(path.join(RAIZ, 'fotos', 'fontes.json'), 'utf8'))
  for (const i of itens) {
    if (!/^[\w.-]+$/.test(i.arquivo)) throw new Error(`nome de arquivo inválido: ${i.arquivo}`)
  }
  return itens
}

/** Converte região em fração (0..1) para pixels, presa dentro da imagem. */
export function regiao(r, largura, altura) {
  const left = Math.max(0, Math.min(largura - 1, Math.round(r.x * largura)))
  const top = Math.max(0, Math.min(altura - 1, Math.round(r.y * altura)))
  const width = Math.max(1, Math.min(largura - left, Math.round(r.w * largura)))
  const height = Math.max(1, Math.min(altura - top, Math.round(r.h * altura)))
  return { left, top, width, height }
}

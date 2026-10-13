import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const ORIGINAIS = path.join(RAIZ, 'fotos', 'originais')
export const CONVERTIDAS = path.join(RAIZ, 'fotos', 'convertidas')
export const MINIATURAS = path.join(RAIZ, 'fotos', 'revisao')
const FONTES = path.join(RAIZ, 'fotos', 'fontes.json')

export const LARGURAS = [640, 1280, 1920]
export const EXTENSOES = /\.(jpe?g|png|webp|avif|tiff?|heic)$/i

export function lerFontesCompleto() {
  return JSON.parse(fs.readFileSync(FONTES, 'utf8'))
}

export function gravarFontes(dados) {
  fs.writeFileSync(FONTES, JSON.stringify(dados, null, 2) + '\n')
}

/** Só nome de arquivo simples: sem barra, sem começar com ponto (nada de ".."). */
export const nomeSeguro = (arquivo) => /^(?!\.)[\p{L}\p{N} _.()-]+$/u.test(arquivo)

export function lerFontes() {
  const { itens } = lerFontesCompleto()
  for (const i of itens) {
    if (!nomeSeguro(i.arquivo)) throw new Error(`nome de arquivo inválido: ${i.arquivo}`)
  }
  return itens
}

/** Caminho do arquivo de origem: fotos/originais/ ou, para o logo, public/. */
export function caminhoOrigem(item) {
  return item.local === 'public' ? path.join(RAIZ, 'public', item.arquivo) : path.join(ORIGINAIS, item.arquivo)
}

/** Nome seguro para arquivos derivados. */
export function slug(arquivo) {
  return arquivo
    .replace(EXTENSOES, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Converte região em fração (0..1) para pixels, presa dentro da imagem. */
export function regiao(r, largura, altura) {
  const left = Math.max(0, Math.min(largura - 1, Math.round(r.x * largura)))
  const top = Math.max(0, Math.min(altura - 1, Math.round(r.y * altura)))
  const width = Math.max(1, Math.min(largura - left, Math.round(r.w * largura)))
  const height = Math.max(1, Math.min(altura - top, Math.round(r.h * altura)))
  return { left, top, width, height }
}

/** O que o arquivo original carrega de metadado. */
export async function inspecionar(arquivo) {
  const m = await sharp(arquivo).metadata()
  const exif = m.exif ? m.exif.toString('latin1') : ''
  return {
    largura: m.autoOrient?.width ?? m.width,
    altura: m.autoOrient?.height ?? m.height,
    formato: m.format,
    exif: Boolean(m.exif),
    // tag GPS do EXIF (0x8825) ou texto "GPS" no bloco
    gps: Boolean(m.exif) && (exif.includes('\x25\x88') || exif.includes('\x88\x25') || /GPS/.test(exif)),
    xmp: Boolean(m.xmp),
    iptc: Boolean(m.iptc),
  }
}

/**
 * Lê a imagem, aplica a orientação e devolve um PNG em memória SEM nenhum
 * metadado. Desfoca só as regiões recebidas (nunca decide sozinho o que borrar).
 */
export async function limpar(arquivo, regioes = []) {
  const { data, info } = await sharp(arquivo).rotate().removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const camadas = []
  for (const r of regioes) {
    const reg = regiao(r, info.width, info.height)
    const borrado = await sharp(data, { raw: info })
      .extract(reg)
      .blur(Math.max(12, Math.round(Math.min(reg.width, reg.height) / 4)))
      .png()
      .toBuffer()
    camadas.push({ input: borrado, left: reg.left, top: reg.top })
  }
  let img = sharp(data, { raw: info })
  if (camadas.length) img = img.composite(camadas)
  return { png: await img.png().toBuffer(), largura: info.width, altura: info.height }
}

/** Gera AVIF e WebP em LARGURAS (sem ampliar) e confere que não sobrou metadado. */
export async function converter(png, largura, dirSaida, nome) {
  fs.mkdirSync(dirSaida, { recursive: true })
  const larguras = LARGURAS.filter((l) => l <= largura)
  if (larguras.length === 0) larguras.push(largura)
  const saidas = []
  for (const w of larguras) {
    const redim = sharp(png).resize({ width: w })
    for (const [ext, opcoes] of [
      ['avif', { quality: 55 }],
      ['webp', { quality: 78 }],
    ]) {
      const destino = path.join(dirSaida, `${nome}-${w}.${ext}`)
      await redim.clone()[ext](opcoes).toFile(destino)
      const m = await sharp(destino).metadata()
      if (m.exif || m.xmp || m.iptc) throw new Error(`${destino}: ainda tem metadado`)
      saidas.push({ ext, w, destino })
    }
  }
  return saidas
}

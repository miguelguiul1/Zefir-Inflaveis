// Processa as fotos APROVADAS de fotos/fontes.json:
// - aplica a orientação e REMOVE todo metadado (EXIF, GPS, XMP, ICC fica sRGB)
// - desfoca as regiões listadas (placas, rostos de terceiros, marcas)
// - gera AVIF e WebP em 640/1280/1920 px
// - grava src/content/fotos.gerado.json, que o site lê
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { ORIGINAIS, RAIZ, lerFontes, regiao } from './_comum.mjs'

const LARGURAS = [640, 1280, 1920]
const USOS = new Set(['entrada', 'uso', 'fabrica'])
const manifesto = {}

for (const item of lerFontes()) {
  if (item.somenteAmostra || !item.usoNoSite) continue
  if (!USOS.has(item.usoNoSite)) throw new Error(`usoNoSite inválido: ${item.usoNoSite}`)
  if (item.aprovada !== true) {
    console.log(`pulada (não aprovada): ${item.arquivo}`)
    continue
  }
  if (!item.alt || item.alt.startsWith('TODO')) throw new Error(`${item.arquivo}: falta o texto alternativo (alt)`)
  const origem = path.join(ORIGINAIS, item.arquivo)
  if (!fs.existsSync(origem)) throw new Error(`${item.arquivo}: rode antes npm run fotos:baixar`)

  // 1) orientação aplicada e pixels crus: daqui em diante não existe mais metadado
  const { data, info } = await sharp(origem).rotate().removeAlpha().raw().toBuffer({ resolveWithObject: true })
  let base = sharp(data, { raw: info })

  // 2) desfoque por região
  const camadas = []
  for (const r of item.desfocar ?? []) {
    const reg = regiao(r, info.width, info.height)
    const borrado = await sharp(data, { raw: info })
      .extract(reg)
      .blur(Math.max(12, Math.round(Math.min(reg.width, reg.height) / 4)))
      .png()
      .toBuffer()
    camadas.push({ input: borrado, left: reg.left, top: reg.top })
  }
  if (camadas.length) base = sharp(await base.composite(camadas).png().toBuffer())
  const limpa = await base.png().toBuffer()

  // 3) saídas
  const pasta = item.provisoria ? 'img/provisorias' : 'img'
  const dirSaida = path.join(RAIZ, 'public', pasta)
  fs.mkdirSync(dirSaida, { recursive: true })
  const nome = item.usoNoSite
  const avif = []
  const webp = []
  for (const w of LARGURAS.filter((l) => l <= info.width).concat(info.width < LARGURAS[0] ? [info.width] : [])) {
    const redim = sharp(limpa).resize({ width: w })
    await redim.clone().avif({ quality: 55 }).toFile(path.join(dirSaida, `${nome}-${w}.avif`))
    await redim.clone().webp({ quality: 78 }).toFile(path.join(dirSaida, `${nome}-${w}.webp`))
    avif.push(`/${pasta}/${nome}-${w}.avif ${w}w`)
    webp.push(`/${pasta}/${nome}-${w}.webp ${w}w`)
  }
  // 4) conferência: nenhum metadado na saída
  for (const f of fs.readdirSync(dirSaida).filter((f) => f.startsWith(`${nome}-`))) {
    const m = await sharp(path.join(dirSaida, f)).metadata()
    if (m.exif || m.xmp || m.iptc) throw new Error(`${f}: ainda tem metadado`)
  }
  const maior = webp.at(-1).split(' ')[0]
  manifesto[nome] = {
    alt: item.alt,
    largura: info.width,
    altura: info.height,
    provisoria: Boolean(item.provisoria),
    avif: avif.join(', '),
    webp: webp.join(', '),
    padrao: maior,
  }
  console.log(`ok  ${item.arquivo} -> ${pasta}/${nome}-*.{avif,webp} (${camadas.length} região(ões) desfocada(s))`)
}

fs.writeFileSync(path.join(RAIZ, 'src', 'content', 'fotos.gerado.json'), JSON.stringify(manifesto, null, 2) + '\n')
console.log(`manifesto: ${Object.keys(manifesto).length} foto(s)`)

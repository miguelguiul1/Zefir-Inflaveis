// Publica as fotos APROVADAS de fotos/fontes.json:
// - remove todo metadado (EXIF, GPS, XMP) e aplica a orientação
// - desfoca as regiões anotadas em "desfocar" (placas, rostos, marcas)
// - gera AVIF e WebP em 640/1280/1920 px em public/img/
// - grava src/content/fotos.gerado.json, que o site lê
// Foto não aprovada nunca vai para public/.
import fs from 'node:fs'
import path from 'node:path'
import { RAIZ, caminhoOrigem, converter, lerFontes, limpar } from './_comum.mjs'

const USOS = new Set(['entrada', 'uso', 'fabrica'])
const manifesto = {}
const usados = new Set()

for (const item of lerFontes()) {
  if (item.somenteAmostra) continue
  if (item.aprovada !== true) {
    console.log(`fora do site (não aprovada): ${item.arquivo}`)
    continue
  }
  if (!USOS.has(item.usoNoSite)) throw new Error(`${item.arquivo}: usoNoSite deve ser entrada, uso ou fabrica`)
  if (usados.has(item.usoNoSite)) throw new Error(`${item.arquivo}: já existe foto aprovada para "${item.usoNoSite}"`)
  if (!item.alt || item.alt.startsWith('TODO')) throw new Error(`${item.arquivo}: falta o texto alternativo (alt)`)
  const origem = caminhoOrigem(item)
  if (!fs.existsSync(origem)) throw new Error(`${item.arquivo}: arquivo não está em fotos/originais/`)
  usados.add(item.usoNoSite)

  const { png, largura, altura } = await limpar(origem, item.desfocar ?? [])
  const pasta = item.provisoria ? 'img/provisorias' : 'img'
  const nome = item.usoNoSite
  const saidas = await converter(png, largura, path.join(RAIZ, 'public', pasta), nome)
  const srcset = (ext) =>
    saidas
      .filter((s) => s.ext === ext)
      .map((s) => `/${pasta}/${nome}-${s.w}.${ext} ${s.w}w`)
      .join(', ')
  const maior = saidas.filter((s) => s.ext === 'webp').at(-1)
  manifesto[nome] = {
    alt: item.alt,
    largura,
    altura,
    provisoria: Boolean(item.provisoria),
    avif: srcset('avif'),
    webp: srcset('webp'),
    padrao: `/${pasta}/${nome}-${maior.w}.webp`,
  }
  console.log(`no site: ${item.arquivo} -> ${pasta}/${nome}-* (${item.desfocar?.length ?? 0} região(ões) desfocada(s))`)
}

fs.writeFileSync(path.join(RAIZ, 'src', 'content', 'fotos.gerado.json'), JSON.stringify(manifesto, null, 2) + '\n')
console.log(`manifesto: ${Object.keys(manifesto).length} foto(s) no site`)

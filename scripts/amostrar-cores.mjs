// Amostra as cores do logo (public/logo-original.png), das fotos em
// fotos/originais/ e das regiões "amostras" de fotos/fontes.json.
// Para cada cor grava arquivo e coordenada (pixel do original) em
// docs/paleta-amostrada.md. Os tokens em src/index.css são escolhidos a partir
// dessa tabela, citando a mesma origem.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { EXTENSOES, ORIGINAIS, RAIZ, caminhoOrigem, lerFontes, regiao } from './_comum.mjs'

const hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

/** Cores dominantes, cada uma com um pixel representativo (coordenada no original). */
async function dominantes(arquivo, n = 8) {
  const meta = await sharp(arquivo).rotate().metadata()
  const larguraOrig = meta.autoOrient?.width ?? meta.width
  const alturaOrig = meta.autoOrient?.height ?? meta.height
  const { data, info } = await sharp(arquivo)
    .rotate()
    .resize(160, 160, { fit: 'inside', kernel: 'nearest' }) // nearest: só cores que existem no arquivo
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const baldes = new Map()
  let total = 0
  for (let p = 0, i = 0; i < data.length; p++, i += info.channels) {
    if (data[i + 3] < 200) continue // ignora transparência do logo
    const k = (data[i] >> 4) * 256 + (data[i + 1] >> 4) * 16 + (data[i + 2] >> 4)
    const b = baldes.get(k) ?? { soma: [0, 0, 0], n: 0, pixels: [] }
    b.soma = b.soma.map((s, j) => s + data[i + j])
    b.n++
    b.pixels.push(p)
    baldes.set(k, b)
    total++
  }
  return [...baldes.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, n)
    .map((b) => {
      const media = b.soma.map((s) => s / b.n)
      // pixel real mais perto da média do balde: é a cor registrada, e a coordenada dela
      let melhor = b.pixels[0]
      let dist = Infinity
      for (const p of b.pixels) {
        const i = p * info.channels
        const d = (data[i] - media[0]) ** 2 + (data[i + 1] - media[1]) ** 2 + (data[i + 2] - media[2]) ** 2
        if (d < dist) [dist, melhor] = [d, p]
      }
      const i = melhor * info.channels
      const x = Math.round(((melhor % info.width) + 0.5) * (larguraOrig / info.width))
      const y = Math.round((Math.floor(melhor / info.width) + 0.5) * (alturaOrig / info.height))
      return { hex: hex([data[i], data[i + 1], data[i + 2]]), pct: ((b.n / total) * 100).toFixed(1), x, y }
    })
}

async function mediaRegiao(arquivo, r) {
  const meta = await sharp(arquivo).rotate().metadata()
  const reg = regiao(r, meta.autoOrient?.width ?? meta.width, meta.autoOrient?.height ?? meta.height)
  const { channels } = await sharp(arquivo).rotate().extract(reg).stats()
  return { hex: hex(channels.slice(0, 3).map((c) => c.mean)), reg }
}

// fontes: o que está listado + qualquer foto solta em fotos/originais/
const itens = lerFontes()
const soltas = fs.existsSync(ORIGINAIS)
  ? fs.readdirSync(ORIGINAIS).filter((f) => EXTENSOES.test(f) && !itens.some((i) => i.arquivo === f))
  : []
const fontes = [...itens, ...soltas.map((arquivo) => ({ arquivo }))]

const linhas = [
  '# Paleta amostrada',
  '',
  'Gerado por `npm run cores`. Coordenadas em pixels do arquivo original (x, y a partir do canto superior esquerdo).',
  '',
]
const faltando = []
for (const item of fontes) {
  const arq = caminhoOrigem(item)
  const rotulo = item.local === 'public' ? `public/${item.arquivo}` : `fotos/originais/${item.arquivo}`
  if (!fs.existsSync(arq)) {
    faltando.push(rotulo)
    continue
  }
  linhas.push(`## ${rotulo}`, '', '| cor | % dos pixels | coordenada |', '|---|---|---|')
  for (const c of await dominantes(arq)) linhas.push(`| \`${c.hex}\` | ${c.pct} | (${c.x}, ${c.y}) |`)
  for (const a of item.amostras ?? []) {
    const m = await mediaRegiao(arq, a)
    linhas.push(
      `| \`${m.hex}\` | amostra "${a.nome ?? 'sem nome'}" (média) | região x ${m.reg.left}–${m.reg.left + m.reg.width}, y ${m.reg.top}–${m.reg.top + m.reg.height} |`,
    )
  }
  linhas.push('')
}
if (faltando.length) linhas.push('## Arquivos que não estão na pasta', '', ...faltando.map((f) => `- ${f}`), '')

fs.writeFileSync(path.join(RAIZ, 'docs', 'paleta-amostrada.md'), linhas.join('\n'))
console.log(linhas.join('\n'))

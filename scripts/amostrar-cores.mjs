// Amostra as cores do logo, das fotos e das amostras de tecido (fotos/originais/)
// e grava docs/paleta-amostrada.md. Depois copie as cores escolhidas para os
// tokens em src/index.css, com a fonte de cada uma.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { ORIGINAIS, RAIZ, lerFontes, regiao } from './_comum.mjs'

const hex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

async function dominantes(arquivo, n = 6) {
  const { data, info } = await sharp(arquivo).rotate().resize(96, 96, { fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const baldes = new Map()
  let total = 0
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] < 200) continue // ignora transparência do logo
    const k = (data[i] >> 4) * 256 + (data[i + 1] >> 4) * 16 + (data[i + 2] >> 4)
    const b = baldes.get(k) ?? { r: 0, g: 0, b: 0, n: 0 }
    b.r += data[i]; b.g += data[i + 1]; b.b += data[i + 2]; b.n++
    baldes.set(k, b)
    total++
  }
  return [...baldes.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, n)
    .map((b) => ({ hex: hex(b.r / b.n, b.g / b.n, b.b / b.n), pct: ((b.n / total) * 100).toFixed(1) }))
}

async function media(arquivo, r) {
  const img = sharp(arquivo).rotate()
  const { width, height } = await img.metadata()
  const { channels } = await sharp(arquivo).rotate().extract(regiao(r, width, height)).stats()
  return hex(channels[0].mean, channels[1].mean, channels[2].mean)
}

const linhas = ['# Paleta amostrada', '', `Gerado por \`npm run cores\` em ${new Date().toISOString().slice(0, 10)}.`, '']
for (const item of lerFontes()) {
  const arq = path.join(ORIGINAIS, item.arquivo)
  if (!fs.existsSync(arq)) {
    linhas.push(`- ${item.arquivo}: não baixado (rode npm run fotos:baixar)`, '')
    continue
  }
  linhas.push(`## ${item.arquivo}`, '', '| cor | % dos pixels |', '|---|---|')
  for (const c of await dominantes(arq)) linhas.push(`| \`${c.hex}\` | ${c.pct} |`)
  for (const a of item.amostras ?? []) linhas.push(`| \`${await media(arq, a)}\` | amostra "${a.nome ?? 'sem nome'}" (média da região) |`)
  linhas.push('')
}
fs.writeFileSync(path.join(RAIZ, 'docs', 'paleta-amostrada.md'), linhas.join('\n'))
console.log(linhas.join('\n'))

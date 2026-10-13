// Confere o contraste WCAG de cada par texto/fundo usado no site.
// Lê os tokens direto de src/index.css (@theme), então roda de novo sozinho
// quando a paleta mudar. Grava docs/contraste.md e sai com erro se algum par
// ficar abaixo do mínimo AA.
import fs from 'node:fs'
import path from 'node:path'
import { RAIZ } from './_comum.mjs'

const css = fs.readFileSync(path.join(RAIZ, 'src', 'index.css'), 'utf8')
const tema = css.slice(css.indexOf('@theme'), css.indexOf('}', css.indexOf('@theme')))
const tokens = Object.fromEntries([...tema.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]))

// Painel escuro atrás do texto sobre foto (.painel-foto em src/index.css).
const pelicula = Number(/\.painel-foto\s*{[^}]*var\(--color-noite\)\s*(\d+)%/.exec(css)?.[1] ?? 0) / 100

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
const mistura = (frente, alfa, fundo) => rgb(frente).map((v, i) => v * alfa + rgb(fundo)[i] * (1 - alfa))
function lum(h) {
  return rgb(h)
    .map((v) => v / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0)
}
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
/** "papel" | "papel/80" sobre um fundo já resolvido -> hex */
function cor(nome, fundo) {
  const [t, a] = nome.split('/')
  if (!tokens[t]) throw new Error(`token desconhecido: ${t}`)
  return a ? hex(mistura(tokens[t], Number(a) / 100, fundo)) : tokens[t]
}

// [texto, fundo, onde, tamanho] — tamanho "normal" exige 4,5:1; "grande" (>= 24px, ou 18,66px negrito) e "ui" exigem 3:1
const PARES = [
  ['tinta', 'papel', 'texto principal, títulos, fichas', 'normal'],
  ['tinta-2', 'papel', 'texto secundário, rótulos da ficha', 'normal'],
  ['marca', 'papel', 'bote selecionado, "ficha aberta", avisos de erro, legenda da entrada', 'normal'],
  ['tinta', 'papel-2', 'Para que serve, Revendedores, prévia da mensagem', 'normal'],
  ['tinta-2', 'papel-2', 'Para que serve (texto secundário)', 'normal'],
  ['papel', 'tinta', 'botão Enviar pelo WhatsApp, faixa protótipo, link Pular', 'normal'],
  ['papel', 'marca', 'botão Enviar pelo WhatsApp com o mouse em cima (inclui o contador "2 itens")', 'normal'],
  ['papel', 'noite', 'A fábrica', 'normal'],
  ['papel/80', 'noite', 'A fábrica (texto secundário)', 'normal'],
  ['tinta', 'todo', 'marca TODO-CONFIRMAR (só proposta)', 'normal'],
  ['tinta', 'todo-claro', 'explicação do TODO-CONFIRMAR (só proposta)', 'normal'],
  ['marca', 'papel', 'contorno de foco sobre papel', 'ui'],
  ['marca-viva', 'noite', 'contorno de foco sobre fundo escuro', 'ui'],
  ['tinta', 'papel', 'borda dos botões de escolha', 'ui'],
]

const linhas = []
let falhou = false
const registrar = (texto, fundo, onde, tamanho, a, b) => {
  const r = razao(a, b)
  const min = tamanho === 'normal' ? 4.5 : 3
  const ok = r >= min
  if (!ok) falhou = true
  linhas.push(`| ${texto} \`${a}\` | ${fundo} \`${b}\` | ${r.toFixed(2)}:1 | ${min}:1 | ${ok ? 'passa' : '**FALHA**'} | ${onde} |`)
}
for (const [texto, fundo, onde, tamanho] of PARES) {
  const b = cor(fundo, '#ffffff')
  registrar(texto, fundo, onde, tamanho, cor(texto, b), b)
}
// Texto claro sobre foto: pior caso é um trecho branco da foto debaixo da película.
if (pelicula > 0) {
  const sobreBranco = hex(mistura(tokens.noite, pelicula, '#ffffff'))
  registrar('papel', `painel noite ${Math.round(pelicula * 100)}% sobre foto branca`, 'texto da entrada sobre foto (pior caso)', 'normal', tokens.papel, sobreBranco)
}

const doc = [
  '# Contraste (WCAG 2.1 AA)',
  '',
  'Gerado por `npm run contraste` a partir dos tokens de `src/index.css`.',
  '',
  '| texto | fundo | razão | mínimo | resultado | onde |',
  '|---|---|---|---|---|---|',
  ...linhas,
  '',
].join('\n')
fs.writeFileSync(path.join(RAIZ, 'docs', 'contraste.md'), doc)
console.log(doc)
process.exitCode = falhou ? 1 : 0

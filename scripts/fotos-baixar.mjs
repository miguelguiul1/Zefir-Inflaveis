// Baixa as imagens listadas em fotos/fontes.json para fotos/originais/ (fora do git).
// Só aceita https://zefir.com.br. Rode numa máquina com acesso ao site.
import fs from 'node:fs'
import path from 'node:path'
import { ORIGINAIS, lerFontes } from './_comum.mjs'

fs.mkdirSync(ORIGINAIS, { recursive: true })
let falhas = 0
for (const item of lerFontes()) {
  const url = new URL(item.url)
  if (url.protocol !== 'https:' || url.hostname !== 'zefir.com.br') {
    console.error(`pulado (fora de zefir.com.br): ${item.url}`)
    continue
  }
  try {
    const r = await fetch(url, { redirect: 'follow' })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const tipo = r.headers.get('content-type') ?? ''
    if (!tipo.startsWith('image/')) throw new Error(`não é imagem (${tipo})`)
    const destino = path.join(ORIGINAIS, item.arquivo)
    fs.writeFileSync(destino, Buffer.from(await r.arrayBuffer()))
    console.log(`ok  ${item.arquivo}`)
  } catch (e) {
    falhas++
    console.error(`ERRO ${item.url}: ${e.message}`)
  }
}
process.exitCode = falhas ? 1 : 0

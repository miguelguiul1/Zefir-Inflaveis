// Prepara a revisão das fotos colocadas em fotos/originais/:
// 1. registra em fotos/fontes.json cada arquivo novo, com "aprovada": false
// 2. remove EXIF/GPS e converte TODAS para AVIF/WebP em fotos/convertidas/
//    (fora do site: nada aqui é publicado)
// 3. gera miniaturas sem metadado em fotos/revisao/ e o roteiro fotos/revisao.md
// Não desfoca nada por conta própria e não aprova nada.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import {
  CONVERTIDAS,
  EXTENSOES,
  MINIATURAS,
  ORIGINAIS,
  RAIZ,
  caminhoOrigem,
  converter,
  gravarFontes,
  inspecionar,
  limpar,
  lerFontesCompleto,
  nomeSeguro,
  slug,
} from './_comum.mjs'

const dados = lerFontesCompleto()
const presentes = fs.existsSync(ORIGINAIS) ? fs.readdirSync(ORIGINAIS).filter((f) => EXTENSOES.test(f)) : []

for (const arquivo of presentes) {
  if (!nomeSeguro(arquivo)) {
    console.error(`pulado: renomeie "${arquivo}" (use só letras, números, espaço, ponto, hífen e _)`)
    continue
  }
  if (!dados.itens.some((i) => i.arquivo === arquivo)) {
    dados.itens.push({
      arquivo,
      usoNoSite: null,
      provisoria: true,
      aprovada: false,
      alt: 'TODO-CONFIRMAR: descrever a foto',
      desfocar: [],
      amostras: [],
      pontosRevisao: [],
    })
    console.log(`registrada: ${arquivo}`)
  }
}
gravarFontes(dados)

fs.mkdirSync(MINIATURAS, { recursive: true })
const md = [
  '# Revisão das fotos',
  '',
  'Gerado por `npm run fotos:revisao`. As miniaturas e as conversões já estão **sem EXIF/GPS**.',
  'Nada aqui está no site: só entra foto com `"aprovada": true` em `fotos/fontes.json`, e só depois que você disser.',
  '',
  'Para cada foto, confira e responda:',
  '',
  '- tem **pessoa**? Se tiver e não houver autorização, a foto não entra;',
  '- **rosto de terceiro**, **placa** (barco, carro, reboque), **marca de motor** ou de outra empresa, telefone ou site de terceiro: diga a região para desfocar;',
  '- para que serve no site: `entrada`, `uso` ou `fabrica`;',
  '- o texto alternativo (o que a foto mostra, em uma frase).',
  '',
]

const faltando = []
for (const item of dados.itens) {
  const origem = caminhoOrigem(item)
  if (!fs.existsSync(origem)) {
    faltando.push(item.local === 'public' ? `public/${item.arquivo}` : `fotos/originais/${item.arquivo}`)
    continue
  }
  const info = await inspecionar(origem)
  const nome = slug(item.arquivo)
  const { png, largura, altura } = await limpar(origem) // sem desfoque: é para revisar
  if (!item.somenteAmostra) await converter(png, largura, path.join(CONVERTIDAS, nome), nome)
  const mini = path.join(MINIATURAS, `${nome}.webp`)
  await sharp(png).resize({ width: 480 }).webp({ quality: 70 }).toFile(mini)

  md.push(`## ${item.arquivo}`, '')
  md.push(`![${item.arquivo}](revisao/${nome}.webp)`, '')
  md.push(
    `- ${largura} × ${altura} px, ${info.formato}. No original: EXIF ${info.exif ? 'sim' : 'não'}, GPS ${info.gps ? '**sim**' : 'não'}, XMP ${info.xmp ? 'sim' : 'não'}. Na conversão: nenhum.`,
  )
  if (item.somenteAmostra) {
    md.push('- Só para amostrar cor (não vai como foto no site).', '')
    continue
  }
  md.push(`- Situação: ${item.aprovada ? '**aprovada**' : 'aguardando sua revisão'}; uso no site: ${item.usoNoSite ?? 'a definir'}.`)
  md.push(`- Regiões a desfocar anotadas: ${item.desfocar?.length ?? 0}.`, '')
  md.push('Pontos para você conferir:', '')
  const pontos = item.pontosRevisao?.length ? item.pontosRevisao : ['(ainda não analisada)']
  for (const p of pontos) md.push(`- [ ] ${p}`)
  md.push('')
}

if (faltando.length) {
  md.push('## Arquivos esperados que não estão na pasta', '', ...faltando.map((f) => `- ${f}`), '')
}
if (presentes.length === 0) {
  md.push('## Nenhuma foto encontrada', '', 'A pasta `fotos/originais/` está vazia ou não existe.', '')
}

fs.writeFileSync(path.join(RAIZ, 'fotos', 'revisao.md'), md.join('\n'))
console.log(`fotos/revisao.md: ${presentes.length} foto(s) em originais, ${faltando.length} arquivo(s) faltando`)
for (const f of faltando) console.log(`  falta: ${f}`)

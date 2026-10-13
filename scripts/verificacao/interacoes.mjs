// Testa o site no Chromium (playwright-core) e salva as capturas.
// uso: node scripts/verificacao/interacoes.mjs <url> <proposta|publico> <pasta-capturas> [chromium]
// Precisa de: npm i --no-save playwright-core  (não entra no package.json)
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright-core'

const [, , base, modo, saida, executavel = process.env.CHROMIUM_PATH] = process.argv
const proposta = modo === 'proposta'
fs.mkdirSync(saida, { recursive: true })
const browser = await chromium.launch(executavel ? { executablePath: executavel } : {})
const mensagens = {}
let falhas = 0

for (const largura of [320, 390, 1440]) {
  const tag = `${modo}-${largura}`
  console.log(`\n== ${tag}`)
  const page = await browser.newPage({ viewport: { width: largura, height: largura === 1440 ? 900 : 780 } })
  page.setDefaultTimeout(5000)
  const problemas = []
  const pedidos = []
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && problemas.push(`console ${m.type()}: ${m.text()}`))
  page.on('pageerror', (e) => problemas.push(`erro: ${e.message}`))
  page.on('requestfailed', (r) => problemas.push(`falhou: ${r.url()} ${r.failure()?.errorText}`))
  page.on('response', (r) => {
    pedidos.push(r.url())
    if (r.status() >= 400) problemas.push(`${r.status()} ${r.url()}`)
  })
  const ok = (t) => console.log(`  ok  ${t}`)
  const prancha = page.locator('#prancha')
  const painelLista = page.locator('#prancha h3', { hasText: 'Lista de orçamento' }).locator('..')
  const escolher = (rotulo) => page.locator('label', { has: page.getByRole('radio', { name: rotulo, exact: true }) }).click()
  const focado = () => page.evaluate(() => document.activeElement?.textContent)

  try {
    // texto na URL da página não pode chegar à mensagem
    await page.goto(`${base}?text=INJETADO&modelo=hack#INJETADO`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)

    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    assert.equal(sobra, 0, 'rolagem horizontal')
    ok('sem rolagem horizontal')
    // texto que passa da tela ou da borda do primeiro contêiner com borda/corte (ex.: o quadro da prancha)
    const cortados = () =>
      page.evaluate(() => {
        const temTexto = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
        const limite = (el) => {
          for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
            const cs = getComputedStyle(a)
            const borda = parseFloat(cs.borderRightWidth) + parseFloat(cs.borderLeftWidth)
            if (borda > 0 || cs.overflowX !== 'visible') {
              const r = a.getBoundingClientRect()
              return { esq: r.left + parseFloat(cs.borderLeftWidth), dir: r.right - parseFloat(cs.borderRightWidth) }
            }
          }
          return { esq: 0, dir: innerWidth }
        }
        return [...document.querySelectorAll('body *')]
          .filter((el) => temTexto(el) && !el.closest('[aria-hidden="true"]'))
          .filter((el) => {
            const r = el.getBoundingClientRect()
            if (r.width === 0) return false
            const l = limite(el)
            return r.right > Math.min(l.dir, innerWidth) + 1 || r.left < Math.max(l.esq, 0) - 1
          })
          .map((el) => el.textContent.trim().slice(0, 40))
      })
    assert.deepEqual(await cortados(), [], 'texto cortado')
    ok('nenhum texto cortado (tela ou borda de contêiner)')
    assert.equal((await page.getByText('TODO-CONFIRMAR').count()) > 0, proposta)
    assert.equal(await page.getByText('protótipo de proposta').count(), proposta ? 1 : 0)
    ok(proposta ? 'TODO-CONFIRMAR e faixa aparecem' : 'nenhum TODO-CONFIRMAR nem faixa')
    const campos = await page.evaluate(() =>
      [...document.querySelectorAll('input, textarea, select, [contenteditable]')].map((e) => e.getAttribute('type') ?? e.tagName),
    )
    assert.ok(campos.every((t) => t === 'radio'), `campo de texto encontrado: ${campos}`)
    ok(`sem campo de texto livre na página (${campos.length} campos antes de abrir a ficha)`)

    await page.screenshot({ path: path.join(saida, `${tag}-1-entrada.png`) })
    await page.getByRole('link', { name: /Montar meu orçamento/ }).click()
    await page.waitForFunction(() => location.hash === '#prancha')
    ok('"Montar meu orçamento" leva à prancha')
    await prancha.screenshot({ path: path.join(saida, `${tag}-2-prancha-fechada.png`) })

    // G500 com o mouse
    await page.getByRole('button', { name: /G500 Geração II, 5,15 m/ }).click()
    await page.waitForFunction(() => document.activeElement?.textContent === 'Ficha · G500 Geração II')
    ok('clique abre a ficha e leva o foco a ela')
    await page.getByRole('button', { name: 'Adicionar à lista' }).click()
    await page.getByText('Escolha o material.').waitFor()
    ok('pede o material antes de adicionar')
    await escolher('CSM Hypalon')
    const temCor = (await page.getByRole('group', { name: /Cor dos tubos/ }).count()) > 0
    assert.equal(temCor, proposta)
    if (proposta) {
      await page.getByRole('button', { name: 'Adicionar à lista' }).click()
      await page.getByText('Escolha a cor.').waitFor()
      await escolher('Cinza')
      ok('pede a cor e aceita "Cinza"')
    } else ok('sem cor confirmada: escolha de cor escondida')
    await page.getByRole('button', { name: 'Adicionar à lista' }).click()
    await page.getByRole('status').filter({ hasText: 'Adicionado' }).waitFor()
    mensagens[`a-${tag}`] = new URL(await page.getByRole('link', { name: /Enviar pelo WhatsApp/ }).getAttribute('href')).searchParams.get('text')
    await page.getByRole('button', { name: 'Adicionar à lista' }).click()
    await page.getByRole('status').filter({ hasText: 'já está na lista' }).waitFor()
    ok('adiciona e recusa duplicado')

    // 800 Full só pelo teclado
    await page.getByRole('button', { name: /800 Full, 8,00 m/ }).focus()
    await page.keyboard.press('Enter')
    await page.waitForFunction(() => document.activeElement?.textContent === 'Ficha · 800 Full')
    assert.equal(await page.locator('#ficha').getByText('350 L', { exact: true }).count(), 0)
    assert.equal((await page.locator('#ficha').getByText(/centro-rabeta/).count()) > 0, proposta)
    await page.getByRole('radio', { name: 'Popa' }).focus()
    await page.keyboard.press('Space')
    await page.keyboard.press('ArrowRight')
    assert.ok(await page.getByRole('radio', { name: 'Rabeta' }).isChecked())
    await page.locator('#ficha').getByText('350 L', { exact: true }).waitFor()
    await page.locator('#ficha').getByText('até 3.000 kg', { exact: true }).waitFor()
    await page.keyboard.press('Tab')
    await page.keyboard.press('ArrowRight')
    assert.ok(await page.getByRole('radio', { name: 'PVC nitrílico' }).isChecked())
    if (proposta) {
      await page.keyboard.press('Tab')
      await page.keyboard.press('ArrowRight')
      assert.ok(await page.getByRole('radio', { name: 'Preto' }).isChecked())
    }
    await page.keyboard.press('Tab')
    assert.equal(await focado(), 'Adicionar à lista')
    const camposAbertos = await page.evaluate(() =>
      [...document.querySelectorAll('input, textarea, select, [contenteditable]')].map((e) => e.getAttribute('type') ?? e.tagName),
    )
    assert.ok(camposAbertos.length > 0 && camposAbertos.every((t) => t === 'radio'), `campos: ${camposAbertos}`)
    ok(`ficha aberta: ${camposAbertos.length} campos, todos radio (nenhum texto livre)`)
    assert.deepEqual(await cortados(), [], 'texto saindo da tela com a ficha aberta')
    await prancha.screenshot({ path: path.join(saida, `${tag}-3-prancha-ficha-aberta.png`) })
    await page.keyboard.press('Enter')
    await page.getByRole('status').filter({ hasText: '2 itens' }).waitFor()
    ok('teclado: 800 Full, Rabeta, PVC' + (proposta ? ', preto' : '') + ', adicionado (2 itens)')
    await painelLista.screenshot({ path: path.join(saida, `${tag}-4-lista-2-itens.png`) })

    // mensagem
    const link = page.getByRole('link', { name: /Enviar pelo WhatsApp/ })
    const href = await link.getAttribute('href')
    assert.equal(await link.getAttribute('rel'), 'noopener noreferrer')
    const u = new URL(href)
    assert.equal(`${u.origin}${u.pathname}`, 'https://wa.me/551156210008')
    assert.deepEqual([...u.searchParams.keys()], ['text'])
    const texto = u.searchParams.get('text')
    assert.ok(!texto.includes('INJETADO') && !texto.includes('hack'), 'texto da URL da página entrou na mensagem')
    assert.equal(href.split('?text=')[1], encodeURIComponent(texto))
    await page.getByText('Ver a mensagem que vai sair').click()
    assert.equal((await page.locator('#prancha pre').innerText()).trim(), texto.trim())
    await painelLista.screenshot({ path: path.join(saida, `${tag}-5-mensagem.png`) })
    mensagens[`b-${tag}`] = texto
    ok('link wa.me só com o parâmetro text, igual à prévia, sem texto da URL da página')

    await page.context().route('https://wa.me/**', (r) => r.fulfill({ status: 200, body: 'wa' }))
    const [aba] = await Promise.all([page.waitForEvent('popup'), link.click()])
    assert.ok(aba.url().startsWith('https://wa.me/551156210008?text='))
    await aba.close()
    ok('"Enviar pelo WhatsApp" abre o wa.me em nova aba')

    // remover
    await page.getByRole('button', { name: /Remover G500/ }).click()
    assert.equal(await page.locator('#prancha ol > li').count(), 1)
    assert.equal(await focado(), 'Lista de orçamento')
    ok('remove item e devolve o foco à lista')

    const externos = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="http"]')].filter((a) => a.rel !== 'noopener noreferrer').map((a) => a.href),
    )
    assert.deepEqual(externos, [])
    ok('todo link externo com rel="noopener noreferrer"')
    const foraDoDominio = pedidos.filter((p) => !p.startsWith(new URL(base).origin))
    assert.deepEqual(foraDoDominio, [])
    ok(`rede: ${pedidos.length} pedidos, todos do próprio domínio`)
  } catch (e) {
    falhas++
    console.log(`  FALHOU  ${e.message.split('\n')[0]}`)
  }
  if (problemas.length) {
    falhas++
    console.log('  PROBLEMAS:\n   ' + problemas.join('\n   '))
  } else console.log('  ok  console sem erro/aviso, nenhum 404')
  await page.close()
}

console.log('\n== mensagens geradas')
for (const [k, v] of Object.entries(mensagens)) console.log(`--- ${k}\n${v}`)
await browser.close()
process.exitCode = falhas ? 1 : 0

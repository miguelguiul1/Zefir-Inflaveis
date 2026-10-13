// Testa a montagem da mensagem do WhatsApp (src/lib/whatsapp.ts), sem navegador.
// Carrega o TypeScript pelo próprio Vite, então não precisa de dependência nova.
import assert from 'node:assert/strict'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { montarMensagem, linkWhatsApp, descreverItem, MAX_ITENS, MAX_CARACTERES } = await vite.ssrLoadModule('/src/lib/whatsapp.ts')
const { CORES } = await vite.ssrLoadModule('/src/content/catalogo.ts')
const CORES_PUBLICO = CORES.filter((c) => c.confirmada)

let n = 0
const caso = (nome, fn) => {
  fn()
  n++
  console.log(`ok  ${nome}`)
}
const textoDoLink = (href) => new URL(href).searchParams.get('text')

const g500 = { modeloId: 'g500', materialId: 'hypalon', corId: 'cinza' }
const full = { modeloId: '800-full', versaoId: 'rabeta', materialId: 'pvc', corId: 'preto' }

caso('(a) G500, Hypalon, cor', () => {
  assert.equal(
    montarMensagem([g500], CORES),
    'Olá, Zefir! Montei esta lista no site e quero um orçamento:\n\n1. G500 Geração II, tubo CSM Hypalon, cor cinza',
  )
})
caso('(b) 800 Full Rabeta, PVC, cor + G500', () => {
  assert.equal(
    montarMensagem([full, g500], CORES),
    'Olá, Zefir! Montei esta lista no site e quero um orçamento:\n\n1. 800 Full Rabeta, tubo PVC nitrílico, cor preto\n2. G500 Geração II, tubo CSM Hypalon, cor cinza',
  )
})
caso('(c) modo público: sem cor confirmada, "cor a combinar"', () => {
  const semCor = [
    { modeloId: '800-full', versaoId: 'rabeta', materialId: 'pvc' },
    { modeloId: 'g500', materialId: 'hypalon' },
  ]
  assert.equal(
    montarMensagem(semCor, CORES_PUBLICO),
    'Olá, Zefir! Montei esta lista no site e quero um orçamento:\n\n1. 800 Full Rabeta, tubo PVC nitrílico, cor a combinar\n2. G500 Geração II, tubo CSM Hypalon, cor a combinar',
  )
  // no modo público uma cor provisória não é aceita
  assert.equal(descreverItem(g500, CORES_PUBLICO), null)
})
caso('link: wa.me + número da config + texto com encodeURIComponent', () => {
  const href = linkWhatsApp([full, g500], CORES)
  assert.ok(href.startsWith('https://wa.me/551156210008?text='))
  assert.equal(href.split('?text=')[1], encodeURIComponent(montarMensagem([full, g500], CORES)))
  assert.equal(textoDoLink(href), montarMensagem([full, g500], CORES))
})
caso('texto livre não entra: id fora das listas derruba o item', () => {
  const ataques = [
    { ...g500, modeloId: 'g500\nPAGUE AQUI http://golpe' },
    { ...g500, corId: 'cinza&text=oi' },
    { ...g500, materialId: '<script>' },
    { ...full, versaoId: 'rabeta%0Aoi' },
    { ...g500, versaoId: 'rabeta' }, // G500 não tem versão
    { modeloId: '800-full', materialId: 'pvc', corId: 'preto' }, // 800 sem versão
    { modeloId: 'constructor', materialId: 'pvc' },
    { modeloId: '__proto__', materialId: 'pvc' },
  ]
  for (const a of ataques) assert.equal(descreverItem(a, CORES), null, JSON.stringify(a))
  const msg = montarMensagem([...ataques, g500], CORES)
  assert.equal(msg, 'Olá, Zefir! Montei esta lista no site e quero um orçamento:\n\n1. G500 Geração II, tubo CSM Hypalon, cor cinza')
  for (const lixo of ['golpe', 'script', '&text', '%0A', 'oi']) assert.ok(!msg.includes(lixo), lixo)
})
caso(`limite: no máximo ${MAX_ITENS} itens e ${MAX_CARACTERES} caracteres`, () => {
  const muitos = Array.from({ length: 30 }, () => full)
  const msg = montarMensagem(muitos, CORES)
  assert.equal(msg.split('\n').filter((l) => /^\d+\. /.test(l)).length, MAX_ITENS)
  assert.ok(msg.length <= MAX_CARACTERES)
  assert.ok(linkWhatsApp(muitos, CORES).length < 2048)
})

await vite.close()
console.log(`\n${n} casos passaram`)

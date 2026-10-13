// Serve um build (dist/) aplicando os cabeçalhos do vercel.json, inclusive a CSP,
// para testar localmente como vai ficar na Vercel.
// uso: node scripts/verificacao/servidor.mjs <pasta-do-build> [porta]
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const pasta = path.resolve(process.argv[2] ?? path.join(raiz, 'dist'))
const porta = Number(process.argv[3] ?? 4173)
const { headers } = JSON.parse(fs.readFileSync(path.join(raiz, 'vercel.json'), 'utf8'))
const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.png': 'image/png',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
}

http
  .createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    const arquivo = path.join(pasta, url === '/' ? 'index.html' : url)
    if (!arquivo.startsWith(pasta) || !fs.existsSync(arquivo) || fs.statSync(arquivo).isDirectory()) {
      res.writeHead(404).end('404')
      return
    }
    for (const h of headers) {
      if (new RegExp('^' + h.source + '$').test(url)) for (const { key, value } of h.headers) res.setHeader(key, value)
    }
    res.setHeader('Content-Type', tipos[path.extname(arquivo)] ?? 'application/octet-stream')
    fs.createReadStream(arquivo).pipe(res)
  })
  .listen(porta, () => console.log(`servindo ${pasta} em http://localhost:${porta}`))

import fs from 'node:fs'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * og:url e og:image precisam de URL absoluta. Só com VITE_SITE_URL definida
 * (https://dominio, sem caminho) o build ganha as tags e o arquivo og.png.
 * Sem ela, nem a tag nem a imagem vão para dist/.
 */
function openGraph(siteUrl: string | undefined): Plugin {
  const base = siteUrl?.trim().replace(/\/+$/, '')
  const valida = Boolean(base && /^https:\/\/[a-z0-9.-]+$/i.test(base))
  return {
    name: 'zefir-open-graph',
    transformIndexHtml(html) {
      if (!valida) return html.replace('    <!-- og:url -->\n', '')
      return html.replace(
        '<!-- og:url -->',
        [
          `<meta property="og:url" content="${base}/" />`,
          `<meta property="og:image" content="${base}/og.png" />`,
          '<meta property="og:image:width" content="1200" />',
          '<meta property="og:image:height" content="630" />',
          '<meta property="og:image:alt" content="Zefir, O 4x4 dos mares, com o desenho técnico do G500" />',
          '<meta name="twitter:card" content="summary_large_image" />',
        ].join('\n    '),
      )
    },
    generateBundle() {
      if (!valida) return
      this.emitFile({ type: 'asset', fileName: 'og.png', source: fs.readFileSync('og/og.png') })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), tailwindcss(), openGraph(env.VITE_SITE_URL)],
    build: {
      // nada de data: URI: a CSP só aceita fontes e imagens do próprio domínio
      assetsInlineLimit: 0,
    },
  }
})

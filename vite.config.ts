import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// og:url e og:image precisam de URL absoluta. Só entram se VITE_SITE_URL existir.
function openGraphUrl(siteUrl: string | undefined): Plugin {
  return {
    name: 'zefir-og-url',
    transformIndexHtml(html) {
      const base = siteUrl?.replace(/\/+$/, '')
      if (!base || !/^https:\/\/[a-z0-9.-]+$/i.test(base)) return html
      return html.replace(
        '<!-- og:url -->',
        `<meta property="og:url" content="${base}/" />\n    <meta property="og:image" content="${base}/og.png" />`,
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), tailwindcss(), openGraphUrl(env.VITE_SITE_URL)],
    build: {
      // nada de data: URI — a CSP só aceita fontes e imagens do próprio domínio
      assetsInlineLimit: 0,
    },
  }
})

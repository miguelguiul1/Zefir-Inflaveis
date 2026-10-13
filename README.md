# Zefir Infláveis: protótipo de site

Protótipo para apresentar ao dono da Zefir. Conceito: **"A fábrica na escala real"**, com cara de prancha técnica de estaleiro. O visitante compara os botes na mesma régua, monta uma lista e sai com o pedido de orçamento pronto no WhatsApp.

Sem loja, sem backend, sem formulário, sem armazenar nada (nem `localStorage`).

## Rodar

Precisa de Node 20 ou mais novo.

```bash
npm install
cp .env.example .env.local     # VITE_PROPOSAL_MODE=true já vem ligado
npm run dev                    # http://localhost:5173
```

```bash
npm run lint
npm run build                  # gera dist/
npm run preview                # serve dist/ localmente
```

### Variáveis de ambiente

Nenhuma é segredo. O projeto não usa chave, token nem senha.

| variável | uso |
|---|---|
| `VITE_PROPOSAL_MODE` | `true`: mostra as marcas TODO-CONFIRMAR, a faixa "protótipo" e o selo "provisória" nas fotos. `false` (ou ausente): modo público, tudo que não está confirmado some. |
| `VITE_SITE_URL` | Opcional. URL do deploy (ex.: `https://zefir-prototipo.vercel.app`). Só com ela o build inclui `og:url`, `og:image` e o arquivo `og.png` (fonte em `og/og.png`). |

Na Vercel: cadastre as duas em *Settings → Environment Variables*. O `vercel.json` já traz os cabeçalhos (CSP, `X-Robots-Tag: noindex`, etc.).

O número de WhatsApp fica em `src/config.ts` (`WHATSAPP_NUMERO`), marcado TODO-CONFIRMAR.

## Onde está cada coisa

| arquivo | o quê |
|---|---|
| `src/content/catalogo.ts` | Modelos, versões, materiais, cores e linhas. Só dado confirmado; o resto é `{ todo }`. |
| `src/config.ts` | Modo proposta, WhatsApp, contato, links. |
| `src/lib/whatsapp.ts` | Monta a mensagem só a partir das listas fixas (ids validados), `encodeURIComponent`, até 8 itens e 900 caracteres. |
| `src/index.css` | Tokens de cor e fonte, com a fonte de cada cor. |
| `src/components/PlantaBote.tsx` | Desenho em planta, em cm. Só o comprimento está em escala garantida. |
| `fotos/fontes.json` | Lista das imagens de origem e da revisão de cada uma. |
| `scripts/` | Download, tratamento de fotos e amostragem de cores. |
| `docs/` | Pendências, relatório da rodada 2, contraste, paleta e capturas. |

## Fotos

As fotos do site atual são da Zefir. Entram só como **provisórias**, em `public/img/provisorias/`, e o protótipo fica privado até o dono autorizar.

1. Coloque as fotos em `fotos/originais/` (pasta fora do git, porque o original pode ter EXIF/GPS) e o logo em `public/logo-original.png`.
2. `npm run fotos:revisao`: registra cada foto nova em `fotos/fontes.json` com `"aprovada": false`, remove EXIF/GPS, converte tudo para AVIF/WebP em `fotos/convertidas/` (fora do site) e gera `fotos/revisao.md` com miniatura e pontos a conferir. Não desfoca nem aprova nada sozinho.
3. Revisão humana de cada foto: pessoa sem autorização fica de fora; placa, rosto de terceiro e marca de outra empresa (inclusive de motor) vão para `"desfocar"` (frações de 0 a 1). Preencher `"alt"`, `"usoNoSite"` (`entrada`, `uso` ou `fabrica`) e só então `"aprovada": true`.
4. `npm run fotos:processar`: só as aprovadas vão para `public/img/`, com as regiões desfocadas, e entram em `src/content/fotos.gerado.json`. O script confere que a saída não tem EXIF/XMP.

Sem foto aprovada, a entrada usa o desenho técnico do G500 e as outras seções se ajustam. Nunca aparece "foto em breve". Com foto, o texto da entrada fica num painel escuro (80%), que mantém o contraste AA mesmo sobre trecho branco da foto.

## Cores e contraste

- `npm run cores` amostra o logo, as fotos e as regiões `"amostras"` (ex.: amostra de tecido) e grava `docs/paleta-amostrada.md` com cada cor, o arquivo e a coordenada do pixel. Os tokens ficam em `src/index.css` citando essa origem; as cores de tubo em `CORES` (`src/content/catalogo.ts`), com `confirmada: true` quando forem reais.
- `npm run contraste` lê os tokens do CSS, confere cada par texto/fundo usado no site (WCAG AA) e grava `docs/contraste.md`. Sai com erro se algum par falhar.

## Testes

```bash
npm test          # mensagem do WhatsApp: casos (a), (b), (c), injeção de texto, limites
```

Verificação no navegador (Chromium), com os cabeçalhos do `vercel.json`:

```bash
npm i --no-save playwright-core          # não entra no package.json
VITE_PROPOSAL_MODE=true npm run build
node scripts/verificacao/servidor.mjs dist 4173 &
node scripts/verificacao/interacoes.mjs http://localhost:4173/ proposta docs/screenshots/rodada-2 [caminho-do-chromium]
```

O último argumento é o executável do Chromium ou do Chrome da máquina (ex.: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`). Repita com `VITE_PROPOSAL_MODE=false` e `publico`. O script testa 320, 390 e 1440 px: rolagem horizontal, texto cortado, console, 404, pedidos de rede para fora do domínio, todo o fluxo da prancha pelo mouse e pelo teclado, a mensagem e o link do WhatsApp, e salva as capturas.

## Pendências

Ver [`docs/PENDENCIAS.md`](docs/PENDENCIAS.md).

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
| `VITE_SITE_URL` | Opcional. URL do deploy (ex.: `https://zefir-prototipo.vercel.app`). Liga `og:url` e `og:image`. |

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
| `docs/` | Pendências e screenshots. |

## Fotos

As fotos do site atual são da Zefir. Entram só como **provisórias**, em `public/img/provisorias/`, e o protótipo fica privado até o dono autorizar.

1. `npm run fotos:baixar`: baixa o que está em `fotos/fontes.json` para `fotos/originais/` (pasta fora do git, porque o original tem EXIF/GPS).
2. Olhe cada foto. Se tiver pessoa sem autorização, **não use**. Placa, rosto de terceiro e marca de outra empresa (inclusive marca de motor): anote a região em `"desfocar"` (frações de 0 a 1). Escreva o `"alt"` e marque `"aprovada": true`.
3. `npm run fotos:processar`: aplica a orientação, remove todo metadado, desfoca as regiões, gera AVIF e WebP em 640/1280/1920 px e atualiza `src/content/fotos.gerado.json`. O script confere que a saída não tem EXIF/XMP.

Sem foto aprovada, a entrada usa o desenho técnico do G500 e as outras seções se ajustam. Nunca aparece "foto em breve".

## Cores

`npm run cores` amostra o logo, as fotos e as regiões listadas em `"amostras"` (por exemplo, as amostras de tecido Hypalon/PVC das fichas) e grava `docs/paleta-amostrada.md`. Depois troque os valores em `src/index.css` e em `CORES` (`src/content/catalogo.ts`), anotando a fonte e marcando `confirmada: true`.

## Pendências

Ver [`docs/PENDENCIAS.md`](docs/PENDENCIAS.md).

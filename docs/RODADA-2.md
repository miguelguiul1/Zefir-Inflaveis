# Rodada 2: relatório

## Material

| esperado | situação |
|---|---|
| fotos em `fotos/originais/` | **não recebido** (a pasta não existe) |
| `public/logo-original.png` | **não recebido** |

Sem esses arquivos, nada foi inventado: a entrada segue com o desenho técnico, as cores seguem provisórias e marcadas assim, e nenhuma foto foi aprovada. O pipeline ficou pronto e foi testado com imagens sintéticas (uma delas com GPS no EXIF e uma "placa" para desfocar).

## Fotos

- `npm run fotos:revisao`: registra fotos novas com `"aprovada": false`, remove EXIF/GPS, converte para AVIF/WebP em `fotos/convertidas/` (fora do site e do git) e gera `fotos/revisao.md` com miniatura, metadados do original e pontos a conferir. **Não desfoca e não aprova nada sozinho.**
- `npm run fotos:processar`: só fotos aprovadas vão para `public/img/`, com as regiões de `"desfocar"` aplicadas. Recusa foto sem `alt` e duas fotos para o mesmo lugar.
- Entrada: com foto aprovada, a foto ocupa a tela e o texto fica num painel escuro. Sem foto, o desenho técnico continua. O aviso "foto provisória" aparece dentro do painel (modo proposta).

## Contraste

`npm run contraste` (tabela completa em `docs/contraste.md`). A primeira medição achou um problema: a película de 55% sobre a foto deixava o texto em **3,37:1** num trecho branco da foto. Troquei por um painel de 80% só atrás do texto: **7,95:1** no pior caso. Todos os pares passam AA.

## Revisão de texto

Frases proibidas ("soluções inovadoras", "excelência", "qualidade e compromisso", "transformamos sonhos", "sua satisfação é nossa prioridade"): **nenhuma ocorrência** no site. Também não há preço, prazo, garantia, cliente, prêmio nem horário afirmados.

Afirmações que iam além do confirmado, corrigidas:

| onde | antes | depois | por quê |
|---|---|---|---|
| `<title>` e og | "botes infláveis feitos em São Paulo desde 1972" | "Zefir Infláveis \| Botes infláveis em São Paulo-SP" | Não está confirmado onde os botes são feitos nem que a fábrica faz infláveis desde 1972 |
| description | "Fábrica de botes infláveis em São Paulo desde 1972" | "Fábrica de botes infláveis fundada em 1972..." | idem |
| entrada | "Botes infláveis desde 1972" | "Fábrica de botes infláveis" | idem |
| carimbo | "desde 1972" | "fundada em 1972" | o confirmado é a fundação |
| Militar | "Compra institucional é tratada direto com a fábrica" | "Se a compra é para uma instituição, fale com a gente pelo contato abaixo" | processo não confirmado |
| Revendedores | "representante perto de você" | "Para comprar de um representante, a lista está no site atual da Zefir" | cobertura não confirmada |
| Linhas e Fábrica | "os acessórios saem daqui mesmo" (duas vezes) | uma vez só: "Os acessórios a Zefir faz na própria fábrica" | repetido; "daqui" sugeria que o endereço é a fábrica |
| Para que serve | "Aguenta 1.800 kg de carga" | "A carga é de 1.800 kg" | fiel à ficha |

Ritmo: tirei a segunda pergunta retórica (Linhas e Revendedores começavam igual) e o par "Falar com a fábrica" / "Fale com a fábrica" (o link da Militar agora é "Ir para o contato").

## Metadados

`title` = `og:title`. `og:url`, `og:image` (com largura, altura e alt), `twitter:card` e o arquivo `og.png` só entram no build com `VITE_SITE_URL` válida (`https://dominio`). Testado sem a variável, com ela e com valor inválido.

## Mensagens do WhatsApp

Geradas pela Prancha no Chromium (iguais em 320, 390 e 1440 px) e conferidas por `npm test`.

(a) G500, Hypalon, cinza (modo proposta):

```
Olá, Zefir! Montei esta lista no site e quero um orçamento:

1. G500 Geração II, tubo CSM Hypalon, cor cinza
```

(b) 800 Full Rabeta, PVC, preto, mais o G500 (modo proposta, na ordem em que foram adicionados):

```
Olá, Zefir! Montei esta lista no site e quero um orçamento:

1. G500 Geração II, tubo CSM Hypalon, cor cinza
2. 800 Full Rabeta, tubo PVC nitrílico, cor preto
```

(c) modo público (nenhuma cor confirmada, a escolha de cor não aparece):

```
Olá, Zefir! Montei esta lista no site e quero um orçamento:

1. G500 Geração II, tubo CSM Hypalon, cor a combinar
2. 800 Full Rabeta, tubo PVC nitrílico, cor a combinar
```

As cores "cinza" e "preto" são amostras provisórias (TODO-CONFIRMAR).

## Texto do visitante na URL

Não entra. Conferido de quatro jeitos:

1. Código: a mensagem é montada só por `descreverItem`, que procura cada id nas listas fixas do catálogo e descarta o item se algum id não existir. O site não lê `location`, query string nem hash, e não usa `localStorage`.
2. Página: não há campo de texto. Os únicos campos são 9 botões de opção (radio), contados com a ficha aberta.
3. Navegador: a página foi aberta com `?text=INJETADO&modelo=hack#INJETADO`; o link gerado só tem o parâmetro `text`, sem esses valores, e o texto é igual à prévia "Ver a mensagem que vai sair".
4. `npm test`: ids com quebra de linha, `&text=`, `<script>`, `%0A`, `__proto__` e `constructor` são descartados; o teste também achou e cobriu um bug (item inválido ocupava vaga no limite de 8 itens).

## Verificação no navegador

`scripts/verificacao/interacoes.mjs`, Chromium, build servida com os cabeçalhos do `vercel.json` (CSP inclusa), 320, 390 e 1440 px, modo proposta e modo público: **51 checagens ok em cada modo, zero falhas**. Console sem erro nem aviso, nenhum 404, todos os pedidos de rede do próprio domínio, sem rolagem horizontal e sem texto cortado. A checagem de texto cortado achou um defeito em 320 px ("G500" e "800" passando da borda da prancha), corrigido.

Capturas: `docs/screenshots/rodada-2/` (entrada, prancha fechada, ficha aberta, lista com 2 itens, mensagem; 3 larguras × 2 modos).

## Não verificado

- Fotos reais, logo e paleta real: os arquivos não chegaram.
- Navegadores além do Chromium (Safari/iOS e Firefox não foram abertos).
- Leitor de tela de verdade (NVDA, VoiceOver): só a estrutura (rótulos, foco, `role="status"`) foi testada.
- O deploy na Vercel: os cabeçalhos foram testados num servidor local que aplica o `vercel.json`.
- O número de WhatsApp: o link abre `wa.me/551156210008`, mas não dá para saber daqui se o número atende no WhatsApp.

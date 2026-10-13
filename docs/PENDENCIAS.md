# Pendências

Tudo o que aparece como **TODO-CONFIRMAR** no modo proposta. No modo público esses itens somem.

## Material (situação na rodada 2)

Na rodada 1 o site da Zefir estava bloqueado na rede do ambiente. Na rodada 2 o combinado era receber os arquivos no repositório, mas **eles não chegaram**:

- `fotos/originais/`: pasta não existe (nenhuma foto);
- `public/logo-original.png`: não existe.

Por isso continuam pendentes: a foto da entrada (o desenho técnico segue no lugar), a revisão das fotos, a amostragem de cores e as fichas do G660, do 800 Full Popa/Parelha e da balsa de rafting. O pipeline está pronto e testado com imagens sintéticas: `npm run fotos:revisao` → sua revisão → `npm run fotos:processar` → `npm run cores` → `npm run contraste`.

## Depende do dono confirmar

| item | onde aparece | situação |
|---|---|---|
| Número de WhatsApp de atendimento | Prancha (lista), Contato | Usando (11) 5621-0008, como o site atual. `src/config.ts` |
| Motorização do 800 Full | Ficha do 800 Full | O texto atual diz "centro-rabeta" e "1 ou 2 motores de popa" |
| Largura útil, tanque e carga do 800 Full Popa e Parelha | Ficha do 800 Full | Só a Rabeta tem esses dados |
| Medidas do G660 Geração I | Prancha, "fora da escala" | Ficha não lida |
| Medidas da balsa de rafting | Prancha, "fora da escala" | Ficha não lida |
| Cores reais dos tubos (Hypalon e PVC) | Ficha, escolha de cor | Amostras provisórias; no modo público a escolha some e a mensagem diz "cor a combinar" |
| "Líder em vendas de botes infláveis no Brasil" | A fábrica | Falta a fonte do dado |
| CEP | Contato, JSON-LD | Bio diz 04428-000, Maps diz 04428-010. Fora do JSON-LD até confirmar |
| Horário de atendimento | Contato | Sem dado |
| Endereços de YouTube, TikTok e Facebook | Contato | Só o Instagram está confirmado |
| Lista própria de revendedores | Revendedores | Hoje é link para o site atual |
| Modelos e medidas de cada linha | Linhas de bote | Só os nomes das 8 linhas estão confirmados |
| Autorização para usar as fotos | Todas as fotos | Provisórias até o dono autorizar |
| Revisão de cada foto (pessoas, placas, rostos, marcas) | fotos/revisao.md | Nenhuma foto recebida ainda; nenhuma aprovada |
| Cores da marca | Tokens em src/index.css | Provisórias; logo não recebido |

## Material que falta

- Foto do G500 para a entrada (provisória prevista: `ZFR-Prod-G500-Pranchas05.jpg`, ainda sem revisão de pessoas, placas e marcas).
- Foto do G500 em uso para "Para que serve".
- Fotos da fábrica, se existirem. Sem elas a seção fica curta.
- Logo em `public/logo-original.png` para amostrar a cor da marca e trocar o favicon provisório.
- Vídeo de entrada: não há. Se vier, no máximo 3 MB e respeitando `prefers-reduced-motion`.

## Antes de tirar o protótipo do ar privado

- Trocar `noindex` (meta em `index.html` e `X-Robots-Tag` em `vercel.json`).
- Rever a CSP se entrar qualquer recurso de outro domínio.
- Se entrar formulário ou qualquer dado pessoal, passa a valer a LGPD. Hoje não há nenhum.

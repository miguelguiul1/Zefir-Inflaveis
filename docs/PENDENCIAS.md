# Pendências

Tudo o que aparece como **TODO-CONFIRMAR** no modo proposta. No modo público esses itens somem.

## O que bloqueou a coleta

O ambiente em que o protótipo foi feito **não tinha acesso a zefir.com.br** (o proxy recusou a conexão e o DNS não resolveu). Por isso:

- as fichas oficiais do G660 Geração I, do 800 Full Popa/Parelha e da categoria 168 (balsa de rafting) **não foram lidas**;
- nenhuma foto e nem o logo foram baixados;
- as cores **não foram amostradas**. Os tokens em `src/index.css` são provisórios e estão marcados assim.

Com acesso ao site: `npm run fotos:baixar`, revisar, `npm run fotos:processar`, `npm run cores`.

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

## Material que falta

- Foto do G500 para a entrada (provisória prevista: `ZFR-Prod-G500-Pranchas05.jpg`, ainda sem revisão de pessoas, placas e marcas).
- Foto do G500 em uso para "Para que serve".
- Fotos da fábrica, se existirem. Sem elas a seção fica curta.
- Logo em arquivo (`logo-tipo.png`) para amostrar a cor da marca e trocar o favicon provisório.
- Vídeo de entrada: não há. Se vier, no máximo 3 MB e respeitando `prefers-reduced-motion`.

## Antes de tirar o protótipo do ar privado

- Trocar `noindex` (meta em `index.html` e `X-Robots-Tag` em `vercel.json`).
- Rever a CSP se entrar qualquer recurso de outro domínio.
- Se entrar formulário ou qualquer dado pessoal, passa a valer a LGPD. Hoje não há nenhum.

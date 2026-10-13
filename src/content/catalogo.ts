/**
 * Catálogo do protótipo. REGRA: só entra aqui o que está confirmado no
 * documento de briefing. O que falta vira `{ todo }`: aparece como
 * TODO-CONFIRMAR no modo proposta e some no modo público.
 *
 * As fichas oficiais (G660 Geração I, 800 Full Popa/Parelha, balsa de rafting)
 * não puderam ser lidas: zefir.com.br estava bloqueado na rede do ambiente.
 */

export type Linha = { rotulo: string } & ({ valor: string; todo?: never } | { todo: string; valor?: never })

export type MaterialId = 'hypalon' | 'pvc'

export const MATERIAIS: ReadonlyArray<{ id: MaterialId; nome: string }> = [
  { id: 'hypalon', nome: 'CSM Hypalon' },
  { id: 'pvc', nome: 'PVC nitrílico' },
]

export interface Cor {
  id: string
  nome: string
  hex: string
  /** De onde a cor foi amostrada. */
  fonte: string
  confirmada: boolean
}

/**
 * Cores dos tubos. Confirmado só que existem "várias cores".
 * TODO-CONFIRMAR: substituir por amostras reais das fichas (npm run cores) e
 * marcar `confirmada: true`. Enquanto nenhuma estiver confirmada, o modo
 * público esconde a escolha de cor e a mensagem diz "cor a combinar".
 */
export const CORES: ReadonlyArray<Cor> = [
  { id: 'cinza', nome: 'Cinza', hex: '#8d9190', fonte: 'provisória, não amostrada', confirmada: false },
  { id: 'preto', nome: 'Preto', hex: '#24272a', fonte: 'provisória, não amostrada', confirmada: false },
  { id: 'vermelho', nome: 'Vermelho', hex: '#b3261e', fonte: 'provisória, não amostrada', confirmada: false },
  { id: 'laranja', nome: 'Laranja', hex: '#e0661f', fonte: 'provisória, não amostrada', confirmada: false },
]

export interface Versao {
  id: string
  nome: string
  linhas: Linha[]
}

export interface Desenho {
  /** Boca usada só no desenho. Só o comprimento está em escala garantida. */
  bocaM: number
  tuboM: number
  /** Posição do console, em fração do comprimento a partir da popa. */
  console: [inicio: number, fim: number]
}

export interface Modelo {
  id: 'g500' | '800-full'
  casco: string
  nome: string
  comprimentoM: number
  comprimentoTexto: string
  resumo: string
  linhas: Linha[]
  versoes?: Versao[]
  materiais: MaterialId[]
  desenho: Desenho
}

const tubos: Linha = { rotulo: 'Tubos', valor: 'CSM Hypalon ou PVC nitrílico' }

export const MODELOS: ReadonlyArray<Modelo> = [
  {
    id: 'g500',
    casco: 'G500',
    nome: 'G500 Geração II',
    comprimentoM: 5.15,
    comprimentoTexto: '5,15 m',
    resumo: 'Casco em V de fibra, deck antiderrapante, motor de 90 a 175 hp.',
    linhas: [
      { rotulo: 'Comprimento', valor: '5,15 m' },
      { rotulo: 'Largura', valor: '2,25 m' },
      { rotulo: 'Casco', valor: 'em V, de fibra, deck antiderrapante' },
      { rotulo: 'Peso do casco', valor: '450 kg' },
      { rotulo: 'Motor', valor: '90 a 175 hp' },
      { rotulo: 'Tanque', valor: '110 L' },
      { rotulo: 'Compartimentos', valor: '4' },
      { rotulo: 'Carga', valor: '1.800 kg' },
      { ...tubos, valor: 'CSM Hypalon ou PVC nitrílico, em várias cores' },
      { rotulo: 'Usos', valor: 'esquiar, mergulhar, pescar' },
    ],
    materiais: ['hypalon', 'pvc'],
    desenho: { bocaM: 2.25, tuboM: 0.5, console: [0.4, 0.56] },
  },
  {
    id: '800-full',
    casco: '800',
    nome: '800 Full',
    comprimentoM: 8,
    comprimentoTexto: '8,00 m',
    resumo: 'Até 12 pessoas, banheiro interno com 1,90 m de pé-direito, console central com comando TOP.',
    linhas: [
      { rotulo: 'Comprimento', valor: '8,00 m' },
      { rotulo: 'Pessoas', valor: 'até 12' },
      { rotulo: 'Banheiro', valor: 'interno, 1,90 m de pé-direito' },
      { rotulo: 'Armazenamento', valor: 'compartimentos' },
      { rotulo: 'Console', valor: 'central, comando TOP' },
      tubos,
      {
        rotulo: 'Motorização',
        todo: 'o texto atual do 800 Full Rabeta diz "centro-rabeta" num trecho e "1 ou 2 motores de popa" em outro',
      },
    ],
    versoes: [
      {
        id: 'popa',
        nome: 'Popa',
        linhas: [
          { rotulo: 'Largura útil', todo: 'ficha da versão Popa não lida' },
          { rotulo: 'Tanque', todo: 'ficha da versão Popa não lida' },
          { rotulo: 'Carga', todo: 'ficha da versão Popa não lida' },
        ],
      },
      {
        id: 'rabeta',
        nome: 'Rabeta',
        linhas: [
          { rotulo: 'Largura útil', valor: '2,15 m' },
          { rotulo: 'Tanque', valor: '350 L' },
          { rotulo: 'Carga', valor: 'até 3.000 kg' },
        ],
      },
      {
        id: 'parelha',
        nome: 'Parelha',
        linhas: [
          { rotulo: 'Largura útil', todo: 'ficha 800-full-parelha não lida' },
          { rotulo: 'Tanque', todo: 'ficha 800-full-parelha não lida' },
          { rotulo: 'Carga', todo: 'ficha 800-full-parelha não lida' },
        ],
      },
    ],
    materiais: ['hypalon', 'pvc'],
    // boca só para o desenho (esquema); não é dado do 800 Full
    desenho: { bocaM: 2.7, tuboM: 0.58, console: [0.36, 0.6] },
  },
]

/** Modelos citados, mas sem nenhum dado confirmado. Só aparecem no modo proposta. */
export const FORA_DE_ESCALA: ReadonlyArray<{ nome: string; todo: string }> = [
  { nome: 'G660 Geração I', todo: 'medidas na ficha oficial /produto/g660-geracao-1/ (não foi possível ler)' },
  { nome: 'Balsa de rafting', todo: 'medidas na ficha oficial da categoria 168 (não foi possível ler)' },
]

export const LINHAS_DE_BOTE: ReadonlyArray<{ nome: string; ancora?: string }> = [
  { nome: 'Classic' },
  { nome: 'Sport' },
  { nome: 'Gold' },
  { nome: 'G' },
  { nome: 'Wind Desmontável' },
  { nome: 'Wind Fibra' },
  { nome: 'T Dobrável' },
  { nome: 'Militar', ancora: '#militar' },
]

export const ALEM_DOS_BOTES: ReadonlyArray<string> = [
  'Balsas de rafting',
  'Banana boat',
  'Caiaques',
  'Boias de sinalização',
  'Brinquedos',
  'Peças e acessórios',
]

/** Régua da prancha, em metros. */
export const REGUA_M = 9

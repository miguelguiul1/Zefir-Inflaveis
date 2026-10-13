/**
 * Configuração do site. Nada aqui é segredo: o projeto não usa chave, token
 * nem senha. As únicas variáveis de ambiente são VITE_PROPOSAL_MODE e
 * VITE_SITE_URL (ver .env.example).
 */

/** Modo proposta: mostra TODO-CONFIRMAR, a faixa "protótipo" e o selo "provisória" nas fotos. */
export const PROPOSTA = import.meta.env.VITE_PROPOSAL_MODE === 'true'

/**
 * Número usado no link do WhatsApp (formato internacional, só dígitos).
 * TODO-CONFIRMAR: é o (11) 5621-0008, que o site atual usa como WhatsApp.
 * Confirmar com o dono se é mesmo esse o número de atendimento.
 */
export const WHATSAPP_NUMERO = '551156210008'
export const WHATSAPP_CONFIRMADO = false

export const CONTATO = {
  razaoSocial: 'Zefir Indústria e Comércio Ltda.',
  telefoneExibicao: '(11) 5621-0008',
  telefoneLink: '+551156210008',
  email: 'zefir@zefir.com.br',
  endereco: 'Av. Yervant Kissajikian, 2859',
  bairro: 'Americanópolis',
  cidade: 'São Paulo-SP',
  // Sem CEP: a bio diz 04428-000 e o Maps diz 04428-010. TODO-CONFIRMAR.
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Av. Yervant Kissajikian, 2859, Americanópolis, São Paulo - SP'),
  instagram: { usuario: '@zefir.inflaveis', url: 'https://www.instagram.com/zefir.inflaveis/' },
  revendedoresUrl: 'https://zefir.com.br/nossos-representantes/',
  catalogoUrl: 'https://zefir.com.br/produtos/',
} as const

/** Redes que a Zefir tem, mas cujos endereços não foram confirmados. */
export const REDES_A_CONFIRMAR = ['YouTube', 'TikTok', 'Facebook'] as const

/** rel padrão para todo link externo. */
export const REL_EXTERNO = 'noopener noreferrer'

import { CORES, MATERIAIS, MODELOS, type MaterialId } from '../content/catalogo'
import { WHATSAPP_NUMERO } from '../config'

export interface ItemLista {
  modeloId: string
  versaoId?: string
  materialId: MaterialId
  corId?: string
}

export const MAX_ITENS = 8
export const MAX_CARACTERES = 900

/**
 * Converte um item em texto usando SÓ as listas fixas do catálogo.
 * Qualquer id que não exista nas listas derruba o item (retorna null):
 * nada de texto livre entra na mensagem.
 */
export function descreverItem(item: ItemLista, cores = CORES): string | null {
  const modelo = MODELOS.find((m) => m.id === item.modeloId)
  if (!modelo) return null

  let nome = modelo.nome
  if (modelo.versoes) {
    const versao = modelo.versoes.find((v) => v.id === item.versaoId)
    if (!versao) return null
    nome += ` ${versao.nome}`
  } else if (item.versaoId !== undefined) {
    return null
  }

  if (!modelo.materiais.includes(item.materialId)) return null
  const material = MATERIAIS.find((m) => m.id === item.materialId)
  if (!material) return null

  let cor = 'cor a combinar'
  if (item.corId !== undefined) {
    const c = cores.find((x) => x.id === item.corId)
    if (!c) return null
    cor = `cor ${c.nome.toLowerCase()}`
  }

  return `${nome}, tubo ${material.nome}, ${cor}`
}

export function chaveItem(item: ItemLista): string {
  return [item.modeloId, item.versaoId ?? '-', item.materialId, item.corId ?? '-'].join('/')
}

export function montarMensagem(itens: ReadonlyArray<ItemLista>, cores = CORES): string {
  // primeiro descarta o que não está nas listas, depois limita: item inválido não ocupa vaga
  const validos = itens
    .map((i) => descreverItem(i, cores))
    .filter((t): t is string => t !== null)
    .slice(0, MAX_ITENS)

  // corta por linha inteira, nunca no meio de um item
  let texto = 'Olá, Zefir! Montei esta lista no site e quero um orçamento:\n'
  for (const [n, t] of validos.entries()) {
    const linha = `\n${n + 1}. ${t}`
    if (texto.length + linha.length > MAX_CARACTERES) break
    texto += linha
  }
  return texto
}

export function linkWhatsApp(itens: ReadonlyArray<ItemLista>, cores = CORES): string {
  const numero = WHATSAPP_NUMERO.replace(/\D/g, '')
  return `https://wa.me/${numero}?text=${encodeURIComponent(montarMensagem(itens, cores))}`
}

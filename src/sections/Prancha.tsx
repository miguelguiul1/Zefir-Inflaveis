import { useMemo, useRef, useState, type CSSProperties } from 'react'
import { PlantaBote } from '../components/PlantaBote'
import { Regua } from '../components/Regua'
import { SoProposta, Todo } from '../components/Todo'
import { PROPOSTA, REL_EXTERNO, WHATSAPP_CONFIRMADO } from '../config'
import {
  CORES,
  FORA_DE_ESCALA,
  MATERIAIS,
  MODELOS,
  REGUA_M,
  type Linha,
  type MaterialId,
  type Modelo,
} from '../content/catalogo'
import {
  MAX_ITENS,
  chaveItem,
  descreverItem,
  linkWhatsApp,
  montarMensagem,
  type ItemLista,
} from '../lib/whatsapp'

// Modo público: só cores confirmadas. Modo proposta: as provisórias também, marcadas.
const CORES_VISIVEIS = PROPOSTA ? CORES : CORES.filter((c) => c.confirmada)

export function Prancha() {
  const [modeloId, setModeloId] = useState<Modelo['id'] | null>(null)
  const [versaoId, setVersaoId] = useState<string | null>(null)
  const [materialId, setMaterialId] = useState<MaterialId | null>(null)
  const [corId, setCorId] = useState<string | null>(null)
  const [lista, setLista] = useState<ItemLista[]>([])
  const [aviso, setAviso] = useState('')
  const [falta, setFalta] = useState<string | null>(null)

  const fichaTitulo = useRef<HTMLHeadingElement>(null)
  const listaTitulo = useRef<HTMLHeadingElement>(null)

  const modelo = MODELOS.find((m) => m.id === modeloId) ?? null
  const versao = modelo?.versoes?.find((v) => v.id === versaoId) ?? null

  function escolherModelo(id: Modelo['id']) {
    if (id !== modeloId) {
      setModeloId(id)
      setVersaoId(null)
      setMaterialId(null)
      setCorId(null)
      setFalta(null)
    }
    // dá tempo de a ficha renderizar antes de mover o foco
    requestAnimationFrame(() => fichaTitulo.current?.focus())
  }

  function adicionar() {
    if (!modelo) return
    const faltando =
      modelo.versoes && !versao
        ? 'versao'
        : !materialId
          ? 'material'
          : CORES_VISIVEIS.length > 0 && !corId
            ? 'cor'
            : null
    if (faltando || !materialId) {
      setFalta(faltando)
      setAviso(`Falta escolher ${faltando === 'versao' ? 'a versão' : faltando === 'cor' ? 'a cor' : 'o material'}.`)
      return
    }
    setFalta(null)

    const item: ItemLista = {
      modeloId: modelo.id,
      versaoId: versao?.id,
      materialId,
      corId: corId ?? undefined,
    }
    const texto = descreverItem(item, CORES_VISIVEIS)
    if (!texto) return
    if (lista.some((i) => chaveItem(i) === chaveItem(item))) {
      setAviso(`Esse já está na lista: ${texto}.`)
      return
    }
    if (lista.length >= MAX_ITENS) {
      setAviso(`A lista aceita até ${MAX_ITENS} itens.`)
      return
    }
    const nova = [...lista, item]
    setLista(nova)
    setAviso(`Adicionado: ${texto}. ${nova.length} ${nova.length === 1 ? 'item' : 'itens'} na lista.`)
  }

  function remover(chave: string) {
    const nova = lista.filter((i) => chaveItem(i) !== chave)
    setLista(nova)
    setAviso(`Item removido. ${nova.length} ${nova.length === 1 ? 'item' : 'itens'} na lista.`)
    listaTitulo.current?.focus()
  }

  const mensagem = useMemo(() => montarMensagem(lista, CORES_VISIVEIS), [lista])
  const href = useMemo(() => linkWhatsApp(lista, CORES_VISIVEIS), [lista])

  return (
    <section id="prancha" aria-labelledby="prancha-titulo" className="papel-grade scroll-mt-4 border-y-2 border-tinta">
      <div className="mx-auto max-w-[1440px] px-4 pt-14 pb-20 md:px-10 md:pt-20">
        {/* cabeçalho em forma de carimbo de prancha */}
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <h2
            id="prancha-titulo"
            className="estencil text-[clamp(3.25rem,11vw,9rem)] text-tinta md:col-span-7"
          >
            Prancha
            <br />
            <span className="vazado">de escala</span>
          </h2>
          <div className="max-w-md md:col-span-5 md:justify-self-end">
            <p className="text-lg leading-snug">
              Em foto, todo bote parece do mesmo tamanho. Na régua, não. O G500 e o 800 Full estão aqui na mesma
              escala: 5,15 m contra 8,00 m.
            </p>
            <p className="mt-3 text-tinta-2">
              Toque num bote para abrir a ficha. Escolha o material e a cor, junte na lista e mande pelo WhatsApp.
            </p>
          </div>
        </div>

        {/* a prancha */}
        <div className="mt-10 border-2 border-tinta bg-papel/85 p-3 md:mt-14 md:p-6">
          <div className="ficha flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-tinta pb-2 text-xs uppercase">
            <span>Folha 02 · planta, vista de cima</span>
            <span>Em escala: o comprimento. Forma e largura: esquema.</span>
          </div>

          {/* régua horizontal (tablet e desktop) */}
          <div className="mt-6 hidden grid-cols-[12rem_1fr] gap-6 md:grid lg:grid-cols-[15rem_1fr]">
            <span className="ficha self-end text-xs text-tinta-2">metros</span>
            <Regua metros={REGUA_M} className="h-8" />
          </div>

          <ul className="mt-2 divide-y divide-grade md:mt-0">
            {MODELOS.map((m) => {
              const ativo = m.id === modeloId
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => escolherModelo(m.id)}
                    aria-pressed={ativo}
                    aria-controls="ficha"
                    aria-label={`${m.nome}, ${m.comprimentoTexto}. Abrir ficha`}
                    className={`group grid w-full grid-cols-[auto_1fr] items-end gap-4 py-6 text-left md:grid-cols-[12rem_1fr] md:items-center md:gap-6 md:py-8 lg:grid-cols-[15rem_1fr] ${
                      ativo ? 'text-marca' : 'text-tinta hover:text-marca'
                    }`}
                  >
                    {/* celular: régua vertical + bote de proa para cima, mesma escala para todos */}
                    <span
                      className="flex items-end gap-1 md:hidden"
                      style={{ '--m': m.comprimentoM, '--mr': Math.ceil(m.comprimentoM) } as CSSProperties}
                    >
                      <Regua
                        metros={Math.ceil(m.comprimentoM)}
                        orientacao="vertical"
                        className="h-[calc(var(--mr)*2.6rem)] w-8 text-tinta"
                      />
                      <PlantaBote
                        modelo={m}
                        orientacao="vertical"
                        traco={4}
                        className="h-[calc(var(--m)*2.6rem)] w-auto"
                      />
                    </span>

                    <span className="block self-center md:order-none">
                      <span className="estencil block text-[3.5rem] md:text-[4.25rem]">{m.casco}</span>
                      <span className="mt-2 block font-titulo text-xl font-semibold uppercase tracking-wide text-tinta">
                        {m.nome}
                      </span>
                      <span className="ficha mt-1 block text-sm text-tinta-2">{m.comprimentoTexto}</span>
                      <span
                        className={`ficha mt-3 inline-block border-b-2 text-xs uppercase ${
                          ativo ? 'border-marca' : 'border-transparent group-hover:border-current'
                        }`}
                      >
                        {ativo ? 'ficha aberta' : 'abrir ficha'}
                      </span>
                    </span>

                    {/* tablet/desktop: bote deitado, largura proporcional ao comprimento */}
                    <span className="relative hidden md:block">
                      <span className="block" style={{ width: `${(m.comprimentoM / REGUA_M) * 100}%` }}>
                        <PlantaBote modelo={m} traco={2} className="block h-auto w-full" />
                        <span className="ficha mt-1 flex items-center gap-2 text-xs">
                          <span className="h-px flex-1 bg-current" />
                          {m.comprimentoTexto}
                          <span className="h-px flex-1 bg-current" />
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <SoProposta>
            <div className="mt-4 border-t border-dashed border-tinta pt-4">
              <p className="ficha text-xs uppercase">Fora da escala até confirmar</p>
              <ul className="mt-2 space-y-2">
                {FORA_DE_ESCALA.map((f) => (
                  <li key={f.nome} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-titulo text-xl font-semibold uppercase">{f.nome}</span>
                    <Todo>{f.todo}</Todo>
                  </li>
                ))}
              </ul>
            </div>
          </SoProposta>
        </div>

        {/* ficha + lista */}
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div id="ficha" className="lg:col-span-7">
            <h3
              ref={fichaTitulo}
              tabIndex={-1}
              className="font-titulo text-3xl font-bold uppercase leading-none md:text-4xl"
            >
              {modelo ? `Ficha · ${modelo.nome}` : 'Ficha'}
            </h3>
            {!modelo ? (
              <p className="mt-4 max-w-md text-tinta-2">Escolha um bote na prancha para ver a ficha.</p>
            ) : (
              <Ficha
                modelo={modelo}
                versaoId={versaoId}
                materialId={materialId}
                corId={corId}
                falta={falta}
                onVersao={(v) => {
                  setVersaoId(v)
                  setFalta(null)
                }}
                onMaterial={(v) => {
                  setMaterialId(v)
                  setFalta(null)
                }}
                onCor={(v) => {
                  setCorId(v)
                  setFalta(null)
                }}
                onAdicionar={adicionar}
              />
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="border-2 border-tinta bg-papel p-5 md:p-6 lg:sticky lg:top-6">
              <h3
                ref={listaTitulo}
                tabIndex={-1}
                className="font-titulo text-3xl font-bold uppercase leading-none"
              >
                Lista de orçamento
              </h3>
              {lista.length === 0 ? (
                <p className="mt-4 text-tinta-2">Nenhum bote na lista ainda.</p>
              ) : (
                <ol className="mt-4 divide-y divide-grade border-y border-grade">
                  {lista.map((item, n) => {
                    const texto = descreverItem(item, CORES_VISIVEIS)
                    const chave = chaveItem(item)
                    return (
                      <li key={chave} className="flex items-start justify-between gap-4 py-3">
                        <span className="ficha text-sm">
                          {n + 1}. {texto}
                        </span>
                        <button
                          type="button"
                          onClick={() => remover(chave)}
                          className="link-tinta shrink-0 text-sm font-medium"
                          aria-label={`Remover ${texto} da lista`}
                        >
                          Remover
                        </button>
                      </li>
                    )
                  })}
                </ol>
              )}

              <p role="status" className="mt-3 min-h-5 text-sm text-tinta-2 empty:mt-0">
                {aviso}
              </p>

              {lista.length > 0 ? (
                <>
                  <a
                    href={href}
                    target="_blank"
                    rel={REL_EXTERNO}
                    className="mt-5 flex items-center justify-between bg-tinta px-5 py-4 font-titulo text-2xl font-bold uppercase text-papel hover:bg-marca"
                  >
                    Enviar pelo WhatsApp
                    <span className="ficha text-sm font-normal normal-case">
                      {lista.length} {lista.length === 1 ? 'item' : 'itens'}
                    </span>
                  </a>
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-tinta-2">Ver a mensagem que vai sair</summary>
                    <pre className="ficha mt-2 overflow-x-auto bg-papel-2 p-3 text-xs whitespace-pre-wrap">
                      {mensagem}
                    </pre>
                  </details>
                </>
              ) : null}
              <p className="mt-4 text-sm text-tinta-2">
                O WhatsApp abre com a mensagem pronta. Você confere e manda. Nada fica guardado aqui.
              </p>
              {!WHATSAPP_CONFIRMADO ? (
                <p className="mt-2">
                  <Todo>número de WhatsApp de atendimento (hoje: (11) 5621-0008)</Todo>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface FichaProps {
  modelo: Modelo
  versaoId: string | null
  materialId: MaterialId | null
  corId: string | null
  falta: string | null
  onVersao: (id: string) => void
  onMaterial: (id: MaterialId) => void
  onCor: (id: string) => void
  onAdicionar: () => void
}

function Ficha({ modelo, versaoId, materialId, corId, falta, onVersao, onMaterial, onCor, onAdicionar }: FichaProps) {
  const versao = modelo.versoes?.find((v) => v.id === versaoId)
  const linhas: Linha[] = [...modelo.linhas, ...(versao?.linhas ?? [])]
  const visiveis = linhas.filter((l) => l.valor !== undefined || PROPOSTA)

  return (
    <div className="mt-6">
      <dl className="ficha border-t-2 border-tinta text-sm">
        {visiveis.map((l) => (
          <div key={l.rotulo} className="grid grid-cols-[9rem_1fr] gap-3 border-b border-grade py-2 sm:grid-cols-[11rem_1fr]">
            <dt className="uppercase text-tinta-2">{l.rotulo}</dt>
            <dd className="m-0">{l.valor ?? <Todo>{l.todo}</Todo>}</dd>
          </div>
        ))}
      </dl>
      {modelo.versoes && !versao ? (
        <p className="mt-2 text-sm text-tinta-2">Escolha a versão para ver largura útil, tanque e carga.</p>
      ) : null}

      <div className="mt-8 space-y-7">
        {modelo.versoes ? (
          <Escolha
            legenda="Versão"
            nome={`versao-${modelo.id}`}
            opcoes={modelo.versoes.map((v) => ({ id: v.id, nome: v.nome }))}
            valor={versaoId}
            onChange={onVersao}
            erro={falta === 'versao' ? 'Escolha a versão.' : null}
          />
        ) : null}

        <Escolha
          legenda="Material dos tubos"
          nome={`material-${modelo.id}`}
          opcoes={MATERIAIS.filter((m) => modelo.materiais.includes(m.id))}
          valor={materialId}
          onChange={(id) => onMaterial(id as MaterialId)}
          erro={falta === 'material' ? 'Escolha o material.' : null}
        />

        {CORES_VISIVEIS.length > 0 ? (
          <fieldset aria-describedby={falta === 'cor' ? `erro-cor-${modelo.id}` : undefined}>
            <legend className="font-titulo text-xl font-semibold uppercase">Cor dos tubos</legend>
            {CORES_VISIVEIS.some((c) => !c.confirmada) ? (
              <p className="mt-1">
                <Todo>amostras provisórias: trocar pelas cores reais de Hypalon e PVC das fichas</Todo>
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-3">
              {CORES_VISIVEIS.map((c) => (
                <label
                  key={c.id}
                  className="flex cursor-pointer items-center gap-2 border-2 border-transparent py-1 pr-3 pl-1 has-checked:border-tinta has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-marca"
                >
                  <input
                    type="radio"
                    name={`cor-${modelo.id}`}
                    value={c.id}
                    checked={corId === c.id}
                    onChange={() => onCor(c.id)}
                    className="sr-only"
                  />
                  <span
                    className="block size-9 border border-tinta/40"
                    style={{ backgroundColor: c.hex }}
                    aria-hidden="true"
                  />
                  <span className="text-base">{c.nome}</span>
                </label>
              ))}
            </div>
            {falta === 'cor' ? (
              <p id={`erro-cor-${modelo.id}`} className="mt-2 text-sm font-medium text-marca">
                Escolha a cor.
              </p>
            ) : null}
          </fieldset>
        ) : null}

        <button
          type="button"
          onClick={onAdicionar}
          className="w-full border-2 border-tinta px-5 py-4 text-left font-titulo text-2xl font-bold uppercase hover:bg-tinta hover:text-papel sm:w-auto"
        >
          Adicionar à lista
        </button>
      </div>
    </div>
  )
}

interface EscolhaProps {
  legenda: string
  nome: string
  opcoes: ReadonlyArray<{ id: string; nome: string }>
  valor: string | null
  onChange: (id: string) => void
  erro: string | null
}

function Escolha({ legenda, nome, opcoes, valor, onChange, erro }: EscolhaProps) {
  const erroId = `erro-${nome}`
  return (
    <fieldset aria-describedby={erro ? erroId : undefined}>
      <legend className="font-titulo text-xl font-semibold uppercase">{legenda}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {opcoes.map((o) => (
          <label
            key={o.id}
            className="cursor-pointer border-2 border-tinta px-4 py-2 has-checked:bg-tinta has-checked:text-papel has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-marca"
          >
            <input
              type="radio"
              name={nome}
              value={o.id}
              checked={valor === o.id}
              onChange={() => onChange(o.id)}
              className="sr-only"
            />
            {o.nome}
          </label>
        ))}
      </div>
      {erro ? (
        <p id={erroId} className="mt-2 text-sm font-medium text-marca">
          {erro}
        </p>
      ) : null}
    </fieldset>
  )
}

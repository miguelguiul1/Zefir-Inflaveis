import { Foto } from '../components/Foto'
import { PlantaBote } from '../components/PlantaBote'
import { Todo } from '../components/Todo'
import { PROPOSTA } from '../config'
import { MODELOS } from '../content/catalogo'
import { foto } from '../content/fotos'

const g500 = MODELOS[0]!

export function Entrada() {
  const f = foto('entrada')
  const temFoto = Boolean(f)
  // Com foto, o texto fica num painel escuro só onde precisa: a foto continua viva
  // e o contraste não depende do que estiver por baixo (ver npm run contraste).
  const painel = temFoto ? 'painel-foto' : ''

  return (
    <header
      className={`relative isolate flex min-h-[100svh] flex-col overflow-hidden ${
        temFoto ? 'no-escuro bg-noite text-papel' : 'papel-grade text-tinta'
      }`}
    >
      {temFoto ? (
        <Foto
          id="entrada"
          prioridade
          sizes="100vw"
          selo={false}
          className="absolute inset-0 -z-10 h-full w-full"
        />
      ) : (
        // Sem foto aprovada: o próprio desenho do G500, grande, sangrando para fora da tela.
        <div
          className="pointer-events-none absolute bottom-[8svh] left-[4vw] -z-10 w-[125vw] text-tinta sm:left-[18vw] sm:w-[110vw] lg:bottom-[5svh] lg:left-[38vw] lg:w-[78vw]"
          aria-hidden="true"
        >
          {/* proa para a esquerda: a popa é que sai da tela */}
          <PlantaBote modelo={g500} traco={1.2} className="block h-auto w-full -scale-x-100" />
          <div className="ficha mt-2 flex items-center gap-3 pr-[38%] text-xs text-marca sm:text-sm">
            <span className="h-px w-6 bg-current" />
            G500 Geração II · 5,15 m
            <span className="h-px flex-1 bg-current" />
          </div>
        </div>
      )}

      {/* carimbo de prancha */}
      <div
        className={`ficha relative z-10 flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-current px-4 py-3 text-[0.6875rem] uppercase md:px-10 md:text-xs ${painel}`}
      >
        <span>Zefir Indústria e Comércio Ltda.</span>
        <span>São Paulo-SP · fundada em 1972</span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-4 pt-8 md:px-10 md:pt-12">
        <div className={temFoto ? `${painel} w-fit max-w-full p-5 md:p-8` : ''}>
          <h1 className="estencil text-[clamp(6rem,30vw,21rem)] leading-[0.78]">
            Zefir
            <span className="mt-3 block font-titulo text-[clamp(1.375rem,4.4vw,2.75rem)] font-semibold tracking-wide">
              Fábrica de botes infláveis
            </span>
          </h1>

          <p className="mt-6 max-w-[18ch] font-titulo text-[clamp(2rem,6vw,4rem)] font-bold uppercase leading-[0.9]">
            <span className={temFoto ? 'vazado vazado-papel' : 'vazado'}>O 4x4</span> dos mares.
          </p>

          <a
            href="#prancha"
            className="link-tinta mt-8 inline-flex w-fit items-baseline gap-3 font-titulo text-2xl font-bold uppercase md:text-3xl"
          >
            Montar meu orçamento
            <span aria-hidden="true" className="ficha text-base font-normal">
              ↓
            </span>
          </a>

          {PROPOSTA && f?.provisoria ? (
            <p className="ficha mt-6 w-fit bg-todo px-2 py-0.5 text-xs text-tinta">foto provisória (do site atual)</p>
          ) : null}
        </div>

        {!temFoto ? (
          <p className="mt-6 max-w-sm">
            <Todo>foto real do G500 para esta tela: aguardando os arquivos e a sua revisão (fotos/revisao.md)</Todo>
          </p>
        ) : null}
      </div>
    </header>
  )
}

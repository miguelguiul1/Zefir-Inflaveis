import { Foto } from '../components/Foto'
import { Todo } from '../components/Todo'
import { foto } from '../content/fotos'

export function Fabrica() {
  const temFoto = Boolean(foto('fabrica'))

  return (
    <section id="fabrica" aria-labelledby="fabrica-titulo" className="no-escuro overflow-hidden bg-noite text-papel">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-20 md:grid-cols-12 md:px-10 md:py-28">
        <p
          className="estencil vazado vazado-papel -ml-[0.05em] text-[clamp(7rem,34vw,26rem)] leading-[0.75] md:col-span-7"
          aria-hidden="true"
        >
          1972
        </p>
        <div className="md:col-span-5 md:self-end">
          <h2 id="fabrica-titulo" className="font-titulo text-4xl font-bold uppercase leading-none md:text-5xl">
            A fábrica
          </h2>
          <p className="mt-6 text-xl leading-relaxed">
            Em 1972, dois empresários brasileiros compraram a DSB Continental, do setor náutico alemão no Brasil. Dali
            nasceu a Zefir.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-papel/80">
            Hoje a Zefir é fábrica independente. Faz bote, balsa, caiaque, boia e brinquedo, e os acessórios saem
            daqui mesmo.
          </p>
          <p className="mt-6">
            <Todo className="text-tinta">
              &ldquo;líder em vendas de botes infláveis no Brasil&rdquo;: a Zefir diz isso, falta a fonte do dado
            </Todo>
          </p>
          {!temFoto ? (
            <p className="mt-3">
              <Todo className="text-tinta">fotos da fábrica: existem? Não havia nenhuma no material recebido</Todo>
            </p>
          ) : null}
        </div>
        {temFoto ? <Foto id="fabrica" sizes="(min-width: 768px) 60vw, 100vw" className="relative md:col-span-8 md:col-start-3" /> : null}
      </div>
    </section>
  )
}

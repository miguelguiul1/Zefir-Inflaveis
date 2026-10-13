import { Todo } from '../components/Todo'
import { CONTATO, PROPOSTA, REL_EXTERNO } from '../config'
import { ALEM_DOS_BOTES, LINHAS_DE_BOTE } from '../content/catalogo'

/** Índice das linhas em forma de livro de registro de estaleiro. */
export function Linhas() {
  return (
    <section id="linhas" aria-labelledby="linhas-titulo" className="bg-papel">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 md:px-10 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-8">
            <h2 id="linhas-titulo" className="font-titulo text-5xl font-bold uppercase leading-[0.9] md:text-6xl">
              Linhas de bote
            </h2>
            <p className="mt-5 max-w-sm">
              São oito linhas de bote. Somando tudo o que a fábrica faz, são mais de 35 modelos.
            </p>
            <p className="mt-4 max-w-sm text-tinta-2">
              Os modelos que não estão na prancha têm ficha no{' '}
              <a href={CONTATO.catalogoUrl} rel={REL_EXTERNO} className="link-tinta text-tinta">
                catálogo do site atual
              </a>
              .
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="ficha grid grid-cols-[3.5rem_1fr] border-b-2 border-tinta pb-2 text-xs uppercase text-tinta-2 md:grid-cols-[6rem_1fr_auto]">
            <span>Nº</span>
            <span>Linha</span>
            <span className="hidden md:block">{PROPOSTA ? 'Ficha' : ''}</span>
          </div>
          <ol className="m-0 list-none p-0">
            {LINHAS_DE_BOTE.map((l, i) => {
              const numero = String(i + 1).padStart(2, '0')
              return (
                <li
                  key={l.nome}
                  className="grid grid-cols-[3.5rem_1fr] items-baseline border-b border-tinta/30 py-3 md:grid-cols-[6rem_1fr_auto] md:py-4"
                >
                  <span className="estencil vazado text-4xl md:text-6xl" aria-hidden="true">
                    {numero}
                  </span>
                  <span className="font-titulo text-[clamp(1.75rem,6vw,3.5rem)] font-semibold uppercase leading-none">
                    {l.ancora ? (
                      <a href={l.ancora} className="hover:text-marca hover:underline">
                        {l.nome}
                      </a>
                    ) : (
                      l.nome
                    )}
                  </span>
                  <span className="col-start-2 mt-1 md:col-start-auto md:mt-0">
                    {l.ancora ? (
                      <span className="ficha text-xs uppercase text-tinta-2">ver abaixo</span>
                    ) : (
                      <Todo>modelos e medidas da linha</Todo>
                    )}
                  </span>
                </li>
              )
            })}
          </ol>

          <div className="mt-14 md:ml-[6rem]">
            <h3 className="font-titulo text-2xl font-semibold uppercase">Fora os botes</h3>
            <p className="mt-3 max-w-2xl text-xl leading-snug md:text-2xl">
              {ALEM_DOS_BOTES.map((item, i) => (
                <span key={item}>
                  {item}
                  {i < ALEM_DOS_BOTES.length - 1 ? <span className="px-2 text-marca">/</span> : '.'}
                </span>
              ))}
            </p>
            <p className="mt-4 max-w-xl text-tinta-2">Os acessórios a Zefir faz na própria fábrica.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

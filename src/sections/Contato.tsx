import { SoProposta, Todo } from '../components/Todo'
import { CONTATO, REDES_A_CONFIRMAR, REL_EXTERNO, WHATSAPP_CONFIRMADO, WHATSAPP_NUMERO } from '../config'

const whatsappDireto = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('Olá, Zefir! Vim pelo site.')}`

/** Contato em forma de carimbo (legenda) de prancha: uma grade com bordas. */
export function Contato() {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="scroll-mt-4 bg-papel">
      <div className="mx-auto max-w-[1440px] px-4 pt-20 pb-12 md:px-10 md:pt-28">
        <h2 id="contato-titulo" className="estencil text-[clamp(3.5rem,13vw,10rem)]">
          Fale com
          <br />a fábrica
        </h2>

        <dl className="mt-12 grid border-2 border-tinta md:grid-cols-6">
          <div className="border-b-2 border-tinta p-5 md:col-span-4 md:border-r-2 md:p-6">
            <dt className="ficha text-xs uppercase text-tinta-2">WhatsApp e telefone</dt>
            <dd className="m-0 mt-2">
              <a
                href={whatsappDireto}
                target="_blank"
                rel={REL_EXTERNO}
                className="block font-titulo text-[clamp(2.5rem,9vw,5.5rem)] font-bold leading-none hover:text-marca"
              >
                {CONTATO.telefoneExibicao}
              </a>
              <span className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                <a href={whatsappDireto} target="_blank" rel={REL_EXTERNO} className="link-tinta">
                  Abrir no WhatsApp
                </a>
                <a href={`tel:${CONTATO.telefoneLink}`} className="link-tinta">
                  Ligar
                </a>
              </span>
              {!WHATSAPP_CONFIRMADO ? (
                <span className="mt-3 block">
                  <Todo>confirmar que este número atende no WhatsApp</Todo>
                </span>
              ) : null}
            </dd>
          </div>

          <div className="border-b-2 border-tinta p-5 md:col-span-2 md:p-6">
            <dt className="ficha text-xs uppercase text-tinta-2">E-mail</dt>
            <dd className="m-0 mt-2">
              <a href={`mailto:${CONTATO.email}`} className="link-tinta text-xl break-all md:text-2xl">
                {CONTATO.email}
              </a>
            </dd>
          </div>

          <div className="border-b-2 border-tinta p-5 md:col-span-3 md:border-r-2 md:border-b-0 md:p-6">
            <dt className="ficha text-xs uppercase text-tinta-2">Endereço</dt>
            <dd className="m-0 mt-2 text-lg leading-snug">
              {CONTATO.endereco}
              <br />
              {CONTATO.bairro}, {CONTATO.cidade}
              <span className="mt-3 block">
                <a href={CONTATO.mapsUrl} target="_blank" rel={REL_EXTERNO} className="link-tinta">
                  Abrir no Google Maps
                </a>
              </span>
              <span className="mt-3 block">
                <Todo>CEP (a bio diz 04428-000, o Maps diz 04428-010) e horário de atendimento</Todo>
              </span>
            </dd>
          </div>

          <div className="p-5 md:col-span-3 md:p-6">
            <dt className="ficha text-xs uppercase text-tinta-2">Redes</dt>
            <dd className="m-0 mt-2">
              <a
                href={CONTATO.instagram.url}
                target="_blank"
                rel={REL_EXTERNO}
                className="link-tinta text-xl md:text-2xl"
              >
                Instagram {CONTATO.instagram.usuario}
              </a>
              <SoProposta>
                <span className="mt-3 block">
                  <Todo>endereços de {REDES_A_CONFIRMAR.join(', ')}</Todo>
                </span>
              </SoProposta>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

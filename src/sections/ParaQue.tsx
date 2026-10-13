import { Foto } from '../components/Foto'
import { Todo } from '../components/Todo'
import { foto } from '../content/fotos'

const USOS = ['Esqui', 'Mergulho', 'Pesca', 'Lazer'] as const

export function ParaQue() {
  const temFoto = Boolean(foto('uso'))

  return (
    <section aria-labelledby="usos-titulo" className="border-t-2 border-tinta bg-papel-2">
      {temFoto ? (
        <Foto id="uso" sizes="100vw" className="relative aspect-[4/3] w-full md:aspect-[21/9]" />
      ) : (
        // Sem foto aprovada, a seção abre com os usos em letra grande, sangrando à esquerda.
        <div className="overflow-hidden pt-16 md:pt-24" aria-hidden="true">
          <p className="estencil -ml-[0.06em] text-[clamp(4.5rem,19vw,17rem)] leading-[0.8] whitespace-nowrap">
            {USOS.map((u, i) => (
              <span key={u} className={i % 2 === 0 ? 'block' : 'vazado block pl-[12vw]'}>
                {u}
              </span>
            ))}
          </p>
        </div>
      )}

      <div className="mx-auto max-w-[1440px] px-4 pt-10 pb-20 md:px-10 md:pb-28">
        <div className="md:ml-[33%] md:max-w-[38rem]">
          <h2 id="usos-titulo" className="font-titulo text-4xl font-bold uppercase leading-none md:text-5xl">
            Para que serve
          </h2>
          <p className="mt-6 text-xl leading-relaxed">
            A ficha do G500 fala de três coisas: esquiar, mergulhar e pescar. E tem o passeio de fim de semana, que
            também é motivo bom para ter bote.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-tinta-2">
            Casco em V de fibra, deck antiderrapante, quatro compartimentos e tanque de 110 litros. A carga é de 1.800
            kg e o motor vai de 90 a 175 hp. Os tubos saem em CSM Hypalon ou PVC nitrílico, em várias cores.
          </p>
          {!temFoto ? (
            <p className="mt-6">
              <Todo>foto grande do G500 em uso, sem pessoas não autorizadas</Todo>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

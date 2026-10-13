import { Todo } from '../components/Todo'
import { CONTATO, REL_EXTERNO } from '../config'

export function Revendedores() {
  return (
    <section aria-labelledby="revenda-titulo" className="border-y border-tinta bg-papel-2">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-8 md:flex-row md:items-baseline md:gap-8 md:px-10">
        <h2 id="revenda-titulo" className="font-titulo text-2xl font-bold uppercase leading-none">
          Revendedores
        </h2>
        <p className="text-lg">
          Para comprar de um representante, a lista está no{' '}
          <a href={CONTATO.revendedoresUrl} target="_blank" rel={REL_EXTERNO} className="link-tinta font-medium">
            site atual da Zefir
          </a>
          .
        </p>
        <Todo>lista própria de revendedores neste site</Todo>
      </div>
    </section>
  )
}

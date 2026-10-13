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
          Prefere comprar de um representante perto de você?{' '}
          <a href={CONTATO.revendedoresUrl} target="_blank" rel={REL_EXTERNO} className="link-tinta font-medium">
            Veja a lista de representantes
          </a>
          .
        </p>
        <Todo>lista própria de revendedores neste site</Todo>
      </div>
    </section>
  )
}

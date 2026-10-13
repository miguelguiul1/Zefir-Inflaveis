import { CONTATO } from '../config'

export function Rodape() {
  return (
    <footer className="bg-papel">
      <div className="ficha mx-auto flex max-w-[1440px] flex-col gap-1 border-t border-tinta px-4 py-6 text-xs uppercase text-tinta-2 md:flex-row md:justify-between md:px-10">
        <span>{CONTATO.razaoSocial}</span>
        <span>
          {CONTATO.endereco} · {CONTATO.bairro} · {CONTATO.cidade}
        </span>
        <span>O 4x4 dos mares</span>
      </div>
    </footer>
  )
}

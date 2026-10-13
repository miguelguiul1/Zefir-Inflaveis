import { FaixaProposta } from './components/FaixaProposta'
import { Contato } from './sections/Contato'
import { Entrada } from './sections/Entrada'
import { Fabrica } from './sections/Fabrica'
import { Linhas } from './sections/Linhas'
import { Militar } from './sections/Militar'
import { ParaQue } from './sections/ParaQue'
import { Prancha } from './sections/Prancha'
import { Revendedores } from './sections/Revendedores'
import { Rodape } from './sections/Rodape'

export default function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only-focusable absolute top-2 left-2 z-50 bg-tinta px-4 py-2 text-papel"
      >
        Pular para o conteúdo
      </a>
      <FaixaProposta />
      <Entrada />
      <main id="conteudo">
        <Prancha />
        <Linhas />
        <ParaQue />
        <Fabrica />
        <Militar />
        <Revendedores />
        <Contato />
      </main>
      <Rodape />
    </>
  )
}

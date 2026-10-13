# Contraste (WCAG 2.1 AA)

Gerado por `npm run contraste` a partir dos tokens de `src/index.css`.

| texto | fundo | razão | mínimo | resultado | onde |
|---|---|---|---|---|---|
| tinta `#17222b` | papel `#f1ede3` | 13.82:1 | 4.5:1 | passa | texto principal, títulos, fichas |
| tinta-2 `#4a555d` | papel `#f1ede3` | 6.54:1 | 4.5:1 | passa | texto secundário, rótulos da ficha |
| marca `#b0301a` | papel `#f1ede3` | 5.47:1 | 4.5:1 | passa | bote selecionado, "ficha aberta", avisos de erro, legenda da entrada |
| tinta `#17222b` | papel-2 `#e6dfcf` | 12.17:1 | 4.5:1 | passa | Para que serve, Revendedores, prévia da mensagem |
| tinta-2 `#4a555d` | papel-2 `#e6dfcf` | 5.76:1 | 4.5:1 | passa | Para que serve (texto secundário) |
| papel `#f1ede3` | tinta `#17222b` | 13.82:1 | 4.5:1 | passa | botão Enviar pelo WhatsApp, faixa protótipo, link Pular |
| papel `#f1ede3` | marca `#b0301a` | 5.47:1 | 4.5:1 | passa | botão Enviar pelo WhatsApp com o mouse em cima (inclui o contador "2 itens") |
| papel `#f1ede3` | noite `#111a21` | 15.05:1 | 4.5:1 | passa | A fábrica |
| papel/80 `#c4c3bc` | noite `#111a21` | 9.95:1 | 4.5:1 | passa | A fábrica (texto secundário) |
| tinta `#17222b` | todo `#f2d03b` | 10.66:1 | 4.5:1 | passa | marca TODO-CONFIRMAR (só proposta) |
| tinta `#17222b` | todo-claro `#f8e8a6` | 13.14:1 | 4.5:1 | passa | explicação do TODO-CONFIRMAR (só proposta) |
| marca `#b0301a` | papel `#f1ede3` | 5.47:1 | 3:1 | passa | contorno de foco sobre papel |
| marca-viva `#f06a4a` | noite `#111a21` | 5.75:1 | 3:1 | passa | contorno de foco sobre fundo escuro |
| tinta `#17222b` | papel `#f1ede3` | 13.82:1 | 3:1 | passa | borda dos botões de escolha |
| papel `#f1ede3` | painel noite 80% sobre foto branca `#41484d` | 7.95:1 | 4.5:1 | passa | texto da entrada sobre foto (pior caso) |

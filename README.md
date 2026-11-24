# Controle de Gastos

Aplicação web para registrar entradas e saídas de dinheiro, acompanhar o saldo do mês e exportar os lançamentos em CSV. Feita com **HTML, CSS e JavaScript puro**, sem frameworks e sem servidor.

**Demonstração:** https://yurymq.github.io/controle-de-gastos/ (veja a seção "Publicar no GitHub Pages")

## O que o projeto faz

- Adiciona lançamentos com descrição, valor, data, categoria e tipo (entrada ou saída)
- Mostra o saldo do mês, o total de entradas e de saídas e uma barra com a proporção entre elas
- Filtra os lançamentos por mês
- Remove lançamentos
- Exporta o mês escolhido para CSV (abre no Excel com acentos corretos)
- Guarda os dados no navegador com `localStorage`, então eles continuam ali ao recarregar a página
- Funciona no celular e no computador, com navegação por teclado

## Decisões técnicas

- **Valores em centavos.** Os cálculos usam números inteiros para evitar erros de ponto flutuante (em JavaScript, `0.1 + 0.2` dá `0.30000000000000004`).
- **Lógica separada da interface.** O arquivo `js/logica.js` tem apenas funções puras (cálculo, validação, filtro e CSV). O arquivo `js/app.js` cuida do DOM. Essa separação permite testar a lógica no Node sem abrir o navegador.
- **Sem injeção de HTML.** Os textos digitados pelo usuário entram na página com `textContent`, nunca com `innerHTML`.
- **Acessibilidade.** Campos com `label`, mensagens de erro com `role="alert"`, foco visível e respeito a `prefers-reduced-motion`.

## Tecnologias

- HTML5, CSS3 (Grid, Flexbox, variáveis CSS)
- JavaScript (ES6+)
- Testes com o executor nativo do Node (`node:test`)

## Como executar

Não precisa instalar nada. Baixe o projeto e abra o `index.html` no navegador.

```bash
git clone https://github.com/Yurymq/controle-de-gastos.git
cd controle-de-gastos
# abra o index.html no navegador
```

## Como rodar os testes

Precisa do Node.js 18 ou superior.

```bash
npm test
```

Os testes cobrem conversão para centavos, validação, filtro por mês, cálculo do resumo (incluindo lista vazia) e geração do CSV.

## Estrutura do projeto

```
controle-de-gastos/
├── index.html
├── style.css
├── js/
│   ├── logica.js        # funções puras (testáveis)
│   └── app.js           # interface e localStorage
├── tests/
│   └── logica.test.js
└── package.json
```

## Publicar no GitHub Pages

1. Suba o projeto para um repositório chamado `controle-de-gastos`.
2. No repositório, vá em **Settings → Pages**.
3. Em **Branch**, escolha `main` e a pasta `/ (root)` e clique em **Save**.
4. Em alguns minutos o site fica disponível no endereço da demonstração acima.

## Próximos passos

- [ ] Editar um lançamento existente
- [ ] Gráfico de gastos por categoria
- [ ] Definir um limite mensal e avisar quando for ultrapassado
- [ ] Importar um arquivo CSV

## Autor

**Yury Mendonça**, estudante de Engenharia de Software (UGB)
[GitHub](https://github.com/Yurymq) · yurymendonca88@gmail.com

## Licença

MIT. Veja o arquivo `LICENSE`.

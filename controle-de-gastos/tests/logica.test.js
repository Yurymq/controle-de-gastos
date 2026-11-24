const test = require("node:test");
const assert = require("node:assert/strict");
const L = require("../js/logica.js");

const exemplo = [
  { id: 1, descricao: "Salário", centavos: 150000, data: "2026-11-05", tipo: "entrada", categoria: "Salário" },
  { id: 2, descricao: "Mercado", centavos: 45090, data: "2026-11-10", tipo: "saida", categoria: "Alimentação" },
  { id: 3, descricao: "Ônibus", centavos: 9000, data: "2026-10-30", tipo: "saida", categoria: "Transporte" },
];

test("paraCentavos evita erro de ponto flutuante", () => {
  assert.equal(L.paraCentavos("0.1") + L.paraCentavos("0.2"), 30);
  assert.equal(L.paraCentavos("19.99"), 1999);
});

test("validarLancamento rejeita dados inválidos", () => {
  const ok = { descricao: "Café", valor: "5", data: "2026-11-24", tipo: "saida" };
  assert.equal(L.validarLancamento(ok), null);
  assert.match(L.validarLancamento({ ...ok, descricao: "  " }), /descrição/);
  assert.match(L.validarLancamento({ ...ok, valor: "0" }), /maior que zero/);
  assert.match(L.validarLancamento({ ...ok, valor: "" }), /maior que zero/);
  assert.match(L.validarLancamento({ ...ok, data: "" }), /data/);
  assert.match(L.validarLancamento({ ...ok, tipo: "x" }), /entrada ou saída/);
});

test("filtrarPorMes separa os lançamentos por mês", () => {
  assert.equal(L.filtrarPorMes(exemplo, "2026-11").length, 2);
  assert.equal(L.filtrarPorMes(exemplo, "2026-10").length, 1);
  assert.equal(L.filtrarPorMes(exemplo, "2026-09").length, 0);
});

test("calcularResumo soma entradas, saídas e saldo", () => {
  const r = L.calcularResumo(L.filtrarPorMes(exemplo, "2026-11"));
  assert.equal(r.entradas, 150000);
  assert.equal(r.saidas, 45090);
  assert.equal(r.saldo, 104910);
  assert.ok(Math.abs(r.percentualEntradas + r.percentualSaidas - 100) < 1e-9);
});

test("calcularResumo com lista vazia não divide por zero", () => {
  const r = L.calcularResumo([]);
  assert.deepEqual(r, { entradas: 0, saidas: 0, saldo: 0, percentualEntradas: 0, percentualSaidas: 0 });
});

test("paraCSV gera cabeçalho, escapa aspas e usa vírgula decimal", () => {
  const csv = L.paraCSV([
    { id: 9, descricao: 'Livro "JS"', centavos: 4590, data: "2026-11-02", tipo: "saida", categoria: "Estudos" },
  ]);
  const [cabecalho, linha] = csv.split("\n");
  assert.equal(cabecalho, "Data;Descrição;Categoria;Tipo;Valor");
  assert.equal(linha, '02/11/2026;"Livro ""JS""";"Estudos";saida;45,90');
});

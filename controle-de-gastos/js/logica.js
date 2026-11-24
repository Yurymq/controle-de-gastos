/**
 * Funções puras (sem acesso ao DOM), por isso fáceis de testar.
 * Valores monetários são tratados em centavos (inteiros) para evitar
 * erros de arredondamento como 0.1 + 0.2 = 0.30000000000000004.
 */
(function (raiz, fabrica) {
  const api = fabrica();
  if (typeof module === "object" && module.exports) {
    module.exports = api; // Node (testes)
  } else {
    raiz.Logica = api; // navegador
  }
})(typeof self !== "undefined" ? self : this, function () {
  function paraCentavos(valor) {
    return Math.round(Number(valor) * 100);
  }

  function formatarMoeda(centavos) {
    return (centavos / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function validarLancamento({ descricao, valor, data, tipo }) {
    if (!descricao || !descricao.trim()) return "Informe uma descrição.";
    const centavos = paraCentavos(valor);
    if (!Number.isFinite(centavos) || centavos <= 0) {
      return "Informe um valor maior que zero.";
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data || "")) return "Informe uma data válida.";
    if (tipo !== "entrada" && tipo !== "saida") return "Escolha entrada ou saída.";
    return null;
  }

  function filtrarPorMes(lancamentos, mes) {
    // mes no formato "AAAA-MM"; data no formato "AAAA-MM-DD"
    return lancamentos.filter((l) => l.data.startsWith(mes));
  }

  function calcularResumo(lancamentos) {
    let entradas = 0;
    let saidas = 0;
    for (const l of lancamentos) {
      if (l.tipo === "entrada") entradas += l.centavos;
      else saidas += l.centavos;
    }
    const total = entradas + saidas;
    return {
      entradas,
      saidas,
      saldo: entradas - saidas,
      percentualEntradas: total === 0 ? 0 : (entradas / total) * 100,
      percentualSaidas: total === 0 ? 0 : (saidas / total) * 100,
    };
  }

  function formatarData(iso) {
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function paraCSV(lancamentos) {
    const escapar = (t) => `"${String(t).replace(/"/g, '""')}"`;
    const linhas = lancamentos.map((l) =>
      [
        formatarData(l.data),
        escapar(l.descricao),
        escapar(l.categoria),
        l.tipo,
        (l.centavos / 100).toFixed(2).replace(".", ","),
      ].join(";")
    );
    return ["Data;Descrição;Categoria;Tipo;Valor", ...linhas].join("\n");
  }

  return {
    paraCentavos,
    formatarMoeda,
    validarLancamento,
    filtrarPorMes,
    calcularResumo,
    formatarData,
    paraCSV,
  };
});

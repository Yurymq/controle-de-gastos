/* Interface: lê o formulário, guarda no localStorage e desenha a tela. */
(function () {
  const CHAVE = "controle-de-gastos:lancamentos";

  const $ = (id) => document.getElementById(id);
  const form = $("form");
  const filtroMes = $("filtro-mes");
  const campoData = $("data");

  let lancamentos = carregar();

  function carregar() {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE));
      return Array.isArray(salvo) ? salvo : [];
    } catch (e) {
      return [];
    }
  }

  function salvar() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(lancamentos));
    } catch (e) {
      mostrarErro("Não foi possível salvar neste navegador.");
    }
  }

  function hojeISO() {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mes}-${dia}`;
  }

  function mostrarErro(msg) {
    const erro = $("erro");
    erro.textContent = msg || "";
    erro.hidden = !msg;
  }

  function desenhar() {
    const doMes = Logica.filtrarPorMes(lancamentos, filtroMes.value)
      .sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id);
    const resumo = Logica.calcularResumo(doMes);

    $("saldo").textContent = Logica.formatarMoeda(resumo.saldo);
    $("saldo").classList.toggle("negativo", resumo.saldo < 0);
    $("total-entradas").textContent = Logica.formatarMoeda(resumo.entradas);
    $("total-saidas").textContent = Logica.formatarMoeda(resumo.saidas);
    $("barra-entrada").style.width = resumo.percentualEntradas + "%";
    $("barra-saida").style.width = resumo.percentualSaidas + "%";

    const ul = $("lancamentos");
    ul.textContent = "";
    for (const l of doMes) {
      const li = document.createElement("li");
      li.className = "item " + l.tipo;

      const faixa = document.createElement("span");
      faixa.className = "faixa";

      const texto = document.createElement("div");
      const desc = document.createElement("div");
      desc.className = "desc";
      desc.textContent = l.descricao; // textContent evita injeção de HTML
      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = `${l.categoria} · ${Logica.formatarData(l.data)}`;
      texto.append(desc, meta);

      const quantia = document.createElement("span");
      quantia.className = "quantia";
      quantia.textContent =
        (l.tipo === "saida" ? "−" : "+") + Logica.formatarMoeda(l.centavos);

      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "remover";
      botao.textContent = "Remover";
      botao.setAttribute("aria-label", `Remover ${l.descricao}`);
      botao.addEventListener("click", () => remover(l.id));

      li.append(faixa, texto, quantia, botao);
      ul.append(li);
    }
    $("vazio").hidden = doMes.length > 0;
  }

  function remover(id) {
    lancamentos = lancamentos.filter((l) => l.id !== id);
    salvar();
    desenhar();
  }

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = {
      descricao: form.descricao.value,
      valor: form.valor.value,
      data: form.data.value,
      tipo: form.tipo.value,
      categoria: form.categoria.value,
    };
    const erro = Logica.validarLancamento(dados);
    if (erro) {
      mostrarErro(erro);
      return;
    }
    mostrarErro("");
    lancamentos.push({
      id: Date.now(),
      descricao: dados.descricao.trim(),
      centavos: Logica.paraCentavos(dados.valor),
      data: dados.data,
      tipo: dados.tipo,
      categoria: dados.categoria,
    });
    salvar();
    // Mostra o mês do lançamento recém-criado
    filtroMes.value = dados.data.slice(0, 7);
    form.descricao.value = "";
    form.valor.value = "";
    form.descricao.focus();
    desenhar();
  });

  $("exportar").addEventListener("click", () => {
    const doMes = Logica.filtrarPorMes(lancamentos, filtroMes.value);
    if (doMes.length === 0) {
      mostrarErro("Não há lançamentos neste mês para exportar.");
      return;
    }
    mostrarErro("");
    // BOM no início para o Excel abrir os acentos corretamente
    const blob = new Blob(["\ufeff" + Logica.paraCSV(doMes)], {
      type: "text/csv;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `gastos-${filtroMes.value}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  });

  filtroMes.addEventListener("change", desenhar);

  campoData.value = hojeISO();
  filtroMes.value = hojeISO().slice(0, 7);
  desenhar();
})();

document.addEventListener("DOMContentLoaded", () => {

  /* ===== Ano automático no rodapé ===== */
  document.getElementById("ano").textContent = new Date().getFullYear();

  /* ===== Menu mobile ===== */
  const botaoMenu = document.querySelector(".menu-btn");
  const menu = document.querySelector(".menu");

  botaoMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    botaoMenu.classList.toggle("ativo", aberto);
    botaoMenu.setAttribute("aria-expanded", aberto);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("aberto");
      botaoMenu.classList.remove("ativo");
      botaoMenu.setAttribute("aria-expanded", "false");
    });
  });

  /* ===== Destaque do link da seção atual ===== */
  const links = document.querySelectorAll(".link-nav");
  const secoes = document.querySelectorAll("main section[id]");

  const observadorSecoes = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        links.forEach((link) => {
          link.classList.toggle("ativo", link.getAttribute("href") === `#${entrada.target.id}`);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  secoes.forEach((secao) => observadorSecoes.observe(secao));

  /* ===== Animação de entrada ao rolar ===== */
  const revelar = document.querySelectorAll(".reveal");

  const observadorRevelar = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observadorRevelar.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  revelar.forEach((el) => observadorRevelar.observe(el));

  /* ===== Contadores das estatísticas ===== */
  function animarContador(el) {
    const alvo = Number(el.dataset.alvo);
    const duracao = 1000;
    const inicio = performance.now();

    function passo(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      el.textContent = Math.round(progresso * alvo);
      if (progresso < 1) requestAnimationFrame(passo);
    }

    requestAnimationFrame(passo);
  }

  const numeros = document.querySelectorAll(".stat-numero");
  const observadorNumeros = new IntersectionObserver((entradas, obs) => {
    if (entradas[0].isIntersecting) {
      numeros.forEach(animarContador);
      obs.disconnect();
    }
  }, { threshold: 0.5 });

  if (numeros.length) observadorNumeros.observe(numeros[0].closest(".stats-grid"));

  /* ===== Barras de habilidades ===== */
  const barras = document.querySelectorAll(".barra span");
  const observadorBarras = new IntersectionObserver((entradas, obs) => {
    if (entradas[0].isIntersecting) {
      barras.forEach((barra) => (barra.style.width = barra.dataset.largura));
      obs.disconnect();
    }
  }, { threshold: 0.3 });

  observadorBarras.observe(document.getElementById("habilidades"));

  /* ===== Modais dos projetos ===== */
  function abrirModal(id) {
    document.getElementById(id).classList.add("aberto");
    document.body.style.overflow = "hidden";
  }

  function fecharModais() {
    document.querySelectorAll(".modal.aberto").forEach((m) => m.classList.remove("aberto"));
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-modal]").forEach((botao) => {
    botao.addEventListener("click", () => abrirModal(botao.dataset.modal));
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) fecharModais();
    });
    modal.querySelector(".modal-fechar").addEventListener("click", fecharModais);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharModais();
  });

  /* ===== Formulário de contato ===== */
  const form = document.getElementById("form-contato");
  const feedback = document.getElementById("feedback");

  function validarEmail(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  function mostrarErro(campo, mensagem) {
    const grupo = campo.closest(".campo");
    const erro = form.querySelector(`[data-para="${campo.name}"]`);
    grupo.classList.toggle("invalido", Boolean(mensagem));
    erro.textContent = mensagem || "";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const { nome, email, mensagem } = form.elements;

    mostrarErro(nome, nome.value.trim() ? "" : "Informe seu nome.");
    mostrarErro(email,
      !email.value.trim() ? "Informe seu e-mail."
      : !validarEmail(email.value) ? "E-mail inválido."
      : "");
    mostrarErro(mensagem,
      mensagem.value.trim().length < 10 ? "Escreva pelo menos 10 caracteres." : "");

    const temErro = [nome, email, mensagem]
      .some((campo) => campo.closest(".campo").classList.contains("invalido"));

    if (temErro) {
      feedback.className = "feedback erro-geral";
      feedback.textContent = "Corrija os campos destacados.";
      return;
    }

    // Demonstração: para enviar de verdade, integre com um serviço como o Formspree
    feedback.className = "feedback sucesso";
    feedback.textContent = "Mensagem enviada com sucesso! Obrigado pelo contato.";
    form.reset();
  });

  form.querySelectorAll("input, textarea").forEach((campo) => {
    campo.addEventListener("input", () => mostrarErro(campo, ""));
  });
});

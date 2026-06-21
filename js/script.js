/**
 * ============================================================================
 * BLUEMATH — SCRIPT GLOBAL
 * Arquivo: js/script.js
 * Descrição: Comportamentos compartilhados por TODAS as páginas do site:
 *   - Menu hambúrguer responsivo (mobile)
 *   - Animação de fade-in ao rolar a página (Intersection Observer)
 *   - Accordion de Perguntas Frequentes (FAQ)
 *   - Atualização automática do ano no rodapé
 *   - Marcação do link de navegação ativo (acessibilidade / UX)
 * Todo o código é JavaScript puro (Vanilla JS ES6+), sem dependências.
 * ============================================================================
 */
 
document.addEventListener('DOMContentLoaded', () => {
  inicializarMenuMobile();
  inicializarFadeInScroll();
  inicializarFaqAccordion();
  atualizarAnoRodape();
});
 
/**
 * Controla a abertura/fechamento do menu de navegação em telas pequenas.
 * Usa atributos ARIA para manter a acessibilidade (leitores de tela).
 */
function inicializarMenuMobile() {
  const botaoToggle = document.querySelector('.nav-toggle');
  const linksNav = document.querySelector('.nav-links');
 
  if (!botaoToggle || !linksNav) return;
 
  botaoToggle.addEventListener('click', () => {
    const estaAberto = linksNav.classList.toggle('is-open');
    botaoToggle.classList.toggle('is-active', estaAberto);
    botaoToggle.setAttribute('aria-expanded', String(estaAberto));
  });
 
  // Fecha o menu automaticamente ao clicar em um link (melhora a UX mobile)
  linksNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      linksNav.classList.remove('is-open');
      botaoToggle.classList.remove('is-active');
      botaoToggle.setAttribute('aria-expanded', 'false');
    });
  });
 
  // Fecha o menu com a tecla ESC (acessibilidade via teclado)
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && linksNav.classList.contains('is-open')) {
      linksNav.classList.remove('is-open');
      botaoToggle.classList.remove('is-active');
      botaoToggle.focus();
    }
  });
}
 
/**
 * Observa elementos com a classe '.fade-in-on-scroll' e adiciona a classe
 * '.is-visible' quando eles entram na viewport, disparando a transição CSS.
 */
function inicializarFadeInScroll() {
  const elementos = document.querySelectorAll('.fade-in-on-scroll');
  if (!elementos.length) return;
 
  // Respeita a preferência do usuário por movimento reduzido
  const prefereReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefereReduzido) {
    elementos.forEach((el) => el.classList.add('is-visible'));
    return;
  }
 
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('is-visible');
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
 
  elementos.forEach((el) => observador.observe(el));
}
 
/**
 * Implementa o comportamento de "sanfona" (accordion) para a seção de FAQ,
 * presente na landing page. Cada pergunta controla sua própria resposta.
 */
function inicializarFaqAccordion() {
  const perguntas = document.querySelectorAll('.faq-question');
  if (!perguntas.length) return;
 
  perguntas.forEach((pergunta) => {
    pergunta.addEventListener('click', () => {
      const item = pergunta.closest('.faq-item');
      const estaAberto = item.classList.contains('is-open');
 
      // Fecha os demais itens (comportamento de accordion exclusivo)
      document.querySelectorAll('.faq-item.is-open').forEach((aberto) => {
        if (aberto !== item) {
          aberto.classList.remove('is-open');
          aberto.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });
 
      item.classList.toggle('is-open', !estaAberto);
      pergunta.setAttribute('aria-expanded', String(!estaAberto));
    });
  });
}
 
/**
 * Atualiza dinamicamente o ano exibido no rodapé (©), evitando que a
 * informação fique desatualizada manualmente em cada página.
 */
function atualizarAnoRodape() {
  const spanAno = document.querySelector('[data-ano-atual]');
  if (spanAno) spanAno.textContent = new Date().getFullYear();
}
 
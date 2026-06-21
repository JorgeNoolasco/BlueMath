/**
 * ============================================================================
 * BLUEMATH — LÓGICA DA PÁGINA DE PERFIL
 * Arquivo: js/perfil.js
 * Descrição: Controla o Quiz de Personalização multi-etapas (wizard) exibido
 * em pages/perfil.html, salva as respostas do usuário em localStorage e
 * renderiza o "Resumo do Perfil" assim que o quiz é concluído.
 * JavaScript puro (Vanilla JS), sem dependências externas.
 * ============================================================================
 */

// Chave usada para persistir o perfil do usuário no navegador
const CHAVE_PERFIL = 'bluemath_perfil_usuario';

// Estado das respostas do quiz, preenchido conforme o usuário avança
const respostasQuiz = {
  nivelEstudo: null,
  autoavaliacao: null,
  dificuldades: [],
  confortaveis: [],
  estiloAprendizado: null,
};

let etapaAtual = 1;
let totalEtapas = 0;

document.addEventListener('DOMContentLoaded', () => {
  const containerQuiz = document.getElementById('quiz-container');
  if (containerQuiz) {
    totalEtapas = document.querySelectorAll('.quiz-step').length;
    inicializarQuiz();
  }

  // Se já existe um perfil salvo, exibe o resumo direto (sem repetir o quiz)
  exibirResumoPerfilSalvo();
});

/**
 * Liga os eventos de navegação (avançar/voltar), seleção de opções e barra
 * de progresso do quiz.
 */
function inicializarQuiz() {
  atualizarProgresso();
  atualizarEstadoBotoes();

  document.querySelectorAll('.btn-quiz-next').forEach((botao) => {
    botao.addEventListener('click', avancarEtapa);
  });
  document.querySelectorAll('.btn-quiz-prev').forEach((botao) => {
    botao.addEventListener('click', voltarEtapa);
  });

  // Captura a seleção de cada opção (rádio ou checkbox) por etapa
  document.querySelectorAll('.option-item input').forEach((input) => {
    input.addEventListener('change', () => {
      registrarResposta(input);
      atualizarEstadoBotoes();
    });
  });

  const botaoFinalizar = document.getElementById('btn-finalizar-quiz');
  if (botaoFinalizar) botaoFinalizar.addEventListener('click', finalizarQuiz);
}

/** Registra a resposta selecionada no objeto de estado `respostasQuiz`. */
function registrarResposta(input) {
  const campo = input.name; // ex: "nivelEstudo", "dificuldades"
  if (input.type === 'checkbox') {
    const selecionados = Array.from(
      document.querySelectorAll(`input[name="${campo}"]:checked`)
    ).map((el) => el.value);
    respostasQuiz[campo] = selecionados;
  } else {
    respostasQuiz[campo] = input.value;
  }
}

/** Avança para a próxima etapa do quiz, validando se há uma resposta. */
function avancarEtapa() {
  const etapaEl = document.querySelector(`.quiz-step[data-step="${etapaAtual}"]`);
  const obrigatorio = etapaEl?.dataset.required !== 'false';
  const respondida = etapaEl.querySelector('input:checked');

  if (obrigatorio && !respondida) {
    etapaEl.classList.add('shake');
    setTimeout(() => etapaEl.classList.remove('shake'), 400);
    return;
  }

  if (etapaAtual < totalEtapas) {
    etapaAtual += 1;
    mostrarEtapa(etapaAtual);
  }
}

/** Retorna para a etapa anterior do quiz. */
function voltarEtapa() {
  if (etapaAtual > 1) {
    etapaAtual -= 1;
    mostrarEtapa(etapaAtual);
  }
}

/** Exibe a etapa correspondente e oculta as demais. */
function mostrarEtapa(numero) {
  document.querySelectorAll('.quiz-step').forEach((step) => {
    step.classList.toggle('is-active', Number(step.dataset.step) === numero);
  });
  atualizarProgresso();
  atualizarEstadoBotoes();
  document.getElementById('quiz-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Atualiza a barra de progresso visual e o texto "Passo X de Y". */
function atualizarProgresso() {
  const percentual = Math.round((etapaAtual / totalEtapas) * 100);
  const barra = document.getElementById('quiz-progress-bar');
  const texto = document.getElementById('quiz-progress-text');
  if (barra) barra.style.width = `${percentual}%`;
  if (texto) texto.textContent = `Passo ${etapaAtual} de ${totalEtapas}`;
}

/** Mostra/oculta os botões de Voltar conforme a etapa atual. */
function atualizarEstadoBotoes() {
  document.querySelectorAll('.btn-quiz-prev').forEach((botao) => {
    botao.style.visibility = etapaAtual === 1 ? 'hidden' : 'visible';
  });
}

/**
 * Finaliza o quiz: calcula um nível sugerido com base nas respostas,
 * salva tudo em localStorage e exibe a tela de sucesso com o resumo.
 */
function finalizarQuiz() {
  const perfil = {
    ...respostasQuiz,
    dataConclusao: new Date().toISOString(),
    nivelXp: calcularNivelSugerido(respostasQuiz.autoavaliacao),
  };

  localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));

  document.querySelectorAll('.quiz-step').forEach((s) => s.classList.remove('is-active'));
  document.getElementById('quiz-sucesso')?.classList.add('is-active');
  renderizarResumo(perfil);
}

/** Sugere um "nível" textual simples a partir da autoavaliação do usuário. */
function calcularNivelSugerido(autoavaliacao) {
  const mapa = {
    iniciante: 'Nível 1 · Bronze',
    basico: 'Nível 5 · Bronze',
    intermediario: 'Nível 12 · Prata',
    avancado: 'Nível 20 · Ouro',
  };
  return mapa[autoavaliacao] || 'Nível 1 · Bronze';
}

/** Se já existe perfil salvo, preenche o painel de resumo automaticamente. */
function exibirResumoPerfilSalvo() {
  const dadosSalvos = localStorage.getItem(CHAVE_PERFIL);
  if (!dadosSalvos) return;

  try {
    const perfil = JSON.parse(dadosSalvos);
    renderizarResumo(perfil);
  } catch (erro) {
    console.error('Não foi possível ler o perfil salvo:', erro);
  }
}

/** Preenche o painel "Resumo do Perfil" com os dados informados no quiz. */
function renderizarResumo(perfil) {
  const painel = document.getElementById('resumo-perfil');
  if (!painel) return;

  painel.hidden = false;

  const campos = {
    'resumo-nivel-estudo': perfil.nivelEstudo || '—',
    'resumo-autoavaliacao': perfil.autoavaliacao || '—',
    'resumo-nivel-xp': perfil.nivelXp || '—',
  };

  Object.entries(campos).forEach(([id, valor]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = capitalizar(valor);
  });

  preencherTags('resumo-dificuldades', perfil.dificuldades);
  preencherTags('resumo-confortaveis', perfil.confortaveis);
}

/** Renderiza uma lista de respostas como "pills"/tags dentro de um container. */
function preencherTags(idContainer, lista) {
  const container = document.getElementById(idContainer);
  if (!container) return;
  container.innerHTML = '';

  if (!lista || lista.length === 0) {
    container.innerHTML = '<span class="text-muted">Nenhuma opção selecionada</span>';
    return;
  }

  lista.forEach((item) => {
    const tag = document.createElement('span');
    tag.className = 'tag-pill';
    tag.textContent = capitalizar(item);
    container.appendChild(tag);
  });
}

/** Função utilitária para capitalizar a primeira letra de um texto. */
function capitalizar(texto) {
  if (!texto) return texto;
  return texto.charAt(0).toUpperCase() + texto.slice(1).replace(/-/g, ' ');
}

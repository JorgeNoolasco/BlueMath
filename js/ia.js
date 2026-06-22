/**
 * ============================================================================
 * BLUEMATH — TUTOR DE IA (SocraticAI)
 * Arquivo: js/ia.js
 * Descrição: Implementa o chat inteligente de matemática integrado à API
 * oficial do Google Gemini, usando requisições HTTP nativas (fetch),
 * 100% client-side, sem frameworks ou bibliotecas externas.
 *
 * IMPORTANTE (segurança):
 * Este projeto é exclusivamente de testes/desenvolvimento local. Em um
 * ambiente de produção real, a chave de API NUNCA deve ficar exposta no
 * código do navegador — o ideal é um backend (proxy) que guarde a chave
 * em variável de ambiente e repasse as requisições ao Gemini.
 * ============================================================================
 */

/* --------------------------------------------------------------------------
   1. CONFIGURAÇÃO DA API
   -------------------------------------------------------------------------- */

const GEMINI_API_KEY = 'AQ.Ab8RN6K6Tpqfo7LDCFLEy5uiLpDgcdpI6mkaKCjjNl__SfAaLA'; // <- Substitua pela sua chave real
const GEMINI_MODEL = 'gemini-2.0-flash'; 
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Instrução de sistema: define a personalidade do tutor (método socrático)
const INSTRUCAO_SISTEMA = `Você é o SocraticAI, o tutor de matemática da plataforma BlueMath.
Sua missão é ajudar o estudante a PENSAR, nunca apenas entregar a resposta pronta.
Sempre que possível, faça perguntas guiadas, dê dicas passo a passo e só revele a
solução completa se o aluno pedir explicitamente. Use linguagem clara, encorajadora
e adequada ao nível do estudante. Quando escrever fórmulas ou cálculos, organize-os
em linhas separadas para facilitar a leitura. Respostas em português do Brasil.`;

/**
 * Função opcional para testar a API isoladamente no console.
 * Só executa se a chave tiver sido alterada.
 */
async function testarApiDireta() {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('SUA_')) return;

  const data = {
    contents: [{ parts: [{ text: "Explain how AI works in a few words" }] }]
  };

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await response.json();
    console.log("Teste API Direta:", json.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("Erro na requisição de teste:", error);
  }
}

// Executa o teste automático (útil para desenvolvimento)
testarApiDireta();

/* --------------------------------------------------------------------------
   2. ESTADO DO CHAT (histórico mantido durante a sessão do usuário)
   -------------------------------------------------------------------------- */
let historicoConversa = []; // Lista de { role: 'user' | 'model', parts: [{ text }] }
let requisicaoEmAndamento = false;

/* --------------------------------------------------------------------------
   3. REFERÊNCIAS DOS ELEMENTOS DA INTERFACE
   -------------------------------------------------------------------------- */
let elMensagens, elInput, elFormulario, elBotaoEnviar, elErro, elSugestoes;

document.addEventListener('DOMContentLoaded', () => {
  elMensagens = document.getElementById('chat-messages');
  elInput = document.getElementById('chat-input');
  elFormulario = document.getElementById('chat-form');
  elBotaoEnviar = document.getElementById('chat-send-btn');
  elErro = document.getElementById('chat-error');
  elSugestoes = document.querySelectorAll('.suggestion-chip');

  if (!elFormulario) return; // Só inicializa o chat se o formulário existir na página

  inicializarChat();
});

/**
 * Liga todos os eventos da interface de chat
 */
function inicializarChat() {
  elFormulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    enviarMensagemUsuario(elInput.value);
  });

  elInput.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter' && !evento.shiftKey) {
      evento.preventDefault();
      elFormulario.dispatchEvent(new Event('submit'));
    }
  });

  // Cresce a textarea automaticamente conforme o usuário digita
  elInput.addEventListener('input', () => {
    elInput.style.height = 'auto';
    elInput.style.height = `${Math.min(elInput.scrollHeight, 140)}px`;
  });

  // Chips de sugestão preenchem e enviam a pergunta automaticamente
  elSugestoes.forEach((chip) => {
    chip.addEventListener('click', () => enviarMensagemUsuario(chip.textContent.trim()));
  });
}

/* --------------------------------------------------------------------------
   4. ENVIO DE MENSAGENS
   -------------------------------------------------------------------------- */

/**
 * Processa o envio de uma nova mensagem do usuário
 */
async function enviarMensagemUsuario(textoBruto) {
  const texto = textoBruto.trim();
  if (!texto || requisicaoEmAndamento) return;

  esconderErro();
  renderizarMensagem('user', texto);
  historicoConversa.push({ role: 'user', parts: [{ text: texto }] });

  elInput.value = '';
  elInput.style.height = 'auto';
  alternarEstadoCarregando(true);

  const idIndicador = mostrarIndicadorDigitando();

  try {
    const respostaTexto = await consultarGemini(historicoConversa);
    removerIndicadorDigitando(idIndicador);
    renderizarMensagem('model', respostaTexto);
    historicoConversa.push({ role: 'model', parts: [{ text: respostaTexto }] });
  } catch (erro) {
    removerIndicadorDigitando(idIndicador);
    console.error('Erro ao consultar a API do Gemini:', erro);
    exibirErro(traduzirErro(erro));
  } finally {
    alternarEstadoCarregando(false);
  }
}

/**
 * Realiza a requisição HTTP (fetch) para a API do Google Gemini
 */
async function consultarGemini(historico) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('SUA_')) {
    throw new Error('CHAVE_NAO_CONFIGURADA');
  }

  const corpoRequisicao = {
    contents: historico,
    systemInstruction: { parts: [{ text: INSTRUCAO_SISTEMA }] },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  };

  const resposta = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpoRequisicao),
  });

  if (!resposta.ok) {
    const detalhe = await resposta.json().catch(() => null);
    const erro = new Error(detalhe?.error?.message || `Erro HTTP ${resposta.status}`);
    erro.status = resposta.status;
    throw erro;
  }

  const dados = await resposta.json();
  const textoResposta = dados?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textoResposta) {
    throw new Error('RESPOSTA_VAZIA');
  }

  return textoResposta;
}

/* --------------------------------------------------------------------------
   5. RENDERIZAÇÃO DAS MENSAGENS NA TELA
   -------------------------------------------------------------------------- */

/**
 * Cria e insere uma bolha de mensagem no histórico visual do chat.
 */
function renderizarMensagem(autor, texto) {
  const linha = document.createElement('div');
  linha.className = `msg ${autor === 'user' ? 'msg-user' : 'msg-ai'}`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = autor === 'user' ? 'EU' : 'IA';

  const coluna = document.createElement('div');
  const bolha = document.createElement('div');
  bolha.className = 'msg-bubble';
  bolha.innerHTML = formatarTextoResposta(texto);

  const horario = document.createElement('span');
  counter = 0;
  horario.className = 'msg-time';
  horario.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  coluna.appendChild(bolha);
  coluna.appendChild(horario);
  linha.appendChild(avatar);
  linha.appendChild(coluna);
  elMensagens.appendChild(linha);

  rolarParaFinal();
}

/**
 * Converte marcações simples de markdown em HTML seguro.
 */
function formatarTextoResposta(textoOriginal) {
  let texto = escaparHtml(textoOriginal);

  // Blocos de código / fórmulas entre crases triplas ```...```
  texto = texto.replace(/```([\s\S]*?)```/g, (_, codigo) => `<pre><code>${codigo.trim()}</code></pre>`);

  // Código inline entre crases simples `...`
  texto = texto.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Negrito **texto**
  texto = texto.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Quebras de linha simples viram <br>
  texto = texto.replace(/\n/g, '<br>');

  return texto;
}

/** Escapa caracteres especiais de HTML para exibir texto de forma segura. */
function escaparHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  div.innerHTML = div.innerHTML.trim();
  return div.innerHTML;
}

/* --------------------------------------------------------------------------
   6. INDICADOR DE CARREGAMENTO (typing indicator)
   -------------------------------------------------------------------------- */

/** Insere a bolha animada de "digitando..." */
function mostrarIndicadorDigitando() {
  const id = `typing-${Date.now()}`;
  const linha = document.createElement('div');
  linha.className = 'msg msg-ai';
  linha.id = id;
  linha.innerHTML = `
    <div class="msg-avatar" aria-hidden="true">IA</div>
    <div class="msg-bubble" role="status" aria-label="O tutor está digitando">
      <div class="typing-indicator"><span></span><span></span><span></span></div>
    </div>
  `;
  elMensagens.appendChild(linha);
  rolarParaFinal();
  return id;
}

/** Remove o indicador de "digitando..." */
function removerIndicadorDigitando(id) {
  document.getElementById(id)?.remove();
}

/* --------------------------------------------------------------------------
   7. TRATAMENTO DE ERROS
   -------------------------------------------------------------------------- */

/** Traduz erros técnicos em mensagens amigáveis para o usuário final. */
function traduzirErro(erro) {
  if (erro.message === 'CHAVE_NAO_CONFIGURADA') {
    return 'A chave da API do Gemini ainda não foi configurada. Defina GEMINI_API_KEY no arquivo js/ia.js para ativar o tutor.';
  }
  if (erro.message === 'RESPOSTA_VAZIA') {
    return 'O tutor não conseguiu gerar uma resposta para essa pergunta. Tente reformular ou envie novamente.';
  }
  if (erro.status === 429) {
    return 'Limite de uso da API atingido no momento. Aguarde alguns instantes e tente novamente.';
  }
  if (!navigator.onLine) {
    return 'Você parece estar sem conexão com a internet. Verifique sua rede e tente novamente.';
  }
  return 'Não foi possível falar com o tutor agora. Verifique sua conexão ou tente novamente em instantes.';
}

/** Exibe a faixa de erro amigável acima da barra de digitação. */
function exibirErro(mensagem) {
  if (!elErro) return;
  elErro.textContent = mensagem;
  elErro.classList.add('is-visible');
}

/** Esconde a faixa de erro */
function esconderErro() {
  elErro?.classList.remove('is-visible');
}

/* --------------------------------------------------------------------------
   8. UTILITÁRIOS DE INTERFACE
   -------------------------------------------------------------------------- */

/** Habilita/desabilita o input e o botão de enviar durante a requisição. */
function alternarEstadoCarregando(carregando) {
  requisicaoEmAndamento = cargando = carregando;
  if (elBotaoEnviar) elBotaoEnviar.disabled = carregando;
  if (elInput) elInput.disabled = carregando;
}

/** Rola a área de mensagens até o final */
function rolarParaFinal() {
  if (elMensagens) {
    elMensagens.scrollTop = elMensagens.scrollHeight;
  }
}
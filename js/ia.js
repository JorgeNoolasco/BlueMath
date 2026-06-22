// 1. URL do back-end hospedado na Vercel
const URL_BACKEND = "https://blue-math-backend.vercel.app/api/chat";

// 2. Mapeamento dos elementos do HTML
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const chatSendBtn = document.getElementById("chat-send-btn");
const suggestionChips = document.querySelectorAll(".suggestion-chip");

// 3. Função assíncrona que faz o envio dos dados para a API na Vercel
async function enviarParaIA(mensagem) {
    try {
        const response = await fetch(URL_BACKEND, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: mensagem
            })
        });

        if (!response.ok) {
            throw new Error("Erro na resposta do servidor");
        }

        const data = await response.json();
        return data.response;

    } catch (error) {
        console.error("Erro ao falar com a IA:", error);
        return "Ops, tive um probleminha para me conectar ao servidor do tutor. Tente novamente em alguns instantes!";
    }
}

// 4. Função auxiliar para adicionar as bolhas de texto no HTML dinamicamente
function adicionarMensagem(texto, remetente) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("msg", `msg-${remetente}`);

    // Define o avatar baseado em quem está falando
    const avatarTexto = remetente === "ai" ? "IA" : "Você";

    // Estrutura idêntica ao design do seu HTML original
    msgDiv.innerHTML = `
        <div class="msg-avatar" aria-hidden="true">${avatarTexto}</div>
        <div>
            <div class="msg-bubble">${texto.replace(/\n/g, '<br>')}</div>
            <span class="msg-time">agora</span>
        </div>
    `;

    chatMessages.appendChild(msgDiv);

    // Faz o chat rolar automaticamente para a última mensagem
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 5. Função que gerencia o fluxo de envio da mensagem
async function gerenciarEnvio() {
    const textoMensagem = chatInput.value.trim();
    if (!textoMensagem) return; // Evita enviar textos vazios

    // Limpa o campo de entrada e desativa temporariamente para evitar cliques duplos
    chatInput.value = "";
    chatInput.disabled = true;
    chatSendBtn.disabled = true;

    // Adiciona a mensagem do usuário na tela
    adicionarMensagem(textoMensagem, "usuario");

    // Adiciona uma resposta visual de carregamento (loading)
    adicionarMensagem("Digitando...", "ai");
    const asMensagens = chatMessages.querySelectorAll(".msg-ai");
    const bolhaLoading = asMensagens[asMensagens.length - 1].querySelector(".msg-bubble");

    // Envia para o backend da Vercel e espera a resposta verdadeira
    const respostaIA = await enviarParaIA(textoMensagem);

    // Substitui o "Digitando..." pela resposta final da IA
    bolhaLoading.innerHTML = respostaIA.replace(/\n/g, '<br>');

    // Reativa os campos de entrada do chat
    chatInput.disabled = false;
    chatSendBtn.disabled = false;
    chatInput.focus();
}

// ===================== CONFIGURAÇÃO DOS EVENTOS (LISTENERS) =====================

// Escuta o envio do formulário (clique no botão ou Enter)
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    gerenciarEnvio();
});

// Permite enviar com "Enter", mas aceita quebra de linha com "Shift + Enter"
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        chatForm.requestSubmit();
    }
});

// Faz os chips de sugestão enviarem a pergunta automaticamente ao clicar neles
suggestionChips.forEach(chip => {
    chip.addEventListener("click", () => {
        chatInput.value = chip.textContent;
        chatForm.requestSubmit();
    });
});
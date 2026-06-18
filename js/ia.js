const API_KEY = "AQ.Ab8RN6LTwYYCJ39GIAuU4HyQoW6Rc87sqQWLK42sD02xQLBQYA"; // Sua chave de teste

async function chamarIA(prompt) {
    try {
        const resposta = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        if (!resposta.ok) {
            if (resposta.status === 503) {
                return "O servidor da IA está temporariamente sobrecarregado. Por favor, aguarde alguns segundos e tente novamente.";
            }
            if (resposta.status === 429) {
                return "Limite de requisições atingido. Por favor, aguarde um momento antes de enviar uma nova dúvida.";
            }
            return `Desculpe, ocorreu um erro inesperado (Código ${resposta.status}).`;
        }

        const dados = await resposta.json();
        return dados?.candidates?.[0]?.content?.parts?.[0]?.text || "A IA retornou uma resposta em formato inválido.";

    } catch (erro) {
        console.error("Erro de rede:", erro);
        return "Não foi possível conectar aos nossos servidores. Verifique sua conexão com a internet.";
    }
}

// Esta função agora manipula o HTML dinamicamente
async function explicar() {
    const inputPergunta = document.getElementById("pergunta");
    const chatBox = document.getElementById("chat-box");
    const textoPergunta = inputPergunta.value.trim();

    // Se o usuário não digitou nada, não faz nada
    if (!textoPergunta) return;

    // 1. Cria e adiciona o balão de mensagem do Usuário na tela
    const balaoUsuario = document.createElement("div");
    balaoUsuario.className = "user-message"; // Lembre de estilizar essa classe no seu CSS (ex: alinhar à direita)
    balaoUsuario.textContent = textoPergunta;
    chatBox.appendChild(balaoUsuario);

    // Limpa o campo de texto
    inputPergunta.value = "";

    // Como você já tem um padrão de CSS, vamos criar o balão do Bot que receberá a resposta
    const balaoBot = document.createElement("div");
    balaoBot.className = "bot-message";
    balaoBot.textContent = "Pensando..."; // Efeito visual de carregamento
    chatBox.appendChild(balaoBot);

    // Rola o chat para baixo automaticamente para mostrar a nova mensagem
    chatBox.scrollTop = chatBox.scrollHeight;

    // 2. Chama a API do Gemini
    const respostaIA = await chamarIA(textoPergunta);

    // 3. Substitui o "Pensando..." pela resposta real (ou pelo erro amigável)
    balaoBot.textContent = respostaIA;

    // Rola o chat para baixo novamente após a resposta chegar
    chatBox.scrollTop = chatBox.scrollHeight;
}
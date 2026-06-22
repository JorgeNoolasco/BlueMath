// 1. Defina a função que conversa com o seu backend da Vercel
async function enviarParaIA(mensagem) {
    try {
        const response = await fetch(
            "https://blue-math-backend.vercel.app/api/chat", // Garanta que o hífen está correto igual ao da Vercel
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: mensagem // Envia como 'message', exatamente como o backend espera
                })
            }
        );

        if (!response.ok) {
            throw new Error("Erro na resposta do servidor");
        }

        const data = await response.json();

        // Retorna a propriedade .response que veio do seu chat.js
        return data.response;

    } catch (error) {
        console.error("Erro ao falar com a IA:", error);
        return "Ops, tive um probleminha para me conectar ao servidor. Tente novamente em instantes!";
    }
}

// 2. Exemplo prático de como usar isso dentro do evento do seu botão de enviar:
// (Certifique-se de que essa chamada está dentro de uma função 'async')
/*
const textoDoUsuario = campoDeTexto.value; // Pega o que o aluno digitou
const respostaDaIA = await enviarParaIA(textoDoUsuario);
adicionarMensagemNaTela(respostaDaIA, "ai");
*/
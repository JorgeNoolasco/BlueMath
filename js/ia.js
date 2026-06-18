const API_KEY = "AQ.Ab8RN6LTwYYCJ39GIAuU4HyQoW6Rc87sqQWLK42sD02xQLBQYA";

async function chamarIA(prompt) {
    try {
        const resposta = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            }
        );

        if (!resposta.ok) {
            const erro = await resposta.text();

            if (resposta.status === 429) {
                return "Erro 429: limite de requisições atingido.";
            }

            return `Erro ${resposta.status}: ${erro}`;
        }

        const dados = await resposta.json();

        const texto =
            dados?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!texto) {
            console.error("Resposta inesperada:", dados);
            return "A IA retornou uma resposta inválida.";
        }

        return texto;

    } catch (erro) {
        console.error("Erro ao chamar a API:", erro);
        return "Erro ao conectar com a IA.";
    }
}

// Exemplo de uso
async function explicar() {
    const pergunta = "Explique o que é JavaScript.";

    const resposta = await chamarIA(pergunta);

    console.log(resposta);
}

explicar();
 
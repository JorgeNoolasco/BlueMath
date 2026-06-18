async function chamarIA(prompt) {
    try {
        const resposta = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${AQ.Ab8RN6LTwYYCJ39GIAuU4HyQoW6Rc87sqQWLK42sD02xQLBQYA}",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt }
                            ]
                        }
                    ]
                })
            }
        );

        // 1. A validação do erro 429 deve ser feita aqui, logo após o fetch!
        if (!resposta.ok) {
            if (resposta.status === 429) {
                return "Erro 429: Limite de requisições atingido. Aguarde um minuto e tente novamente.";
            }
            return `Erro na API: Status ${resposta.status}`;
        }

        const dados = await resposta.json();

        // 2. Verifica se a estrutura de dados existe antes de tentar ler o [0]
        if (dados && dados.candidates && dados.candidates[0] && dados.candidates[0].content.parts[0]) {
            return dados.candidates[0].content.parts[0].text;
        } else {
            console.error("Estrutura de resposta inesperada:", dados);
            return "Ops, a IA mandou uma resposta em um formato estranho.";
        }

    } catch (erro) {
        console.error("Erro ao chamar a API:", erro);
        return "Ops, deu um erro ao conversar com a IA.";
    }
}

// Esta é a função que o seu botão do HTML chama
async function explicar() {
    try {
        // Exemplo: pegando o texto de algum input (ajuste para o id do seu projeto se precisar)
        const inputUsuario = document.getElementById("seu-input-id")?.value || "Me explique como funciona o fetch"; 
        
        // Chama a função que lida com a API e espera o texto voltar
        const resultado = await chamarIA(inputUsuario);
        
        // Se o resultado começar com "Erro" ou "Ops", você pode tratar com um alert
        if (resultado.startsWith("Erro") || resultado.startsWith("Ops")) {
            alert(resultado);
            return;
        }

        // Se deu tudo certo, exibe o resultado na tela
        console.log("Resultado da IA:", resultado);
        // document.getElementById("seu-elemento-de-texto").innerText = resultado;

    } catch (erro) {
        console.error("Erro capturado na função explicar:", erro);
    }
}
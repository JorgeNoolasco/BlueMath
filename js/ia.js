const resposta = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
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
                            text: texto
                        }
                    ]
                }
            ]
        })
    }
);

const dados = await resposta.json();

const respostaIA =
    dados.candidates[0].content.parts[0].text;

adicionarMensagem(respostaIA, "bot-message");
const API_KEY = "AQ.Ab8RN6IguhKuG5j7R2B1D7RHddz7M0SAjY4W1LY7DcU1nMWxOw";

async function chamarIA(prompt) {
    const resposta = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
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

    const dados = await resposta.json();

    return dados.candidates[0].content.parts[0].text;
}

async function explicar() {
    const pergunta = document.getElementById("pergunta").value;

    const resposta = await chamarIA(
        `Explique de forma simples para um estudante: ${pergunta}`
    );

    document.getElementById("resultado").innerText = resposta;
}

async function gerarExercicio() {
    const resposta = await chamarIA(
        "Gere um exercício de matemática de nível médio sem mostrar a resposta."
    );

    document.getElementById("resultado").innerText = resposta;
}
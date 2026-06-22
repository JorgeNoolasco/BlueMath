async function enviarMensagem(mensagem) {

    const response = await fetch(
        "https://bluemath-backend.vercel.app/api/chat",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: mensagem
            })
        }
    );

    const data = await response.json();

    return data.response;
}
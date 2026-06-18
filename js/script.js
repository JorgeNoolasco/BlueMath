const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px)";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
    });
});
const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px)";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
    });
});

const links = document.querySelectorAll(".menu a");

links.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        const destino = document.querySelector(
            link.getAttribute("href")
        );

        if (destino) {
            destino.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});
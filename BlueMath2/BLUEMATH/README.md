# 🔷 BlueMath — Aprenda a Pensar

Plataforma web de ensino de matemática que combina **metodologia socrática** com um **tutor de Inteligência Artificial** (Google Gemini). Em vez de entregar respostas prontas, o BlueMath guia o estudante com perguntas e dicas até que ele mesmo construa o raciocínio.

> Projeto 100% **Vanilla** — sem Node.js, sem frameworks JS, sem bibliotecas de CSS. Apenas HTML5, CSS3 e JavaScript puro.

---

## 📁 Estrutura do Projeto

```
BLUEMATH/
├── index.html              # Landing page (apresentação, planos, FAQ)
├── README.md                # Este arquivo
├── css/
│   ├── style.css             # Design System global (tokens, navbar, footer, cards, grid, app-shell...)
│   ├── perfil.css            # Estilos do quiz de personalização e resumo de perfil
│   └── ia.css                # Estilos da interface de chat do Tutor IA
├── js/
│   ├── script.js              # Comportamentos globais (menu mobile, fade-in, FAQ, rodapé)
│   ├── perfil.js               # Lógica do quiz multi-etapas + localStorage
│   └── ia.js                   # Integração com a API do Google Gemini (chat)
└── pages/
    ├── home.html              # Dashboard do estudante (logado)
    ├── biblioteca.html        # Biblioteca de módulos de estudo
    ├── calculadoras.html      # Calculadoras e ferramentas matemáticas
    ├── estatisticas.html      # Progresso, histórico de aulas e conquistas
    ├── ia.html                # Chat com o SocraticAI Tutor
    └── perfil.html             # Quiz de personalização + resumo de perfil
```

---

## 🚀 Como rodar o projeto localmente

Como não há build/bundler, basta servir os arquivos estáticos. Duas opções simples:

**Opção 1 — Abrir direto no navegador**
Dê duplo clique em `index.html`. (Funciona para a maior parte do site; alguns navegadores restringem `fetch` em arquivos `file://`, então a opção 2 é recomendada para testar o Tutor IA.)

**Opção 2 — Servidor local simples (recomendado)**
```bash
# Com Python 3 já instalado (não requer Node/npm)
python3 -m http.server 8000
```
Depois acesse `http://localhost:8000` no navegador.

---

## 🤖 Configurando o Tutor IA (Google Gemini)

O chat em `pages/ia.html` consome a API oficial do Gemini diretamente do navegador (`fetch`), sem backend.

1. Gere uma chave gratuita em **https://aistudio.google.com/apikey**.
2. Abra `js/ia.js` e localize a constante no topo do arquivo:
   ```js
   const GEMINI_API_KEY = 'SUA_CHAVE_API_AQUI';
   ```
3. Substitua pelo valor da sua chave pessoal e salve o arquivo.
4. Abra `pages/ia.html` e converse com o SocraticAI.

> ⚠️ **Atenção de segurança:** este projeto é exclusivamente de testes/desenvolvimento local, por isso a chave fica exposta no código client-side. **Nunca faça isso em produção** — em um ambiente real, a chave deve ficar em um backend/proxy, fora do alcance do navegador.

---

## 🎨 Design System

Toda a identidade visual está centralizada em variáveis CSS (`:root`) no topo de `css/style.css`:

- **Cores** — paleta "azul matemático" (`--color-primary` `#2563eb`) + cinzas modernos para texto e fundos.
- **Tipografia** — fonte `Inter`, escala de tamanhos de `--fs-xs` a `--fs-3xl`.
- **Espaçamento** — escala `--space-1` a `--space-12`.
- **Bordas e sombras** — `--radius-sm/md/lg/full` e `--shadow-sm/md/lg`.

Componentes reutilizáveis (botões, cards, badges, barra de progresso, navbar, footer, sidebar do painel) seguem esse mesmo sistema de tokens, garantindo consistência visual em todas as páginas.

### Responsividade
Três breakpoints, usando apenas Media Queries (sem libs):
- **Desktop**: ≥ 1024px
- **Tablet**: 768px – 1023px (sidebar colapsa para ícones, menu vira hambúrguer)
- **Mobile**: < 768px (menu hambúrguer completo, grids em coluna única)

### Animações
Implementadas só com `@keyframes` e `transition` — fade-in ao rolar a página (via `IntersectionObserver`), microinterações em botões/cards, indicador de "digitando" no chat, barra de progresso animada, `shake` em validação de formulário. Tudo respeita `prefers-reduced-motion`.

---

## ♿ Acessibilidade & SEO

- Tags semânticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
- `aria-label`, `aria-current`, `aria-expanded`, `aria-live` em elementos interativos e no chat.
- Foco visível via `:focus-visible` e navegação 100% por teclado (incluindo fechar o menu mobile com `Esc`).
- Link "Pular para o conteúdo principal" em todas as páginas.
- `<title>` e `<meta name="description">` únicos por página, além de tags Open Graph básicas.

---

## 🧩 Funcionalidades por página

| Página | Funcionalidade |
|---|---|
| `index.html` | Landing page, planos, FAQ em accordion |
| `pages/perfil.html` | Quiz de personalização em 5 etapas (wizard), barra de progresso, validação, salvamento em `localStorage` |
| `pages/home.html` | Dashboard com resumo do perfil, atividades recentes e metas diárias |
| `pages/biblioteca.html` | Catálogo de módulos de estudo com progresso por assunto |
| `pages/calculadoras.html` | Ferramentas de cálculo rápidas |
| `pages/estatisticas.html` | XP, sequência de estudos, gráfico semanal (CSS puro), histórico e conquistas |
| `pages/ia.html` | Chat com o SocraticAI Tutor (Google Gemini API), histórico de mensagens, indicador de digitação e tratamento de erros |

---

## 🛠️ Tecnologias

- **HTML5** semântico
- **CSS3** puro (Custom Properties, Grid, Flexbox, `@keyframes`)
- **JavaScript (Vanilla ES6+)** — módulos funcionais, `fetch`, `IntersectionObserver`, `localStorage`
- **Google Gemini API** (`gemini-2.0-flash`) via requisição HTTP nativa

Nenhuma dependência externa de build, framework ou biblioteca de UI foi utilizada.

---

## 📌 Notas finais

Todos os textos do código (`js/*.js`) estão comentados em português para facilitar manutenção e estudo do projeto. Sinta-se à vontade para trocar os dados estáticos de exemplo (XP, progresso, histórico) por dados reais assim que houver um backend/banco de dados conectado.

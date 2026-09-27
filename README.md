# BlueMath — Aprenda a Pensar

Plataforma web educacional voltada ao aprendizado de matemática, desenvolvida com **HTML, CSS e JavaScript puro**.

O projeto combina uma interface de estudos, quiz de personalização, dashboard e integração com um tutor de IA através de uma API backend.

## Sobre o projeto

O BlueMath foi criado para praticar desenvolvimento frontend sem frameworks, organização de interfaces maiores e integração com serviços externos através de uma API.

A proposta é oferecer uma experiência de estudo organizada, com recursos como biblioteca de conteúdos, acompanhamento de progresso e um tutor virtual.

> Projeto desenvolvido sem frameworks JavaScript ou bibliotecas de UI.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript ES6+
- Fetch API
- LocalStorage
- IntersectionObserver
- API backend para o tutor de IA

## Funcionalidades

- Landing page
- Quiz de personalização
- Dashboard do estudante
- Biblioteca de conteúdos
- Calculadoras
- Página de estatísticas
- Histórico visual de progresso
- Interface de chat
- Integração com tutor de IA
- Menu responsivo
- FAQ interativo
- Animações e microinterações

## Arquitetura

```text
Navegador
   |
   +--> HTML
   +--> CSS
   +--> JavaScript
            |
            | fetch()
            v
       Backend API
            |
            v
       Serviço de IA
```

O frontend envia as mensagens para um backend hospedado separadamente. Dessa forma, credenciais do serviço de IA não precisam ficar expostas diretamente no código do navegador.

## Estrutura do projeto

```text
BlueMath/
├── index.html
├── README.md
├── css/
│   ├── style.css
│   ├── perfil.css
│   └── ia.css
├── js/
│   ├── script.js
│   ├── perfil.js
│   └── ia.js
└── pages/
    ├── home.html
    ├── biblioteca.html
    ├── calculadoras.html
    ├── estatisticas.html
    ├── ia.html
    └── perfil.html
```

## Design e responsividade

A identidade visual utiliza variáveis CSS para centralizar cores, espaçamentos, bordas, sombras e tipografia.

O layout possui adaptações para:

- Desktop
- Tablet
- Mobile

Também são utilizados Grid, Flexbox, media queries, transições e animações CSS.

## Acessibilidade

O projeto utiliza práticas como:

- HTML semântico
- `aria-label`
- `aria-current`
- `aria-expanded`
- `aria-live`
- Navegação por teclado
- `:focus-visible`
- Link para pular diretamente ao conteúdo
- Suporte a `prefers-reduced-motion`

## Como executar

Como o projeto não possui etapa de build, basta iniciar um servidor HTTP local.

Com Python 3:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

O servidor local é recomendado porque algumas funcionalidades utilizam `fetch()`.

## Integração com o tutor de IA

O arquivo `js/ia.js` envia as mensagens para uma API backend:

```text
Frontend -> Backend API -> Serviço de IA
```

A responsabilidade por credenciais privadas deve permanecer no backend, nunca no JavaScript entregue ao navegador.

## Aprendizados

Durante o desenvolvimento, foram praticados conceitos como:

- Estruturação semântica com HTML
- Design responsivo
- Organização de CSS
- Manipulação do DOM
- Eventos em JavaScript
- LocalStorage
- Consumo de APIs
- Comunicação assíncrona com `fetch()`
- Acessibilidade
- Organização de múltiplas páginas

## Próximas melhorias

- Melhorar o tratamento e sanitização de conteúdo exibido no chat
- Adicionar testes
- Documentar o backend do tutor
- Persistir dados do usuário em banco de dados
- Adicionar screenshots e demonstração visual do projeto

## Aviso

Projeto educacional desenvolvido durante meus estudos de Desenvolvimento de Sistemas.

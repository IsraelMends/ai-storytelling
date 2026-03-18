# 📖 AI Storytelling

> **Histórias interativas que ganham vida com inteligência artificial**

Crie e vivencie narrativas que se ramificam a cada decisão. Combine leitura imersiva, visualização em grafo e geração por IA para histórias verdadeiramente dinâmicas.

---

## ✨ O que é

O **AI Storytelling** é uma plataforma de histórias interativas onde você:

- **Lê** capítulos e escolhe o rumo da narrativa
- **Visualiza** toda a árvore da história em um grafo interativo
- **Expande** a trama digitando prompts e deixando a IA criar novos ramos

Cada decisão leva a caminhos diferentes. Cada prompt pode dar origem a novos trechos, mantendo coerência com o contexto da história.

---

## 🎯 Para quem é

| Público | Aproveitamento |
|---------|----------------|
| **Leitores** | Explorar histórias colaborativas com a IA |
| **Escritores** | Experimentar narrativas ramificadas e brainstorm assistido |
| **Educadores** | Criar conteúdos interativos e gamificados |
| **Desenvolvedores** | Base para jogos narrativos, livros digitais ou apps de storytelling |
| **Produtoras / Studios** | Prototipar experiências de storytelling interativo |

---

## 🚀 Funcionalidades

- **Leitura interativa** — Navegue pela história clicando nas decisões
- **Árvore visual** — Veja o grafo completo da narrativa (React Flow)
- **Geração com IA** — Adicione novos nós a partir de prompts (OpenAI)
- **Interface responsiva** — Interface moderna com Tailwind CSS
- **Rotas dinâmicas** — Compartilhe links diretos para pontos da história (`/story/[id]`)

---

## 🛠 Tecnologias

- **Next.js 16** — App Router, API Routes
- **React 19** — UI e componentes
- **TypeScript** — Tipagem estática
- **Tailwind CSS 4** — Estilos
- **React Flow** — Grafo interativo
- **OpenRouter API** — Geração de texto (LLMs via OpenRouter)

---

## ⚡ Início rápido

### Pré-requisitos

- Node.js 20+
- npm ou pnpm

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd ai-storytelling

# Instale as dependências
npm install
```

### Configuração (para geração com IA)

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

2. Edite `.env.local` com suas credenciais:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_storytelling"
OPENROUTER_API_KEY="sk-or-xxxxxxxxxxxxxxxxxxxxxxxx"
OPENROUTER_MODEL="meta-llama/llama-3.1-8b-instruct:free"
```

> Obtenha uma chave OpenRouter em [openrouter.ai/keys](https://openrouter.ai/keys). Sem ela, a geração de novos nós via IA ficará indisponível, mas leitura e navegação funcionam normalmente.

### Execução

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## 📁 Estrutura do projeto

```
ai-storytelling/
├── app/                    # Rotas e API
│   ├── layout.tsx          # Layout raiz + StoryProvider
│   ├── page.tsx            # Página inicial
│   ├── api/ai/generate/    # Endpoint de geração via IA
│   └── (routes)/story/     # Página dinâmica /story/[id]
├── src/
│   ├── components/         # UI (StoryReader, StoryTree, etc.)
│   ├── contexts/           # StoryContext (estado global)
│   ├── types/              # Story, StoryNode, StoryEdge
│   ├── services/           # aiApi, indexedDB, socket
│   └── hooks/              # useSpeechRecognition, useBiasDetection
└── implementation-plan.md  # Plano técnico do MVP
```

---

## 🔮 Roadmap

- [ ] Integração do formulário de prompt na UI principal
- [ ] Persistência em IndexedDB
- [ ] Suporte a múltiplas histórias
- [ ] Reconhecimento de voz e síntese
- [ ] Detecção de viés nos textos gerados

---

## 📄 Licença

Projeto privado. Entre em contato para uso comercial ou parcerias.

---

## 🤝 Contato

Dúvidas, sugestões ou interesse em integrar o AI Storytelling à sua solução? Entre em contato.

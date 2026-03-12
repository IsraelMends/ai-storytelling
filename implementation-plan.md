# Plano de Implementação — AI Storytelling MVP

---

# 1. Objetivo do Documento

Este documento é o **guia operacional de construção** do projeto AI Storytelling. Ele não substitui o código, mas funciona como blueprint técnico que permite implementar o MVP completo do zero até um produto funcional.

**Propósito:**
- Servir como referência única durante o desenvolvimento
- Garantir ordem correta de implementação
- Eliminar ambiguidades sobre o que fazer em cada etapa
- Reduzir retrabalho e erros de integração

**O que será entregue ao final do MVP:**
- História interativa única em memória, com leitura e navegação por decisões
- Visualização da árvore da história em grafo (React Flow)
- Geração de novos nós com IA via prompt do usuário
- Aplicação rodando sem erros críticos em `npm run dev`

---

# 2. Estratégia de Implementação

**Filosofia:**
- **Bottom-up com base estável:** Primeiro estabilizar tipos, contexto e dados; depois UI; por fim integração com IA.
- **Sem IA primeiro:** O fluxo de leitura e navegação deve funcionar perfeitamente antes de qualquer chamada à IA.
- **Componentização incremental:** Extrair componentes conforme a necessidade, evitando abstrações prematuras.
- **Validação contínua:** Cada fase deve ser validada antes de avançar para a próxima.

**Ordem das etapas (justificada):**

1. **Fase 0 — Preparação:** Garantir que o ambiente compila e que o código existente é compreendido.
2. **Fase 1 — Correção da base:** Corrigir erros graves (hooks fora do componente, `currentStory` estático, typos na API).
3. **Fase 2 — Home funcional:** Montar a home com leitura, decisões e grafo sem IA.
4. **Fase 3 — StoryContext completo:** Garantir que todo o estado e operações estão corretos.
5. **Fase 4 — Componentes de UI:** Criar e refinar StoryReader, StoryDecisionButtons, StoryPromptForm.
6. **Fase 5 — API de IA:** Corrigir e validar a rota `/api/ai/generate`.
7. **Fase 6 — Integração IA no frontend:** Conectar o formulário de prompt à IA e ao contexto.
8. **Fase 7 — Modelagem do grafo:** Garantir que o StoryTree reflete corretamente o estado da história.

**Por que essa ordem minimiza erros:**
- Corrigir a base evita que hooks e contexto quebrem o build desde o início.
- Ter leitura funcionando antes da IA garante um fallback sempre disponível.
- A API pode ser testada isoladamente antes de integrar no front.

---

# 3. Visão Final Esperada do Sistema

**Como o projeto deve estar quando pronto:**
- Usuário acessa `/` e vê: título da história, texto do nó atual, botões de decisão, formulário de IA e grafo.
- Ao clicar em uma decisão, o texto e os botões mudam para o próximo nó; o grafo se atualiza.
- Ao digitar um prompt e clicar em "Gerar com IA", um novo nó é criado e conectado ao atual; o usuário é levado ao novo nó.
- Em caso de erro de IA, uma mensagem é exibida; a história permanece inalterada.

**Fluxo técnico:**
1. **Frontend** (`app/page.tsx` ou HomePage): Consome `useStory()` → obtém `currentStory`, `currentNodeId`, `setCurrentNodeId`, `addNodeFromPrompt`.
2. **StoryContext:** Mantém `story` e `currentNodeId` em estado; expõe operações e valor derivado `currentStory`.
3. **StoryTree:** Lê `currentStory` do contexto e mapeia `nodes`/`edges` para React Flow.
4. **API `/api/ai/generate`:** Recebe `{ prompt, context }` e retorna `{ text }` ou `{ error }` chamando o provedor de IA.

**MVP concluído significa:**
- Leitura e navegação funcionando
- Grafo sincronizado com o estado
- IA gerando nós e atualizando grafo e narrativa
- Sem erros de compilação ou runtime no fluxo principal

---

# 4. Estrutura Final Esperada de Pastas e Arquivos

```
ai-storytelling/
├── app/
│   ├── layout.tsx              # Root layout + StoryProvider + metadata
│   ├── page.tsx                # Home — composição da UI principal
│   ├── globals.css
│   ├── api/
│   │   └── ai/
│   │       └── generate/
│   │           └── route.ts    # POST handler para geração via IA
│   └── (routes)/
│       └── story/
│           └── [id]/
│               └── page.tsx    # Página parametrizada (espelho da home)
├── src/
│   ├── types/
│   │   └── story.ts            # Story, StoryNode, StoryEdge, NodeId, StoryId
│   ├── contexts/
│   │   └── StoryContext.tsx    # StoryProvider, useStory
│   └── components/
│       ├── layout/
│       │   └── AppLayout.tsx   # (Opcional) Container/layout genérico
│       ├── story/
│       │   ├── StoryReader.tsx
│       │   ├── StoryDecisionButtons.tsx
│       │   └── StoryPromptForm.tsx
│       └── story-tree/
│           └── StoryTree.tsx
├── .env.local                  # AI_API_KEY (não versionado)
├── package.json
├── tsconfig.json
└── README.md
```

**Responsabilidade por arquivo:**

| Arquivo | Responsabilidade | Tipo | Dependências | Consumidores |
|---------|------------------|------|--------------|--------------|
| `app/layout.tsx` | Layout raiz, metadata, StoryProvider | Server | globals.css, StoryContext | Next.js (todas as rotas) |
| `app/page.tsx` | Home: composição de leitura, decisões, prompt e grafo | Client | useStory, StoryReader, StoryDecisionButtons, StoryPromptForm, StoryTree | Usuário (rota /) |
| `app/(routes)/story/[id]/page.tsx` | Página de história por ID (espelho) | Client | useStory | Usuário (rota /story/[id]) |
| `app/api/ai/generate/route.ts` | Handler POST para geração de texto via IA | Server | process.env.AI_API_KEY | addNodeFromPrompt (fetch) |
| `src/types/story.ts` | Tipos Story, StoryNode, StoryEdge | N/A | Nenhum | StoryContext, componentes |
| `src/contexts/StoryContext.tsx` | Estado global, setCurrentNodeId, addNodeFromPrompt | Client | types/story | Páginas e componentes |
| `src/components/story/StoryReader.tsx` | Exibir título da história e texto do nó atual | Client | Nenhum (props) | HomePage, StoryPage |
| `src/components/story/StoryDecisionButtons.tsx` | Botões de decisão com callback | Client | Nenhum (props) | HomePage, StoryPage |
| `src/components/story/StoryPromptForm.tsx` | Input de prompt, botão gerar, loading, erro | Client | Nenhum (props) | HomePage |
| `src/components/story-tree/StoryTree.tsx` | Grafo React Flow a partir de currentStory | Client | useStory, reactflow | HomePage, StoryPage |

---

# 5. Ordem Exata de Implementação

| # | Etapa | Objetivo | Arquivos | Dependências | Resultado | Validação |
|---|-------|----------|----------|--------------|-----------|-----------|
| 1 | Preparação | Ambiente compilando e entendido | package.json, .env.local | Node 20+ | `npm run dev` sem crash | Terminal sem erro fatal |
| 2 | Correção base | Eliminar erros de hooks e contexto | page.tsx, StoryContext | tipos | Build OK, sem hooks fora de componente | `npm run build` |
| 3 | Home funcional | Leitura + decisões + grafo | page.tsx, StoryReader, StoryDecisionButtons, StoryTree | StoryContext | UI completa exceto IA | Navegar entre nós, ver grafo |
| 4 | StoryContext correto | currentStory mutável, addNodeFromPrompt correto | StoryContext | types, API | Estado reflete alterações | Grafo atualiza ao navegar |
| 5 | Componentes UI | Componentes isolados e reutilizáveis | StoryReader, StoryDecisionButtons, StoryPromptForm | types | Código organizado | Mesma funcionalidade |
| 6 | API IA | Rota correta e testável | route.ts | .env.local | POST retorna { text } ou { error } | curl/Postman |
| 7 | Integração IA | Prompt → addNodeFromPrompt → novo nó | page.tsx, StoryPromptForm | StoryContext, API | Geração de nós funcional | Novo nó aparece na narrativa e no grafo |
| 8 | Grafo estável | IDs únicos, posições, lista vazia | StoryTree | currentStory | Grafo sem quebras | Histórias vazias/novas não quebram |
| 9 | Refinos | UX, mensagens, README | Diversos | - | MVP polido | Checklist concluído |
| 10 | Deploy | Produção | Vercel, .env | - | URL pública funcional | Smoke test em prod |

---

# 6. Fase 0 — Preparação do Ambiente

**Pré-requisitos:**
- Node.js >= 20.x (LTS recomendado)
- npm ou pnpm
- Editor com suporte a TypeScript e ESLint

**Instalação de dependências:**
```bash
cd front/ai-storytelling  # ou o caminho correto do projeto
npm install
```

**Variáveis de ambiente:**
- Criar `.env.local` na raiz do projeto (mesmo nível que `package.json`)
- Conteúdo mínimo: `AI_API_KEY=sk-...` (chave OpenAI ou compatível)
- Para testes sem IA, o projeto deve continuar funcionando (só a geração falha)

**Como rodar:**
```bash
npm run dev
```

**Como verificar se compila:**
```bash
npm run build
```

**Erros conhecidos antes de começar (mapeados):**
1. `app/page.tsx`: Hooks `useState` e `useStory` fora do componente → build falha
2. `StoryContext`: `currentStory` expõe `exampleStory` estático em vez de `story`
3. `app/api/ai/generate/route.ts`: `Authorization: "Barrear"` e `data.choises` (typos)
4. `Story` no types: `description` é obrigatório; `exampleStory` no contexto define, mas verificar consistência

**Sinais de que a base está pronta para a Fase 1:**
- `npm install` concluído sem erro
- Estrutura de pastas e arquivos existentes mapeada
- Leitura de `src/types/story.ts`, `StoryContext`, `StoryTree`, `story/[id]/page.tsx` feita

---

# 7. Fase 1 — Correção e Estabilização da Base

**Objetivo:** Fazer o projeto compilar e a home renderizar sem erros de runtime causados por hooks ou contexto incorreto.

**Arquivos a revisar primeiro (ordem):**
1. `app/page.tsx`
2. `src/contexts/StoryContext.tsx`
3. `src/components/story-tree/StoryTree.tsx` (já ok, mas confirmar consumo de currentStory)

**Correções em `app/page.tsx`:**

| Problema | Ação |
|----------|------|
| Hooks fora do componente | Mover `useState`, `useStory` e `handleGenerate` para **dentro** do componente |
| Falta `"use client"` | Adicionar `"use client"` no topo (usa hooks client-side) |
| Componente não usa addNodeFromPrompt/prompt/loading/error | Incluir na UI quando chegar na Fase 6; por agora, focar em leitura e grafo |
| Só renderiza StoryTree | Adicionar título, texto do nó atual e botões de decisão (reaproveitar lógica de `/story/[id]`) |

**Estrutura esperada de `app/page.tsx` após correção:**
- `"use client"` no topo
- `useStory()` dentro do componente
- Cálculo de `currentNode` = `currentStory.nodes.find(n => n.id === currentNodeId)`
- Cálculo de `outgoingEdges` = `currentStory.edges.filter(e => e.from === currentNodeId)`
- Renderização de título, texto, botões e `StoryTree`
- Tratamento de `!currentNode` → mensagem "Nó não encontrado" ou "História em estado inválido"

**Correções em `StoryContext.tsx`:**

| Problema | Ação |
|----------|------|
| `currentStory: exampleStory` | Trocar para `currentStory: story` (estado mutável) |
| Typo `setStoty` | Renomear para `setStory` em todas as ocorrências |
| `addNodeFromPrompt` usa `exampleStory.nodes` | Usar `story.nodes` (via closure do `story` atual) |

**Correções em `StoryTree`:**
- Já consome `currentStory` do contexto; como `currentStory` passará a ser `story`, o grafo refletirá alterações automaticamente
- Garantir que `currentStory.nodes` e `currentStory.edges` vazios não quebrem: `useMemo` já retorna arrays vazios se não houver dados

**Sinais de que a base está estável:**
- `npm run build` passa sem erros
- `npm run dev` inicia sem erro
- Acessar `/` mostra título da história, texto do nó inicial, botões de decisão e grafo
- Clicar em decisão atualiza texto e botões
- Grafo exibe nós e arestas

---

# 8. Fase 2 — Implementação da Home Funcional

**Objetivo:** Home completa com leitura, decisões e grafo, sem formulário de IA ainda.

**Estrutura da home:**
- Container principal (pode ser `<main>` com classes Tailwind)
- Bloco de narrativa: título da história + título do nó + texto do nó
- Bloco de decisões: botões que disparam `setCurrentNodeId(edge.to)`
- Bloco de grafo: `StoryTree`
- (Fase 6: Bloco de IA)

**Como obter `currentNode`:**
```ts
const currentNode = currentStory.nodes.find((n) => n.id === currentNodeId);
```

**Como obter `outgoingEdges`:**
```ts
const outgoingEdges = currentStory.edges.filter((e) => e.from === currentNodeId);
```

**Navegação:**
- Ao clicar em um botão com `edge.label`, chamar `setCurrentNodeId(edge.to)`
- O React re-renderiza; `currentNode` e `outgoingEdges` mudam; a UI e o grafo se atualizam

**Layout sugerido:**
- Mobile: coluna (narrativa em cima, grafo embaixo)
- Desktop: duas colunas ou layout em grid

**Validação:**
- Home carrega com nó inicial
- Decisões levam ao próximo nó
- Nó terminal: sem botões; exibir "Fim deste ramo da história" ou similar
- StoryTree atualiza quando a história muda (mesmo antes de IA, ao navegar)

**Código conceitual para a Home (após correções):**

```tsx
// app/page.tsx
"use client";

import { useStory } from "@/contexts/StoryContext";
import { useMemo } from "react";
import { StoryTree } from "@/components/story-tree/StoryTree";
// StoryReader, StoryDecisionButtons (quando criados)

export default function HomePage() {
  const { currentStory, currentNodeId, setCurrentNodeId } = useStory();

  const currentNode = useMemo(
    () => currentStory.nodes.find((n) => n.id === currentNodeId),
    [currentStory, currentNodeId]
  );
  const outgoingEdges = useMemo(
    () => currentStory.edges.filter((e) => e.from === currentNodeId),
    [currentStory, currentNodeId]
  );

  if (!currentNode) {
    return <div>História em estado inválido.</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <h1>{currentStory.title}</h1>
      <h2>{currentNode.title}</h2>
      <p>{currentNode.text}</p>
      {outgoingEdges.length > 0 ? (
        outgoingEdges.map((edge) => (
          <button key={edge.id} onClick={() => setCurrentNodeId(edge.to)}>
            {edge.label}
          </button>
        ))
      ) : (
        <p>Fim deste ramo da história.</p>
      )}
      <section className="mt-8">
        <h2>Árvore da história</h2>
        <StoryTree />
      </section>
    </main>
  );
}
```

**StoryReader (quando extraído):**
- Props: `storyTitle`, `nodeTitle`, `nodeText`
- Renderiza os três em elementos semânticos
- Sem estado; puramente apresentacional

**StoryDecisionButtons (quando extraído):**
- Props: `edges: StoryEdge[]`, `onSelectEdge: (edge: StoryEdge) => void`
- Mapeia `edges` para botões; `onClick` chama `onSelectEdge(edge)`; o pai chama `setCurrentNodeId(edge.to)`

---

# 9. Fase 3 — StoryContext Completo e Correto

**Interface pública do contexto (contrato):**

```ts
interface StoryContextValue {
  currentStory: Story;
  currentNodeId: NodeId;
  setCurrentNodeId: (id: NodeId) => void;
  addNodeFromPrompt: (prompt: string) => Promise<{ ok: true; nodeId: string } | { ok: false; error: string }>;
}
```

**Suposição recomendada:** Manter `{ nodeId }` e `{ error }` como no código atual, pois o front já trata `"error" in result`. O importante é garantir consistência.

**Estado interno:**
- `story: Story` — mutável; inicializado com `exampleStory`
- `currentNodeId: NodeId` — mutável; inicializado com `'start'`

**Estado derivado:**
- `currentStory` = `story` (não `exampleStory`)

**Inicialização de `exampleStory`:**
- Deve existir um nó com `id: 'start'`
- Deve haver ao menos uma aresta saindo de `start`
- `nodes` e `edges` devem ser arrays válidos

**Implementação de `setCurrentNodeId`:**
- Assinatura: `(id: NodeId) => void`
- Ação: `setCurrentNodeId(id)` (setter do `useState`)
- Validação: o pai pode verificar se o nó existe; o contexto não precisa validar (evitar complexidade)

**Implementação de `addNodeFromPrompt`:**
- Assinatura: `(prompt: string) => Promise<{ nodeId: string } | { error: string }>`
- Fluxo:
  1. Obter `currentNode` de `story.nodes` usando `currentNodeId`
  2. Montar `context` = `currentNode?.text` (ou string vazia)
  3. `fetch('/api/ai/generate', { method: 'POST', body: JSON.stringify({ prompt, context }) })`
  4. `res = await fetch(...)`; `data = await res.json()`
  5. Se `!res.ok` → retornar `{ error: data.error || 'Erro desconhecido' }`
  6. `text = data.text`
  7. Se `!text` → retornar `{ error: 'Resposta vazia da IA' }`
  8. Gerar `newId = `node-${Date.now()}``
  9. Criar `newNode: StoryNode` com `id`, `title` (truncar prompt), `text`, `createdAt`
  10. Criar `newEdge: StoryEdge` com `from: currentNodeId`, `to: newId`, `label`
  11. `setStory(prev => ({ ...prev, nodes: [...prev.nodes, newNode], edges: [...prev.edges, newEdge] }))`
  12. `setCurrentNodeId(newId)`
  13. Retornar `{ nodeId: newId }`

**Geração de IDs:**
- Nó: `node-${Date.now()}` (ou `crypto.randomUUID()` se preferir)
- Aresta: `edge-${Date.now()}` — garantir unicidade dentro da sessão

**Evitar mutação incorreta:**
- Sempre usar `setStory(prev => ({ ...prev, nodes: [...], edges: [...] }))`
- Nunca fazer `story.nodes.push(newNode)`; sempre criar novo array

**Dependências:** `Story` e `StoryNode` de `src/types/story`; `fetch` para a API

---

# 10. Fase 4 — Componentes de UI e Composição da Tela

**StoryReader**
- **Arquivo:** `src/components/story/StoryReader.tsx`
- **Responsabilidade:** Exibir título da história, título e texto do nó atual
- **Props:** `{ storyTitle: string; nodeTitle: string; nodeText: string }`
- **Comportamento:** Renderizar em `<h1>`, `<h2>`, `<p>`
- **Estados:** Nenhum
- **Reuso:** HomePage, StoryPage
- **Validação:** Verificar que os textos exibidos correspondem ao nó atual
- **Como montar:** Componente funcional, `"use client"` se necessário (geralmente não, pois é puro)
- **Como testar:** Alterar props manualmente e verificar renderização

**StoryDecisionButtons**
- **Arquivo:** `src/components/story/StoryDecisionButtons.tsx`
- **Responsabilidade:** Listar decisões (arestas) e permitir seleção
- **Props:** `{ edges: StoryEdge[]; onSelect: (edge: StoryEdge) => void }`
- **Comportamento:** `edges.map(edge => <button key={edge.id} onClick={() => onSelect(edge)}>{edge.label}</button>)`
- **Estado vazio:** Se `edges.length === 0`, exibir "Fim deste ramo da história"
- **Reuso:** HomePage, StoryPage
- **Validação:** Clicar em decisão e verificar que `onSelect` é chamado com a aresta correta

**StoryPromptForm**
- **Arquivo:** `src/components/story/StoryPromptForm.tsx`
- **Responsabilidade:** Input de prompt, botão de gerar, estados de loading e erro
- **Props:** `{ onSubmit: (prompt: string) => Promise<void>; disabled?: boolean }`
  - Ou: `{ onSubmit: (prompt: string) => void; loading: boolean; error: string | null }` — o pai gerencia loading/error
- **Comportamento:**
  - Estado local: `prompt: string`
  - Botão desabilitado se `prompt.trim() === ''` ou `loading`
  - `onSubmit` chamado ao submeter; o pai pode limpar o campo em sucesso
- **Estados possíveis:** Normal, loading, error
- **Validação:** Bloquear envio com campo vazio; exibir erro quando prop `error` tiver valor

**StoryTree**
- **Arquivo:** `src/components/story-tree/StoryTree.tsx`
- **Responsabilidade:** Renderizar grafo React Flow a partir de `currentStory`
- **Props:** Pode consumir `useStory()` internamente (atual) ou receber `story: Story` como prop
- **Comportamento:** Mapear `story.nodes` → `Node[]`, `story.edges` → `Edge[]`; tratar listas vazias
- **Estados internos:** Zoom, posição (geridos pelo React Flow)
- **Validação:** Adicionar/remover nós e verificar que o grafo reflete

**AppLayout (opcional)**
- **Arquivo:** `src/components/layout/AppLayout.tsx`
- **Responsabilidade:** Container com header, estrutura geral
- **Props:** `{ children: ReactNode }`
- **Prioridade:** Pode ser inline na página no MVP

---

# 11. Fase 5 — API de IA

**Arquivo:** `app/api/ai/generate/route.ts`

**Responsabilidade:** Receber `{ prompt, context }`, chamar provedor de IA (OpenAI), retornar `{ text }` ou `{ error }`.

**Payload de entrada (JSON):**
- `prompt: string` — obrigatório
- `context?: string` — opcional (texto do nó atual)

**Validações:**
- Se `!prompt || typeof prompt !== 'string'` → 400 `{ error: "Prompt é obrigatório" }`
- Se `!process.env.AI_API_KEY` → 500 `{ error: "API key não configurada" }`

**Chamada ao provedor:**
- URL: `https://api.openai.com/v1/chat/completions`
- Header: `Authorization: Bearer ${apiKey}` (**não** "Barrear")
- Body: `{ model: "gpt-4o-mini", messages: [...], max_tokens: 100 }`
- Resposta: `data.choices?.[0]?.message?.content` (**não** `choises`)

**Estrutura de resposta padronizada:**
- Sucesso 200: `{ text: string }`
- Erro 400: `{ error: string }`
- Erro 500: `{ error: string }`

**Tratamento de erros:**
- Resposta da IA sem `choices` ou `content` vazio → 500 `{ error: "Resposta vazia da IA" }`
- Typo "Responsta" → "Resposta"
- Typo "Erro ao gerar text" → "Erro ao gerar texto"
- `catch`: `console.error(err)`; retornar 500 `{ error: "Erro ao se comunicar com o provedor de IA" }`

**Correções obrigatórias (typos atuais):**
- `Authorization: "Barrear ${apiKey}"` → `Authorization: "Bearer ${apiKey}"`
- `data.choises` → `data.choices`
- "Responsta vazia" → "Resposta vazia"
- "Erro ao gerar text" → "Erro ao gerar texto"

**Teste isolado:**
```bash
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Elena encontra um lago","context":"Ela segue o som..."}'
```

---

# 12. Fase 6 — Integração Completa da IA no Frontend

**Fluxo do formulário de prompt:**
1. Usuário digita no input
2. Usuário clica em "Gerar com IA"
3. Front: `loading = true`, `error = null`
4. Chamada `addNodeFromPrompt(prompt)`
5. Sucesso: limpar prompt, `loading = false`; novo nó aparece automaticamente (currentNodeId atualizado)
6. Erro: `error = result.error`, `loading = false`; exibir mensagem

**Estados locais necessários (na HomePage):**
- `prompt: string`
- `loading: boolean`
- `error: string | null`

**Chamada a `addNodeFromPrompt`:**
```ts
const result = await addNodeFromPrompt(prompt.trim());
if ("error" in result) {
  setError(result.error);
} else {
  setPrompt("");
  setError(null);
}
setLoading(false);
```

**Tratamento de sucesso:** O contexto já atualiza `currentNodeId` e `story`; a UI reage automaticamente.
**Tratamento de erro:** Exibir `error` próximo ao botão; não alterar a história.
**Bloquear botão:** `disabled={loading || !prompt.trim()}`
**Limpar campo:** Somente em sucesso; em erro, manter o prompt para retry.

**Validação:** Gerar um nó, verificar que ele aparece no texto e no grafo; simular erro (chave inválida) e verificar mensagem.

---

# 13. Fase 7 — Modelagem Técnica do Grafo

**Mapeamento StoryNode → Node (React Flow):**
- `id` → `Node.id`
- `position` → calcular se não existir: `(index % 3) * (W + gap)`, `floor(index/3) * (H + gap)`
- `data.label` → `node.title || node.text.slice(0, 30) + '...'`

**Mapeamento StoryEdge → Edge:**
- `id` → `Edge.id`
- `from` → `source`
- `to` → `target`

**Listas vazias:**
- Se `nodes.length === 0` ou `edges.length === 0`, `useMemo` retorna `[]`; React Flow aceita arrays vazios sem quebrar

**Re-renderização:**
- `useMemo` depende de `currentStory`; qualquer mudança em `currentStory` recalcula `nodes` e `edges`

**Validação:** Adicionar nó via IA e confirmar que o grafo exibe o novo nó e a nova aresta.

---

# 14. Blueprint de Código por Arquivo

## `app/layout.tsx`
- **Objetivo:** Layout raiz; fornecer StoryProvider e metadata
- **Conteúdo:**
  - `import type { Metadata } from "next"`
  - `import "./globals.css"`
  - `import { StoryProvider } from "../src/contexts/StoryContext"`
  - `metadata: { title, description }`
  - `<html><body><StoryProvider>{children}</StoryProvider></body></html>`
- **Exports:** `RootLayout` (default)
- **Conexões:** StoryProvider envolve toda a app; globals.css aplica estilos globais
- **Erros comuns:** Esquecer StoryProvider quebra useStory em todas as páginas
- **Checklist:** metadata definido; StoryProvider envolve children; lang="pt-BR"

## `app/page.tsx`
- **Objetivo:** Home com leitura, decisões, prompt de IA e grafo
- **Imports:** `useStory`, `useState`, `useMemo`, `StoryTree`, `StoryReader`, `StoryDecisionButtons`, `StoryPromptForm`
- **Exports:** componente default `HomePage`
- **Estado local:** `prompt`, `loading`, `error` (para IA)
- **Dados do contexto:** `currentStory`, `currentNodeId`, `setCurrentNodeId`, `addNodeFromPrompt`
- **Derivados:** `currentNode`, `outgoingEdges` via useMemo
- **Handler:** `handleGenerate` que chama `addNodeFromPrompt`, gerencia loading/error
- **Composição:** StoryReader + StoryDecisionButtons + StoryPromptForm + StoryTree
- **Conexões:** Consome StoryContext; passa props para componentes filhos
- **Erros comuns:** Hooks fora do componente; esquecer "use client"
- **Checklist:** Hooks dentro do componente; currentNode tratado quando null; botão IA desabilitado em loading

## `app/(routes)/story/[id]/page.tsx`
- **Objetivo:** Página parametrizada (espelho da home para o MVP)
- **Imports:** `useParams`, `useStory`, `useMemo`, componentes compartilhados
- **Dados:** `currentStory`, `currentNodeId`, `setCurrentNodeId`; `id` da rota (pode ser ignorado no MVP)
- **Lógica:** Idêntica à home para cálculo de currentNode e outgoingEdges
- **Conexões:** Mesmo contexto; reutiliza StoryReader, StoryDecisionButtons
- **Checklist:** Carrega sem erro; exibe narrativa e decisões

## `app/api/ai/generate/route.ts`
- **Objetivo:** Handler POST para geração de texto via IA
- **Exports:** `POST` (função async)
- **Fluxo:**
  1. `await request.json()` → `{ prompt, context }`
  2. Validar prompt
  3. Verificar AI_API_KEY
  4. `fetch` para OpenAI com `Authorization: Bearer ${apiKey}`
  5. `data.choices?.[0]?.message?.content`
  6. Retornar `{ text }` ou `{ error }`
- **Checklist:** Bearer (não Barrear); choices (não choises); mensagens em português correto

## `src/types/story.ts`
- **Objetivo:** Contratos de dados
- **Exports:** `StoryId`, `NodeId`, `StoryNode`, `StoryEdge`, `Story`
- **Campos Story:** id, title, description, nodes, edges, createdAt, createdBy?, isPublic?
- **Campos StoryNode:** id, title, text, isStart?, isEnding?, createdAt, createdBy?
- **Campos StoryEdge:** id, from, to, label
- **Checklist:** Nenhuma alteração necessária para o MVP se já estiver consistente

## `src/contexts/StoryContext.tsx`
- **Objetivo:** Estado global da história
- **Exports:** `StoryProvider`, `useStory`
- **Estado:** `story`, `currentNodeId`
- **Valor exposto:** `currentStory: story`, `currentNodeId`, `setCurrentNodeId`, `addNodeFromPrompt`
- **addNodeFromPrompt:** usa `story` (não exampleStory); cria newNode e newEdge; atualiza story e currentNodeId
- **Checklist:** currentStory = story; setStory (não setStoty); addNodeFromPrompt usa story.nodes

## `src/components/story/StoryReader.tsx`
- **Props:** `storyTitle`, `nodeTitle`, `nodeText`
- **Render:** h1, h2, p
- **Checklist:** Sem estado; sem lógica de negócio

## `src/components/story/StoryDecisionButtons.tsx`
- **Props:** `edges`, `onSelect`
- **Render:** Botões; ou "Fim deste ramo" se edges vazio
- **Checklist:** onClick chama onSelect com edge correto

## `src/components/story/StoryPromptForm.tsx`
- **Props:** `onSubmit`, `loading`, `error`
- **Estado local:** `prompt`
- **Comportamento:** Input controlado; botão desabilitado quando loading ou prompt vazio; exibe error
- **Checklist:** Não envia vazio; exibe loading e error

## `src/components/story-tree/StoryTree.tsx`
- **Dados:** `currentStory` via useStory
- **Mapeamento:** nodes, edges para React Flow
- **Checklist:** Listas vazias não quebram; IDs únicos

---

# 15. Contratos Técnicos

**Tipos (Story, StoryNode, StoryEdge):**
- `Story`: id, title, description, nodes[], edges[], createdAt
- `StoryNode`: id, title, text, isStart?, isEnding?, createdAt
- `StoryEdge`: id, from, to, label
- IDs únicos; toda aresta referencia nós existentes

**Contexto:**
- `currentStory`: sempre o estado mutável `story`
- `setCurrentNodeId(id)`: atualiza apenas o nó atual; não valida existência
- `addNodeFromPrompt(prompt)`: retorna `{ nodeId }` ou `{ error }`; em sucesso, atualiza story e currentNodeId

**API:**
- Request: `{ prompt: string, context?: string }`
- Response 200: `{ text: string }`
- Response 4xx/5xx: `{ error: string }`

**Componentes:**
- StoryReader: recebe textos; não altera estado
- StoryDecisionButtons: recebe edges e callback; callback recebe edge
- StoryPromptForm: recebe onSubmit, loading, error; gerencia prompt localmente

**Integração IA:**
- Front chama addNodeFromPrompt(prompt)
- addNodeFromPrompt chama POST /api/ai/generate
- Em sucesso: novo nó e aresta; currentNodeId = novo nó
- Em erro: retorna { error }; front exibe mensagem; story inalterada

---

# 16. Sequência Técnica Passo a Passo

| Passo | Ação | Objetivo | Arquivos | Critério de sucesso |
|-------|------|----------|----------|---------------------|
| 1 | Abrir `app/page.tsx` e mover todos os hooks para dentro do componente | Corrigir erro de hooks | page.tsx | Build passa |
| 2 | Adicionar `"use client"` em `app/page.tsx` | Habilitar hooks client-side | page.tsx | Sem erro de hooks em server component |
| 3 | Em StoryContext, trocar `currentStory: exampleStory` por `currentStory: story` | Estado mutável | StoryContext.tsx | Grafo reflete mudanças |
| 4 | Renomear `setStoty` para `setStory` | Corrigir typo | StoryContext.tsx | Sem referências quebradas |
| 5 | Em addNodeFromPrompt, usar `story.nodes` em vez de `exampleStory.nodes` | Buscar nó no estado correto | StoryContext.tsx | addNodeFromPrompt funciona com estado atual |
| 6 | Montar home: calcular currentNode, outgoingEdges, renderizar título, texto, botões, StoryTree | Home funcional sem IA | page.tsx | Navegação e grafo funcionando |
| 7 | Corrigir route.ts: Bearer, choices, mensagens | API funcional | route.ts | curl retorna { text } |
| 8 | Integrar StoryPromptForm na home com prompt, loading, error, handleGenerate | IA no frontend | page.tsx, StoryPromptForm | Gerar nó atualiza narrativa e grafo |
| 9 | Criar StoryReader e StoryDecisionButtons; substituir markup inline | Componentização | StoryReader, StoryDecisionButtons, page.tsx | Mesma funcionalidade |
| 10 | Verificar .env.local, README, npm run build | Preparar entrega | README, .env.local | Deploy possível |

---

# 17. Checklist Técnico por Etapa

## Setup
- [ ] Node >= 20 instalado
- [ ] npm install executado
- [ ] .env.local criado com AI_API_KEY
- [ ] npm run dev inicia sem erro fatal
- [ ] npm run build completa (pode ter erros a corrigir)

## Estabilização
- [ ] Hooks dentro de componentes
- [ ] "use client" onde necessário
- [ ] currentStory = story
- [ ] setStory (sem typo)
- [ ] addNodeFromPrompt usa story

## Home
- [ ] currentNode calculado
- [ ] outgoingEdges calculado
- [ ] Título e texto exibidos
- [ ] Botões de decisão funcionando
- [ ] StoryTree renderizado
- [ ] Nó terminal tratado

## Contexto
- [ ] exampleStory como valor inicial
- [ ] story atualizado em addNodeFromPrompt
- [ ] currentNodeId atualizado em addNodeFromPrompt
- [ ] IDs únicos para nós e arestas

## Componentes
- [ ] StoryReader criado e usado
- [ ] StoryDecisionButtons criado e usado
- [ ] StoryPromptForm criado e usado

## API
- [ ] Bearer no header
- [ ] choices no parsing
- [ ] Respostas padronizadas
- [ ] Validação de prompt
- [ ] Tratamento de AI_API_KEY ausente

## IA
- [ ] handleGenerate implementado
- [ ] loading durante chamada
- [ ] error exibido em falha
- [ ] prompt limpo em sucesso
- [ ] Botão desabilitado quando loading ou vazio
- [ ] Novo nó aparece na narrativa e no grafo

## Validação final
- [ ] npm run build sem erros
- [ ] Navegação completa testada
- [ ] Geração com IA testada (sucesso e erro)
- [ ] Sem erros no console durante uso normal

## Deploy
- [ ] README atualizado
- [ ] AI_API_KEY configurada no provider
- [ ] Build de produção OK
- [ ] Smoke test em produção

---

# 18. Erros Comuns e Como Evitar

| Erro | Causa | Impacto | Evitar | Corrigir |
|------|-------|---------|--------|----------|
| Hooks fora de componente | useState/useStory no escopo do módulo | Build falha ou runtime "invalid hook call" | Sempre colocar hooks dentro de função de componente | Mover para dentro do componente |
| currentStory estático | Expor exampleStory em vez de story | Grafo e narrativa não refletem novos nós | Usar story no value do contexto | Trocar para currentStory: story |
| Mutação direta de array | story.nodes.push(node) | Re-renders imprevisíveis | Usar setStory(prev => ({...prev, nodes: [...prev.nodes, newNode]})) | Reescrever para imutabilidade |
| Authorization "Barrear" | Typo no header | 401 da API de IA | Revisar documentação OpenAI | Trocar para "Bearer" |
| data.choises | Typo no parsing | Resposta sempre vazia | Copiar nome correto da API | Trocar para choices |
| API retorno inconsistente | Não padronizar { text } e { error } | Front não sabe como tratar | Definir contrato único | Sempre { text } ou { error } |
| IDs duplicados | Gerar ID sem timestamp/random | Conflitos no React Flow | Usar `node-${Date.now()}` ou crypto.randomUUID | Regenerar IDs |
| Componente client em server | Usar useStory em Server Component | Erro "use client" | Adicionar "use client" ou extrair para client | Colocar "use client" no topo |
| Falta de "use client" | Hooks em componente sem diretiva | Erro de hydration ou build | Lembrar que hooks exigem client | Adicionar "use client" |
| AI_API_KEY não definida | .env.local ausente ou mal nomeada | 500 na rota de IA | Documentar no README | Criar .env.local com AI_API_KEY |

---

# 19. Critérios de Validação por Fase

| Fase | O que precisa funcionar | Como testar | Navegador | Terminal | Console | Concluído quando |
|------|-------------------------|-------------|-----------|----------|---------|------------------|
| 0 | Ambiente pronto | npm run dev | - | Sem crash | - | Servidor sobe |
| 1 | Base estável | Navegar para / | Página carrega | Build OK | Sem hook errors | Leitura e grafo visíveis |
| 2 | Home funcional | Clicar decisões | Texto e botões mudam; grafo atualiza | - | Sem erros | Fluxo completo de leitura |
| 3 | Contexto correto | addNodeFromPrompt (manual ou IA) | Novo nó aparece | - | - | Grafo reflete alterações |
| 4 | Componentes | Mesma UX | - | - | - | Código modularizado |
| 5 | API IA | curl POST | - | Resposta 200 com text | - | { text } retornado |
| 6 | Integração IA | Gerar via UI | Novo nó na narrativa e no grafo | - | Sem erros | Fluxo IA end-to-end |
| 7 | Grafo estável | Adicionar nós, listas vazias | Grafo não quebra | - | - | Sem crash com dados extremos |
| 9 | Refinos | Revisar textos e layout | UX clara | - | - | MVP polido |
| 10 | Deploy | Acessar URL prod | Fluxo completo | Logs OK | - | Produção funcional |

---

# 20. Critérios de Pronto do MVP

**O que precisa existir:**
- app/layout.tsx com StoryProvider
- app/page.tsx com leitura, decisões, prompt de IA e grafo
- app/api/ai/generate/route.ts funcional
- src/types/story.ts
- src/contexts/StoryContext.tsx com estado mutável e addNodeFromPrompt
- src/components/story/StoryReader, StoryDecisionButtons, StoryPromptForm
- src/components/story-tree/StoryTree.tsx
- .env.local com AI_API_KEY (local)
- README com instruções

**O que precisa funcionar:**
- Navegação entre nós por decisões
- Visualização da árvore em grafo
- Geração de novo nó com IA a partir do prompt
- Exibição de erro quando IA falha
- Fluxo de leitura independente da IA (IA é "extra")

**O que precisa estar validado:**
- npm run build sem erros
- Fluxo principal testado manualmente
- Sem erros críticos no console

**Fluxos que precisam estar íntegros:**
- Leitura e navegação
- Geração com IA (sucesso)
- Geração com IA (erro tratado)

**Aceitável simplificar:**
- Layout visual (sem design elaborado)
- Mensagens de erro (texto simples)
- Página /story/[id] como espelho simples

**O que não pode falhar:**
- Compilação
- Navegação entre nós
- Exibição do grafo
- Tratamento de erro da IA (não quebrar a app)

---

# 21. Plano Final de Entrega

**Revisão final:**
- Rodar checklist completo da seção 17
- Verificar que nenhum typo crítico permanece (Bearer, choices, setStory, currentStory)
- Confirmar que exampleStory tem nó 'start' e arestas válidas

**README:**
- Descrição do produto (storytelling interativo com IA)
- Pré-requisitos (Node 20+)
- Como rodar: npm install, npm run dev
- Como configurar AI_API_KEY em .env.local
- Como usar: acessar /, ler, clicar decisões, usar prompt para gerar
- Limitações do MVP (sem persistência, sem auth)

**.env.local:**
- Não versionado (já no .gitignore do Next)
- Conteúdo: AI_API_KEY=sk-...

**npm run build:**
- Deve completar sem erros antes do deploy

**Validações antes do deploy:**
- Build OK
- Variável AI_API_KEY configurada no provider (Vercel)
- Nenhum secret no código-fonte

**Deploy:**
- Conectar repositório ao Vercel
- Configurar AI_API_KEY no painel
- Deploy automático ou manual
- Verificar URL gerada

**Smoke test em produção:**
- Acessar /
- Navegar por 2–3 decisões
- Gerar um nó com IA (se chave configurada)
- Verificar ausência de erros no console

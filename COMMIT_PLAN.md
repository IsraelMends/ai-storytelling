# Plano de Commits — AI Storytelling

Este documento organiza os arquivos em commits atômicos e semanticamente coerentes, seguindo **Conventional Commits** e boas práticas de projetos tech enterprise.

---

## Convenção de Commits

- **chore:** Configuração, tooling, setup
- **feat:** Nova funcionalidade
- **fix:** Correção de bug
- **docs:** Documentação
- **refactor:** Refatoração sem mudança de comportamento

---

## Sequência de Commits (ordem sugerida)

### 1. `chore: add project configuration and dependencies`

**Descrição:** Configuração base do projeto Next.js, TypeScript e ferramentas.

**Arquivos:**
```
package.json
package-lock.json
tsconfig.json
next.config.ts
next-env.d.ts
eslint.config.mjs
postcss.config.mjs
```

**Comando:**
```bash
git add package.json package-lock.json tsconfig.json next.config.ts next-env.d.ts eslint.config.mjs postcss.config.mjs
git commit -m "chore: add project configuration and dependencies"
```

---

### 2. `feat: add story domain types`

**Descrição:** Tipos do domínio de negócio para história interativa.

**Arquivos:**
```
src/types/story.ts
```

**Comando:**
```bash
git add src/types/story.ts
git commit -m "feat: add story domain types"
```

---

### 3. `feat: add StoryContext and state management`

**Descrição:** Contexto global e gerenciamento de estado da narrativa.

**Arquivos:**
```
src/contexts/StoryContext.tsx
```

**Depende de:** `src/types/story.ts`

**Comando:**
```bash
git add src/contexts/StoryContext.tsx
git commit -m "feat: add StoryContext and state management"
```

---

### 4. `feat: add global layout and styles`

**Descrição:** Layout raiz da aplicação e estilos globais.

**Arquivos:**
```
app/layout.tsx
app/globals.css
```

**Comando:**
```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: add global layout and styles"
```

---

### 5. `feat: add story UI components`

**Descrição:** Componentes reutilizáveis para leitura e interação com a história.

**Arquivos:**
```
src/components/story/StoryReader.tsx
src/components/story/StoryDecisionButtons.tsx
src/components/story/StoryPromptForm.tsx
src/components/layout/AppLayout.tsx
```

**Comando:**
```bash
git add src/components/story/StoryReader.tsx src/components/story/StoryDecisionButtons.tsx src/components/story/StoryPromptForm.tsx src/components/layout/AppLayout.tsx
git commit -m "feat: add story UI components"
```

---

### 6. `feat: add StoryTree visualization with React Flow`

**Descrição:** Visualização em grafo da árvore da história.

**Arquivos:**
```
src/components/story-tree/StoryTree.tsx
```

**Comando:**
```bash
git add src/components/story-tree/StoryTree.tsx
git commit -m "feat: add StoryTree visualization with React Flow"
```

---

### 7. `feat: add AI generation API endpoint`

**Descrição:** Rota de API para geração de texto via IA (OpenAI).

**Arquivos:**
```
app/api/ai/generate/route.ts
```

**Nota:** Não versionar `.env.local` (chave da API). Garantir que `.env.example` exista se necessário.

**Comando:**
```bash
git add app/api/ai/generate/route.ts
git commit -m "feat: add AI generation API endpoint"
```

---

### 8. `feat: add home and story pages`

**Descrição:** Páginas principais da aplicação (home e rota dinâmica).

**Arquivos:**
```
app/page.tsx
app/(routes)/story/[id]/page.tsx
```

**Comando:**
```bash
git add app/page.tsx "app/(routes)/story/[id]/page.tsx"
git commit -m "feat: add home and story pages"
```

---

### 9. `feat: add services and hooks structure`

**Descrição:** Estrutura base de serviços e hooks para futura extensão.

**Arquivos:**
```
src/services/aiApi.ts
src/services/indexedDB.ts
src/services/socket.ts
src/hooks/useBiasDetection.ts
src/hooks/useSpeechRecognition.ts
```

**Comando:**
```bash
git add src/services/ src/hooks/
git commit -m "feat: add services and hooks structure"
```

---

### 10. `docs: add implementation plan`

**Descrição:** Documentação do plano de implementação do MVP.

**Arquivos:**
```
implementation-plan.md
```

**Comando:**
```bash
git add implementation-plan.md
git commit -m "docs: add implementation plan"
```

---

### 11. `chore: add commit plan and project docs`

**Descrição:** Este documento e qualquer outro material de onboarding.

**Arquivos:**
```
COMMIT_PLAN.md
```

**Comando:**
```bash
git add COMMIT_PLAN.md
git commit -m "chore: add commit plan and project docs"
```

---

## Resumo Visual

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. chore: configuration                                          │
├─────────────────────────────────────────────────────────────────┤
│ 2. feat: story types                                             │
│ 3. feat: StoryContext                                            │
├─────────────────────────────────────────────────────────────────┤
│ 4. feat: layout + globals.css                                    │
│ 5. feat: story components (Reader, Buttons, Form, AppLayout)     │
│ 6. feat: StoryTree (React Flow)                                  │
│ 7. feat: AI API route                                            │
│ 8. feat: pages (home + story/[id])                               │
├─────────────────────────────────────────────────────────────────┤
│ 9. feat: services & hooks structure                              │
│ 10. docs: implementation plan                                    │
│ 11. chore: commit plan                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Script para executar todos os commits

Salve como `scripts/prepare-commits.sh` (opcional):

```bash
#!/bin/bash
set -e

git add package.json package-lock.json tsconfig.json next.config.ts next-env.d.ts eslint.config.mjs postcss.config.mjs
git commit -m "chore: add project configuration and dependencies"

git add src/types/story.ts
git commit -m "feat: add story domain types"

git add src/contexts/StoryContext.tsx
git commit -m "feat: add StoryContext and state management"

git add app/layout.tsx app/globals.css
git commit -m "feat: add global layout and styles"

git add src/components/story/ src/components/layout/
git commit -m "feat: add story UI components"

git add src/components/story-tree/
git commit -m "feat: add StoryTree visualization with React Flow"

git add app/api/ai/generate/route.ts
git commit -m "feat: add AI generation API endpoint"

git add app/page.tsx "app/(routes)/story/[id]/page.tsx"
git commit -m "feat: add home and story pages"

git add src/services/ src/hooks/
git commit -m "feat: add services and hooks structure"

git add implementation-plan.md
git commit -m "docs: add implementation plan"

git add COMMIT_PLAN.md
git commit -m "chore: add commit plan and project docs"

echo "✅ Todos os commits foram criados com sucesso."
```

---

## Notas

- Se o projeto já tiver o commit inicial do Create Next App, considere fazer um `git reset --soft` ou trabalhar em uma branch nova e fazer os commits incrementalmente.
- Arquivos a **não versionar:** `.env.local`, `node_modules/`, `.next/`, `.git/`, `.claude/`
- Verifique se `.gitignore` está correto antes dos commits.

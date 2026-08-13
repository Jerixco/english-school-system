# 🏫 English School System

> **Projeto de Estudos & Laboratório Fullstack (Next.js 16+, PostgreSQL/Neon, Prisma, Service Layer, NextAuth, WebRTC, Stripe & Hardening OWASP)**

---

## 📖 Sobre o Projeto

O **English School System** é uma aplicação fullstack desenvolvida como laboratório de arquitetura de software para estudo e aplicação prática de **Clean Architecture**, segurança em camadas (OWASP), WebRTC e fluxos de negócio SaaS modernos.

O sistema simula a gestão completa de uma escola de idiomas:
- 📊 **CRM de Leads:** Funil visual (Kanban) para qualificação e conversão de novos alunos.
- 🎓 **Matrículas & Planos:** Gestão de planos (`BASIC`, `STANDARD`, `PREMIUM`, `CUSTOM`) com assinaturas e webhooks idempotentes do Stripe.
- 🔴 **Aulas Ao Vivo (WebRTC):** Salas de transmissão ao vivo integradas via Jitsi Meet com isolamento de permissões de mídia.
- 📼 **Biblioteca VOD:** Gravações de aulas com thumbnails e política de retenção automática de 30 dias.
- 🤖 **Alex AI Tutor:** Tutor conversacional para prática de conversação com defesas anti-jailbreak e rate limiting.
- 🔒 **Hardening & LGPD:** Proteção contra força bruta, autenticação 2FA (TOTP), criptografia AES-256-GCM, cabeçalhos de segurança HTTP estritos e direito ao esquecimento.

---

## 🏛️ Arquitetura do Sistema (Clean Architecture)

```
[ Cliente / Browser (React 19 + TailwindCSS + Radix UI + Lucide) ]
                      │ (HTTPS / TLS 1.3 + CSP + Permissions-Policy)
                      ▼
[ Next.js 16 API Routes (Thin Controllers / Zod Validation / Rate Limiter / RBAC) ]
                      │
                      ▼
[ Service Layer (`src/services/`) ]
  ├── LeadService         (Gestão e funil de leads do CRM)
  ├── StudentService      (Gestão de matrículas, status e alunos)
  ├── TeacherService      (Disponibilidade e grade de horários docentes)
  ├── LiveSessionService  (Gestão de salas e transmissões WebRTC ao vivo)
  ├── RecordingService    (Processamento de VOD e retenção de 30 dias)
  ├── StripeService       (Processamento idempotente de checkout e webhooks)
  ├── WhatsAppService     (Automação de mensagens e notificações)
  └── AiTutorService      (Tutor inteligente com guardrails anti-injection)
          │                                     │
          ▼                                     ▼
[ Neon PostgreSQL (Prisma ORM) ]       [ Provedores Externos / Sentry / Redis ]
```

---

## 🛡️ Camadas de Segurança & Hardening (OWASP Compliance)

### 1. Segurança HTTP & Cabeçalhos Estritos (`next.config.js`)
- **Content-Security-Policy (CSP):** Delimitação rígida de origens permitidas (Stripe, Calendly, Jitsi WebRTC, Sentry, Google Fonts e Unsplash), bloqueando `object-src`, `frame-ancestors` externos e forçando `upgrade-insecure-requests`.
- **Remoção de Metadados do Servidor:** `poweredByHeader: false` eliminando o cabeçalho `X-Powered-By: Next.js` (mitigação da vulnerabilidade CWE-497).
- **Permissions-Policy:** Restrição de acesso a microfone e câmera estritamente ao domínio da aplicação e às salas WebRTC integradas.
- **HSTS:** `Strict-Transport-Security` configurado com `max-age=63072000; includeSubDomains; preload`.

### 2. Autenticação & Controle de Acesso (RBAC)
- **NextAuth.js v4** com estratégia JWT em cookies seguros `HttpOnly; SameSite=Lax; Secure`.
- **2FA/TOTP com AES-256-GCM:** Segredos de duplo fator criptografados com chave simétrica de 256 bits (`speakeasy` + vetor de inicialização aleatório).
- **Proteção Anti-Brute Force:** Bloqueio automático temporário de 15 minutos após 5 tentativas consecutivas de login incorreto.
- **Proteção Anti-IDOR (Insecure Direct Object Reference):** 100% das rotas de API com identificador verificam rigorosamente a propriedade do recurso (`userId === ownerId`) ou privilégio de `ADMIN` no servidor.
- **Conformidade LGPD (Art. 18):** Módulo de anonimização irreversível PII (*Direito ao Esquecimento*).

### 3. Validação de Inputs & Proteção Anti-Injeção
- **Consultas Parametrizadas (Prisma ORM):** Imunidade nativa contra SQL Injection (nenhuma query SQL dinâmica por concatenação).
- **DOMPurify Anti-XSS:** Sanitização rigorosa em duas etapas (gravação e renderização) para conteúdos ricos do Blog.
- **Sanitização de Strings:** Expurgo de tags `<>` e caracteres de controle ASCII não-imprimíveis (`\x00-\x1F\x7F`).
- **AI Prompt Injection & Jailbreak Defense:** Guardrails no `AiTutorService` que impedem simulação de terminais, evasão de persona ou execução de código.

---

## 🎨 Interface & Design System (UI/UX)

- **Design System Modular:** Primitivos acessíveis baseados em Radix UI, TailwindCSS e Shadcn UI.
- **Diferenciação Cromática Contextual:**
  - 🏢 **Administrador:** Paleta Slate / Dark Blue para gestão analítica, KPIs e CRM.
  - 🎓 **Professor:** Paleta Índigo / Violeta com foco em salas de aula virtuais e materiais VOD.
  - 📚 **Aluno:** Paleta Esmeralda / Sky com foco em progresso de estudos, frequência e Tutor Alex.
- **Empty States Ilustrados:** Componente `EmptyState` com ícones temáticos e botões de ação contextual para listas sem registros.
- **Quick Prompt Pills:** Sugestões rápidas de conversação para prática ágil de inglês com o Tutor Alex.

---

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, TailwindCSS, Radix UI Primitives, Lucide Icons, Framer Motion.
- **Backend:** Next.js Route Handlers, Service Layer Pattern, Zod Validation, Upstash Redis Rate Limiting.
- **Banco de Dados:** Neon PostgreSQL (Cloud Serverless) via Prisma ORM v5.
- **Comunicação em Tempo Real:** WebRTC / Jitsi Meet Integration.
- **Segurança & Criptografia:** AES-256-GCM, BCrypt.js, TOTP (`speakeasy`), CSP, DOMPurify, Rate Limiting.
- **Testes & Qualidade:** Vitest, TypeScript Strict Mode, Playwright E2E.

---

## 📋 Checklist de Serviços e Variáveis de Ambiente

O projeto possui fallbacks inteligentes caso alguns serviços externos não estejam configurados em ambiente local:

| Variável | Finalidade | Obrigatório Local? | Fallback / Comportamento |
|---|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL (Prisma) | **Sim** | Armazenamento de dados e relacionamentos |
| `NEXTAUTH_SECRET` | Criptografia de Sessão JWT | **Sim** | Assinatura e integridade dos tokens de auth |
| `ENCRYPTION_KEY` | Criptografia AES-256-GCM | **Sim** (32 chars) | Proteção de segredos 2FA e dados sensíveis |
| `KV_REST_API_URL` | Upstash Redis REST URL | *Opcional* | Fallback automático para limiter em memória |
| `KV_REST_API_TOKEN` | Upstash Redis Token | *Opcional* | Fallback automático para limiter em memória |
| `GEMINI_API_KEY` | Google Gemini API (Alex Tutor) | *Opcional* | Mensagem de aviso caso não configurado |
| `STRIPE_SECRET_KEY` | Checkout e Assinaturas | *Opcional* | Simulação de fluxo financeiro local |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Elements / Frontend | *Opcional* | Renderização condicional no checkout |
| `SMTP_*` | Servidor SMTP para E-mails | *Opcional* | Logs em console de disparo |

---

## ⚡ Guia de Instalação e Execução Local

```bash
# 1. Clonar o repositório
git clone https://github.com/Jerixco/english-school-system.git
cd english-school-system

# 2. Configurar as variáveis de ambiente
cp .env.example .env

# 3. Instalar dependências
npm install

# 4. Sincronizar o Banco de Dados (Prisma Push)
npx prisma db push

# 5. Popular o Banco com Dados Iniciais (Seeding)
npx tsx prisma/seed.ts

# 6. Executar os Testes Unitários
npx vitest run

# 7. Iniciar o Servidor de Desenvolvimento
npm run dev
```

---

## 📑 Credenciais de Teste (Ambiente de Desenvolvimento)

Após rodar o comando de seed (`npx tsx prisma/seed.ts`), o sistema criará automaticamente as contas de teste locais:
- 👑 **Administrador:** `admin@englishschool.com` / `Senha123!` (Painel `/admin`)
- 👨‍🏫 **Professor:** `teacher@englishschool.com` / `Senha123!` (Painel `/professor`)
- 🎓 **Aluno:** `student@englishschool.com` / `Senha123!` (Painel `/aluno`)

---

## 📜 Licença

Projeto desenvolvido para fins de estudo e aprimoramento técnico. Distribuído sob a licença MIT.

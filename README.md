# 🏫 English School System

> **Projeto de Estudos & Laboratório Fullstack (Next.js 16+, PostgreSQL/Neon, Prisma, Service Layer, NextAuth, WebRTC, Stripe & Hardening OWASP)**

---

## 📖 Sobre o Projeto

O **English School System** é uma aplicação fullstack desenvolvida como laboratório de arquitetura de software para estudo e aplicação prática de **Clean Architecture**, segurança em camadas (OWASP), WebRTC e fluxos de negócio SaaS modernos.

O sistema simula a gestão completa de uma escola de idiomas:
- 📊 **CRM de Leads:** Funil visual (Kanban) para qualificação e conversão de novos alunos.
- 🎓 **Matrículas & Planos:** Gestão de planos (`BASIC`, `STANDARD`, `PREMIUM`, `CUSTOM`) com assinaturas e webhooks idempotentes do Stripe.
- 🔴 **Aulas Ao Vivo (WebRTC):** Salas de transmissão ao vivo integradas via Jitsi Meet com isolamento de permissões de mídia.
- 📼 **Biblioteca VOD:** Gravações de aulas com thumbnails e política de retenção automática temporária.
- 🤖 **Alex AI Tutor:** Tutor conversacional para prática de inglês com guardrails de contexto e rate limiting.
- 🔒 **Hardening & LGPD:** Proteção contra força bruta, autenticação 2FA (TOTP), criptografia simétrica de ponta a ponta, cabeçalhos HTTP estritos e direito ao esquecimento.

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
  ├── RecordingService    (Processamento de VOD e retenção de aulas)
  ├── StripeService       (Processamento idempotente de checkout e webhooks)
  ├── WhatsAppService     (Automação de mensagens e notificações)
  └── AiTutorService      (Tutor inteligente com guardrails de contexto)
          │                                     │
          ▼                                     ▼
[ Neon PostgreSQL (Prisma ORM) ]       [ Provedores Externos / Sentry / Redis ]
```

---

## 🛡️ Arquitetura de Segurança & Proteção de Dados (OWASP Guidelines)

O sistema foi projetado seguindo os princípios de **Defesa em Profundidade (Defense in Depth)** e **Confiança Zero (Zero Trust)**:

### 1. Hardening de Infraestrutura & Cabeçalhos HTTP
- **Políticas de Origem Estritas (CSP):** Restrição estrita de carregamento de scripts, conexões e frames a serviços oficiais autorizados.
- **Ocultação de Metadados do Servidor:** Supressão de cabeçalhos de identificação de framework para dificultar o reconhecimento e enumeração de tecnologia.
- **Isolamento de Recursos de Hardware:** Políticas de permissão restritivas para acesso a dispositivos de mídia (câmera e microfone).
- **Comunicação Criptografada:** Imposição de transporte estritamente seguro via HSTS de longa duração com suporte a preload.

### 2. Autenticação, Controle de Acesso & Proteção de Identidade
- **Gestão Segura de Sessão:** Autenticação baseada em tokens JWT transmitidos exclusivamente via cookies protegidos (`HttpOnly`, `SameSite` e `Secure`).
- **Autenticação em Dois Fatores (2FA):** Suporte nativo a TOTP com armazenamento de chaves sob criptografia forte simétrica no banco de dados.
- **Mitigação de Ataques de Força Bruta:** Rate limiting distribuído e mecanismos adaptativos de bloqueio temporário de credenciais.
- **Controle Rígido de Propriedade (Anti-IDOR):** Validação server-side de posse de dados em todas as rotas parametrizadas.
- **Privacidade & Conformidade LGPD:** Rotinas de anonimização e direito ao esquecimento de dados pessoais sensíveis.

### 3. Sanitização de Entradas & Prevenção Contra Injeções
- **Imunidade contra SQL Injection:** Uso exclusivo de consultas parametrizadas via ORM na camada de persistência.
- **Prevenção contra XSS:** Sanitização em duas fases de conteúdos ricos antes de armazenamento e renderização.
- **Sanitização de Strings:** Expurgo de caracteres de controle e marcações potencialmente executáveis.
- **Guardrails de Inteligência Artificial:** Delimitação de contexto e defesas ativas contra injeção de instruções e evasão de personas.

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
- **Segurança & Criptografia:** AES-256-GCM, BCrypt.js, TOTP, CSP, DOMPurify, Rate Limiting.
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

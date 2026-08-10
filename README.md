# 🏫 English School System

> **Projeto de Estudos & Laboratório Fullstack (Next.js 16+, PostgreSQL/Neon, Prisma, Service Layer, NextAuth, Stripe & LGPD Compliance)**

---

## 📖 Sobre o Projeto

O **English School System** é um projeto fullstack desenvolvido para estudo e aplicação prática de **Clean Architecture**, segurança de autenticação e fluxos de negócio em aplicações SaaS modernas. 

O sistema simula a gestão completa de uma escola de idiomas, abrangendo:
- Gestão e funil de leads (CRM).
- Controle de matrículas e planos de alunos.
- Agendamento de aulas com integração ao Calendly/Google Meet.
- Pagamentos e assinaturas com Stripe Webhooks.
- Autenticação segura com 2FA (TOTP) e proteção contra ataques de força bruta.
- Conformidade com a LGPD (anonimização e exclusão de dados PII).

---

## 🏛️ Arquitetura do Sistema (Clean Architecture)

```
[ Cliente / Browser (React 19 + TailwindCSS + Lucide) ]
                      │ (HTTPS / TLS 1.3)
                      ▼
[ Next.js 16 API Routes (Thin Controllers / Auth / Zod Validation / Rate Limiter) ]
                      │
                      ▼
[ Service Layer (`src/services/`) ]
  ├── LeadService      (Gestão e funil de leads)
  ├── StudentService   (Gestão de matrículas e alunos)
  ├── TeacherService   (Gestão de professores e disponibilidade)
  ├── StripeService    (Processamento idempotente de pagamentos e webhooks)
  ├── WhatsAppService  (Automação de mensagens e templates)
  └── AiTutorService   (Integração encapsulada de inteligência artificial)
          │                                     │
          ▼                                     ▼
[ Neon PostgreSQL (Prisma ORM) ]       [ Provedores Externos / Sentry / Redis ]
```

---

## 🚀 Principais Módulos & Recursos

### 1. ⚙️ Camada de Serviços Desacoplada (Service Layer)
- **Thin Controllers**: Rotas de API enxutas focadas estritamente em validação HTTP, rate limiting e autenticação.
- **Lógica de Negócio Isolada**: Toda a regra de negócio e mutações de banco residem em serviços dedicados em `src/services/`, facilitando manutenção e testes unitários.
- **Idempotência de Pagamentos**: `StripeService` trata webhooks com proteção nativa contra cobranças duplicadas.

### 2. 🔐 Autenticação, Autorização & Segurança
- **NextAuth.js v4** com estratégia JWT e hashing BCrypt (fator 12).
- **Autenticação em Dois Fatores (2FA/TOTP)** com QR Code e segredos armazenados sob criptografia **AES-256-GCM**.
- **Bloqueio Automático de Conta (Brute-Force Protection)** após 5 tentativas incorretas.
- **Revogação Dinâmica de Sessão**: Tokens JWT de contas bloqueadas ou excluídas são revogados em tempo real.
- **Conformidade LGPD (Art. 18)**: Módulo de anonimização irreversível PII (*Direito ao Esquecimento*).
- **Proteção Anti-XSS & CSP**: Sanitização de HTML com `DOMPurify` e Content Security Policy com nonces dinâmicos.

### 3. 📊 CRM de Leads, Financeiro & Agendamentos
- Kanban interativo para qualificação e conversão de novos leads.
- Controle de matrículas, planos de alunos (`BASIC`, `STANDARD`, `PREMIUM`, `CUSTOM`) e assinaturas Stripe.
- Histórico de aulas com status (`SCHEDULED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`).
- Portais dedicados por nível de acesso (**Administrador**, **Professor** e **Aluno**).

---

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, TailwindCSS, Lucide Icons, Framer Motion.
- **Backend:** Next.js Route Handlers, Service Layer Pattern, Zod Validation, Upstash Redis Rate Limiting.
- **Banco de Dados:** Neon PostgreSQL (Cloud Serverless) via Prisma ORM v5.
- **Segurança & Criptografia:** AES-256-GCM, BCrypt.js, TOTP (`speakeasy`), Content Security Policy (CSP), Strict Rate Limiting.
- **Testes & Qualidade:** Vitest, ESLint, TypeScript Strict Mode, Playwright E2E.

---

## 🔑 Variáveis de Ambiente (`.env`)

Para configurar o ambiente de desenvolvimento, copie o arquivo `.env.example` para `.env` e preencha com suas chaves locais:

```bash
cp .env.example .env
```

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

Após rodar o comando de seed (`npx tsx prisma/seed.ts`), o sistema criará automaticamente as contas de teste locais (Administrador, Professor e Aluno). 

> 💡 **Consulte o arquivo `prisma/seed.ts`** para verificar os e-mails e credenciais geradas para ambiente de desenvolvimento.

---

## 📜 Licença

Projeto desenvolvido para fins de estudo e aprimoramento técnico. Distribuído sob a licença MIT.

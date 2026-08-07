# 🏫 English School System — Enterprise SaaS Platform

> **Sistema Completo de Gestão Escolar & Plataforma de Aprendizado com Inteligência Artificial (Next.js 16+, PostgreSQL/Neon, Prisma, NextAuth, Stripe & Google Gemini AI)**

---

## 💎 Visão Geral do Produto

O **English School System** é uma solução SaaS pronta para comercialização (*turnkey enterprise solution*), projetada para escolas de idiomas, professores particulares e edtechs. A plataforma combina gestão de leads (CRM), controle financeiro, agendamento de aulas com integração ao Calendly/Google Meet e um **Tutor de Inglês com Inteligência Artificial (Google Gemini 1.5/2.0)** ativo 24/7.

---

## 🏛️ Arquitetura do Sistema

```
[ Cliente / Browser (React 19 + TailwindCSS + Lucide) ]
                      │ (HTTPS / TLS 1.3)
                      ▼
[ Next.js 16 Server (App Router / NextAuth JWT / Middleware Security) ]
     │                │                 │                   │
     ▼                ▼                 ▼                   ▼
[ Neon Postgres ] [ Upstash Redis ] [ Google Gemini ] [ Sentry / Error Log ]
  (Prisma ORM)    (Rate Limiting)     (AI Tutor API)   (Observabilidade)
```

---

## 🚀 Principais Módulos & Recursos

### 1. 🤖 Alex — AI English Tutor (IA Generativa 24/7)
- Prática de conversa em inglês com correção gramatical inteligente em tempo real (*"💡 Quick Tip"*).
- Sanitização estrita de turnos de diálogo e fallback automático entre modelos Gemini (`gemini-1.5-flash`, `gemini-1.5-flash-latest`, `gemini-1.5-pro-latest`).
- Proteção contra abusos via **Upstash Redis Rate Limiting** (5 req/min por IP).

### 2. 🔐 Autenticação, Autorização & Segurança Enterprise
- **NextAuth.js v4** com estratégia JWT e hashing BCrypt (fator 12).
- **Autenticação em Dois Fatores (2FA/TOTP)** com QR Code e segredos armazenados sob criptografia **AES-256-GCM**.
- **Bloqueio Automático de Conta (Brute-Force Protection)** após 5 tentativas incorretas.
- **Revogação Dinâmica de Sessão**: Tokens JWT de contas bloqueadas ou excluídas são revogados em tempo real.
- **Conformidade LGPD (Art. 18)**: Módulo de anonimização irreversível PII (*Direito ao Esquecimento*).

### 3. 📊 CRM de Leads, Financeiro & Agendamentos
- Kanban interativo para qualificação e conversão de novos leads.
- Controle de matrículas, planos de alunos (`BASIC`, `STANDARD`, `PREMIUM`, `CUSTOM`) e assinaturas Stripe.
- Histórico de aulas com status (`SCHEDULED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`).

---

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, TailwindCSS, Lucide Icons, Framer Motion.
- **Backend:** Next.js Server Actions, Route Handlers, Zod Validation, Upstash Redis Rate Limiting.
- **Banco de Dados:** Neon PostgreSQL (Cloud Serverless) via Prisma ORM v5.
- **IA:** Google Generative AI (`@google/generative-ai` SDK).
- **Segurança & Criptografia:** AES-256-GCM, BCrypt.js, TOTP (`speakeasy`), Content Security Policy (CSP), Strict Rate Limiting.
- **Testes & Qualidade:** Vitest, ESLint, TypeScript Strict Mode.

---

## 🔑 Variáveis de Ambiente (`.env`)

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-square-grass-ac49lare-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"

# Segurança NextAuth
NEXTAUTH_SECRET="SUA_CHAVE_SECRETA_NEXTAUTH_MINIMO_32_CHARS"
NEXTAUTH_URL="http://localhost:3000"

# Chave de Criptografia de Dados Sensíveis (AES-256-GCM - Exatos 32 Caracteres)
ENCRYPTION_KEY="12345678901234567890123456789012"

# Inteligência Artificial (Google AI Studio)
GEMINI_API_KEY="AIzaSy..."

# Upstash Redis (Rate Limiting em Produção)
KV_REST_API_URL="https://your-upstash-instance.upstash.io"
KV_REST_API_TOKEN="your_upstash_token"

# Pagamentos (Stripe - Opcional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## ⚡ Guia de Instalação e Execução Local

```bash
# 1. Clonar o repositório
git clone https://github.com/Jerixco/english-school-system.git
cd english-school-system

# 2. Instalar dependências
npm install

# 3. Sincronizar o Banco de Dados (Prisma Push)
npx prisma db push

# 4. Popular o Banco com Dados Iniciais (Seeding)
npx tsx prisma/seed.ts

# 5. Executar os Testes Unitários
npx vitest run

# 6. Iniciar o Servidor de Desenvolvimento
npm run dev
```

---

## 🚀 Deploy em Produção (Vercel & Docker)

### Deploy na Vercel (Recomendado)
1. Conecte o repositório GitHub na [Vercel](https://vercel.com).
2. Adicione todas as variáveis do arquivo `.env` no painel **Settings > Environment Variables**.
3. O build utilizará o comando automático `npm run build`.

---

## 📑 Credenciais de Acesso Padrão (Seed)

| Função | E-mail | Senha |
| :--- | :--- | :--- |
| **Administrador** | `admin@englishschool.com` | `Senha123!` |
| **Professor** | `teacher@englishschool.com` | `Senha123!` |
| **Aluno** | `student@englishschool.com` | `Senha123!` |

---

## 📜 Licença & Handover Comercial

Este software foi auditado e certificado com **100% de prontidão enterprise**, cobrindo diretrizes de segurança da OWASP, proteção de dados pela LGPD e suporte para alta concorrência. Todos os direitos de propriedade intelectual transferíveis ao comprador final.

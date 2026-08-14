# 🏫 English School System

> **Projeto de Estudos & Laboratório Fullstack (Next.js 16+, PostgreSQL/Neon, Prisma, Service Layer, NextAuth, WebRTC, Multi-Provider Payments & Hardening OWASP/LGPD)**

---

## 📖 Sobre o Projeto

O **English School System** é uma aplicação fullstack desenvolvida como laboratório de engenharia de software para estudo e aplicação prática de **Clean Architecture**, segurança em camadas (OWASP), WebRTC e fluxos de negócio SaaS modernos.

O sistema simula a gestão completa de uma escola de idiomas:
- 📊 **CRM de Leads:** Funil visual (Kanban) para qualificação e conversão de novos alunos.
- 🎓 **Matrículas & Planos:** Gestão de planos (`BASIC`, `STANDARD`, `PREMIUM`, `CUSTOM`) com assinaturas e catálogo de preços no servidor.
- 💳 **Subsistema de Pagamentos & Controle Financeiro:**
  - **Portal do Aluno:** Extrato completo de parcelas pagas, parcelas a vencer, identificação de faturas em atraso e botão de pagamento/renovação de plano.
  - **Painel Administrativo:** Livro-razão financeiro global com KPIs de receita liquidada, receita prevista, inadimplência e filtros por status e aluno.
  - **Padrão Adapter:** Suporte a múltiplos provedores (Stripe) e **Modo Sandbox Seguro** para simulações e testes integrados.
- 🔴 **Aulas Ao Vivo (WebRTC):** Salas de transmissão ao vivo integradas via Jitsi Meet com isolamento de permissões de mídia.
- 📼 **Biblioteca VOD:** Gravações de aulas com thumbnails e política de retenção automática temporária.
- 🛡️ **Conformidade LGPD & Gestão de Consentimento:** Política de Privacidade formal ([`/privacidade`](/privacidade)), banner de consentimento de cookies e direito ao esquecimento (Art. 18).
- 🔒 **Hardening & Defesa em Camadas:** Proteção contra força bruta, autenticação 2FA (TOTP), criptografia simétrica de ponta a ponta e cabeçalhos HTTP estritos.

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
  ├── PaymentService      (Orquestrador de pagamentos, idempotência e Sandbox)
  ├── LiveSessionService  (Gestão de salas e transmissões WebRTC ao vivo)
  ├── RecordingService    (Processamento de VOD e retenção de aulas)
  ├── StripeService       (Integração de checkout e webhooks de pagamento)
  ├── WhatsAppService     (Automação de mensagens e notificações)
  └── AiTutorService      (Módulo do Tutor IA - reservado para roadmap futuro)
          │                                     │
          ▼                                     ▼
[ Neon PostgreSQL (Prisma ORM) ]       [ Provedores Externos / Sentry / Redis ]
```

---

## 🛡️ Arquitetura de Segurança & Proteção de Dados (OWASP & LGPD)

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
- **Privacidade & Conformidade LGPD:** Política de Privacidade formal, gestão de consentimento de cookies e rotinas de anonimização irreversível PII (*Direito ao Esquecimento*).

### 3. Sanitização de Entradas & Prevenção Contra Injeções
- **Imunidade contra SQL Injection:** Uso exclusivo de consultas parametrizadas via ORM na camada de persistência.
- **Prevenção contra XSS:** Sanitização em duas fases de conteúdos ricos antes de armazenamento e renderização.
- **Resolução Canônica de Preços:** Preços e moedas resolvidos exclusivamente no servidor, impedindo adulteração de valores pelo cliente.
- **Idempotência de Pagamentos:** Registro e validação de identificadores únicos para impedir transações e cobranças duplicadas.
- **Sanitização de Strings:** Expurgo de caracteres de controle e marcações potencialmente executáveis.

---

## 🎨 Interface & Design System (UI/UX)

- **Design System Modular:** Primitivos acessíveis baseados em Radix UI, TailwindCSS e Shadcn UI.
- **Diferenciação Cromática Contextual:**
  - 🏢 **Administrador:** Paleta Slate / Dark Blue para gestão analítica, KPIs e CRM.
  - 🎓 **Professor:** Paleta Índigo / Violeta com foco em salas de aula virtuais e materiais VOD.
  - 📚 **Aluno:** Paleta Esmeralda / Sky com foco em progresso pedagógico, agendamentos e frequência.
- **Empty States Ilustrados:** Componente `EmptyState` com ícones temáticos e botões de ação contextual para listas sem registros.
- **Transparência de Cookies:** Banner de consentimento com opções de preferências essenciais e analíticas.
- **Feedback Visual Aprimorado:** Indicadores de carregamento animados e bloqueio de botões durante requisições assíncronas.

---

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, TailwindCSS, Radix UI Primitives, Lucide Icons, Framer Motion.
- **Backend:** Next.js Route Handlers, Service Layer Pattern, Zod Validation, Upstash Redis Rate Limiting.
- **Banco de Dados:** Neon PostgreSQL (Cloud Serverless) via Prisma ORM v5.
- **Comunicação em Tempo Real:** WebRTC / Jitsi Meet Integration.
- **Pagamentos & Assinaturas:** Adapter Pattern (Stripe & Sandbox Mode com HMAC session tokens).
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
| `GEMINI_API_KEY` | Google Gemini API (IA Tutor) | *Opcional* | Módulo reservado para roadmap futuro |
| `STRIPE_SECRET_KEY` | Checkout e Assinaturas | *Opcional* | Fallback automático para Sandbox Mode local |
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

# 5. Popular o Banco com Dados Iniciais (Seeding Local)
npx tsx prisma/seed.ts

# 6. Executar os Testes Unitários
npx vitest run

# 7. Iniciar o Servidor de Desenvolvimento
npm run dev
```

---

## 📑 Dados Iniciais & Contas de Teste Local

Ao executar o script de população local (`npx tsx prisma/seed.ts`), o sistema cria perfis base para validação em ambiente de desenvolvimento (Administrador, Professor e Aluno).

> 🔒 **Segurança:** As credenciais e parâmetros das contas de teste local são definidos exclusivamente no arquivo `prisma/seed.ts` e protegidos por variáveis de ambiente, nunca sendo expostos publicamente. O script de seed possui bloqueio automático para impedir execução acidental em ambientes de produção.

---

## 📜 Licença

Projeto desenvolvido para fins de estudo e aprimoramento técnico. Distribuído sob a licença MIT.

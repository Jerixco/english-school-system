# English School System

Sistema completo para gestão de escola de inglês online com automações integradas.

## 🚀 Funcionalidades

- **Website Institucional**: Site moderno e responsivo com todas as páginas necessárias
- **Sistema de Agendamento**: Integração com Calendly para consultas automáticas
- **CRM Customizado**: Gestão completa de leads, alunos e pipeline comercial
- **Pagamentos**: Integração com Stripe para assinaturas e pagamentos avulsos
- **Automação WhatsApp**: Mensagens automáticas e follow-ups
- **Automação de E-mail**: Fluxos automatizados para diferentes etapas
- **Dashboard Administrativo**: Métricas e visualização de dados em tempo real
- **Gestão de Professores**: Calendários individuais e controle de disponibilidade

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Pagamentos**: Stripe
- **Agendamento**: Calendly
- **Automação**: Nodemailer (e-mail), WhatsApp Business API
- **Autenticação**: NextAuth.js

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL
- Contas nas plataformas:
  - Stripe
  - Calendly
  - WhatsApp Business API

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas credenciais

4. Configure o banco de dados:
```bash
npx prisma migrate dev
npx prisma db push
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse http://localhost:3000

## 📁 Estrutura do Projeto

```
english-school-system/
├── src/
│   ├── app/              # Páginas Next.js
│   ├── components/       # Componentes reutilizáveis
│   ├── lib/              # Utilitários e configurações
│   ├── types/            # Tipos TypeScript
│   └── styles/           # Estilos globais
├── prisma/               # Schema do banco de dados
└── public/               # Arquivos estáticos
```

## 🔐 Variáveis de Ambiente

Consulte o arquivo `.env.example` para todas as variáveis necessárias.

## 📊 Dashboard

O dashboard administrativo está disponível em `/admin` e requer autenticação.

## 💳 Integração Stripe

Configure seus webhooks no Stripe Dashboard para:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Webhook URL: `http://localhost:3000/api/webhooks/stripe`

## 📱 WhatsApp Business

Configure a integração seguindo a documentação do WhatsApp Business API.

## 📧 Automações de E-mail

Configure as credenciais SMTP no arquivo `.env` para ativar as automações.

## 🚀 Deploy

Recomendado: Vercel, Netlify ou Railway

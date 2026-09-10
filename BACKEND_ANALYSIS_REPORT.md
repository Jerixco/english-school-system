# Backend Analysis Report - English School System

## Resumo
- Backend analisado: Sim
- Stack: Next.js API Routes + NextAuth v4 + Prisma (PostgreSQL) + Upstash Redis
- Total de rotas API: 33
- Problemas críticos: 5
- Problemas moderados: 5
- Recomendações: 8

## Estrutura de Rotas API
- Autenticação: `[...nextauth]`, register, forgot-password, reset-password, verify-credentials, enable-2fa, profile
- Admin: dashboard
- Aluno/Student: dashboard, students, students/[id]
- Professor/Teacher: dashboard, teachers, teachers/[id]
- Classes: classes, classes/[id]
- Live Sessions: live-sessions, live-sessions/[id]
- Recordings: recordings, recordings/[id]
- Payments: payments, payments/checkout, payments/sandbox, stripe/create-checkout-session
- AI Tutor: ai/tutor, ai/tutor/tts
- Blog: blog, blog/[slug]
- Leads: leads, leads/[id]
- Email: email/send
- WhatsApp: whatsapp/send
- Webhooks: webhooks/stripe
- Health: health

## Configuração de Segurança
- JWT: NextAuth v4 com credentials provider, secret do env, expiry 8h
- Rate Limiting: Upstash Redis (sliding window) com fallback memory
- CSP: Configurado em next.config.js
- CORS: Não configurado explicitamente
- 2FA: Speakeasy TOTP com QR code
- Lockout: 5 tentativas falhas = 15min bloqueio

## Banco de Dados
- PostgreSQL via Prisma ORM
- Schema: 14+ models (User, Student, Teacher, Class, LiveSession, Recording, Payment, Lead, etc.)
- Migrações: NÃO ENCONTRADAS (critical gap)

## Problemas Identificados
Veja backend_analysis_report.json para lista completa em JSON.

## Arquivos Gerados
- backend_analysis_report.json - Relatório estruturado
- BACKEND_ANALYSIS_REPORT.md - Este arquivo

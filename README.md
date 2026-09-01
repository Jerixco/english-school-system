# English School System

Laboratório fullstack de uma escola de idiomas: CRM de leads, matrículas, pagamentos, aulas ao vivo (Jitsi) e VOD.

Stack: Next.js 16 (App Router), React 18, TypeScript, Prisma 5, PostgreSQL, NextAuth (JWT + credentials), Stripe (com sandbox local).

## O que este projeto é (e não é)

É um projeto de estudo. Há defesa em camadas de verdade (sessão HttpOnly, RBAC, Zod, rate limit, 2FA TOTP com AES-256-GCM, preços resolvidos no servidor), mas **não** é criptografia de ponta a ponta nem Zero Trust completo. Salas Jitsi públicas dependem de quem tem o link. O envio de WhatsApp usa a WhatsApp Cloud API oficial quando as credenciais estão configuradas; sem elas, o recurso falha de forma explícita e não simula sucesso.

## Pré-requisitos

- Node.js 20+
- PostgreSQL (local, Neon ou similar)

## Subir localmente

```bash
git clone https://github.com/Jerixco/english-school-system.git
cd english-school-system
cp .env.example .env
```

Preencha no `.env` pelo menos:

- `DATABASE_URL`
- `NEXTAUTH_SECRET` (mínimo 32 caracteres; `openssl rand -base64 32`)
- `ENCRYPTION_KEY` (32+ caracteres)
- `SEED_DEFAULT_PASSWORD` (só para o seed)

```bash
npm install
npx prisma db push
npx tsx prisma/seed.ts
npx vitest run
npm run dev
```

Contas de seed usam os e-mails do `.env` (`SEED_ADMIN_EMAIL`, etc.) e a senha de `SEED_DEFAULT_PASSWORD`. Não há senha padrão no código.

## Pagamentos

- Sem `STRIPE_SECRET_KEY` real (`sk_...`), o checkout usa o **sandbox** assinado com HMAC (`NEXTAUTH_SECRET`).
- Com chave Stripe válida e `STRIPE_PRICE_*`, o mesmo `PaymentService` abre Checkout Session. Plano do aluno só muda nesse fluxo (ou status via admin), nunca por `PATCH` do próprio aluno.

## WhatsApp Business Cloud API

O endpoint administrativo `/api/whatsapp/send` envia mensagens de texto pela API oficial da Meta. Configure `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_GRAPH_VERSION` e, para números nacionais, `WHATSAPP_DEFAULT_COUNTRY_CODE` (55 para Brasil). O token deve ficar somente no servidor e ter a permissão `whatsapp_business_messaging`.

Mensagens de texto livres estão sujeitas às regras de janela de atendimento do WhatsApp. Para iniciar ou reabrir conversas fora da janela permitida, crie templates aprovados na Meta e adicione suporte a templates antes de usar esse fluxo em produção.

## Segurança (modelo atual)

- Auth: NextAuth JWT, bcrypt 12, lockout após falhas, 2FA opcional.
- Autorização: sessão no servidor (`getAuthenticatedUser`). Não use header `X-User-Id` como identidade.
- Rate limit: Upstash em produção (é obrigatório para login/checkout). Em dev, fallback em memória.
- Headers: CSP e Permissions-Policy (câmera/mic só para `meet.jit.si`).
- Reset de senha: token aleatório; o banco guarda só o SHA-256; o e-mail não vai na URL.

## Testes e CI

```bash
npm test
npm run lint
```

O workflow `CI` roda Vitest + lint. O workflow Gitleaks continua varrendo segredos.

## Estrutura

```
src/app/api/        Route handlers (controllers finos)
src/services/       Regras de negócio
src/lib/            Auth, validação, cripto, rate limit
prisma/             Schema e seed
```

## Licença

MIT. Projeto para estudo.

# Diagnóstico da auditoria reversa

Data: 2026-09-01

## Escopo

Foi realizada uma varredura do projeto Next.js/TypeScript/Prisma, incluindo:

- estrutura do App Router, proxy, autenticação NextAuth, RBAC e rotas de API;
- persistência Prisma, pagamentos Stripe/Sandbox, webhooks e concorrência;
- validações Zod, rate limiting, recuperação de senha e 2FA;
- componentes de dashboard e sala de aula, com revisão de semântica e teclado;
- testes, lint, TypeScript e build de produção.

O plugin/skill `SkillUI` solicitado não está disponível nesta sessão. Como fallback, foram usados os skills locais `architect-review`, `accessibility-compliance-accessibility-audit`, `accesslint-scan` e `anti-ui-slop`, além da leitura da documentação oficial relevante via Context7.

## Correções implementadas

### Alta prioridade

- O callback real de credenciais do NextAuth passou a aplicar rate limiting com `Retry-After`.
- Contadores de tentativas inválidas usam incremento atômico no Prisma, evitando perda de incrementos em requisições concorrentes.
- Tokens de recuperação de senha são reclamados com `updateMany` condicional dentro da transação; uma mesma solicitação não pode ser consumida duas vezes em corrida concorrente.
- Confirmações de pagamento Stripe e Sandbox passaram a atualizar estudante e criar pagamento na mesma transação, mantendo idempotência também sob entrega simultânea. Conflitos de índice único são tratados como duplicatas já processadas.
- Exclusão de gravações e início/finalização de sessões agora exigem `teacherId` válido para usuários não administradores; um identificador ausente não concede acesso.
- Respostas públicas de checkout e falha de assinatura do webhook não expõem mensagens internas de exceção.

### Acessibilidade e UI

- Modais de alerta, pré-checagem de dispositivos e feedback receberam `role="dialog"`/`alertdialog`, `aria-modal`, títulos/descrições associados, rótulos de botões de ícone, fechamento por Escape e restauração do foco.
- Controles de câmera, microfone, avaliação, tags e nível do microfone receberam estados e nomes acessíveis.
- O chat do tutor recebeu semântica de log ao vivo, rótulos no input e nos controles iconográficos.
- A navegação lateral recebeu `aria-label`.

## Validação

Todos os checks abaixo passaram após as alterações:

- `npm test -- --run`: 9 arquivos, 42 testes aprovados;
- `npx tsc --noEmit`: aprovado;
- `npm run lint`: aprovado, apenas o aviso preexistente sobre `GoogleTagManager` em `src/app/layout.tsx:105`;
- `npm run build`: aprovado, com geração das rotas e do proxy de produção.

Não foi executado teste E2E/Axe contra navegador porque o projeto não possui Playwright/Axe instalado nem uma URL local ativa nesta sessão. A revisão estática dos componentes foi feita manualmente conforme as regras WAI-ARIA aplicáveis.

## Pontos recomendados para ciclo posterior

- substituir `unsafe-inline`/`unsafe-eval` do CSP por nonces/hashes para scripts que realmente precisem deles, validando integrações externas;
- tornar `src/lib/env.ts` parte obrigatória do bootstrap de produção, pois o módulo existe mas não é importado pelo runtime;
- substituir `prisma db push` por migrações versionadas no fluxo de produção e revisar o `.gitignore` de `prisma/migrations`;
- alinhar a documentação dos preços Stripe com o catálogo efetivamente usado no servidor;
- instalar e executar E2E/Axe em CI para validar foco, contraste e fluxos autenticados em navegador real.

## Integridade das alterações pré-existentes

As alterações que já estavam no worktree antes desta auditoria foram preservadas e não foram incluídas deliberadamente no conjunto de correções desta rodada.

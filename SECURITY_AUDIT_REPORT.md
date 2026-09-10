# Relatório de Auditoria de Segurança - English School System

**Data:** 2026-09-03  
**Projeto:** english-school-system  
**Branch:** codex-audit-fixes  
**Stack:** Next.js 16 + TypeScript + PostgreSQL + Redis + Prisma  
**Ferramenta:** Naracli (análise manual complementar)

---

## 1. Vulnerabilidades de Dependências

### Críticas (High)

| Pacote | Versão Atual | Problema | Severidade |
|--------|--------------|----------|------------|
| `nodemailer` | <=9.0.0 | Injeção de comando SMTP via CRLF; TLS validation bypass; SSRF via raw message | 🔴 HIGH |
| `browserslist` | <=4.28.6 | Crescimento ilimitado de memória (OOM); crash por stats maliciosos | 🔴 HIGH |
| `fast-uri` | 3.0.0-3.1.5 | SSRF via IPv6; host confusion via IDN; percent-encoding bypass | 🔴 HIGH |

### Moderadas (Moderate)

| Pacote | Versão Atual | Problema | Severidade |
|--------|--------------|----------|------------|
| `qs` | <=6.15.3 | Array-limit bypass; DoS via isBuffer controlado | 🟡 MODERATE |

**Recomendação:** Executar `npm audit fix` imediatamente. Para `nodemailer`, considerar upgrade para versão corrigida ou substituição por `resend`/`@sendgrid/mail`.

---

## 2. Configuração de Segurança

### CSP (Content-Security-Policy) - ⚠️ ATENÇÃO

**Arquivo:** `next.config.js`

**Problemas identificados:**
```javascript
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com ...
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com ...
```

- `'unsafe-inline'` em `script-src` e `style-src` permite execução de scripts inline e estilos inline, facilitando ataques XSS
- Múltiplas origens externas confiadas (Google, Stripe, Calendly, Jitsi, Vercel)

**Recomendação:** Substituir `'unsafe-inline'` por nonces ou hashes para scripts que realmente necessitam deles. Validar integrações externas.

### Headers de Segurança - ✅ BOM

```javascript
X-Frame-Options: SAMEORIGIN          // Protege contra clickjacking
X-Content-Type-Options: nosniff      // Previne MIME sniffing
Strict-Transport-Security: max-age=63072000  // HSTS forte
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera/microfone restritos
```

**Recomendação:** Manter configuração atual.

---

## 3. Gerenciamento de Segredos

### Arquivos .env

| Arquivo | Status | Observação |
|---------|--------|------------|
| `.env` | ⚠️ Presente | Contém credenciais reais - **NUNCA commitar** |
| `.env.example` | ✅ OK | Template seguro sem valores reais |
| `.gitignore` | ✅ OK | Inclui `.env*`, `.env`, `.env.local` |

### Problemas Identificados

1. **Token GitHub no config.toml** (linha 2):
   ```toml
   tokens = ["«redacted:ghp_…»"]
   ```
   - **Risco:** Token pode estar versionado ou exposto
   - **Recomendação:** Remover e usar variável de ambiente ou GitHub App

2. **Gitleaks no workflow** - ✅ Configurado
   - Scanner de segredos ativo no CI
   - Executado via `gitleaks/gitleaks-action@v3`

---

## 4. Autenticação e Autorização

### NextAuth v4 - ⚠️ Atenção

**Status:** Versão 4.x (última estável antes da v5)
**Prisma Adapter:** Configurado
**2FA:** Implementado com `speakeasy` (TOTP)

**Pontos fortes:**
- Rate limiting em callback de credenciais
- Incremento atômico de tentativas falhas
- Tokens de recuperação com `updateMany` condicional
- Sanitização de dados sensíveis (`sanitizeUserData`, `sanitizePaymentData`)
- Proteção contra mutações em conta demo

**Recomendação:** Planejar migração para NextAuth v5 para melhor suporte a TypeScript e segurança.

---

## 5. Validação de Entrada

### Zod Schema - ✅ Bom

```typescript
// src/lib/env.ts
NEXTAUTH_SECRET: z.string().min(32, '...')
ENCRYPTION_KEY: z.string().min(32, '...')  // AES-256-GCM
DATABASE_URL: z.string().min(1, '...')
```

**Validação rigorosa em produção** - application fails fast se variáveis ausentes.

---

## 6. CI/CD

### GitHub Actions - ⚠️ Configuração Limitada

**Workflows encontrados:**
1. `ci.yml` - Testes e lint
2. `gitleaks.yml` - Scan de segredos

**Problemas:**
```yaml
# ci.yml - ONLY workflow_dispatch (manual)
on:
  workflow_dispatch:
```

**Impacto:** Pull requests não disparam verificação automática de segurança.

**Recomendações:**
- Adicionar gatilhos `push` e `pull_request`
- Adicionar job de `npm audit` no CI
- Considerar adicionar CodeQL ou Semgrep para SAST

---

## 7. Prisma/Database

### Configuração - ✅ Adequado

- Migrações versionadas recomendadas (não detectadas no `.gitignore`)
- `DATABASE_URL` validada por Zod
- Criptografia AES-256-GCM para dados sensíveis (2FA secret)

**Recomendação:** Implementar migrações Prisma versionadas no repositório.

---

## 8. AI Tutor Security (Garak)

### Scanner de Segurança IA - ✅ Excelente

**Configuração:** `garak/garak_bridge.py`
**Alvo:** `src/services/ai-tutor.service.ts`
**Perfil:** OWASP + Jailbreak + Jogo de papéis

**Defesas implementadas:**
- Sistema anti-jailbreak no prompt
- Recusa a pedidos de override de persona
- Bloqueio de decodificação (Base64, Hex, ROT13)
- Modo mock para CI sem custo de API

**Recomendação:** Manter e expandir cobertura de testes de red team.

---

## 9. Problemas Identificados - Resumo

| # | Problema | Severidade | Arquivo | Recomendação |
|---|----------|------------|---------|--------------|
| 1 | `nodemailer` vulnerável a SMTP injection | 🔴 HIGH | package.json | Atualizar ou substituir |
| 2 | `browserslist` memory growth OOM | 🔴 HIGH | package.json | `npm audit fix` |
| 3 | `fast-uri` SSRF via IPv6 | 🔴 HIGH | package.json | `npm audit fix` |
| 4 | CSP `unsafe-inline` em scripts | 🟡 MODERATE | next.config.js | Usar nonces/hashes |
| 5 | CI apenas manual (workflow_dispatch) | 🟡 MODERATE | .github/workflows/ci.yml | Adicionar push/PR triggers |
| 6 | Token GitHub no config.toml | 🟡 MODERATE | config.toml | Remover e usar env var |
| 7 | `qs` array-limit bypass | 🟡 MODERATE | package.json | `npm audit fix` |
| 8 | Validação env não usada no runtime | ℹ️ INFO | src/lib/env.ts | Importar em bootstrap |
| 9 | NextAuth v4 (não v5) | ℹ️ INFO | package.json | Planejar migração |

---

## 10. Pontos Fortes Identificados

✅ **Headers de segurança** bem configurados (HSTS, X-Frame-Options, CSP parcial)  
✅ **Rate limiting** implementado em login e operations sensíveis  
✅ **2FA (TOTP)** com encryption AES-256-GCM para secrets  
✅ **Sanitização** de erros e dados sensíveis (password, payment)  
✅ **Zod validation** para variáveis de ambiente  
✅ **Gitleaks** integrado no CI  
✅ **Garak** para testes de segurança do AI tutor  
✅ **Audit log** de ações sensíveis  
✅ **RBAC** implementado (ADMIN, TEACHER, STUDENT)  
✅ **CSP** com frame-ancestors 'none' e object-src 'none'

---

## 11. Plano de Ação Recomendado

### Imediato (Crítico)
1. Executar `npm audit fix` para corrigir vulnerabilidades de dependências
2. Remover token GitHub do `config.toml`
3. Migrar de `nodemailer` para solução atualizada (Resend/SendGrid)

### Curto Prazo (1-2 semanas)
4. Implementar nonces no CSP para remover `'unsafe-inline'`
5. Adicionar gatilhos `push` e `pull_request` no CI
6. Adicionar job `npm audit` no workflow de CI
7. Tornar `src/lib/env.ts` parte obrigatória do bootstrap

### Médio Prazo (1 mês)
8. Planejar migração para NextAuth v5
9. Implementar migrações Prisma versionadas
10. Adicionar CodeQL ou Semgrep para SAST no CI
11. Executar E2E/Axe tests para acessibilidade em CI

---

## 12. Conclusão

O projeto **english-school-system** demonstra maturidade em segurança com implementações robustas de:
- Autenticação multi-fator
- Rate limiting
- Validação de entrada
- Sanitização de outputs
- Scan de segredos

** Principais riscos atuais são vulnerabilidades de dependências (nodemailer, browserslist, fast-uri) que devem ser corrigidas imediatamente via `npm audit fix`.

**Classificação geral:** 🟢 **BOM** - Com correções de dependências e ajuste de CSP, o projeto atinge nível robusto de segurança.

---

*Relatório gerado por auditoria manual complementar via naracli em 2026-09-03.*

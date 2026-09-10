# Graph Report - english-school-system  (2026-09-03)

## Corpus Check
- 170 files · ~195,407 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 825 nodes · 1888 edges · 120 communities (37 shown, 66 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.8)
- Token cost: 1,940 input · 1,550 output

## Community Hubs (Navigation)
- Authentication and Sessions
- Authentication and Sessions
- AI Tutor and Speech
- CI and Security
- Authentication and Sessions
- Payments and Checkout
- Testing and Quality
- Authentication and Sessions
- Authentication and Sessions
- AI Tutor and Speech
- Authentication and Sessions
- Authentication and Sessions
- CRM and Leads
- AI Tutor and Speech
- Tooling and Dependencies
- Payments and Checkout
- UI Components
- AI Tutor and Speech
- Authentication and Sessions
- Database and Prisma
- Payments and Checkout
- Authentication and Sessions
- Media Assets
- Authentication and Sessions
- Authentication and Sessions
- Database and Prisma
- UI Components
- Database and Prisma
- Payments and Checkout
- Database and Prisma
- Tooling and Dependencies
- Database and Prisma
- Authentication and Sessions
- Authentication and Sessions
- Architecture Documentation
- Authentication and Sessions
- Runtime Configuration
- Branding and Icons
- Database and Prisma
- Database and Prisma
- Database and Prisma
- Domain Services
- Authentication and Sessions
- Clsx
- Date-Fns
- Tooling and Dependencies
- Fast-Check
- @Google Generative-Ai
- @Hookform Resolvers
- CI and Security
- Authentication and Sessions
- Authentication and Sessions
- Nodemailer
- Next
- Database and Prisma
- Qrcode
- Qrcode-Terminal
- @Radix-Ui React-Accordion
- @Radix-Ui React-Alert-Dialog
- Media Assets
- @Radix-Ui React-Checkbox
- @Radix-Ui React-Dialog
- @Radix-Ui React-Dropdown-Menu
- @Radix-Ui React-Label
- @Radix-Ui React-Select
- @Radix-Ui React-Separator
- @Radix-Ui React-Slot
- @Radix-Ui React-Tabs
- @Radix-Ui React-Toast
- Rate-Limiter-Flexible
- React
- React-Dom
- Recharts
- @Sentry Nextjs
- Speakeasy
- Payments and Checkout
- Payments and Checkout
- Tooling and Dependencies
- Tooling and Dependencies
- @Upstash Ratelimit
- Zod
- Tooling and Dependencies
- Tsx
- @Types Bcryptjs
- @Types Node
- @Types Qrcode
- @Types Speakeasy
- Tooling and Dependencies
- Project Documentation
- CI and Security
- CI and Security
- Automation Flow
- AI Tutor and Speech
- Sarah Teacher
- Dashboard Experiences
- Features 3D
- Media Assets
- Media Assets
- Advanced Phrasal Verbs
- Business English Negotiation
- Mastering Job Interviews
- Robots
- Project Documentation

## God Nodes (most connected - your core abstractions)
1. `getClientIdentifier()` - 79 edges
2. `checkRateLimit()` - 75 edges
3. `getAuthenticatedUser()` - 64 edges
4. `isAdmin()` - 55 edges
5. `Button` - 42 edges
6. `prisma` - 37 edges
7. `Card` - 31 edges
8. `CardContent` - 31 edges
9. `CardHeader` - 28 edges
10. `CardTitle` - 28 edges

## Surprising Connections (you probably didn't know these)
- `English School System` --has_follow_up_gap--> `CSP unsafe-inline/unsafe-eval hardening`  [EXTRACTED]
  README.md → AUDIT_DIAGNOSTIC.md
- `English School System` --has_follow_up_gap--> `E2E/Axe browser validation in CI`  [EXTRACTED]
  README.md → AUDIT_DIAGNOSTIC.md
- `English School System` --has_follow_up_gap--> `Mandatory production env bootstrap`  [EXTRACTED]
  README.md → AUDIT_DIAGNOSTIC.md
- `English School System` --has_follow_up_gap--> `Versioned production migrations`  [EXTRACTED]
  README.md → AUDIT_DIAGNOSTIC.md
- `CardFooter` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (120 total, 66 thin omitted)

### Community 0 - "Authentication and Sessions"
Cohesion: 0.06
Nodes (50): dynamic, POST(), dynamic, dynamic, POST(), getLockoutRemainingMinutes(), isAccountLocked(), recordLoginAttempt() (+42 more)

### Community 1 - "Authentication and Sessions"
Cohesion: 0.09
Nodes (23): checkoutSchema, dynamic, POST(), POST(), POST(), getPriceIdForPlan(), isPurchasablePlan(), PLAN_PRICE_IDS (+15 more)

### Community 2 - "AI Tutor and Speech"
Cohesion: 0.11
Nodes (31): dynamic, GET(), aiMessageSchema, dynamic, POST(), dynamic, POST(), ttsSchema (+23 more)

### Community 3 - "CI and Security"
Cohesion: 0.13
Nodes (14): blogPosts, PLANS, metadata, ContactForm(), PlanCard(), PlanCardProps, ScheduleForm(), Card (+6 more)

### Community 4 - "Authentication and Sessions"
Cohesion: 0.13
Nodes (24): dynamic, DELETE(), disableTwoFactorSchema, dynamic, enforceTwoFactorRateLimit(), POST(), PUT(), dynamic (+16 more)

### Community 5 - "Payments and Checkout"
Cohesion: 0.11
Nodes (14): AdminData, LEAD_STATUS_LABELS, PLAN_LABELS, STATUS_LABELS, StudentData, ProfessorData, ProfessorDashboardData, SetupStep (+6 more)

### Community 6 - "Testing and Quality"
Cohesion: 0.07
Nodes (29): dom, dom.iterable, e2e, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+21 more)

### Community 7 - "Authentication and Sessions"
Cohesion: 0.19
Nodes (24): DELETE(), dynamic, GET(), PATCH(), GET(), DELETE(), dynamic, GET() (+16 more)

### Community 8 - "Authentication and Sessions"
Cohesion: 0.10
Nodes (16): dynamic, dynamic, liveSessionService, PATCH(), updateStatusSchema, DELETE(), dynamic, recordingService (+8 more)

### Community 9 - "AI Tutor and Speech"
Cohesion: 0.17
Nodes (10): LoginStep, Message, QUICK_PROMPTS, LeadForm(), LeadFormProps, CardDescription, Input, InputProps (+2 more)

### Community 10 - "Authentication and Sessions"
Cohesion: 0.21
Nodes (14): dynamic, POST(), emailSchema, POST(), blogPost, BlogPostPage(), getTransporter(), sendConsultationConfirmationEmail() (+6 more)

### Community 11 - "Authentication and Sessions"
Cohesion: 0.16
Nodes (16): dynamic, POST(), getClientIpFromHeaders(), TRUSTED_PROXY_COUNT, AuthenticatedUser, getClientIp(), getUserAgent(), hasRole() (+8 more)

### Community 12 - "CRM and Leads"
Cohesion: 0.14
Nodes (15): DELETE(), dynamic, leadService, PATCH(), updateLeadSchema, createRecordingSchema, dynamic, GET() (+7 more)

### Community 13 - "AI Tutor and Speech"
Cohesion: 0.18
Nodes (12): AiTutorCard(), getSpeechSynthesisVoices(), isSpeechRecognitionSupported(), isSpeechSynthesisSupported(), NATURAL_ENGLISH_VOICE_PATTERNS, normalizeLocale(), scoreEnglishVoice(), selectEnglishVoice() (+4 more)

### Community 14 - "Tooling and Dependencies"
Cohesion: 0.12
Nodes (17): autoprefixer, eslint, devDependencies, autoprefixer, eslint, postcss, @types/nodemailer, @types/react (+9 more)

### Community 15 - "Payments and Checkout"
Cohesion: 0.26
Nodes (13): getConfig(), normalizeWhatsAppPhone(), parseResponse(), sendClassReminderWhatsApp(), sendConsultationConfirmationWhatsApp(), sendPaymentConfirmationWhatsApp(), sendWelcomeWhatsApp(), sendWhatsAppMessage() (+5 more)

### Community 16 - "UI Components"
Cohesion: 0.22
Nodes (7): AccordionContent, AccordionItem, AccordionTrigger, AlertDialog(), AlertDialogProps, Skeleton(), cn()

### Community 17 - "AI Tutor and Speech"
Cohesion: 0.19
Nodes (10): sdkMocks, AiTutorErrorCode, AiTutorOptions, AiTutorService, ChatMessage, DEFAULT_MODELS, discoverAvailableModels(), GeminiModelDescription (+2 more)

### Community 18 - "Authentication and Sessions"
Cohesion: 0.12
Nodes (3): LeadService, LiveSessionService, RecordingService

### Community 19 - "Database and Prisma"
Cohesion: 0.14
Nodes (14): scripts, build, db:seed, dev, garak:eval, garak:jailbreak, garak:owasp, garak:quick (+6 more)

### Community 20 - "Payments and Checkout"
Cohesion: 0.23
Nodes (11): GET(), POST(), dynamic, GET(), POST(), dynamic, GET(), POST() (+3 more)

### Community 21 - "Authentication and Sessions"
Cohesion: 0.16
Nodes (8): AlunoAulasContent(), LiveSessionItem, RecordingItem, ClassFeedbackModal(), ClassFeedbackModalProps, FEEDBACK_TAGS, DevicePreCheckModal(), DevicePreCheckModalProps

### Community 22 - "Media Assets"
Cohesion: 0.26
Nodes (4): ParallaxHero(), Button, ButtonProps, buttonVariants

### Community 23 - "Authentication and Sessions"
Cohesion: 0.23
Nodes (9): LoginForm(), DashboardHeader(), DashboardHeaderProps, DashboardSidebar(), getCurrentUser(), requireAuth(), requireRole(), getDashboardUrl() (+1 more)

### Community 24 - "Authentication and Sessions"
Cohesion: 0.20
Nodes (12): CSP unsafe-inline/unsafe-eval hardening, E2E/Axe browser validation in CI, Mandatory production env bootstrap, Jitsi live classrooms, NextAuth JWT + Credentials, Next.js 16 App Router, Prisma 5 / PostgreSQL, English School System (+4 more)

### Community 25 - "Database and Prisma"
Cohesion: 0.18
Nodes (11): isomorphic-dompurify, dependencies, bcryptjs, isomorphic-dompurify, prisma, react-hook-form, @upstash/redis, bcryptjs (+3 more)

### Community 26 - "UI Components"
Cohesion: 0.24
Nodes (6): inter, metadata, outfit, CookieConsentBanner(), CookieConsentType, Providers()

### Community 27 - "Database and Prisma"
Cohesion: 0.22
Nodes (8): architecturePattern, edges, flows, generatedAt, nodes, $schema, system, version

### Community 28 - "Payments and Checkout"
Cohesion: 0.25
Nodes (7): BlogPost, Class, DashboardStats, Lead, Payment, Student, Teacher

### Community 29 - "Database and Prisma"
Cohesion: 0.29
Nodes (7): allowScripts, esbuild, prisma, @prisma/client, @prisma/engines, @sentry/cli, unrs-resolver

### Community 30 - "Tooling and Dependencies"
Cohesion: 0.33
Nodes (5): extends, rules, @next/next/no-html-link-for-pages, react/display-name, next/core-web-vitals

### Community 31 - "Database and Prisma"
Cohesion: 0.33
Nodes (5): name, prisma, seed, private, version

### Community 32 - "Authentication and Sessions"
Cohesion: 0.40
Nodes (5): config, getDefaultRouteForRole(), proxy(), PUBLIC_AUTH_ROUTES, ROLE_ROUTES

### Community 33 - "Authentication and Sessions"
Cohesion: 0.33
Nodes (5): JWT, next-auth, next-auth/jwt, Session, User

### Community 34 - "Architecture Documentation"
Cohesion: 0.40
Nodes (5): Architecture Diagram, English School System - Arquitetura Interativa & Fluxos com Efeito Parallax, English School System &bull; Mapa Arquitetural com Efeito Parallax, 🔄 Fluxos de Execução da Aplicação, Nome do Componente

### Community 35 - "Authentication and Sessions"
Cohesion: 0.40
Nodes (5): AuthorizationError, FORBIDDEN, NOT_AUTHENTICATED, NOT_AUTHORIZED, RESOURCE_NOT_FOUND

### Community 36 - "Runtime Configuration"
Cohesion: 0.50
Nodes (3): cspHeader, nextConfig, { withSentryConfig }

## Knowledge Gaps
- **291 isolated node(s):** `extends`, `next/core-web-vitals`, `@next/next/no-html-link-for-pages`, `react/display-name`, `$schema` (+286 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 377 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **66 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `sanitizeRichHtml()` connect `Authentication and Sessions` to `AI Tutor and Speech`, `Payments and Checkout`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `Button` connect `Media Assets` to `CI and Security`, `Payments and Checkout`, `AI Tutor and Speech`, `Authentication and Sessions`, `UI Components`, `Authentication and Sessions`, `Authentication and Sessions`, `UI Components`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `getClientIdentifier()` connect `AI Tutor and Speech` to `Authentication and Sessions`, `Authentication and Sessions`, `Authentication and Sessions`, `Authentication and Sessions`, `Authentication and Sessions`, `Authentication and Sessions`, `Authentication and Sessions`, `CRM and Leads`, `Payments and Checkout`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `@next/next/no-html-link-for-pages` to the rest of the system?**
  _291 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Authentication and Sessions` be split into smaller, more focused modules?**
  _Cohesion score 0.05639097744360902 - nodes in this community are weakly interconnected._
- **Should `Authentication and Sessions` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `AI Tutor and Speech` be split into smaller, more focused modules?**
  _Cohesion score 0.11153846153846154 - nodes in this community are weakly interconnected._
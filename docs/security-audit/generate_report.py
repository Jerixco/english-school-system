from __future__ import annotations

from datetime import date
from pathlib import Path
from textwrap import wrap

import matplotlib.pyplot as plt
from matplotlib.patches import Patch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    BaseDocTemplate, Flowable, Frame, HRFlowable, Image, KeepTogether,
    PageBreak, PageTemplate, Paragraph, Spacer, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs' / 'security-audit'
PDF = OUT / 'relatorio-auditoria-seguranca.pdf'

SEVERITY = {
    'Crítica': '#B91C1C', 'Alta': '#EA580C', 'Média': '#D97706',
    'Baixa': '#2563EB', 'Informativa': '#64748B', 'Ponto forte': '#059669',
}

FINDINGS = [
    {
        'severity': 'Alta', 'category': 'IDOR / autorização server-side',
        'file': 'src/services/recording.service.ts:157-161',
        'title': 'Exclusão de gravação aceita professor sem identidade resolvida',
        'evidence': "if (!isAdmin && teacherId && recording.teacherId !== teacherId) { throw new Error('UNAUTHORIZED') }",
        'why': 'Quando a rota recebe um usuário TEACHER sem registro correspondente em Teacher, teacherId permanece undefined. A condição não rejeita o chamador e a operação delete usa somente o ID fornecido.',
        'impact': 'Um professor autenticado sem vínculo Teacher pode excluir qualquer Recording cujo ID conheça.',
        'fix': 'Falhar fechado quando teacherId estiver ausente; melhor ainda, fazer deleteMany/update condicionado por teacherId e validar posse na mesma operação.',
    },
    {
        'severity': 'Alta', 'category': 'IDOR / autorização server-side',
        'file': 'src/services/live-session.service.ts:124-128 e 144-148',
        'title': 'Início/fim de sessão aceita professor sem identidade resolvida',
        'evidence': "if (!isAdmin && teacherId && session.teacherId !== teacherId) { throw new Error('UNAUTHORIZED') }",
        'why': 'A rota exige papel TEACHER, mas teacher?.id é opcional. Se o usuário não possui perfil Teacher, teacherId fica undefined e o guard é bypassado.',
        'impact': 'O chamador pode alterar o status de qualquer LiveSession por ID, iniciando ou encerrando aulas alheias.',
        'fix': 'Retornar 403 se não existir Teacher; validar a relação teacherId na query de update e rejeitar qualquer identidade incompleta.',
    },
    {
        'severity': 'Baixa', 'category': 'Chaves expostas',
        'file': 'docker-compose.yml:7',
        'title': 'Credencial padrão de PostgreSQL versionada em configuração de desenvolvimento',
        'evidence': 'POSTGRES_PASSWORD: english_school_dev',
        'why': 'A senha é pública no repositório e é usada automaticamente pelo serviço PostgreSQL local. Se o compose for exposto, reutilizado fora de ambiente isolado ou combinado com uma porta publicada, a credencial deixa de ser apenas fixture.',
        'impact': 'Acesso não autorizado ao banco de desenvolvimento e possível reutilização acidental em ambientes compartilhados.',
        'fix': 'Ler a senha de variável obrigatória/arquivo local não versionado, remover a publicação da porta por padrão e rejeitar valores conhecidos em ambientes não locais.',
    },
]

STRENGTHS = [
    ('Autenticação e RBAC', 'src/lib/auth-helpers.ts:14-25 e src/proxy.ts:7-63', 'NextAuth valida sessão no servidor; proxy restringe páginas por papel; handlers sensíveis usam getAuthenticatedUser/isAdmin.'),
    ('Validação de entrada', 'src/lib/validations.ts e rotas API', 'Há schemas Zod para payloads sensíveis, incluindo a ação de sessão live.'),
    ('XSS em conteúdo rico', 'src/lib/sanitize-html.ts:6-31; src/app/blog/[slug]/page.tsx:99-103', 'DOMPurify é aplicado imediatamente antes de dangerouslySetInnerHTML, com tags/atributos/URIs restritos.'),
    ('Segredos em produção', 'src/lib/env.ts:6-39', 'DATABASE_URL, NEXTAUTH_SECRET e ENCRYPTION_KEY têm validação de tamanho/presença; produção lança erro em configuração inválida.'),
    ('Rate limiting e webhook', 'src/app/api/recordings/[id]/route.ts:16-22; src/app/api/webhooks/stripe/route.ts', 'Endpoints mutáveis usam rate limit; Stripe possui rota dedicada para webhook.'),
]

class Chip(Flowable):
    def __init__(self, text, color):
        super().__init__(); self.text = text; self.color = colors.HexColor(color); self.width = 2.2*cm; self.height = .45*cm
    def draw(self):
        self.canv.setFillColor(self.color); self.canv.roundRect(0, 0, self.width, self.height, 3, fill=1, stroke=0)
        self.canv.setFillColor(colors.white); self.canv.setFont('Helvetica-Bold', 7.5); self.canv.drawCentredString(self.width/2, .14*cm, self.text.upper())

class ReportDocTemplate(BaseDocTemplate):
    def __init__(self, filename, **kwargs):
        super().__init__(filename, pagesize=A4, leftMargin=2*cm, rightMargin=2*cm, topMargin=2.1*cm, bottomMargin=1.8*cm, **kwargs)
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id='normal')
        self.addPageTemplates([PageTemplate(id='main', frames=frame, onPage=self._footer)])
    def _footer(self, canvas, doc):
        canvas.saveState(); canvas.setStrokeColor(colors.HexColor('#CBD5E1')); canvas.setLineWidth(.4); canvas.line(2*cm, 1.35*cm, A4[0]-2*cm, 1.35*cm)
        canvas.setFont('Helvetica', 8); canvas.setFillColor(colors.HexColor('#64748B')); canvas.drawString(2*cm, .85*cm, 'English School · Auditoria de Segurança'); canvas.drawRightString(A4[0]-2*cm, .85*cm, f'Página {doc.page}')
        canvas.restoreState()

def styles():
    s = getSampleStyleSheet(); s.add(ParagraphStyle('Cover', parent=s['Title'], fontName='Helvetica-Bold', fontSize=26, leading=31, textColor=colors.HexColor('#0F172A'), alignment=TA_CENTER, spaceAfter=18)); s.add(ParagraphStyle('H1x', parent=s['Heading1'], fontName='Helvetica-Bold', fontSize=18, leading=22, textColor=colors.HexColor('#0F172A'), spaceBefore=8, spaceAfter=10)); s.add(ParagraphStyle('H2x', parent=s['Heading2'], fontName='Helvetica-Bold', fontSize=11.5, leading=14, textColor=colors.HexColor('#0F172A'), spaceBefore=8, spaceAfter=4)); s.add(ParagraphStyle('Bodyx', parent=s['BodyText'], fontName='Helvetica', fontSize=9.2, leading=13, textColor=colors.HexColor('#334155'), spaceAfter=6)); s.add(ParagraphStyle('Smallx', parent=s['BodyText'], fontName='Helvetica', fontSize=7.5, leading=10, textColor=colors.HexColor('#475569'))); s.add(ParagraphStyle('Issue', parent=s['Code'], fontName='Courier', fontSize=7.2, leading=9.3, backColor=colors.HexColor('#F8FAFC'), borderColor=colors.HexColor('#CBD5E1'), borderWidth=.4, borderPadding=7, spaceAfter=10))
    return s

def p(text, style): return Paragraph(text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'), style)
def chart_images():
    OUT.mkdir(parents=True, exist_ok=True)
    counts = {k: sum(x['severity'] == k for x in FINDINGS) for k in ['Crítica','Alta','Média','Baixa','Informativa']}
    fig, ax = plt.subplots(figsize=(4.8, 3.1), dpi=160); vals=[v for v in counts.values() if v]; labs=[k for k,v in counts.items() if v]; cols=[SEVERITY[k] for k,v in counts.items() if v]; ax.pie(vals, labels=labs, colors=cols, startangle=90, wedgeprops={'width':.38,'edgecolor':'white'}, textprops={'fontsize':8}); ax.set_title('Achados por severidade', fontsize=11, weight='bold'); fig.tight_layout(); donut=OUT/'severity.png'; fig.savefig(donut, transparent=False, bbox_inches='tight'); plt.close(fig)
    cats = {}; [cats.__setitem__(x['category'].split(' / ')[0], cats.get(x['category'].split(' / ')[0], 0)+1) for x in FINDINGS]; fig, ax=plt.subplots(figsize=(6.2,3.1),dpi=160); ax.bar(list(cats), list(cats.values()), color='#2563EB'); ax.set_title('Achados por categoria', fontsize=11, weight='bold'); ax.set_ylabel('Quantidade'); ax.grid(axis='y', alpha=.2); fig.tight_layout(); bars=OUT/'categories.png'; fig.savefig(bars, bbox_inches='tight'); plt.close(fig); return donut, bars

def issue_markdown(i, f):
    return f'''--- ISSUE {i} ---\n# [Segurança] {f['title']}\n\n**Labels sugeridas:** `security`, `severity:{f['severity'].lower()}`\n\n## Descrição\n{f['why']}\n\n## Evidência\n`{f['file']}`\n```ts\n{f['evidence']}\n```\n\n## Impacto\n{f['impact']}\n\n## Sugestão de correção\n{f['fix']}\n\n## Critérios de aceite\n- [ ] O servidor rejeita identidade ausente ou inconsistente com HTTP 403.\n- [ ] A operação verifica posse/escopo no mesmo comando de escrita.\n- [ ] Teste automatizado cobre ID de outro usuário e perfil sem vínculo.\n- [ ] Logs de auditoria registram a tentativa sem expor segredos.\n--- FIM ISSUE {i} ---'''

def build():
    s=styles(); donut,bars=chart_images(); story=[]
    story += [Spacer(1, 2.2*cm), p('Relatório de Auditoria de Segurança — English School System', s['Cover']), p('Auditoria técnica do código-fonte', ParagraphStyle('center', parent=s['Bodyx'], alignment=TA_CENTER, fontSize=12)), Spacer(1, 1.2*cm), HRFlowable(width='65%', thickness=2, color=colors.HexColor('#2563EB'), hAlign='CENTER'), Spacer(1, 1.2*cm), p(f'Data: {date.today().strftime("%d/%m/%Y")}', ParagraphStyle('center2', parent=s['Bodyx'], alignment=TA_CENTER)), p('Escopo: Next.js 16, React/TypeScript, NextAuth JWT, Prisma/PostgreSQL, APIs, frontend, Docker Compose, CI, documentação e histórico Git.', ParagraphStyle('center3', parent=s['Bodyx'], alignment=TA_CENTER)), p('Nota metodológica: as categorias foram mapeadas para queries Prisma sem RLS explícito, guards server-side NextAuth, gates de UI, renderização HTML/URLs e credenciais de deploy.', ParagraphStyle('center4', parent=s['Bodyx'], alignment=TA_CENTER)), PageBreak()]
    story += [p('Resumo executivo', s['H1x']), p('Foram verificados 33 handlers em src/app/api/**/route.ts, serviços relacionados, schema Prisma, gates de frontend, configuração de ambiente, Docker/CI/documentação e histórico Git. Foram confirmados 3 achados acionáveis: 2 de alta severidade relacionados a autorização/posse e 1 de baixa severidade relacionado a credencial padrão de desenvolvimento.', s['Bodyx']), Table([[Image(str(donut), width=8.3*cm, height=5.4*cm), Image(str(bars), width=10.2*cm, height=5.1*cm)]], colWidths=[8.5*cm,10.5*cm], style=TableStyle([('VALIGN',(0,0),(-1,-1),'MIDDLE')])), Spacer(1, .4*cm), p('Não foram encontrados achados verificados de XSS nos pontos HTML analisados, nem chaves de produção hardcoded no bundle/documentação examinados. A credencial do Compose é um risco condicionado ao uso fora de ambiente local isolado.', s['Bodyx']), PageBreak()]
    story += [p('Pontos fortes', s['H1x'])]
    for title, ev, desc in STRENGTHS: story += [p(f'<b>{title}</b> — {ev}<br/>{desc}', s['Bodyx'])]
    story += [p('Pontos fracos centrais', s['H1x']), p('Os guards de escrita delegam a autorização a serviços que tratam um teacherId opcional como suficiente. A camada de rota confirma o papel, mas não confirma a existência do perfil Teacher antes de chamar a operação. Isso cria uma falha de negação implícita: identidade parcial não é rejeitada.', s['Bodyx']), PageBreak(), p('Achados detalhados', s['H1x'])]
    rows=[[p('<b>Severidade</b>',s['Smallx']),p('<b>Arquivo:linha</b>',s['Smallx']),p('<b>Descrição verificada</b>',s['Smallx'])]]
    for f in FINDINGS: rows.append([Chip(f['severity'], SEVERITY[f['severity']]), p(f'<b>{f["file"]}</b><br/><font color="#475569">{f["category"]}</font>',s['Smallx']), p(f'<b>{f["title"]}</b><br/>{f["why"]}<br/><font color="#64748B">Evidência: {f["evidence"]}</font>',s['Smallx'])])
    t=Table(rows,colWidths=[2.5*cm,5.1*cm,11.4*cm],repeatRows=1); t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#E2E8F0')),('GRID',(0,0),(-1,-1),.35,colors.HexColor('#CBD5E1')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)])); story += [t, Spacer(1, .5*cm), p('Categorias sem achado confirmado', s['H2x']), p('Banco sem tranca: não há RLS; o isolamento é implementado por filtros manuais por userId/role. A auditoria encontrou os dois bypasses acima, mas não confirmou outra listagem sem escopo nos handlers revisados. Permissão definida no navegador: os endpoints sensíveis possuem validação server-side; ocultar UI não é considerado proteção. XSS: categoria aplicável ao frontend, mas os sinks encontrados usam sanitizeRichHtml.', s['Bodyx']), PageBreak(), p('Recomendações priorizadas', s['H1x'])]
    recs=[('P1','Corrigir os dois guards de serviço para falhar fechado e condicionar a escrita à posse.'),('P2','Adicionar testes de autorização por objeto para cada rota PATCH/DELETE e para professor sem perfil relacionado.'),('P3','Remover a senha fixa do Compose, parametrizar via variável local não versionada e manter a porta do Postgres fechada por padrão.'),('P4','Manter a validação de ambiente em produção e expandir a revisão periódica de sinks HTML, URLs e bundles.')]
    for n,d in recs: story += [p(f'<b>{n}</b> — {d}', s['Bodyx'])]
    story += [p('Cobertura e condições', s['H1x']), p('Foram considerados todos os 33 arquivos route.ts encontrados. Rotas públicas (health, autenticação, registro, blog e webhook) foram tratadas conforme sua função; webhook depende de assinatura Stripe e endpoints de autenticação aplicam rate limiting/validação. O histórico Git consultado não apresentou segredo real confirmado; commits de hardening e testes foram tratados como contexto, não como prova de segurança atual.', s['Bodyx']), PageBreak(), p('ISSUES PARA O GITHUB', s['H1x']), p('As issues abaixo estão completas e delimitadas para cópia direta.', s['Bodyx'])]
    for i,f in enumerate(FINDINGS,1): story += [p(issue_markdown(i,f), s['Issue'])]
    ReportDocTemplate(str(PDF), title='Auditoria de Segurança').build(story)
    print(PDF)

if __name__ == '__main__': build()

# Regerar: python docs/security-audit/generate_report.py
# Dependências isoladas: reportlab, matplotlib
# Relatório deliberadamente não altera o código da aplicação.

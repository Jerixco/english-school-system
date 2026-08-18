import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  UserCheck,
  FileText,
  Clock,
  Mail,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Privacidade & LGPD | English School',
  description:
    'Conheça nossa Política de Privacidade em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei no 13.709/2018). Saiba como tratamos e protegemos seus dados pessoais.',
  alternates: {
    canonical: '/privacidade',
  },
}

export default function PrivacidadePage() {
  const lastUpdated = '14 de agosto de 2026'

  return (
    <div className="min-h-screen bg-[hsl(38,20%,97%)] grain">
      {/* Header de Navegação */}
      <header className="border-b border-[hsl(35,10%,85%)] bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <Link
            href="/"
            className="text-xl font-outfit font-bold text-[hsl(20,10%,10%)] flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-[hsl(25,85%,48%)] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            English School
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs border-[hsl(35,10%,85%)] text-[hsl(20,10%,15%)]">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao início
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-14 px-4 bg-[hsl(220,25%,12%)] text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-[hsl(25,85%,48%)]/20 text-[hsl(25,85%,48%)] px-3 py-1 rounded-sm text-xs font-semibold uppercase tracking-wider mb-4 border border-[hsl(25,85%,48%)]/30">
            <ShieldCheck className="h-4 w-4" />
            Conformidade LGPD (Lei no 13.709/2018)
          </div>
          <h1 className="text-3xl sm:text-4xl font-outfit font-bold tracking-tight text-white mb-4">
            Política de Privacidade e Proteção de Dados
          </h1>
          <p className="text-sm sm:text-base text-[hsl(20,5%,65%)] max-w-2xl mx-auto leading-relaxed">
            Transparência, segurança e respeito aos seus direitos fundamentais de liberdade e privacidade.
          </p>
          <div className="mt-4 text-xs text-[hsl(20,5%,55%)]">
            Última atualização: <strong className="text-[hsl(20,5%,75%)]">{lastUpdated}</strong>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <main className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Card Resumo Rápido */}
          <Card className="border-indigo-100 bg-indigo-50/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-indigo-950 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                Nossos Compromissos Fundamentais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-indigo-900">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span><strong>Não vendemos nem alugamos</strong> seus dados pessoais para terceiros sob nenhuma hipótese.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span>Credenciais e segredos de autenticação (2FA) são protegidos com <strong>criptografia forte AES-256-GCM</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span>Garantimos o <strong>Direito ao Esquecimento (Art. 18 da LGPD)</strong> com anonimização irreversível sob solicitação.</span>
              </div>
            </CardContent>
          </Card>

          {/* Seção 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                <Database className="h-5 w-5 text-indigo-600" />
                1. Quais Dados Coletamos e Como Utilizamos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <p>
                A <strong>English School</strong> coleta apenas os dados estritamente necessários para a prestação dos serviços educacionais contratados e para a segurança da plataforma:
              </p>
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <h4 className="font-bold text-slate-900 mb-1">Dados Cadastrais & Matrícula</h4>
                  <p className="text-xs text-slate-600">
                    Nome completo, endereço de e-mail, número de telefone/WhatsApp e plano contratado. Utilizados para identificação, agendamento de aulas e comunicações pedagógicas.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <h4 className="font-bold text-slate-900 mb-1">Dados de Pagamento & Faturamento</h4>
                  <p className="text-xs text-slate-600">
                    Processados de forma tokenizada e criptografada pelo gateway de pagamento parceiro. A plataforma não armazena números de cartão de crédito em texto puro.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <h4 className="font-bold text-slate-900 mb-1">Dados de Aulas & Videoconferência</h4>
                  <p className="text-xs text-slate-600">
                    Registro de presença, notas pedagógicas de nivelamento e gravações de aulas ao vivo WebRTC para revisão durante o período de retenção programado.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <h4 className="font-bold text-slate-900 mb-1">Logs de Segurança & Auditoria</h4>
                  <p className="text-xs text-slate-600">
                    Endereço IP (resolvido por proxy reverso confiável), registro de tentativas de autenticação e data/hora de acessos para prevenção contra fraudes e ataques de força bruta.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                2. Bases Legais do Tratamento (Art. 7o da LGPD)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <p>
                Todo tratamento de dados pessoais realizado pela English School está devidamente fundamentado nas hipóteses legais previstas pela LGPD:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li><strong>Execução de Contrato (Art. 7o, V):</strong> Para prestação das aulas de inglês, acesso ao portal do aluno, agendamento de professores e processamento da assinatura.</li>
                <li><strong>Cumprimento de Obrigação Legal ou Regulatória (Art. 7o, II):</strong> Emissão de notas fiscais, faturas de cobrança e cumprimento de ordens judiciais.</li>
                <li><strong>Legítimo Interesse e Segurança (Art. 7o, IX):</strong> Prevenção a acessos não autorizados, auditoria de segurança da informação e bloqueio de credenciais comprometidas.</li>
                <li><strong>Consentimento (Art. 7o, I):</strong> Quando aplicável, para o envio de comunicações promocionais e cookies analíticos opcionais.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                <Lock className="h-5 w-5 text-indigo-600" />
                3. Medidas de Segurança da Informação e Criptografia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <p>
                Adotamos salvaguardas técnicas e organizacionais de padrão internacional para proteger os dados pessoais sob nossa guarda contra acessos não autorizados, vazamentos ou destruição ilícita:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li><strong>Criptografia em Repouso:</strong> Segredos de autenticação em dois fatores (2FA) e identificadores sensíveis são protegidos por criptografia simétrica <strong>AES-256-GCM</strong>.</li>
                <li><strong>Criptografia em Trânsito:</strong> Imposição de transporte estritamente cifrado via <strong>HTTPS / TLS 1.3</strong> com política HSTS de longa duração.</li>
                <li><strong>Proteção de Senhas:</strong> Senhas são armazenadas exclusivamente sob hashes criptográficos irreversíveis utilizando <strong>BCrypt com fator de custo 12</strong>.</li>
                <li><strong>Gestão Segura de Sessão:</strong> Tokens de autenticação JWT são trafegados exclusivamente em cookies protegidos com os atributos <code>HttpOnly</code>, <code>SameSite=Lax</code> e <code>Secure</code>.</li>
                <li><strong>Defesa em Camadas (OWASP):</strong> Implementação de Content Security Policy (CSP), rate limiting distribuído contra força bruta e sanitização em duas fases contra ataques XSS e injeção de código.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                4. Retenção e Expurgo Programado de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <p>
                Os dados pessoais são mantidos apenas pelo período necessário para atender às finalidades pedagógicas e operacionais:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li><strong>Gravações de Aulas (VOD):</strong> Permanecem disponíveis temporariamente para revisão durante a vigência do plano do estudante (com expiração e descarte automatizado).</li>
                <li><strong>Logs de Auditoria e Conexão:</strong> Mantidos por prazo de segurança conforme prazos estabelecidos pelo Marco Civil da Internet (Lei no 12.965/2014).</li>
                <li><strong>Encerramento de Conta:</strong> Ao cancelar sua matrícula, o aluno pode solicitar a eliminação definitiva de seus dados por meio do canal de privacidade.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 5 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-indigo-600" />
                5. Seus Direitos como Titular de Dados (Art. 18 da LGPD)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <p>
                Em consonância com o Artigo 18 da LGPD, você possui os seguintes direitos garantidos a qualquer momento e sem custos:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 p-3 rounded-lg border text-xs">
                  <strong>Confirmação e Acesso:</strong> Confirmar a existência de tratamento e acessar seus dados cadastrais.
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border text-xs">
                  <strong>Correção:</strong> Solicitar a retificação de dados incompletos, inexatos ou desatualizados.
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border text-xs">
                  <strong>Direito ao Esquecimento:</strong> Solicitar a anonimização irreversível ou eliminação de dados pessoais desnecessários.
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border text-xs">
                  <strong>Revogação de Consentimento:</strong> Revogar autorizações concedidas anteriormente para comunicações.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 6 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-600" />
                6. Canal do Encarregado de Dados (DPO) & Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <p>
                Para exercer qualquer um dos seus direitos previstos pela LGPD, tirar dúvidas ou registrar solicitações sobre a proteção dos seus dados, entre em contato diretamente com o nosso Encarregado de Proteção de Dados (DPO):
              </p>
              <div className="bg-slate-900 text-white p-4 rounded-xl space-y-1 text-xs sm:text-sm">
                <div><strong>Encarregado pelo Tratamento de Dados Pessoais (DPO):</strong> Equipe de Privacidade e Compliance</div>
                <div><strong>Canal Exclusivo LGPD:</strong> <span className="text-indigo-300">privacidade@englishschool.com</span></div>
                <div><strong>Prazo de Resposta:</strong> Em até 15 (quinze) dias conforme estabelecido pela legislação vigente.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[hsl(35,10%,85%)] py-10 px-4 bg-[hsl(35,10%,94%)] mt-12">
        <div className="container mx-auto max-w-4xl text-center text-xs text-[hsl(20,5%,45%)] space-y-2">
          <p>© {new Date().getFullYear()} English School. Todos os direitos reservados.</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <Link href="/" className="hover:text-[hsl(25,85%,48%)] transition-colors">Início</Link>
            <span>•</span>
            <Link href="/planos" className="hover:text-[hsl(25,85%,48%)] transition-colors">Planos</Link>
            <span>•</span>
            <Link href="/privacidade" className="text-[hsl(25,85%,48%)] font-semibold">Política de Privacidade (LGPD)</Link>
            <span>•</span>
            <Link href="/contato" className="hover:text-[hsl(25,85%,48%)] transition-colors">Contato</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

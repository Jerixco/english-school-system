'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Shield, Info, Lock, AlertCircle } from 'lucide-react'

type SetupStep = 'idle' | 'scanning' | 'enabled'

export default function SegurancaPage() {
  const { data: session, update } = useSession()
  const [step, setStep] = useState<SetupStep>('idle')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  useEffect(() => {
    fetch('/api/auth/profile')
      .then(async (res) => {
        if (res.ok) {
          const json = await res.json()
          setTwoFactorEnabled(json.user?.twoFactorEnabled ?? false)
        }
      })
      .catch(() => {})
  }, [])

  const startSetup = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/auth/enable-2fa', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setQrCode(data.qrCode)
      setSecret(data.secret)
      setStep('scanning')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao iniciar configuração')
    } finally {
      setLoading(false)
    }
  }

  const verifyAndEnable = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/enable-2fa', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setTwoFactorEnabled(true)
      setStep('enabled')
      setSuccess('Autenticação em duas etapas ativada com sucesso!')
      await update()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Código inválido')
    } finally {
      setLoading(false)
    }
  }

  const disable2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/auth/enable-2fa', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setTwoFactorEnabled(false)
      setStep('idle')
      setToken('')
      setPassword('')
      setSuccess('2FA desativado com sucesso.')
      await update()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao desativar 2FA')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardShell title="Segurança" subtitle="Proteja sua conta com autenticação em duas etapas">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-4">
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
                <div className="flex-1">
                  <h5 className="font-bold mb-1">Autenticação em Duas Etapas (2FA)</h5>
                  <small className="text-gray-600">
                    {twoFactorEnabled
                      ? 'Sua conta está protegida com 2FA'
                      : 'Adicione uma camada extra de segurança'}
                  </small>
                </div>
                <Badge className={twoFactorEnabled ? 'bg-green-600' : 'bg-gray-600'}>
                  {twoFactorEnabled ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>

              {!twoFactorEnabled && step === 'idle' && (
                <div>
                  <p className="text-gray-600 mb-4">
                    Use um aplicativo autenticador (Google Authenticator, Authy, etc.) para
                    gerar códigos de verificação ao fazer login.
                  </p>
                  <Button onClick={startSetup} disabled={loading}>
                    {loading ? 'Preparando...' : 'Ativar 2FA'}
                  </Button>
                </div>
              )}

              {!twoFactorEnabled && step === 'scanning' && (
                <div>
                  <p className="mb-4 text-gray-600">
                    Escaneie o QR Code com seu aplicativo autenticador ou insira a chave manualmente:
                  </p>
                  {qrCode && (
                    <div className="text-center mb-4">
                      <img src={qrCode} alt="QR Code 2FA" className="border rounded-lg p-2 mx-auto" width={200} />
                    </div>
                  )}
                  {secret && (
                    <div className="bg-gray-100 border border-gray-200 rounded-md p-3 mb-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Chave manual:</p>
                      <p className="font-mono font-bold">{secret}</p>
                    </div>
                  )}
                  <form onSubmit={verifyAndEnable} className="space-y-4">
                    <div>
                      <Label htmlFor="token">Código de verificação (6 dígitos)</Label>
                      <Input
                        id="token"
                        type="text"
                        className="text-center text-2xl tracking-widest"
                        maxLength={6}
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        value={token}
                        onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading || token.length !== 6}>
                        {loading ? 'Verificando...' : 'Confirmar e Ativar'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setStep('idle')
                          setToken('')
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {twoFactorEnabled && (
                <div>
                  <p className="text-gray-600 mb-4">
                    Para desativar o 2FA, confirme sua senha e o código atual do autenticador.
                  </p>
                  <form onSubmit={disable2FA} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="disableToken">Código 2FA</Label>
                        <Input
                          id="disableToken"
                          type="text"
                          maxLength={6}
                          inputMode="numeric"
                          value={token}
                          onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" variant="destructive" disabled={loading}>
                      {loading ? 'Desativando...' : 'Desativar 2FA'}
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-4">
            <CardContent className="pt-6">
              <h6 className="font-bold mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Informações da Conta
              </h6>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-600">Email</dt>
                  <dd className="font-medium">{session?.user?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Nome</dt>
                  <dd className="font-medium">{session?.user?.name}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h6 className="font-bold mb-3 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Dicas de Segurança
              </h6>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Use senhas fortes e únicas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Ative a autenticação em duas etapas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Nunca compartilhe seus códigos 2FA</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Encerre a sessão em dispositivos compartilhados</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

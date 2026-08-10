/**
 * Resolução de IP de cliente resistente a spoofing de `x-forwarded-for`.
 *
 * `x-forwarded-for` é preenchido da esquerda (cliente original) para a direita
 * (proxy mais próximo da app). Como o cliente controla o valor inicial, os
 * tokens à ESQUERDA são forjáveis — confiar no primeiro token permite que um
 * atacante finja um IP novo a cada request e burle o rate limiting, ou forje o
 * IP gravado no audit log.
 *
 * Só os N tokens à DIREITA — anexados pelos SEUS proxies confiáveis — são
 * confiáveis. `TRUSTED_PROXY_COUNT` diz quantos proxies existem na frente da app
 * (Vercel / Cloudflare / nginx único = 1). O IP real do cliente é o token na
 * posição `(comprimento - TRUSTED_PROXY_COUNT)`.
 */
const TRUSTED_PROXY_COUNT = Math.max(
  1,
  parseInt(process.env.TRUSTED_PROXY_COUNT || '1', 10) || 1
)

export function getClientIpFromHeaders(headers: Headers): string {
  const xff = headers.get('x-forwarded-for')
  if (xff) {
    const parts = xff
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)

    // Pega o token anexado pelo proxy confiável mais externo. O cliente não
    // consegue empurrar valores para essa posição — o proxy sempre anexa depois.
    if (parts.length >= TRUSTED_PROXY_COUNT) {
      const ip = parts[parts.length - TRUSTED_PROXY_COUNT]
      if (ip) return ip
    }
    // Menos entradas que o esperado = cabeçalho provavelmente forjado; ignora.
  }

  // Cabeçalho definido pelo proxy confiável (não pelo cliente).
  const realIp = headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  return 'unknown'
}

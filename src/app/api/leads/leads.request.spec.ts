import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { NextRequest } from 'next/server'
import { LeadStatus } from '@prisma/client'
import { GET, POST } from './route'
import { PATCH, DELETE } from './[id]/route'

const prismaMock = vi.hoisted(() => ({
  lead: {
    findMany: vi.fn(),
    create: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    deleteMany: vi.fn(),
  },
}))

const rateLimiterMock = vi.hoisted(() => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true }),
  getClientIdentifier: vi.fn().mockReturnValue('127.0.0.1'),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}))

vi.mock('@/lib/rate-limiter', () => ({
  apiRateLimiter: {},
  checkRateLimit: rateLimiterMock.checkRateLimit,
  getClientIdentifier: rateLimiterMock.getClientIdentifier,
}))

const USER_ID = '43a873f0-997c-4482-bf8d-4d6f6790925b'
const OTHER_USER_ID = 'f5fd40f8-9235-4f39-819b-cf8d3d36ff84'

const leadsOpenApi = {
  openapi: '3.0.3',
  info: {
    title: 'English School API',
    version: '1.0.0',
    description: 'Gerado a partir dos request specs de leads.',
  },
  paths: {
    '/api/leads': {
      get: {
        summary: 'Listar leads do usuário do header',
        parameters: [
          {
            name: 'X-User-Id',
            in: 'header',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'status',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: Object.values(LeadStatus) },
          },
        ],
        responses: {
          200: { description: 'Leads retornados com sucesso' },
          400: { description: 'Header ou status inválido' },
          429: { description: 'Rate limit excedido' },
        },
      },
      post: {
        summary: 'Criar lead no escopo do usuário do header',
        parameters: [
          {
            name: 'X-User-Id',
            in: 'header',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string' },
                  source: { type: 'string' },
                  notes: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Lead criado com sucesso' },
          400: { description: 'Header ou payload inválido' },
          429: { description: 'Rate limit excedido' },
        },
      },
    },
    '/api/leads/{id}': {
      patch: {
        summary: 'Atualizar lead somente do usuário dono',
        parameters: [
          {
            name: 'X-User-Id',
            in: 'header',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          200: { description: 'Lead atualizado com sucesso' },
          404: { description: 'Lead não encontrado no escopo do usuário' },
        },
      },
      delete: {
        summary: 'Excluir lead somente do usuário dono',
        parameters: [
          {
            name: 'X-User-Id',
            in: 'header',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          200: { description: 'Lead excluído com sucesso' },
          404: { description: 'Lead não encontrado no escopo do usuário' },
        },
      },
    },
  },
}

const makeRequest = (
  url: string,
  init: RequestInit = {},
  userId: string = USER_ID
) =>
  new NextRequest(url, {
    ...init,
    headers: {
      'content-type': 'application/json',
      'x-user-id': userId,
      'x-forwarded-for': '127.0.0.1',
      ...(init.headers || {}),
    },
  })

describe('Leads request specs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    rateLimiterMock.checkRateLimit.mockResolvedValue({ success: true })
  })

  it('GET /api/leads retorna somente dados do usuário do header', async () => {
    prismaMock.lead.findMany.mockResolvedValue([{ id: 'lead-1', userId: USER_ID }])
    const req = makeRequest('http://localhost/api/leads')

    const response = await GET(req)
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload).toEqual([{ id: 'lead-1', userId: USER_ID }])
    expect(prismaMock.lead.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: USER_ID },
      })
    )
  })

  it('GET /api/leads retorna 400 para status inválido', async () => {
    const req = makeRequest('http://localhost/api/leads?status=INVALID')

    const response = await GET(req)
    const payload = await response.json()

    expect(response.status).toBe(400)
    expect(payload.error).toBe('Invalid status filter')
  })

  it('GET /api/leads retorna 429 quando rate limit é excedido', async () => {
    rateLimiterMock.checkRateLimit.mockResolvedValueOnce({ success: false })
    const req = makeRequest('http://localhost/api/leads')

    const response = await GET(req)
    const payload = await response.json()

    expect(response.status).toBe(429)
    expect(payload.error).toBe('Too many requests. Please try again later.')
  })

  it('GET /api/leads retorna 500 quando ocorre erro inesperado', async () => {
    prismaMock.lead.findMany.mockRejectedValueOnce(new Error('db down'))
    const req = makeRequest('http://localhost/api/leads')

    const response = await GET(req)
    const payload = await response.json()

    expect(response.status).toBe(500)
    expect(payload.error).toBe('Failed to fetch leads')
  })

  it('POST /api/leads persiste o userId do header no registro', async () => {
    prismaMock.lead.create.mockResolvedValue({ id: 'lead-2', userId: USER_ID })
    const req = makeRequest('http://localhost/api/leads', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Maria',
        email: 'maria@example.com',
      }),
    })

    const response = await POST(req)
    const payload = await response.json()

    expect(response.status).toBe(201)
    expect(payload.userId).toBe(USER_ID)
    expect(prismaMock.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: USER_ID,
        }),
      })
    )
  })

  it('POST /api/leads retorna 429 quando rate limit é excedido', async () => {
    rateLimiterMock.checkRateLimit.mockResolvedValueOnce({ success: false })
    const req = makeRequest('http://localhost/api/leads', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Maria',
        email: 'maria@example.com',
      }),
    })

    const response = await POST(req)
    const payload = await response.json()

    expect(response.status).toBe(429)
    expect(payload.error).toBe('Too many requests. Please try again later.')
  })

  it('POST /api/leads retorna 400 para payload inválido (ZodError)', async () => {
    const req = makeRequest('http://localhost/api/leads', {
      method: 'POST',
      body: JSON.stringify({
        name: 'A',
        email: 'invalido',
      }),
    })

    const response = await POST(req)
    const payload = await response.json()

    expect(response.status).toBe(400)
    expect(payload.error).toBe('Invalid input data')
  })

  it('POST /api/leads retorna 500 quando ocorre erro inesperado', async () => {
    prismaMock.lead.create.mockRejectedValueOnce(new Error('insert failed'))
    const req = makeRequest('http://localhost/api/leads', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Maria',
        email: 'maria@example.com',
      }),
    })

    const response = await POST(req)
    const payload = await response.json()

    expect(response.status).toBe(500)
    expect(payload.error).toBe('Failed to create lead')
  })

  it('PATCH /api/leads/:id retorna 404 ao acessar lead de outro usuário', async () => {
    prismaMock.lead.findFirst.mockResolvedValue(null)
    const req = makeRequest('http://localhost/api/leads/lead-3', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'CONTACTED' }),
    })

    const response = await PATCH(req, { params: Promise.resolve({ id: 'lead-3' }) })
    const payload = await response.json()

    expect(response.status).toBe(404)
    expect(payload.error).toBe('Lead not found for this user')
    expect(prismaMock.lead.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'lead-3', userId: USER_ID },
      })
    )
  })

  it('PATCH /api/leads/:id atualiza lead no escopo correto', async () => {
    prismaMock.lead.findFirst.mockResolvedValue({ id: 'lead-4' })
    prismaMock.lead.update.mockResolvedValue({
      id: 'lead-4',
      status: 'CONTACTED',
      userId: USER_ID,
    })
    const req = makeRequest('http://localhost/api/leads/lead-4', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'CONTACTED' }),
    })

    const response = await PATCH(req, { params: Promise.resolve({ id: 'lead-4' }) })
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.id).toBe('lead-4')
    expect(prismaMock.lead.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'lead-4' },
      })
    )
  })

  it('PATCH /api/leads/:id retorna 400 com X-User-Id inválido', async () => {
    const req = makeRequest(
      'http://localhost/api/leads/lead-4',
      {
        method: 'PATCH',
        body: JSON.stringify({ status: 'CONTACTED' }),
      },
      'not-an-uuid'
    )

    const response = await PATCH(req, { params: Promise.resolve({ id: 'lead-4' }) })
    const payload = await response.json()

    expect(response.status).toBe(400)
    expect(payload.error).toBe('Invalid X-User-Id header')
  })

  it('PATCH /api/leads/:id retorna 500 quando ocorre erro inesperado', async () => {
    prismaMock.lead.findFirst.mockResolvedValue({ id: 'lead-4' })
    prismaMock.lead.update.mockRejectedValueOnce(new Error('update failed'))
    const req = makeRequest('http://localhost/api/leads/lead-4', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'CONTACTED' }),
    })

    const response = await PATCH(req, { params: Promise.resolve({ id: 'lead-4' }) })
    const payload = await response.json()

    expect(response.status).toBe(500)
    expect(payload.error).toBe('Failed to update lead')
  })

  it('DELETE /api/leads/:id remove lead apenas no escopo do usuário', async () => {
    prismaMock.lead.deleteMany.mockResolvedValue({ count: 1 })
    const req = makeRequest('http://localhost/api/leads/lead-5', { method: 'DELETE' })

    const response = await DELETE(req, { params: Promise.resolve({ id: 'lead-5' }) })
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.success).toBe(true)
    expect(prismaMock.lead.deleteMany).toHaveBeenCalledWith({
      where: {
        id: 'lead-5',
        userId: USER_ID,
      },
    })
  })

  it('DELETE /api/leads/:id retorna 404 para recurso fora do escopo', async () => {
    prismaMock.lead.deleteMany.mockResolvedValue({ count: 0 })
    const req = makeRequest('http://localhost/api/leads/lead-6', { method: 'DELETE' }, OTHER_USER_ID)

    const response = await DELETE(req, { params: Promise.resolve({ id: 'lead-6' }) })
    const payload = await response.json()

    expect(response.status).toBe(404)
    expect(payload.error).toBe('Lead not found for this user')
  })

  it('DELETE /api/leads/:id retorna 400 com X-User-Id inválido', async () => {
    const req = makeRequest('http://localhost/api/leads/lead-6', { method: 'DELETE' }, 'bad-user-id')

    const response = await DELETE(req, { params: Promise.resolve({ id: 'lead-6' }) })
    const payload = await response.json()

    expect(response.status).toBe(400)
    expect(payload.error).toBe('Invalid X-User-Id header')
  })

  it('DELETE /api/leads/:id retorna 500 quando ocorre erro inesperado', async () => {
    prismaMock.lead.deleteMany.mockRejectedValueOnce(new Error('delete failed'))
    const req = makeRequest('http://localhost/api/leads/lead-6', { method: 'DELETE' })

    const response = await DELETE(req, { params: Promise.resolve({ id: 'lead-6' }) })
    const payload = await response.json()

    expect(response.status).toBe(500)
    expect(payload.error).toBe('Failed to delete lead')
  })

  it('retorna 400 quando X-User-Id está ausente', async () => {
    const req = new NextRequest('http://localhost/api/leads', { method: 'GET' })
    const response = await GET(req)
    const payload = await response.json()

    expect(response.status).toBe(400)
    expect(payload.error).toBe('Missing X-User-Id header')
  })
})

afterAll(() => {
  const outputPath = path.join(process.cwd(), 'public', 'openapi.json')
  mkdirSync(path.dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, `${JSON.stringify(leadsOpenApi, null, 2)}\n`, 'utf-8')
})

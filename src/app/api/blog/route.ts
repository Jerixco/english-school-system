import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { getAuthenticatedUser, isAdmin } from '@/lib/security'
import { createBlogSchema } from '@/lib/validations'
import { sanitizeRichHtml } from '@/lib/sanitize-html'
import { ZodError } from 'zod'

export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(req.url)
    const published = searchParams.get('published')
    const tag = searchParams.get('tag')

    const where: any = {}
    if (published !== null) where.published = published === 'true'
    if (tag) where.tags = { has: tag }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Autenticação obrigatória — apenas ADMIN pode criar posts
    const user = await getAuthenticatedUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: user ? 403 : 401 }
      )
    }

    const body = await req.json()
    const data = createBlogSchema.parse(body)

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: sanitizeRichHtml(data.content),
        excerpt: data.excerpt,
        coverImage: data.coverImage || null,
        published: data.published,
        author: data.author,
        tags: data.tags,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Já existe um post com este slug' },
        { status: 409 }
      )
    }
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}

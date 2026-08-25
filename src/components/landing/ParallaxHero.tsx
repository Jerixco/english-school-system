'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Star, Bot, Award, Sparkles, ShieldCheck } from 'lucide-react'

export default function ParallaxHero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
      setMousePos({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Parallax offsets
  const studentOffsetX = mousePos.x * 12
  const studentOffsetY = mousePos.y * 12 - scrollY * 0.05
  const teacherCardX = mousePos.x * -18
  const teacherCardY = mousePos.y * -18
  const ratingCardX = mousePos.x * 22
  const ratingCardY = mousePos.y * 22
  const aiBadgeX = mousePos.x * -14
  const aiBadgeY = mousePos.y * -14

  return (
    <section
      ref={heroRef}
      className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden"
      id="main-content"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePos({ x: 0, y: 0 })
      }}
    >
      {/* Dynamic Parallax Ambient Glow Background */}
      <div
        className="absolute top-10 left-1/4 w-96 h-96 bg-[hsl(25,85%,48%)]/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40 + scrollY * 0.1}px)`,
        }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50 - scrollY * 0.15}px)`,
        }}
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text & CTA */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(25,85%,48%)]/10 text-[hsl(25,85%,48%)] text-xs font-semibold mb-6 uppercase tracking-wider border border-[hsl(25,85%,48%)]/20 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[hsl(25,85%,48%)] animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(25,85%,48%)] -ml-4" />
              Aulas 100% Online & Ao Vivo
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-outfit font-extrabold mb-6 leading-[1.1] tracking-tight text-[hsl(20,10%,10%)]">
              Aprenda inglês com{' '}
              <span className="text-[hsl(25,85%,48%)] relative inline-block">
                professores nativos
                <svg
                  className="absolute -bottom-2 left-0 w-full h-2 text-[hsl(25,85%,48%)]/30"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[hsl(20,5%,45%)] mb-8 leading-relaxed max-w-lg">
              Aulas ao vivo personalizadas com inteligência artificial, suporte em tempo real e metodologia acelerada para sua fluência.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/agendar">
                <Button size="lg" className="bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  Agendar aula gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/metodologia">
                <Button size="lg" variant="outline" className="border-[hsl(35,10%,85%)] text-[hsl(20,10%,15%)] hover:bg-[hsl(25,85%,48%)]/5 transition-all">
                  Conhecer metodologia
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[hsl(20,5%,45%)]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" />
                </div>
                <span className="font-medium">Primeira aula grátis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 font-bold" />
                </div>
                <span className="font-medium">Sem fidelidade ou multas</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image with Parallax Depth Cards */}
          <div className="relative perspective-1000">
            {/* Main Student Image with 3D Tilt */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-[hsl(35,10%,85%)]/60 bg-white transition-transform duration-300 ease-out"
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 6}deg) rotateX(${mousePos.y * -6}deg) translate3d(${studentOffsetX}px, ${studentOffsetY}px, 0)`,
              }}
            >
              <Image
                src="/images/hero-student.jpg"
                alt="Aluna em aula online de inglês com professor nativo"
                width={600}
                height={750}
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Card 1 — Native Certified Teachers (Bottom-Left) */}
            <div
              className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-[hsl(35,10%,85%)]/70 max-w-[240px] transition-transform duration-300 ease-out z-20"
              style={{
                transform: `translate3d(${teacherCardX}px, ${teacherCardY}px, 30px)`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[hsl(35,10%,85%)]">
                  <Image
                    src="/images/hero-teacher.jpg"
                    alt="Professor Nativo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[hsl(25,85%,48%)]" />
                    <p className="text-xs font-outfit font-bold text-[hsl(20,10%,10%)]">Professores Nativos</p>
                  </div>
                  <p className="text-[11px] text-[hsl(20,5%,45%)]">EUA, Reino Unido e Canadá</p>
                </div>
              </div>
            </div>

            {/* Floating Card 2 — AI Tutor Alex Active Badge (Top-Right) */}
            <div
              className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-gradient-to-r from-purple-900/90 to-indigo-900/90 text-white backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-purple-500/30 max-w-[220px] transition-transform duration-300 ease-out z-20"
              style={{
                transform: `translate3d(${aiBadgeX}px, ${aiBadgeY}px, 40px)`,
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center text-purple-300">
                  <Bot className="w-4 h-4 text-yellow-300 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white">Tutor IA Alex</span>
                    <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                  </div>
                  <p className="text-[10px] text-purple-200">Prática conversacional 24/7</p>
                </div>
              </div>
            </div>

            {/* Floating Card 3 — Student Rating Badge (Mid-Right) */}
            <div
              className="hidden sm:flex absolute top-1/2 -right-8 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-lg shadow-lg border border-[hsl(35,10%,85%)]/70 items-center gap-2 transition-transform duration-300 ease-out z-20"
              style={{
                transform: `translate3d(${ratingCardX}px, ${ratingCardY}px, 20px)`,
              }}
            >
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-[hsl(20,10%,15%)]">4.9/5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

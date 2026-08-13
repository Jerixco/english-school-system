'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, Send, RefreshCw, AlertCircle, User, MessageSquare, Compass, Briefcase, GraduationCap, Plane } from 'lucide-react'

interface Message {
  role: 'user' | 'model'
  text: string
  isError?: boolean
}

const QUICK_PROMPTS = [
  { label: '💼 Entrevista de Emprego', text: "Let's practice a job interview in English. Ask me the first question!", icon: Briefcase },
  { label: '✈️ Inglês para Viagem', text: "I'm checking in at a hotel in London. Practice with me as the receptionist!", icon: Plane },
  { label: '📚 Dica Gramatical', text: "Can you explain the difference between 'Present Perfect' and 'Simple Past' with examples?", icon: GraduationCap },
  { label: '☕ Conversa do Dia a Dia', text: "Let's have a casual conversation about favorite hobbies and daily routines.", icon: MessageSquare },
]

export default function AiTutorCard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hi there! 👋 I'm Alex, your AI English Tutor. What would you like to practice today? You can choose a quick topic below or type any question!",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendQuery = async (userMessage: string) => {
    if (!userMessage.trim() || loading) return

    setInput('')
    const updatedMessages = [...messages, { role: 'user' as const, text: userMessage }]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            parts: m.text,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao processar resposta do Tutor IA')
      }

      setMessages([
        ...updatedMessages,
        { role: 'model', text: data.reply || 'Great job! Keep practicing!' },
      ])
    } catch (err: any) {
      setMessages([
        ...updatedMessages,
        {
          role: 'model',
          text: `⚠️ ${err.message || 'Desculpe, ocorreu um erro de conexão.'}`,
          isError: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    await sendQuery(input)
  }

  return (
    <Card className="border-purple-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-800 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/images/avatars/alex-tutor.jpg"
                alt="Alex - AI Tutor"
                className="w-11 h-11 rounded-full object-cover border-2 border-white/80 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-purple-800 rounded-full" />
            </div>
            <div>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                Alex — AI English Tutor
                <Sparkles className="h-4 w-4 text-yellow-300 fill-yellow-300 animate-pulse" />
              </CardTitle>
              <CardDescription className="text-purple-100 text-xs">
                Pratique conversação 24/7 com correções e feedback em tempo real
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-purple-600/50 hover:text-white"
            onClick={() =>
              setMessages([
                {
                  role: 'model',
                  text: "Hi there! 👋 I'm Alex, your AI English Tutor. What would you like to practice today?",
                },
              ])
            }
            title="Reiniciar conversa"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Chat Stream Window */}
        <div className="h-64 overflow-y-auto space-y-3 pr-2 mb-3 scroll-smooth">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-2.5 text-sm ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="shrink-0">
                  {msg.isError ? (
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  ) : (
                    <img
                      src="/images/avatars/alex-tutor.jpg"
                      alt="Alex"
                      className="w-8 h-8 rounded-full object-cover border border-purple-300 shadow-sm"
                    />
                  )}
                </div>
              )}
              <div
                className={`p-3 rounded-xl max-w-[82%] whitespace-pre-wrap leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none shadow-sm'
                    : msg.isError
                    ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200 shadow-sm'
                }`}
              >
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-2.5 items-center text-gray-400 text-xs italic">
              <img
                src="/images/avatars/alex-tutor.jpg"
                alt="Alex"
                className="w-8 h-8 rounded-full object-cover border border-purple-300 shadow-sm opacity-70 animate-pulse"
              />
              <div className="bg-purple-50 p-2.5 rounded-lg border border-purple-100 flex items-center gap-2 text-purple-700">
                <span className="w-2 h-2 bg-purple-600 rounded-full animate-ping" />
                Alex está digitando uma resposta...
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompt Pills */}
        <div className="mb-3">
          <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-1.5 uppercase font-semibold tracking-wider">
            <Compass className="h-3 w-3" /> Sugestões Rápidas:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => sendQuery(prompt.text)}
                className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors disabled:opacity-50"
              >
                <prompt.icon className="h-3 w-3" />
                <span>{prompt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite uma mensagem em inglês (ex: How was your day?)..."
            disabled={loading}
            className="flex-1 text-sm focus-visible:ring-purple-500"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5 shadow-sm"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Enviar</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

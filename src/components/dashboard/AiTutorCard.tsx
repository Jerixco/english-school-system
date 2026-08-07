'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bot, Send, Sparkles, User, RefreshCw, AlertCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'model'
  text: string
  isError?: boolean
}

export default function AiTutorCard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hi there! 👋 I'm Alex, your AI English Tutor. What would you like to talk about today?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    const updatedMessages = [...messages, { role: 'user' as const, text: userMessage }]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      const historyPayload = updatedMessages
        .filter((m) => !m.isError)
        .map((m) => ({
          role: m.role,
          parts: m.text,
        }))

      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: historyPayload.slice(0, -1),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao conectar com o serviço de IA.')
      }

      setMessages([...updatedMessages, { role: 'model', text: data.reply }])
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

  return (
    <Card className="border-purple-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-purple-200" />
            <div>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                Alex — AI English Tutor
                <Sparkles className="h-4 w-4 text-yellow-300 fill-yellow-300" />
              </CardTitle>
              <CardDescription className="text-purple-100 text-xs">
                Pratique sua conversação em inglês 24/7 com feedback instantâneo
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-purple-700 hover:text-white"
            onClick={() =>
              setMessages([
                {
                  role: 'model',
                  text: "Hi there! 👋 I'm Alex, your AI English Tutor. What would you like to talk about today?",
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
        <div className="h-64 overflow-y-auto space-y-3 pr-2 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-2 text-sm ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.isError
                      ? 'bg-red-100 text-red-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}
                >
                  {msg.isError ? <AlertCircle className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
              )}
              <div
                className={`p-3 rounded-lg max-w-[80%] whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : msg.isError
                    ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                }`}
              >
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 items-center text-xs text-gray-500">
              <Bot className="h-4 w-4 animate-bounce text-purple-600" />
              <span>Alex está digitando...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            placeholder="Type your message in English..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()} className="bg-purple-600 hover:bg-purple-700">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

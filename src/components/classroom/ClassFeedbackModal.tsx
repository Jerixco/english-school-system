'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star, CheckCircle, Heart, ThumbsUp, Sparkles, X } from 'lucide-react'

interface ClassFeedbackModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (feedback: { rating: number; tags: string[]; comment: string }) => void
  teacherName?: string
  sessionTitle: string
}

const FEEDBACK_TAGS = [
  '🎯 Didática Excelente',
  '🗣️ Foco em Conversação',
  '👂 Correção de Pronúncia',
  '⏱️ Pontual e Organizado',
  '💡 Explicação Clara',
  '✨ Aula Muito Divertida',
]

export default function ClassFeedbackModal({
  open,
  onClose,
  onSubmit,
  teacherName,
  sessionTitle,
}: ClassFeedbackModalProps) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!open) return null

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    onSubmit({ rating, tags: selectedTags, comment })
    setTimeout(() => {
      onClose()
      setSubmitted(false)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-outfit text-gray-900 mb-1">
              Obrigado pelo seu feedback!
            </h3>
            <p className="text-sm text-gray-500">
              Sua avaliação ajuda a aprimorar a qualidade das nossas aulas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-6">
              <div className="inline-flex p-2.5 rounded-full bg-purple-100 text-purple-600 mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-outfit text-gray-900">
                Como foi a sua aula?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {sessionTitle} {teacherName && `com ${teacherName}`}
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>

            {/* Quick Tags */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                O que você mais gostou?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {FEEDBACK_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        active
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                Comentário ou sugestão (opcional):
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte-nos como foi a experiência..."
                className="text-xs h-20 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Pular
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-sm"
              >
                Enviar Avaliação
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

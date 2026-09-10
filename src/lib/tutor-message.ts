import { createElement, type ReactNode } from 'react'

const BOLD_MARKDOWN_PATTERN = /(\*\*[^*\n]+?\*\*)/g

/**
 * Renderiza apenas o Markdown seguro usado nas respostas do tutor.
 * O texto permanece como conteúdo React, sem dangerouslySetInnerHTML.
 */
export function renderTutorMessage(text: string): ReactNode {
  return text.split(BOLD_MARKDOWN_PATTERN).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return createElement('strong', { key: index, className: 'font-semibold' }, part.slice(2, -2))
    }

    return part
  })
}

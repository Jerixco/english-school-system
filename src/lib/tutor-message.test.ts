import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { renderTutorMessage } from './tutor-message'

describe('renderTutorMessage', () => {
  it('converte marcadores de negrito em strong sem interpretar HTML', () => {
    const markup = renderToStaticMarkup(
      React.createElement(
        'div',
        null,
        renderTutorMessage('Pergunta: **Could you tell me about yourself?**')
      )
    )

    expect(markup).toContain('<strong class="font-semibold">Could you tell me about yourself?</strong>')
    expect(markup).not.toContain('**')
  })

  it('preserva marcadores incompletos como texto comum', () => {
    const markup = renderToStaticMarkup(
      React.createElement('div', null, renderTutorMessage('Texto **incompleto'))
    )

    expect(markup).toContain('Texto **incompleto')
  })
})

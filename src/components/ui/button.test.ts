import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renderiza asChild com um único elemento sem falhar no Radix Slot', () => {
    const markup = renderToStaticMarkup(
      React.createElement(
        Button,
        { asChild: true, className: 'test-button' },
        React.createElement('a', { href: '/aluno' }, 'Abrir portal')
      )
    )

    expect(markup).toContain('href="/aluno"')
    expect(markup).toContain('Abrir portal')
  })
})

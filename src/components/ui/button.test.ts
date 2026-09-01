import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renderiza asChild com um único elemento', () => {
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

  it('não derruba a renderização quando asChild recebe filhos múltiplos', () => {
    expect(() =>
      renderToStaticMarkup(
        React.createElement(
          Button,
          { asChild: true },
          React.createElement('a', { href: '/aluno' }, 'Abrir portal'),
          React.createElement('span', null, 'extra')
        )
      )
    ).not.toThrow()
  })
})

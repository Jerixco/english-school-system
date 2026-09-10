import { describe, expect, it } from 'vitest'
import { escapeHtml } from './email'

describe('escapeHtml', () => {
  it('escapes text and attribute delimiters before email rendering', () => {
    expect(escapeHtml(`<script>alert('x')</script> "quoted"`)).toBe(
      '&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt; &quot;quoted&quot;'
    )
  })
})

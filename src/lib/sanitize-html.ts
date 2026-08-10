import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitiza HTML rico (ex: conteúdo de blog) antes de armazenar/renderizar.
 * Remove <script>, handlers on*, javascript: URIs, etc. — bloqueia XSS armazenado
 * quando o resultado é usado em dangerouslySetInnerHTML.
 */
export function sanitizeRichHtml(dirty: string): string {
  if (!dirty) return ''
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'span', 'div',
      'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'figure', 'figcaption',
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt', 'width', 'height', 'class'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
  })
}

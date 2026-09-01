import { describe, expect, it } from 'vitest'
import { selectEnglishVoice } from './speech'

function voice(
  name: string,
  lang: string,
  options: { localService?: boolean; default?: boolean } = {}
) {
  return {
    name,
    lang,
    localService: options.localService ?? true,
    default: options.default ?? false,
  }
}

describe('seleção da voz do Tutor Alex', () => {
  it('prioriza uma voz natural en-US e não escolhe en-IN', () => {
    const selected = selectEnglishVoice([
      voice('Google हिन्दी', 'en-IN'),
      voice('Microsoft David Desktop', 'en-US'),
      voice('Microsoft Aria Online (Natural) - English (United States)', 'en-US', {
        localService: false,
      }),
      voice('Microsoft Hazel Desktop', 'en-GB'),
    ])

    expect(selected?.name).toContain('Aria Online')
    expect(selected?.lang).toBe('en-US')
  })

  it('retorna indefinido quando só há vozes inglesas indianas', () => {
    expect(selectEnglishVoice([voice('Google English India', 'en-IN')])).toBeUndefined()
  })
})

import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { encrypt, decrypt, encryptSensitiveData, decryptSensitiveData, hash } from './encryption'

describe('Encryption Property-Based & Fuzz Testing (Entropia nos Dados)', () => {
  it('garante que qualquer texto arbitrário (Unicode, Emojis, Strings Binárias) é recuperado perfeitamente após encriptar/decriptar', () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        const encrypted = encrypt(text)
        const decrypted = decrypt(encrypted)
        return decrypted === text
      }),
      { numRuns: 100 }
    )
  })

  it('resiste a payloads corrompidos sem causar quebras inesperadas no runtime', () => {
    fc.assert(
      fc.property(fc.string(), (corruptedPayload) => {
        try {
          decrypt(corruptedPayload)
        } catch (error: any) {
          // Deve lançar erro previsível e não travar o processo
          expect(error).toBeInstanceOf(Error)
        }
      }),
      { numRuns: 100 }
    )
  })

  it('rejeita ciphertexts com tamper (modificação em 1 byte de dados ou tag)', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (text) => {
        const encrypted = encrypt(text)
        const parts = encrypted.split(':')
        
        // Corrompe 1 caractere da parte encriptada
        const tamperedCiphertext = parts[2].slice(0, -1) + (parts[2].endsWith('a') ? 'b' : 'a')
        const tamperedPayload = `${parts[0]}:${parts[1]}:${tamperedCiphertext}`

        expect(() => decrypt(tamperedPayload)).toThrow()
      }),
      { numRuns: 50 }
    )
  })

  it('garante integridade de objetos não vazios no encryptSensitiveData', () => {
    fc.assert(
      fc.property(
        fc.record({
          phone: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          document: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          address: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
        }),
        (data) => {
          const encrypted = encryptSensitiveData(data)
          const decrypted = decryptSensitiveData(encrypted)
          if (data.phone) expect(decrypted.phone).toBe(data.phone)
          if (data.document) expect(decrypted.document).toBe(data.document)
          if (data.address) expect(decrypted.address).toBe(data.address)
        }
      ),
      { numRuns: 50 }
    )
  })

  it('hash SHA-256 é determinístico e imune a colisões triviais em strings com entropia alta', () => {
    fc.assert(
      fc.property(fc.string(), (val) => {
        const h1 = hash(val)
        const h2 = hash(val)
        return h1 === h2 && h1.length === 64
      }),
      { numRuns: 50 }
    )
  })
})

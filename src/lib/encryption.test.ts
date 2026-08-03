import { describe, it, expect } from 'vitest'
import { encrypt, decrypt, hash, encryptSensitiveData, decryptSensitiveData } from './encryption'

describe('Encryption Module (AES-256-GCM)', () => {
  it('should encrypt and decrypt string data correctly', () => {
    const secretText = 'Sensível 123456!'
    const encrypted = encrypt(secretText)
    expect(encrypted).not.toBe(secretText)
    expect(encrypted).toContain(':')
    
    const decrypted = decrypt(encrypted)
    expect(decrypted).toBe(secretText)
  })

  it('should generate consistent SHA256 hashes', () => {
    const input = 'my-password'
    const h1 = hash(input)
    const h2 = hash(input)
    expect(h1).toBe(h2)
    expect(h1.length).toBe(64)
  })

  it('should encrypt and decrypt sensitive data fields', () => {
    const sensitive = {
      phone: '+5511999999999',
      document: '123.456.789-00',
    }
    const encrypted = encryptSensitiveData(sensitive)
    expect(encrypted.phone).toBeDefined()
    expect(encrypted.phone).not.toBe(sensitive.phone)

    const decrypted = decryptSensitiveData(encrypted)
    expect(decrypted.phone).toBe(sensitive.phone)
    expect(decrypted.document).toBe(sensitive.document)
  })
})

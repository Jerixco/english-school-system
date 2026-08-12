import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'

function getSecretKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key || key.length < 32) {
    if (process.env.NODE_ENV === 'test') {
      return createHash('sha256').update('test-secret-key-32-characters-min').digest()
    }
    throw new Error('ENCRYPTION_KEY environment variable must be set and be at least 32 characters long.')
  }
  return createHash('sha256').update(key).digest()
}

export const encrypt = (text: string): string => {
  const iv = randomBytes(12)
  const key = getSecretKey()
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag().toString('hex')
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

export const decrypt = (encryptedData: string): string => {
  const parts = encryptedData.split(':')
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted payload format.')
  }
  
  const [ivHex, authTagHex, encryptedHex] = parts
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const key = getSecretKey()
  
  const decipher = createDecipheriv('aes-256-gcm', key, iv, { authTagLength: 16 })
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

export const hash = (data: string): string => {
  return createHash('sha256').update(data).digest('hex')
}

export const encryptSensitiveData = (data: {
  phone?: string
  document?: string
  address?: string
}): { phone?: string; document?: string; address?: string } => {
  const encrypted: { phone?: string; document?: string; address?: string } = {}
  
  if (data.phone) encrypted.phone = encrypt(data.phone)
  if (data.document) encrypted.document = encrypt(data.document)
  if (data.address) encrypted.address = encrypt(data.address)
  
  return encrypted
}

export const decryptSensitiveData = (data: {
  phone?: string
  document?: string
  address?: string
}): { phone?: string; document?: string; address?: string } => {
  const decrypted: { phone?: string; document?: string; address?: string } = {}
  
  if (data.phone) decrypted.phone = decrypt(data.phone)
  if (data.document) decrypted.document = decrypt(data.document)
  if (data.address) decrypted.address = decrypt(data.address)
  
  return decrypted
}

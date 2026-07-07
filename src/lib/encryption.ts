import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production'

export const encrypt = (data: string): string => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString()
}

export const decrypt = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export const hash = (data: string): string => {
  return CryptoJS.SHA256(data).toString()
}

// Encrypt sensitive fields before storing in database
export const encryptSensitiveData = (data: {
  phone?: string
  document?: string
  address?: string
}): { phone?: string; document?: string; address?: string } => {
  const encrypted: any = {}
  
  if (data.phone) encrypted.phone = encrypt(data.phone)
  if (data.document) encrypted.document = encrypt(data.document)
  if (data.address) encrypted.address = encrypt(data.address)
  
  return encrypted
}

// Decrypt sensitive fields when retrieving from database
export const decryptSensitiveData = (data: {
  phone?: string
  document?: string
  address?: string
}): { phone?: string; document?: string; address?: string } => {
  const decrypted: any = {}
  
  if (data.phone) decrypted.phone = decrypt(data.phone)
  if (data.document) decrypted.document = decrypt(data.document)
  if (data.address) decrypted.address = decrypt(data.address)
  
  return decrypted
}

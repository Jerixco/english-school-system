import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import { encrypt, decrypt } from '@/lib/encryption'

export const generateTwoFactorSecret = (email: string) => {
  return speakeasy.generateSecret({
    name: `English School (${email})`,
    issuer: 'English School',
    length: 32,
  })
}

export const generateQRCode = async (otpauthUrl: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(otpauthUrl)
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

export const verifyTwoFactorToken = (token: string, secret: string): boolean => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: token.replace(/\s/g, ''),
    window: 1,
  })
}

export const encryptTwoFactorSecret = (secret: string): string => {
  return encrypt(secret)
}

export const decryptTwoFactorSecret = (encryptedSecret: string): string => {
  return decrypt(encryptedSecret)
}

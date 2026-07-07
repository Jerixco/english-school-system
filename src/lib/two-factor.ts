import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

export const generateTwoFactorSecret = () => {
  const secret = speakeasy.generateSecret({
    name: 'English School',
    issuer: 'English School',
  })
  return secret
}

export const generateQRCode = async (secret: string): Promise<string> => {
  try {
    const qrCodeUrl = await QRCode.toDataURL(secret)
    return qrCodeUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

export const verifyTwoFactorToken = (token: string, secret: string): boolean => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2,
  })
}

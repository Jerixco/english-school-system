import { z } from 'zod'

const userIdSchema = z.string().uuid()

export const USER_ID_HEADER = 'x-user-id'

export const getRequestUserId = (req: Request): string => {
  const rawUserId = req.headers.get(USER_ID_HEADER)

  if (!rawUserId) {
    throw new Error('Missing X-User-Id header')
  }

  const parsed = userIdSchema.safeParse(rawUserId)

  if (!parsed.success) {
    throw new Error('Invalid X-User-Id header')
  }

  return parsed.data
}

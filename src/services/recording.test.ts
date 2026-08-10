import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RecordingService } from './recording.service'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    recording: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    student: {
      findUnique: vi.fn(),
    },
  },
}))

describe('RecordingService', () => {
  let recordingService: RecordingService

  beforeEach(() => {
    recordingService = new RecordingService()
    vi.clearAllMocks()
  })

  it('should calculate correct retention days per student plan', () => {
    expect(recordingService.getRetentionDaysForPlan('BASIC')).toBe(7)
    expect(recordingService.getRetentionDaysForPlan('STANDARD')).toBe(30)
    expect(recordingService.getRetentionDaysForPlan('PREMIUM')).toBe(90)
    expect(recordingService.getRetentionDaysForPlan('CUSTOM')).toBe(180)
    expect(recordingService.getRetentionDaysForPlan(undefined)).toBe(30)
  })

  it('should strictly query only non-expired recordings with expiresAt > now', async () => {
    const mockRecordings = [
      {
        id: 'rec-1',
        title: 'Business English Class',
        description: 'Negotiation practice',
        videoUrl: 'https://video.mp4',
        thumbnailUrl: null,
        durationMinutes: 45,
        recordedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        teacher: { id: 'teacher-1', user: { name: 'Alex', image: null } },
        student: null,
      },
    ]

    vi.mocked(prisma.recording.findMany).mockResolvedValue(mockRecordings as any)

    const result = await recordingService.listActiveRecordings('admin-user-id', 'ADMIN')

    expect(prisma.recording.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          expiresAt: expect.objectContaining({
            gt: expect.any(Date),
          }),
        }),
      })
    )

    expect(result).toHaveLength(1)
    expect(result[0].daysRemaining).toBe(25)
    expect(result[0].isExpiringSoon).toBe(false)
  })
})

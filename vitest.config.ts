import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    env: {
      NEXTAUTH_SECRET: 'test-secret-key-must-be-32-chars-min',
      ENCRYPTION_KEY: 'test-encryption-key-32-characters',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/english_school?sslmode=disable',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'test_secret_for_unit_tests_only_32_chars'
process.env.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'test_encryption_key_for_testing_32_ch'
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/english_school?sslmode=disable'
;(process.env as any).NODE_ENV = 'test'

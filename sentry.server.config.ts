import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN || 'https://b7d159c15bc8eb3c9d88b6d2bf69d65e@o4511784977498112.ingest.us.sentry.io/4511848513404928',
  tracesSampleRate: 1.0,
  debug: false,
})

'use client'

import 'swagger-ui-react/swagger-ui.css'
import SwaggerUI from 'swagger-ui-react'

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-white p-4">
      <SwaggerUI url="/openapi.json" />
    </main>
  )
}

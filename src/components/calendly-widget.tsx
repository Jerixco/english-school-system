'use client'

import { useEffect, useRef } from 'react'

export default function CalendlyWidget() {
  const calendlyContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    // Cleanup
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div 
      ref={calendlyContainer}
      className="calendly-inline-widget"
      data-url="https://calendly.com/your-username/consultation"
      style={{ minWidth: '320px', height: '700px' }}
    />
  )
}

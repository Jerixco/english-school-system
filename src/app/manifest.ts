import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'English School',
    short_name: 'English School',
    description: 'Aprenda inglês com professores nativos',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#667eea',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

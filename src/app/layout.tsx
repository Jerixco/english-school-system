import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import Providers from '@/components/providers'
import CookieConsentBanner from '@/components/CookieConsentBanner'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-outfit',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'English School - Aprenda Inglês com Professores Nativos',
  description: 'Escola de inglês online com professores nativos. Aulas personalizadas, metodologia comprovada e resultados garantidos.',
  keywords: 'inglês, escola de inglês, aulas de inglês, professores nativos, inglês online, curso de inglês, aprender inglês',
  authors: [{ name: 'English School' }],
  creator: 'English School',
  publisher: 'English School',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    title: 'English School - Aprenda Inglês com Professores Nativos',
    description: 'Escola de inglês online com professores nativos. Aulas personalizadas, metodologia comprovada e resultados garantidos.',
    siteName: 'English School',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'English School - Aprenda Inglês',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'English School - Aprenda Inglês com Professores Nativos',
    description: 'Escola de inglês online com professores nativos. Aulas personalizadas, metodologia comprovada e resultados garantidos.',
    images: ['/og-image.jpg'],
    creator: '@englishschool',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nonce = (await headers()).get('x-nonce') ?? undefined

  return (
    <html lang="pt-BR" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              nonce={nonce}
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              nonce={nonce}
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
              `,
            }}
          />
        )}
      </head>
      <body className="font-inter antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-amber-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md">
          Pular para conteúdo
        </a>
        <Providers>
          {children}
          <CookieConsentBanner />
        </Providers>
      </body>
    </html>
  )
}

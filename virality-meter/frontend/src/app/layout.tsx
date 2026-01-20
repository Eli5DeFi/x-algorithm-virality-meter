import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'X Algorithm Virality Meter',
  description: 'Analyze your content\'s viral potential using X\'s actual algorithm signals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Puter.js for free Grok API */}
        <Script src="https://js.puter.com/v2/" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.className} bg-x-black text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
}

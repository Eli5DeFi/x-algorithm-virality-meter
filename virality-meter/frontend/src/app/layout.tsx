import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
      <head />
      <body className={`${inter.className} bg-x-black text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'

const firaCode = localFont({
  src: [
    {
      path: '../components/font/FiraCode-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../components/font/FiraCode-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-fira-code',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Advanced Image Steganography',
  description: 'Professional steganography tool for encoding and decoding hidden data in images with AES-256 encryption',
  keywords: ['steganography', 'encryption', 'image', 'security', 'AES-256'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${firaCode.variable} font-mono antialiased`} suppressHydrationWarning>
        <ThemeProvider
          defaultTheme="light"
          storageKey="steganography-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

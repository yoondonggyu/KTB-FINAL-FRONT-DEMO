import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Devths - Landing Page',
  description: 'Devths 랜딩 페이지',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}



import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OnlyCNCs',
  description: 'OnlyCNCs is a platform that allows you to find the best CNC machines for your needs.',
  keywords: ['CNC', 'Machines', 'Tools', 'DIY', 'Hobby', 'Projects'],
  authors: [{ name: 'James Dean Designs Limited', url: 'https://jamesdeandesigns.com' }],
  creator: 'James Dean Designs Limited',
  publisher: 'James Dean Designs Limited',
  icons: {
    icon: [
      {
        url: "/only-cnc.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
      {
        url: "/favicon.ico",
        sizes: "16x16",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "/only-cnc.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  },
 
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body className={inter.className}>{children}</body>
    </html>
  )
}

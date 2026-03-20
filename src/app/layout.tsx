import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nishit Rao — Senior SRE & DevOps Engineer',
  description: 'DevOps Engineer III at Swiggy. Building resilient, automated infrastructure across Kubernetes, AWS, and Confluent Kafka.',
  openGraph: {
    title: 'Nishit Rao — Senior SRE & DevOps Engineer',
    description: 'I build infra that doesn\'t page you at 3am.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

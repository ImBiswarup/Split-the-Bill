import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { AppProvider } from '@/context/AppContext'
import { Providers } from '@/components/providers'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata = {
  title: 'MoneySplit - Smart Expense Management',
  description: 'The smartest way to split expenses with friends, family, and roommates. Track group expenses, settle up instantly, and maintain perfect financial harmony.',
  keywords: 'expense tracker, split bills, group expenses, money management, shared costs',
  authors: [{ name: 'MoneySplit Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
  openGraph: {
    title: 'MoneySplit - Smart Expense Management',
    description: 'The smartest way to split expenses with friends, family, and roommates.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <AppProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
          </AppProvider>
        </Providers>
      </body>
    </html>
  )
}

"use client"
import './globals.css'
import 'bootstrap-material-design/dist/css/bootstrap-material-design.min.css' // Importing Bootstrap Material Design CSS
import TopNav from '@/components/TopNav'
import { SessionProvider } from 'next-auth/react'
import { SearchProvider } from '@/context/search'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <SearchProvider>
            <TopNav />
            {children}
          </SearchProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

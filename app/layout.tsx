import Navbar from '@/components/navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Archivo } from 'next/font/google'

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
})

export const metadata: Metadata = {
  title: 'pamela maldonado vallejos',
  description: 'Portfolio of pamela maldonado vallejos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${archivo.className} background-color`}>
        <div className='flex flex-col'>
          <Navbar />
          <div className='sm:max-w-3xl sm:m-auto mx-2 object-center'>{children}</div>
        </div>
      </body>
    </html>
  )
}

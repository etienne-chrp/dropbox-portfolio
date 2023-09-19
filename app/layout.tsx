import Navbar from '@/components/navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Crimson_Text } from 'next/font/google'

const crimson = Crimson_Text({
  subsets: ['latin'],
  weight: '400',
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
      <body className={`${crimson.className} background-color`}>
        <div className='flex flex-col'>
          <Navbar />
          <div className='sm:max-w-3xl w-full self-center px-2 object-center'>{children}</div>
        </div>
      </body>
    </html>
  )
}

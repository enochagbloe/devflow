import Navbar from '@/components/navigation/nav/nav'
import { ReactNode } from 'react'

const RootLayout = ({children}: {children: ReactNode}) => {
  return (
    <main>
        <Navbar />
        {children}
    </main>
  )
}

export default RootLayout
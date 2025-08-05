'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
// Import only the navigation parts from RootLayout

export default function ClientNavigation() {
  const pathname = usePathname()
  const [logoHovered, setLogoHovered] = useState(false)
  
  // Move the navigation logic here
  return (
    <div>
      {/* Add your navigation content here */}
    </div>
  )
} 
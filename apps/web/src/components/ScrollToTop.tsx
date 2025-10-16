'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function ScrollToTop() {
  const pathname = usePathname()
  const prevPathnameRef = useRef(pathname)

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      prevPathnameRef.current = pathname
    }
  }, [pathname])

  return null
}

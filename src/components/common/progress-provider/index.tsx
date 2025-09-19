/* eslint-disable simple-import-sort/imports */
'use client'
import { useEffect, useRef } from 'react'
import nProgress from 'nprogress'
import { usePathname, useSearchParams } from 'next/navigation'
import 'nprogress/nprogress.css'
import './style.css'

export const NProgressProvider = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const prevPath = useRef<string | null>(null)

  useEffect(() => {
    const currentPath = pathname + '?' + searchParams.toString()

    if (prevPath.current !== null && prevPath.current !== currentPath) {
      nProgress.start()
    }

    prevPath.current = currentPath

    const timeout = setTimeout(() => {
      nProgress.done()
    }, 500)

    return () => clearTimeout(timeout)
  }, [pathname, searchParams])

  return null
}

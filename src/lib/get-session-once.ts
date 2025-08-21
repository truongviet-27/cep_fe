import type { Session } from 'next-auth'
import { getSession } from 'next-auth/react'

let pending: Promise<Session | null> | null = null
export async function getSessionOnce() {
  if (!pending) {
    pending = getSession().finally(() => {
      pending = null
    })
  }
  return pending
}

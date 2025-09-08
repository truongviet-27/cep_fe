/* eslint-disable */
import { jwtDecode } from 'jwt-decode'
import { ROLE_ADMIN } from '@utility/instances'

interface CepData {
  id: string
  [key: string]: any
}

type JWTPayload = {
  organization?: Record<string, CepData>
  realm_access: { roles: string[] }
  [key: string]: unknown
}

function stripBearer(token: string): string {
  return token.startsWith('Bearer ') ? token.slice(7) : token
}

export function getOrgFromToken(
  rawToken: string | null | undefined,
): { id: string; name: string } | null {
  if (!rawToken) {
    return null
  }

  try {
    const token = stripBearer(rawToken)
    const payload = jwtDecode<JWTPayload>(token)

    const organization = payload.organization
    if (
      !organization ||
      typeof organization !== 'object' ||
      Object.keys(organization).length === 0
    ) {
      return null
    }

    const firstKey = Object.keys(organization)[0]

    return { id: organization[firstKey]?.id, name: firstKey }
  } catch (error) {
    console.error('Failed to decode or process JWT:', error)
    return null
  }
}

export function isSupperAdmin(rawToken: string | null | undefined): boolean {
  if (!rawToken) {
    return false
  }

  try {
    const token = stripBearer(rawToken)
    const payload = jwtDecode<JWTPayload>(token)
    return payload.realm_access.roles.some(
      (role: string) => role === ROLE_ADMIN,
    )
  } catch (error) {
    console.error('Failed to decode or process JWT:', error)
    return false
  }
}

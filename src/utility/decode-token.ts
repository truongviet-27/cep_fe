import { jwtDecode } from 'jwt-decode'

type JWTPayload = {
  organization?: {
    cep?: { id?: string }
  }
  [key: string]: unknown
}

function stripBearer(token: string): string {
  return token.startsWith('Bearer ') ? token.slice(7) : token
}

export function getCepIdFromToken(
  rawToken: string | null | undefined,
): string | null {
  try {
    if (!rawToken) return null
    const token = stripBearer(rawToken)
    const payload = jwtDecode<JWTPayload>(token)
    return payload.organization?.cep?.id ?? null
  } catch {
    return null
  }
}

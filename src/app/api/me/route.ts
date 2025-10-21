import { dataProvider } from '@providers/data-provider'
import { getOrgFromToken } from '@utility/decode-token'
import { getServerSession } from 'next-auth'

import authOptions from '../auth/[...nextauth]/options'

type HeaderType = {
  Authorization: string
  'x-tenant-id'?: string
}

export async function POST(req: Request) {
  try {
    const { token, tenantId: clientTenantId } = await req.json()
    let accessToken = token
    if (!accessToken) {
      const session = await getServerSession(authOptions)

      if (!session?.accessToken) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
        })
      }

      accessToken = session.accessToken
    }

    const cepId = getOrgFromToken(accessToken)?.id

    const xTenant = (cepId || clientTenantId) as string | undefined

    const headers: HeaderType = {
      Authorization: `Bearer ${accessToken}`,
      ...(xTenant ? { 'x-tenant-id': xTenant } : {}),
    }

    const [permission, parameterSettings] = await Promise.all([
      callMe(headers),
      getParameterSettings(headers),
    ])

    return Response.json({ permission, parameterSettings })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

const callMe = async (headers: HeaderType) => {
  try {
    const apiUrl = dataProvider.getApiUrl()
    const response = await dataProvider.custom({
      url: `${apiUrl}/me`,
      method: 'get',
      headers,
    })

    if (!response) throw new Error('No response')

    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getParameterSettings = async (headers: HeaderType) => {
  try {
    const apiUrl = dataProvider.getApiUrl()
    const { data } = await dataProvider.custom({
      url: `${apiUrl}/parameter-settings`,
      method: 'get',
      headers,
    })

    if (!data) throw new Error('No response')

    return data.items
  } catch (error) {
    console.error(error)

    throw error
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

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

    const xTenant = (clientTenantId || cepId) as string | undefined

    const headers: HeaderType = {
      Authorization: `Bearer ${accessToken}`,
      ...(xTenant ? { 'x-tenant-id': xTenant } : {}),
    }

    const permission = await callMe(headers)
    const parameterSettings = await getParameterSettings(headers)

    return Response.json({ permission, parameterSettings })
  } catch (error: any) {
    console.error(error)
    const statusCode = error.statusCode || 500
    const message = error.message || 'Internal Server Error'
    return Response.json({ error: message }, { status: statusCode })
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

    if (!response) {
      const error: any = new Error('No response from /me')
      error.statusCode = 500
      throw error
    }

    return response.data
  } catch (error: any) {
    console.log(error)
    const apiError: any = new Error(error.message || 'Failed to call /me')
    apiError.statusCode = error.statusCode || error.response?.status || 500
    throw apiError
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

    if (!data) {
      const error: any = new Error('No response from /parameter-settings')
      error.statusCode = 500
      throw error
    }

    return data.items
  } catch (error: any) {
    const statusCode = error.statusCode || error.response?.status || 500

    // Nếu lỗi 403, không throw error mà return mảng rỗng
    if (statusCode === 403) {
      console.log('403 Forbidden on /parameter-settings, returning empty array')
      return []
    }

    console.error(error)
    const apiError: any = new Error(
      error.message || 'Failed to call /parameter-settings',
    )
    apiError.statusCode = statusCode
    throw apiError
  }
}

'use client'

import { useOne, useTranslate } from '@refinedev/core'
import type { Customer } from '@sdk/hey-api/types.gen'
import { useParams } from 'next/navigation'

export const useCustomerShow = () => {
  const t = useTranslate()
  const { id } = useParams()

  const { data, isLoading, isError } = useOne<Customer>({
    resource: 'customers',
    id: id as string,
  })

  return {
    t,
    id: id as string,
    record: data?.data,
    isLoading,
    isError,
  }
}

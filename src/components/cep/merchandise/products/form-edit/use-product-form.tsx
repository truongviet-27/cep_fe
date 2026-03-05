/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProductPackagingInputType } from '@interfaces/products'
import { useForm } from '@refinedev/antd'
import {
  useApiUrl,
  useCustom,
  useCustomMutation,
  useGo,
  useParsed,
  useTranslate,
} from '@refinedev/core'
import type {
  DraftControllerIndexResponse,
  ProductDetail,
  StoreProductInput,
} from '@sdk/hey-api'
import { message } from 'antd'

export type ProductFormType = {
  unit: string
  category: string
  name_lk?: string
  category_level_1?: number
  category_level_2?: number
  category_level_3?: number
  author?: {
    id?: number
    name?: string
  }
  editor?: {
    id?: number
    name?: string
  }
  created_at?: string
  updated_at?: string
  image_file_url?: string
  image_file_key?: string
  image_name?: string
} & StoreProductInput

function useProductForm() {
  const { params } = useParsed()
  const go = useGo()
  const apiUrl = useApiUrl()
  const t = useTranslate()

  const { mutate: mutateDraft, isPending: isPendingDraft } = useCustomMutation()

  const { data: dataProductDraft, isFetching: isFetchingProductDraft } =
    useCustom<DraftControllerIndexResponse>({
      method: 'get',
      url: `${apiUrl}/drafts`,
      config: {
        query: {
          type: 'product',
        },
      },
      queryOptions: {
        enabled: !params?.id, // Only fetch draft when creating new product
      },
    })

  const methods = useForm<ProductFormType>({
    resource: 'products',
    id: params?.id,
    redirect: false,
    onMutationSuccess: () => {
      if (params?.id) {
        go({ to: { resource: 'products', action: 'show', id: params.id } })
      } else {
        go({ to: { resource: 'products', action: 'list' } })
      }
    },
    queryOptions: {
      select: (response) => {
        const data = response.data as unknown as ProductDetail
        const packagings = data?.packagings || []

        return {
          data: {
            ...data,
            category: data?.category?.category_path,
            category_id: data?.category?.id,
            unit: data?.unit?.name,
            unit_id: data?.unit?.id,
            packagings: packagings.map((packaging) => {
              return {
                ...packaging,
                cost_price: data.cost_price || 0,
              }
            }),
          } as unknown as ProductFormType,
        }
      },
    },
  })

  const handleOnSubmit = (values: ProductFormType) => {
    const packagings = (values?.packagings || []).map(
      (packaging: ProductPackagingInputType) => {
        return {
          ...packaging,
        }
      },
    )

    const valuesConverted = {
      ...values,
      packagings,
    }

    methods.onFinish(valuesConverted)
  }

  const handleSaveDraft = () => {
    const values: any = methods.form.getFieldsValue()

    const packagings = (values?.packagings || []).map(
      (packaging: ProductPackagingInputType) => {
        return {
          ...packaging,
        }
      },
    )

    const payload = {
      ...values,
      packagings,
    }

    mutateDraft(
      {
        url: `${apiUrl}/drafts`,
        method: 'put',
        values: {
          type: 'product',
          payload,
        },
      },
      {
        onSuccess() {
          message.success(t('notifications.draftSaveSuccess'))
          go({ to: { resource: 'products', action: 'list' } })
        },
        onError(error: any) {
          message.error(
            error?.response?.data?.message || t('notifications.draftSaveError'),
          )
        },
      },
    )
  }

  const handleApplyDraft = () => {
    if (
      !dataProductDraft?.data ||
      !Array.isArray(dataProductDraft.data) ||
      dataProductDraft.data.length === 0
    ) {
      return
    }

    const draft: any = dataProductDraft.data[0]
    const draftPayload = draft.payload || draft

    methods.form.setFieldsValue({
      ...draftPayload,
    })

    message.success(t('notifications.draftApplySuccess'))
  }

  return [
    {
      methods,
      isLoadingSubmit: methods.saveButtonProps.loading,
      isUpdateMode: !!params?.id,
      isPendingDraft,
      dataProductDraft,
      isFetchingProductDraft,
    },
    { handleOnSubmit, handleSaveDraft, handleApplyDraft },
  ] as const
}

export default useProductForm

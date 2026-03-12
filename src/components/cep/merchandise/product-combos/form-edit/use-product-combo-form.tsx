/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProductPackagingInputType } from '@interfaces/products'
import { useForm } from '@refinedev/antd'
import {
  useApiUrl,
  useCustom,
  useCustomMutation,
  useGo,
  useNotification,
  useParsed,
  useTranslate,
} from '@refinedev/core'
import type {
  DraftControllerIndexResponse,
  ProductDetail,
  StoreProductInput,
} from '@sdk/hey-api'

export type ProductComboFormType = {
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
  products?: [
    {
      id: string
      code: string
      name: string
      unit_name: string
      quantity: number
      cost_price: number
      selling_price: number
    },
  ]
  image_file_url?: string
  image_file_key?: string
  image_name?: string
} & StoreProductInput

function useProductComboForm() {
  const { params } = useParsed()
  const go = useGo()
  const apiUrl = useApiUrl()
  const t = useTranslate()
  const { open: openNotification } = useNotification()
  const { mutate: mutateDraft, isPending: isPendingDraft } = useCustomMutation()

  const {
    data: dataProductComboDraft,
    isFetching: isFetchingProductComboDraft,
  } = useCustom<DraftControllerIndexResponse>({
    method: 'get',
    url: `${apiUrl}/drafts`,
    config: {
      query: {
        type: 'product_combo',
      },
    },
    queryOptions: {
      enabled: !params?.id, // Only fetch draft when creating new product combo
    },
  })

  const methods = useForm<ProductComboFormType>({
    resource: 'product-combos',
    id: params?.id,
    redirect: false,
    mutationMode: 'pessimistic',
    onMutationSuccess: () => {
      go({ to: '/products?tab=combo' })
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
          } as unknown as ProductComboFormType,
        }
      },
    },
  })

  const handleOnSubmit = (values: ProductComboFormType) => {
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
          type: 'product_combo',
          payload,
        },
      },
      {
        onSuccess() {
          openNotification?.({
            message: t('notifications.draftSaveSuccess'),
            description: t('notifications.draftSaveSuccess'),
            type: 'success',
          })
          go({ to: '/products?tab=combo' })
        },
        onError(error: any) {
          openNotification?.({
            message:
              error?.response?.data?.message ||
              t('notifications.draftSaveError'),
            description:
              error?.response?.data?.message ||
              t('notifications.draftSaveError'),
            type: 'error',
          })
        },
      },
    )
  }

  const handleApplyDraft = () => {
    if (
      !dataProductComboDraft?.data ||
      !Array.isArray(dataProductComboDraft.data) ||
      dataProductComboDraft.data.length === 0
    ) {
      return
    }

    const draft: any = dataProductComboDraft.data[0]
    const draftPayload = draft.payload || draft

    methods.form.setFieldsValue({
      ...draftPayload,
    })

    openNotification?.({
      message: t('notifications.draftApplySuccess'),
      description: t('notifications.draftApplySuccess'),
      type: 'success',
    })
  }

  return [
    {
      methods,
      isLoadingSubmit: methods.saveButtonProps.loading,
      isUpdateMode: !!params?.id,
      isPendingDraft,
      dataProductComboDraft,
      isFetchingProductComboDraft,
    },
    { handleOnSubmit, handleSaveDraft, handleApplyDraft },
  ] as const
}

export default useProductComboForm

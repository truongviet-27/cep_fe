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
import { useRef, useState } from 'react'

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
  const { open: openNotification } = useNotification()
  const { mutate: mutateDraft, isPending: isPendingDraft } = useCustomMutation()
  const saveDraftLockRef = useRef(false)
  const applyDraftLockRef = useRef(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isApplyingDraft, setIsApplyingDraft] = useState(false)
  const [isDraftAppliedOnce, setIsDraftAppliedOnce] = useState(false)
  const [isRedirectingAfterDraftSave, setIsRedirectingAfterDraftSave] =
    useState(false)

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
      go({ to: '/products' })
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

  useEffect(() => {
    if (!params?.id) {
      methods.form.resetFields()
      methods.form.setFieldsValue({
        code: undefined,
        packagings: [],
      } as Partial<ProductFormType>)
    }
  }, [methods.form, params?.id])

  const normalizePackagings = (values: ProductFormType) => {
    const packagings = values?.packagings || []

    if (!packagings.length) {
      return [
        {
          code: values.code,
          name: 'ピース',
          quantity_in_package: 1,
          unit_id: values.unit_id,
          selling_price: values.selling_price,
          is_standard_price: true,
          is_active: true,
          barcode: values.barcode,
        },
      ]
    }

    return packagings.map((packaging: ProductPackagingInputType, index) => ({
      ...packaging,
      code: index ? `${values.code}-${index}` : values.code,
      name: index === 0 ? (packaging?.name ?? 'ピース') : packaging?.name,
      quantity_in_package: index === 0 ? 1 : packaging?.quantity_in_package,
      unit_id: values.unit_id,
      barcode: index === 0 ? values.barcode : packaging?.barcode,
      selling_price:
        index === 0
          ? values.selling_price
          : packaging?.is_standard_price
            ? Number(values.selling_price || 0) *
              Number(packaging?.quantity_in_package || 1)
            : packaging?.selling_price,
    }))
  }

  const handleOnSubmit = (values: ProductFormType) => {
    const packagings = normalizePackagings(values)

    const valuesConverted = {
      ...values,
      packagings,
    }

    methods.onFinish(valuesConverted)
  }

  const handleSaveDraft = () => {
    if (saveDraftLockRef.current || isRedirectingAfterDraftSave) return
    saveDraftLockRef.current = true
    setIsSavingDraft(true)

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

    try {
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
            setIsRedirectingAfterDraftSave(true)
            openNotification?.({
              message: t('notifications.draftSaveSuccess'),
              description: t('notifications.draftSaveSuccess'),
              type: 'success',
            })
            go({ to: { resource: 'products', action: 'list' } })
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
            saveDraftLockRef.current = false
            setIsSavingDraft(false)
          },
        },
      )
    } catch (error) {
      saveDraftLockRef.current = false
      setIsSavingDraft(false)
      throw error
    }
  }

  const handleApplyDraft = () => {
    if (applyDraftLockRef.current || isDraftAppliedOnce) return
    applyDraftLockRef.current = true
    setIsApplyingDraft(true)
    let appliedSuccessfully = false

    if (
      !dataProductDraft?.data ||
      !Array.isArray(dataProductDraft.data) ||
      dataProductDraft.data.length === 0
    ) {
      applyDraftLockRef.current = false
      setIsApplyingDraft(false)
      return
    }

    try {
      const draft: any = dataProductDraft.data[0]
      const draftPayload = draft.payload || draft

      methods.form.setFieldsValue({
        ...draftPayload,
      })

      openNotification?.({
        message: t('notifications.draftApplySuccess'),
        description: t('notifications.draftApplySuccess'),
        type: 'success',
      })
      setIsDraftAppliedOnce(true)
      appliedSuccessfully = true
    } finally {
      if (appliedSuccessfully) {
        setIsApplyingDraft(false)
        return
      }
      applyDraftLockRef.current = false
      setIsApplyingDraft(false)
    }
  }

  return [
    {
      methods,
      isLoadingSubmit: methods.saveButtonProps.loading,
      isUpdateMode: !!params?.id,
      isPendingDraft,
      isSavingDraft,
      isApplyingDraft,
      isDraftAppliedOnce,
      isRedirectingAfterDraftSave,
      dataProductDraft,
      isFetchingProductDraft,
    },
    { handleOnSubmit, handleSaveDraft, handleApplyDraft },
  ] as const
}

export default useProductForm

/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  QuotaTemplateFormType,
  QuoteTemplateDetailType,
} from '@interfaces/quota-templates'
import { useForm } from '@refinedev/antd'
import type { GetOneResponse } from '@refinedev/core'
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
  QuotaFormSettingResponse,
  RoundingMethodEnumType,
} from '@sdk/hey-api'
import { RoundingMethodEnumType as RoundingMethodEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { useEffect, useRef, useState } from 'react'

export function useController() {
  const t = useTranslate()
  const { params } = useParsed()
  const isUpdateMode = !!params?.id
  const go = useGo()
  const apiUrl = useApiUrl()
  const [taxRoundingMethod, setTaxRoundingMethod] =
    useState<RoundingMethodEnumType>(RoundingMethodEnum.ROUND_UP)
  const permission = useUserStore((state) => state.permission)
  const { open: openNotification } = useNotification()
  const { mutate: mutateDraft, isPending: isPendingDraft } = useCustomMutation()
  const saveDraftLockRef = useRef(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isRedirectingAfterDraftSave, setIsRedirectingAfterDraftSave] =
    useState(false)

  const {
    data: dataQuotaTemplateDraft,
    isFetching: isFetchingQuotaTemplateDraft,
  } = useCustom<DraftControllerIndexResponse>({
    method: 'get',
    url: `${apiUrl}/drafts`,
    config: {
      query: {
        type: 'quota_template',
      },
    },
    queryOptions: {
      enabled: !isUpdateMode, // Only fetch draft when creating new
    },
  })

  const methods = useForm<QuotaTemplateFormType>({
    resource: 'quota-templates',
    redirect: 'show',
    queryOptions: {
      select: (data) => {
        const detail = data.data as QuoteTemplateDetailType
        const tags = (detail?.tags ?? []) as unknown as { id: number }[]
        const defaultOptionalProduct = [
          {
            name: '',
            kind: 'group',
            quantity: 1,
          },
          {
            product_id: null,
            package_id: null,
            name: '',
            code: '',
            cost_price: 0,
            selling_price: 0,
            quantity: 0,
            tax_rate: 0,
            profit_margin: 0,
            is_add_total: true,
            kind: 'product',
          },
        ]

        if (
          !permission?.is_module_admin &&
          permission?.user?.id != detail.author?.id
        ) {
          go({
            to: '/403',
          })
        }

        const finalOptionalProduct =
          detail.optional_product && detail.optional_product.length > 0
            ? detail.optional_product
            : defaultOptionalProduct

        return {
          ...data,
          data: {
            ...detail,
            optional_product: finalOptionalProduct,
            tags_response: tags,
            tags: tags.map(({ id }) => id),
          },
        } as unknown as GetOneResponse<QuotaTemplateFormType>
      },
    },
  })

  const { form, query } = methods

  const { data } = useCustom<QuotaFormSettingResponse>({
    method: 'get',
    url: `${apiUrl}/quota-form-settings`,
  })

  useEffect(() => {
    // neu update thi lay setting cua template
    if (isUpdateMode && form) {
      // neu khong thi lay setting cua tenant setting
      setTaxRoundingMethod(form.getFieldValue('tax_rounding_method'))
    } else if (data?.data) {
      setTaxRoundingMethod(data.data.tax_rounding_method)
    }
  }, [data?.data, isUpdateMode, form])
  useEffect(() => {
    if (!isUpdateMode && data?.data) {
      form.setFieldsValue({
        title: '',
        type: 'normal',
        category: 'merchandise',
        customer: null,
        status: 'waiting_approve',
        created_at: null,
        delivery_date: null,
        delivery_method: data?.data.default_delivery_method,
        payment_due_date: data?.data.default_payment_due_date,
        expiration_date: data?.data.default_expiration_date,
        consumption_tax: data?.data.consumption_tax ?? '0',
        customer_term: 'short_term',
        tax_rate: data?.data.tax_rate,
        tax_rounding_method: taxRoundingMethod,
        tax_rate_group: {},
        note: null,
        tags: [],
        total_cost: 0,
        consumption_tax_amount: 0,
        total_profit_margin: 0,
        total_price_tax_included: 0,
        main_product: [
          {
            name: '',
            kind: 'group',
            quantity: 1,
          },
          {
            product_id: null,
            package_id: null,
            isSelfCreate: false,
            name: '',
            code: '',
            cost_price: 0,
            quantity: 0,
            tax_rate: 0,
            selling_price: 0,
            profit_margin: 0,
            is_add_total: true,
            kind: 'product',
          },
        ],
        optional_product: [
          {
            name: '',
            kind: 'group',
            quantity: 1,
          },
          {
            product_id: null,
            package_id: null,
            isSelfCreate: false,
            name: '',
            code: '',
            cost_price: 0,
            selling_price: 0,
            quantity: 0,
            tax_rate: 0,
            profit_margin: 0,
            is_add_total: true,
            kind: 'product',
          },
        ],
      })
    }
  }, [data, taxRoundingMethod])

  const handleSaveDraft = () => {
    if (saveDraftLockRef.current || isRedirectingAfterDraftSave) return
    saveDraftLockRef.current = true
    setIsSavingDraft(true)

    const values: any = form.getFieldsValue()

    const payload = {
      ...values,
      tags: values?.tags || [],
    }

    try {
      mutateDraft(
        {
          url: `${apiUrl}/drafts`,
          method: 'put',
          values: {
            type: 'quota_template',
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
            go({ to: '/quota-templates' })
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
    if (
      !dataQuotaTemplateDraft?.data ||
      !Array.isArray(dataQuotaTemplateDraft.data) ||
      dataQuotaTemplateDraft.data.length === 0
    ) {
      return
    }

    const draft: any = dataQuotaTemplateDraft.data[0]
    const draftPayload = draft.payload || draft
    form.setFieldsValue({
      ...draftPayload,
      payment_due_date: draftPayload?.payment_due_date,
      expiration_date: draftPayload?.expiration_date,
    })
    openNotification?.({
      message: t('notifications.draftApplySuccess'),
      description: t('notifications.draftApplySuccess'),
      type: 'success',
    })
  }

  return {
    isUpdateMode,
    methods,
    isLoading: isUpdateMode && (query?.isLoading || query?.isFetching),
    handleSaveDraft,
    handleApplyDraft,
    isPendingDraft,
    isSavingDraft,
    isRedirectingAfterDraftSave,
    dataQuotaTemplateDraft,
    isFetchingQuotaTemplateDraft,
  }
}

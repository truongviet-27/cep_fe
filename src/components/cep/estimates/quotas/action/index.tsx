/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { RightOutlined } from '@ant-design/icons'
import DetailInfo from '@components/cep/estimates/quotas/action/components/detail-info'
import History from '@components/cep/estimates/quotas/action/components/history'
import Note from '@components/cep/estimates/quotas/action/components/note'
import OptionalInfo from '@components/cep/estimates/quotas/action/components/optional-info'
import Tags from '@components/cep/estimates/quotas/action/components/tags'
import { QuotaStatus } from '@components/cep/estimates/quotas/enum'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import type { QuoteTemplateDetailType } from '@interfaces/quota-templates'
import { usePdfViewerLayoutPlugin } from '@hooks/usePdfViewerLayout'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { useForm } from '@refinedev/antd'
import type { CrudFilter } from '@refinedev/core'
import {
  useApiUrl,
  useCustom,
  useCustomMutation,
  useGo,
  useNotification,
  useParsed,
  useResource,
  useShow,
  useTranslate,
} from '@refinedev/core'
import type {
  RoundingMethodEnumType,
  QuotaFormSettingResponse,
  DraftControllerIndexResponse,
} from '@sdk/hey-api'
import {
  QuotaCategoryEnum,
  RoundingMethodEnumType as RoundingMethodEnum,
} from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Modal,
  notification,
  Row,
  Space,
  Spin,
} from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useCallback, useEffect, useRef, useState } from 'react'
import BasicInfo from './components/basic-info'
import Link from 'next/link'
import { DEPARTMENT_DEFAULT } from '@utility/constant'
import CreateFromTemplate from './components/popups/create-from-template'
import CreateFromOldQuota from './components/popups/create-from-old-quota'
import { refreshUserData } from '@utility/refresh-user-data'

dayjs.extend(utc)
dayjs.extend(timezone)

function pickMainProductForApiByTotalCalculation(mainProduct: unknown) {
  if (!Array.isArray(mainProduct)) return []
  const filtered = mainProduct.filter((row: any) => {
    if (!row) return false
    if (row.kind === 'group') return true
    if (row.kind === 'product') return row.is_add_total === true
    return row.is_add_total === true
  })
  return filtered.map((row: any, i: number) => {
    if (row.kind === 'group') {
      return { ...row }
    }
    return { ...row, display_order: i + 1 }
  })
}

function QuotaAction() {
  const t = useTranslate()

  const isCategoryChangedByUserRef = useRef(false)
  const [confirmedCategory, setConfirmedCategory] = useState<QuotaCategoryEnum>(
    QuotaCategoryEnum.MERCHANDISE,
  )

  const methods = useForm({
    queryOptions: {
      enabled: false,
    },
  })

  const { id, action, params } = useParsed()

  const [taxRoundingMethod, setTaxRoundingMethod] =
    useState<RoundingMethodEnumType>(RoundingMethodEnum.ROUND_UP)

  const [isCreateFromTemplate, setIsCreateFromTemplate] = useState(false)
  const [isCreateFromOldQuota, setIsCreateFromOldQuota] = useState(false)
  const { open: openNotification } = useNotification()

  const { actionType } = params as any
  const isClone = action === 'clone'
  const isCloneVersion = actionType === 'VERSION'
  const isCloneNew = !isCloneVersion && isClone
  const isEdit = action === 'edit'

  const isUpdate = !!id

  const pdfViewerLayoutPlugin = usePdfViewerLayoutPlugin(() => {
    const sanitize = (value?: string | null) =>
      value?.replace(/[\\/:*?"<>|]/g, '')
    const parts = [
      '見積書',
      sanitize(form.getFieldValue('code')),
      sanitize(form.getFieldValue('customer')?.label)
        ? `${sanitize(form.getFieldValue('customer')?.label)}様`
        : undefined,
      sanitize(form.getFieldValue('title')),
    ].filter(Boolean)

    return `${parts.join('_')}.pdf`
  })
  const go = useGo()
  const apiUrl = useApiUrl()

  // Use reactive store selector instead of getState() to auto-update on changes
  const permission = useUserStore((state) => state.permission)
  const parameterSettings = useUserStore((state) => state.parameterSettings)
  const isApproveRoutesEnabled =
    parameterSettings?.get('approve-routes') ?? false

  // Refresh permissions and parameter settings when window regains focus
  // This handles the multi-tab scenario where settings are updated in another tab
  // Wrapped in useCallback to prevent re-creating on every render
  const handleRefreshUserData = useCallback(async () => {
    try {
      await refreshUserData()
    } catch (error) {
      console.error('Failed to refresh user data', error)
    }
  }, [])

  // Refresh on component mount to handle React router navigation (list → create)
  // This runs ONCE when component mounts, not on every render
  // because handleRefreshUserData is memoized with useCallback([])
  useEffect(() => {
    handleRefreshUserData()
  }, [handleRefreshUserData])

  const { query: quoteTemplateQuery } = useShow<QuoteTemplateDetailType>({
    resource: 'quota-templates',
    id: Number(params?.templateId),
    queryOptions: {
      enabled: !!params?.templateId,
    },
  })

  const { formProps, form, saveButtonProps, mutation } = methods

  const { form: formProps2 } = formProps

  const { resource } = useResource()

  const [isPdf, setIsPdf] = useState(false)
  const [previewPdf, setPreviewPdf] = useState('')
  const [previewPdfError, setPreviewPdfError] = useState<string | null>(null)
  const saveDraftLockRef = useRef(false)
  const applyDraftLockRef = useRef(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isApplyingDraft, setIsApplyingDraft] = useState(false)
  const [isRedirectingAfterDraftSave, setIsRedirectingAfterDraftSave] =
    useState(false)
  const [isDraftAppliedOnce, setIsDraftAppliedOnce] = useState(false)

  const { data, isFetching } = useCustom<QuotaFormSettingResponse>({
    method: 'get',
    url: `${apiUrl}/quota-form-settings`,
    queryOptions: {
      enabled: !params?.templateId,
    },
  })

  const { data: dataQuotaDraft, isFetching: isFetchingQuotaDraft } =
    useCustom<DraftControllerIndexResponse>({
      method: 'get',
      url: `${apiUrl}/drafts`,
      config: {
        query: {
          type: 'quota',
        },
      },
      queryOptions: {
        enabled: action === 'create',
      },
    })

  const { data: dataBasicInfo, isFetching: isFetchingBasicInfo } = useCustom({
    url: `${apiUrl}/quotas/${id}`,
    method: 'get',
    queryOptions: {
      enabled: isUpdate,
      select: (data) => {
        const detail = data.data as any

        if (
          !permission?.is_module_admin &&
          !detail.is_author &&
          !isCloneNew &&
          !isCloneVersion
        ) {
          go({
            to: '/403',
          })
        }

        return {
          ...data,
          data: {
            ...detail,
          },
        } as unknown as any
      },
    },
  })

  let queryOptions: CrudFilter[] = []

  // if isupdate = true , get department of quota, if department is null => set default department , if department is not null => set department of user login
  if (isUpdate && !isClone) {
    // if there is no department in permission and user is not admin, set default department filter
    if (!dataBasicInfo?.data.department) {
      queryOptions = [
        {
          field: 'name',
          operator: 'eq',
          value: DEPARTMENT_DEFAULT,
        },
      ]
    } else {
      queryOptions = [
        {
          field: 'id',
          operator: 'eq',
          value: dataBasicInfo?.data.department?.id,
        },
      ]
    }
  } else if (permission?.department) {
    // set department of user login
    queryOptions = [
      {
        field: 'id',
        operator: 'eq',
        value: permission.department.id,
      },
    ]
  } else {
    queryOptions = [
      {
        field: 'name',
        operator: 'eq',
        value: DEPARTMENT_DEFAULT,
      },
    ]
  }

  const {
    data: departmentData,
    refetch: refetchDepartmentData,
    isFetching: isFetchingDepartment,
  } = useCustom({
    method: 'get',
    url: `${apiUrl}/departments/find-first`,
    queryOptions: {
      enabled: true,
    },
    config: {
      filters: queryOptions,
      query: { only_enabled_approve_routes: '1' },
    },
  })

  useEffect(() => {
    // neu edit => phai lay setting cua cua quota
    if (isEdit) {
      if (dataBasicInfo) {
        setTaxRoundingMethod(dataBasicInfo.data.tax_rounding_method)
      }
    } else if (isClone) {
      // neu clone => phai lay setting cua quota
      if (dataBasicInfo) {
        setTaxRoundingMethod(dataBasicInfo.data.tax_rounding_method)
      }
    } else {
      // neu co template (create tu template, thi lay cua template
      const quoteTemplate = quoteTemplateQuery?.data?.data
      if (quoteTemplate) {
        setTaxRoundingMethod(quoteTemplate.tax_rounding_method)
      } else if (data?.data) {
        // neu create => lay setting cua tenant
        setTaxRoundingMethod(data.data.tax_rounding_method)
      }
    }
  }, [data?.data, isClone, isEdit, dataBasicInfo, quoteTemplateQuery?.data])

  // Refetch department data when approve-routes parameter setting changes
  useEffect(() => {
    if (isApproveRoutesEnabled !== undefined && departmentData?.data) {
      refetchDepartmentData().then(({ data: latestDepartmentData }) => {
        const approveRoutes = latestDepartmentData?.data?.approve_routes || []

        if (isApproveRoutesEnabled) {
          form.setFieldsValue({
            approve_routes: approveRoutes,
            ...(isUpdate
              ? {}
              : {
                  approve_route_id: approveRoutes[0]?.id || null,
                  approve_route_name: approveRoutes[0]?.name || null,
                }),
          })
        } else {
          form.setFieldsValue({
            approve_routes: [],
            approve_route_id: '',
            approve_route_name: '',
          })
        }
      })
    }
  }, [
    parameterSettings?.get('approve-routes'),
    departmentData?.data,
    refetchDepartmentData,
    form,
    isUpdate,
  ])
  const { data: dataProducts, isFetching: isFetchingProduct } = useCustom({
    url: `${apiUrl}/quotas/${id}/products`,
    method: 'get',
    queryOptions: {
      enabled: isUpdate,
    },
  })

  const { data: dataHistory, isFetching: isFetchingHistory } = useCustom({
    url: `${apiUrl}/quotas/${id}/history`,
    method: 'get',
    queryOptions: {
      enabled: isUpdate && !isCloneNew,
    },
  })

  const { mutate: mutatePreviewPdf, isPending: isPendingPreviewPdf } =
    useCustomMutation()
  const { mutate: mutateDraft, isPending: isPendingDraft } = useCustomMutation()

  const { refetch: checkParameter, isFetching: isCheckingParameter } =
    useCustom({
      method: 'get',
      url: `${apiUrl}/quotas/check-parameters`, // Thay đổi URL theo API của bạn
      queryOptions: {
        enabled: false, // Không tự động gọi API
        retry: false, // Tắt retry để tránh retry 3 lần
      },
      config: {
        filters: [
          {
            field: 'is_manage_approve_routes',
            operator: 'eq',
            value: parameterSettings?.get('approve-routes') ? true : false,
          },
        ],
      },
      successNotification: false, // Tắt success notification
      errorNotification: false, // Tắt error notification/toast
    })

  const handlePreviewPdf = () => {
    setPreviewPdf('')
    setPreviewPdfError(null)

    const delivery_date = form.getFieldValue('delivery_date')
      ? form.getFieldValue('delivery_date').format('YYYY/MM/DD HH:mm')
      : null
    const fields = form.getFieldsValue() as Record<string, any>
    const tagItems = form.getFieldValue('tags') ?? []
    const customValues = {
      ...fields,
      main_product: pickMainProductForApiByTotalCalculation(
        fields.main_product,
      ),
      type: form.getFieldValue('type'),
      delivery_date: delivery_date,
      tags: tagItems.map((item: any) => ({
        id: item?.value,
        name: item?.label,
      })),
      customer_id: form.getFieldValue('customer')?.value,
      customer_name: form.getFieldValue('customer')?.label,
      status: QuotaStatus.Creating,
    }
    mutatePreviewPdf(
      {
        values: customValues,
        url: isEdit
          ? `${apiUrl}/quotas/preview-pdf/${id}`
          : `${apiUrl}/quotas/preview-pdf`,
        method: 'post',
      },
      {
        onSuccess(data) {
          setPreviewPdfError(null)
          setPreviewPdf(data.data?.pdf_base64 ?? '')
        },
        onError(error: any) {
          setPreviewPdf('')
          const res = error?.response?.data
          let msg =
            typeof res?.message === 'string' && res.message.trim()
              ? res.message
              : ''
          if (!msg && res?.errors && typeof res.errors === 'object') {
            msg = Object.values(res.errors)
              .flat()
              .filter((x): x is string => typeof x === 'string')
              .join(' ')
          }
          if (!msg && typeof error?.message === 'string') {
            msg = error.message
          }
          if (!msg) msg = t('notifications.error')
          setPreviewPdfError(msg)
          notification.error({ message: msg })
        },
      },
    )
  }

  const defaultOptionalProduct = [
    {
      product: null,
      product_id: null,
      package: null,
      package_id: null,
      isSelfCreate: false,
      name: '',
      code: '',
      package_name: '-',
      cost_price: 0,
      quantity: 1,
      selling_price: 0,
      profit_margin: 0,
      is_add_total: true,
      unit: null,
      unit_name: '-',
      tax_rate: 0,
      kind: 'group',
    },
    {
      product: null,
      product_id: null,
      package_id: null,
      name: '',
      code: '',
      package_name: '-',
      cost_price: 0,
      selling_price: 0,
      quantity: 1,
      profit_margin: 0,
      is_add_total: false,
      isSelfCreate: false,
      tax_rate: 10,
      unit: null,
      unit_name: '-',
      kind: 'product',
    },
  ]

  useEffect(() => {
    if (isCloneVersion) {
      if (dataBasicInfo?.data && dataProducts?.data && dataHistory?.data) {
        // 承認ルート: options from department, selected from quota API (dataBasicInfo)
        const approveRoutes = isApproveRoutesEnabled
          ? departmentData?.data.approve_routes || []
          : []
        const nextApproveRouteId = isApproveRoutesEnabled
          ? (dataBasicInfo.data.approve_route?.id ??
            approveRoutes[0]?.id ??
            null)
          : ''
        const nextApproveRouteName = isApproveRoutesEnabled
          ? (dataBasicInfo.data.approve_route?.name ??
            approveRoutes[0]?.name ??
            null)
          : ''

        form.setFieldsValue({
          ...dataBasicInfo.data,
          code: `${dataBasicInfo.data.code}-${(dataHistory.data?.clone_history?.length ?? 0) + 1}`,
          customer: {
            value: dataBasicInfo.data.customer_id,
            label: dataBasicInfo.data.customer_name,
          },
          customer_contact_id: dataBasicInfo.data.customer_contact_id,
          delivery_date: dataBasicInfo.data.delivery_date
            ? dayjs(dataBasicInfo.data.delivery_date)
            : null,
          issue_date: dataBasicInfo.data.issue_date
            ? dayjs(dataBasicInfo.data.issue_date)
            : null,
          department_id: departmentData?.data.id,
          department_name: departmentData?.data.name,
          tax_rounding_method: taxRoundingMethod,
          approve_routes: approveRoutes,
          approve_route_id: nextApproveRouteId,
          approve_route_name: nextApproveRouteName,
          tags:
            dataBasicInfo.data.tags?.map((item: any) => ({
              value: item.id,
              label: item.name,
            })) || [],
          main_product: dataProducts.data.main_product.map((item: any) => ({
            ...item,
            product: { value: item.product_id, label: item.name },
            package: { value: item.package_id, label: item.package_name },
            tax_rate: item.tax_rate ?? 0,
            isSelfCreate: !item.product_id,
            unit:
              item.unit_name ??
              t('quotas.action.detail_info.default_values.default_unit'),
            unit_name:
              item.unit_name ??
              t('quotas.action.detail_info.default_values.default_unit'),
          })),
          optional_product: dataProducts.data.optional_product?.length
            ? dataProducts.data.optional_product.map((item: any) => ({
                ...item,
                product: { value: item.product_id, label: item.name },
                package: {
                  value: item.package_id,
                  label: item.package_name,
                },
                tax_rate: item.tax_rate ?? 0,
                isSelfCreate: !item.product_id && item.prodcut_name,
                unit:
                  item.unit_name ??
                  t('quotas.action.detail_info.default_values.default_unit'),
                unit_name:
                  item.unit_name ??
                  t('quotas.action.detail_info.default_values.default_unit'),
              }))
            : defaultOptionalProduct,
          ...dataHistory?.data?.data,
        })

        if (!initialPriceCheckDoneRef.current) {
          initialPriceCheckDoneRef.current = true
          setPriceChanges([])
          setPriceReflection(null)
          setCustomerHasRank(null)
          setIsAwaitingPriceDecision(true)
          setCustomerIdForRankCheck(dataBasicInfo.data.customer_id)
          handleChangeProductPrincing(
            dataProducts.data.main_product.map((item: any) => item.product_id),
            (dataProducts.data.optional_product ?? []).map(
              (item: any) => item.product_id,
            ),
          )
        }
      }
    } else {
      // Edit case and Show case
      if (dataBasicInfo?.data && dataProducts?.data) {
        const basicData = { ...dataBasicInfo.data }
        // Remove customer_id and customer_name to avoid overwriting customer field
        delete basicData.customer_id
        delete basicData.customer_name

        const customerField = {
          value: dataBasicInfo.data.customer_id,
          label: dataBasicInfo.data.customer_name,
        }

        let approve_routes = departmentData?.data.approve_routes || []
        let approve_route_id = dataBasicInfo.data.approve_route?.id
        let approve_route_name = dataBasicInfo.data.approve_route?.name
        if (isCloneNew) {
          approve_routes = isApproveRoutesEnabled
            ? departmentData?.data.approve_routes || []
            : []
          approve_route_id = isApproveRoutesEnabled
            ? departmentData?.data.approve_routes?.[0]?.id || null
            : ''
          approve_route_name = isApproveRoutesEnabled
            ? departmentData?.data.approve_routes?.[0]?.name || null
            : ''
        }
        form.setFieldsValue({
          ...basicData,
          code: isEdit
            ? dataBasicInfo.data.code
            : isCloneNew
              ? form.getFieldValue('code') || ''
              : '',
          customer: customerField,
          customer_contact_id: dataBasicInfo.data.customer_contact_id,
          tax_rounding_method: taxRoundingMethod,
          department_id: departmentData?.data.id,
          department_name: departmentData?.data.name,
          approve_routes: approve_routes,
          approve_route_id: approve_route_id,
          approve_route_name: approve_route_name,
          customer_term: dataBasicInfo.data.customer_term,
          delivery_date: dataBasicInfo.data.delivery_date
            ? dayjs(dataBasicInfo.data.delivery_date)
            : null,
          issue_date: dataBasicInfo.data.issue_date
            ? dayjs(dataBasicInfo.data.issue_date)
            : null,
          tags:
            dataBasicInfo.data.tags?.map((item: any) => ({
              value: item.id,
              label: item.name,
            })) || [],
          main_product: dataProducts.data.main_product.map((item: any) => ({
            ...item,
            product: { value: item.product_id, label: item.name },
            package: { value: item.package_id, label: item.package_name },
            tax_rate: item.tax_rate ?? 0,
            isSelfCreate: !item.product_id,
            unit:
              item.unit_name ??
              t('quotas.action.detail_info.default_values.default_unit'),
            unit_name:
              item.unit_name ??
              t('quotas.action.detail_info.default_values.default_unit'),
          })),
          optional_product: dataProducts.data.optional_product?.length
            ? dataProducts.data.optional_product.map((item: any) => ({
                ...item,
                product: { value: item.product_id, label: item.name },
                package: {
                  value: item.package_id,
                  label: item.package_name,
                },
                tax_rate: item.tax_rate ?? 0,
                isSelfCreate: !item.product_id && item.prodcut_name,
                unit:
                  item.unit_name ??
                  t('quotas.action.detail_info.default_values.default_unit'),
                unit_name:
                  item.unit_name ??
                  t('quotas.action.detail_info.default_values.default_unit'),
              }))
            : defaultOptionalProduct,
          ...dataHistory?.data?.data,
        })

        const isEditableQuotaStatus =
          dataBasicInfo.data.status === QuotaStatus.Creating ||
          dataBasicInfo.data.status === QuotaStatus.Rejected

        if (
          (isCloneNew || (isEdit && isEditableQuotaStatus)) &&
          !initialPriceCheckDoneRef.current
        ) {
          initialPriceCheckDoneRef.current = true
          setPriceChanges([])
          setPriceReflection(null)
          setCustomerHasRank(null)
          setIsAwaitingPriceDecision(true)
          setCustomerIdForRankCheck(dataBasicInfo.data.customer_id)
          handleChangeProductPrincing(
            dataProducts.data.main_product.map((item: any) => item.product_id),
            (dataProducts.data.optional_product ?? []).map(
              (item: any) => item.product_id,
            ),
          )
        }
      }
    }
  }, [
    departmentData,
    dataProducts,
    dataHistory,
    dataBasicInfo,
    taxRoundingMethod,
    isCloneNew,
    isEdit,
  ])

  useEffect(() => {
    const quoteTemplate = quoteTemplateQuery?.data?.data
    if (quoteTemplate) {
      delete (quoteTemplate as any).issue_date
      delete quoteTemplate.updated_at
      delete quoteTemplate.author
      delete quoteTemplate.editor

      form.setFieldsValue({
        ...form.getFieldsValue(),
        category: quoteTemplate?.category,
        title: quoteTemplate?.name,
        type: quoteTemplate?.type,
        delivery_method: quoteTemplate?.delivery_method,
        payment_due_date: quoteTemplate?.payment_due_date,
        expiration_date: quoteTemplate?.expiration_date,
        consumption_tax: quoteTemplate?.consumption_tax,
        tax_rate: quoteTemplate?.tax_rate,
        note: quoteTemplate?.note,
        tax_rounding_method: taxRoundingMethod,
        customer_term: quoteTemplate?.customer_term,
        department_id: departmentData?.data?.id,
        department_name: departmentData?.data?.name,
        approve_routes: isApproveRoutesEnabled
          ? departmentData?.data.approve_routes || []
          : [],
        approve_route_id: isApproveRoutesEnabled
          ? departmentData?.data.approve_routes?.[0]?.id || null
          : '',
        approve_route_name: isApproveRoutesEnabled
          ? departmentData?.data.approve_routes?.[0]?.name || null
          : '',
        main_product: quoteTemplate?.main_product?.map((item: any) => ({
          ...item,
          product: { value: item.product_id, label: item.name },
          package: { value: item.package_id, label: item.package_name },
          tax_rate: item.tax_rate ?? 0,
          isSelfCreate: !item.product_id,
          unit:
            item.unit_name ??
            t('quotas.action.detail_info.default_values.default_unit'),
          unit_name:
            item.unit_name ??
            t('quotas.action.detail_info.default_values.default_unit'),
        })),
        optional_product: quoteTemplate?.optional_product?.length
          ? quoteTemplate.optional_product.map((item: any) => ({
              ...item,
              product: { value: item.product_id, label: item.name },
              package: {
                value: item.package_id,
                label: item.package_name,
              },
              tax_rate: item.tax_rate ?? 0,
              isSelfCreate: !item.product_id && item.prodcut_name,
              unit:
                item.unit_name ??
                t('quotas.action.detail_info.default_values.default_unit'),
              unit_name:
                item.unit_name ??
                t('quotas.action.detail_info.default_values.default_unit'),
            }))
          : defaultOptionalProduct,
        tags: (quoteTemplate?.tags ?? []).map(({ id, name }) => ({
          label: name,
          value: id,
          key: id,
        })),
      })
    } else if (!isUpdate && data?.data) {
      form.setFieldsValue({
        title: '',
        type: 'normal',
        category: 'merchandise',
        customer: null,
        customer_contact_id: null,
        status: 'creating',
        issue_date: dayjs(),
        delivery_date: null,
        delivery_method: data?.data.default_delivery_method,
        payment_due_date: data?.data.default_payment_due_date,
        expiration_date: data?.data.default_expiration_date,
        consumption_tax: data?.data.consumption_tax,
        tax_rate: data?.data.tax_rate,
        note: null,
        tags: [],
        total_cost: 0,
        consumption_tax_amount: 0,
        total_profit_margin: 0,
        total_price_tax_included: 0,
        tax_rounding_method: taxRoundingMethod,
        customer_term: 'short_term',
        department_id: departmentData?.data.id,
        department_name: departmentData?.data.name,
        approve_routes: isApproveRoutesEnabled
          ? departmentData?.data.approve_routes || []
          : [],
        approve_route_id: isApproveRoutesEnabled
          ? departmentData?.data.approve_routes?.[0]?.id || null
          : '',
        approve_route_name: isApproveRoutesEnabled
          ? departmentData?.data.approve_routes?.[0]?.name || null
          : '',

        main_product: [
          {
            product: null,
            product_id: null,
            package: null,
            package_id: null,
            isSelfCreate: false,
            name: '',
            code: '',
            package_name: '-',
            cost_price: 0,
            quantity: 1,
            selling_price: 0,
            profit_margin: 0,
            is_add_total: true,
            unit: null,
            unit_name: '-',
            tax_rate: 0,
            kind: 'group',
          },
          {
            product: null,
            product_id: null,
            package: null,
            package_id: null,
            isSelfCreate: false,
            name: '',
            code: '',
            package_name: '-',
            cost_price: 0,
            quantity: 1,
            selling_price: 0,
            profit_margin: 0,
            is_add_total: true,
            unit: t('quotas.action.detail_info.default_values.default_unit'),
            unit_name: t(
              'quotas.action.detail_info.default_values.default_unit',
            ),
            tax_rate: 10,
            kind: 'product',
          },
        ],
        optional_product: defaultOptionalProduct,
      })
    }
  }, [
    departmentData,
    data,
    quoteTemplateQuery?.data?.data,
    taxRoundingMethod,
    isApproveRoutesEnabled,
  ])

  const performCreateOrEdit = (formValues: any) => {
    const values = {
      ...formValues,
      main_product: pickMainProductForApiByTotalCalculation(
        formValues.main_product,
      ),
    }
    const retryWithTaxMethod = (useTaxMethodValue?: boolean) => {
      const newValues = { ...values }
      if (useTaxMethodValue !== undefined) {
        newValues.use_newest_tax_rounding_method = useTaxMethodValue
      } else {
        delete newValues.use_newest_tax_rounding_method
      }
      performCreateOrEdit(newValues)
    }
    if (isUpdate && isEdit) {
      mutation.mutate(
        {
          resource: resource?.name,
          values: {
            ...values,
            type: values.type || 'normal',
            category: values.category || 'merchandise',
            customer_id: values.customer.value,
            customer_name: values.customer.label,
            customer_contact_id: values.customer_contact_id,
            consumption_tax: values.consumption_tax || 'exclusive',
            status: QuotaStatus.Creating,
            delivery_date: values.delivery_date
              ? dayjs(values.delivery_date)
                  .utc(true)
                  .startOf('day')
                  .toISOString()
              : null,
            issue_date: dayjs(values.issue_date)
              .utc(true)
              .startOf('day')
              .toISOString(),
            tags:
              values?.tags?.map((item: any) => ({
                id: item.value,
                name: item.label,
              })) || [],
            tax_rate: values.tax_rate ?? 0,
            tax_rate_group: values.tax_rate_group || [],
          },
          id: params?.id,
        },
        {
          onSuccess() {
            go({
              to: `/quotas`,
            })
          },
        },
      )
    } else {
      mutation.mutate(
        {
          resource: resource?.name,
          values: {
            ...values,
            type: values.type || 'normal',
            category: values.category || 'merchandise',
            clone_from_quota: isClone && id ? id : null,
            clone_from_template: quoteTemplateQuery?.data?.data?.id,
            source_id: isCloneVersion ? Number(id) : null,
            customer_id: values.customer.value,
            customer_name: values.customer.label,
            customer_contact_id: values.customer_contact_id,
            delivery_date: values.delivery_date
              ? dayjs(values.delivery_date)
                  .utc(true)
                  .startOf('day')
                  .toISOString()
              : null,
            issue_date: dayjs(values.issue_date)
              .utc(true)
              .startOf('day')
              .toISOString(),
            status: 'creating',
            tags:
              values?.tags?.map((item: any) => ({
                id: item.value,
                name: item.label,
              })) || [],
            tax_rate: values.tax_rate ?? 0,
            tax_rate_group: values.tax_rate_group || [],
          },
          errorNotification: false,
        },
        {
          onSuccess() {
            go({
              to: `/quotas`,
            })
          },
          onError(error: any) {
            const errorData = error?.response?.data || error?.data
            const errorCode = errorData?.data?.code
            const _taxRoundingMethod = errorData?.data?.tax_rounding_method
            const errorMessage = errorData?.message || error?.message
            if (errorCode === 'NOT_MATCH_TAX_ROUNDING_METHOD') {
              const modalInstance = Modal.confirm({
                closable: true,
                icon: null,
                centered: true,
                maskClosable: false,
                style: {
                  width: '300px',
                },
                content: (
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {t('quotas.popups.confirmTaxRoundingMethod.title')}
                  </div>
                ),
                okText: t('quotas.popups.confirmTaxRoundingMethod.okText'),
                cancelText: t(
                  'quotas.popups.confirmTaxRoundingMethod.cancelText',
                ),
                onOk() {
                  modalInstance.destroy()
                  form.setFieldValue('tax_rounding_method', _taxRoundingMethod)
                },
                onCancel(e) {
                  modalInstance.destroy()
                  if (e && e.name === 'close') {
                    retryWithTaxMethod(false)
                  }
                },
              })
              return
            }
            notification.error({
              message: errorMessage,
            })
          },
        },
      )
    }
  }

  const onFinish = (values: any) => {
    // Gọi API check parameter trước khi create/edit
    checkParameter()
      .then((response: any) => {
        // Kiểm tra status code và data của response
        if (response?.status === 'success' && !response?.data?.message) {
          performCreateOrEdit(values)
        } else {
          Modal.confirm({
            title: t('quotas.parameterCheck.settingChangedWarning'),
            content: (
              <div style={{ whiteSpace: 'pre-line' }}>
                {response?.error?.message ||
                  t('quotas.parameterCheck.confirmContinue')}
              </div>
            ),
            okText: t('buttons.yesContinue'),
            cancelText: t('buttons.noCancel'),
            onOk() {
              // User chọn Yes - tiếp tục create/edit
              performCreateOrEdit(values)
            },
            onCancel() {
              // User chọn No - không làm gì cả
              console.log('User cancelled the operation')
            },
          })
        }
      })
      .catch((error) => {
        // Xử lý khi có lỗi network hoặc lỗi khác
        console.error('Parameter check network error:', error)
        // Có thể hiển thị modal hoặc message thông báo lỗi
      })
  }

  const handleSaveDraft = () => {
    if (saveDraftLockRef.current || isRedirectingAfterDraftSave) return
    saveDraftLockRef.current = true
    setIsSavingDraft(true)

    const values: any = form.getFieldsValue()

    const payload = {
      ...values,
      main_product: pickMainProductForApiByTotalCalculation(
        values.main_product,
      ),
      type: values.type || 'normal',
      category: values.category || 'merchandise',
      customer_id: values.customer?.value,
      customer_name: values.customer?.label,
      customer_contact_id: values.customer_contact_id,
      delivery_date: values.delivery_date
        ? dayjs(values.delivery_date).utc(true).startOf('day').toISOString()
        : null,
      issue_date: values.issue_date
        ? dayjs(values.issue_date).utc(true).startOf('day').toISOString()
        : null,
      status: QuotaStatus.Creating,
      tags:
        values?.tags?.map((item: any) => ({
          id: item.value,
          name: item.label,
        })) || [],
      tax_rate: values.tax_rate ?? 0,
      tax_rate_group: values.tax_rate_group || [],
      source_id: isCloneVersion ? Number(id) : null,
    }

    try {
      mutateDraft(
        {
          url: `${apiUrl}/drafts`,
          method: 'put',
          values: {
            type: 'quota',
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
            go({
              to: `/quotas`,
            })
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

    try {
      if (
        !dataQuotaDraft?.data ||
        (dataQuotaDraft.data as any[]).length === 0
      ) {
        return
      }

      const draft: any = (dataQuotaDraft.data as any[])[0]
      const draftPayload = draft.payload || draft

      form.setFieldsValue({
        ...draftPayload,
        payment_due_date: draftPayload?.payment_due_date,
        expiration_date: draftPayload?.expiration_date,
        customer: draftPayload.customer_id
          ? {
              value: draftPayload.customer_id,
              label: draftPayload.customer_name,
            }
          : null,
        delivery_date: draftPayload.delivery_date
          ? dayjs(draftPayload.delivery_date)
          : null,
        issue_date: draftPayload.issue_date
          ? dayjs(draftPayload.issue_date)
          : null,
        tags:
          draftPayload.tags?.map((item: any) => ({
            value: item.id,
            label: item.name,
          })) || [],
        main_product: draftPayload.main_product?.map((item: any) => ({
          ...item,
          product: { value: item.product_id, label: item.name },
          package: { value: item.package_id, label: item.package_name },
          tax_rate: item.tax_rate ?? 0,
          isSelfCreate: !item.product_id,
          unit:
            item.unit_name ??
            t('quotas.action.detail_info.default_values.default_unit'),
          unit_name:
            item.unit_name ??
            t('quotas.action.detail_info.default_values.default_unit'),
        })),
        optional_product: draftPayload.optional_product?.length
          ? draftPayload.optional_product.map((item: any) => ({
              ...item,
              product: { value: item.product_id, label: item.name },
              package: {
                value: item.package_id,
                label: item.package_name,
              },
              tax_rate: item.tax_rate ?? 0,
              isSelfCreate: !item.product_id && item.prodcut_name,
              unit:
                item.unit_name ??
                t('quotas.action.detail_info.default_values.default_unit'),
              unit_name:
                item.unit_name ??
                t('quotas.action.detail_info.default_values.default_unit'),
            }))
          : defaultOptionalProduct,
      })

      openNotification?.({
        description: t('notifications.draftApplySuccess'),
        message: t('notifications.draftApplySuccess'),
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

  const [productPrincing, setProductPrincing] = useState<number[]>()
  const [productPrincingOptional, setProductPrincingptional] =
    useState<number[]>()

  const handleChangeProductPrincing = useCallback(
    (productIds: number[], productIdsOptional: number[]) => {
      setProductPrincing(() => [...productIds])
      setProductPrincingptional(() => [...productIdsOptional])
    },
    [],
  )

  const [priceReflection, setPriceReflection] = useState<{
    visible: boolean
    changes: Array<{
      parent: 'main_product' | 'optional_product'
      index: number
      productId?: number
      field: 'selling_price' | 'cost_price'
      oldPrice: number
      newPrice: number
    }>
    customerHasRank: boolean
  } | null>(null)
  const [isAwaitingPriceDecision, setIsAwaitingPriceDecision] = useState(false)
  const [priceChanges, setPriceChanges] = useState<
    Array<{
      parent: 'main_product' | 'optional_product'
      index: number
      productId?: number
      field: 'selling_price' | 'cost_price'
      oldPrice: number
      newPrice: number
    }>
  >([])
  const [customerHasRank, setCustomerHasRank] = useState<boolean | null>(null)
  const [customerIdForRankCheck, setCustomerIdForRankCheck] = useState<
    number | null
  >(null)
  const [isMainPricingFetching, setIsMainPricingFetching] = useState(false)
  const [isOptionalPricingFetching, setIsOptionalPricingFetching] =
    useState(false)
  const initialPriceCheckDoneRef = useRef(false)

  const { data: customerRankData } = useCustom<any>({
    url: `${apiUrl}/customers/${customerIdForRankCheck}`,
    method: 'get',
    queryOptions: {
      enabled: !!customerIdForRankCheck,
    },
  })

  useEffect(() => {
    if (customerIdForRankCheck && customerRankData?.data) {
      setCustomerHasRank(
        !!customerRankData.data.price_rank_id || !!customerRankData.data.rank,
      )
    }
  }, [customerRankData, customerIdForRankCheck])

  useEffect(() => {
    if (!isAwaitingPriceDecision) return
    if (priceChanges.length > 0 || customerHasRank === true) {
      setPriceReflection({
        visible: true,
        changes: priceChanges,
        customerHasRank: !!customerHasRank,
      })
    }
  }, [isAwaitingPriceDecision, priceChanges, customerHasRank])

  const onPriceComputed = useCallback(
    (
      parent: string,
      index: number,
      oldPrice: number,
      newPrice: number,
      field: 'selling_price' | 'cost_price' = 'selling_price',
      productId?: number,
    ) => {
      const normalizedOld = Number(oldPrice ?? 0)
      const normalizedNew = Number(newPrice ?? 0)
      const isNoop =
        Number.isNaN(normalizedOld) ||
        Number.isNaN(normalizedNew) ||
        normalizedOld === normalizedNew
      setPriceChanges((prev) => {
        const filtered = prev.filter(
          (c) =>
            !(
              c.parent === parent &&
              c.field === field &&
              (productId != null
                ? c.productId === productId
                : c.index === index)
            ),
        )
        if (isNoop) return filtered
        return [
          ...filtered,
          {
            parent: parent as 'main_product' | 'optional_product',
            index,
            productId,
            field,
            oldPrice: normalizedOld,
            newPrice: normalizedNew,
          },
        ]
      })
    },
    [],
  )

  const onCustomerManualSelect = useCallback((hasRank: boolean) => {
    setPriceChanges([])
    setPriceReflection(null)
    setCustomerHasRank(hasRank)
    setCustomerIdForRankCheck(null)
    setIsAwaitingPriceDecision(true)
  }, [])

  const handleReflectPrices = useCallback(() => {
    setPriceReflection((prev) => {
      if (prev) {
        prev.changes.forEach((change) => {
          let targetIndex = change.index
          if (change.productId != null) {
            const list: Array<{ product_id?: number | null }> =
              form.getFieldValue(change.parent) ?? []
            const foundIndex = list.findIndex(
              (item) => item?.product_id === change.productId,
            )
            if (foundIndex === -1) return
            targetIndex = foundIndex
          }
          form.setFieldValue(
            [change.parent, targetIndex, change.field],
            change.newPrice,
          )
        })
      }
      return null
    })
    setPriceChanges([])
    setIsAwaitingPriceDecision(false)
  }, [form])

  const handleDismissReflection = useCallback(() => {
    setPriceReflection((prev) => (prev ? { ...prev, visible: false } : prev))
    setIsAwaitingPriceDecision(false)
  }, [])

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/quotas">{boldText(t('estimates.estimates'))}</Link>
              ),
            },
            {
              title: boldText(
                isUpdate ? t('quotas.edit') : t('quotas.create'),
                PRIMARY,
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={
        <div className="flex justify-between">
          {isUpdate ? t('quotas.edit') : t('quotas.create')}
          <Flex justify="end" gap={4}>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => setIsCreateFromTemplate(true)}
              disabled={
                isFetching ||
                isFetchingBasicInfo ||
                isFetchingProduct ||
                isFetchingHistory ||
                quoteTemplateQuery.isFetching ||
                isCheckingParameter
              }
            >
              {t('quota_templates.list.createFromTemplate')}
            </Button>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => setIsCreateFromOldQuota(true)}
              disabled={
                isFetching ||
                isFetchingBasicInfo ||
                isFetchingProduct ||
                isFetchingHistory ||
                quoteTemplateQuery.isFetching ||
                isCheckingParameter
              }
            >
              {t('quota_templates.list.createFromOldQuota')}
            </Button>
            <Button
              color="primary"
              variant="outlined"
              onClick={async () => {
                await form.validateFields()
                setIsPdf(true)
                handlePreviewPdf()
              }}
              disabled={
                isFetching ||
                isFetchingBasicInfo ||
                isFetchingProduct ||
                isFetchingHistory ||
                quoteTemplateQuery.isFetching ||
                isCheckingParameter
              }
            >
              {t('quotas.action.preview')}
            </Button>
          </Flex>
        </div>
      }
    >
      {priceReflection?.visible && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message={
            <>
              {t('quotas.action.priceReflection.message')}
              <br />
              {t('quotas.action.priceReflection.note')}
            </>
          }
          action={
            <Space>
              <Button
                size="small"
                type="primary"
                loading={isMainPricingFetching || isOptionalPricingFetching}
                onClick={handleReflectPrices}
              >
                {t('quotas.action.priceReflection.reflect')}
              </Button>
              <Button size="small" onClick={handleDismissReflection}>
                {t('quotas.action.priceReflection.notReflect')}
              </Button>
            </Space>
          }
        />
      )}
      <Spin
        spinning={
          isFetching ||
          isFetchingBasicInfo ||
          isFetchingProduct ||
          isFetchingHistory ||
          isFetchingDepartment ||
          quoteTemplateQuery.isFetching ||
          isCheckingParameter
        }
      >
        <Form
          form={formProps2}
          onFinish={onFinish}
          labelCol={{ span: '130px !important' }}
          wrapperCol={{ span: '120px !important' }}
          labelAlign="left"
          layout="horizontal"
          colon={false}
          initialValues={{
            type: 'normal',
            category: 'merchandise',
            consumption_tax: 'exclusive',
            delivery_date: dayjs(),
            issue_date: dayjs(),
          }}
          scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
          autoComplete="off"
          name="basic"
        >
          <BasicInfo
            isCategoryChangedByUserRef={isCategoryChangedByUserRef}
            parameterSettings={parameterSettings}
            handleChangeProductPrincing={handleChangeProductPrincing}
            onCustomerManualSelect={onCustomerManualSelect}
            isEdit={isEdit}
            embeddedContactFromQuota={
              dataBasicInfo?.data?.customer_contact_department !== undefined ||
              dataBasicInfo?.data?.customer_contact_name !== undefined ||
              dataBasicInfo?.data?.customer_contact_email !== undefined
                ? {
                    department_name:
                      dataBasicInfo?.data?.customer_contact_department ?? '',
                    contact_person_name:
                      dataBasicInfo?.data?.customer_contact_name ?? '',
                    email: dataBasicInfo?.data?.customer_contact_email ?? '',
                  }
                : undefined
            }
            quotaCustomerContactId={dataBasicInfo?.data?.customer_contact_id}
          />
          <DetailInfo
            isCategoryChangedByUserRef={isCategoryChangedByUserRef}
            confirmedCategory={confirmedCategory}
            onCategoryConfirmed={setConfirmedCategory}
            productPrincing={productPrincing}
            mainProduct={dataProducts?.data.main_product}
            priceReflectionChanges={priceReflection?.changes}
            onPriceComputed={onPriceComputed}
            isAwaitingPriceDecision={isAwaitingPriceDecision}
            onPricingFetchingChange={setIsMainPricingFetching}
          />
          <OptionalInfo
            confirmedCategory={confirmedCategory}
            productPrincing={productPrincingOptional}
            optionalProduct={dataProducts?.data.optional_product}
            priceReflectionChanges={priceReflection?.changes}
            onPriceComputed={onPriceComputed}
            isAwaitingPriceDecision={isAwaitingPriceDecision}
            onPricingFetchingChange={setIsOptionalPricingFetching}
          />
          <Row>
            <Col xs={24}>
              <Note />
            </Col>
          </Row>
          <Tags />
          {isUpdate && !isCloneNew && <History data={dataHistory?.data} />}

          <Divider
            size="large"
            style={{
              background: '#d9d9d9',
            }}
          />
          {isUpdate && !isCloneNew && (
            <ShowMoreInfo
              descriptions={[
                {
                  title: t('approve_routes.show.creator'),
                  value:
                    (dataBasicInfo?.data.author?.name ?? '---') +
                    ' ' +
                    dayjs(dataBasicInfo?.data.created_at).format(
                      'YYYY/MM/DD HH:mm',
                    ),
                },
                {
                  title: t('approve_routes.show.updater'),
                  value:
                    (dataBasicInfo?.data.editor?.name ?? '---') +
                    ' ' +
                    dayjs(dataBasicInfo?.data?.updated_at).format(
                      'YYYY/MM/DD HH:mm',
                    ),
                },
              ]}
            />
          )}

          {(isCloneNew || !isEdit) && (
            <Flex justify="flex-end" style={{ marginTop: 20 }}>
              <Form.Item
                name="is_create_quota_template"
                valuePropName="checked"
                style={{ margin: 0 }}
              >
                <Checkbox>{t('quotas.form.is_create_quota_template')}</Checkbox>
              </Form.Item>
            </Flex>
          )}

          <Flex justify="space-between">
            <Space>
              <> </>
            </Space>
            <Space className="items-end">
              <Button
                type="default"
                onClick={() => {
                  go({
                    to: '/quotas',
                  })
                }}
                autoInsertSpace={false}
              >
                {t('buttons.back')}
              </Button>
              {action === 'create' &&
                dataQuotaDraft?.data &&
                (dataQuotaDraft.data as any[]).length > 0 && (
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleApplyDraft}
                    disabled={
                      isFetching ||
                      isFetchingBasicInfo ||
                      isFetchingProduct ||
                      isFetchingHistory ||
                      quoteTemplateQuery.isFetching ||
                      isFetchingQuotaDraft ||
                      isSavingDraft ||
                      isApplyingDraft ||
                      isRedirectingAfterDraftSave ||
                      isDraftAppliedOnce
                    }
                    loading={isApplyingDraft && !isDraftAppliedOnce}
                  >
                    {t('buttons.apply_draft')}
                  </Button>
                )}
              {action === 'create' && (
                <Button
                  type="primary"
                  loading={isPendingDraft || isSavingDraft}
                  onClick={handleSaveDraft}
                  disabled={
                    isSavingDraft ||
                    isApplyingDraft ||
                    isRedirectingAfterDraftSave
                  }
                  autoInsertSpace={false}
                >
                  {t('buttons.draft')}
                </Button>
              )}

              <Button
                {...saveButtonProps}
                type="primary"
                autoInsertSpace={false}
                loading={saveButtonProps.loading || isCheckingParameter}
              >
                {action === 'edit' ? t('buttons.save') : t('buttons.create')}
              </Button>
            </Space>
          </Flex>
        </Form>
      </Spin>
      {
        <Modal
          title={t('quotas.action.preview_pdf')}
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isPdf}
          onCancel={() => {
            setIsPdf(false)
            setPreviewPdfError(null)
          }}
          footer={null}
          style={{ top: 20 }}
          width={{
            xs: '90%',
            sm: '80%',
            xxl: '50%',
          }}
        >
          <div>
            <Spin spinning={isPendingPreviewPdf}>
              {!isPendingPreviewPdf && previewPdfError && (
                <Alert type="error" message={previewPdfError} showIcon />
              )}
              {!isPendingPreviewPdf && previewPdf && !previewPdfError && (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={`data:application/pdf;base64,${previewPdf}`}
                    plugins={[pdfViewerLayoutPlugin]}
                  />
                </Worker>
              )}
            </Spin>

            {/* <PreviewPdf previewPdf={previewPdf} /> */}
          </div>
        </Modal>
      }
      {isCreateFromTemplate && (
        <CreateFromTemplate
          open={isCreateFromTemplate}
          t={t}
          onClose={() => setIsCreateFromTemplate(false)}
        />
      )}
      {isCreateFromOldQuota && (
        <CreateFromOldQuota
          open={isCreateFromOldQuota}
          t={t}
          onClose={() => setIsCreateFromOldQuota(false)}
        />
      )}
    </PageContainer>
  )
}

export default QuotaAction

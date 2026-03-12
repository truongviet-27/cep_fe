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
import { DeleteButton, useForm } from '@refinedev/antd'
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
import { RoundingMethodEnumType as RoundingMethodEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Modal,
  Row,
  Space,
  Spin,
} from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useCallback, useEffect, useState } from 'react'
import BasicInfo from './components/basic-info'
import Link from 'next/link'
import { DEPARTMENT_DEFAULT } from '@utility/constant'
import CreateFromTemplate from './components/popups/create-from-template'
import CreateFromOldQuota from './components/popups/create-from-old-quota'
import { refreshUserData } from '@utility/refresh-user-data'

dayjs.extend(utc)
dayjs.extend(timezone)

function QuotaAction() {
  const t = useTranslate()
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

  const pdfViewerLayoutPlugin = usePdfViewerLayoutPlugin()
  const go = useGo()
  const apiUrl = useApiUrl()

  // Use reactive store selector instead of getState() to auto-update on changes
  const permission = useUserStore((state) => state.permission)
  const parameterSettings = useUserStore((state) => state.parameterSettings)

  // Refresh permissions and parameter settings when window regains focus
  // This handles the multi-tab scenario where settings are updated in another tab
  // Wrapped in useCallback to prevent re-creating on every render
  const handleRefreshUserData = useCallback(async () => {
    try {
      console.log('Refreshing user data on focus...')
      await refreshUserData()
    } catch (error) {
      console.error('Failed to refresh user data', error)
    }
  }, [])

  // Refresh on component mount to handle React router navigation (list → create)
  // This runs ONCE when component mounts, not on every render
  // because handleRefreshUserData is memoized with useCallback([])
  useEffect(() => {
    console.log('Component mounted, refreshing user data...')
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
      if (data?.data) {
        // neu create => lay setting cua tenant
        setTaxRoundingMethod(data.data.tax_rounding_method)
      }
    }
  }, [data?.data, isClone, isEdit, dataBasicInfo])

  // Refetch department data when approve-routes parameter setting changes
  useEffect(() => {
    const isApproveRoutesEnabled = parameterSettings?.get('approve-routes')

    if (isApproveRoutesEnabled !== undefined && departmentData?.data) {
      refetchDepartmentData().then(({ data: latestDepartmentData }) => {
        const approveRoutes = latestDepartmentData?.data?.approve_routes || []

        if (isApproveRoutesEnabled) {
          // Enable: set approve_routes options and first route as default
          form.setFieldsValue({
            approve_routes: approveRoutes,
            approve_route_id: approveRoutes[0]?.id || null,
            approve_route_name: approveRoutes[0]?.name || null,
          })
        } else {
          // Disable: clear approve_routes options and value
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
    const delivery_date = form.getFieldValue('delivery_date')
      ? form.getFieldValue('delivery_date').format('YYYY/MM/DD HH:mm')
      : null
    const customValues = {
      ...form.getFieldsValue(),
      type: form.getFieldValue('type'),
      delivery_date: delivery_date,
      tags: form.getFieldValue('tags').map((item: any) => ({
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
          setPreviewPdf(data.data?.pdf_base64 ?? '')
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
      quantity: 0,
      profit_margin: 0,
      is_add_total: false,
      isSelfCreate: false,
      tax_rate: 0,
      unit: null,
      unit_name: '-',
      kind: 'product',
    },
  ]

  useEffect(() => {
    if (isCloneVersion) {
      if (dataBasicInfo?.data && dataProducts?.data && dataHistory?.data) {
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
          approve_routes: departmentData?.data.approve_routes || [],
          approve_route_id: departmentData?.data.approve_routes
            ? departmentData?.data.approve_routes[0]?.id
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
        if (isCloneNew) {
          approve_routes = departmentData?.data.approve_routes || []
          approve_route_id = departmentData?.data.approve_routes
            ? departmentData?.data.approve_routes[0]?.id
            : null
        }
        form.setFieldsValue({
          ...basicData,
          code: isEdit ? dataBasicInfo.data.code : '',
          customer: customerField,
          customer_contact_id: dataBasicInfo.data.customer_contact_id,
          tax_rounding_method: data?.data?.tax_rounding_method,
          department_id: departmentData?.data.id,
          department_name: departmentData?.data.name,
          approve_routes: approve_routes,
          approve_route_id: approve_route_id,
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
      }
    }
  }, [departmentData, dataProducts, dataHistory, dataBasicInfo])

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
        tax_rounding_method: data?.data?.tax_rounding_method,
        department_id: departmentData?.data.id,
        department_name: departmentData?.data.department_name,
        approve_routes: parameterSettings?.get('approve-routes')
          ? departmentData?.data.approve_routes || []
          : [],
        approve_route_id: departmentData?.data.approve_routes
          ? departmentData?.data.approve_routes[0]?.id
          : null,
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
        tax_rounding_method: data.data?.tax_rounding_method,
        customer_term: 'short_term',
        department_id: departmentData?.data.id,
        department_name: departmentData?.data.name,
        approve_routes: departmentData?.data.approve_routes || [],
        approve_route_id: departmentData?.data.approve_routes
          ? departmentData?.data.approve_routes[0]?.id
          : null,
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
            quantity: 0,
            selling_price: 0,
            profit_margin: 0,
            is_add_total: true,
            unit: t('quotas.action.detail_info.default_values.default_unit'),
            unit_name: t(
              'quotas.action.detail_info.default_values.default_unit',
            ),
            tax_rate: 0,
            kind: 'product',
          },
        ],
        optional_product: defaultOptionalProduct,
      })
    }
  }, [departmentData, data, quoteTemplateQuery?.data?.data])

  const performCreateOrEdit = (values: any) => {
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
        },
        {
          onSuccess() {
            go({
              to: `/quotas`,
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
    const values: any = form.getFieldsValue()

    const payload = {
      ...values,
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
        },
      },
    )
  }

  const handleApplyDraft = () => {
    if (!dataQuotaDraft?.data || (dataQuotaDraft.data as any[]).length === 0) {
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
                setIsPdf(!isPdf)
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
            parameterSettings={parameterSettings}
            handleChangeProductPrincing={handleChangeProductPrincing}
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
            taxRoundingMethod={taxRoundingMethod}
            productPrincing={productPrincing}
            mainProduct={dataProducts?.data.main_product}
          />
          <OptionalInfo
            productPrincing={productPrincingOptional}
            optionalProduct={dataProducts?.data.optional_product}
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
                      isFetchingQuotaDraft
                    }
                  >
                    {t('buttons.apply_draft')}
                  </Button>
                )}
              {action === 'create' && (
                <Button
                  type="primary"
                  loading={isPendingDraft}
                  onClick={handleSaveDraft}
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
              {isEdit && (
                <DeleteButton
                  icon={null}
                  onSuccess={() => {
                    go({
                      to: '/quotas',
                    })
                  }}
                  autoInsertSpace={false}
                />
              )}
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
              {!isPendingPreviewPdf && (
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

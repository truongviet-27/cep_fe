import { useDebounce } from '@hook/use-debounce'
import type { ProductPackagingInputType } from '@interfaces/products'
import { useModalForm } from '@refinedev/antd'
import { useApiUrl, useCustom, useList, useParsed } from '@refinedev/core'
import type {
  CodeIssueSetting,
  ProductPackagingInput,
  ProductUnit,
} from '@sdk/hey-api'
import type { Category } from '@utility/renderCategories'
import { Form, type FormInstance } from 'antd'
import debounce from 'lodash/debounce'
import type { MutableRefObject } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { ProductFormType } from '../use-product-form'

export const useBasicInfoController = (
  form: FormInstance<ProductFormType>,
  addRef: MutableRefObject<
    ((defaultValue?: object, insertIndex?: number) => void) | undefined
  >,
  setIsAllowedSaveButton: (value: boolean) => void,
  setIsInitializingCode: (value: boolean) => void,
) => {
  const { params } = useParsed()
  const isCreateMode = !params?.id
  const apiUrl = useApiUrl()
  const [productUnitSearchText, setProductUnitSearchText] = useState<string>('')
  const [latestCodeIssueSetting, setLatestCodeIssueSetting] =
    useState<CodeIssueSetting>()
  const { getFieldValue, setFieldValue, setFieldsValue } = form
  const codeWatch = Form.useWatch('code', form)
  const unitWatch = Form.useWatch('unit', form)
  const barcodeWatch = Form.useWatch('barcode', form)
  const sellingPriceWatch = Form.useWatch('selling_price', form)

  const { refetch, isLoading: loadingPd } = useCustom<CodeIssueSetting>({
    url: `${apiUrl}/code-issue-settings/by-code/products`,
    method: 'get',
    queryOptions: {
      enabled: false,
    },
  })

  const fetchLatestCodeIssueSetting = useCallback(async () => {
    const response = await refetch()
    const data = response?.data?.data
    setLatestCodeIssueSetting(data)
    return data
  }, [refetch])

  const handleAutoNumber = async () => {
    form?.setFieldsValue({ code: undefined })
    const codeGen = await fetchLatestCodeIssueSetting()
    if (codeGen?.preview_code) {
      form?.setFieldsValue({ code: codeGen.preview_code })
    }
  }

  useEffect(() => {
    let isMounted = true

    const initializeCodeSetting = async () => {
      if (isCreateMode) {
        setIsInitializingCode(true)
        form?.setFieldsValue({ code: undefined })
      }

      try {
        const codeGen = await fetchLatestCodeIssueSetting()

        if (!isMounted || !isCreateMode) return

        if (
          codeGen?.issue_method === 'automatic' &&
          !form.isFieldTouched('code') &&
          codeGen?.preview_code
        ) {
          form?.setFieldsValue({ code: codeGen.preview_code })
        }
      } finally {
        if (isMounted && isCreateMode) {
          setIsInitializingCode(false)
        }
      }
    }

    initializeCodeSetting()

    return () => {
      isMounted = false
    }
  }, [fetchLatestCodeIssueSetting, form, isCreateMode, setIsInitializingCode])

  const modalFormProps = useModalForm({
    action: 'edit',
    resource: 'code-issue-settings',
    autoResetFormWhenClose: true,
    warnWhenUnsavedChanges: false,
    id: latestCodeIssueSetting?.id,
    defaultFormValues: {
      hash_dash: true,
    },
    redirect: false,
    onMutationSuccess: () => {
      fetchLatestCodeIssueSetting()
    },
  })

  const { data: productUnits, isFetching: isFetchingProductUnits } =
    useList<ProductUnit>({
      resource: 'product-units',
      filters: [
        {
          field: 'name_lk',
          operator: 'eq',
          value: productUnitSearchText,
        },
        {
          field: 'is_disable',
          operator: 'eq',
          value: false,
        },
        {
          field: '_per_page',
          operator: 'eq',
          value: 30,
        },
      ],
    })

  const handleSearchProductUnit = useMemo(() => {
    return debounce((value: string) => {
      setProductUnitSearchText(value)
    }, 500)
  }, [useDebounce, setProductUnitSearchText])

  const productUnitOptions = useMemo(() => {
    return (
      productUnits?.data?.map((unit) => ({
        label: unit.name,
        value: unit.id,
      })) || []
    )
  }, [productUnits])

  const orderNumberProductUnits = useMemo(() => {
    if (!productUnits?.data) return 1
    return (productUnits?.data[0]?.order ?? 0) + 1
  }, [productUnits?.data])

  const handleChooseCategory = useCallback(
    (
      level: number,
      currentPath: string[],
      currentCat: Category[],
      categoryId?: number,
    ) => {
      const fullPath = currentPath.join(' > ')
      setFieldValue('category', fullPath)
      setFieldValue('category_id', categoryId)
      if (level == 1) {
        setFieldValue('category_level_1', currentCat[0].id)
        setFieldValue('category_level_2', undefined)
        setFieldValue('category_level_3', undefined)
      } else if (level === 2) {
        setFieldValue('category_level_1', currentCat[0].id)
        setFieldValue('category_level_2', currentCat[1].id)
        setFieldValue('category_level_3', undefined)
      } else {
        setFieldValue('category_level_1', currentCat[0].id)
        setFieldValue('category_level_2', currentCat[1].id)
        setFieldValue('category_level_3', currentCat[2].id)
      }
    },
    [],
  )

  const handleAppendPackaging = async () => {
    try {
      await form.validateFields([
        'code',
        'name',
        'category',
        'unit_id',
        'cost_price',
        'selling_price',
      ])
      setIsAllowedSaveButton(true)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      return
    }

    const packagings: ProductPackagingInput[] = (getFieldValue('packagings') ??
      []) as ProductPackagingInput[]

    if (!packagings.length) {
      if (addRef.current) {
        addRef.current({
          code: getFieldValue('code'),
          name: getFieldValue('name'),
          status: 'active',
          quantity_in_package: 1,
          unit_id: getFieldValue('unit_id'),
          cost_price: getFieldValue('selling_price') * 1,
          selling_price: getFieldValue('selling_price'),
          is_standard_price: true,
          is_active: true,
          barcode: getFieldValue('barcode'),
        })
        //eslint-disable-next-line
        setFieldsValue({
          packagings: [
            {
              code: getFieldValue('code'),
              name: 'ピース',
              quantity_in_package: 1,
              unit_id: getFieldValue('unit_id'),
              selling_price: getFieldValue('selling_price'),
              is_standard_price: true,
              barcode: getFieldValue('barcode'),
            },
          ],
        })
      }
      return
    }

    setFieldsValue({
      packagings: packagings.map((item: object, index: number) => {
        return index === 0
          ? {
              ...item,
              barcode: getFieldValue('barcode'),
              selling_price: getFieldValue('selling_price'),
            }
          : {
              ...item,
              selling_price:
                getFieldValue('selling_price') *
                getFieldValue(['packagings', index, 'quantity_in_package']),
            }
      }),
    })
  }

  const handleBasicInfoChange = () => {
    const packagings = form.getFieldValue(
      'packagings',
    ) as ProductPackagingInputType[]

    if (!packagings?.length) return

    const packagingsUpdated = packagings.map((packaging, index) => ({
      ...packaging,
      unit: unitWatch,
      code: index
        ? codeWatch
          ? `${codeWatch}-${index}`
          : `${index}`
        : codeWatch,
      barcode: index ? packaging.barcode : barcodeWatch,
      selling_price:
        index === 0
          ? sellingPriceWatch
          : packaging?.is_standard_price
            ? Number(sellingPriceWatch || 0) *
              Number(packaging?.quantity_in_package || 1)
            : packaging?.selling_price,
    }))

    form.setFieldValue('packagings', packagingsUpdated)
  }

  const modalFormCategory = useModalForm({
    action: 'create',
    resource: 'product-categories',
    autoResetFormWhenClose: true,
    warnWhenUnsavedChanges: false,
    defaultFormValues: {
      hash_dash: true,
    },
  })

  useEffect(() => {
    handleBasicInfoChange()
  }, [codeWatch, unitWatch, barcodeWatch, sellingPriceWatch])

  const modalFormProductUnit = useModalForm({
    action: 'create',
    resource: 'product-units',
    autoResetFormWhenClose: true,
    warnWhenUnsavedChanges: false,
  })

  return [
    {
      loadingPd,
      isFetchingProductUnits,
      modalFormCategory,
      modalFormProps,
      codeIssueSetting: latestCodeIssueSetting,
      productUnitOptions,
      modalFormProductUnit,
      orderNumberProductUnits,
    },
    {
      handleAutoNumber,
      handleChooseCategory,
      handleSearchProductUnit,
      handleAppendPackaging,
    },
  ] as const
}

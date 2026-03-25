import { useDebounce } from '@hook/use-debounce'
import type { ProductPackagingInputType } from '@interfaces/products'
import { useModalForm } from '@refinedev/antd'
import { useApiUrl, useCustom, useList } from '@refinedev/core'
import type {
  CodeIssueSetting,
  ProductPackagingInput,
  ProductUnit,
} from '@sdk/hey-api'
import type { Category } from '@utility/renderCategories'
import { Form, type FormInstance } from 'antd'
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { ProductComboFormType } from '../use-product-combo-form'

export const useBasicInfoController = (
  form: FormInstance<ProductComboFormType>,
) => {
  const apiUrl = useApiUrl()
  const [productUnitSearchText, setProductUnitSearchText] = useState<string>('')
  const { getFieldValue, setFieldValue, setFieldsValue } = form
  const codeWatch = Form.useWatch('code', form)
  const unitWatch = Form.useWatch('unit', form)
  const barcodeWatch = Form.useWatch('barcode', form)
  const unitIdWatch = Form.useWatch('unit_id', form)
  const nameWatch = Form.useWatch('name', form)
  const sellingPriceWatch = Form.useWatch('selling_price', form)

  useEffect(() => {
    const currentPackagings = (getFieldValue('packagings') ??
      []) as ProductPackagingInput[]
    if (currentPackagings.length === 0) {
      if (codeWatch || nameWatch) {
        setFieldsValue({
          packagings: [
            {
              code: codeWatch,
              name: nameWatch,
              quantity_in_package: 1,
              unit_id: unitIdWatch,
              selling_price: sellingPriceWatch,
              is_standard_price: true,
              barcode: barcodeWatch,
            },
          ],
        })
      }
      return
    }
    const updatedPackagings = currentPackagings.map((item, index) => {
      if (index === 0) {
        return {
          ...item,
          code: codeWatch,
          name: nameWatch,
          unit_id: unitIdWatch,
          selling_price: sellingPriceWatch,
          barcode: barcodeWatch,
        }
      } else {
        return {
          ...item,
          selling_price:
            (sellingPriceWatch ?? 0) * (item.quantity_in_package ?? 1),
        }
      }
    })
    setFieldsValue({ packagings: updatedPackagings })
  }, [
    codeWatch,
    unitWatch,
    unitIdWatch,
    barcodeWatch,
    nameWatch,
    sellingPriceWatch,
  ])

  const {
    data: codeIssueSetting,
    refetch,
    isLoading: loadingPd,
  } = useCustom<CodeIssueSetting>({
    url: `${apiUrl}/code-issue-settings/by-code/products`,
    method: 'get',
  })

  const handleAutoNumber = () => {
    refetch().then(() => {
      const codeGen = codeIssueSetting?.data
      form?.setFieldsValue({ code: codeGen?.preview_code })
    })
  }

  const modalFormProps = useModalForm({
    action: 'edit',
    resource: 'code-issue-settings',
    autoResetFormWhenClose: true,
    warnWhenUnsavedChanges: false,
    id: codeIssueSetting?.data?.id,
    defaultFormValues: {
      hash_dash: true,
    },
    redirect: false,
    onMutationSuccess: () => {
      refetch()
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

  const modalFormProductUnit = useModalForm({
    action: 'create',
    resource: 'product-units',
    autoResetFormWhenClose: true,
    warnWhenUnsavedChanges: false,
  })

  useEffect(() => {
    handleBasicInfoChange()
  }, [codeWatch, unitWatch, barcodeWatch])

  return [
    {
      loadingPd,
      isFetchingProductUnits,
      modalFormCategory,
      modalFormProps,
      codeIssueSetting,
      productUnitOptions,
      modalFormProductUnit,
      orderNumberProductUnits,
    },
    {
      handleAutoNumber,
      handleChooseCategory,
      handleSearchProductUnit,
    },
  ] as const
}

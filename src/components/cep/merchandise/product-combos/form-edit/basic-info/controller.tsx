import { useDebounce } from '@hook/use-debounce'
import type { ProductPackagingInputType } from '@interfaces/products'
import { useModalForm } from '@refinedev/antd'
import type { GetListResponse } from '@refinedev/core'
import { useApiUrl, useCustom, useList } from '@refinedev/core'
import type {
  CodeIssueSetting,
  ProductPackagingInput,
  ProductUnit,
  Rank,
} from '@sdk/hey-api'
import type { Category } from '@utility/renderCategories'
import { Form, type FormInstance } from 'antd'
import debounce from 'lodash/debounce'
import type { MutableRefObject } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { ProductComboFormType } from '../use-product-combo-form'

export const useBasicInfoController = (
  form: FormInstance<ProductComboFormType>,
  addRef: MutableRefObject<
    ((defaultValue?: object, insertIndex?: number) => void) | undefined
  >,
  setIsAllowedSaveButton: (value: boolean) => void,
  ranks?: GetListResponse<Rank>,
) => {
  const apiUrl = useApiUrl()
  const [productUnitSearchText, setProductUnitSearchText] = useState<string>('')
  const { getFieldValue, setFieldValue, setFieldsValue } = form
  const codeWatch = Form.useWatch('code', form)
  const unitWatch = Form.useWatch('unit', form)
  const barcodeWatch = Form.useWatch('barcode', form)

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

    const rankObject: Record<string, number> = {}

    ranks?.data?.forEach(({ id, rate }) => {
      rankObject[`rank_${id}`] = Math.round(
        ((rate ?? 0) / 100) * getFieldValue('selling_price'),
      )
    })

    if (!packagings.length) {
      if (addRef.current) {
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
              is_rate_based: true,
              barcode: getFieldValue('barcode'),
              ...rankObject,
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
              selling_price: getFieldValue('selling_price'),
              ...rankObject,
            }
          : {
              ...item,
              selling_price:
                getFieldValue('selling_price') *
                getFieldValue(['packagings', index, 'quantity_in_package']),
              is_rate_based: true,
              ...rankObject,
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
  }, [codeWatch, unitWatch, barcodeWatch])

  return [
    {
      loadingPd,
      isFetchingProductUnits,
      modalFormCategory,
      modalFormProps,
      codeIssueSetting,
      productUnitOptions,
    },
    {
      handleAutoNumber,
      handleChooseCategory,
      handleSearchProductUnit,
      handleAppendPackaging,
    },
  ] as const
}

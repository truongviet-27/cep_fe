import { useDebounce } from '@hook/use-debounce'
import { useModalForm } from '@refinedev/antd'
import { useApiUrl, useCustom, useList } from '@refinedev/core'
import type { CodeIssueSetting, ProductUnit } from '@sdk/hey-api'
import type { Category } from '@utility/renderCategories'
import type { FormInstance } from 'antd'
import debounce from 'lodash/debounce'
import type { MutableRefObject } from 'react'
import { useCallback, useMemo, useState } from 'react'

import type { ProductFormType } from '../use-product-form'

export const useBasicInfoController = (
  form: FormInstance<ProductFormType>,
  addRef: MutableRefObject<
    ((defaultValue?: object, insertIndex?: number) => void) | undefined
  >,
) => {
  const apiUrl = useApiUrl()
  const [productUnitSearchText, setProductUnitSearchText] = useState<string>('')
  const [isAppend, setIsAppend] = useState<boolean>(false)
  const { getFieldValue, setFieldValue, setFieldsValue } = form

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
      form?.setFieldsValue({ code: codeGen?.preview_code, name: codeGen?.name })
    })
  }

  const modalFormProps = useModalForm({
    action: 'edit',
    resource: 'code-issue-settings',
    autoResetFormWhenClose: true,
    warnWhenUnsavedChanges: false,
    defaultFormValues: {
      hash_dash: true,
    },
  })

  const name_lk_value = useDebounce(getFieldValue('name_lk'), 500)

  const { data: dataProductCategories } = useList<Category>({
    resource: 'product-categories',
    filters: [
      {
        field: 'name_lk',
        operator: 'eq',
        value: name_lk_value,
      },
    ],
    // queryOptions: {
    //   enabled: !!name_lk_value,
    // },
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
      ],
      // queryOptions: {
      //   enabled: !!name_lk_value,
      // },
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
    [dataProductCategories],
  )

  const handleAppendPackaging = async () => {
    await form.validateFields()
    setIsAppend(true)
    if (getFieldValue(['packagings']).length === 0) {
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
          is_rate_based: true,
        })
      }
      return
    }

    setFieldsValue({
      packagings: getFieldValue('packagings').map(
        (item: object, index: number) => {
          return index === 0
            ? {
                code: getFieldValue('code'),
                name: getFieldValue('name'),
                status: 'active',
                quantity_in_package: 1,
                unit_id: getFieldValue('unit_id'),
                cost_price: getFieldValue('cost_price') * 1,
                selling_price: getFieldValue('selling_price'),
                is_standard_price: true,
                is_rate_based: true,
                is_active: true,
              }
            : {
                ...item,
                code: `${getFieldValue('code')}-${index + 1}`,
                cost_price:
                  getFieldValue('cost_price') *
                  getFieldValue(['packagings', index, 'quantity_in_package']),
                quantity_in_package: getFieldValue([
                  'packagings',
                  index,
                  'quantity_in_package',
                ]),
                selling_price:
                  getFieldValue('selling_price') *
                  getFieldValue(['packagings', index, 'quantity_in_package']),
                is_rate_based: true,
                is_active: true,
              }
        },
      ),
    })
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

  return [
    {
      isAppend,
      loadingPd,
      isFetchingProductUnits,
      modalFormCategory,
      modalFormProps,
      codeIssueSetting,
      dataProductCategories,
      productUnitOptions,
    },
    {
      handleAutoNumber,
      handleChooseCategory,
      handleSearchProductUnit,
      handleAppendPackaging,
      setIsAppend,
    },
  ] as const
}

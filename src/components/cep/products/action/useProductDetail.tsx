import { useDebounce } from '@hook/use-debounce'
import { useForm } from '@refinedev/antd'
import { useList, useShow, useTranslate } from '@refinedev/core'
import type { Category } from '@utility/renderCategories'
import { Form, Radio } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useCallback, useMemo, useState } from 'react'

export type FormType = {
  code: string
  name: string
  short_name: string
  barcode: string
  category: string
  unit: string
  costPrice: number
  sellingPrice: number
  note: string
  info: Info[]
  price: []

  // add field new
  name_lk?: string
  category_level_1?: number
  category_level_2?: number
  category_level_3?: number
}
type Info = {
  packageCode: string
  packageName: string
  status: string
  quantity: number
  unit: string
  standardPrice: number | null
  salesPrice: number | null
  standardPrint: boolean
}
function useProductDetail() {
  const t = useTranslate()
  const methods = useForm<FormType>({
    defaultFormValues: {
      code: '',
      name: '',
      short_name: '',
      barcode: '',
      category: '',
      unit: '',
      costPrice: '',
      sellingPrice: '',
      note: '',
      info: [],
      price: [],
    },
  })

  const { form } = methods

  const { getFieldValue, setFieldValue } = form

  const [isAppend, setIsAppend] = useState(false)

  const {} = useShow({
    resource: 'products',
    id: 1,
    queryOptions: {
      enabled: false,
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
    queryOptions: {
      enabled: !!name_lk_value,
    },
  })

  const handleChooseCategory = useCallback(
    (level: number, currentPath: string[], currentCat: Category[]) => {
      const fullPath = currentPath.join(' > ')
      setFieldValue('category', fullPath)
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

  const columnsPackagePrice = useMemo(() => {
    return [
      {
        title: '荷姿コード',
        dataIndex: 'packageCode',
        align: 'center',
        key: 'packageCode',
      },
      {
        title: '荷姿名',
        dataIndex: 'packageName',
        align: 'center',
        key: 'packageName',
      },
      {
        title: '販売価格(円)',
        dataIndex: 'salesPrice',
        align: 'center',
        key: 'salesPrice',
      },
      {
        title: '設定方式',
        dataIndex: 'status',
        align: 'center',
        key: 'status',
      },
      {
        title: 'S 80%(円)',
        dataIndex: 'sPrice',
        align: 'center',
        key: 'sPrice',
      },
      {
        title: 'A 85%(円)',
        dataIndex: 'aPrice',
        align: 'center',
        key: 'aPrice',
      },
      {
        title: 'B 90%(円)',
        dataIndex: 'bPrice',
        align: 'center',
        key: 'bPrice',
      },
      {
        title: 'C 95%(円)',
        dataIndex: 'cPrice',
        align: 'center',
        key: 'cPrice',
      },
      {
        title: 'D 100%(円)',
        dataIndex: 'dPrice',
        align: 'center',
        key: 'dPrice',
      },
      {
        title: 'E 105%(円)',
        dataIndex: 'ePrice',
        align: 'center',
        key: 'ePrice',
      },
    ] as ColumnsType
  }, [t])

  const dataSourcePackagePrice = [].map((item, index) => {
    const index0 = index === 0
    if (index0 && isAppend) {
      return {
        packageCode: getFieldValue('code'),
        packageName: getFieldValue('name'),
        salesPrice: getFieldValue(`sellingPrice`),
        status: '有効',
        sPrice: (getFieldValue(`sellingPrice`) * 0.8).toFixed(3),
        aPrice: (getFieldValue(`sellingPrice`) * 0.85).toFixed(3),
        bPrice: (getFieldValue(`sellingPrice`) * 0.9).toFixed(3),
        cPrice: (getFieldValue(`sellingPrice`) * 0.95).toFixed(3),
        dPrice: (getFieldValue(`sellingPrice`) * 1).toFixed(3),
        ePrice: (getFieldValue(`sellingPrice`) * 1.05).toFixed(3),
      }
    } else if (getFieldValue(`info.${index}.status`) === 'inactive') {
      return {
        packageCode: getFieldValue(`info.${index}.packageCode`),
        packageName: getFieldValue(`info.${index}.packageName`),
        salesPrice: getFieldValue(`info.${index}.salesPrice`),
        status: (
          <Form.Item name={`info.${index}.status`}>
            <Radio.Group
              options={[
                {
                  value: 'active',
                  label: t('有効'),
                },
                {
                  value: 'inactive',
                  label: t('無効'),
                },
              ]}
            />
          </Form.Item>
        ),
        sPrice: (getFieldValue(`info.${index}.salesPrice`) * 0.8).toFixed(3),
        aPrice: (getFieldValue(`info.${index}.salesPrice`) * 0.85).toFixed(3),
        bPrice: (getFieldValue(`info.${index}.salesPrice`) * 0.9).toFixed(3),
        cPrice: (getFieldValue(`info.${index}.salesPrice`) * 0.95).toFixed(3),
        dPrice: (getFieldValue(`info.${index}.salesPrice`) * 1).toFixed(3),
        ePrice: (getFieldValue(`info.${index}.salesPrice`) * 1.05).toFixed(3),
      }
    }
    return {
      packageCode: getFieldValue(`info.${index}.packageCode`),
      packageName: getFieldValue(`info.${index}.packageName`),
      salesPrice: getFieldValue(`info.${index}.salesPrice`),
      status: (
        <Form.Item name={`info.${index}.status`}>
          <Radio.Group
            options={[
              {
                value: 'active',
                label: t('有効'),
              },
              {
                value: 'inactive',
                label: t('無効'),
              },
            ]}
          />
        </Form.Item>
      ),
      sPrice: (getFieldValue(`info.${index}.salesPrice`) * 0.8).toFixed(3),
      aPrice: (getFieldValue(`info.${index}.salesPrice`) * 0.85).toFixed(3),
      bPrice: (getFieldValue(`info.${index}.salesPrice`) * 0.9).toFixed(3),
      cPrice: (getFieldValue(`info.${index}.salesPrice`) * 0.95).toFixed(3),
      dPrice: (getFieldValue(`info.${index}.salesPrice`) * 1).toFixed(3),
      ePrice: (getFieldValue(`info.${index}.salesPrice`) * 1.05).toFixed(3),
    }
  })

  const onSubmit = () => {
    console.log('xxxxxxxxxxxxxxx')
  }

  return [
    {
      methods,
      columnsPackagePrice,
      dataSourcePackagePrice,
      isAppend,
      dataProductCategories,
    },
    { t, onSubmit, setIsAppend, handleChooseCategory },
  ] as const
}

export default useProductDetail

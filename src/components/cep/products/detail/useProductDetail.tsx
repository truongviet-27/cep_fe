import { useDebounce } from '@hook/use-debounce'
import { useList, useShow, useTranslate } from '@refinedev/core'
import type { Category } from '@utility/renderCategories'
import { Button, Checkbox, Input, InputNumber, Radio } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useCallback, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

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
  status: string // hoặc "有効" | "無効"
  quantity: number
  unit: string
  standardPrice: number
  salesPrice: number
  standardPrint: boolean // hoặc "あり" | "なし"
}
function useProductDetail() {
  const t = useTranslate()
  const methods = useForm<FormType>({
    defaultValues: {
      code: '',
      name: '',
      short_name: '',
      barcode: '',
      category: '',
      unit: '',
      costPrice: 0,
      sellingPrice: 0,
      note: '',
      info: [],
      price: [],
    },
  })

  const { control, handleSubmit, getValues, watch, setValue } = methods

  const [isAppend, setIsAppend] = useState(false)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'info',
    keyName: 'key',
  })

  const {} = useShow({
    resource: 'products',
    id: 1,
    queryOptions: {
      enabled: false,
    },
  })

  const name_lk_value = useDebounce(watch('name_lk'), 500)

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
      setValue('category', fullPath)
      if (level == 1) {
        setValue('category_level_1', currentCat[0].id)
        setValue('category_level_2', undefined)
        setValue('category_level_3', undefined)
      } else if (level === 2) {
        setValue('category_level_1', currentCat[0].id)
        setValue('category_level_2', currentCat[1].id)
        setValue('category_level_3', undefined)
      } else {
        setValue('category_level_1', currentCat[0].id)
        setValue('category_level_2', currentCat[1].id)
        setValue('category_level_3', currentCat[2].id)
      }
    },
    [dataProductCategories],
  )

  const columnsPackageInfo = useMemo(() => {
    return [
      {
        title: '荷姿コード',
        dataIndex: 'packageCode',
        align: 'center',
        key: 'packageCode',
        width: '200px',
      },
      {
        title: '荷姿名',
        dataIndex: 'packageName',
        align: 'center',
        key: 'packageName',
        width: '300px',
      },
      {
        title: 'ステータス',
        dataIndex: 'status',
        align: 'center',
        key: 'status',
        width: '200px',
      },
      {
        title: '入数',
        dataIndex: 'quantity',
        align: 'center',
        key: 'quantity',
        width: '150px',
      },
      {
        title: '単位',
        dataIndex: 'unit',
        align: 'center',
        key: 'unit',
      },
      {
        title: '標準価格(円)',
        dataIndex: 'standardPrice',
        align: 'center',
        key: 'standardPrice',
        width: '200px',
      },
      {
        title: '販売価格(円)',
        dataIndex: 'salesPrice',
        align: 'center',
        key: 'salesPrice',
        width: '200px',
      },
      {
        title: '標準印刷',
        dataIndex: 'standardPrint',
        align: 'center',
        key: 'standardPrint',
        width: '100px',
      },
      {
        title: '操作',
        align: 'center',
        key: 'action',
        dataIndex: 'action',
      },
    ] as ColumnsType
  }, [t])

  const dataSourcePackageInfo = fields.map((item, index) => {
    const index0 = index === 0
    if (index0 && isAppend) {
      return {
        ...item,
        packageCode: getValues('code'),
        packageName: getValues('name'),
        status: '有効',
        quantity: 1,
        unit: getValues('unit'),
        standardPrice: getValues('sellingPrice'),
        salesPrice: getValues('sellingPrice'),
        standardPrint: true,
      }
    } else if (watch(`info.${index}.status`) === 'inactive') {
      return {
        ...item,
        packageCode: getValues(`info.${index}.packageCode`),
        packageName: getValues(`info.${index}.packageName`),
        status: (
          <Controller
            name={`info.${index}.status`}
            control={control}
            render={({ field }) => {
              return (
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
                  {...field}
                />
              )
            }}
          />
        ),
        quantity: getValues(`info.${index}.quantity`),
        unit: getValues(`info.${index}.unit`),
        standardPrice:
          watch(`info.${index}.quantity`) * getValues(`sellingPrice`),
        salesPrice: watch(`info.${index}.quantity`) * getValues(`sellingPrice`),
        standardPrint: (
          <Checkbox
            style={{ transform: 'scale(1.3)' }}
            checked={getValues(`info.${index}.standardPrint`)}
          />
        ),
        action: index > 0 && (
          <Button
            onClick={() => {
              remove(index)
            }}
            style={{
              backgroundColor: '#721C24',
              borderColor: '#721C24',
              color: '#fff',
            }}
          >
            {t('削除')}
          </Button>
        ),
      }
    }
    return {
      ...item,
      packageName: (
        <Controller
          name={`info.${index}.packageName`}
          control={control}
          render={({ field }) => {
            return (
              <Input
                {...field}
                readOnly={index0}
                style={{
                  ...(index0
                    ? {
                        background: 'transparent',
                        paddingLeft: 0,
                        color: 'inherit',
                        border: 'none',
                        boxShadow: 'none',
                        cursor: 'default',
                      }
                    : {}),
                }}
              />
            )
          }}
        />
      ),
      status: (
        <Controller
          name={`info.${index}.status`}
          control={control}
          render={({ field }) => {
            return (
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
                {...field}
              />
            )
          }}
        />
      ),
      quantity: (
        <Controller
          name={`info.${index}.quantity`}
          control={control}
          render={({ field: { onChange, ...rest } }) => {
            return (
              <InputNumber
                {...rest}
                controls={false}
                readOnly={index0}
                style={{
                  ...(index0
                    ? {
                        background: 'transparent',
                        paddingLeft: 0,
                        color: 'inherit',
                        border: 'none',
                        boxShadow: 'none',
                        cursor: 'default',
                      }
                    : {}),
                }}
                onChange={(e) => {
                  onChange(e)
                  setValue(
                    `info.${index}.salesPrice`,
                    watch(`info.${index}.quantity`) * getValues(`sellingPrice`),
                  )
                }}
              />
            )
          }}
        />
      ),
      standardPrice:
        watch(`info.${index}.quantity`) * getValues(`sellingPrice`),
      salesPrice: (
        <Controller
          name={`info.${index}.salesPrice`}
          control={control}
          render={({ field }) => {
            return (
              <InputNumber
                {...field}
                controls={false}
                readOnly={index0}
                style={{
                  ...(index0
                    ? {
                        background: 'transparent',
                        paddingLeft: 0,
                        color: 'inherit',
                        border: 'none',
                        boxShadow: 'none',
                        cursor: 'default',
                      }
                    : {}),
                }}
              />
            )
          }}
        />
      ),
      standardPrint: (
        <Controller
          name={`info.${index}.standardPrint`}
          control={control}
          render={({ field }) => {
            return (
              <Checkbox
                style={{ transform: 'scale(1.3)' }}
                {...field}
                checked={field.value}
              />
            )
          }}
        />
      ),
      action: index > 0 && (
        <Button
          onClick={() => {
            remove(index)
          }}
          style={{
            backgroundColor: '#721C24',
            borderColor: '#721C24',
            color: '#fff',
          }}
        >
          {t('削除')}
        </Button>
      ),
    }
  })

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

  const dataSourcePackagePrice = fields.map((item, index) => {
    const index0 = index === 0
    if (index0 && isAppend) {
      return {
        ...item,
        packageCode: getValues('code'),
        packageName: getValues('name'),
        salesPrice: getValues(`sellingPrice`),
        status: '有効',
        sPrice: (getValues(`sellingPrice`) * 0.8).toFixed(3),
        aPrice: (getValues(`sellingPrice`) * 0.85).toFixed(3),
        bPrice: (getValues(`sellingPrice`) * 0.9).toFixed(3),
        cPrice: (getValues(`sellingPrice`) * 0.95).toFixed(3),
        dPrice: (getValues(`sellingPrice`) * 1).toFixed(3),
        ePrice: (getValues(`sellingPrice`) * 1.05).toFixed(3),
      }
    } else if (watch(`info.${index}.status`) === 'inactive') {
      return {
        ...item,
        packageCode: watch(`info.${index}.packageCode`),
        packageName: watch(`info.${index}.packageName`),
        salesPrice: getValues(`info.${index}.salesPrice`),
        status: (
          <Controller
            name={`info.${index}.status`}
            control={control}
            render={({ field }) => {
              return (
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
                  {...field}
                />
              )
            }}
          />
        ),
        sPrice: (getValues(`info.${index}.salesPrice`) * 0.8).toFixed(3),
        aPrice: (getValues(`info.${index}.salesPrice`) * 0.85).toFixed(3),
        bPrice: (getValues(`info.${index}.salesPrice`) * 0.9).toFixed(3),
        cPrice: (getValues(`info.${index}.salesPrice`) * 0.95).toFixed(3),
        dPrice: (getValues(`info.${index}.salesPrice`) * 1).toFixed(3),
        ePrice: (getValues(`info.${index}.salesPrice`) * 1.05).toFixed(3),
      }
    }
    return {
      ...item,
      packageCode: watch(`info.${index}.packageCode`),
      packageName: watch(`info.${index}.packageName`),
      salesPrice: watch(`info.${index}.salesPrice`),
      status: (
        <Controller
          name={`info.${index}.status`}
          control={control}
          render={({ field }) => {
            return (
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
                {...field}
              />
            )
          }}
        />
      ),
      sPrice: (getValues(`info.${index}.salesPrice`) * 0.8).toFixed(3),
      aPrice: (getValues(`info.${index}.salesPrice`) * 0.85).toFixed(3),
      bPrice: (getValues(`info.${index}.salesPrice`) * 0.9).toFixed(3),
      cPrice: (getValues(`info.${index}.salesPrice`) * 0.95).toFixed(3),
      dPrice: (getValues(`info.${index}.salesPrice`) * 1).toFixed(3),
      ePrice: (getValues(`info.${index}.salesPrice`) * 1.05).toFixed(3),
    }
  })

  const onSubmit = handleSubmit((data) => {
    console.log(data, 'xxxxxxxxxxxxxxx')
  })

  return [
    {
      methods,
      columnsPackageInfo,
      dataSourcePackageInfo,
      columnsPackagePrice,
      dataSourcePackagePrice,
      fields,
      isAppend,
      dataProductCategories,
    },
    { t, append, onSubmit, setIsAppend, handleChooseCategory },
  ] as const
}

export default useProductDetail

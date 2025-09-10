import { useTranslate } from '@refinedev/core'
import { useForm } from '@refinedev/react-hook-form'
import { Button, Checkbox, Input, InputNumber, Radio } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'

export type FormType = {
  code: string
  name: string
  shortName: string
  barcode: string
  category: string
  nit: string
  costPrice: number
  sellingPrice: number
  note: string
  info: Info[]
  price: []
}
type Info = {
  packageCode: string
  packageName: string
  status: string // hoặc "有効" | "無効"
  quantity: number
  unit: string
  standardPrice: number
  salesPrice: number
  standardPrint: string // hoặc "あり" | "なし"
}
function useProductDetail() {
  const t = useTranslate()
  const methods = useForm<FormType>({
    defaultValues: {
      code: '',
      name: '',
      shortName: '',
      barcode: '',
      category: '',
      nit: '',
      costPrice: 0,
      sellingPrice: 0,
      note: '',
      info: [],
      price: [],
    },
  })

  const { control, handleSubmit } = methods

  const [isAppend, setIsAppend] = useState(false)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'info',
    keyName: 'key',
  })

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
            return <Checkbox style={{ transform: 'scale(1.3)' }} {...field} />
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
        dataIndex: 'settingMethod',
        align: 'center',
        key: 'settingMethod',
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

  const dataSourcePackagePrice = [
    {
      key: '1',
      packageCode: 'PKG002',
      packageName: 'パレット',
      salesPrice: 5000,
      settingMethod: '自動',
      sPrice: 4000,
      aPrice: 4250,
      bPrice: 4500,
      cPrice: 4750,
      dPrice: 5000,
      ePrice: 5250,
    },
  ]

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
    },
    { t, append, onSubmit, setIsAppend },
  ] as const
}

export default useProductDetail

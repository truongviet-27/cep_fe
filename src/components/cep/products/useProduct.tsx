import { useDebounce } from '@hook/use-debounce'
import { useForm } from '@refinedev/antd'
import type { HttpError } from '@refinedev/core'
import { useList, useTable, useTranslate } from '@refinedev/core'
import type { Category } from '@utility/renderCategories'
import { Form } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Link from 'next/link'
import { useCallback, useMemo } from 'react'

type Form = {
  search?: string
  category?: string
  name_lk?: string
  category_level_1?: number
  category_level_2?: number
  category_level_3?: number
  id: number
  code: string
  name: string
  barcode: string
  unit: string
  packaging_count: number
  cost_price: number
  sale_price: number
}

function useProduct() {
  const t = useTranslate()
  const methods = useForm()

  const { form } = methods

  const { setFieldValue, getFieldValue, resetFields } = form

  const name_lk_value = useDebounce(Form.useWatch('name_lk', form), 500)

  const { current, setCurrent, pageSize, setPageSize, pageCount } = useTable<
    Form,
    HttpError
  >({
    queryOptions: {
      enabled: false,
    },
  })

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

  const onChangePageSize = (page: number, pageSize: number) => {
    setCurrent(page)
    setPageSize(pageSize)
  }

  const columns = useMemo(() => {
    return [
      {
        title: t('商品コード'), // Product Code
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: t('商品名'), // Product Name
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: t('受渡数'), // packaging_count
        dataIndex: 'packaging_count',
        key: 'packaging_count',
      },
      {
        title: t('バーコード'), // barcode
        dataIndex: 'barcode',
        key: 'barcode',
      },
      {
        title: t('カテゴリ(小)'), // Category small
        dataIndex: 'category_level_1',
        key: 'category_level_1',
      },
      {
        title: t('単位'), // Unit
        dataIndex: 'unit',
        key: 'unit',
      },
      {
        title: t('原価 (円)'), // cost_price (JPY)
        dataIndex: 'cost_price',
        key: 'cost_price',
        align: 'right',
      },
      {
        title: t('販売価格 (円)'), // sale_price (JPY)
        dataIndex: 'sale_price',
        key: 'sale_price',
        align: 'right',
      },
    ] as ColumnsType
  }, [t])

  const dataSource = [
    {
      id: 1,
      code: (
        <Link
          href={`/products/show/${1}?actionType=VIEW`}
          className="!underline"
        >
          PROD001
        </Link>
      ),
      name: 'システム設計・開発',
      packaging_count: '-',
      barcode: '1001930006191',
      category_level_1: 'ソフトウェア開発',
      unit: '人日',
      cost_price: '600,000',
      sale_price: '800,000',
    },
  ]

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

  // const renderCategories = (
  //   categories: Category[],
  //   level = 1,
  //   parents: string[] = [],
  //   parentsCat: Category[] = [],
  // ) => {
  //   return (
  //     <>
  //       {categories.map((cat) => {
  //         const hasChildren = cat.children && cat.children.length > 0
  //         const currentPath = [...parents, cat.name]
  //         const currentCat = [...parentsCat, cat]

  //         return (
  //           <div
  //             key={cat.id}
  //             style={{
  //               padding: '4px 8px',
  //               paddingLeft: `${level * 8}px`,
  //               cursor: 'pointer',
  //               width: '100%',
  //             }}
  //             onClick={(e) => {
  //               e.stopPropagation()
  //               handleChooseCategory(level, currentPath, currentCat)
  //             }}
  //           >
  //             {cat.name}
  //             {hasChildren &&
  //               renderCategories(
  //                 cat.children,
  //                 level + 1,
  //                 currentPath,
  //                 currentCat,
  //               )}
  //           </div>
  //         )
  //       })}
  //     </>
  //   )
  // }

  const onSubmit = () => {
    console.log(
      getFieldValue('category_level_1'),
      getFieldValue('category_level_2'),
      getFieldValue('category_level_3'),
      getFieldValue('search'),
      'sdasdasdf',
    )
  }

  const onReset = () => {
    resetFields()
  }

  return [
    {
      methods,
      dataSource,
      columns,
      page: current,
      pageSize,
      total: pageCount,
      dataProductCategories,
    },
    { t, onChangePageSize, onSubmit, onReset, handleChooseCategory },
  ] as const
}

export default useProduct

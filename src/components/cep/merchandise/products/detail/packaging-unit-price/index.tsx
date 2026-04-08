import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import type { ProductDetail } from '@sdk/hey-api'
import type { ColumnsType } from 'antd/es/table'

interface PackagingUnitPriceProps {
  product: ProductDetail
}

const PackagingUnitPrice: React.FC<PackagingUnitPriceProps> = ({ product }) => {
  const t = useTranslate()
  const baseColumns = [
    {
      title: t('products.fields.packagingCode'),
      dataIndex: 'code',
      align: 'left',
    },
    {
      title: t('products.fields.packagingName'),
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: t('products.fields.barcode'),
      dataIndex: 'barcode',
      align: 'right',
    },
    {
      title: t('products.fields.quantity'),
      dataIndex: 'quantity_in_package',
      align: 'right',
      render: (value: number) =>
        value !== null && value !== undefined ? value.toLocaleString() : '-',
    },
    {
      title: t('products.fields.unit'),
      dataIndex: 'unit',
      align: 'left',
    },
    {
      title: t('products.fields.standardPrice'),
      dataIndex: 'standard_price',
      align: 'right',
      render: (value: number) =>
        value !== null && value !== undefined ? value.toLocaleString() : '-',
    },
    {
      title: t('products.fields.sellingPrice'),
      dataIndex: 'selling_price',
      align: 'right',
      render: (value: number) =>
        value !== null && value !== undefined ? value.toLocaleString() : '-',
    },
  ] as ColumnsType

  const columns: ColumnsType = baseColumns.map((column) => ({
    ...column,
    onHeaderCell: () => ({
      style: { textAlign: 'center' },
    }),
  }))

  const dataSource = product?.packagings || []

  return (
    <div className={dataSource?.length <= 1 ? 'hidden' : 'block'}>
      <div className="m-3 font-bold">
        {t('products.sections.packagingPrice')}
      </div>

      <CommonTable
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ y: 55 * 5 }}
      />
    </div>
  )
}

export default PackagingUnitPrice

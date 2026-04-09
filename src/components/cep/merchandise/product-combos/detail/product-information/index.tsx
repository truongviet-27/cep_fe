import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import type { ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'

import type { ComboProductComponent } from '../use-product-combo-detail'

interface ProductInformationProps {
  products: ComboProductComponent[]
}

const ProductInformation: React.FC<ProductInformationProps> = ({
  products,
}) => {
  const t = useTranslate()
  const baseColumns = [
    {
      title: t('product_combos.productInfoTable.header.productCode'),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: t('product_combos.productInfoTable.header.productName'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('product_combos.fields.barcode'),
      dataIndex: 'barcode',
      key: 'barcode',
    },
    {
      title: t('product_combos.fields.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: number) =>
        value !== null && value !== undefined ? value.toLocaleString() : '',
    },
    {
      title: t('product_combos.fields.unit'),
      dataIndex: 'unit_name',
      key: 'unit_name',
    },
    {
      title: t('product_combos.fields.costPrice'),
      dataIndex: 'cost_price',
      key: 'cost_price',
      render: (value: number) =>
        value !== null && value !== undefined ? value.toLocaleString() : '',
    },
    {
      title: t('product_combos.fields.sellingPrice'),
      dataIndex: 'selling_price',
      key: 'selling_price',
      render: (value: number) =>
        value !== null && value !== undefined ? value.toLocaleString() : '',
    },
  ] as ColumnsType

  const numberColumnKeys = [
    'barcode',
    'quantity',
    'cost_price',
    'selling_price',
  ]
  const columns = baseColumns.map((column) => {
    const dataIndex =
      'dataIndex' in column && column.dataIndex !== undefined
        ? column.dataIndex
        : ''
    const key = String(column.key ?? dataIndex)

    return {
      ...column,
      align: numberColumnKeys.includes(key) ? 'right' : 'left',
      onHeaderCell: () => ({ style: { textAlign: 'center' } }),
      onCell: () => ({ style: { padding: '8px 12px' } }),
    }
  }) as ColumnsType

  return (
    <div>
      <div className="m-3 font-bold">
        {t('product_combos.sections.productInformation')}
      </div>

      <CommonTable
        columns={columns}
        dataSource={products}
        pagination={false}
        scroll={{ y: 55 * 5 }}
        summary={
          products.length < 1
            ? () => (
                <Table.Summary.Row className="!bg-white">
                  <Table.Summary.Cell
                    index={0}
                    colSpan={7}
                    align="center"
                    className="!p-[11px] text-gray-300"
                  >
                    データがありません。
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )
            : undefined
        }
      />
    </div>
  )
}

export default ProductInformation

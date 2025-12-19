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
  const columns = [
    {
      title: t('product_combos.productInfoTable.header.productCode'),
      dataIndex: 'code',
    },
    {
      title: t('product_combos.productInfoTable.header.productName'),
      dataIndex: 'name',
    },
    {
      title: t('product_combos.fields.barcode'),
      dataIndex: 'barcode',
    },
    {
      title: t('product_combos.fields.quantity'),
      dataIndex: 'quantity',
    },
    {
      title: t('product_combos.fields.unit'),
      dataIndex: 'unit_name',
    },
    {
      title: t('product_combos.fields.costPrice'),
      dataIndex: 'cost_price',
    },
    {
      title: t('product_combos.fields.sellingPrice'),
      dataIndex: 'selling_price',
    },
  ] as ColumnsType

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

import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import { Form } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const Packaging: React.FC = () => {
  const form = Form.useFormInstance()
  const { getFieldValue } = form
  const t = useTranslate()

  return (
    <div className="px-2">
      <Form.List name={'packagings'}>
        {(fields) => {
          const columns = [
            {
              title: t('product_combos.fields.assortmentCode'),
              dataIndex: 'code',
              key: 'code',
              width: 200,
              render: (_: unknown, __: unknown, index: number) => {
                return (
                  <Form.Item
                    shouldUpdate
                    className="ant-form-item-hidden-margin"
                  >
                    {() => getFieldValue(['packagings', index, 'code'])}
                  </Form.Item>
                )
              },
            },
            {
              title: t('product_combos.fields.assortmentName'),
              dataIndex: 'name',
              key: 'name',
              width: 200,
              render: () => {
                return (
                  <Form.Item
                    shouldUpdate
                    className="ant-form-item-hidden-margin"
                  >
                    {() => getFieldValue(['name'])}
                  </Form.Item>
                )
              },
            },
            {
              title: t('products.unitPriceGroup.sellingPrice'),
              dataIndex: 'selling_price',
              key: 'selling_price',
              width: 200,
              render: (_: unknown, __: unknown, index: number) => {
                return (
                  <Form.Item
                    shouldUpdate
                    className="ant-form-item-hidden-margin"
                  >
                    {() =>
                      Number(
                        getFieldValue(['packagings', index, 'selling_price']),
                      ).toLocaleString()
                    }
                  </Form.Item>
                )
              },
            },
          ] as ColumnsType
          return (
            <Form.Item shouldUpdate>
              {({ getFieldValue }) => {
                return (
                  <CommonTable
                    columns={columns}
                    dataSource={fields}
                    bordered
                    pagination={false}
                    rowClassName={(_, index) => {
                      return getFieldValue(['packagings', index, 'status']) ===
                        t('products.text.inactive')
                        ? 'bg-[#BBBBBB] hover:!bg-[#ccc]'
                        : ''
                    }}
                    scroll={
                      fields.length ? { y: 55 * 5, x: 1500 } : { x: 1000 }
                    }
                    locale={{
                      emptyText: (
                        <div className="text-center text-gray-300">
                          データがありません。
                        </div>
                      ),
                    }}
                  />
                )
              }}
            </Form.Item>
          )
        }}
      </Form.List>
    </div>
  )
}

export default Packaging

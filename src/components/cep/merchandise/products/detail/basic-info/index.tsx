import { DownOutlined } from '@ant-design/icons'
import { useTranslate } from '@refinedev/core'
import type { ProductDetail } from '@sdk/hey-api'
import { PRIMARY } from '@utility/color'
import { Collapse, Flex } from 'antd'
import { Space } from 'antd/lib'

interface BasicInfoProps {
  product: ProductDetail
}

const BasicInfo: React.FC<BasicInfoProps> = ({ product }) => {
  const t = useTranslate()

  return (
    <Collapse
      items={[
        {
          key: 1,
          label: (
            <span className="font-bold">
              {t('products.sections.basicInfo')}
            </span>
          ),
          children: (
            <Space direction="vertical" className="px-2" size="middle">
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('products.fields.productCode')}
                </div>
                <div>{product.code}</div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('products.fields.productName')}
                </div>
                <div>{product.name}</div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('products.fields.productNameAbbr')}
                </div>
                <div>{product.short_name}</div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('products.fields.barcode')}
                </div>
                <div>{product.barcode}</div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('products.fields.category')}
                </div>
                <div>
                  {product?.category?.category_path ??
                    t('products.fields.default_category')}
                </div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('products.fields.unit')}
                </div>
                <div>{product?.unit?.name}</div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('products.fields.taxRate')}
                </div>
                <div>{product.tax_rate} %</div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('products.fields.costPrice')}
                </div>
                <div>{product.cost_price}</div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('products.fields.sellingPrice')}
                </div>
                <div>
                  <span
                    className="rounded-sm p-1 text-white"
                    style={{ background: PRIMARY }}
                  >
                    {product.selling_price}
                  </span>
                </div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('products.fields.remarks')}
                </div>
                <div></div>
              </Flex>
            </Space>
          ),
        },
      ]}
      expandIconPosition="end"
      defaultActiveKey={[1]}
      expandIcon={({ isActive }) => (
        <DownOutlined
          style={{ transition: '0.3s' }}
          rotate={isActive ? 180 : 0}
        />
      )}
    />
  )
}

export default BasicInfo

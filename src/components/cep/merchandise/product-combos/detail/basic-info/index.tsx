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
              {t('product_combos.sections.basicInfo')}
            </span>
          ),
          children: (
            <Space direction="vertical" className="px-2" size="middle">
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('product_combos.fields.assortmentCode')}
                </div>
                <div>{product.code}</div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('product_combos.fields.assortmentName')}
                </div>
                <div>{product.name}</div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('product_combos.fields.assortmentNameAbbr')}
                </div>
                <div>{product.short_name}</div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('product_combos.fields.barcode')}
                </div>
                <div>{product.barcode}</div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('product_combos.fields.category')}
                </div>
                <div>{product?.category?.category_path}</div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('product_combos.fields.unit')}
                </div>
                <div>{product?.unit?.name}</div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('product_combos.fields.taxRate')}
                </div>
                <div>{product.tax_rate} %</div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('product_combos.fields.costPrice')}
                </div>
                <div>{product.cost_price}</div>
              </Flex>
              <Flex>
                <div className="w-[150px] text-left font-bold">
                  {t('product_combos.fields.sellingPrice')}
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
                  {t('product_combos.fields.remarks')}
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

/* eslint-disable @typescript-eslint/no-explicit-any */

import { DownOutlined, PictureOutlined } from '@ant-design/icons'
import { useTranslate } from '@refinedev/core'
import type { ProductDetail } from '@sdk/hey-api'
import { PRIMARY } from '@utility/color'
import { Collapse, Row } from 'antd'
import Image from 'next/image'

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
            <div className="grid grid-cols-5">
              <div className="col-span-4 space-y-4">
                <Row>
                  <div className="w-[150px] text-left font-bold">
                    {t('product_combos.fields.assortmentCode')}
                  </div>
                  <div>{product.code}</div>
                </Row>
                <Row>
                  <div className="w-[150px] text-left font-bold">
                    {t('product_combos.fields.assortmentName')}
                  </div>
                  <div>{product.name}</div>
                </Row>
                <Row>
                  <div className="w-[150px] text-left font-bold">
                    {t('product_combos.fields.assortmentNameAbbr')}
                  </div>
                  <div>{product.short_name}</div>
                </Row>
                <Row>
                  <div className="w-[150px] text-left font-bold">
                    {t('product_combos.fields.barcode')}
                  </div>
                  <div>{product.barcode}</div>
                </Row>
                <Row>
                  <div className="w-[150px] text-left font-bold">
                    {t('product_combos.fields.category')}
                  </div>
                  <div>
                    {product?.category?.category_path ??
                      t('products.fields.default_category')}
                  </div>
                </Row>
                <Row>
                  <div className="w-[150px] text-left font-bold">
                    {t('product_combos.fields.unit')}
                  </div>
                  <div>{product?.unit?.name}</div>
                </Row>
                <Row>
                  <div className="w-[150px] text-left font-bold">
                    {t('product_combos.fields.taxRate')}
                  </div>
                  <div>{product.tax_rate} %</div>
                </Row>
                <Row>
                  <div className="w-[150px] text-left font-bold">
                    {t('product_combos.fields.costPrice')}
                  </div>
                  <div>{product.cost_price}</div>
                </Row>
                <Row>
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
                </Row>
                <Row>
                  <div className="w-[150px] text-left font-bold">
                    {t('product_combos.fields.remarks')}
                  </div>
                  <div></div>
                </Row>
              </div>
              <div className="col-span-1">
                <Row>
                  {(product as any).image_file_url ? (
                    <Image
                      src={(product as any).image_file_url}
                      alt="Product Image"
                      width={200}
                      height={200}
                      className="h-48 w-48 rounded-xl border object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-50 w-50 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-200 text-gray-400">
                      <PictureOutlined
                        style={{
                          fontSize: '100px',
                          marginBottom: '8px',
                          opacity: 0.5,
                        }}
                      />
                    </div>
                  )}
                </Row>
              </div>
            </div>
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

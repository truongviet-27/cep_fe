/* eslint-disable */
'use client'

import { CloseOutlined, RightOutlined } from '@ant-design/icons'
import usePriceGroups from '@app/(auth)/(layout-breadcrumb)/(merchandise)/price-groups/use-price-groups'
import ProductCategoryDropdown from '@components/common/product-category-dropdown'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import {
  DeleteButton,
  EditButton,
  RefreshButton,
  SaveButton,
  useEditableTable,
} from '@refinedev/antd'
import { useCreate, useList } from '@refinedev/core'
import type { PriceGroupItem, Rank } from '@sdk/hey-api'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { settingMethodOptions } from '@utility/options'
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Table,
} from 'antd'
import { includes } from 'lodash'
import { useState } from 'react'
import Link from 'next/link'

function Page() {
  const [editIds, setEditIds] = useState<number[]>([])

  const {
    tableProps,
    formProps,
    setFilters,
    searchFormProps,
    form,
    tableQuery,
  } = useEditableTable<PriceGroupItem>({
    onSearch: (values: any) => {
      form.setFieldsValue([])
      return [
        {
          field: 'q',
          operator: 'null',
          value: values?.q,
        },
        {
          field: 'category_id',
          operator: 'null',
          value: values?.category_id,
        },
        {
          field: 'setting_method',
          operator: 'null',
          value: values?.setting_method,
        },
      ]
    },
  })

  const { data: ranks, isLoading } = useList<Rank>({
    resource: 'ranks',
  })

  const watch = Form.useWatch([], form)

  const { mutate, isLoading: loadingCreate } = useCreate()

  const handleSaveAll = () => {
    const flatIterator = Object.values(watch)

    const values = flatIterator.filter((item: any) => !!item?.packaging_id)

    mutate(
      {
        resource: 'price-groups',
        values,
      },
      {
        onSuccess: () => {
          values.forEach((item: any) => {
            editIds.includes(item.packaging_id) && onEditRow(item.packaging_id)
          })
        },
      },
    )
  }

  const onEditRow = (id: number | undefined | null) => {
    if (id === null || id === undefined) {
      return
    }

    setEditIds((prevEditIds) => {
      if (includes(prevEditIds, id)) {
        return prevEditIds.filter((currentId) => currentId !== id)
      } else {
        return [...prevEditIds, id]
      }
    })
  }

  const { t } = usePriceGroups()

  const getCurrentPrices = (index: number) => {
    return tableProps?.dataSource?.[index].rank_prices
      ?.sort((a, b) => (a.rate ?? 0) - (b.rate ?? 0))
      .filter((i) => !!i.rate)
  }

  const breadcrumbItems = [
    {
      title: boldText(t('price_groups.business_partner')),
    },
    {
      title: boldText(t('price_groups.list.list'), PRIMARY),
    },
  ]

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={'price_groups.list.list'}
      footer={
        <Col>
          <Button
            type="primary"
            onClick={handleSaveAll}
            loading={loadingCreate}
          >
            {t('buttons.save_all')}
          </Button>
        </Col>
      }
    >
      <Form {...searchFormProps} layout="inline">
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          <Col xs={12} sm={6} md={6}>
            <Form.Item
              label={boldText(t('products.list.searchArea.productInputLabel'))}
              layout="vertical"
              name="q"
            >
              <Input
                className={'mt-2'}
                placeholder={t(
                  'products.list.searchArea.productInputPlaceholder',
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Form.Item
              label={boldText(t('products.list.searchArea.categoryLabel'))}
              layout="vertical"
              name="category_id"
            >
              <ProductCategoryDropdown
                placeholder={t('products.list.searchArea.categoryPlaceholder')}
                onSelect={(_, __, ___, categoryId) => {
                  searchFormProps.form?.setFieldValue('category_id', categoryId)
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Form.Item
              label={boldText(t('price_groups.fields.is_rate_based'))}
              layout="vertical"
              name="setting_method"
            >
              <Select
                placeholder={t('placeholders.select')}
                style={{ minWidth: 300 }}
                options={settingMethodOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={6} sm={4} md={6} style={{ textAlign: 'left' }}>
            <Space className={'mt-[30px]'}>
              <Button htmlType="submit" type="primary">
                {t('buttons.search')}
              </Button>
              <RefreshButton
                size="middle"
                icon={null}
                onClick={() => {
                  searchFormProps.form?.resetFields()
                  setFilters([], 'replace')
                }}
              >
                {t('buttons.clear')}
              </RefreshButton>
            </Space>
          </Col>
        </Row>
      </Form>

      <Form {...formProps} className={'!mt-10'}>
        <CommonTable<PriceGroupItem>
          {...tableProps}
          loading={tableProps.loading || isLoading}
          rowKey="id"
          scroll={{ x: 'max-content' }}
        >
          <Table.Column
            dataIndex={['product_code']}
            title={t('price-groups.fields.product_code')}
            render={(product_code, record) => (
              <Link
                href={`/products/show/${record.product_id}`}
                className="!underline"
              >
                {product_code}
              </Link>
            )}
          />
          <Table.Column
            dataIndex="product_name"
            title={t('price-groups.fields.product_name')}
          />
          <Table.Column
            dataIndex="category"
            title={t('price-groups.fields.category')}
          />
          <Table.Column
            dataIndex="unit"
            title={t('price-groups.fields.unit')}
          />
          <Table.Column
            dataIndex="packaging_name"
            title={t('price-groups.fields.packaging_name')}
          />
          <Table.Column
            dataIndex="selling_price"
            title={() => {
              return (
                <>
                  <div>{t('price-groups.fields.selling_price')}</div>
                  <div>({t('price-groups.fields.selling_price_unit')})</div>
                </>
              )
            }}
          />

          <Table.Column
            dataIndex={['is_rate_based']}
            title={t('price-groups.fields.is_rate_based')}
            render={(value, record, index) => {
              const currentVal = value
                ? t('price_groups.fields.percentage')
                : t('price_groups.fields.absolute')
              return (
                <>
                  <Form.Item
                    name={[index, `packaging_id`]}
                    initialValue={record.packaging_id}
                    hidden
                    className={'!m-0 !h-0 !p-0'}
                  >
                    <Input hidden />
                  </Form.Item>

                  <Form.Item
                    initialValue={value}
                    name={[index, 'is_rate_based']}
                    className={'!m-0 !h-0 !p-0 !pb-5'}
                  >
                    {record?.packaging_id &&
                    !includes(editIds, record.packaging_id) ? (
                      currentVal
                    ) : (
                      <Radio.Group className={''}>
                        <Radio value={true}>
                          {t('price_groups.fields.percentage')}
                        </Radio>
                        <Radio
                          value={false}
                          onChange={() => {
                            const rankPrices = getCurrentPrices(index)

                            rankPrices?.forEach((item, indexChild) => {
                              form.setFieldValue(
                                [indexChild, 'rank_prices', index, `price`],
                                Math.round(
                                  ((record?.selling_price ?? 0) *
                                    (item?.rate ?? 0)) /
                                    100,
                                ),
                              )
                            })
                          }}
                        >
                          {t('price_groups.fields.absolute')}
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </>
              )
            }}
          />

          {ranks?.data
            ?.sort((a, b) => (a?.rate ?? 0) - (b?.rate ?? 0))
            .map((item, indexChild) => {
              return (
                <Table.Column<PriceGroupItem>
                  key={indexChild}
                  dataIndex={'rank_prices'}
                  title={
                    <>
                      <div>{boldText(`${item.name}`, PRIMARY)}</div>
                      <div>{boldText(`${item.rate}% (円)`, PRIMARY)}</div>
                    </>
                  }
                  render={(value, record, index) => {
                    const rankPrices = getCurrentPrices(index)
                    const is_rate_based = !!(watch as any)?.[index]
                      ?.is_rate_based

                    const currentPrice =
                      rankPrices?.find((i) => i.rank_id === item.id)?.price ?? 0
                    const isEditing =
                      record?.packaging_id &&
                      includes(editIds, record.packaging_id)

                    if (!isEditing) return currentPrice

                    if (isEditing && !is_rate_based) {
                      return (
                        <>
                          <Form.Item
                            className={'!m-0 !h-fit !p-0'}
                            name={[index, 'rank_prices', indexChild, `rank_id`]}
                            initialValue={item.id}
                            style={{ display: 'none' }}
                          >
                            <Input hidden className={'!h-0'} />
                          </Form.Item>

                          <Form.Item
                            className={'!m-0 !h-fit !p-0'}
                            name={[index, 'rank_prices', indexChild, `price`]}
                            initialValue={currentPrice}
                          >
                            <InputNumber min={0} className={'!mt-4 !h-8'} />
                          </Form.Item>
                        </>
                      )
                    }
                    return Math.round(
                      ((record?.selling_price ?? 0) * (item?.rate ?? 0)) / 100,
                    )
                  }}
                />
              )
            })}

          <Table.Column
            title={t('employees.fields.actions')}
            dataIndex="actions"
            fixed="right"
            render={(_, record, index) => {
              const onClick = () => {
                form.setFieldValue([index], {
                  packaging_id: record.packaging_id,
                  is_rate_based: record.is_rate_based,
                })
                onEditRow(record.packaging_id)
              }

              if (includes(editIds, record.packaging_id)) {
                return (
                  <Space>
                    <SaveButton
                      onClick={handleSaveAll}
                      loading={loadingCreate}
                      hideText
                      size="small"
                    />
                    <DeleteButton
                      hideText
                      icon={<CloseOutlined />}
                      size="small"
                      onClick={onClick}
                    />
                  </Space>
                )
              }
              return (
                <EditButton
                  onClick={onClick}
                  loading={tableProps.loading}
                  hideText
                  size="small"
                />
              )
            }}
          />
        </CommonTable>
      </Form>
    </List>
  )
}

export default Page

/* eslint-disable */
'use client'
// todo confirm BA
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
    pagination: { pageSize: 20 },
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
    sorters: [
      {
        field: '-created_at',
        order: 'desc',
      },
    ],
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
        onError: (error: any) => {
          const errData = error?.response?.data
          const apiErrors = errData?.errors
          if (apiErrors && typeof apiErrors === 'object') {
            const fieldErrors = Object.entries(apiErrors).map(
              ([key]: [string, unknown]) => {
                const path = key
                  .split('.')
                  .map((p) => (/\d+/.test(p) ? parseInt(p, 10) : p))
                return {
                  name: path,
                  errors: [''],
                }
              },
            )
            form.setFields(fieldErrors)
          }
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
    return tableProps?.dataSource?.[index].rank_prices?.sort(
      (a, b) => (a.rate ?? 0) - (b.rate ?? 0),
    )
  }

  const breadcrumbItems = [
    {
      title: boldText(t('price_groups.business_partner')),
    },
    {
      title: boldText(t('price_groups.product_price_by_rank'), PRIMARY),
    },
  ]

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={'price_groups.product_price_by_rank'}
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
      <div className="mb-3 rounded-[4px] border-[1px] border-[#FFD591] bg-[#FFF8F0] px-[16px] py-[8px]">
        <h1 className="!m-0 !mb-1 !p-0 !font-bold text-[#E67E22]">
          {t('price_groups.message')}
        </h1>
        <p className="!mb-0">{t('price_groups.message_description')}</p>
      </div>

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
              label={boldText(t('price_groups.fields.pricing_method'))}
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
              <Button htmlType="submit" type="primary" autoInsertSpace={false}>
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
          scroll={{ x: undefined }}
        >
          <Table.Column
            dataIndex={['packaging_code']}
            title={t('price-groups.fields.product_code')}
            align="left"
            width="8%"
            render={(product_code, record) => (
              <Link
                href={`/products/show/${record.product_id}`}
                className="!underline"
                onClick={() => {
                  sessionStorage.setItem('list_products', 'price-groups')
                }}
              >
                {product_code}
              </Link>
            )}
          />
          <Table.Column
            dataIndex="product_name"
            title={t('price-groups.fields.product_name')}
            align="left"
            width="10%"
          />
          <Table.Column
            dataIndex="packaging_name"
            title={t('price-groups.fields.packaging_name')}
            width="10%"
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
            render={(value) => {
              return value !== null && value !== undefined
                ? Number(value).toLocaleString()
                : '-'
            }}
          />

          <Table.Column
            dataIndex="pricing_method"
            title={t('price-groups.fields.pricing_method')}
            render={(value, record, index) => {
              const currentVal =
                value === 'percentage'
                  ? t('price_groups.fields.percentage')
                  : value === 'list_price'
                    ? t('price_groups.fields.list_price')
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
                    name={[index, 'pricing_method']}
                    className={'!m-0 !h-0 !p-0 !pb-5'}
                  >
                    {record?.packaging_id &&
                    !includes(editIds, record.packaging_id) ? (
                      currentVal
                    ) : (
                      <Select
                        style={{ width: '80px' }}
                        placeholder={t('price_groups.fields.pricing_method')}
                        onChange={(value) => {
                          if (value === 'fixed') {
                            const rankPrices = getCurrentPrices(index)
                            rankPrices?.forEach((item, indexChild) => {
                              form.setFieldValue(
                                [indexChild, 'rank_prices', index, 'price'],
                                Math.round(
                                  ((record?.selling_price ?? 0) *
                                    (item?.rate ?? 0)) /
                                    100,
                                ),
                              )
                            })
                          }
                        }}
                        options={[
                          {
                            label: t('price_groups.fields.percentage'),
                            value: 'percentage',
                          },
                          {
                            label: t('price_groups.fields.absolute'),
                            value: 'fixed',
                          },
                          {
                            label: t('price_groups.fields.list_price'),
                            value: 'list_price',
                          },
                        ]}
                      />
                    )}
                  </Form.Item>
                </>
              )
            }}
          />
          <Table.ColumnGroup
            title={
              <Link href="/ranks" className="!h-4 !underline">
                {t('price_groups.rank_prices_title')}
              </Link>
            }
          >
            {(ranks?.data ?? []).map((item, indexChild) => {
              return (
                <Table.Column<PriceGroupItem>
                  key={indexChild}
                  dataIndex={'rank_prices'}
                  title={
                    <>
                      <div>{boldText(`${item.code}`, PRIMARY)}</div>
                      <div>{boldText(`${item.rate}% (円)`, PRIMARY)}</div>
                    </>
                  }
                  render={(value, record, index) => {
                    const rankPrices = getCurrentPrices(index)

                    const pricing_method =
                      (watch as any)?.[index]?.pricing_method ?? 'percentage'
                    if (pricing_method === 'list_price') {
                      return Number(record?.selling_price).toLocaleString()
                    }

                    const currentPrice =
                      rankPrices?.find((i) => i.rank_id === item.id)?.price ?? 0
                    const isEditing =
                      record?.packaging_id &&
                      includes(editIds, record.packaging_id)

                    if (!isEditing) return Number(currentPrice).toLocaleString()

                    if (isEditing && pricing_method === 'fixed') {
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
          </Table.ColumnGroup>

          <Table.Column
            title={t('employees.fields.actions')}
            dataIndex="actions"
            fixed="right"
            render={(_, record, index) => {
              const onClick = () => {
                form.setFieldValue([index], {
                  packaging_id: record.packaging_id,
                  pricing_method: record.pricing_method,
                })
                onEditRow(record.packaging_id)
              }

              if (includes(editIds, record.packaging_id)) {
                return (
                  <Space>
                    <SaveButton
                      onClick={handleSaveAll}
                      loading={loadingCreate}
                      size="small"
                      icon={false}
                      autoInsertSpace={false}
                    >
                      {t('buttons.update')}
                    </SaveButton>
                    <DeleteButton
                      icon={false}
                      size="small"
                      onClick={onClick}
                      autoInsertSpace={false}
                    >
                      {t('buttons.cancel')}
                    </DeleteButton>
                  </Space>
                )
              }
              return (
                <EditButton
                  onClick={onClick}
                  loading={tableProps.loading}
                  size="small"
                  icon={false}
                  autoInsertSpace={false}
                >
                  {t('buttons.edit')}
                </EditButton>
              )
            }}
          />
        </CommonTable>
      </Form>
    </List>
  )
}

export default Page

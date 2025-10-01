'use client'

import { CloseOutlined, RightOutlined } from '@ant-design/icons'
import usePriceGroups from '@app/(auth)/(layout-breadcrumb)/(merchandise)/price-groups/use-price-groups'
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
import { PRIMARY } from '@utility/color'
import { industryOptions } from '@utility/options'
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from 'antd'
import { includes } from 'lodash'
import React, { useState } from 'react'

const { Title, Text } = Typography

function Page() {
  const [editIds, setEditIds] = useState<number[]>([])

  const {
    tableProps,
    formProps,
    setFilters,
    searchFormProps,
    // mutationResult,
    form,
  } = useEditableTable<PriceGroupItem>()

  const { data: ranks, isLoading } = useList<Rank>({
    resource: 'ranks',
  })

  const { mutate } = useCreate()

  const handleSaveAll = () => {
    const allData = Object.values(
      form.getFieldsValue() as PriceGroupItem[],
    )?.filter((item) => (item?.rank_prices || [])?.length > 0)

    console.log(form.getFieldsValue(), 'allData')

    mutate({
      resource: 'price-groups',
      values: allData,
    })
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
  }

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('price_groups.price_groups')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('price_groups.list.list')}</Title>,
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
          <Button type="primary" onClick={handleSaveAll}>
            {t('buttons.save_all')}
          </Button>
        </Col>
      }
    >
      <Form {...searchFormProps} layout="inline">
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          <Col xs={12} sm={6} md={6}>
            <Text strong>{t('departments.list.filters.search_label')}</Text>
            <Form.Item name="q">
              <Input
                className={'mt-2'}
                placeholder={t('departments.list.filters.search_placeholder')}
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Text strong>{t('departments.list.filters.search_label')}</Text>
            <Form.Item name="q">
              <Input
                className={'mt-2'}
                placeholder={t('departments.list.filters.search_placeholder')}
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Text strong>{t('departments.list.filters.search_label')}</Text>
            <Form.Item name="q">
              <Select
                placeholder={t('placeholders.select')}
                style={{ minWidth: 300 }}
                options={industryOptions}
              />
            </Form.Item>
          </Col>
          <Col xs={6} sm={4} md={6} style={{ textAlign: 'left' }}>
            <Space className={'mt-[22px]'}>
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
        >
          <Table.Column
            dataIndex={['product_code']}
            title={t('price-groups.fields.product_code')}
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
            title={t('price-groups.fields.selling_price')}
          />

          <Table.Column
            dataIndex={['is_rate_based']}
            title={t('price-groups.fields.is_rate_based')}
            render={(value, record, index) => (
              <Form.Item initialValue={value} name={[index, 'is_rate_based']}>
                <Switch />
              </Form.Item>
            )}
          />

          {ranks?.data?.map((item, indexChild) => {
            return (
              <Table.Column<PriceGroupItem>
                key={indexChild}
                dataIndex={'ranks_prices'}
                title={`${item.name} ${item.rate}% (円)`}
                render={(value, record, index) => {
                  const rankPrices = getCurrentPrices(index)
                  if (
                    record?.packaging_id &&
                    includes(editIds, record.packaging_id)
                  ) {
                    return (
                      <>
                        <Form.Item
                          name={[index, 'ranks_prices', indexChild, `rank_id`]}
                          initialValue={item.id}
                          style={{ display: 'none' }}
                        >
                          <Input hidden />
                        </Form.Item>

                        <Form.Item
                          name={[index, 'ranks_prices', indexChild, `price`]}
                          style={{ margin: 0 }}
                        >
                          <Input />
                        </Form.Item>
                      </>
                    )
                  }
                  return (
                    rankPrices?.find((i) => i.rank_id === item.id)?.price ?? 0
                  )
                }}
              />
            )
          })}

          <Table.Column
            title="Actions"
            dataIndex="actions"
            fixed="right"
            render={(_, record) => {
              const onClick = () => onEditRow(record.packaging_id)

              if (includes(editIds, record.packaging_id)) {
                return (
                  <Space>
                    <SaveButton onClick={handleSaveAll} hideText size="small" />
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

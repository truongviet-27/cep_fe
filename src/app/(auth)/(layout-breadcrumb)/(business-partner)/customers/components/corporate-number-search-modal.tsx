/* eslint-disable */
import { useCustom, useTranslate } from '@refinedev/core'
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  TableColumnsType,
  Tooltip,
} from 'antd'
import React, { useState } from 'react'
import CommonTable from '@components/common/table'
import { prefectureOptions } from '@utility/options'
import boldText from '@utility/bold-text'
import { RED } from '@utility/color'

interface ICorporateInfo {
  corporateNumber: '7000012050002'
  process: '01'
  correct: '1'
  updateDate: '2018-04-02'
  changeDate: '2015-10-05'
  name: '"国税庁"'
  nameImageId: ''
  kind: '101'
  prefectureName: '"東京都"'
  cityName: '"千代田区"'
  streetNumber: '"霞が関３丁目１－１"'
  addressImageId: ''
  prefectureCode: '13'
  cityCode: '101'
  townCode: '1000013'
  hihyoji: ''
  furigana: '1'
  enName: '2010005029585'
  enPrefectureName: '01'
  enCityName: ''
  enAddressLine: ''
  enAddressImageId: '2015-10-05'
  businessSummary: '"National Tax Agency"'
  closeDate: '"Tokyo"'
  closeCause: '"3-1-1 Kasumigaseki'
  successorCorporateNumber: ' Chiyoda-ku"'
  changeCause: ''
  assignmentDate: '"コクゼイチョウ"'
  latest: '0\n2'
  enAddress: '0'
  enAddressOutside: '2019-01-24'
  corporateNameFurigana: '2019-01-21'
}

interface CorporateNumberSearchModalProps {
  modalProps: any
  onSelect: (record: ICorporateInfo) => void
}

export const CorporateNumberSearchModal: React.FC<
  CorporateNumberSearchModalProps
> = ({ modalProps, onSelect }) => {
  const t = useTranslate()
  const [searchForm] = Form.useForm()

  const { visible, close } = modalProps

  const [params, setParams] = useState<{
    name: string
    type: string
    history: string
    address: null | number
  }>({
    name: '',
    type: '02',
    history: '0',
    address: null,
  })

  const { data, isFetching } = useCustom({
    url: `/api/corporate-number`,
    dataProviderName: 'corporationProvider',
    method: 'post',
    config: {
      filters: [
        { field: 'name', operator: 'eq', value: params.name },
        { field: 'type', operator: 'eq', value: params.type },
        { field: 'history', operator: 'eq', value: params.history },
        { field: 'address', operator: 'eq', value: params.address },
      ],
      payload: params,
    },
    queryOptions: {
      enabled: !!params.name || !!params.address,
    },
  })

  const handleSelect = (record: ICorporateInfo) => {
    onSelect(record)
    close()
  }

  const columns: TableColumnsType<ICorporateInfo> = [
    {
      title: t('customers.modal.name'),
      dataIndex: 'name',
      key: 'name',
      width: 250,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text} color="rgb(240, 249, 255)">
          {text}
        </Tooltip>
      ),
    },
    {
      title: t('customers.modal.address'),
      dataIndex: 'address_outside',
      key: 'streetNumber',
      width: 250,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => {
        const addressText = `${record.prefectureName || ''}${record.cityName || ''}${record.streetNumber || ''}`
        return (
          <Tooltip
            placement="topLeft"
            title={addressText}
            color="rgb(240, 249, 255)"
          >
            {addressText}
          </Tooltip>
        )
      },
    },
    {
      title: t('customers.modal.corporate_number'),
      dataIndex: 'corporateNumber',
      key: 'corporateNumber',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string, record) => {
        return (
          <Space size={20} direction={'horizontal'}>
            <span style={{ display: 'inline-block', maxWidth: 150 }}>
              {text}
            </span>
            <Button
              type="primary"
              onClick={() => handleSelect(record)}
              size="small"
            >
              {t('buttons.select')}
            </Button>
          </Space>
        )
      },
    },
  ]

  const handleSearch = (values: { name: string; address: number }) => {
    setParams({
      ...params,
      ...values,
    })
  }

  const handleClear = () => {
    searchForm.resetFields()
    setParams({
      name: '',
      type: '02',
      history: '0',
      address: null,
    })
  }

  return (
    <div>
      <Form
        form={searchForm}
        layout="vertical"
        onFinish={handleSearch}
        className="mb-4"
        colon={false}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Form.Item
              label={
                <Flex>
                  {boldText(t('customers.modal.name'))}
                  &nbsp;
                  <span style={{ color: RED }}>*</span>
                </Flex>
              }
              name="name"
            >
              <Input placeholder={t('placeholders.partial_match')} />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label={t('customers.modal.address')} name="address">
              <Select
                placeholder={t('placeholders.partial_match')}
                options={prefectureOptions}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item className={'!mt-7.5'}>
              <Space>
                <Form.Item shouldUpdate noStyle>
                  {({ getFieldValue }) => (
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={!getFieldValue('name')}
                      autoInsertSpace={false}
                    >
                      {t('buttons.search')}
                    </Button>
                  )}
                </Form.Item>
                <Button onClick={handleClear}>{t('buttons.clear')}</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <CommonTable
        loading={isFetching}
        dataSource={
          !!params.name || !!params.address
            ? data?.data?.corporations
            : undefined
        }
        columns={columns as any}
        rowKey="corporateNumber"
        pagination={false}
        scroll={{ y: 400 }}
        tableLayout="fixed"
      />
    </div>
  )
}

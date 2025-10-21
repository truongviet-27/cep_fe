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
  const watchName = Form.useWatch('name', searchForm)

  const { visible, close } = modalProps

  const [params, setParams] = useState<{
    name: string
    type: string
    history: string
    address: null | number
  }>({
    name: '国税庁',
    type: '02',
    history: '0',
    address: null,
  })

  const { data, isLoading } = useCustom({
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
    },
    {
      title: t('customers.modal.address'),
      dataIndex: 'address_outside',
      key: 'streetNumber',
      render: (_, record) => {
        return (
          <div>
            {record.streetNumber}
            {record.cityName}
          </div>
        )
      },
    },
    {
      title: t('customers.modal.corporate_number'),
      dataIndex: 'corporateNumber',
      key: 'corporateNumber',
      render: (_, record) => {
        return (
          <Space size={20} direction={'horizontal'}>
            {record.corporateNumber}
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
  }

  return (
    <div>
      <Form
        form={searchForm}
        layout="vertical"
        onFinish={handleSearch}
        className="mb-4"
        colon={false}
        initialValues={params}
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
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!watchName}
                  autoInsertSpace={false}
                >
                  {t('buttons.search')}
                </Button>
                <Button onClick={handleClear}>{t('buttons.clear')}</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <CommonTable
        loading={isLoading}
        dataSource={data?.data?.corporations}
        columns={columns as any}
        rowKey="id"
        pagination={false}
      />
    </div>
  )
}

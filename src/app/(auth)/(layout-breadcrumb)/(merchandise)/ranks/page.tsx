/* eslint-disable */
'use client'

import { RightOutlined, SearchOutlined } from '@ant-design/icons'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import {
  CreateButton,
  DeleteButton,
  EditButton,
  RefreshButton,
  ShowButton,
  useModalForm,
  useTable,
} from '@refinedev/antd'
import {
  BaseRecord,
  useModal,
  useResource,
  useTranslate,
} from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, Modal, Row, Space, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useState } from 'react'
import { Rank } from '@sdk/hey-api'
import CommonTable from '@components/common/table'
import { RankModalEdit } from '@app/(auth)/(layout-breadcrumb)/(merchandise)/ranks/edit/modal'
import { RankModalCreate } from '@app/(auth)/(layout-breadcrumb)/(merchandise)/ranks/create/modal'
import boldText from '@utility/bold-text'

const { Title, Text } = Typography

export default function Page() {
  const t = useTranslate()
  const [isShow, setIsShow] = useState(false)
  const { tableProps, searchFormProps, setFilters } = useTable<Rank>({
    syncWithLocation: true,
    onSearch: (values: any) => [
      {
        field: 'q',
        operator: 'null',
        value: values?.q,
      },
    ],
  })

  const columns: ColumnsType<Rank> = [
    {
      dataIndex: 'code',
      title: t('ranks.fields.code'),
      render: (_, record) => (
        <Button
          type={'link'}
          onClick={() => {
            setIsShow(true)
            editModalShow(record.id)
          }}
          className="!h-4 !underline"
        >
          {record.code}
        </Button>
      ),
    },
    { dataIndex: 'name', title: t('ranks.fields.name'), align: 'left' },
    { dataIndex: 'rate', title: t('ranks.fields.rate'), align: 'right' },
    {
      dataIndex: 'number_of_customers',
      title: t('ranks.fields.number_of_customers'),
      align: 'right',
    },
    { dataIndex: 'note', title: t('ranks.fields.remarks'), align: 'left' },
    {
      title: t('table.actions'),
      dataIndex: 'actions',
      render: (_: any, record: BaseRecord) => (
        <Space>
          <ShowButton
            hideText
            size="small"
            onClick={() => {
              setIsShow(true)
              editModalShow(record.id)
            }}
          />
          <EditButton
            hideText
            size="small"
            onClick={() => {
              setIsShow(false)
              editModalShow(record.id)
            }}
            recordItemId={record.id}
          />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ]

  const breadcrumbItems = [
    {
      title: boldText(t('business_partner.business_partner')),
    },
    {
      title: boldText(t('ranks.list.list'), PRIMARY),
    },
  ]

  const { resource } = useResource()

  const modalFormProps = useModalForm<Rank>({
    action: 'edit',
    resource: resource?.name,
    autoResetFormWhenClose: true,
    warnWhenUnsavedChanges: false,
    autoResetForm: true,
  })

  const {
    show: editModalShow,
    close: editModalClose,
    open: editModalOpen,
  } = modalFormProps

  const modalCreate = useModal()

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={'ranks.list.list'}
    >
      <Form {...searchFormProps} layout="inline">
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          <Col xs={12} sm={6} md={6}>
            <Text strong>{t('ranks.list.filters.search_label')}</Text>
            <Form.Item name="q">
              <Input
                className={'mt-2'}
                placeholder={t('departments.list.filters.search_placeholder')}
                prefix={<SearchOutlined />}
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
          <Col xs={12} sm={12} md={12} style={{ textAlign: 'right' }}>
            <div className={'h-[32px]'} />
            <CreateButton onClick={modalCreate.show} icon={null}>
              {t('buttons.create_new')}
            </CreateButton>
          </Col>
        </Row>
      </Form>

      <div className="mt-6">
        <CommonTable<Rank> {...tableProps} columns={columns} />
      </div>

      {/*<Modal*/}
      {/*  open={modalFormShow.open}*/}
      {/*  onCancel={modalFormShow.close}*/}
      {/*  cancelButtonProps={{ style: { display: 'none' } }}*/}
      {/*  okButtonProps={{ style: { display: 'none' } }}*/}
      {/*  width={'70vh'}*/}
      {/*>*/}
      {/*  <RankModalEdit modalProps={modalFormShow} isShow={true} />*/}
      {/*</Modal>*/}

      <Modal
        open={editModalOpen}
        onCancel={editModalClose}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        width={'70vh'}
      >
        <RankModalEdit
          modalFormProps={modalFormProps}
          setIsShow={setIsShow}
          isShow={isShow}
        />
      </Modal>

      <Modal
        open={modalCreate.visible}
        onCancel={modalCreate.close}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <RankModalCreate modalProps={modalCreate} />
      </Modal>
    </List>
  )
}

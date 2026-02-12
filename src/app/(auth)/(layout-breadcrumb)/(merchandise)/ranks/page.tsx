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
import Link from 'next/link'

const { Text } = Typography

export default function Page() {
  const t = useTranslate()
  const [isShow, setIsShow] = useState(false)
  const { tableProps, searchFormProps, setFilters } = useTable<Rank>({
    syncWithLocation: true,
    sorters: {
      initial: [
        {
          field: '-created_at',
          order: 'desc',
        },
      ],
    },
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
      title: t('ranks.table.code'),
      width: '14%',
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
    {
      dataIndex: 'note',
      width: '30%',
      title: t('ranks.table.note'),
      align: 'left',
    },
    {
      dataIndex: 'rank_group',
      title: t('ranks.table.unit_price'),
      width: '19%',
      render: (_, record) => (
        <Link href={'/price-groups'} className="!h-4 !underline">
          {record.code + ' ランク別単価'}
        </Link>
      ),
    },
    {
      dataIndex: 'rate',
      width: '9%',
      title: t('ranks.fields.rate'),
      align: 'right',
    },
    {
      dataIndex: 'number_of_customers',
      width: '9%',
      title: t('ranks.fields.number_of_customers'),
      align: 'right',
    },
    {
      title: t('table.actions'),
      dataIndex: 'actions',
      width: '19%',
      render: (_: any, record: BaseRecord) => (
        <Space>
          <ShowButton
            icon={false}
            size="small"
            onClick={() => {
              setIsShow(true)
              editModalShow(record.id)
            }}
            autoInsertSpace={false}
          >
            <span>{t('buttons.show')}</span>
          </ShowButton>

          <EditButton
            icon={false}
            size="small"
            type="primary"
            onClick={() => {
              setIsShow(false)
              editModalShow(record.id)
            }}
            recordItemId={record.id}
            autoInsertSpace={false}
          >
            {t('buttons.edit')}
          </EditButton>

          <DeleteButton
            icon={false}
            size="small"
            recordItemId={record.id}
            autoInsertSpace={false}
          >
            {t('buttons.delete')}
          </DeleteButton>
        </Space>
      ),
    },
  ]

  const breadcrumbItems = [
    {
      title: boldText(t('products.breadcrumb.home')),
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
        destroyOnClose={true}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <RankModalCreate modalProps={modalCreate} />
      </Modal>
    </List>
  )
}

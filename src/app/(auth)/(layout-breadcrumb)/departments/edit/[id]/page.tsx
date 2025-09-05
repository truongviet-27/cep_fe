'use client'

import { RightOutlined } from '@ant-design/icons'
import ShowMoreInfo from '@components/common/show-more-info'
import { Edit } from '@components/crud/edit'
import Breadcrumbs from '@components/layout/breadcrumbs'
import type { IDepartments } from '@interfaces/departments'
import { DeleteButton, useForm } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import type { Rule } from 'antd/es/form'
import dayjs from 'dayjs'
import Link from 'next/link'
import React, { useMemo } from 'react'

const { Text, Title } = Typography

export default function EmployeeEdit() {
  const t = useTranslate()

  const { formProps, saveButtonProps, queryResult } = useForm<IDepartments>({
    redirect: 'show',
  })
  const employeeData = queryResult?.data?.data

  const codeRules: Rule[] = useMemo(
    () => [
      { required: true, message: '部門コードは必須です。' },
      { pattern: /^[A-Z0-9-]+$/, message: 'A-Z, 0-9, - のみ使用できます。' },
      { max: 32, message: '最大32文字までです。' },
    ],
    [],
  )

  const nameRules: Rule[] = useMemo(
    () => [
      { required: true, message: '部門名は必須です。' },
      { max: 120, message: '最大120文字までです。' },
    ],
    [],
  )

  const handleAutoNumber = () => {
    // TODO: call your real API for next code
    const num = Math.floor(Math.random() * 900) + 100
    const next = `EMP${num}`
    formProps.form?.setFieldsValue({ code: next })
  }

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('employees.employees')}
        </Title>
      ),
    },
    { title: <Title level={5}>社員編集</Title> },
  ]

  return (
    <Edit
      isLoading={queryResult?.isLoading}
      saveButtonProps={saveButtonProps}
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      footerButtonProps={{
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: 24,
          paddingRight: 24,
        },
      }}
      footerButtons={
        <div>
          <ShowMoreInfo
            descriptions={[
              {
                title: t('common.created_by'),
                value:
                  employeeData?.author?.name ??
                  '---' +
                    ' ' +
                    dayjs(employeeData?.created_at).format('YYYY/MM/DD HH:mm'),
              },
              {
                title: t('common.updated_by'),
                value:
                  employeeData?.editor?.name ??
                  '---' +
                    ' ' +
                    dayjs(employeeData?.updated_at).format('YYYY/MM/DD HH:mm'),
              },
            ]}
          />

          <div className="mt-4 flex w-full justify-start pb-4">
            <DeleteButton icon={null} size={'small'} />
          </div>
        </div>
      }
      rightFooterButtons={
        <Space size={2} className={'flex justify-end'}>
          <Button {...saveButtonProps} type="primary">
            {t('buttons.save')}
          </Button>
        </Space>
      }
      i18nHeading={'社員編集'}
    >
      <Form
        {...formProps}
        labelCol={{ xs: 24, md: 2 }}
        wrapperCol={{ xs: 24, md: 8 }}
        labelAlign={'left'}
        layout="horizontal"
        colon={false}
        autoComplete="off"
      >
        <Form.Item required label={<span>部門コード</span>}>
          <Row align="middle" gutter={12} wrap={false}>
            <Col flex="360px">
              <Form.Item
                name="code"
                rules={codeRules}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="DEP001" size="middle" />
              </Form.Item>
            </Col>
            <Col>
              <Text type="secondary">(A-Z, 0-9, -)</Text>
            </Col>
            <Col>
              <Space direction="vertical" size={2}>
                <Button size="middle" type="default" onClick={handleAutoNumber}>
                  自動採番
                </Button>
                <Link href="/code-issue-settings" className="text-blue-500">
                  コード採番設定はこちら
                </Link>
              </Space>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label={<span>部門名（支社/部/課）</span>}
          name="name"
          rules={nameRules}
        >
          <Input placeholder="例）営業本部 / 営業部 / 第一課" size="middle" />
        </Form.Item>
      </Form>
    </Edit>
  )
}

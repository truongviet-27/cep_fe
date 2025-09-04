'use client'

import { RightOutlined } from '@ant-design/icons'
import ShowMoreInfo from '@components/common/show-more-info'
import { Edit } from '@components/crud/edit'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useForm, useSelect } from '@refinedev/antd'
import { useApiUrl, useCustom, useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import {
  Button,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from 'antd'
import type { Rule } from 'antd/es/form'
import dayjs from 'dayjs'
import { isArray } from 'lodash'
import Link from 'next/link'
import React, { useMemo } from 'react'

const { Text, Title } = Typography

interface IEmployee {
  id: number
  code: string
  name: string
  email: string
  department_id: number
  role: 'employee' | 'manager'
  created_by: {
    name: string
    date: string
  }
  updated_by: {
    name: string
    date: string
  } | null
}

export default function EmployeeEdit() {
  const t = useTranslate()

  const apiUrl = useApiUrl()

  const { data: roles } = useCustom({ method: 'get', url: `${apiUrl}/roles` })

  const { formProps, saveButtonProps, queryResult, form } = useForm<IEmployee>({
    redirect: 'show',
  })
  const employeeData = queryResult?.data?.data

  const { selectProps: departmentSelectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
  })

  const codeRules: Rule[] = useMemo(
    () => [
      { required: true, message: '部門コードは必須です。' },
      { pattern: /^[A-Z0-9-]+$/, message: 'A-Z, 0-9, - のみ使用できます。' },
      { max: 32, message: '最大32文字までです。' },
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
        <ShowMoreInfo
          descriptions={[
            {
              title: t('common.created_by'),
              value:
                employeeData?.created_by?.name ??
                '---' +
                  ' ' +
                  dayjs(employeeData?.created_by?.date).format(
                    'YYYY/MM/DD HH:mm',
                  ),
            },
            {
              title: t('common.updated_by'),
              value:
                employeeData?.updated_by?.name ??
                '---' +
                  ' ' +
                  dayjs(employeeData?.updated_by?.date).format(
                    'YYYY/MM/DD HH:mm',
                  ),
            },
          ]}
        />
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
        <Form.Item label={boldText(t('employees.fields.code'))} required>
          <Row align="middle" gutter={12} wrap={false}>
            <Col flex="360px">
              <Form.Item
                name="code"
                rules={codeRules}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="EMP001" size="middle" />
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

        <Form.Item label={boldText(t('employees.fields.name'))} name="name">
          <Text>{form.getFieldValue('name')}</Text>
        </Form.Item>

        <Form.Item label={boldText(t('employees.fields.email'))} name="email">
          <Text>{form.getFieldValue('email')}</Text>
        </Form.Item>

        <Form.Item
          label={boldText(t('employees.fields.department'))}
          name="department_id"
          rules={[{ required: true }]}
        >
          <Select {...departmentSelectProps} />
        </Form.Item>

        <Form.Item
          label={boldText(t('employees.fields.role'))}
          name="role_id"
          rules={[{ required: true }]}
        >
          <Radio.Group>
            {isArray(roles?.data?.items) &&
              roles?.data?.items.map(({ id, name }) => (
                <Radio key={name} value={id}>
                  {t(`employees.roles.${name}`)}
                </Radio>
              ))}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Edit>
  )
}

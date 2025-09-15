'use client'

import { RightOutlined } from '@ant-design/icons'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useModalForm } from '@refinedev/antd'
import {
  useApiUrl,
  useCreate,
  useCustom,
  useGo,
  useResource,
  useTranslate,
} from '@refinedev/core'
import type { CodeIssueSetting } from '@sdk/hey-api'
import { PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, Modal, Row, Space, Typography } from 'antd'
import type { Rule } from 'antd/es/form'
import React, { useMemo } from 'react'

const { Title, Text } = Typography

interface DepartmentPayload {
  code: string
  name: string
}

export default function Page() {
  const [form] = Form.useForm<DepartmentPayload>()
  const t = useTranslate()
  const { resource } = useResource()
  const go = useGo()
  const { mutate: create, isLoading } = useCreate()

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

  const apiUrl = useApiUrl()

  const {
    data,
    refetch,
    isLoading: loadingDp,
  } = useCustom<CodeIssueSetting>({
    url: `${apiUrl}/code-issue-settings/by-code/departments`,
    method: 'get',
  })

  const modalFormProps = useModalForm({
    action: 'edit',
    resource: 'code-issue-settings',
    autoResetFormWhenClose: true,
    warnWhenUnsavedChanges: false,
    defaultFormValues: {
      hash_dash: true,
    },
  })

  const { show, close, open } = modalFormProps

  const handleAutoNumber = () => {
    const codeGen = data?.data
    form?.setFieldsValue({ code: codeGen?.preview_code, name: codeGen?.name })
  }

  const onSubmit = (values: DepartmentPayload) => {
    create(
      { resource: resource?.name ?? 'departments', values },
      {
        onSuccess: () => {
          go({
            to: { resource: resource?.name ?? 'departments', action: 'list' },
          })
        },
      },
    )
  }

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('departments.departments')}
        </Title>
      ),
    },
    { title: <Title level={5}>{t('departments.create.create')}</Title> },
  ]

  return (
    <Create
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      rightFooterButtons={
        <Col>
          <Button
            size="middle"
            type="primary"
            htmlType="submit"
            loading={isLoading}
            onClick={() => onSubmit(form.getFieldsValue())}
          >
            {t('buttons.create')}
          </Button>
        </Col>
      }
    >
      <Form
        form={form}
        labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
        wrapperCol={{ xs: 24, sm: 16, md: 14, lg: 12, xl: 10 }}
        labelAlign="left"
        layout="horizontal"
        colon={false}
        autoComplete="off"
      >
        <Form.Item
          required
          label={<Text strong>{t(`departments.create.create`)}</Text>}
          style={{ marginBottom: 16 }}
        >
          <Row align="middle" gutter={[8, 8]}>
            <Col flex="none">
              <Form.Item
                name="code"
                rules={codeRules}
                style={{ marginBottom: 0 }}
              >
                <Input
                  placeholder="DEP001"
                  size="middle"
                  style={{ width: 240 }}
                />
              </Form.Item>
            </Col>

            <Col flex="none">
              <Text type="secondary" style={{ whiteSpace: 'nowrap' }}>
                (A-Z, 0-9, -)
              </Text>
            </Col>

            <Col xs={24} sm="auto" flex="none">
              <Space direction="vertical" size={6} wrap>
                <Button
                  size="middle"
                  type="default"
                  loading={loadingDp}
                  onClick={() => {
                    refetch().then(() => {
                      handleAutoNumber()
                    })
                  }}
                >
                  {t('departments.create.auto_number')}
                </Button>
                <Button
                  type="link"
                  onClick={() => show(data?.data?.id)}
                  className="text-blue-500"
                >
                  {t('departments.create.popup_number_setting')}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label={<Text strong>{t('departments.fields.name')}</Text>}
          name="name"
          rules={nameRules}
        >
          <Input
            placeholder={t('departments.create.name_placeholder')}
            size="middle"
            style={{ maxWidth: 560 }}
          />
        </Form.Item>
      </Form>

      <Modal
        open={open}
        onCancel={close}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        width={'70vh'}
      >
        <CodeIssueSettingEdit modalProps={modalFormProps} />
      </Modal>
    </Create>
  )
}

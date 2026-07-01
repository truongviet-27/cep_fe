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
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, Modal, Row, Space, Typography } from 'antd'
import type { Rule } from 'antd/es/form'
import Link from 'next/link'
import { useEffect, useMemo } from 'react'

const { Text } = Typography

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
      {
        pattern: /^(?!-)(?!.*-$)[A-Z0-9-]+$/,
        message:
          '部門コードにはA〜Z の英字、0〜9 の数字、およびハイフン（-）のみ使用できます。先頭・末尾にハイフンは使えません。',
      },
      { max: 20, message: '最大20文字までです。' },
    ],
    [],
  )

  const nameRules: Rule[] = useMemo(
    () => [
      { required: true, message: '部門名は必須です。' },
      { max: 100, message: '最大100文字までです。' },
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
    redirect: false,
    onMutationSuccess: () => {
      refetch()
    },
  })

  const { show, close, open } = modalFormProps

  const isAutomatic = data?.data?.issue_method === 'automatic'

  useEffect(() => {
    if (isAutomatic && !form.getFieldValue('code')) {
      refetch().then((result) => {
        const preview_code = result?.data?.data?.preview_code
        if (preview_code) {
          form?.setFieldsValue({ code: preview_code })
        }
      })
    }
  }, [isAutomatic, form, refetch])

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
        <Link href="/departments">
          {boldText(t('departments.departments'))}
        </Link>
      ),
    },
    {
      title: boldText(t('departments.create.create'), PRIMARY),
    },
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
            onClick={() => form.submit()}
            autoInsertSpace={false}
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
        onFinish={onSubmit}
      >
        <Form.Item
          required
          label={<Text strong>{t(`departments.fields.code`)}</Text>}
          style={{ marginBottom: 16 }}
        >
          <Row align="middle" gutter={[8, 8]}>
            <Col flex="none">
              <Form.Item name="code" rules={codeRules} noStyle>
                <Input placeholder="DEP001" size="middle" className="w-full" />
              </Form.Item>
            </Col>

            <Col flex="none">
              <Text
                type="secondary"
                style={{ whiteSpace: 'nowrap', color: '#000' }}
              >
                (A-Z, 0-9, -)
              </Text>
            </Col>

            <Col xs={24} sm="auto" flex="none">
              <Space direction="horizontal" size={3} wrap>
                <Button
                  size="middle"
                  loading={loadingDp}
                  onClick={() => {
                    refetch().then((result) => {
                      const preview_code = result?.data?.data?.preview_code
                      if (preview_code) {
                        form?.setFieldsValue({ code: preview_code })
                      }
                    })
                  }}
                  disabled={!isAutomatic}
                  {...(isAutomatic
                    ? {
                        color: 'primary' as const,
                        variant: 'outlined' as const,
                      }
                    : {})}
                >
                  {t('departments.create.auto_number')}
                </Button>
                <Button
                  type="link"
                  onClick={() => show(data?.data?.id)}
                  style={{
                    marginLeft: -16,
                    color: PRIMARY,
                  }}
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

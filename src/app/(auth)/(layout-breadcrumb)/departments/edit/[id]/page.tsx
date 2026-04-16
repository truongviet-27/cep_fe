'use client'

import { RightOutlined } from '@ant-design/icons'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import ShowMoreInfo from '@components/common/show-more-info'
import { Edit } from '@components/crud/edit'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useForm, useModalForm } from '@refinedev/antd'
import { useApiUrl, useCustom, useGo, useTranslate } from '@refinedev/core'
import type { CodeIssueSetting, Department } from '@sdk/hey-api'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { DEPARTMENT_DEFAULT } from '@utility/constant'
import { Button, Col, Form, Input, Modal, Row, Space, Typography } from 'antd'
import type { Rule } from 'antd/es/form'
import dayjs from 'dayjs'
import Link from 'next/link'
import React, { useMemo } from 'react'

const { Text } = Typography

export default function EmployeeEdit() {
  const t = useTranslate()

  const go = useGo()

  const { formProps, saveButtonProps, queryResult, form } = useForm<Department>(
    {
      redirect: false,
      onMutationSuccess: () => {
        go({ to: '/departments' })
      },
    },
  )
  const employeeData = queryResult?.data?.data
  const isDefaultDepartment = employeeData?.name === DEPARTMENT_DEFAULT

  const apiUrl = useApiUrl()

  const { data, refetch, isLoading } = useCustom<CodeIssueSetting>({
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

  const codeRules: Rule[] = useMemo(
    () => [
      { required: true, message: '部門コードは必須です。' },
      { pattern: /^[A-Z0-9-]+$/, message: 'A-Z, 0-9, - のみ使用できます。' },
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

  const handleAutoNumber = () => {
    const codeGen = data?.data
    form?.setFieldsValue({ code: codeGen?.preview_code })
  }
  const isAutomatic = data?.data?.issue_method === 'automatic'

  const breadcrumbItems = [
    {
      title: (
        <Link href="/departments">
          {boldText(t('departments.departments'))}
        </Link>
      ),
    },
    {
      title: boldText(t('departments.edit.edit'), PRIMARY),
    },
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
                title: t('approve_routes.show.creator'),
                value: `${employeeData?.author?.name ?? '---'} ${dayjs(
                  employeeData?.created_at,
                ).format('YYYY/MM/DD HH:mm')}`, // <-- Sửa ở đây
              },
              {
                title: t('common.updated_by'),
                value: employeeData?.editor?.name
                  ? `${employeeData.editor.name} ${dayjs(
                      employeeData.updated_at,
                    ).format('YYYY/MM/DD HH:mm')}` // <-- Và sửa ở đây
                  : '---',
              },
            ]}
          />
        </div>
      }
      rightFooterButtons={
        <Space size={2} className={'flex justify-end'}>
          <Button
            {...saveButtonProps}
            type="primary"
            autoInsertSpace={false}
            disabled={isDefaultDepartment}
          >
            {t('products.buttons.save')}
          </Button>
        </Space>
      }
      i18nHeading={'departments.edit.edit'}
    >
      <Form
        {...formProps}
        labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
        wrapperCol={{ xs: 24, sm: 16, md: 14, lg: 12, xl: 10 }}
        labelAlign="left"
        layout="horizontal"
        colon={false}
        autoComplete="off"
      >
        <Form.Item
          required
          label={
            <Text strong>{t('departments.list.columns.department_code')}</Text>
          }
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

            <Col flex="none" className={'!-mt-2'}>
              <Text
                type="secondary"
                style={{ whiteSpace: 'nowrap', color: '#000' }}
              >
                (A-Z, 0-9, -)
              </Text>
            </Col>

            <Col xs={24} sm="auto" flex="none" className={'!-mt-3'}>
              <Space direction="horizontal" size={6} wrap>
                <Button
                  size="middle"
                  loading={isLoading}
                  onClick={() => {
                    refetch().then(() => {
                      handleAutoNumber()
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
                  className="text-blue-500"
                  disabled={!data?.data?.id}
                  style={{ marginLeft: -16, marginTop: -10 }}
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
            placeholder="例）営業本部 / 営業部 / 第一課"
            size="middle"
            style={{ maxWidth: 560 }}
            disabled={isDefaultDepartment}
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
    </Edit>
  )
}

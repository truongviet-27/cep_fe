'use client'

import { RightOutlined } from '@ant-design/icons'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import ShowMoreInfo from '@components/common/show-more-info'
import { Edit } from '@components/crud/edit'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { DeleteButton, useForm, useModalForm } from '@refinedev/antd'
import { useApiUrl, useCustom, useGo, useTranslate } from '@refinedev/core'
import type { CodeIssueSetting, Department } from '@sdk/hey-api'
import { PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, Modal, Row, Space, Typography } from 'antd'
import type { Rule } from 'antd/es/form'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'

const { Text, Title } = Typography

export default function EmployeeEdit() {
  const t = useTranslate()

  const go = useGo()

  const { formProps, saveButtonProps, queryResult, form } = useForm<Department>(
    {
      redirect: 'show',
    },
  )
  const employeeData = queryResult?.data?.data

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
  })

  const { show, close, open } = modalFormProps

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
    const codeGen = data?.data
    form?.setFieldsValue({ code: codeGen?.preview_code, name: codeGen?.name })
  }

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('departments.departments')}
        </Title>
      ),
    },
    { title: <Title level={5}>{t('departments.edit.edit')}</Title> },
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
            <DeleteButton
              icon={null}
              size={'small'}
              onSuccess={() => go({ type: 'replace', to: '/departments' })}
            />
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
      i18nHeading={t('departments.edit.edit')}
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
                  loading={isLoading}
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
                  disabled={!data?.data?.id}
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

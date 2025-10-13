/* eslint-disable */
'use client'

import { RightOutlined } from '@ant-design/icons'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import ShowMoreInfo from '@components/common/show-more-info'
import { Edit } from '@components/crud/edit'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useForm, useModalForm } from '@refinedev/antd'
import { useApiUrl, useCustom, useGo, useTranslate } from '@refinedev/core'
import type { CodeIssueSetting, Employee } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { FORMAT_DATE_TIME } from '@utility/instances'
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd'
import type { Rule } from 'antd/es/form'
import dayjs from 'dayjs'
import { isArray } from 'lodash'
import { useSession } from 'next-auth/react'
import React, { useMemo } from 'react'
import { SelectPagination } from '@components/common/select-pagination'

const { Text, Title } = Typography

export default function EmployeeEdit() {
  const t = useTranslate()
  const go = useGo()
  const apiUrl = useApiUrl()
  const session = useSession()
  const userEmail = session.data?.user?.email
  const { permission } = useUserStore.getState()

  const EXCLUDED_ROLES = ['module_admin', 'super_admin']

  const { data: roles } = useCustom({ method: 'get', url: `${apiUrl}/roles` })

  const { formProps, saveButtonProps, queryResult, form, formLoading } =
    useForm<Employee>({
      redirect: 'show',
    })
  const employeeData = queryResult?.data?.data

  const codeRules: Rule[] = useMemo(
    () => [
      { required: true, message: '部門コードは必須です。' },
      { pattern: /^[A-Z0-9-]+$/, message: 'A-Z, 0-9, - のみ使用できます。' },
      { max: 20, message: '最大32文字までです。' },
    ],
    [],
  )

  const {
    data,
    refetch,
    isLoading: loadingEm,
  } = useCustom<CodeIssueSetting>({
    url: `${apiUrl}/code-issue-settings/by-code/employees`,
    method: 'get',
  })

  const modalFormProps = useModalForm({
    action: 'edit',
    resource: 'code-issue-settings',
    autoResetFormWhenClose: true,
    warnWhenUnsavedChanges: false,
    redirect: false,
  })

  const { show, close, open } = modalFormProps

  const handleAutoNumber = () => {
    const codeGen = data?.data
    form?.setFieldsValue({ code: codeGen?.preview_code })
  }

  const isAutomatic = data?.data?.issue_method === 'automatic'

  const breadcrumbItems = [
    {
      title: boldText(t('employees.employees')),
    },
    { title: boldText('社員編集', PRIMARY) },
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
              value: `${(employeeData as any)?.created_by?.name ?? '---'} ${dayjs(
                (employeeData as any)?.created_at,
              ).format(FORMAT_DATE_TIME)}`,
            },
            {
              title: t('common.updated_by'),
              value: (employeeData as any)?.editor
                ? `${(employeeData as any).editor.name} ${dayjs(
                    (employeeData as any).updated_at,
                  ).format(FORMAT_DATE_TIME)}`
                : '---',
            },
          ]}
        />
      }
      rightFooterButtons={
        <Space size={2} className={'flex justify-end'}>
          <Button {...saveButtonProps} type="primary" loading={formLoading}>
            {t('permission_settings.buttons.save')}
          </Button>
        </Space>
      }
      i18nHeading={'employees.edit.title'}
    >
      <Form
        {...formProps}
        initialValues={{
          ...employeeData,
          department_id: employeeData?.department?.id,
          role_id: employeeData?.role?.id,
        }}
        labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
        wrapperCol={{ xs: 24, sm: 16, md: 14, lg: 12, xl: 10 }}
        labelAlign={'left'}
        layout="horizontal"
        colon={false}
        autoComplete="off"
      >
        <Form.Item label={boldText(t('employees.fields.code'))} required>
          <Row align="middle" gutter={[8, 8]} style={{ marginTop: -10 }}>
            <Col flex="none">
              <Form.Item
                name="code"
                rules={codeRules}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="EMP001" size="middle" />
              </Form.Item>
            </Col>
            <Col flex="none">
              <Text type="secondary">(A-Z, 0-9, -)</Text>
            </Col>
            {isAutomatic && (
              <Col xs={24} sm="auto" flex="none">
                <Space direction="horizontal" size={12}>
                  <Button
                    size="middle"
                    type="default"
                    color={'primary'}
                    variant="outlined"
                    onClick={() => {
                      refetch().then(() => {
                        handleAutoNumber()
                      })
                    }}
                    loading={loadingEm}
                  >
                    {t('departments.create.auto_number')}
                  </Button>
                  <Button
                    type="link"
                    onClick={() => show(data?.data?.id)}
                    className="text-blue-500 !underline"
                    style={{ marginLeft: -16, marginTop: -10 }}
                  >
                    {t('departments.create.popup_number_setting')}
                  </Button>
                </Space>
              </Col>
            )}
          </Row>
        </Form.Item>

        <Form.Item
          style={{ marginTop: -10 }}
          label={boldText(t('employees.fields.name'))}
          name="name"
        >
          <Text>{form.getFieldValue('name')}</Text>
        </Form.Item>

        <Form.Item
          style={{ marginTop: -10 }}
          label={boldText(t('employees.fields.email'))}
          name="email"
        >
          <Text>{form.getFieldValue('email')}</Text>
        </Form.Item>

        <SelectPagination
          selectProps={{
            resource: 'departments',
          }}
          formItemProps={{
            name: 'department_id',
            rules: [{ required: true, message: 'このフィールドは必須です' }],
            required: true,
            label: boldText(t('employees.fields.department')),
          }}
          selectComponentProps={{
            placeholder: t('placeholders.select'),
            style: { maxWidth: 560, minWidth: '150px' },
          }}
        />
        <Form.Item
          style={{ marginTop: -4 }}
          label={boldText(t('employees.fields.role'))}
          name="role_id"
          hidden={!permission?.is_module_admin}
        >
          {employeeData?.role?.name === 'module_admin' ? (
            <Text>{t(`employees.roles.${employeeData.role.name}`)}</Text>
          ) : (
            <Radio.Group buttonStyle="solid">
              {isArray(roles?.data) &&
                roles?.data
                  .filter(({ name }) => !EXCLUDED_ROLES.includes(name))
                  .map(({ id, name }) => (
                    <Radio key={name} value={id}>
                      {t(`employees.roles.${name}`)}
                    </Radio>
                  ))}
            </Radio.Group>
          )}
        </Form.Item>
      </Form>
      <Modal
        open={open}
        onCancel={close}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        width={'70vh'}
      >
        <CodeIssueSettingEdit
          modalProps={modalFormProps}
          refetchParent={refetch}
        />
      </Modal>
    </Edit>
  )
}

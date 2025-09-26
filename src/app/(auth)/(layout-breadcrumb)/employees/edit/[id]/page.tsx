/* eslint-disable */
'use client'

import { RightOutlined } from '@ant-design/icons'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import ShowMoreInfo from '@components/common/show-more-info'
import { Edit } from '@components/crud/edit'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useForm, useModalForm, useSelect } from '@refinedev/antd'
import {
  GetOneResponse,
  useApiUrl,
  useCustom,
  useGo,
  useTranslate,
} from '@refinedev/core'
import type { CodeIssueSetting, Employee } from '@sdk/hey-api'
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
  Select,
  Space,
  Typography,
} from 'antd'
import type { Rule } from 'antd/es/form'
import dayjs from 'dayjs'
import { isArray } from 'lodash'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

const { Text, Title } = Typography

export default function EmployeeEdit() {
  const t = useTranslate()
  const go = useGo()
  const apiUrl = useApiUrl()
  const session = useSession()
  const userEmail = session.data?.user?.email

  const { data: roles } = useCustom({ method: 'get', url: `${apiUrl}/roles` })

  const { formProps, saveButtonProps, queryResult, form, formLoading } =
    useForm<Employee>({
      redirect: 'show',
      queryOptions: {
        select: (data: GetOneResponse<Employee>) => {
          if (data.data.email === userEmail) {
            go({ to: '/403' })
          }

          return data
        },
      },
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
    defaultFormValues: {
      hash_dash: true,
    },
  })

  const { show, close, open } = modalFormProps

  const handleAutoNumber = () => {
    const codeGen = data?.data
    form?.setFieldsValue({ code: codeGen?.preview_code })
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
                (employeeData as any)?.created_by?.name ??
                '---' +
                  ' ' +
                  dayjs((employeeData as any)?.created_by?.date).format(
                    FORMAT_DATE_TIME,
                  ),
            },
            {
              title: t('common.updated_by'),
              value:
                (employeeData as any)?.updated_by?.name ??
                '---' +
                  ' ' +
                  dayjs((employeeData as any)?.updated_by?.date).format(
                    FORMAT_DATE_TIME,
                  ),
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
      i18nHeading={'社員編集'}
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
            <Col xs={24} sm="auto" flex="none">
              <Space direction="vertical" size={2}>
                <Button
                  size="middle"
                  type="default"
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
                  className="text-blue-500"
                  style={{ marginLeft: -16, marginTop: -10 }}
                >
                  {t('departments.create.popup_number_setting')}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          style={{ marginTop: -24 }}
          label={boldText(t('employees.fields.name'))}
          name="name"
        >
          <Text>{form.getFieldValue('name')}</Text>
        </Form.Item>

        <Form.Item
          style={{ marginTop: -14 }}
          label={boldText(t('employees.fields.email'))}
          name="email"
        >
          <Text>{form.getFieldValue('email')}</Text>
        </Form.Item>

        <Form.Item
          style={{ marginTop: -10 }}
          label={boldText(t('employees.fields.department'))}
          name="department_id"
          rules={[{ required: true, message: 'このフィールドは必須です' }]}
        >
          <Select
            placeholder={t('placeholders.select')}
            {...departmentSelectProps}
          />
        </Form.Item>

        <Form.Item
          style={{ marginTop: -4 }}
          label={boldText(t('employees.fields.role'))}
          name="role_id"
        >
          <Radio.Group buttonStyle="solid">
            {isArray(roles?.data) &&
              roles?.data.map(({ id, name }) => (
                <Radio key={name} value={id}>
                  {t(`employees.roles.${name}`)}
                </Radio>
              ))}
          </Radio.Group>
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

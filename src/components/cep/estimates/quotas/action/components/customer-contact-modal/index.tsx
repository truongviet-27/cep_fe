/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line simple-import-sort/imports */
import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Space, Spin, message } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'

import { useApiUrl, useCustom, useTranslate } from '@refinedev/core'

import type { CustomerContact } from '@sdk/hey-api'

import CommonTable from '@components/common/table'
import { axiosInstance } from '@providers/data-provider/rest-data-provider/utils/axios'
import { FORMAT_DATE } from '@utility/instances'

interface CustomerContactSelectionModalProps {
  open: boolean
  onClose: () => void
  customerId: number | null
  onSelect: (contact: CustomerContact) => void
}

function CustomerContactSelectionModal({
  open,
  onClose,
  customerId,
  onSelect,
}: CustomerContactSelectionModalProps) {
  const t = useTranslate()
  const apiUrl = useApiUrl()
  const [form] = Form.useForm()
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { data, isLoading, isFetching, refetch } = useCustom<{
    data: CustomerContact[]
  }>({
    url: `${apiUrl}/customer-contacts`,
    method: 'get',
    config: {
      query: {
        customer_id: customerId,
      },
    },
    queryOptions: {
      enabled: !!customerId && open,
    },
  })

  useEffect(() => {
    if (open && customerId) {
      refetch()
    }
  }, [open, customerId, refetch])

  useEffect(() => {
    if (!open) {
      setIsAdding(false)
      form.resetFields()
    }
  }, [open, form])

  useEffect(() => {
    if (open && !isLoading && !isFetching) {
      const contacts = (data?.data as any) || []

      if (contacts.length === 0) {
        setIsAdding(true)
      }
    }
  }, [open, isLoading, isFetching, data?.data])

  const handleSelect = (contact: CustomerContact) => {
    onSelect(contact)
    onClose()
  }

  const handleAddNew = () => {
    setIsAdding(true)
    form.resetFields()
  }

  const handleCancelAdd = () => {
    setIsAdding(false)
    form.resetFields()
  }

  const handleSaveNew = async () => {
    try {
      const values = await form.validateFields()

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(values.email)) {
        message.error(t('validation.email_format'))
        return
      }

      const emailExists = (data?.data as any)?.some(
        (contact: any) =>
          contact.email?.toLowerCase() === values.email.toLowerCase(),
      )
      if (emailExists) {
        message.error(t('validation.duplicate_email'))
        return
      }

      setIsSaving(true)

      await axiosInstance.patch(`${apiUrl}/customer-contacts`, {
        contacts: [
          {
            customer_id: customerId,
            department_name: values.department_name || null,
            contact_person_name: values.contact_person_name,
            email: values.email,
          },
        ],
      })

      message.success(t('notifications.createSuccess'))
      setIsAdding(false)
      form.resetFields()
      refetch()
    } catch (error: any) {
      if (error.errorFields) {
        // Validation error from form
        return
      }
      const errorMessage =
        error?.response?.data?.message || t('notifications.createError')
      message.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (contactId: number) => {
    setIsSaving(true)
    try {
      await axiosInstance.delete(`${apiUrl}/customer-contacts`, {
        data: {
          ids: [contactId],
        },
      })
      message.success(t('notifications.deleteSuccess'))
      await refetch()
      // Auto add new row if no contacts remain after delete
      if (!data?.data || (data?.data as any)?.length <= 1) {
        setIsAdding(true)
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || t('notifications.deleteError')
      message.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const tableData = useMemo(() => {
    const contacts = [...((data?.data as any) || [])]
    if (isAdding) {
      contacts.push({
        id: 'new',
        isNew: true,
      })
    }
    return contacts
  }, [data?.data, isAdding])

  const columns = useMemo(
    () => [
      {
        title: t('quotas.action.customer_contact_modal.department_name'),
        dataIndex: 'department_name',
        key: 'department_name',
        width: '20%',
        render: (text: string, record: any) => {
          if (record.isNew) {
            return (
              <Form.Item name="department_name" style={{ marginBottom: 0 }}>
                <Input
                  placeholder={t(
                    'quotas.action.customer_contact_modal.department_name',
                  )}
                />
              </Form.Item>
            )
          }
          return text || ''
        },
      },
      {
        title: (
          <span>
            {t('quotas.action.customer_contact_modal.contact_person_name')}
          </span>
        ),
        dataIndex: 'contact_person_name',
        key: 'contact_person_name',
        width: '20%',
        render: (text: string, record: any) => {
          if (record.isNew) {
            return (
              <Form.Item
                name="contact_person_name"
                style={{ marginBottom: 0 }}
                rules={[
                  {
                    required: true,
                    message: t(''),
                  },
                ]}
              >
                <Input
                  placeholder={t(
                    'quotas.action.customer_contact_modal.contact_person_name',
                  )}
                />
              </Form.Item>
            )
          }
          return text
        },
      },
      {
        title: <span>{t('quotas.action.customer_contact_modal.email')}</span>,
        dataIndex: 'email',
        key: 'email',
        width: '25%',
        render: (text: string, record: any) => {
          if (record.isNew) {
            return (
              <Form.Item
                name="email"
                style={{ marginBottom: 0 }}
                rules={[
                  {
                    required: true,
                    message: t(''),
                  },
                  {
                    type: 'email',
                    message: t(''),
                  },
                ]}
              >
                <Input
                  type="email"
                  placeholder={t('quotas.action.customer_contact_modal.email')}
                />
              </Form.Item>
            )
          }
          return text
        },
      },
      {
        title: t('quotas.action.customer_contact_modal.created_at'),
        dataIndex: 'created_at',
        key: 'created_at',
        width: '20%',
        render: (text: string, record: any) => {
          if (record.isNew) {
            return ''
          }
          return text ? dayjs(text).format(FORMAT_DATE) : ''
        },
      },
      {
        title: t('table.actions'),
        key: 'actions',
        width: '15%',
        align: 'center' as const,
        render: (_: any, record: any) => {
          if (record.isNew) {
            return (
              <Space>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleSaveNew}
                  size="small"
                  loading={isSaving}
                />
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={handleCancelAdd}
                  size="small"
                />
              </Space>
            )
          }
          // Count only real contacts (not the new row being added)
          const realContacts = (data?.data as any) || []
          const totalRealContacts = realContacts.length
          const canDelete = totalRealContacts > 1

          return (
            <Space>
              <Button
                type="default"
                onClick={() => handleSelect(record)}
                style={{ color: '#1890ff', borderColor: '#1890ff' }}
              >
                {t('buttons.select')}
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id)}
                size="small"
                disabled={!canDelete}
              />
            </Space>
          )
        },
      },
    ],
    [
      t,
      isSaving,
      handleSaveNew,
      handleCancelAdd,
      handleSelect,
      handleDelete,
      data?.data,
    ],
  )

  return (
    <Modal
      title={t('quotas.action.customer_contact_modal.title')}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <Spin spinning={isLoading || isFetching}>
        <Form form={form} component={false}>
          <CommonTable
            dataSource={tableData}
            rowKey={(record) => record.id}
            pagination={false}
            columns={columns}
            scroll={{ x: undefined }}
          />
        </Form>

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button type="primary" onClick={handleAddNew} disabled={isAdding}>
            新規作成
          </Button>
        </div>
      </Spin>
    </Modal>
  )
}

export default CustomerContactSelectionModal

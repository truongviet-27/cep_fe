/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line simple-import-sort/imports */
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Space, Spin, message } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

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
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newContact, setNewContact] = useState({
    department_name: '',
    contact_person_name: '',
    email: '',
  })

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
      setNewContact({
        department_name: '',
        contact_person_name: '',
        email: '',
      })
    }
  }, [open])

  const handleSelect = (contact: CustomerContact) => {
    onSelect(contact)
    onClose()
  }

  const handleAddNew = () => {
    setIsAdding(true)
  }

  const handleCancelAdd = () => {
    setIsAdding(false)
    setNewContact({
      department_name: '',
      contact_person_name: '',
      email: '',
    })
  }

  const handleSaveNew = async () => {
    if (!newContact.contact_person_name || !newContact.email) {
      message.error(t('validations.required'))
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newContact.email)) {
      message.error(t('validation.email_format'))
      return
    }

    const emailExists = (data?.data as any)?.some(
      (contact: any) =>
        contact.email?.toLowerCase() === newContact.email.toLowerCase(),
    )
    if (emailExists) {
      message.error(t('validation.duplicate_email'))
      return
    }

    setIsSaving(true)
    try {
      await axiosInstance.patch(`${apiUrl}/customer-contacts`, {
        contacts: [
          {
            customer_id: customerId,
            department_name: newContact.department_name || null,
            contact_person_name: newContact.contact_person_name,
            email: newContact.email,
          },
        ],
      })

      message.success(t('notifications.createSuccess'))
      setIsAdding(false)
      setNewContact({
        department_name: '',
        contact_person_name: '',
        email: '',
      })
      refetch()
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || t('notifications.createError')
      message.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const tableData = [...((data?.data as any) || [])]
  if (isAdding) {
    tableData.push({
      id: 'new',
      isNew: true,
    })
  }

  return (
    <Modal
      title={t('quotas.action.customer_contact_modal.title')}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <Spin spinning={isLoading || isSaving || isFetching}>
        <CommonTable
          dataSource={tableData}
          rowKey={(record) => record.id || 'new'}
          pagination={false}
          columns={[
            {
              title: t('quotas.action.customer_contact_modal.department_name'),
              dataIndex: 'department_name',
              key: 'department_name',
              width: '20%',
              render: (text, record: any) => {
                if (record.isNew) {
                  return (
                    <Input
                      value={newContact.department_name}
                      onChange={(e) =>
                        setNewContact({
                          ...newContact,
                          department_name: e.target.value,
                        })
                      }
                      placeholder={t(
                        'quotas.action.customer_contact_modal.department_name',
                      )}
                    />
                  )
                }
                return text || '---'
              },
            },
            {
              title: (
                <span>
                  {t(
                    'quotas.action.customer_contact_modal.contact_person_name',
                  )}
                  <span style={{ color: 'red' }}>*</span>
                </span>
              ),
              dataIndex: 'contact_person_name',
              key: 'contact_person_name',
              width: '20%',
              render: (text, record: any) => {
                if (record.isNew) {
                  return (
                    <Input
                      value={newContact.contact_person_name}
                      onChange={(e) =>
                        setNewContact({
                          ...newContact,
                          contact_person_name: e.target.value,
                        })
                      }
                      placeholder={t(
                        'quotas.action.customer_contact_modal.contact_person_name',
                      )}
                    />
                  )
                }
                return text
              },
            },
            {
              title: (
                <span>
                  {t('quotas.action.customer_contact_modal.email')}
                  <span style={{ color: 'red' }}>*</span>
                </span>
              ),
              dataIndex: 'email',
              key: 'email',
              width: '25%',
              render: (text, record: any) => {
                if (record.isNew) {
                  return (
                    <Input
                      type="email"
                      value={newContact.email}
                      onChange={(e) =>
                        setNewContact({
                          ...newContact,
                          email: e.target.value,
                        })
                      }
                      placeholder={t(
                        'quotas.action.customer_contact_modal.email',
                      )}
                    />
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
              render: (text, record: any) => {
                if (record.isNew) {
                  return '---'
                }
                return text ? dayjs(text).format(FORMAT_DATE) : '---'
              },
            },
            {
              title: t('table.actions'),
              key: 'actions',
              width: '15%',
              align: 'center',
              render: (_, record: any) => {
                if (record.isNew) {
                  return (
                    <Space>
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={handleSaveNew}
                        size="small"
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
                return (
                  <Button
                    type="default"
                    onClick={() => handleSelect(record)}
                    style={{ color: '#1890ff', borderColor: '#1890ff' }}
                  >
                    {t('buttons.select')}
                  </Button>
                )
              },
            },
          ]}
        />
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

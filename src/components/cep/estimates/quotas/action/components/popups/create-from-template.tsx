import CommonTable from '@components/common/table'
import useDate from '@hook/use-date'
import { useTable } from '@refinedev/antd'
import type { useTranslate } from '@refinedev/core'
import { useGo } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { Button, Col, Flex, Form, Input, Modal, Row, Space } from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { useMemo } from 'react'

interface CreateFromTemplateModalProps {
  open: boolean
  onClose: () => void
  t: ReturnType<typeof useTranslate>
}

function CreateFromTemplate({
  open,
  onClose,
  t,
}: CreateFromTemplateModalProps) {
  const { convertDate } = useDate()
  const go = useGo()
  const { tableProps, searchFormProps, setFilters } = useTable({
    pagination: { pageSize: 20 },
    resource: 'quota-templates',
    syncWithLocation: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSearch(values: any) {
      return [
        {
          field: 'name_lk',
          operator: 'eq',
          value: values.name_lk ?? null,
        },
      ]
    },
  })

  const handleSelectTemplate = (templateId: number) => {
    onClose()
    go({
      to: '/quotas/create?templateId=' + templateId,
    })
  }

  const columns = useMemo(() => {
    return [
      {
        title: null,
        dataIndex: 'template_name',
        key: 'template_name',
        align: 'left',
        render(_, record) {
          return (
            <Flex vertical gap={2}>
              <Space>
                <span>{record.name}</span>
              </Space>
              <div>
                <span className="border-r-1 border-[#666666] pr-2 text-[#666666]">
                  {t('quotas.popups.createFromTemplate.created_at', {
                    dateFormatted: convertDate(record.created_at),
                  })}
                </span>
                <span className="pl-2 text-[#666666]">
                  {t('quotas.popups.createFromTemplate.number_product', {
                    number_product: record.number_product,
                  })}
                </span>
              </div>
            </Flex>
          )
        },
      },
      {
        title: null,
        dataIndex: 'action',
        key: 'action',
        align: 'right',
        render(_, record) {
          return (
            <Button
              type="primary"
              variant="filled"
              onClick={() => handleSelectTemplate(record.id)}
            >
              {t('buttons.select')}
            </Button>
          )
        },
      },
    ] as ColumnsType
  }, [])

  return (
    <Modal
      title={boldText(t('quotas.popups.createFromTemplate.title'))}
      open={open}
      maskClosable={false}
      keyboard={false}
      onCancel={onClose}
      width={{ xs: '90%', sm: '70%', xl: '50%' }}
      footer={null}
      style={{ top: 20 }}
    >
      <Form {...searchFormProps}>
        <Row gutter={[20, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item name={'name_lk'}>
              <Input
                placeholder={t('quotas.popups.createFromTemplate.place_holder')}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Flex
              gap={8}
              style={{
                marginBottom: 10,
              }}
            >
              <Button type="primary" variant="filled" htmlType="submit">
                {t('quota_templates.button.search')}
              </Button>
              <Button
                type="default"
                onClick={() => {
                  searchFormProps.form?.setFieldsValue([])
                  setFilters([], 'replace')
                }}
              >
                {t('buttons.clear')}
              </Button>
            </Flex>
          </Col>
        </Row>

        <CommonTable
          {...tableProps}
          columns={columns}
          components={{
            header: {
              cell: () => null,
            },
            body: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cell: ({ children, style, ...rest }: any) => {
                return (
                  <td
                    style={{ ...style, borderRight: 'none', padding: 10 }}
                    {...rest}
                    className="border-r-0"
                  >
                    {children}
                  </td>
                )
              },
            },
          }}
          showHeader={false}
        />
      </Form>
    </Modal>
  )
}

export default CreateFromTemplate

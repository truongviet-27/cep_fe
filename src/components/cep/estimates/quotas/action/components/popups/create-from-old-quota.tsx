import CommonTable from '@components/common/table'
import useDate from '@hook/use-date'
import { useTable } from '@refinedev/antd'
import type { useTranslate } from '@refinedev/core'
import { useGo } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { FORMAT_DATE_CROSS } from '@utility/instances'
import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Space,
} from 'antd'
import { type ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo } from 'react'

interface CreateFromOldQuotaProps {
  open: boolean
  onClose: () => void
  t: ReturnType<typeof useTranslate>
}

function CreateFromOldQuota({ open, onClose, t }: CreateFromOldQuotaProps) {
  const { RangePicker } = DatePicker
  const { convertDate } = useDate()
  const go = useGo()
  const { tableProps, searchFormProps, setFilters } = useTable({
    pagination: { pageSize: 20 },
    resource: 'quotas',
    syncWithLocation: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSearch(values: any) {
      return [
        {
          field: 'code',
          operator: 'eq',
          value: values.code ?? null,
        },
        {
          field: 'search_date_type',
          operator: 'eq',
          value: 'created_at',
        },
        {
          field: 'start_date',
          operator: 'eq',
          value: !!values?.date
            ? dayjs((values?.date ?? [])[0]).format('YYYY-MM-DD')
            : null,
        },
        {
          field: 'end_date',
          operator: 'eq',
          value: !!values?.date
            ? dayjs((values?.date ?? [])[1]).format('YYYY-MM-DD')
            : null,
        },
      ]
    },
  })

  const handleSelectTemplate = (templateId: number) => {
    onClose()
    go({
      to: '/quotas/clone/' + templateId,
    })
  }

  const columns = useMemo(() => {
    return [
      {
        title: null,
        align: 'left',
        render(_, record) {
          return (
            <Flex vertical gap={2}>
              <Space>
                <span>
                  {boldText(t('quotas.popups.createFromOldQuota.quota_code'))}:{' '}
                  {record.code}
                </span>
              </Space>
              <div>
                <span className="border-r-1 border-[#666666] pr-2 text-[#666666]">
                  {t('quotas.popups.createFromOldQuota.created_at')}:{' '}
                  {convertDate(record.created_at)}
                </span>
                <span className="border-r-1 border-[#666666] px-2 text-[#666666]">
                  {t('quotas.popups.createFromOldQuota.total_price')}: ¥
                  {Number(record?.total_price).toLocaleString()}
                </span>
                <span className="pl-2 text-[#666666]">
                  {t('quotas.popups.createFromOldQuota.number_product')}:{' '}
                  {Number(record?.number_products).toLocaleString()}点
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
              autoInsertSpace={false}
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
      title={boldText(t('quotas.popups.createFromOldQuota.title'))}
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
          <Col xs={24} sm={8}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t('quotas.popups.createFromOldQuota.quota_code')}
                </span>
              }
              layout="vertical"
              name={'code'}
            >
              <Input placeholder={t('quotas.filters.partial_match')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t('quotas.popups.createFromOldQuota.created_at')}
                </span>
              }
              layout="vertical"
              name={'date'}
            >
              <RangePicker
                allowClear
                className="w-full"
                placeholder={[FORMAT_DATE_CROSS, FORMAT_DATE_CROSS]}
                format={FORMAT_DATE_CROSS}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item label=" " layout="vertical">
              <Flex
                gap={8}
                style={{
                  marginBottom: 10,
                }}
              >
                <Button
                  type="primary"
                  variant="filled"
                  htmlType="submit"
                  autoInsertSpace={false}
                >
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
            </Form.Item>
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

export default CreateFromOldQuota

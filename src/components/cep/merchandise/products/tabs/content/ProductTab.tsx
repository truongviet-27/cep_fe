import useProduct from '@components/cep/merchandise/products/use-product'
import CoreInput from '@components/common/core-input'
import ProductCategoryDropdown from '@components/common/product-category-dropdown'
import CommonTable from '@components/common/table'
import { axiosInstance } from '@providers/data-provider/rest-data-provider/utils'
import { CreateButton } from '@refinedev/antd'
import { useApiUrl } from '@refinedev/core'
import { Button, Col, Form, notification, Row } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ProductTab() {
  const [
    { columns, tableProps, searchFormProps, isFullAccess },
    { t, setFilters },
  ] = useProduct()
  const apiUrl = useApiUrl()
  const router = useRouter()
  const [isExportingCsv, setIsExportingCsv] = useState(false)

  const onExportCsv = async () => {
    const values = (searchFormProps.form?.getFieldsValue?.() ?? {}) as {
      search?: string
      category_id?: string | number
    }

    setIsExportingCsv(true)
    try {
      notification.info({
        message:
          'システムエラーの発生を抑制するため、最新の1,000件のレコードのみダウンロードを実施いたします。',
      })

      const response = await axiosInstance.get(
        `${apiUrl}/products/export-csv`,
        {
          params: {
            q: values.search || undefined,
            category_id: values.category_id || undefined,
          },
          responseType: 'blob',
        },
      )

      const contentType = String(response.headers?.['content-type'] ?? '')
      const isCsvResponse =
        contentType.includes('text/csv') ||
        contentType.includes('application/octet-stream')

      let taskId: string | number | undefined
      if (isCsvResponse) {
        const blob = new Blob([response.data], {
          type: 'text/csv; charset=UTF-8',
        })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `products_export_${Date.now()}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        const text = await response.data.text()
        const payload = text ? JSON.parse(text) : undefined
        taskId =
          payload?.id ??
          payload?.task_id ??
          payload?.data?.id ??
          payload?.data?.task_id
      }

      const params = new URLSearchParams()
      params.set('pageSize', '10')
      params.set('current', '1')
      if (taskId) {
        params.set('id', String(taskId))
      }
      router.replace(`/import-history?${params.toString()}`)
    } finally {
      setIsExportingCsv(false)
    }
  }

  return (
    <Form {...searchFormProps}>
      <Row gutter={16}>
        <Col sm={12} md={6} lg={4}>
          <CoreInput
            name="search"
            label={
              <span className="font-bold">
                {t('products.list.searchArea.productInputLabel')}
              </span>
            }
            placeholder={t('products.list.searchArea.productInputPlaceholder')}
          />
        </Col>

        <Col sm={12} md={6} lg={4}>
          <Form.Item
            label={
              <span className="font-bold">
                {t('products.list.searchArea.categoryLabel')}
              </span>
            }
            layout="vertical"
            name="category_id"
          >
            <ProductCategoryDropdown
              placeholder={t('products.list.searchArea.categoryPlaceholder')}
              onSelect={(_, __, ___, categoryId) => {
                searchFormProps.form?.setFieldValue('category_id', categoryId)
              }}
            />
          </Form.Item>
        </Col>

        <div className="mx-3 mt-[29px] mb-2 flex flex-1 flex-wrap justify-between gap-4">
          <div className="mr-auto flex flex-1 gap-4">
            <Button
              type="primary"
              htmlType="submit"
              onClick={searchFormProps.form?.submit}
              autoInsertSpace={false}
            >
              {t('buttons.search')}
            </Button>
            <Button
              onClick={() => {
                searchFormProps.form?.resetFields?.()
                setFilters([], 'replace')
              }}
              color="primary"
              variant="outlined"
            >
              {t('products.list.searchArea.clearButton')}
            </Button>
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <Button
                onClick={onExportCsv}
                color="primary"
                variant="outlined"
                loading={isExportingCsv}
                disabled={!isFullAccess}
              >
                {t('products.list.actions.csvExportButton')}
              </Button>
              <Link href={'products/create'}>
                <CreateButton type="primary" icon={null}>
                  {t('products.list.actions.createNewButton')}
                </CreateButton>
              </Link>
            </div>
            <div className="flex w-full items-center justify-end gap-2">
              <Link href={'products/csv'}>
                <Button
                  className="!px-0 !text-[#721C24] underline"
                  type="link"
                  icon={null}
                  disabled={!isFullAccess}
                >
                  {t('products.list.actions.csvBulkUploadLink')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Row>
      <div>
        <CommonTable
          {...tableProps}
          columns={columns}
          scroll={undefined}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
          }}
        />
      </div>
    </Form>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import BasicInfo from '@components/cep/estimates/quota/components/basic-info'
import DetailInfo from '@components/cep/estimates/quota/components/detail-info'
import History from '@components/cep/estimates/quota/components/history'
import Note from '@components/cep/estimates/quota/components/note'
import OptionalInfo from '@components/cep/estimates/quota/components/optional-info'
import Tags from '@components/cep/estimates/quota/components/tags'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { DeleteButton, useForm } from '@refinedev/antd'
import { useGo, useParsed, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Row,
  Space,
  Typography,
} from 'antd'
import dayjs from 'dayjs'

const { Title } = Typography

function QuotaAction() {
  const t = useTranslate()
  const methods = useForm()

  const { id } = useParsed()

  const isUpdate = !!id

  const go = useGo()

  const query = {} as any

  const { formProps, saveButtonProps } = methods

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('estimates.estimates')}
                </Title>
              ),
            },
            {
              title: (
                <Title level={5}>
                  {isUpdate ? t('quota.edit') : t('quota.create')}
                </Title>
              ),
            },
          ]}
        />
      }
      title={
        <div className="flex justify-between">
          <span>{isUpdate ? t('quota.edit') : t('quota.create')}</span>
          <Button>プレビュー</Button>
        </div>
      }
    >
      <Form
        {...formProps}
        labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
        labelAlign="left"
        layout="horizontal"
        colon={false}
        autoComplete="off"
        initialValues={{
          source_id: 123,
          title: 'hung123',
          type: 'normal',
          status: 'waiting_approve',
          delivery_date: '2025-10-01T00:00:00Z',
          delivery_method: 'free text',
          payment_due_date: 'monthly_25',
          expiration_date: 'days_7',
          consumption_tax: 'exclusive',
          tax_rate: 12,
          note: 'textarea',
          tags: [
            {
              id: 1,
              name: 'name',
            },
            {
              id: 2,
              name: 'name2',
            },
          ],
          original_product: [
            {
              id: 123,
              group_name: 'group_name',
              products: [
                {
                  id: 1,
                  product_id: 1,
                  package_id: 1,
                  name: 'name',
                  code: 'code',
                  cost_price: 123123,
                  selling_price: 123123,
                  profit_margin: 12,
                  is_add_total: true,
                },
                {
                  id: 2,
                  product_id: 1,
                  package_id: 2,
                  name: 'name',
                  code: 'code',
                  cost_price: 123123,
                  selling_price: 123123,
                  profit_margin: 12,
                  is_add_total: true,
                },
              ],
            },
          ],
          additional_product: [
            {
              id: 123,
              group_name: 'group_name',
              products: [
                {
                  id: 1,
                  product_id: 1,
                  package_id: 1,
                  name: 'name',
                  code: 'code',
                  cost_price: 123123,
                  selling_price: 123123,
                  profit_margin: 12,
                  is_add_total: true,
                },
                {
                  id: 2,
                  product_id: 1,
                  package_id: 2,
                  name: 'name',
                  code: 'code',
                  cost_price: 123123,
                  selling_price: 123123,
                  profit_margin: 12,
                  is_add_total: true,
                },
              ],
            },
          ],
        }}
      >
        <BasicInfo />
        <DetailInfo />
        <OptionalInfo />
        <Row>
          <Col xs={24}>
            <Note />
          </Col>
        </Row>
        <Tags />
        {isUpdate && <History />}

        <Divider />
        {isUpdate && (
          <ShowMoreInfo
            descriptions={[
              {
                title: t('approve_routes.show.creator'),
                value:
                  (query.data?.data?.author?.name ?? '---') +
                  ' ' +
                  dayjs(query.data?.data?.create_at).format('YYYY/MM/DD HH:mm'),
              },
              {
                title: t('approve_routes.show.updater'),
                value:
                  (query.data?.data?.editor?.name ?? '---') +
                  ' ' +
                  dayjs(query.data?.data?.update_at).format('YYYY/MM/DD HH:mm'),
              },
            ]}
          />
        )}

        <Flex
          justify="space-between"
          style={{
            marginTop: 40,
          }}
        >
          <Space>
            {isUpdate && (
              <DeleteButton
                icon={null}
                size={'small'}
                onSuccess={() => {
                  go({
                    to: '/quota',
                  })
                }}
              />
            )}
          </Space>
          <Space className="items-end">
            <Button
              type="default"
              onClick={() => {
                go({
                  to: '/quota',
                })
              }}
            >
              {t('buttons.back')}
            </Button>

            <Button {...saveButtonProps} type="primary">
              {isUpdate ? t('buttons.edit') : t('buttons.create')}
            </Button>
          </Space>
        </Flex>
      </Form>
    </PageContainer>
  )
}

export default QuotaAction

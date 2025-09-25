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
  Divider,
  Flex,
  Form,
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
                  {t('quota.quota')}
                </Title>
              ),
            },
            {
              title: (
                <Title level={5}>
                  {id ? t('quota.edit') : t('quota.create')}
                </Title>
              ),
            },
          ]}
        />
      }
      title={
        <div className="flex justify-between">
          <span>{id ? t('quota.edit') : t('quota.create')}</span>
          <Button>プレビュー</Button>
        </div>
      }
    >
      <Form
        {...formProps}
        labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
        wrapperCol={{ xs: 24, sm: 16, md: 10, lg: 8, xl: 8 }}
        labelAlign="left"
        layout="horizontal"
        colon={false}
        autoComplete="off"
        initialValues={{
          detail_info: [
            {
              title: '商品リスト名入力',
              children: [
                {
                  key: '1',
                  productCode: 'P-001',
                  productName: 'ノートパソコン', // Laptop
                  unit: '台',
                  package: '箱',
                  costPrice: 50000,
                  sellingPrice: 65000,
                  quantity: 2,
                  profitRate: 30,
                  sellingAmount: 130000,
                  total: 130000,
                },
                {
                  key: '2',
                  productCode: 'P-002',
                  productName: 'マウス', // Mouse
                  unit: '個',
                  package: '-',
                  costPrice: 800,
                  sellingPrice: 1200,
                  quantity: 5,
                  profitRate: 50,
                  sellingAmount: 6000,
                  total: 6000,
                },
                {
                  key: '3',
                  productCode: 'P-003',
                  productName: 'サービスA', // Service A
                  unit: '式',
                  package: '-',
                  costPrice: 10000,
                  sellingPrice: 15000,
                  quantity: 1,
                  profitRate: 50,
                  sellingAmount: 15000,
                  total: 15000,
                },
              ],
            },
          ],
        }}
      >
        <BasicInfo />
        <DetailInfo />
        <OptionalInfo />
        <Note />
        <Tags />
        <History />

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
                    to: '/approve-routes',
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
                  to: '/approve-routes',
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

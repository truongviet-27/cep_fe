import { RightOutlined } from '@ant-design/icons'
import { DetailItem } from '@components/common/detail-item'
import ShowMoreInfo from '@components/common/show-more-info'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { DeleteButton, Show } from '@refinedev/antd'
import { useShow, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Typography } from 'antd'
import dayjs from 'dayjs'

const { Title } = Typography

function ApproveDetail() {
  const t = useTranslate()

  const { queryResult } = useShow()

  const departmentData = queryResult?.data?.data

  return (
    <Show
      title={
        <Breadcrumbs
          items={[
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('merchandise.merchandise')}
                </Title>
              ),
            },
            {
              title: <Title level={5}>{t('approve.approve')}</Title>,
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      footerButtons={
        <div>
          <ShowMoreInfo
            descriptions={[
              {
                title: t('common.created_by'),
                value: `${departmentData?.author?.name ?? '---'} ${dayjs(
                  departmentData?.created_at,
                ).format('YYYY/MM/DD HH:mm')}`,
              },
              {
                title: t('common.updated_by'),
                value: departmentData?.editor?.name
                  ? `${departmentData.editor.name} ${dayjs(
                      departmentData.updated_at,
                    ).format('YYYY/MM/DD HH:mm')}`
                  : '---',
              },
            ]}
          />
          <div className="mt-4 flex w-full justify-start pb-4">
            <DeleteButton icon={null} size={'small'} />
          </div>
        </div>
      }
    >
      <div className="flex flex-col space-y-6">
        <DetailItem label={t('ルートコード')}>
          {departmentData?.code}
        </DetailItem>
        <DetailItem label={t('ルート名')}>{departmentData?.name}</DetailItem>
        <DetailItem label={t('部門（支社/部/課）')}>
          {departmentData?.number_of_employee}
        </DetailItem>
        <DetailItem label={t('ステータス')}>
          {departmentData?.number_of_employee}
        </DetailItem>
      </div>
    </Show>
  )
}

export default ApproveDetail

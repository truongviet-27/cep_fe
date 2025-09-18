import { PRIMARY, WHITE } from '@utility/color'
import { Card, Typography } from 'antd'
import type { ReactNode } from 'react'

const { Title } = Typography

const PageContainer = ({
  title,
  breadcrumbs,
  children,
}: {
  title: string | ReactNode
  breadcrumbs?: ReactNode
  children: ReactNode
}) => {
  return (
    <div className="h-full w-full overflow-hidden">
      <div className="mt-[4px] mb-[12px] px-[24px]">{breadcrumbs}</div>
      <Card
        style={{
          backgroundColor: WHITE,
          minHeight: breadcrumbs
            ? `calc( 100vh - 168px)`
            : `calc( 100vh - 80px)`,
        }}
      >
        <div>
          <Title
            style={{
              color: PRIMARY,
              margin: '10px 0 20px 0',
            }}
            level={5}
          >
            {title}
          </Title>
          {children}
        </div>
      </Card>
    </div>
  )
}

export default PageContainer

/* eslint-disable @typescript-eslint/no-unused-vars */
import { WHITE } from '@utility/color'
import { Card } from 'antd'
import type { ReactNode } from 'react'

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
      <div className="mt-[12px] mb-[6px] px-[18px]">{breadcrumbs}</div>
      <Card
        style={{
          backgroundColor: WHITE,
          minHeight: breadcrumbs
            ? `calc( 100vh - 168px)`
            : `calc( 100vh - 80px)`,
        }}
        styles={{
          body: { padding: 18 },
        }}
      >
        <div>
          {/* <div className="mb-5 flex">
            <Title
              style={{
                color: PRIMARY,
                fontSize: 16,
                width: '100%',
              }}
            >
              {title}
            </Title>
          </div> */}
          {children}
        </div>
      </Card>
    </div>
  )
}

export default PageContainer

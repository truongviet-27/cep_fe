/* eslint-disable @typescript-eslint/no-unused-vars */
import boldText from '@utility/bold-text'
import { PRIMARY, WHITE } from '@utility/color'
import { Card, Spin } from 'antd'
import type { ReactNode } from 'react'

const PageContainer = ({
  title,
  breadcrumbs,
  children,
  loading = false,
  extra,
}: {
  title?: string | ReactNode
  breadcrumbs?: ReactNode
  children: ReactNode
  loading?: boolean
  extra?: ReactNode
}) => {
  return (
    <div className="h-full w-full overflow-hidden">
      <div className="mt-[6px] mb-[6px] px-[18px]">{breadcrumbs}</div>
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
          {title ? (
            <div className="mb-3 flex items-center justify-between">
              {boldText(title, PRIMARY, 18)}
              {extra}
            </div>
          ) : null}
          <Spin
            style={{
              height: '70vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            spinning={loading}
            size="default"
          >
            {children}
          </Spin>
        </div>
      </Card>
    </div>
  )
}

export default PageContainer

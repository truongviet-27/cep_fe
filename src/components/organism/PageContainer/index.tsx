import { WHITE } from '@utility/color'
import { Card } from 'antd'
import type { ReactNode } from 'react'

const PageContainer = ({
  title,
  children,
}: {
  title?: ReactNode
  children: ReactNode
}) => {
  return (
    <div className="h-full w-full overflow-hidden">
      <div className="mt-[4px] mb-[12px] px-[24px]">{title}</div>
      <Card
        style={{
          backgroundColor: WHITE,
          minHeight: title ? `calc( 100vh - 168px)` : `calc( 100vh - 80px)`,
        }}
      >
        <div>{children}</div>
      </Card>
    </div>
  )
}

export default PageContainer

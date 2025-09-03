import Tabs1 from '@app/container/system-config/email-template/tabs/content/tabs1'
import Tabs2 from '@app/container/system-config/email-template/tabs/content/tabs2'
import type { FormProps } from 'antd'
import { Tabs } from 'antd'
import { useMemo } from 'react'

function TabsEmailTemplate({
  formProps,
  isEdit,
}: {
  formProps: FormProps
  isEdit: boolean
}) {
  const items = useMemo(() => {
    return [
      {
        key: '1',
        label: '見積書送付メール',
        children: <Tabs1 formProps={formProps} isEdit={isEdit} />,
      },
      {
        key: '2',
        label: '見積書パスワード送付メール',
        children: <Tabs2 formProps={formProps} isEdit={isEdit} />,
      },
    ]
  }, [isEdit])

  return (
    <Tabs
      items={items}
      onChange={(value) => {
        console.log(+value, 'xxxxxxxxx')
      }}
    />
  )
}

export default TabsEmailTemplate

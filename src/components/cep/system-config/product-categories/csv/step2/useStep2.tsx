import { Form } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

function useStep2() {
  const t = useTranslations()
  const form = Form.useFormInstance()

  const columns = useMemo(() => {
    return [
      // {
      //   title: '行目',
      //   dataIndex: 'lineNumber',
      //   key: 'name',
      // },
      // {
      //   title: '部門コード',
      //   dataIndex: 'departmentCode',
      //   key: 'departmentCode',
      // },
      // {
      //   title: '部門名（支社/部/課）',
      //   dataIndex: 'departmentName',
      //   key: 'departmentName',
      // },
    ] as ColumnsType
  }, [t])

  const dataSource = [{}]
  return [{ form, columns, dataSource }, { t }] as const
}

export default useStep2

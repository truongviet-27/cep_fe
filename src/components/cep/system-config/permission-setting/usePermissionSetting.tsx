import { useApiUrl, useCreate, useCustom } from '@refinedev/core'
import { useForm } from '@refinedev/react-hook-form'
import { PRIMARY } from '@utility/color'
import { Checkbox, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Title from 'antd/lib/typography/Title'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

type Permission = {
  id: number
  name: string
  display_name: string
  description: string
  assigned_roles: string[]
}
function usePermissionSetting() {
  const t = useTranslations()
  const methods = useForm({})
  const [loading, setLoading] = useState(false)

  const apiUrl = useApiUrl()

  const [checkedValues, setCheckedValues] = useState<
    Record<number, { employee: boolean; manager: boolean }>
  >({})

  const { mutate, isPending } = useCreate({
    resource: 'roles/permissions',
  })

  const { data, isLoading: isLoadingPermission } = useCustom({
    url: `${apiUrl}/roles/permissions`,
    method: 'get',
  })

  useEffect(() => {
    if (data) {
      setCheckedValues(
        data?.data.permissions.reduce(
          (
            acc: Record<number, { employee: boolean; manager: boolean }>,
            item: Permission,
          ) => {
            acc[item.id] = {
              employee: item.assigned_roles.includes('employee'),
              manager: item.assigned_roles.includes('manager'),
            }
            return acc
          },
          {} as Record<number, { employee: boolean; manager: boolean }>,
        ),
      )
    }
  }, [data])

  const handleChange = (
    key: number,
    column: 'employee' | 'manager',
    checked: boolean,
  ) => {
    setCheckedValues((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [column]: checked,
      },
    }))
  }

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('system_config.system_config')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('system_config.permission_settings')}</Title>,
    },
  ]

  const handleCancel = () => {
    message.info(t('system_config.cancelMessage'))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const assignments: { role: string; permissions: number[] }[] = [
        {
          role: 'employee',
          permissions: [],
        },
        {
          role: 'manager',
          permissions: [],
        },
      ]
      for (const [key, value] of Object.entries(checkedValues)) {
        if (value.employee) {
          assignments[0].permissions.push(Number(key))
        }
        if (value.manager) {
          assignments[1].permissions.push(Number(key))
        }
      }
      mutate({
        values: {
          assignments: assignments,
        },
      })
      //   message.success(t('system_config.saveSuccessMessage'))
    } catch (error) {
      message.error(t('system_config.saveErrorMessage'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType = [
    {
      // title: t('system_config.settingItem'),
      title: '権限',
      dataIndex: 'settingItem',
      key: 'settingItem',
      width: 300,
      align: 'center',
    },
    {
      // title: t('system_config.employeess'),
      title: '管理者',
      dataIndex: 'employee',
      key: 'employee',
      width: 200,
      align: 'center',
      render: (_, record) => {
        return (
          <Checkbox
            checked={checkedValues[record.key]?.employee || false}
            onChange={(e) =>
              handleChange(record.key, 'employee', e.target.checked)
            }
          />
        )
      },
    },
    {
      title: t('system_config.manager'),
      dataIndex: 'manager',
      key: 'manager',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={checkedValues[record.key]?.manager || false}
          onChange={(e) =>
            handleChange(record.key, 'manager', e.target.checked)
          }
        />
      ),
    },
    {
      title: t('system_config.purpose'),
      dataIndex: 'purpose',
      key: 'purpose',
      align: 'center',
      render: (text) => (
        <div className="text-sm whitespace-pre-line text-gray-600">{text}</div>
      ),
    },
  ]

  const dataSource = [
    {
      key: 1,
      settingItem: '取引先マスタ',
      purpose: '取引先をマスタ化して名寄せします。',
    },
    {
      key: 2,
      settingItem: '案件マスタ',
      purpose: '案件をマスタ化して名寄せします。',
    },
    {
      key: 3,
      settingItem: '商品マスタ',
      purpose: 'マスタをマスタ化して名寄せします。',
    },
    {
      key: 4,
      settingItem: '見積テンプレートマスタ',
      purpose: '見積書のテンプレートを管理して効率化します。',
    },
    {
      key: 5,
      settingItem: '見積フォーム設定',
      purpose: '見積入力フォームの項目をカスタマイズします。',
    },
    {
      key: 6,
      settingItem: '見積書送付メールテンプレート',
      purpose: '見積書送付時のメールテンプレートを管理します。',
    },
    {
      key: 7,
      settingItem: 'コード採番設定',
      purpose: '見積番号の自動採番ルールを設定します。',
    },
    {
      key: 8,
      settingItem: '承認・差戻し',
      purpose:
        '送信前に見積承認を利用します。\n承認時に差戻し処理を利用します。',
    },
    {
      key: 9,
      settingItem: '原価明細',
      purpose: '承認・粗利確認のため原価見積を利用します。',
    },
  ]

  console.log(dataSource, 'dataSource')
  return [
    {
      methods,
      breadcrumbItems,
      columns,
      dataSource,
      loading,
      isPending,
      isLoadingPermission,
    },
    { t, handleCancel, handleSave },
  ] as const
}

export default usePermissionSetting

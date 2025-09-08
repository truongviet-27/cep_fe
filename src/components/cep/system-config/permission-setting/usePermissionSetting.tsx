import { useApiUrl, useCreate, useCustom, useTranslate } from '@refinedev/core'
import { useForm } from '@refinedev/react-hook-form'
import { PRIMARY } from '@utility/color'
import { Checkbox, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Title from 'antd/lib/typography/Title'
import { useEffect, useState } from 'react'

type Permission = {
  id: number
  name: string
  display_name: string
  description: string
  assigned_roles: string[]
}
function usePermissionSetting() {
  const t = useTranslate()
  const methods = useForm({})
  const [loading, setLoading] = useState(false)

  const apiUrl = useApiUrl()

  const [checkedValues, setCheckedValues] = useState<
    Record<number, { employee: boolean; manager: boolean }>
  >({})

  const { mutate, isPending } = useCreate({
    resource: 'roles/permissions',
  })

  const {
    data,
    isLoading: isLoadingPermission,
    refetch,
  } = useCustom({
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
      mutate(
        {
          values: {
            assignments: assignments,
          },
        },
        {
          onSuccess: () => {
            refetch()
          },
        },
      )
    } catch (error) {
      message.error(t('system_config.saveErrorMessage'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType = [
    {
      title: t('permission_settings.table.settingItem'),
      dataIndex: 'settingItem',
      key: 'settingItem',
      width: 300,
      align: 'center',
    },
    {
      title: t('permission_settings.table.employee'),
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
      settingItem: t('permission_settings.dataSource.customerMaster'),
      purpose: t('permission_settings.dataSource.customerMasterPurpose'),
    },
    {
      key: 2,
      settingItem: t('permission_settings.dataSource.projectMaster'),
      purpose: t('permission_settings.dataSource.projectMasterPurpose'),
    },
    {
      key: 3,
      settingItem: t('permission_settings.dataSource.productMaster'),
      purpose: t('permission_settings.dataSource.productMasterPurpose'),
    },
    {
      key: 4,
      settingItem: t('permission_settings.dataSource.quoteTemplateMaster'),
      purpose: t('permission_settings.dataSource.quoteTemplateMasterPurpose'),
    },
    {
      key: 5,
      settingItem: t('permission_settings.dataSource.quoteFormSettings'),
      purpose: t('permission_settings.dataSource.quoteFormSettingsPurpose'),
    },
    {
      key: 6,
      settingItem: t('permission_settings.dataSource.quoteEmailTemplate'),
      purpose: t('permission_settings.dataSource.quoteEmailTemplatePurpose'),
    },
    {
      key: 7,
      settingItem: t('permission_settings.dataSource.codeNumbering'),
      purpose: t('permission_settings.dataSource.codeNumberingPurpose'),
    },
    {
      key: 8,
      settingItem: t('permission_settings.dataSource.approvalAndReturn'),
      purpose: t('permission_settings.dataSource.approvalAndReturnPurpose'),
    },
    {
      key: 9,
      settingItem: t('permission_settings.dataSource.costDetails'),
      purpose: t('permission_settings.dataSource.costDetailsPurpose'),
    },
  ]

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

type unionSetting = 'manage' | 'notManage' | 'use' | 'notUse'

export interface SettingItem {
  key: string
  settingItem: string
  initialSetting: unionSetting
  purpose: string
  currentValue: unionSetting
}

export interface HeaderProps {
  currentUser?: string
  selectedMenuKey?: string
}

export interface ParameterSettingsTableProps {
  settings: SettingItem[]
  onSettingChange: (key: string, value: unionSetting) => void
}

export interface ActionButtonsProps {
  onCancel: () => void
  onSave: () => void
  cancelText: string
  saveText: string
  loading?: boolean
}

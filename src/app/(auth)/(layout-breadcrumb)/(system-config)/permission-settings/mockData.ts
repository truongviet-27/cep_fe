import type { SettingItem } from '@interfaces/config'

export const defaultSettingsData: SettingItem[] = [
  {
    key: '1',
    settingItem: '取引先マスタ',
    initialSetting: 'notManage',
    purpose: '取引先をマスタ化して名寄せします。',
    currentValue: 'notManage',
  },
  {
    key: '2',
    settingItem: '案件マスタ',
    initialSetting: 'notManage',
    purpose: '案件をマスタ化して名寄せします。',
    currentValue: 'notManage',
  },
  {
    key: '3',
    settingItem: '商品マスタ',
    initialSetting: 'notManage',
    purpose: 'マスタをマスタ化して名寄せします。',
    currentValue: 'notManage',
  },
  {
    key: '4',
    settingItem: '見積テンプレートマスタ',
    initialSetting: 'notManage',
    purpose: '見積書のテンプレートを管理して効率化します。',
    currentValue: 'notManage',
  },
  {
    key: '5',
    settingItem: '見積フォーム設定',
    initialSetting: 'notUse',
    purpose: '見積入力フォームの項目をカスタマイズします。',
    currentValue: 'notUse',
  },
  {
    key: '6',
    settingItem: '見積書送付メールテンプレート',
    initialSetting: 'notUse',
    purpose: '見積書送付時のメールテンプレートを管理します。',
    currentValue: 'notUse',
  },
  {
    key: '7',
    settingItem: 'コード採番設定',
    initialSetting: 'notUse',
    purpose: '見積番号の自動採番ルールを設定します。',
    currentValue: 'notUse',
  },
  {
    key: '8',
    settingItem: '承認・差戻し',
    initialSetting: 'notUse',
    purpose: '送信前に見積承認を利用します。\n承認時に差戻し処理を利用します。',
    currentValue: 'notUse',
  },
  {
    key: '9',
    settingItem: '原価明細',
    initialSetting: 'notUse',
    purpose: '承認・粗利確認のため原価見積を利用します。',
    currentValue: 'notUse',
  },
]

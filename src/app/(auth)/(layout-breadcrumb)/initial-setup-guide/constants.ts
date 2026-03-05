export const MENU_ITEMS = [
  {
    id: 'basic',
    title: '初期設定',
    subtitle: 'システムの基本設定',
    progress: 30,
    count: '1/9',
    type: 'dashed' as const,
    breadcrumbLabel: '初期設定',
  },
  {
    id: 'advanced',
    title: '高度な設定',
    subtitle: '詳細な機能設定',
    progress: 33,
    count: '1/3',
    type: 'solid' as const,
    breadcrumbLabel: '高度な設定',
  },
  {
    id: 'test-individual',
    title: 'テスト運用（個別）',
    subtitle: 'システム動作の手順',
    type: 'solid' as const,
    breadcrumbLabel: 'テスト運用（個別）',
  },
  {
    id: 'test-continuous',
    title: 'テスト運用（継続）',
    subtitle: 'システム動作の手順',
    type: 'solid' as const,
    breadcrumbLabel: 'テスト運用（継続）',
  },
] as const

export type MenuItem = (typeof MENU_ITEMS)[number]

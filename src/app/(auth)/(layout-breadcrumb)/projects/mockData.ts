interface IProject {
  key: string
  projectCode: string
  projectName: string
  customer: string
  registrant: string
  lastUpdated: string
}

export const mockData: IProject[] = [
  {
    key: '1',
    projectCode: 'PROJ001',
    projectName: '基幹システム更新プロジェクト',
    customer: '株式会社サンプル商事',
    registrant: '山田',
    lastUpdated: '2025/05/15',
  },
  {
    key: '2',
    projectCode: 'PROJ002',
    projectName: 'Webサイトリニューアル',
    customer: 'テスト株式会社',
    registrant: '山田',
    lastUpdated: '2025/05/15',
  },
  {
    key: '3',
    projectCode: 'PROJ003',
    projectName: '業務システム導入支援',
    customer: '株式会社デモ企業',
    registrant: '山田',
    lastUpdated: '2025/05/15',
  },
]

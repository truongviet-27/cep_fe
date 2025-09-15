interface ICustomer {
  id: string
  code: string
  name: string
  country: string
  department: string
  unit_price_rank: string
  credit_rank: string
  anti_social_check_date: string
  registration_date: string
  suspension_date: string | null
}

interface ICorporateResearch {
  key: string
  document_name: string
  judgement: string
  files: { name: string; url: string }[]
  updated_by: string
  last_updated: string
}

interface ICustomerDetail {
  id: string
  code: string
  name: string
  name_kana: string
  country: string
  corporate_number: string
  unit_price_rank: { rank: string; date: string }
  credit_rank: { rank: string; date: string }
  anti_social_rank: { rank: string; date: string }
  postal_code: string
  address: string
  building_name: string
  phone: string
  fax: string
  email: string
  listing_status: string
  industry: string
  establishment_date: string
  departments: string[]
  accounting_contact: {
    name: string
    department: string
    email: string
    phone: string
  }
  corporate_research: ICorporateResearch[]
  created_by: { name: string; date: string }
  updated_by: { name: string | null; date: string | null }
}

export const mockCustomers: ICustomer[] = [
  {
    id: '1',
    code: 'CUST001',
    name: '株式会社サンプル商事',
    country: '日本',
    department: '購買部',
    unit_price_rank: 'A',
    credit_rank: 'A',
    anti_social_check_date: '2025/05/15',
    registration_date: '2025/05/15',
    suspension_date: null,
  },
  {
    id: '2',
    code: 'CUST003',
    name: '株式会社デモ企業',
    country: 'ベトナム',
    department: '購買部',
    unit_price_rank: 'Premium',
    credit_rank: 'A',
    anti_social_check_date: '2025/05/15',
    registration_date: '2025/05/15',
    suspension_date: null,
  },
  {
    id: '3',
    code: 'CUST002',
    name: 'テスト株式会社',
    country: 'アメリカ',
    department: '購買部',
    unit_price_rank: 'B',
    credit_rank: 'B',
    anti_social_check_date: '2024/05/15',
    registration_date: '2025/08/15',
    suspension_date: '2025/08/15',
  },
]

export const mockCustomerDetail: ICustomerDetail = {
  id: '1',
  code: 'CUST001',
  name: '株式会社サンプル商事',
  name_kana: 'カブシキガイシャサンプルショウジ',
  country: '日本',
  corporate_number: '0101356274984',
  unit_price_rank: { rank: 'A', date: '2025/05/15' },
  credit_rank: { rank: 'A', date: '2025/05/15' },
  anti_social_rank: { rank: 'C', date: '2025/05/15' },
  postal_code: '1000001',
  address: '東京都千代田区丸の内3-1-1',
  building_name: '丸の内ビル5F',
  phone: '0312345678',
  fax: '0312345679',
  email: 'info@sample.co.jp',
  listing_status: 'プライム',
  industry: '商社',
  establishment_date: '2000/08/15',
  departments: ['京都部', '本社'],
  accounting_contact: {
    name: '田中 太郎',
    department: '経理部',
    email: 'info@sample.co.jp',
    phone: '0312345680',
  },
  corporate_research: [
    {
      key: '1',
      document_name: '与信ランク',
      judgement: 'A',
      files: [{ name: '与信情報.pdf', url: '#' }],
      updated_by: '山田',
      last_updated: '2025/05/15',
    },
    {
      key: '2',
      document_name: '反社チェック',
      judgement: 'O',
      files: [
        { name: '反社チェック1.pdf', url: '#' },
        { name: '反社チェック2.pdf', url: '#' },
      ],
      updated_by: '山田',
      last_updated: '2025/05/15',
    },
    {
      key: '3',
      document_name: '登記簿謄本',
      judgement: 'O',
      files: [{ name: '登記簿謄本.pdf', url: '#' }],
      updated_by: '山田',
      last_updated: '2025/05/15',
    },
  ],
  created_by: { name: '伊藤太郎', date: '2025/05/15 14:11' },
  updated_by: { name: null, date: null },
}

import { useForm } from '@refinedev/antd'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

function useEmailTemplate() {
  const t = useTranslations()
  const methods = useForm({
    defaultFormValues: {
      title1: '123555',
      content1: '555555555',
      signature1: `─ Commerce Robotics Inc 株式会社コマースロボティクス─
Sales Team mail: info@commerce-robotics.com
【東京本社】 〒105-0021 東京都港区東新橋2-11-4 マキヤ汐留プラザ 5F
TEL: 03-4431-1337`,
      note1: `タグは必ず[[]]で囲って入力してください。
・署名は自動的に追加されるため、テンプレート内に記載する必要はありません。
・変更したテンプレートは「更新」ボタンを押すまで保存されません。
・テンプレートは見積書送付時に自動的に適用されます。
・入力欄上部のボタンをクリックすると、テンプレート内の任意の位置にタグを埋め込むことができます。埋め込まれたタグは、メール送信実行時に登録して表示されます。
（例）[[取引先会社名]] → ○○商事株式会社`,

      title2: '2',
      content2: '2',
      signature2: `─ Commerce Robotics Inc 株式会社コマースロボティクス─
Sales Team mail: info@commerce-robotics.com
【東京本社】 〒105-0021 東京都港区東新橋2-11-4 マキヤ汐留プラザ 5F
TEL: 03-4431-1337`,
      note2: `タグは必ず[[]]で囲って入力してください。
・署名は自動的に追加されるため、テンプレート内に記載する必要はありません。
・変更したテンプレートは「更新」ボタンを押すまで保存されません。
・テンプレートは見積書送付時に自動的に適用されます。
・入力欄上部のボタンをクリックすると、テンプレート内の任意の位置にタグを埋め込むことができます。埋め込まれたタグは、メール送信実行時に登録して表示されます。
（例）[[取引先会社名]] → ○○商事株式会社`,
    },
  })

  const [isEdit, setIsEdit] = useState<boolean>(false)

  return [
    { methods, isEdit },
    { t, setIsEdit },
  ] as const
}

export default useEmailTemplate

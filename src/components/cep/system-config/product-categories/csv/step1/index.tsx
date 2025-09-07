import { DownloadOutlined, FileAddOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'

function Step1() {
  return (
    <div className="space-y-6">
      <div className="rounded border border-[#FFD591] bg-[#E6F7FF] p-4">
        <div className="flex items-start gap-2">
          <div>
            <p className="font-medium text-[#FA8C16]">📋 CSVテンプレート</p>
            <p className="text-sm text-[#666]">
              正しい形式でデータを登録するため、まずCSVテンプレートをダウンロードしてください。
            </p>
            <p className="text-sm text-[#666]">
              テンプレートに必要事項を入力してからアップロードすることで、エラーを防ぐことができます。
            </p>
            <a
              href="#"
              className="mt-2 inline-block text-[#1890FF] hover:underline"
            >
              <DownloadOutlined className="mr-1" />
              CSVテンプレートをダウンロード
            </a>
          </div>
        </div>
      </div>

      <div className="rounded border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center">
        <FileAddOutlined className="mb-3 text-4xl text-gray-400" />
        <p className="mb-2 text-gray-600">
          CSVファイルをここにドラッグ＆ドロップ
        </p>
        <p className="mb-4 text-sm text-gray-400">
          または、下のボタンからファイルを選択してください
        </p>
        <Button
          type="primary"
          style={{
            padding: '20px 20px',
          }}
        >
          ファイルを選択
        </Button>
      </div>

      <div className="rounded border bg-gray-50 p-4 text-sm text-gray-600">
        <p className="font-medium">CSV登録時の注意事項</p>
        <ul className="list-disc pl-5">
          <li>CSVファイルの1行目がヘッダー行として扱われます。</li>
          <li>文字コードはUTF-8またはShift-JISで保存してください。</li>
          <li>同じ項目コードが複数ある場合、上書きされます。</li>
          <li>必須項目が不足する場合は取り込み不可です。</li>
          <li>空白行があってもスキップされます。</li>
        </ul>
      </div>

      <div className="flex justify-end gap-2">
        <Button>戻る</Button>
        <Button type="primary">次へ</Button>
      </div>
    </div>
  )
}

export default Step1

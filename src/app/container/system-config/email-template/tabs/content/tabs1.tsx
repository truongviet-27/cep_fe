import type { FormProps } from 'antd'
import { Divider, Form, Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'

function Tabs1({
  formProps,
  isEdit,
}: {
  formProps: FormProps
  isEdit: boolean
}) {
  console.log(isEdit, 'isEdit')
  return isEdit ? (
    <Form layout="vertical" {...formProps}>
      <Form.Item
        layout="vertical"
        label="件名"
        name="title1"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        layout="vertical"
        label="本文"
        name="content1"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <TextArea rows={8} />
      </Form.Item>

      <Divider />

      <Form.Item layout="vertical" label="署名（自動挿入）" name="signature1">
        <TextArea rows={4} disabled />
      </Form.Item>
      <Form.Item
        layout="vertical"
        label="テンプレート編集時の注意事項"
        name="note1"
      >
        <TextArea rows={8} disabled />
      </Form.Item>
    </Form>
  ) : (
    <div>123</div>
  )
}

export default Tabs1

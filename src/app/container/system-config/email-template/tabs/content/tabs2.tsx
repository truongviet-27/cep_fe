import type { FormProps } from 'antd'
import { Button, Divider, Form, Input, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea'

function Tabs2({
  formProps,
  isEdit,
  tags,
}: {
  formProps: FormProps
  isEdit: boolean
  tags: string[]
}) {
  return isEdit ? (
    <Form layout="vertical" {...formProps}>
      <Form.Item
        layout="vertical"
        label="件名"
        name="title_2"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>本文</span>
            <Space>
              {tags.map((tag) => (
                <Button
                  key={tag}
                  size="small"
                  style={{
                    border: '1px solid #91D5FF',
                    backgroundColor: '#E6F7FF',
                    color: '#1890FF',
                  }}
                  onClick={() => {}}
                >
                  {tag}
                </Button>
              ))}
            </Space>
          </div>
        }
        labelCol={{ span: 24 }}
        name="content_2"
        rules={[{ required: true }]}
      >
        <TextArea rows={8} />
      </Form.Item>

      <Divider />

      <Form.Item layout="vertical" label="署名（自動挿入）" name="signature_2">
        <TextArea rows={4} />
      </Form.Item>
    </Form>
  ) : (
    <div>123</div>
  )
}

export default Tabs2

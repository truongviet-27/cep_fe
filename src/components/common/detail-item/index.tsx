import { Col, Row, Typography } from 'antd'
import React from 'react'

const { Text } = Typography

export const DetailItem: React.FC<{
  label: string
  children: React.ReactNode
}> = ({ label, children }) => (
  <Row align="middle" gutter={[16, 16]}>
    <Col xs={24} md={6}>
      <Text strong>{label}</Text>
    </Col>
    <Col xs={24} md={18}>
      {children}
    </Col>
  </Row>
)

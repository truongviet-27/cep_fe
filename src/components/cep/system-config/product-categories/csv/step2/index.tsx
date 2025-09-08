import useStep2 from '@components/cep/system-config/product-categories/csv/step2/useStep2'
import CommonTable from '@components/common/table'
import React from 'react'

function Step2() {
  const [{ form, columns, dataSource }, {}] = useStep2()
  const {} = form
  return <CommonTable columns={columns} dataSource={dataSource} />
}

export default Step2

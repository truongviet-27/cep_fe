import useStep3 from '@components/cep/system-config/product-categories/csv/step3/useStep3'
import CommonTable from '@components/common/table'
import React from 'react'

function Step3() {
  const [{ form, columns, dataSource }, {}] = useStep3()
  const {} = form
  return <CommonTable columns={columns} dataSource={dataSource} />
}

export default Step3

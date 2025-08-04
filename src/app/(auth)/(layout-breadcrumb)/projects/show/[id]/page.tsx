'use client'
//
// import { Stack, Typography } from '@mui/material'
// import { useShow } from '@refinedev/core'
// import { Show, TextFieldComponent as TextField } from '@refinedev/antd'
//
// export default function CategoryShow() {
//   const { query } = useShow({})
//   const { data, isLoading } = query
//
//   const record = data?.data
//
//   return (
//     <Show isLoading={isLoading}>
//       <Stack gap={1}>
//         <Typography variant="body1" fontWeight="bold">
//           {'ID'}
//         </Typography>
//         <TextField value={record?.id} />
//         <Typography variant="body1" fontWeight="bold">
//           {'Title'}
//         </Typography>
//         <TextField value={record?.title} />
//       </Stack>
//     </Show>
//   )
// }

import { AntdInferencer } from '@refinedev/inferencer/antd'

export default function Page() {
  return <AntdInferencer />
}

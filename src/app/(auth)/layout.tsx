import './auth.css'

import AuthContainer from '@components/layout/container'
import { Navbar } from '@components/layout/navbar'
import { ThemedLayoutV2 } from '@refinedev/antd'

export default function AuthLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <ThemedLayoutV2 Sider={Navbar}>
      <AuthContainer>{children}</AuthContainer>
    </ThemedLayoutV2>
  )
}

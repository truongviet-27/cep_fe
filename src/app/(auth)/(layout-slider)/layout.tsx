import { ThemedLayoutV2 } from '@refinedev/antd'

import AuthContainer from '@/components/layout/container'
import AuthHeader from '@/components/layout/header'
import { Navbar } from '@/components/layout/navbar'

export default function AuthLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <ThemedLayoutV2 Header={AuthHeader} Sider={Navbar}>
      <AuthContainer>{children}</AuthContainer>
    </ThemedLayoutV2>
  )
}

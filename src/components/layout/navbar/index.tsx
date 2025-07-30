'use client'

import { Sider } from '@refinedev/antd'
import React from 'react'

export const Navbar: React.FC = () => {
  // const [initialSiderCollapsed, setInitialSiderCollapsed] = useState(false)

  // const { menuItems, selectedKey, defaultOpenKeys } = useMenu()
  //
  // const { mutate: logout } = useLogout()

  return (
    <Sider
      render={({ items, logout }) => {
        return (
          <>
            {items}
            {logout}
          </>
        )
      }}
    />
  )
  // return (
  //   <ThemedLayoutV2
  //     initialSiderCollapsed={initialSiderCollapsed}
  //     onSiderCollapsed={(collapsed) => setInitialSiderCollapsed(collapsed)}
  //     Header={AuthHeader}
  //     Title={({ collapsed }) => (
  //       <ThemedTitleV2 collapsed={collapsed} text={<AppIcon level={2} />} />
  //     )}
  //   >
  //     {/*<Menu*/}
  //     {/*  theme="dark"*/}
  //     {/*  mode="inline"*/}
  //     {/*  selectedKeys={[selectedKey]}*/}
  //     {/*  defaultOpenKeys={defaultOpenKeys}*/}
  //     {/*  style={{ background: 'transparent', border: 'none' }}*/}
  //     {/*>*/}
  //     {/*  {menuItems.map(({ key, label, meta, route }) => (*/}
  //     {/*    <Menu.Item key={key} icon={meta?.icon}>*/}
  //     {/*      <Link href={route ?? ''}>{label}</Link>*/}
  //     {/*    </Menu.Item>*/}
  //     {/*  ))}*/}
  //
  //     {/*  <Menu.Divider style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />*/}
  //
  //     {/*  <Menu.Item key="/settings" icon={<SettingOutlined />}>*/}
  //     {/*    <Link href="/settings">Settings</Link>*/}
  //     {/*  </Menu.Item>*/}
  //
  //     {/*  <Menu.Item*/}
  //     {/*    key="/logout"*/}
  //     {/*    icon={<LogoutOutlined />}*/}
  //     {/*    onClick={() => logout()}*/}
  //     {/*  >*/}
  //     {/*    Logout*/}
  //     {/*  </Menu.Item>*/}
  //     {/*</Menu>*/}
  //   </ThemedLayoutV2>
}

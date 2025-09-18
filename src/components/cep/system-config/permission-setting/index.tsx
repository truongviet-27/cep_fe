import { RightOutlined } from '@ant-design/icons'
import usePermissionSetting from '@components/cep/system-config/permission-setting/usePermissionSetting'
import AutoHeading from '@components/common/auto-heading'
import PageContainer from '@components/common/page-container'
import CommonTable from '@components/common/table'
import { Breadcrumb, Button } from 'antd'

function PermissionSetting() {
  const [
    { breadcrumbItems, columns, dataSource, isPending, isLoadingPermission },
    { t, handleCancel, handleSave },
  ] = usePermissionSetting()
  return (
    <PageContainer
      title={
        <Breadcrumb items={breadcrumbItems} separator={<RightOutlined />} />
      }
    >
      <AutoHeading i18n={'system_config.permission_settings'} />
      <CommonTable
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        size="middle"
        className="mt-6"
        loading={isLoadingPermission}
      />
      <div className="mt-4 flex justify-end gap-4">
        <Button type="default" onClick={handleCancel}>
          {t('permission_settings.buttons.cancel')}
        </Button>
        <Button type="primary" onClick={handleSave} loading={isPending}>
          {t('permission_settings.buttons.save')}
        </Button>
      </div>
    </PageContainer>
  )
}

export default PermissionSetting

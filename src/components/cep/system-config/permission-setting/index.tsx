import { RightOutlined } from '@ant-design/icons'
import usePermissionSetting from '@components/cep/system-config/permission-setting/usePermissionSetting'
import ActionButtons from '@components/common/action-button'
import AutoHeading from '@components/common/auto-heading'
import CommonTable from '@components/common/table'
import PageContainer from '@components/organism/PageContainer'
import { Breadcrumb } from 'antd'

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
      <div className="mt-4">
        <ActionButtons
          onCancel={handleCancel}
          onSave={handleSave}
          loading={isPending}
          cancelText={t('permission_settings.buttons.cancel')}
          saveText={t('permission_settings.buttons.save')}
        />
      </div>
    </PageContainer>
  )
}

export default PermissionSetting

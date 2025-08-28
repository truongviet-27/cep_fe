import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useTranslate } from '@refinedev/core'
import { Button } from 'antd'

type ActionType = 'edit' | 'delete' | 'add'

interface CommonButtonProps {
  type: ActionType
  hideText?: boolean
  onClick?: () => void
  disabled?: boolean
  style?: React.CSSProperties
}

export const CommonButton: React.FC<CommonButtonProps> = ({
  type,
  onClick,
  disabled,
  style,
  hideText,
}) => {
  const t = useTranslate()

  const config = {
    edit: {
      label: t('buttons.edit'),
      type: 'default' as const,
      danger: false,
      icon: <EditOutlined />,
      style: {
        color: '#1677ff',
        borderColor: '#1677ff',
        backgroundColor: '#fff',
      },
    },
    delete: {
      label: t('buttons.delete'),
      type: 'default' as const,
      danger: true,
      icon: <DeleteOutlined />,
    },
    add: {
      label: t('buttons.add'),
      type: 'primary' as const,
      danger: false,
      icon: <PlusOutlined />,
    },
  }

  const { label, type: btnType, danger, icon } = config[type]

  return (
    <Button
      type={btnType}
      danger={danger}
      onClick={onClick}
      disabled={disabled}
      style={style}
      icon={icon}
    >
      {!hideText && label}
    </Button>
  )
}

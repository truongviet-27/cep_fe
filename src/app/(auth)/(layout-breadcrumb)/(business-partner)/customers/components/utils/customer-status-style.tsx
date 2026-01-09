export type AgreedPriceStatusInfo = {
  background: string
  color: string
  text: string
}

export function CustomerStatusStyle(
  status: string,
  t: (key: string) => string,
): AgreedPriceStatusInfo {
  switch (status) {
    case 'new':
      return {
        background: '#E6FFFB',
        color: '#08979c',
        text: t('customers.status.new'),
      }

    case 'prospecting':
      return {
        background: '#E6F7FF',
        color: '#1890ff',
        text: t('customers.status.prospecting'),
      }

    case 'contracted':
      return {
        background: '#F6FFED',
        color: '#52c41a',
        text: t('customers.status.contracted'),
      }

    case 'lost':
      return {
        background: '#FFF1F0',
        color: '#ff4d4f',
        text: t('customers.status.lost'),
      }

    case 'suspended':
      return {
        background: '#F5F5F5',
        color: '#8c8c8c',
        text: t('customers.status.suspended'),
      }

    default:
      return {
        background: '#FFFFFF',
        color: '#000000',
        text: '',
      }
  }
}

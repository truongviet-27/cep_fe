import { AgreedPriceStatus } from '@components/cep/estimates/agreed-price/enum'

export type AgreedPriceStatusInfo = {
  background: string
  color: string
  text: string
}

export function getAgreedPriceStatusStyle(
  status: AgreedPriceStatus,
  t: (key: string) => string,
): AgreedPriceStatusInfo {
  switch (status) {
    case AgreedPriceStatus.Active:
      return {
        background: '#E6F7FF',
        color: '#1890ff',
        text: t('agreed_prices.summary.active'),
      }

    case AgreedPriceStatus.Expired:
      return {
        background: '#FFF2F0',
        color: '#ff4d4f',
        text: t('agreed_prices.summary.expired'),
      }

    case AgreedPriceStatus.NearingExpiration:
      return {
        background: '#FFF7E6',
        color: '#fa8c16',
        text: t('agreed_prices.summary.nearing_expiration'),
      }

    default:
      return { background: '#FFFFFF', color: '#000000', text: '' }
  }
}

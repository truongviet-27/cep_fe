const useCurrency = () => {
  function convertCurrency(
    amount: number | string | null | undefined,
    showZero: boolean = true,
    showSymbol: boolean = true,
  ) {
    if (amount === null || amount === undefined)
      return showZero ? (showSymbol ? '￥0' : '0') : '-'

    const num = typeof amount === 'string' ? Number(amount) : amount
    if (isNaN(num)) return showZero ? (showSymbol ? '￥0' : '0') : '-'
    if (num === 0) return showZero ? (showSymbol ? '￥0' : '0') : '-'
    const formatted = new Intl.NumberFormat('ja-JP', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(num))

    if (!showSymbol) {
      return num < 0 ? `-${formatted}` : formatted
    }

    return num < 0 ? `￥-${formatted}` : `￥${formatted}`
  }

  return {
    convertCurrency,
  }
}
export default useCurrency

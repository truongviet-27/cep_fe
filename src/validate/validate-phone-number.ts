import isValidPhoneNumber from 'libphonenumber-js'

export const validatePhoneNumber = (value: string): boolean => {
  const phoneNumber =
    isValidPhoneNumber(value, 'US') ||
    isValidPhoneNumber(value, 'JP') ||
    isValidPhoneNumber(value, 'VN')

  return !!phoneNumber?.isValid()
}

export const phoneRefinementValid = (label?: string) => ({
  message: `有効な${label}を入力してください。`,
  check: (value: string) => validatePhoneNumber(value),
})

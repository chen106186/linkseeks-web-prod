export const languageRequiredValidate = async (_, value, isRequired: boolean, maxLength: number) => {
  if (isRequired) {
    if (!value) {
      throw '请填写'
    }
    if (Array.isArray(value)) {
      if (value.some((item) => !item.value)) {
        throw '请填写'
      }
    }
  }
  return true
}

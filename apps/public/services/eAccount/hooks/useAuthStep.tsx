import { postPayAllInPaySetRealName } from '@apps/apis'

export const useAuthStep = ({ form }) => {
  const submit = async (values) => {
    try {
      const result = await postPayAllInPaySetRealName({ ...values, identityCardType: 1 }, { ctlType: 'none' })

      if (result.code === 1000) {
        return true
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  }

  return {
    submit,
  }
}

import { postOrderEightDRectificationEnumOuters, postOrderEightDRectificationEnumInternals } from '@apps/apis'
export const getOuterStatusFilter = async () => {
  const res = await postOrderEightDRectificationEnumOuters({}, { ctlType: 'none' })
  const { code, data } = res
  if (code === 1000) {
    return data.map((item) => ({
      text: item.text,
      value: item.id,
    }))
  }
  return []
}
export const getInternalsFilter = async () => {
  const res = await postOrderEightDRectificationEnumInternals({}, { ctlType: 'none' })
  const { code, data } = res
  if (code === 1000) {
    return data.map((item) => ({
      text: item.text,
      value: item.id,
    }))
  }
  return []
}

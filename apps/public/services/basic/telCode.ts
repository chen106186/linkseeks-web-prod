import { getCommoditySelectGetTelCode } from '@apps/apis'

export const getTelCodeOptions = async () => {
  const { data } = await getCommoditySelectGetTelCode()
  if (data && data.length > 0) {
    return data.map((item) => ({
      ...item,
      label: `${item.value} ${item.label}`,
      value: item.label,
    }))
  }
  return []
}

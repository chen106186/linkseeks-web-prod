export const formatListFieldData = (values: Record<string, any>, keys: string[]) => {
  const detail = { ...values.detail }
  for (const listKey of keys) {
    const temp = detail[listKey]
    if (temp) {
      const tempList: any[] = []
      Object.keys(temp).forEach((key) => {
        const filed = key.split('-')[0]
        const index = Number(key.split('-')[2])
        if (!tempList[index]) {
          tempList[index] = {}
        }
        tempList[index][filed] = temp[key]
      })
      detail[listKey] = tempList
    }
  }
  return {
    ...values,
    detail,
  }
}

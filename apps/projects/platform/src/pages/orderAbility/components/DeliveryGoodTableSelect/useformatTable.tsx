export function formatTable(selectedRowKeys: Map<string, any>) {
  console.log(selectedRowKeys)

  let result = []
  for (const v of selectedRowKeys) {
    result.push(...v[1])
  }
  console.log(result)

  let targetValue = Array.from(new Set(result))

  return targetValue
}

export function formMapData(selectedRowKeys, currentTable: any[]) {
  let result = new Map<string, any>()
  let orderNos = currentTable.map((v) => v.orderNo)
  for (const v of selectedRowKeys) {
    let tpm = []
    for (const t of v[1]) {
      if (orderNos.includes(t.orderNo)) {
        tpm.push(t)
      }
    }
    result.set(v[0], tpm)
  }
  return result
}

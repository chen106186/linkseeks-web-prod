// 数组去重
export const dupliArr = (arr: any[]) => {
  return Array.from(new Set(arr))
}

// 数组通过某个key进行去重合并, 并返回一个新数组
export const mergeArrByKey = (preArr: any[], nextArr: any[], target?: string) => {
  const mergeArr = preArr.concat(nextArr)
  if (target) {
    const result: any[] = []
    mergeArr.forEach((v) => {
      const s = result.find((j) => j[target] === v[target])
      if (!s) {
        result.push(v)
      }
    })
    return result
  } else {
    return Array.from(new Set(mergeArr))
  }
}

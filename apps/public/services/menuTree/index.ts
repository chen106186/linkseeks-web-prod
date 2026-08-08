/**
 * 由于后端需要记录一个code， 所以占用了 id这个字段
 *
 * 导致真实使用 realId 这个字段， 而前端组件大部分情况下都是使用id 作为唯一标识
 *
 * 将原接口的id -> code
 *
 * realId -> id
 *
 * 故通过该方法进行转化
 */
export const splitButtonMenu = (list, hashTreeData) => {
  const makeData: any = {
    menuIdList: [],
    buttonIdList: [],
  }

  list.forEach((v) => {
    if (hashTreeData[v]) {
      const target = makeData[hashTreeData[v].isBtn ? 'buttonIdList' : 'menuIdList']
      const realId = hashTreeData[v].realId
      target.push(realId)
    } else {
      throw `错误的id -> ${v}`
    }
  })

  return makeData
}

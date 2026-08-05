import { isEmpty } from 'lodash'

export const compareIsEmpty = (value: any) => {
  if (Array.isArray(value)) {
    return value.length === 0
  } else if (typeof value === 'number') {
    // 数字类型一定不为空，这里把0也当做值
    return false
  } else {
    return isEmpty(value)
  }
}

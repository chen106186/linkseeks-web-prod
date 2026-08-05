/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-24 14:43:29
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-24 16:40:13
 * @Description: 对数组的常用操作，eg. 增、删、改，并返回操作后的数组
 */
import { useState, useReducer } from 'react'

export type HandleType<P> = {
  /**
   * 删除元素
   */
  delete: (index: number, len: number, item?: P) => void
  /**
   * 替换元素
   */
  replace: (index: number, item: P) => void
  /**
   * 插入元素
   */
  insert: (index: number, item: P) => void
  /**
   * 自定义处理数组方法
   */
  custom: (fn: (oldArr: P[]) => P[]) => void
}

function reducer(state, action) {
  const { type, index, len, item, fn } = action
  switch (type) {
    case 'delete': {
      const newArr = [...state]
      if (item) {
        newArr.splice(index, len, item)
      } else {
        newArr.splice(index, len)
      }
      return newArr
    }
    case 'replace': {
      const newArr = [...state]
      newArr.splice(index, 1, item)
      return newArr
    }
    case 'insert': {
      const newArr = [...state]
      newArr.splice(index, 0, item)
      return newArr
    }
    case 'custom': {
      let newArr = []
      if (fn) {
        newArr = fn([...state])
      }
      return newArr
    }
    default:
      throw new Error()
  }
}

const useSpliceArray = <T>(defaultArr: T[]): [Arr: T[], handle: HandleType<T>] => {
  const [arr, setArr] = useState(defaultArr || [])
  const [state, dispatch] = useReducer(reducer, defaultArr || [])

  const handleDelete = (index: number, len: number, item?: T) => {
    dispatch({
      type: 'delete',
      index,
      len,
      item,
    })
  }

  const handleReplace = (index: number, item: T) => {
    dispatch({
      type: 'replace',
      index,
      item,
    })
  }

  const handleInsert = (index: number, item: T) => {
    dispatch({
      type: 'insert',
      index,
      item,
    })
  }

  const handleCustom = (fn: (oldArr: T[]) => T[]) => {
    dispatch({
      type: 'custom',
      fn,
    })
  }

  return [
    state,
    {
      delete: handleDelete,
      replace: handleReplace,
      insert: handleInsert,
      custom: handleCustom,
    },
  ]
}

export default useSpliceArray

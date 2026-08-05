/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-11 09:44:16
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-11 10:14:07
 * @Description: 获取 DOM 节点的位置 或是 大小 hook
 */
import { useState, useCallback } from 'react'

interface RectData {
  /**
   * 元素高度
   */
  height: number
  /**
   * 元素宽度
   */
  width: number
  /**
   * 元素顶部距离视口的距离
   */
  top: number
  /**
   * 元素右侧距离视口的距离
   */
  right: number
  /**
   * 元素底部距离视口的距离
   */
  bottom: number
  /**
   * 元素左侧距离视口的距离
   */
  left: number
  /**
   * 元素距离左上角坐标 (0, 0)的 x 坐标值
   */
  x: number
  /**
   * 元素距离左上角坐标 (0, 0)的 y 坐标值
   */
  y: number
}

const useClientRect = (): [RectData, any] => {
  const [rect, setRect] = useState({
    height: 0,
    width: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    x: 0,
    y: 0,
  })
  const ref = useCallback((node) => {
    if (node !== null) {
      setRect(node.getBoundingClientRect())
    }
  }, [])
  return [rect, ref]
}

export default useClientRect

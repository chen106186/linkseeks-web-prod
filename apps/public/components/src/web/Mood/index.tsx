/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-22 17:41:45
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-09-22 18:04:44
 * @Description: 评价笑脸组件
 */
import React, { CSSProperties } from 'react'
import { SmileFilled, MehFilled, FrownFilled } from '@ant-design/icons'

interface MoodProps {
  /**
   * 类型
   */
  type: 'smile' | 'notBad' | 'sad'
  /**
   * 自定义外部样式
   */
  customStyle?: CSSProperties
}

const Mood: React.FC<MoodProps> = ({ type = 'smile', customStyle = {} }) => {
  let node: any = null

  switch (type) {
    case 'smile':
      node = (
        <>
          <SmileFilled style={{ color: '#41CC9E', ...customStyle }} />
        </>
      )
      break

    case 'notBad':
      node = (
        <>
          <MehFilled style={{ color: '#FFC400', ...customStyle }} />
        </>
      )
      break

    case 'sad':
      node = (
        <>
          <FrownFilled style={{ color: '#EF6260', ...customStyle }} />
        </>
      )
      break

    default:
      break
  }
  return node
}

Mood.defaultProps = {
  customStyle: {},
}

export default Mood

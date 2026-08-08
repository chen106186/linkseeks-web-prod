/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-12 13:51:32
 * @Description:
 */
import React from 'react'
import Mood from '@/components/Mood'
import { useIntl } from '@linkseeks/i18n'
interface SmilingFaceProps {
  value: number
}

const SmilingFace = (props) => {
  const { value, schema } = props
  const componentProps = schema?.getExtendsComponentProps() || {}
  const intl = useIntl()

  let node: any = null

  switch (value) {
    case 0:
    case 1:
    case 2: {
      node = (
        <div {...componentProps}>
          <Mood type="sad" customStyle={{ marginRight: 8 }} />
          <span>{intl.formatMessage({ id: 'components.chaping' })}</span>
        </div>
      )
      break
    }

    case 3: {
      node = (
        <div {...componentProps}>
          <Mood type="notBad" customStyle={{ marginRight: 8 }} />
          <span>{intl.formatMessage({ id: 'components.zhongping' })}</span>
        </div>
      )
      break
    }

    case 4:
    case 5: {
      node = (
        <div {...componentProps}>
          <Mood type="smile" customStyle={{ marginRight: 8 }} />
          <span>{intl.formatMessage({ id: 'components.haoping' })}</span>
        </div>
      )
      break
    }

    default:
      break
  }
  return node
}

SmilingFace.isFieldComponent = true

export default SmilingFace

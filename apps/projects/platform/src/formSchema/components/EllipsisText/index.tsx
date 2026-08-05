/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-26 10:25:56
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-26 10:47:05
 * @Description: 待省略的文本展示组件
 */
import React from 'react'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import styles from './index.less'

const EllipsisText = (props) => {
  const { value } = props
  const { ellipsis, ...rest } = props.props['x-component-props'] || {}

  return (
    <Tooltip title={ellipsis ? value : null}>
      <div className={classNames({ [styles.ellipsis]: ellipsis })} {...rest}>
        {value}
      </div>
    </Tooltip>
  )
}

EllipsisText.defaultProps = {}

EllipsisText.isFieldComponent = true

export default EllipsisText

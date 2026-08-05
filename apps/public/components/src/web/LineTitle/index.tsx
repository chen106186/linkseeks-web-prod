import React, { ReactNode } from 'react'
import mixins from 'classnames'
import './index.global.less'

export interface LineTitleProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  extra?: ReactNode
  children?: ReactNode
  className?: string
}
/**
 * 通常在卡片中有一个带有线条标识的title，例如该场景中的编辑
 * https://codesign.qq.com/app/design/b18zdZAmlWZnRKP/2bzpZv2BXkZkAaV/inspect
 *
 * 这种情况下可以使用该组件
 *
 * @param extra 可以配置右侧的额外元素
 */
const LineTitle = ({ children, className = '', extra = '', ...reset }: LineTitleProps) => {
  return (
    <div {...reset} className={mixins('cp-line-title', className)}>
      {children}
      <div className="cp-line-title-extra">{extra}</div>
    </div>
  )
}

export default LineTitle

import React, { ReactNode } from 'react'
import cx from 'classnames'
import { ITreeDataItem } from './MenuUtil'

export interface ToolItem {
  children: ReactNode
  autoHideTools?: boolean
}

const Tool = ({ children, autoHideTools }) => {
  return <div className={cx('tree-tools-fixed', autoHideTools && 'cp-tree-tools-hide')}>{children}</div>
}

export default Tool

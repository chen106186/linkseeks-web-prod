import React, { useMemo } from 'react'
import classNames from 'classnames'
import './index.less'

export type ListToolBarProps = {
  prefixCls?: string
  className?: string
  style?: React.CSSProperties
  /** action间隔 默认16 */
  gutter?: number
  /** 工具栏右侧操作区 */
  actions?: React.ReactNode[]
}

const ListToolBar: React.FC<ListToolBarProps> = (props) => {
  const { style, className, gutter = 16, actions = [] } = props

  /** 没有 key 的时候加一下 key */
  const actionDom = useMemo(() => {
    if (!Array.isArray(actions)) {
      return actions
    }
    if (actions.length < 1) {
      return null
    }
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: gutter,
        }}
      >
        {actions.map((action, index) => {
          if (!React.isValidElement(action)) {
            return <React.Fragment key={index}>{action}</React.Fragment>
          }
          return React.cloneElement(action, {
            key: index,
            ...action?.props,
          })
        })}
      </div>
    )
  }, [actions])

  return (
    <div style={style} className={classNames('standard-table-toolbar', className)}>
      {actionDom}
    </div>
  )
}

export default ListToolBar

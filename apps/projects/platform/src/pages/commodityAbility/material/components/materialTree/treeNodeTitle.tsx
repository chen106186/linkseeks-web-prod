import React from 'react'
import { Space, Tooltip } from 'antd'
import { PlusCircleOutlined, HolderOutlined } from '@ant-design/icons'
import styles from './treeNodeTitle.less'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'

interface Iprops {
  title: string
  /** 当前元素key */
  currentKey: string
  // /** 深度 */
  // depth: number,
  /** 父级key */
  parentKey: string | null
  /** 是否选中 */
  isSelected?: boolean
  actions?: {
    onAdd?: ({ parentKey }: { parentKey: string }, e) => void
    onAddChildNode?: ({ parentKey }: { parentKey: string }, e) => void
    onSort?: () => void
  }
}

const TreeNodeTitle: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { title, currentKey, actions, parentKey, isSelected } = props
  const onAdd = (e) => {
    actions.onAdd?.({ parentKey: parentKey }, e)
  }

  const onAddChildNode = (e) => {
    actions.onAddChildNode?.({ parentKey: currentKey }, e)
  }

  return (
    <div className={cx(styles['tree-node'])}>
      <span className={cx(styles['tree-node-title'], { [styles.isSelected]: isSelected })}>{title}</span>
      <div className={styles['tree-node-actions']}>
        <Space>
          <Tooltip
            title={intl.formatMessage({ id: 'material.treeNode.addSameLevelNode', defaultMessage: '新增同级节点' })}
          >
            <PlusCircleOutlined onClick={onAdd} />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'material.treeNode.addChildNode', defaultMessage: '新增子节点' })}>
            <PlusCircleOutlined onClick={onAddChildNode} />
          </Tooltip>
          {/* <Tooltip title="排序">
            <HolderOutlined />
          </Tooltip> */}
        </Space>
      </div>
    </div>
  )
}

export default TreeNodeTitle

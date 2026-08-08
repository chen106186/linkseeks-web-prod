import React, { RefObject, useRef } from 'react'
import { Button, Checkbox } from 'antd'
import { useSelections } from '@linkseeks/hooks'
import { findTreeKeys } from '@/utils'
import styles from './index.less'

export interface CheckboxTreeProps {
  title?: React.ReactNode
  checkedNodes?: any[]
  handleChange?(e?)
  handleSubmit?()
  saveLoading?: boolean
  showSave?
  disabled?: boolean
  actions?: RefObject<any>
  customKey?: string
  customName?: string
}

const CheckboxTree: React.FC<CheckboxTreeProps> = (props) => {
  const {
    title,
    checkedNodes = [],
    actions,
    handleChange,
    disabled,
    showSave,
    handleSubmit,
    saveLoading,
    customKey = 'id',
    customName = 'name',
  } = props
  const checkedKeys = findTreeKeys(checkedNodes, customKey)
  const { selected, setSelected, toggleAll, toggle, isSelected, allSelected, unSelectAll, selectAll } = useSelections(
    checkedKeys,
    [],
  )
  if (actions) {
    actions.current.selected = selected
    actions.current.setSelected = setSelected
    actions.current.getSelected = () => selected
  }
  const toggleSelectAll = () => {
    checkChange()
    if (allSelected) {
      unSelectAll()
    } else {
      selectAll()
    }
  }

  const checkChange = (e?) => {
    handleChange && handleChange(e)
  }
  return (
    <div>
      {title && (
        <div className={styles['flex-bet']}>
          <div>{props.title}</div>
          <div>
            <div>
              {!disabled && (
                <Button onClick={toggleSelectAll} type="link">
                  {allSelected ? '取消全选' : '全选'}
                </Button>
              )}
              {showSave && (
                <Button type="link" disabled={disabled} loading={saveLoading} onClick={handleSubmit}>
                  保存
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      <ul className={styles['checkbox-tree-list']}>
        {checkedNodes &&
          checkedNodes.map((v, i) => {
            return (
              <li key={v[customKey]}>
                <Checkbox
                  onChange={checkChange}
                  disabled={disabled}
                  onClick={() => toggle(v[customKey])}
                  checked={isSelected(v[customKey])}
                >
                  {v[customName]}
                </Checkbox>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

CheckboxTree.defaultProps = {
  checkedNodes: [],
}

export default CheckboxTree

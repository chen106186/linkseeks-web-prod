import React, { RefObject, useRef, useEffect } from 'react'
import { Button, Checkbox } from 'antd'
import { useSelections } from '@linkseeks/hooks'
import { findTreeKeys } from '@/utils'
import './index.global.less'
import { useIntl } from '@linkseeks/i18n'
export interface CheckboxTreeProps {
  title?: React.ReactNode
  checkedNodes?: any[]
  handleChange?(e?)
  handleSubmit?()
  showSave?
  disabled?: boolean
  actions?: RefObject<any>
}

const CheckboxTree: React.FC<CheckboxTreeProps> = (props) => {
  const { title, checkedNodes = [], actions, handleChange, disabled, showSave, handleSubmit } = props
  const intl = useIntl()
  const checkedKeys = findTreeKeys(checkedNodes, 'id')
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
        <div className="flex-bet">
          <div>{props.title}</div>
          <div>
            <Button onClick={toggleSelectAll} type="link" disabled={disabled}>
              {allSelected
                ? intl.formatMessage({ id: 'components.quxiaoquanxuan' })
                : intl.formatMessage({ id: 'components.quanxuan' })}
            </Button>
            {showSave && (
              <Button onClick={handleSubmit} type="link" disabled={disabled}>
                {intl.formatMessage({ id: 'components.baocun' })}
              </Button>
            )}
          </div>
        </div>
      )}
      <ul className="checkbox-tree-list">
        {checkedNodes &&
          checkedNodes.map((v, i) => {
            return (
              <li key={v.id}>
                <Checkbox
                  onChange={checkChange}
                  disabled={disabled}
                  onClick={() => toggle(v.id)}
                  checked={isSelected(v.id)}
                >
                  {v.name}
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

import React, { useCallback } from 'react'
import cx from 'classnames'
import { addChildComponent, STATE_PROPS } from '@apps/design-core'
import { AddBtnIcon } from './Icons'
import { useSelector } from '../../../hooks/useSelector'

import styles from '../index.less'

interface AddBtnProps {
  title: string
  newKey: string
  componentName: string
  parentPropName: string
  parentKey: string
}

type SettingPanelType = {
  pageConfig: any
}

const AddBtn = (props: AddBtnProps) => {
  const { title, newKey, componentName, parentPropName, parentKey } = props
  const { pageConfig } = useSelector<SettingPanelType, STATE_PROPS>(['pageConfig'])

  const handleAdd = useCallback(() => {
    if (newKey) {
      const _childProps = pageConfig[parentKey].childProps
        ? JSON.parse(JSON.stringify(pageConfig[parentKey].childProps))
        : {}
      _childProps.props ? (_childProps.props['key'] = newKey) : ''
      addChildComponent({
        componentName,
        newKey,
        parentPropName,
        parentKey,
        childProps: _childProps,
      })
    }
  }, [pageConfig, newKey])

  return (
    <div className={cx(styles['add-btn'], 'ignore-elements')} onClick={handleAdd}>
      <AddBtnIcon style={{ marginRight: 8 }} />
      {title}
    </div>
  )
}

export default AddBtn

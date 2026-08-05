import React, { memo } from 'react'
import { SelectedInfoBaseType, deleteComponentByKey, changeStatusProps } from '@apps/design-core'
import classNames from 'classnames'
import { ArrowRightIcon, ArrowRightDisabledIcon, ChildItemIcon } from '../../ModuleTree/components/Icons'
import { useSelector } from '../../../hooks/useSelector'
import { handleSelectedStatus, onMouseOver } from '../../../common/events'
import dragIcon from '../../ModuleTree/svgs/drag_icon.svg'
import dragDisableIcon from '../../ModuleTree/svgs/drag_disable_icon.svg'
import showIcon from '../../ModuleTree/svgs/show_icon.svg'
import hideIcon from '../../ModuleTree/svgs/hide_icon.svg'
import deleteDisableIcon from '../../ModuleTree/svgs/delete_disable_icon.svg'
import deleteIcon from '../../ModuleTree/svgs/delete_icon.svg'
import styles from '../index.less'
import { isEqualKey } from '../../../utils'

// const selectedColor = '#5E96FF';
// const unSelectedColor = '#555555';
const lastChildColor = '#FAFBFC'
const selectedBorderColor = '#00A98F'
const unSelectedBorderColor = '#EDEEEF'
const selectedBGColor = 'rgba(0,169,143,0.08)'
const hoveredBGColor = 'rgba(0,169,143,0.08)'

interface HeaderProps {
  title: string
  hasChildNodes: boolean
  currentKey: string
}

function controlUpdate(prevState, nextState, key: string) {
  return true
}

function Header(props: HeaderProps) {
  const {
    // specialProps,
    // propName,
    // specialProps: { key, parentKey, parentPropName },
    // componentName,
    title,
    hasChildNodes,
    currentKey,
    // isHide,
  } = props
  // const isSelected = false;
  const { selectedInfo, hoverKey, pageConfig } = useSelector<any, any>(
    ['selectedInfo', 'hoverKey', 'pageConfig'],
    // (prevState, nextState) => controlUpdate(prevState, nextState, currentKey),
  )
  // console.log("pageConfig", pageConfig);
  const { propName: selectedPropName, selectedKey } = selectedInfo || {}
  const {
    canHide = false,
    canEdit = true,
    firstLevel = false,
    canDelete = true,
    canDrag = true,
    hideAction = false,
    props: currentProps,
  } = pageConfig[currentKey] || {}
  const { status = false } = currentProps || {}
  const sortItemKey = currentKey
  const isSelected = isEqualKey(sortItemKey, selectedPropName ? `${selectedKey}${selectedPropName}` : selectedKey)
  const isHovered = isEqualKey(currentKey, hoverKey)
  const ArrowIcon = canEdit ? ArrowRightIcon : ArrowRightDisabledIcon

  const handleHideAction = (e) => {
    e.preventDefault()
    e.stopPropagation()
    changeStatusProps({
      props: currentProps,
      currentKey: currentKey,
    })
  }

  const handleDelete = () => {
    console.log(selectedInfo)
    console.log(props)
    const splitKeys = currentKey.split('-')
    const parentKey = splitKeys.length > 0 ? splitKeys.slice(0, -1).join('-') : '0'
    deleteComponentByKey({
      key: currentKey,
      parentKey: parentKey,
      parentPropName: '',
    })
  }

  const handleSelect = () => {
    if (!canEdit) {
      return
    }
    const special = {
      key: currentKey,
      domTreeKeys: ['0', ...currentKey.split('-')],
      parentKey: '',
    }
    handleSelectedStatus(null, isSelected, special)
  }

  return !canHide ? (
    <div
      style={{
        backgroundColor:
          (isSelected && selectedBGColor) ||
          (isHovered && canEdit && hoveredBGColor) ||
          (!hasChildNodes && lastChildColor) ||
          '#0000',
        borderColor: isSelected ? selectedBorderColor : hasChildNodes || firstLevel ? unSelectedBorderColor : '#FFFFFF',
      }}
      className={classNames(
        styles['header-container'],
        // isHide ? styles.hide : '',
        // (parentKey && parentKey !== "0") && styles['has-child'],
        !canEdit && styles['disabled'],
      )}
    >
      <div
        onClick={handleSelect}
        onMouseOver={(e: any) => onMouseOver(e, currentKey, isSelected)}
        style={{ display: 'flex', flex: 1, alignItems: 'center' }}
      >
        <ArrowIcon
          // className={classNames(styles.triangle, isUnfold && styles.rotate90)}
          className={classNames(styles.triangle)}
          style={{
            visibility: hasChildNodes ? 'visible' : 'hidden',
          }}
          onClick={(event) => {
            if (!canEdit) {
              return
            }
            event.stopPropagation()
            // setIsUnfold?.(!isUnfold);
          }}
        />
        {!hasChildNodes && !firstLevel && <ChildItemIcon style={{ marginRight: 8 }} />}
        <span className={classNames(styles.header_container_title)}>{title}</span>
        <div className={classNames(styles.tool_actions, (isHovered || isSelected) && styles.show)}>
          {canDelete ? (
            canEdit ? (
              <img className={styles.tool_actions_item} src={deleteIcon} onClick={handleDelete} />
            ) : (
              <img className={styles.tool_actions_item} src={deleteDisableIcon} />
            )
          ) : null}
          {hideAction ? (
            status ? (
              <img className={styles.tool_actions_item} src={showIcon} onClick={handleHideAction} />
            ) : (
              <img className={styles.tool_actions_item} src={hideIcon} onClick={handleHideAction} />
            )
          ) : null}
          {canDrag ? (
            canEdit ? (
              <img className={classNames(styles.tool_actions_item, 'drag_item')} src={dragIcon} />
            ) : (
              <img className={classNames(styles.tool_actions_item, 'drag_item')} src={dragDisableIcon} />
            )
          ) : null}
        </div>
      </div>
    </div>
  ) : null
}

export default memo(Header)

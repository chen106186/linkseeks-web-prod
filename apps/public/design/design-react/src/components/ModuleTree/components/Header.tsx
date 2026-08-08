import React, { memo } from 'react'
import {
  SelectedInfoBaseType,
  deleteComponentByKey,
  changeStatusProps,
  copyCurrentComponent,
  SelectedInfoType,
  STATE_PROPS,
  PageConfigType,
} from '@apps/design-core'
import { getWebIntl } from '@apps/locales'
import { Modal } from 'antd'
import classNames from 'classnames'
import { ArrowRightIcon, ArrowRightDisabledIcon, ChildItemIcon } from './Icons'
import { useSelector } from '../../../hooks/useSelector'
import { handleSelectedStatus, onMouseOver } from '../../../common/events'
import dragIcon from '../svgs/drag_icon.svg'
import dragDisableIcon from '../svgs/drag_disable_icon.svg'
import showIcon from '../svgs/show_icon.svg'
import hideIcon from '../svgs/hide_icon.svg'
import deleteDisableIcon from '../svgs/delete_disable_icon.svg'
import deleteIcon from '../svgs/delete_icon.svg'
import copyIcon from '../svgs/copy.svg'
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
  specialProps: SelectedInfoBaseType
  propName?: string
  setIsUnfold: any
  isUnfold: boolean
  componentName: string
  title: string
  hasChildNodes: boolean
  isHide?: boolean
  index: number
  level: number
}

type SettingPanelType = {
  selectedInfo: SelectedInfoType
  pageConfig: any
  hoverKey: string
}

function controlUpdate(prevState, nextState, key: string) {
  return true
}

function Header(props: HeaderProps) {
  const {
    specialProps,
    propName,
    level,
    specialProps: { key, parentKey, parentPropName },
    componentName,
    title,
    hasChildNodes,
    isHide,
    index,
  } = props

  const { selectedInfo, hoverKey, pageConfig } = useSelector<SettingPanelType, STATE_PROPS>(
    ['selectedInfo', 'hoverKey', 'pageConfig'],
    (prevState, nextState) => controlUpdate(prevState, nextState, key),
  )
  const { propName: selectedPropName, selectedKey } = selectedInfo || {}
  // showIndex：是否显示索引；canHide：不显示在组件树上；firstLevel：是否1级菜单；canCopy：是否可以复制：canEdit：是否可以编辑；canDrag：是否可以拖拽，hideAction：是否显示隐藏图片
  const {
    showIndex = false,
    canHide = false,
    firstLevel = false,
    canCopy = false,
    canEdit = true,
    canDelete = true,
    canDrag = true,
    hideAction = false,
    props: currentProps,
  } = pageConfig[key] || {}
  const { visible = true } = currentProps || {}
  const sortItemKey = propName ? `${key}${propName}` : key
  const isSelected = isEqualKey(sortItemKey, selectedPropName ? `${selectedKey}${selectedPropName}` : selectedKey)
  const isHovered = isEqualKey(sortItemKey, hoverKey)
  const ArrowIcon = canEdit ? ArrowRightIcon : ArrowRightDisabledIcon
  const translate = getWebIntl()

  const handleHideAction = (e) => {
    e.preventDefault()
    e.stopPropagation()
    changeStatusProps({
      props: currentProps,
      currentKey: key,
    })
  }

  const handleDeleteAction = (e, key, parentKey, parentPropName) => {
    e.preventDefault()
    e.stopPropagation()
    Modal.confirm({
      title: translate('web.resource.shop.shifouquerenshanchugaizujian' as never),
      centered: true,
      onOk: () => {
        deleteComponentByKey({ key, parentKey, parentPropName })
      },
    })
  }

  const handleCopyAction = (e, key, parentKey, parentPropName) => {
    e.preventDefault()
    e.stopPropagation()
    copyCurrentComponent({ key, parentKey, parentPropName })
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
        paddingLeft: level >= 2 ? 8 * (level - 1) : 0,
      }}
      className={classNames(
        styles['header-container'],
        isHide ? styles.hide : '',
        // (parentKey && parentKey !== "0") && styles['has-child'],
        !canEdit && styles['disabled'],
      )}
    >
      <div
        onClick={() => {
          if (!canEdit) {
            return
          }
          handleSelectedStatus(null, isSelected, specialProps, propName)
        }}
        onMouseOver={(e: any) => onMouseOver(e, sortItemKey, isSelected)}
        style={{ display: 'flex', flex: 1, alignItems: 'center' }}
      >
        <ArrowIcon
          className={classNames(styles.triangle, 'rotate')}
          style={{
            display: hasChildNodes && !firstLevel ? 'block' : 'none',
          }}
        />
        {showIndex && <span>{index}.</span>}
        {!hasChildNodes && !firstLevel && <ChildItemIcon style={{ marginRight: 8 }} />}
        <span className={classNames(styles.header_container_title)}>{title}</span>
        <div className={classNames(styles.tool_actions, (isHovered || isSelected) && styles.show)}>
          {canCopy && visible !== false ? (
            <img
              className={styles.tool_actions_item}
              src={copyIcon}
              onClick={(e) => handleCopyAction(e, key, parentKey, parentPropName)}
            />
          ) : null}
          {canDelete ? (
            canEdit ? (
              <img
                className={styles.tool_actions_item}
                src={deleteIcon}
                onClick={(e) => handleDeleteAction(e, key, parentKey, parentPropName)}
              />
            ) : (
              <img className={styles.tool_actions_item} src={deleteDisableIcon} />
            )
          ) : null}
          {hideAction ? (
            visible ? (
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

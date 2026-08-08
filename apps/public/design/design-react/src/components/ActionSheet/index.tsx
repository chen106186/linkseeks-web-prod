import React, { memo } from 'react'
import classNames from 'classnames'
import configs, { ACTIONS } from './configs'
import styles from './index.less'
import editIcon from './svgs/edit.svg'
import settingIcon from './svgs/setting_icon.svg'

interface ActionSheetProps {
  isOut: boolean
  hasChildNodes: boolean
  isRoot: boolean
  keyValue?: string
  onlyEidt?: boolean
  hideActions?: boolean
}

function ActionSheet(props: ActionSheetProps) {
  const { isOut, isRoot, hasChildNodes, hideActions = false } = props

  return (
    <div
      className={classNames(styles['container'], hasChildNodes && styles['setting'])}
      style={{ top: isOut && hasChildNodes ? '-24px' : 0 }}
    >
      {/* <div className={styles['action-btn']} >
        {keyValue}
      </div> */}
      {!hideActions && (
        <>
          {hasChildNodes ? (
            <div className={styles['action-btn']}>
              <img src={settingIcon} className={styles['action-icon-edit']} />
            </div>
          ) : (
            <div className={styles['action-btn']}>
              <img src={editIcon} className={styles['action-icon-edit']} />
            </div>
          )}
        </>
      )}
      {configs.map((config) => {
        const { icon, action, type } = config
        if (isRoot && type === ACTIONS.copy) return null
        // if (!hasChildNodes && type === ACTIONS.clear) return null;
        if (type === ACTIONS.clear) return null
        if (hideActions) return null
        return (
          <div className={styles['action-btn']} onClick={action} key={type}>
            <img src={icon} className={styles['action-icon']} />
          </div>
        )
      })}
    </div>
  )
}

export default memo(ActionSheet)

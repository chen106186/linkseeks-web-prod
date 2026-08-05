import React from 'react'
import cx from 'classnames'
import { DeleteOutlined } from '@ant-design/icons'
import styles from './index.less'

interface SettingItemPropsTYpe {
  selected?: boolean
  type?: 'show' | 'select'
  onClick: any
  onDelete?: any
  size?: 'default' | 'small'
  hasBorder?: boolean
}

interface SettingListPropsType {
  type?: 'show' | 'select'
  size?: 'default' | 'small'
}

enum SettingItemType {
  show = 'show',
  select = 'select',
}

const SettingItem: React.FC<SettingItemPropsTYpe> = (props) => {
  const { children, selected = false, type, onClick, size = 'default', hasBorder = false, onDelete } = props

  return (
    <div
      className={cx(
        styles.setting_list_item,
        type === SettingItemType.show ? styles.hover_active : selected ? styles.active : '',
        size === 'small' ? styles.small : '',
        hasBorder ? styles.hasBorder : '',
      )}
      onClick={onClick}
    >
      <div className={styles.setting_mask}>
        <div className={styles.setting_deletebtn} onClick={onDelete}>
          <DeleteOutlined />
        </div>
      </div>
      {children}
    </div>
  )
}

const SettingList: any & React.FC<SettingListPropsType> = (props) => {
  const { children, type = 'show', size = 'default' } = props

  return (
    <div className={cx(styles.setting_list, size === 'small' ? styles.small : '')}>
      {children &&
        React.Children.map(children, (child: any) => {
          return React.cloneElement(child, {
            type,
          })
        })}
      {/* {children} */}
    </div>
  )
}

SettingList.SettingItem = SettingItem

export default SettingList

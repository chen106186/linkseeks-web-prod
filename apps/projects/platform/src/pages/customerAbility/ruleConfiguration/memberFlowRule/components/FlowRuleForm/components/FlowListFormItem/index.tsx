/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-28 11:20:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 17:29:08
 * @Description: 流程列表 Form Item
 */
import React, { useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import StatusTag, { StatusTagProps } from '@/components/StatusTag'
import styles from './index.less'

interface ListItem {
  /**
   * 数据id
   */
  id: string
  /**
   * 标题
   */
  processName: string
  /**
   * 流程
   */
  processTypeName: string
  /**
   * 描述
   */
  description: string
}

interface IProps extends Pick<StatusTagProps, 'type'> {
  /**
   * 值
   */
  value: string
  /**
   * 列表数据
   */
  dataSource: ListItem[]
  /**
   * 默认展示的条数，默认值 3
   */
  showCount?: number
  /**
   * 数据选择改变触发事件
   */
  onChange: (id: string) => {}
  /**
   * 是否是禁用的，默认 false
   */
  disabled?: boolean
  /**
   * 是否是只读的，默认 false
   */
  readOnly?: boolean
}

const FlowListFormItem = (props: IProps) => {
  const { value, showCount = 3, dataSource = [], onChange, disabled = false, readOnly, type } = props
  const [showMore, setShowMore] = useState(false)

  const intl = useIntl()

  const showDataSource = !showMore && !readOnly ? [...dataSource].splice(0, showCount) : dataSource

  const handleToogleMore = () => {
    setShowMore(!showMore)
  }

  const handleSelectItem = (record) => {
    if (onChange && !disabled) {
      onChange(record.id)
    }
  }

  return (
    <div className={styles.flowList}>
      <ul className={styles.list}>
        {showDataSource.map((item) => (
          <li
            className={classNames(styles['list-item'], {
              [styles.active]: item.id === value,
              [styles.disabled]: disabled,
              [styles.hide]: readOnly && item.id !== value,
            })}
            onClick={() => handleSelectItem(item)}
            key={item.id}
          >
            <div className={styles['list-item-head']}>
              <div className={styles['list-item-title']}>{item.processName}</div>
              <StatusTag title={item.processTypeName} type={type} />
            </div>
            <div className={styles['list-item-desc']}>{item.description}</div>
          </li>
        ))}
      </ul>
      {dataSource.length > showCount && !readOnly && (
        <div className={styles.more} onClick={handleToogleMore}>
          {!showMore
            ? intl.formatMessage({ id: 'member.memberFlowRule.components.FlowListFormItem.visible' })
            : intl.formatMessage({ id: 'member.memberFlowRule.components.FlowListFormItem.hide' })}
          {!showMore ? <CaretDownOutlined /> : <CaretUpOutlined />}
        </div>
      )}
    </div>
  )
}

FlowListFormItem.defaultProps = {
  showCount: 3,
  disabled: false,
  readOnly: false,
}

export default FlowListFormItem

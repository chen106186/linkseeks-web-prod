/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-05 10:30:54
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-06 14:18:10
 * @Description: 地址 Form Item
 */
import React, { useEffect, useState } from 'react'
import { ISchemaFieldComponentProps } from '@apps/formily'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
interface AddressItem {
  id: string
  // 收件人
  receiverName?: string
  // 收件人
  shipperName?: string
  // 电话
  phone: string
  // 详细地址
  fullAddress: string
}

interface AddressFormItemProps {
  value: AddressItem
  dataSource: AddressItem[]
  // 默认展示的条数
  showCount?: number
  onChange: (id: string) => {}
  // 禁用的
  disabled?: boolean
  /**
   * 只读的
   */
  readOnly?: boolean
}

const AddressFormItem: React.FC<AddressFormItemProps> & { isFieldComponent: boolean } = (props) => {
  const { value, showCount = 3, dataSource = [], onChange, disabled = false, readOnly } = props
  const [showMore, setShowMore] = useState(false)

  // useEffect(() => {
  //   // 默认选中第一个
  //   if (dataSource && dataSource.length && !value) {
  //     if (onChange) {
  //       onChange(dataSource[0].id);
  //     }
  //   }

  // }, [dataSource]);

  const showDataSource = !showMore && !readOnly ? [...dataSource].splice(0, showCount) : dataSource

  const handleToogleMore = () => {
    setShowMore(!showMore)
  }

  const handleSelectItem = (record) => {
    if (onChange && !disabled) {
      onChange(record)
    }
  }

  return (
    <div className={styles.addressee}>
      <ul className={styles.addressList}>
        {showDataSource.map((item) => (
          <li
            className={classNames(styles['addressList-item'], {
              [styles.active]: item.id === (value && value.id),
              [styles.disabled]: disabled,
              [styles.hide]: readOnly && item.id !== (value && value.id),
            })}
            onClick={() => handleSelectItem(item)}
            key={item.id}
          >
            <div>{`${item.receiverName || item.shipperName} / ${item.phone}`}</div>
            <div className={styles['addressList-item-detail']}>{item.fullAddress}</div>
          </li>
        ))}
      </ul>
      {dataSource.length > showCount && !readOnly && (
        <div className={styles.more} onClick={handleToogleMore}>
          {!showMore
            ? intl.formatMessage({ id: 'contract.xianshigengduo' })
            : intl.formatMessage({ id: 'contract.yincanggengduo' })}
          {!showMore ? <CaretDownOutlined /> : <CaretUpOutlined />}
        </div>
      )}
    </div>
  )
}

AddressFormItem.defaultProps = {}

AddressFormItem.isFieldComponent = false

export default AddressFormItem

import React, { useState } from 'react'
import { Tooltip } from 'antd'
import cx from 'classnames'
import arrowDownIcon from '../SelectCity/arrow_down_icon.png'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

export interface SelectYearValueType {
  label: string
  value: number
}

interface SelectYearRangeProps {
  value: SelectYearValueType | undefined
  placeholder: string
  onChange: (value: SelectYearValueType) => void
}

const SelectYearRange: React.FC<SelectYearRangeProps> = (props) => {
  const { value, placeholder, onChange } = props
  const [visible, setVisible] = useState<boolean>(false)
  const translate = getWebIntl()

  const defaultYearList: SelectYearValueType[] = [
    {
      value: 1,
      label: '50' + translate('web.resource.mall.wanyixia'),
    },
    {
      value: 2,
      label: '50' + translate('web.common.thousand') + '-100' + translate('web.common.thousand'),
    },
    {
      value: 3,
      label: '101' + translate('web.common.thousand') + '500' + translate('web.common.thousand'),
    },
    {
      value: 4,
      label: '501' + translate('web.common.thousand') + '1000' + translate('web.common.thousand'),
    },
    {
      value: 5,
      label: '1001' + translate('web.common.thousand') + '2000' + translate('web.common.thousand'),
    },
    {
      value: 6,
      label: '2000' + translate('web.resource.mall.wanyishang'),
    },
  ]

  const handleSelectYear = (item: SelectYearValueType) => {
    if (value?.value !== item.value) {
      onChange(item)
      setVisible(false)
    } else {
      setVisible(false)
    }
  }

  const renderYearList = () => {
    return (
      <div className={styles.year_list}>
        {defaultYearList.map((item) => (
          <div
            key={`year_list_item_${item.value}`}
            className={cx(styles.year_list_item, value && value.value === item.value)}
            onClick={() => handleSelectYear(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Tooltip
      placement="bottomRight"
      title={renderYearList()}
      color="white"
      overlayClassName={styles.tool_tip}
      open={visible}
    >
      <div className={styles.select_box} onClick={() => setVisible(!visible)}>
        <div className={styles.select_box_value}>
          {value ? (
            <span className={styles.value}>{value.label}</span>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </div>
        <i className={styles.select_box_icon}>
          <img src={arrowDownIcon} />
        </i>
      </div>
    </Tooltip>
  )
}

export default SelectYearRange

/**
 * @Description 时间周期选择器
 */
import React from 'react'
import { Button, Space } from 'antd'
import classNames from 'classnames'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

// 这里偷懒直接以后台接口返回字段命名
export type DateCycleType = 'weekList' | 'monthList' | 'yearList'

interface DateCycleProps {
  /**
   * value，当前选中的项，完全受控
   */
  value: DateCycleType
  /**
   * 选择周期改变触发事件
   */
  onChange?: (value: DateCycleType) => void
}

const DateCycle: React.FC<DateCycleProps> = (props) => {
  const { value, onChange } = props
  const translate = useWebIntl()
  const handleClick = (type: DateCycleType) => {
    onChange?.(type)
  }

  return (
    <div className={styles['date-cycle']}>
      <Space>
        <Button
          size="small"
          onClick={() => handleClick('weekList')}
          className={classNames({ [styles['date-cycle-btn-active']]: value === 'weekList' })}
        >
          {translate('web.common.week')}
        </Button>
        <Button
          size="small"
          onClick={() => handleClick('monthList')}
          className={classNames({ [styles['date-cycle-btn-active']]: value === 'monthList' })}
        >
          {translate('web.common.month')}
        </Button>
        <Button
          size="small"
          onClick={() => handleClick('yearList')}
          className={classNames({ [styles['date-cycle-btn-active']]: value === 'yearList' })}
        >
          {translate('web.common.year')}
        </Button>
      </Space>
    </div>
  )
}

export default DateCycle

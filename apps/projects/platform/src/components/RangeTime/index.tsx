import React, { CSSProperties, useCallback, useEffect, useState } from 'react'
import { DatePicker } from 'antd'
import cx from 'classnames'
import moment, { Moment } from 'moment'
import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

function range(start, end) {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}

interface Iprops {
  containerStyle?: CSSProperties
  /**
   * 默认时间
   */
  rangeTime?: Moment[]
  /**
   * placeholader
   */
  placeholader?: [string, string]
  /**
   * 规定起始时间是否大于当前日期
   */
  shouldGtCurrent?: boolean
  onChange?: ((rangeTime: Moment[]) => void) | null
  disabled?: boolean
  showTime?: boolean
}

const RangeTime: React.FC<Iprops> = (props: Iprops) => {
  const { containerStyle, rangeTime, onChange, placeholader, shouldGtCurrent, disabled, showTime } = props
  const currentDay = moment()

  const [innerRangeTime, setInnerRangeTime] = useState({
    startTime: null,
    endTime: null,
  })

  useEffect(() => {
    const [startTime = null, endTime = null] = rangeTime as any
    setInnerRangeTime({
      startTime: startTime,
      endTime: endTime,
    })
  }, [props.rangeTime])

  const handleChange = (date: Moment | null, dateString: string, mode: 'startTime' | 'endTime') => {
    const reverseMode = mode === 'startTime' ? 'endTime' : 'startTime'
    const newObject = {
      ...innerRangeTime,
      [mode]: date,
    }

    // 对调位置，可以省去很多复杂且不必要的判断
    if (date && newObject[reverseMode]) {
      if (mode === 'startTime' && date > newObject[reverseMode]) {
        newObject[mode] = newObject[reverseMode]
        newObject[reverseMode] = date
      }
      if (mode === 'endTime' && date < newObject[reverseMode]) {
        newObject[mode] = newObject[reverseMode]
        newObject[reverseMode] = date
      }
    }

    if (onChange) {
      onChange?.([newObject.startTime as unknown as Moment, newObject.endTime as unknown as Moment])
    } else {
      setInnerRangeTime(newObject)
    }
  }

  const getDisableDate = useCallback(
    (current: Moment, mode: 'startTime' | 'endTime') => {
      const reverseMode = mode === 'startTime' ? 'endTime' : 'startTime'
      const modeTime: Moment | null = moment(innerRangeTime[reverseMode])

      // current 为当前日历上的日期， 如果返回值为true，那么表示当前日期为禁用状态
      if (!modeTime) {
        if (shouldGtCurrent) {
          return current < currentDay
        }
        return false
      }
      if (mode === 'startTime') {
        return shouldGtCurrent
          ? current < currentDay || current > modeTime.endOf('day')
          : current > modeTime.endOf('day')
      } else {
        //现在的时间要大于开始的时间， true 为禁用
        return shouldGtCurrent ? current < currentDay || current < modeTime : current < modeTime.endOf('day')
      }
    },
    [innerRangeTime],
  )

  const disabledDateTime = (current: Moment, partial: 'start' | 'end') => {
    const { startTime } = innerRangeTime
    const hours = range(0, 24)
    const minutes = range(0, 60)
    if (partial === 'start') {
      return {
        disabledHours: () => hours.splice(0, current && current.isSame(currentDay, 'day') ? moment().get('hour') : 0),
        disabledMinutes: () =>
          minutes.splice(0, current && current.isSame(currentDay, 'day') ? moment().get('minute') : 0),
        disabledSeconds: () =>
          minutes.splice(0, current && current.isSame(currentDay, 'day') ? moment().get('second') : 0),
      }
    }
    if (partial === 'end') {
      return {
        disabledHours: () => hours.splice(0, startTime?.get('hour')),
        disabledMinutes: () =>
          minutes.splice(0, current && current.isSame(startTime, 'hour') ? startTime?.get('minute') : 0),
        disabledSeconds: () =>
          minutes.splice(
            0,
            current && current.isSame(startTime, 'hour') && current.isSame(startTime, 'minute')
              ? startTime?.get('second') + 1
              : 0,
          ),
      }
    }
    return {}
  }

  return (
    <div className={cx(styles.container, containerStyle)}>
      <div className={styles.wrapFlex}>
        <DatePicker
          style={{ width: '100%' }}
          value={innerRangeTime.startTime}
          onChange={(date: Moment | null, dateString: string) => handleChange(date, dateString, 'startTime')}
          disabledDate={(current) => getDisableDate(current, 'startTime')}
          disabledTime={(current) => disabledDateTime(current, 'start')}
          placeholder={placeholader![0]}
          disabled={disabled}
          showTime={showTime}
        />
      </div>
      <span className={styles.splitChar}>~</span>
      <div className={styles.wrapFlex}>
        <DatePicker
          style={{ width: '100%' }}
          value={innerRangeTime.endTime}
          onChange={(date: Moment | null, dateString: string) => handleChange(date, dateString, 'endTime')}
          disabledDate={(current) => getDisableDate(current, 'endTime')}
          // disabledTime={(current) => disabledDateTime(current, 'end')}
          placeholder={placeholader![1]}
          disabled={disabled}
          showTime={showTime}
        />
      </div>
    </div>
  )
}

RangeTime.defaultProps = {
  containerStyle: {},
  rangeTime: [],
  onChange: null,
  placeholader: [
    intl.formatMessage({ id: 'components.kaishishijian' }),
    intl.formatMessage({ id: 'components.jieshushijian' }),
  ],
  shouldGtCurrent: true,
  disabled: false,
  showTime: false,
}

export default RangeTime

import classnames from 'classnames'
import React from 'react'
import { Text, View } from '@tarojs/components'
import { Calendar } from '../../../../types/calendar'
import * as constant from '../../common/constant'

const MAP: { [key: number]: string } = {
  [constant.TYPE_PRE_MONTH]: 'pre',
  [constant.TYPE_NOW_MONTH]: 'now',
  [constant.TYPE_NEXT_MONTH]: 'next',
}

export interface Props {
  list: Calendar.List<Calendar.Item>

  /**
   * 可选或不可选
   * true: 可选
   * false: 不可选
   */
  isSelect?: boolean

  /**
   * 法定节假日是否可选
   * true: 可选
   * false: 不可选
   */
  isHolidaySelect?: boolean

  /**
   * 不可选日期
   * 当 isSelect 为 true 是为可选星期
   */
  disableDays?: string[]

  /**
   * 不可选星期
   * 当 isSelect 为 true 是为可选星期
   * 0: 星期天/日, 1: 星期一, ...6: 星期六
   */
  disableWeek?: number[]

  /**
   * 法定节假日
   * 当 isHolidaySelect 为 true 是为可选法定节假日
   * 格式: ['01-01', '01-02', '01-03', '05-01', '05-02', '05-03', '05-04', '05-05', '10-01', '10-02', '10-03', '10-04', '10-05', '10-05', '10-07']
   */
  holidays?: string[]

  onClick?: (item: Calendar.Item) => void

  onLongClick?: (item: Calendar.Item) => void
}

export default class AtCalendarList extends React.Component<Props> {
  private handleClick = (item: Calendar.Item): void => {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(item)
    }
  }

  private handleLongClick = (item: Calendar.Item): void => {
    if (typeof this.props.onLongClick === 'function') {
      this.props.onLongClick(item)
    }
  }

  public render(): JSX.Element | null {
    const { list, isSelect, isHolidaySelect, disableDays, disableWeek, holidays } = this.props
    if (!list || list.length === 0) return null

    const newList = list.map((item) => {
      const isDisableDays = disableDays?.includes(item.value)
      const isDisabledWeek = disableWeek?.includes(item.day)
      const isDisabledHolidays = holidays?.includes(item.value.substring(5))

      /**
       * 3.1）根据【商家后台-商品管理-服务预约时间限制】中设置的每周周期显示可预约日期，选择的星期可选，未选择的星期置灰不可选；
       * 3.2）若勾选法定假期可预约，则每周可预约日期加上法定假期时可选，若未勾选法定假期可预约，则仅每周可预约日期可选；
       * 3.3）若勾选指定日期可预约，则每周可预约日期加上设置的指定日期可预约，若未勾选，则仅每周可预约日期可选
       */

      return {
        ...item,
        isDisableDays: isSelect
          ? isDisabledWeek || isDisableDays || (isHolidaySelect && isDisabledHolidays)
            ? false
            : true
          : isDisabledWeek || isDisableDays || (!isHolidaySelect && isDisabledHolidays)
          ? true
          : false,
      }
    })

    return (
      <View className="at-calendar__list flex">
        {newList.map((item: Calendar.Item) => (
          <View
            key={`list-item-${item.value}`}
            onClick={this.handleClick.bind(this, item)}
            onLongPress={this.handleLongClick.bind(this, item)}
            className={classnames('flex__item', `flex__item--${MAP[item.type]}`, {
              'flex__item--today': item.isToday,
              'flex__item--active': item.isActive,
              'flex__item--selected': item.isSelected,
              'flex__item--selected-head': item.isSelectedHead,
              'flex__item--selected-tail': item.isSelectedTail,
              'flex__item--blur':
                item.isDisabled ||
                item.isDisabledWeek ||
                item.isDisableDays ||
                item.isDisabledHolidays ||
                item.type === constant.TYPE_PRE_MONTH ||
                item.type === constant.TYPE_NEXT_MONTH,
            })}
          >
            <View className="flex__item-container">
              <View className="container-text">{item.text}</View>
            </View>
            <View className="flex__item-extra extra">
              {item.marks && item.marks.length > 0 ? (
                <View className="extra-marks">
                  {item.marks.map((mark, key) => (
                    <Text key={key} className="mark">
                      {mark.value as any}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    )
  }
}

import dayjs from 'dayjs'
// import { BaseEvent } from '@tarojs/components/types/common'

// #region Calendar
declare namespace Calendar {
  export type DateArg = string | number | Date

  export type classNameType =
    | string
    | Array<string>
    | { [key: string]: boolean }

  export interface Mark {
    value: DateArg
  }

  export interface ValidDate {
    value: DateArg
  }

  export interface Item {
    value: string

    _value: dayjs.Dayjs | any

    text: number

    type: number

    marks: Array<Mark>

    /**
     * 今天是星期几0：星期天, 6：星期六
     */
    day: number

    isActive?: boolean

    isToday?: boolean

    isBeforeMin?: boolean

    isAfterMax?: boolean

    isDisabled?: boolean

    isSelected?: boolean

    isSelectedHead?: boolean

    isSelectedTail?: boolean

    isDisableDays?: boolean

    isDisabledWeek?: boolean

    isDisabledHolidays?: boolean
  }

  export interface GroupOptions {
    validDates: Array<ValidDate>

    marks: Array<Mark>

    format: string

    selectedDates: Array<SelectedDate>

    minDate?: DateArg

    maxDate?: DateArg

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
     * 当 isSelect 为 true 是为可选法定节假日
     */
    holidays?: string[]
  }

  export type List<T> = Array<T>

  export type ListInfo<T> = {
    value: number

    list: List<T>
  }

  export interface SelectedDate {
    end?: Calendar.DateArg

    start: Calendar.DateArg
  }
}

export default Calendar
export { Calendar }
// #endregion

// #region AtCalendar
export interface AtCalendarPropsBase {
  format?: string

  validDates?: Array<Calendar.ValidDate>

  minDate?: Calendar.DateArg

  maxDate?: Calendar.DateArg

  isSwiper?: boolean

  marks?: Array<Calendar.Mark>

  monthFormat?: string

  hideArrow?: boolean

  isVertical?: boolean

  className?: Calendar.classNameType

  onClickPreMonth?: () => void

  onClickNextMonth?: () => void

  onSelectDate?: (item: { value: Calendar.SelectedDate }) => void

  onDayClick?: (item: { value: string }) => void

  onDayLongClick?: (item: { value: string }) => void

  onMonthChange?: (value: string) => void

  /**
   * 可选或不可选
   * true: 可选
   * false: 不可选
   */
  isSelect?: boolean

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
   * 法定节假日是否可选
   * true: 可选
   * false: 不可选
   */
  isHolidaySelect?: boolean

  /**
   * 法定节假日
   * 当 isHolidaySelect 为 true 是为可选法定节假日
   * 格式: ['01-01', '01-02', '01-03', '05-01', '05-02', '05-03', '05-04', '05-05', '10-01', '10-02', '10-03', '10-04', '10-05', '10-05', '10-07']
   */
  holidays?: string[]
}

export interface AtCalendarSingleSelectedProps extends AtCalendarPropsBase {
  isMultiSelect?: false

  currentDate?: Calendar.DateArg
}

export interface AtCalendarMutilSelectedProps extends AtCalendarPropsBase {
  isMultiSelect?: true

  currentDate?: Calendar.SelectedDate
}

export type AtCalendarProps =
  | AtCalendarSingleSelectedProps
  | AtCalendarMutilSelectedProps

export interface AtCalendarDefaultProps {
  format: string

  isSwiper: boolean

  validDates: Array<Calendar.ValidDate>

  marks: Array<Calendar.Mark>

  currentDate: Calendar.DateArg | Calendar.SelectedDate

  monthFormat: string

  hideArrow: boolean

  isVertical: boolean

  isMultiSelect: boolean

  selectedDates: Array<Calendar.SelectedDate>

  /**
   * 可选或不可选
   * true: 可选
   * false: 不可选
   */
  isSelect?: boolean

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
   * 法定节假日是否可选
   * true: 可选
   * false: 不可选
   */
  isHolidaySelect?: boolean

  /**
   * 法定节假日
   * 当 isHolidaySelect 为 true 是为可选法定节假日
   * 格式: ['01-01', '01-02', '01-03', '05-01', '05-02', '05-03', '05-04', '05-05', '10-01', '10-02', '10-03', '10-04', '10-05', '10-05', '10-07']
   */
  holidays?: string[]
}

export interface AtCalendarState {
  generateDate: number

  selectedDate: Calendar.SelectedDate
}

export type AtCalendarPropsWithDefaults = AtCalendarProps &
  AtCalendarDefaultProps
// #endregion

// #region AtCalendarController
export interface AtCalendarControllerProps {
  generateDate: Calendar.DateArg

  minDate?: Calendar.DateArg

  maxDate?: Calendar.DateArg

  hideArrow: boolean

  monthFormat: string

  onPreMonth: () => void

  onNextMonth: () => void

  onSelectDate: (e: any) => void
}

export interface AtCalendarControllerState { }
// #endregion

// #region AtCalendarBody
export type AtCalendarBodyListGroup = Array<Calendar.ListInfo<Calendar.Item>>

export interface AtCalendarBodyProps {
  format: string

  validDates: Array<Calendar.ValidDate>

  marks: Array<Calendar.Mark>

  isSwiper: boolean

  minDate?: Calendar.DateArg

  maxDate?: Calendar.DateArg

  isVertical: boolean

  generateDate: number

  selectedDate: Calendar.SelectedDate

  selectedDates: Array<Calendar.SelectedDate> | [],

  /**
   * 可选或不可选
   * true: 可选
   * false: 不可选
   */
  isSelect?: boolean

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
   * 法定节假日是否可选
   * true: 可选
   * false: 不可选
   */
  isHolidaySelect?: boolean

  /**
   * 法定节假日
   * 当 isHolidaySelect 为 true 是为可选法定节假日
   * 格式: ['01-01', '01-02', '01-03', '05-01', '05-02', '05-03', '05-04', '05-05', '10-01', '10-02', '10-03', '10-04', '10-05', '10-05', '10-07']
   */
  holidays?: string[]

  onDayClick: (item: Calendar.Item) => void

  onSwipeMonth: (vectorCount: number) => void

  onLongClick: (item: Calendar.Item) => void,

}

export interface AtCalendarBodyState {
  isAnimate: boolean

  offsetSize: number

  listGroup: AtCalendarBodyListGroup

  /**
   * 可选或不可选
   * true: 可选
   * false: 不可选
   */
  isSelect?: boolean

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
   * 法定节假日是否可选
   * true: 可选
   * false: 不可选
   */
  isHolidaySelect?: boolean

  /**
   * 法定节假日
   * 当 isHolidaySelect 为 true 是为可选法定节假日
   * 格式: ['01-01', '01-02', '01-03', '05-01', '05-02', '05-03', '05-04', '05-05', '10-01', '10-02', '10-03', '10-04', '10-05', '10-05', '10-07']
   */
  holidays?: string[]
}
// #endregion

import { PickerDateProps, PickerMultiSelectorProps, PickerRegionProps, PickerSelectorProps, PickerTimeProps } from '@tarojs/components/types/Picker'
import { ReactNode } from 'react'
import { GodActionSheetProps } from './action-sheet'
import GodComponent from './base'
type PickerColumnItem = {
  label: ReactNode
  value: string
}

type PickerColumn = (string | PickerColumnItem)[]

type PickerValue = string | null

type PickerValueExtend = {
  items: (PickerColumnItem | null)[]
}

export interface DateTimePickerProps
  extends GodComponent,
    Omit<GodActionSheetProps, "isOpened"> {
  /**
   * 可控制datepicker的显示隐藏，如果不传，则默认点击props.children的内容触发
   */
  visible?: boolean;
  /**
   * 日期选择范围的最小值
   */
  min?: Date;
  /**
   * 日期选择访问的最大值
   */
  max?: Date;
  /**
   * 传入时间的值
   */
  value?: Date | string;
  /**
   * 当某一列滑动停止时触发
   */
  onChange?(value: Date): void;
  /**
   * 点击确定触发
   */
  onConfirm?(value: Date | string): void;

  /**
   * 对返回的结果是否需要格式化
   * 支持 YYYY-MM-DD HH:mm:ss
   */
  format?: string;

  /**
   * 精度控制
   * @todo 目前只支持H5
   */
  precision?: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'week' | 'week-day'
}

export interface PickerViewProps
  extends GodComponent,
    Omit<GodActionSheetProps, "isOpened"> {
  /**
   * 可控制datepicker的显示隐藏，如果不传，则默认点击props.children的内容触发
   */
  visible?: boolean;
  /**
   * 传入的值
   */
  value?: PickerValue[];

  /**
   * 默认值
   */
  defaultValue?: PickerValue[]

  /**
   * 配置每一列的选项
   */
  columns: PickerColumn[] | ((value: PickerValue[]) => PickerColumn[])


  /**
   * 当某一列滑动停止时触发
   */
  onChange?(value: PickerValue[], extend: PickerValueExtend): void;
  /**
   * 点击确定触发
   */
  onConfirm?(value?: PickerValue[]): void;
  /**
   * 取消按钮文本
   */
  cancelText?: string;
  /**
   * 确认按钮文本
   */
  submitText?: string;
  /**
   * 选择标题文本
   */
  title?: string;
}

export type GodPickerProps = PickerDateProps | PickerMultiSelectorProps | PickerRegionProps | PickerSelectorProps | PickerTimeProps

declare const GodPicker: PickerDateProps | PickerMultiSelectorProps | PickerRegionProps | PickerSelectorProps | PickerTimeProps

export default GodPicker

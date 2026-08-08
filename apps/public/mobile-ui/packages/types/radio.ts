import React from 'react';

export interface RadioButtonProps {
  /**
   * 根据 value 进行比较，判断是否选中
   */
  value: any,
  /**
   * 大小，默认 middle
   */
  size?: 'middle' | 'small',
  /**
   * 是否禁用
   */
  disabled?: boolean,
  /**
   * 主题，可选值 'dark' 'light'，默认 'dark'，只对 只对按钮样式生效
   */
  theme?: 'dark' | 'light',

  children?: React.ReactNode,
}

export interface RadioProps {
  /**
   * 根据 value 进行比较，判断是否选中
   */
  value: any,
  /**
   * 选中颜色，默认主题色
   */
  // eslint-disable-next-line react/require-default-props
  color?: string
  /**
   * 大小，默认22
   */
  size?: number,
  /**
   * 是否禁用
   */
  disabled?: boolean,

  children?: React.ReactNode,
}

export interface RadioData {
  /**
   * 当前选中的值
   */
  value: '',
  /**
   * 选中改变触发事件
   */
  toggleChange: ((value: any) => void) | undefined,
  /**
   * 是否禁用
   */
  disabled: boolean,
  /**
   * checkbox 大小，默认 22
   */
  size: number,
  /**
   * 'middle' | 'small' | (string & {}),
   */
  buttonSize: 'middle' | 'small' | (string & {}),
  /**
   * 主题，可选值 'dark' 'light'，默认 'dark'，只对 只对按钮样式生效
   */
  theme?: 'dark' | 'light',
}

export interface RadioGroupProps {
  /**
   * 当前选中值
   */
  value?: any;
  /**
   * 默认选中值当前选中值
   */
  defaultValue?: any;
  /**
   * 选项变化时的回调函数
   */
  onChange?: (value: any) => void;
  /**
   * 禁选所有子单选器
   */
  disabled?: boolean,
  /**
   * 单选框大小，默认22，只对 单选样式生效
   */
  size?: number,
  /**
   * 按钮大小，可选值 'middle' 'small'，只对 只对按钮样式生效
   */
  buttonSize?: 'middle' | 'small' | (string & {}),
  /**
   * 主题，可选值 'dark' 'light'，默认 'dark'，只对 只对按钮样式生效
   */
  theme?: 'dark' | 'light',
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties,
  /**
   * 子元素类型，默认 radio
   */
  type?: 'radio' | 'radio.button',

  children?: React.ReactNode,
}

export interface RadioGroupState {
  value: any,
  toggleChange: (value: any) => void,
}

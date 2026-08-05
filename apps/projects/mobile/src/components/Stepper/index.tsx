/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-30 15:50:20
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 18:52:28
 * @Description: 步进器
 */
import React from 'react'
import { ITouchEvent } from '@tarojs/components'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { Input, View, Icons } from '@apps/mobile-ui'
import classNames from 'classnames'
import './index.scss'

/**
 * @param x 需处理精度的数
 * @param n 小数点后第 n 位
 * @returns 处理后的数
 */
export function roundFractional(x, n) {
  return Math.round(x * Math.pow(10, n)) / Math.pow(10, n)
}

interface StepperProps {
  /**
   * 输入值
   */
  value?: string | number
  /**
   * 最小值，默认值 1
   */
  min?: number
  /**
   * 最大值
   */
  max?: number
  /**
   * 步长，默认值 1
   */
  step?: number
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 输入框宽度，默认值 56
   */
  inputWidth?: number
  /**
   * 按钮大小，默认值 28，输入框高度会和按钮大小保持一致
   */
  buttonSize?: number
  /**
   * 按钮样式
   */
  buttonClassName?: string
  /**
   * 当绑定值变化时触发的事件
   */
  onChange?: (value: string | number) => void
  /**
   * 输入框聚焦时触发
   */
  onFocus?: () => void
  /**
   * 输入框失焦时触发
   */
  onBlur?: (value: number) => void
  /**
   * 点击增加按钮时触发
   */
  onPlus?: (value: number) => void
  /**
   * 点击减少按钮时触发
   */
  onMinus?: (value: number) => void
}

interface StepperState {
  inputValue: string
  minusDisable: boolean
  plusDisable: boolean
  singleKey: string
}

class StepperPro extends React.Component<StepperProps, StepperState> {
  // static getDerivedStateFromProps(nextProps: StepperProps) {
  //   const { value } = nextProps;

  //   if ('value' in nextProps) {
  //     return {
  //       inputValue: value,
  //     };
  //   }
  //   return null;
  // }

  static defaultProps = {
    min: 1,
    max: undefined,
    step: 1,
    disabled: undefined,
    inputWidth: 56,
    buttonSize: 28,
    buttonclassName: '',
    onChange: undefined,
    onFocus: undefined,
    onBlur: undefined,
    onPlus: undefined,
    onMinus: undefined,
  }

  constructor(props: StepperProps) {
    super(props)
    const { min, max, step } = props
    const defaultValue = `${props.value || props.min || 1}`
    this.state = {
      inputValue: defaultValue,
      minusDisable:
        +defaultValue <= 0 || +defaultValue <= (min as number) || +defaultValue - (step as number) < (min as number),
      plusDisable: max !== undefined ? +defaultValue >= max || +defaultValue + (step as number) > max : false,
      singleKey: Math.random().toFixed(16).slice(2, 10),
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.inputValue !== this.state.inputValue ||
      this.props.max !== prevProps.max ||
      this.props.min !== prevProps.min
    ) {
      const { min, max, step } = this.props
      const intValue = +this.state.inputValue

      this.setState({
        minusDisable: intValue <= 0 || intValue <= (min as number) || intValue - (step as number) < (min as number),
        plusDisable: max !== undefined ? intValue >= max || intValue + (step as number) > max : false,
      })
    }

    if (prevProps.value !== this.props.value) {
      this.setState({ inputValue: `${this.props.value}` })
    }
  }

  triggerChange = (next: string | number) => {
    const { onChange, value } = this.props
    if (onChange && next !== value) {
      onChange(next)
    }
  }

  handleInputChange = (text: string) => {
    const { inputValue } = this.state
    const { min, max } = this.props
    const reg = /^\d*([.]?\d{0,3})$/
    let numberTxt = +text

    if (reg.test(text)) {
      if (min !== undefined && numberTxt < min) {
        numberTxt = min
      }
      if (max !== undefined && numberTxt > max) {
        numberTxt = max
      }
      this.setState({ inputValue: text })
      this.triggerChange(text)
      return text
    }
    this.setState({ inputValue: `${inputValue}` })
    this.triggerChange(+inputValue)
    return `${inputValue}`
  }

  handleMinus = (e: ITouchEvent) => {
    e.stopPropagation()
    const { minusDisable, inputValue } = this.state
    const { min, step, onMinus } = this.props

    if (minusDisable) {
      return
    }
    // 数量保留三位小数
    const next = roundFractional(+inputValue - (step as number), 3)
    if (next < 0 || next < (min as number)) {
      return
    }

    this.triggerChange(next)
    this.setState({ inputValue: `${next}` })
    if (onMinus) {
      onMinus(next)
    }
  }

  handlePlus = (e: ITouchEvent) => {
    e.stopPropagation()
    const { plusDisable, inputValue } = this.state
    const { min, max, step, onPlus } = this.props

    if (plusDisable) {
      return
    }
    // 数量保留三位小数
    const sum = roundFractional(+inputValue + (step as number), 3)
    // 如果 下一个值 小于 min 的话，直接赋值成 min，往往发生在第一次点击 + 号
    const next = sum >= (min as number) ? sum : (min as number)
    if (max !== undefined && next > max) {
      return
    }
    this.triggerChange(next)
    this.setState({ inputValue: `${next}` })
    if (onPlus) {
      onPlus(next)
    }
  }

  handleBlur = () => {
    const { min = 1, max, onBlur } = this.props
    const numberVal = +parseFloat(`${+this.state.inputValue}`).toFixed(3)
    const finalMin = Math.max(numberVal, min)
    const next = max !== undefined ? Math.min(finalMin, max) : finalMin
    onBlur?.(next)

    // 这里重新set 一个key然后元素重新渲染
    // 不然在微信小程序看不到最新的值
    this.setState({
      singleKey: Math.random().toFixed(16).slice(2, 10),
      inputValue: `${next}`,
    })
    this.triggerChange(next)
  }

  handleFocus = () => {
    if (this.props.onFocus) {
      this.props.onFocus()
    }
  }

  render() {
    const { inputValue, minusDisable, plusDisable, singleKey } = this.state
    const { buttonClassName, buttonSize, inputWidth, disabled } = this.props

    return (
      <View className="stepper">
        <View
          className={classNames(['stepper-minus', buttonClassName])}
          style={{
            width: pxTransform(buttonSize),
            height: pxTransform(buttonSize),
          }}
          onClick={this.handleMinus}
        >
          <Icons name="Minus" size={18} color={!disabled && !minusDisable ? '#303133' : '#C8C9CC'} />
        </View>
        <View
          className="stepper-input"
          style={{
            width: pxTransform(inputWidth),
          }}
        >
          <Input
            type="digit"
            value={`${inputValue}`}
            onChange={this.handleInputChange}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            editable={!disabled}
            border={false}
            key={`key-${singleKey}`}
          />
        </View>
        <View
          className={classNames(['stepper-plus', buttonClassName])}
          style={{
            width: pxTransform(buttonSize),
            height: pxTransform(buttonSize),
          }}
          onClick={this.handlePlus}
        >
          <Icons name="Plus" size={18} color={!disabled && !plusDisable ? '#303133' : '#C8C9CC'} />
        </View>
      </View>
    )
  }
}

export default StepperPro

import React, { useMemo } from 'react'
import { Input, InputProps } from 'antd'
import styles from './index.less'

type InputType = 'number' | 'text' | 'password' | 'email' | 'search'

type Props = {
  /**
   * 输入框的值
   */
  inputValue: string
  /**
   * 输入框的值变化事件
   */
  onChange?: (e) => void
  /**
   * 是否禁用状态
   */
  disabled: boolean
  /**
   * 输入框ref
   */
  inputRef: any
  /**
   * 输入框上面层级的div点击事件
   */
  onClick: (e) => void
  /**
   * 输入框提示信息
   */
  placeholder?: string
  /**
   * 是否只读
   */
  readOnly?: boolean
  /**
   * 是否支持点击
   */
  handleClick?: boolean
  /**
   * 输入框是否有边框
   */
  bordered?: boolean
  /**
   * 输入框左侧内容插槽
   */
  prefix?: React.ReactNode | string
  /**
   * 单行还是多行的输入框
   */
  inputType?: 'Input' | 'Textarea'
  /**
   * 输入框类型
   */
  type?: Extract<InputProps['type'], keyof InputType>
}

const Recipient: React.FC<Props> = ({
  inputValue = '',
  onChange,
  disabled = false,
  inputRef,
  onClick,
  placeholder,
  readOnly = false,
  handleClick = false,
  prefix,
  bordered = false,
  inputType = 'Input',
  type = 'text',
}) => {
  const editInput = useMemo(() => {
    return inputValue ? { value: inputValue } : { defaultValue: inputValue }
  }, [inputValue])

  return (
    <>
      {!!handleClick && !disabled && <div className={styles.recipient} onClick={onClick}></div>}
      {!!readOnly ? (
        <span>{inputValue}</span>
      ) : inputType === 'Textarea' ? (
        <Input.TextArea
          ref={inputRef}
          placeholder={placeholder}
          type={type}
          {...editInput}
          onPressEnter={onChange}
          disabled={disabled}
          bordered={bordered}
        />
      ) : (
        <Input
          ref={inputRef}
          placeholder={placeholder}
          type={type}
          {...editInput}
          onChange={onChange}
          onPressEnter={onChange}
          onBlur={onChange}
          disabled={disabled}
          prefix={prefix}
          bordered={bordered}
        />
      )}
    </>
  )
}
export default Recipient

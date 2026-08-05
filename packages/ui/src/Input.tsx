import { Input as AntdInput, InputProps as AntdInputProps } from 'antd'
import classnames from 'classnames'
import { forwardRef } from 'react'
import { BaseFormFieldProp } from './types'
import { useFormContext } from './Form/context'

interface MergeInputProps extends AntdInputProps, BaseFormFieldProp {}

export interface SearchProps extends MergeInputProps {
  inputPrefixCls?: string
  onSearch?: (
    value: string,
    event?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>,
  ) => void
  enterButton?: React.ReactNode
  loading?: boolean
}

export interface InputProps extends MergeInputProps {
  /**
   * 是否将输入框内容居中
   */
  center?: boolean

  ref?: any
}

interface InputComponent extends React.ForwardRefExoticComponent<InputProps & React.RefAttributes<MergeInputProps>> {
  Group: typeof AntdInput.Group
  Search: typeof AntdInput.Search
  TextArea: typeof AntdInput.TextArea
  Password: typeof AntdInput.Password
}

const Input = forwardRef((props: InputProps, ref: any) => {
  const { className, center, ...resetProps } = props
  const { preview } = useFormContext(props)
  const mixinClass = classnames('ui-input', center && 'center', className)

  return preview ? <span>{resetProps.value}</span> : <AntdInput className={mixinClass} ref={ref} {...resetProps} />
}) as InputComponent

const Password = (props: AntdInputProps) => {
  return <AntdInput.Password className="ui-input-password" {...props} />
}

const Search = (props: SearchProps) => {
  return <AntdInput.Search className="ui-input-search" {...props} />
}

Input.Group = AntdInput.Group
Input.Search = Search as typeof AntdInput.Search
Input.TextArea = AntdInput.TextArea
Input.Password = Password as typeof AntdInput.Password

export default Input

import { Radio as AntdRadio, RadioGroupProps as AntdRadioGroupProps, RadioProps as AntdRadioProps, Space } from 'antd'
import classnames from 'classnames'
import { CSSProperties, ReactNode, useMemo } from 'react'
import { useControllableValue, useMemoizedFn, useToggle } from '../../hooks'
import { EditIcon } from '@linkseeks/icons'
export interface RadioProps extends AntdRadioGroupProps {}

export interface RadioCardGroupProps {
  options: RadioCardProps[]
  value: any
  onChange(value: any): void
  containerStyle?: CSSProperties
}

export interface RadioCardProps extends AntdRadioProps {
  title: ReactNode
  desc?: ReactNode
  extra?: ReactNode
  onChange?(value: any)
}
export const RadioGroup = (props: RadioProps) => {
  return <AntdRadio.Group {...props} className={classnames('ui-radio-group', props.className)} />
}

/**
 * 卡片式的单选组合
 * 常用于地址选择，发票选择等
 */
export const RadioCardGroup = (props: RadioCardGroupProps) => {
  const { options, containerStyle } = props
  const [state, setState] = useControllableValue(props)

  const handleChange = (value) => {
    setState(value)
  }
  return (
    <Space direction="vertical" style={containerStyle}>
      {options.map((v) => (
        <RadioCard {...v} key={v.value} checked={state === v.value} onChange={handleChange} />
      ))}
    </Space>
  )
}

export const RadioCard = (props: RadioCardProps) => {
  const { extra, title, desc, value, onChange } = props
  const [state, setState] = useControllableValue(props, {
    valuePropName: 'checked',
  })

  const handleClickRadio = useMemoizedFn(() => {
    setState(value)
  })

  return (
    <div className={classnames('ui-radio-card-container', state && 'checked')} onClick={handleClickRadio}>
      <AntdRadio checked={state} />
      <div className={classnames('ui-radio-card-content')}>
        <div>
          <div className="ui-radio-card-title">{title}</div>
          <div className="ui-radio-card-desc">{desc}</div>
        </div>
        <div>{extra}</div>
      </div>
    </div>
  )
}
export default RadioGroup

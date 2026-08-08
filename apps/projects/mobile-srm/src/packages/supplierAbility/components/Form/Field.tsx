import React from 'react'
import { View } from '@apps/mobile-ui'
import type { FieldContextValues } from './FieldContext'
import FieldContext from './FieldContext'
import type { FieldEntity } from './typings'
import { defaultGetValueFromEvent } from './utils/valueUtil'
import './index.scss'

export interface FieldProps {
  name?: string
  label?: string
  initialValue?: any
  children?: React.ReactElement
  valuePropName?: string
  trigger?: string
  getValueFromEvent?: (...args: any[]) => any
  fieldContext: FieldContextValues
  /**
   * label宽度，默认 84
   */
  labelWidth?: number | string
  /**
   * 自定义Field content样式
   */
  customContentStyle?: React.CSSProperties
  /**
   * 描述内容
   */
  description?: React.ReactNode
}

type ChildProps = Record<string, any>

export interface FieldState {
  resetCount: number
}

class Field extends React.Component<FieldProps, FieldState> implements FieldEntity {
  private mounted = false

  public state = {
    resetCount: 0,
  }

  constructor(props: FieldProps) {
    super(props)
    const { getInternalHooks } = props.fieldContext
    getInternalHooks().initEntityValue(this)
  }

  public componentDidMount() {
    this.mounted = true
    const { getInternalHooks } = this.props.fieldContext
    getInternalHooks().registerField(this)
  }

  public onStoreChange: FieldEntity['onStoreChange'] = (preStore, namePathList, info) => {
    const { store } = info
    const prevValue = preStore[this.props.name!]
    const curValue = store[this.props.name!]
    const nameMatch = namePathList && namePathList.includes(this.props.name!)

    switch (info.type) {
      case 'reset':
        if (!namePathList || nameMatch) {
          this.refresh()
        }
        break
      default:
        if (nameMatch || prevValue !== curValue) {
          this.reRender()
          return
        }
        break
    }
  }

  public refresh = () => {
    if (!this.mounted) return
    this.setState(({ resetCount }) => ({
      resetCount: resetCount + 1,
    }))
  }

  public reRender() {
    if (!this.mounted) return
    this.forceUpdate()
  }

  public getControlled = (childProps: ChildProps = {}) => {
    const { fieldContext, name, valuePropName = 'value', getValueFromEvent, trigger = 'onChange' } = this.props
    const value = name ? this.props.fieldContext.getFieldValue(name) : undefined
    const mergedGetValueProps = (val: any) => ({ [valuePropName]: val })

    const control = {
      ...childProps,
      ...mergedGetValueProps(value),
    }

    const originTriggerFunc: any = childProps[trigger]

    control[trigger] = (...args: any[]) => {
      let newValue: any
      if (getValueFromEvent) {
        newValue = getValueFromEvent(...args)
      } else {
        newValue = defaultGetValueFromEvent(valuePropName, ...args)
      }
      fieldContext?.getInternalHooks().updateValue(name, newValue)
      if (originTriggerFunc) {
        originTriggerFunc(...args)
      }
    }

    return control
  }

  public render() {
    const { resetCount } = this.state
    const { children, customContentStyle } = this.props

    let returnChildNode: React.ReactNode
    // TODO 未处理children为function的情况
    if (React.isValidElement(children)) {
      returnChildNode = React.cloneElement(children, this.getControlled(children.props))
    } else {
      returnChildNode = children
    }
    return (
      <View className="form-item-control" key={resetCount} style={customContentStyle}>
        {returnChildNode}
      </View>
    )
  }
}

function WrapperField(props: Omit<FieldProps, 'fieldContext'>) {
  const { labelWidth = 94, description } = props
  const fieldContext = React.useContext(FieldContext)
  return (
    <View className="form-item">
      <View className="form-item-content">
        {props.label ? (
          <View className="form-item-label" style={{ width: labelWidth }}>
            {props.label}
          </View>
        ) : null}
        <Field {...props} fieldContext={fieldContext} />
      </View>
      {description ? <View className="form-item-description">{description}</View> : null}
    </View>
  )
}

export default WrapperField

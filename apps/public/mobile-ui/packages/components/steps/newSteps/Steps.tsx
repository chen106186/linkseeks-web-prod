import React, { FC } from 'react'
import { StepsProps, StepProps } from './types'
import classnames from 'classnames'
import { Text, View, MovableArea, MovableView } from '@tarojs/components'
import { Step } from './Step'
const defaultProps: StepsProps = {
  current: 0,
  direction: 'horizontal',
}

const rootClassPrefix = 'mobile-steps'
const rootClassStepPrefix = 'mobile-step'

const defaultIcon = <View className={`${rootClassStepPrefix}-icon-dot`} />

export const Steps: FC<StepsProps> & { Step: FC<StepProps> } = (props) => {
  const { direction, current } = Object.assign(defaultProps, props)

  const rootClassName = classnames(rootClassPrefix, `${rootClassPrefix}-${direction}`)

  return (
    <View className={rootClassName}>
      {React.Children.map(props.children, (child, index) => {
        if (!React.isValidElement<StepProps>(child)) {
          return child
        }

        const childProps = child.props
        let status = childProps.status || 'wait'

        if (index < current!) {
          status = childProps.status || 'finish'
        } else if (index === current) {
          status = childProps.status || 'process'
        }

        const icon = childProps.icon ?? defaultIcon

        return React.cloneElement(child, {
          status,
          icon,
        })
      })}
    </View>
  )
}

Steps.Step = Step

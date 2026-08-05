import React, { forwardRef, useImperativeHandle, useState, memo } from 'react'
import cs from 'classnames'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'

export type FlowChartOptionsType = {
  label: string
  value: string | number
  other?: any
}

export type RefHandleType = {
  setActive: (value: string | number) => void
}

type PropsType = {
  children?: React.ReactNode
  options?: FlowChartOptionsType[]
  onChange?: (value: string | number, item?: any) => void
  fieldNames?: { label?: string; value?: string }
}

type ItemPropsType = {
  type?: 'start' | 'step' | 'end'
  children?: React.ReactNode
  onClick?: (value?: string | number) => void
  active?: boolean
  value?: string | number
}

const FlowChart = (
  { children, options, onChange, fieldNames = { label: 'label', value: 'value' } }: PropsType,
  ref,
) => {
  const intl = useIntl()
  const [activeValue, setActiveValue] = useState<string | number>()

  const onItemChange = (value: string | number, item?: any) => {
    setActiveValue(value)
    onChange?.(value, item)
  }

  useImperativeHandle(ref, () => ({
    setActive: (value: string | number) => {
      setActiveValue(value)
    },
  }))

  return (
    <div className={styles['config-box']}>
      <FlowChartItem type="start">{intl.formatMessage({ id: 'common.start', defaultMessage: '开始' })}</FlowChartItem>
      {options
        ? options.map((item) => (
            <FlowChartItem
              key={item[fieldNames.value]}
              active={item[fieldNames.value] === activeValue}
              onClick={() => {
                onItemChange?.(item[fieldNames.value], item)
              }}
            >
              {item[fieldNames.label]}
            </FlowChartItem>
          ))
        : children &&
          React.Children.map(children, (child: any) => {
            return React.cloneElement(child, {
              active: child.props.value === activeValue,
              onClick: (value) => {
                onItemChange?.(value)
              },
            })
          })}
      <FlowChartItem type="end">{intl.formatMessage({ id: 'common.end', defaultMessage: '结束' })}</FlowChartItem>
    </div>
  )
}

const FlowChartItem = ({ children, type = 'step', active, onClick, value }: ItemPropsType) => {
  return (
    <div className={styles['item-box']}>
      <div className={cs(styles[type], active && styles['active'])} onClick={() => onClick?.(value)}>
        {children}
      </div>
      {type !== 'end' && <div className={styles['arrow']}></div>}
    </div>
  )
}

type MemoRefFlowChartType = React.MemoExoticComponent<
  React.ForwardRefExoticComponent<PropsType & React.RefAttributes<unknown>>
> & { Item?: typeof FlowChartItem }

const MemoRefFlowChart: MemoRefFlowChartType = memo(forwardRef(FlowChart))

MemoRefFlowChart.Item = FlowChartItem

export default MemoRefFlowChart

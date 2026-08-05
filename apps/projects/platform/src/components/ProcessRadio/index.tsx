import React, { memo, useState, useEffect, useRef } from 'react';
import { Radio, RadioGroupProps } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import styles from './index.less';

type tagColorConfigType = Array<{ type: number, color: 'red' | 'orange' | 'default' }>

export interface ProcessRadioPropsType extends RadioGroupProps {
  dataSource?: any[]
  processKey?: string
  defaultCount?: number
  onValueChange?: (value: any, item?: any, lastValue?: any) => void
  tagColorConfig?: tagColorConfigType
}

const getTagColor = (type?: number, tagColorConfig?: tagColorConfigType) => {
  const color = tagColorConfig?.find(i => i.type === type)?.color || 'default'
  return color
}

const ProcessRadio = (props: ProcessRadioPropsType) => {

  const { dataSource = [], processKey = 'baseProcessId', defaultCount = 5, value, onValueChange, tagColorConfig, ...rest } = props;
  const [showMore, setShowMore] = useState<boolean>(false)

  const lastValueRef = useRef<any>()

  const optionsSource = showMore ? dataSource : dataSource.slice(0, defaultCount)

  useEffect(() => {
    if (value && dataSource.length) {
      const item = dataSource.find(i => i[processKey] === value) || {}
      onValueChange?.(value, item, lastValueRef.current)
      lastValueRef.current = value
    }
  }, [value, dataSource])

  return (
    <div className={styles['select-box']}>
      <Radio.Group value={value} {...rest}>
        {optionsSource?.map(_item => (
          <Radio key={_item[processKey]} value={_item[processKey]}>
            <div className={styles['box']}>
              <div className={styles['box-clerk']}>
                <div className={styles['box-clerk-name']}>{_item.processName}</div>
                <div className={styles['box-clerk-value']}>{_item.description}</div>
              </div>
              <div className={styles['box-tag']}>
                {_item.processTypeName && <span className={styles[getTagColor(_item.processType, tagColorConfig)]}>{_item.processTypeName}</span>}
              </div>
            </div>
          </Radio>
        ))}
      </Radio.Group>
      {
        dataSource.length > defaultCount && (
          <div
            className={styles['more']}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? '收起 ' : `展开更多（${dataSource.length - defaultCount}）`}
            {showMore ? <CaretUpOutlined color='#00A98F' /> : <CaretDownOutlined color='#00A98F' />}
          </div>
        )
      }
    </div>
  )
}
export default memo(ProcessRadio)

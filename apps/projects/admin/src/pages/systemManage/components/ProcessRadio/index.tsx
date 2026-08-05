import React, { memo, useState } from 'react'
import { Radio, RadioGroupProps } from 'antd'
import styles from './index.less'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'

interface PropsType extends RadioGroupProps {
  dataSource?: any[]
  processKey?: string
  defaultCount?: number
}

const ProcessRadio = (props: PropsType) => {
  const { dataSource = [], processKey = 'baseProcessId', defaultCount = 5, ...rest } = props
  const [showMore, setShowMore] = useState<boolean>(false)

  const optionsSource = showMore ? dataSource : dataSource.slice(0, defaultCount)

  return (
    <div className={styles['select-box']}>
      <Radio.Group {...rest}>
        {optionsSource?.map((_item) => (
          <Radio key={_item[processKey]} value={_item[processKey]}>
            <div className={styles['box']}>
              <div className={styles['box-clerk']}>
                <div className={styles['box-clerk-name']}>{_item.processName}</div>
                <div className={styles['box-clerk-value']}>{_item.description}</div>
              </div>
              <div className={styles['box-tag']}>
                {_item.processTypeName && <span className={styles['tag']}>{_item.processTypeName}</span>}
              </div>
            </div>
          </Radio>
        ))}
      </Radio.Group>
      {dataSource.length > defaultCount && (
        <div className={styles['more']} onClick={() => setShowMore(!showMore)}>
          {showMore ? '收起 ' : `展开更多（${dataSource.length - defaultCount}）`}
          {showMore ? <CaretUpOutlined color="#00A98F" /> : <CaretDownOutlined color="#00A98F" />}
        </div>
      )}
    </div>
  )
}
export default memo(ProcessRadio)

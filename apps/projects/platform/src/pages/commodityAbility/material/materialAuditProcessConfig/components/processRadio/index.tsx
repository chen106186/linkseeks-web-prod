import StatusTag from '@/components/StatusTag'
import { Radio } from 'antd'
import React, { useState } from 'react'
import styles from './index.less'
import className from 'classnames'
import { CaretDownOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'

type EnumType = {
  baseProcessId: number
  processName: string
  processType: string | number
  processTypeName: string
  description: string
}

interface Iprops {
  props: {
    enum: EnumType[]
  }
  value: number | string
  editable: boolean
  mutators: {
    change: (id: string | number) => void
  }
}

/**
 * 选择物料流程
 * @returns
 */
const PAGE_SIZE = 6

const ProcessRadio: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const intl = useIntl()
  const { value, editable, mutators } = props
  const [page, setPage] = useState<number>(1)
  const options = props.props?.enum
  const dataSource = options.slice(0, page * PAGE_SIZE)
  const hasMore = dataSource.length < options.length

  const onChange = (_item: EnumType) => {
    if (!editable) {
      return
    }
    mutators.change(_item.baseProcessId)
  }

  const handleLoadMore = () => {
    setPage(page + 1)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.container}>
        {dataSource.map((_item) => {
          return (
            <div className={styles.item} key={_item.baseProcessId}>
              <div
                className={className(styles.itemContainer, { [styles.active]: _item.baseProcessId === value })}
                key={_item.baseProcessId}
                onClick={() => onChange(_item)}
              >
                {editable && <Radio checked={_item.baseProcessId === value} />}
                <div className={styles.section}>
                  <div className={styles.info}>
                    <span>{_item.processName}</span>
                    <StatusTag type={'primary'} title={_item.processTypeName} />
                  </div>
                  <span className={styles.description}>{_item.description}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {(hasMore && (
        <div className={styles.more} onClick={handleLoadMore}>
          {intl.formatMessage({ id: 'material.rules.loadMore', defaultMessage: '加载更多' })}
          <CaretDownOutlined />
        </div>
      )) ||
        null}
    </div>
  )
}

ProcessRadio.isFieldComponent = true

export default ProcessRadio

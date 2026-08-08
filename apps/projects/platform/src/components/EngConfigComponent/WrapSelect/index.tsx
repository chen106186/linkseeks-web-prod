import React, { memo } from 'react'
import styles from './index.less'
import { LinkOutlined, CloseOutlined } from '@ant-design/icons'
import cs from 'classnames'
import { Tooltip } from 'antd'
import { useIntl } from '@linkseeks/i18n'

interface PropsType {
  onIconClick?: (isSeeMore?: boolean) => void
  onItemClick?: (a: any) => void
  onItemDelete?: (a: any) => void
  data?: any[]
  labelKey?: string
  valueKey?: string
  placeholder?: string
  disabled?: boolean
  tips?: string
  showCount?: number
}

const WrapSelect = (props: PropsType) => {
  const intl = useIntl()
  const {
    onIconClick,
    onItemClick,
    onItemDelete,
    data = [],
    labelKey = 'name',
    valueKey = 'id',
    placeholder = intl.formatMessage({ id: 'common.select', defaultMessage: '请选择' }),
    disabled,
    tips,
    showCount = 3,
  } = props

  return (
    <div className={styles['wrap-select']}>
      <div className={styles['content-box']}>
        {!!data.length ? (
          <>
            {data.map(
              (item, index) =>
                index < showCount && (
                  <div
                    key={item[valueKey]}
                    className={styles['content-item']}
                    onClick={() => {
                      !disabled && onItemClick?.(item[valueKey])
                    }}
                  >
                    {item[labelKey]}
                    {!disabled && (
                      <CloseOutlined
                        style={{ fontSize: 12, marginLeft: 8 }}
                        onClick={() => {
                          onItemDelete?.(item[valueKey])
                        }}
                      />
                    )}
                  </div>
                ),
            )}
            {data.length > showCount && (
              <div
                className={styles['content-item']}
                onClick={() => {
                  onIconClick?.(true)
                }}
              >
                {intl.formatMessage({ id: 'common.text.more', defaultMessage: '更多' })}({data.length - showCount})
              </div>
            )}
          </>
        ) : (
          <div className={styles['content-placeholder']}>{placeholder}</div>
        )}
        <Tooltip title={tips}>
          <div
            className={cs(styles['icon-box'])}
            onClick={() => {
              onIconClick?.()
            }}
          >
            <LinkOutlined style={{ fontSize: 16, color: '#FFF' }} />
          </div>
        </Tooltip>
      </div>
    </div>
  )
}

export default memo(WrapSelect)

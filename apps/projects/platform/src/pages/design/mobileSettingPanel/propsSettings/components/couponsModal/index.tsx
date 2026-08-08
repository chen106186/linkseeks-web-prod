import React, { useEffect } from 'react'
import { Input } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { changeProps, changeStylesByKey, getComponentKey, PageConfigType } from '@apps/design-core'

import styles from './index.less'

interface CouponsModalProps {
  // 自定title
  title?: string
  // 当前选中组件的key
  selectedKey?: any
  pageConfig: PageConfigType
}

const CouponsModal: React.FC<CouponsModalProps> = (props: CouponsModalProps) => {
  const { title, selectedKey, pageConfig } = props
  const intl = useIntl()

  useEffect(() => {
    const key = getComponentKey('CouponsModal', pageConfig)
    if (key) {
      changeStylesByKey({
        key,
        style: {
          display: 'block',
        },
      })
      return () => {
        changeStylesByKey({
          key,
          style: {
            display: 'none',
          },
        })
      }
    }
  }, [])

  const _onChangeTitle = (e: any) => {
    const _val = e.target.value
    changeProps({
      props: { title: _val },
    })
  }
  return (
    <div className={styles['couponsModal']}>
      <div className={styles['couponsModal-box']}>
        <div className={styles['couponsModal-box-label']}>
          {intl.formatMessage({ id: 'editor.setting.form.title' })}
        </div>
        <Input key={`${selectedKey}-title`} defaultValue={title} onBlur={_onChangeTitle} />
      </div>
    </div>
  )
}

export default CouponsModal

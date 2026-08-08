import cx from 'classnames'
import styles from './index.less'
import { useState } from 'react'
import { Popover } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { PlusFillIcon, EditCircleFillIcon } from '@linkseeks/icons'

export const wl_extraFn = (intl) => {
  const wl_extra = (hide?: boolean) => {
    const [before, setBefore] = useState(false)
    return !hide
      ? {
          before,
          extra: (
            <div>
              <span onClick={() => setBefore(true)} className={cx(styles.after_btn, !before ? styles.before_btn : '')}>
                {intl.formatMessage({ id: 'material.change.before', defaultMessage: '变更前' })}
              </span>
              <span onClick={() => setBefore(false)} className={cx(styles.after_btn, before ? styles.before_btn : '')}>
                {intl.formatMessage({ id: 'material.change.after', defaultMessage: '变更后' })}
              </span>
            </div>
          ),
        }
      : {
          noBeforeIcon: true,
        }
  }
  const changeVal: (oldVal, val) => 'change' | 'add' | 'del' | boolean = (oldVal, val) => {
    if (oldVal != val) {
      if (!val) {
        return 'del'
      } else if (!oldVal) {
        return 'add'
      } else {
        return 'change'
      }
    }
    return false
  }
  const get_urls = (initialValue, before) => {
    if (initialValue) {
      if (before === undefined) {
        return initialValue.urls
      }
      const old_urls = initialValue?.materielVersionResponse?.materiel?.urls
      if (before) {
        return old_urls
      }
      if (old_urls) {
        const new_urls = []
        const old_urls_ = [...old_urls]
        initialValue.urls.forEach((val, i) => {
          const old_i = old_urls_.findIndex((v) => v.url === val.url)
          if (old_i !== -1) {
            const old_item = old_urls_.splice(old_i, 1)[0]
            new_urls.push({
              ...val,
              old_url: old_item.description,
              desChange: changeVal(old_item.description, val.description),
            })
          } else {
            new_urls.push({ ...val, change: 'add' })
          }
          if (i === initialValue.urls.length - 1 && old_urls_.length) {
            old_urls_.forEach((e) => {
              new_urls.push({ ...e, change: 'del' })
            })
          }
        })
        return new_urls
      }
      return initialValue.urls?.map((val) => {
        return { ...val, change: 'add' }
      })
    }
    return []
  }
  return {
    wl_extra,
    changeVal,
    get_urls,
  }
}

export const changeIcon = (change, old_value?) => {
  return (
    <>
      {change === 'add' && (
        <Popover
          content={
            <div>
              <PlusFillIcon style={{ fontSize: '16px', color: '#00A98F' }} />
              当前为新增数据
            </div>
          }
        >
          <PlusFillIcon style={{ fontSize: '16px', color: '#00A98F' }} />
        </Popover>
      )}
      {change === 'del' && (
        <Popover
          content={
            <div>
              <ExclamationCircleFilled style={{ fontSize: '16px', color: '#E34D59' }} />
              当前数据已删除
            </div>
          }
        >
          <ExclamationCircleFilled style={{ fontSize: '16px', color: '#E34D59' }} />
        </Popover>
      )}
      {change === 'change' && old_value && (
        <Popover
          content={
            <>
              <div>
                <EditCircleFillIcon style={{ fontSize: '16px', color: '#4888F0' }} />
                数据已变更
              </div>
              <div style={{ color: '#5C626A', fontSize: 12, marginLeft: 16 }}>{old_value}</div>
            </>
          }
        >
          <EditCircleFillIcon style={{ fontSize: '16px', color: '#4888F0' }} />
        </Popover>
      )}
    </>
  )
}

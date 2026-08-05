import React, { useState, useEffect } from 'react'
import styles from './Tags.less'
import { CloseCircleOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'

const Tags = (props) => {
  const seletedTag = props.props['x-component-props']['seletedTag']
  const intl = getIntl()
  const editable = props.editable
  const [tags, setTags] = useState<number[]>([])

  useEffect(() => {
    if (seletedTag instanceof Array) {
      setTags(seletedTag)
    }
  }, [seletedTag])

  const handleItemSelect = (params) => {
    const { value } = params
    if (tags.includes(value)) {
      return
    }
    const onChange = props.props['x-component-props']['onChange']
    setTags((state) => {
      const current = state
      const res = [...current, value]
      !!onChange && onChange(res)
      return res
    })
  }

  const handleCancel = (params) => {
    const { value } = params
    const onChange = props.props['x-component-props']['onChange']
    setTags((state) => {
      const current = state
      const res = current.filter((item) => item !== value)
      !!onChange && onChange(res)
      return res
    })
  }

  const dataSource = props.props['x-component-props']['dataSource'] || []
  const selected = dataSource.filter((item) => tags.includes(item.value))

  return (
    <div className={styles.tagContainer}>
      <div className={styles.selection}>
        {selected.map((item) => {
          return (
            <div className={styles.selectionItem} key={item.value}>
              <span>{item.label}</span>
              {editable ? (
                <span className={styles.icon} onClick={() => handleCancel(item)}>
                  <CloseCircleOutlined />
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
      {editable ? (
        <>
          <p className={styles.tips}>{intl.formatMessage({ id: 'content.xuanze' })}</p>
          <div className={styles.tags}>
            {dataSource.map((item) => {
              return (
                <div className={styles.tagItem} key={item.value} onClick={() => handleItemSelect(item)}>
                  {item.label}
                </div>
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}

Tags.isFieldComponent = true

export default Tags

import React, { useState } from 'react'
import cx from 'classnames'
import { SelectedInfoType, changeProps } from '@apps/design-core'
import styles from './index.less'

interface StyleSettingsPropsType {
  selectedInfo: SelectedInfoType | undefined
}

const StyleSettings: React.FC<StyleSettingsPropsType> = ({ selectedInfo }) => {
  const { props: selectProps } = selectedInfo || {}
  const [selectKey, setSelectKey] = useState<number>(selectProps.styleTheme)

  /**
   * 更换样式模板
   * @param key
   */
  const handleChangeStyleTheme = (key: number) => {
    if (selectKey !== key) {
      setSelectKey(key)
      changeProps({
        props: Object.assign({ ...selectProps }, { styleTheme: key }),
      })
    }
  }

  return (
    <div className={styles.styleSettings}>
      <div className={styles.styleList}>
        {selectProps &&
          selectProps.stylesthemelist &&
          selectProps.stylesthemelist.map((item) => (
            <div
              className={cx(styles.styleItem, selectKey === item.key ? styles.active : {})}
              key={item.key}
              // style={{ width: item.width || 184, height: item.height || 138 }}
              onClick={() => handleChangeStyleTheme(item.key)}
            >
              <img
                className={styles.themeImg}
                src={item.img}
                title={item.key}
                style={{ width: item.width || 152, height: item.height || 105 }}
              />
            </div>
          ))}
      </div>
    </div>
  )
}

export default StyleSettings

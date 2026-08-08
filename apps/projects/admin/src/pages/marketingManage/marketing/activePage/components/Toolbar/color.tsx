import React, { useEffect, useState } from 'react'
import styles from './color.less'
import className from 'classnames'
import { SketchPicker } from 'react-color'
import { useHover } from '@linkseeks/hooks'

interface Iprops {
  /**
   * 当前背景颜色
   * 16进制， eg. #E80047
   */
  color?: string
  onChange?: ((hex: string) => void) | null
}

const Color: React.FC<Iprops> = (props: Iprops) => {
  const { onChange, color } = props
  const [activeColor, setActiveColor] = useState<string>('#E80047')
  const data = ['#E80047', '#9D27B1', '#FF6700', '#0493E2', '#00A98F', '#607E89'] as const

  const handleColorChange = ({ hex }) => {
    console.log(hex)
    setActiveColor(hex)
    onChange?.(hex)
  }

  useEffect(() => {
    if (!color) {
      return
    }

    setActiveColor(color)
  }, [color])

  return (
    <div className={styles.color}>
      {data.map((_item) => {
        return (
          <div
            key={_item}
            className={className({
              [styles['color-item-active']]: activeColor === _item,
            })}
          >
            <div
              onClick={() => handleColorChange({ hex: _item })}
              className={className(styles['color-item'])}
              style={{ background: _item }}
            ></div>
          </div>
        )
      })}
      <div className={styles['color-picker-container']}>
        <div className={styles['select-color']}>
          <div className={styles['active-color']} style={{ background: activeColor }}></div>
          <span className={styles['active-color-text']}>{activeColor}</span>
        </div>
        <div className={styles.picker}>
          <SketchPicker color={activeColor} onChangeComplete={handleColorChange} />
        </div>
      </div>
    </div>
  )
}

export default Color

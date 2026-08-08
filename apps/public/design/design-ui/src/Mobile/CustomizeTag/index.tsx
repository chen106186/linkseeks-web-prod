import React, { useMemo } from 'react'
import cx from 'classnames'
import styles from './index.less'

interface CustomizeTagProps {
  /**
   * @description       type
   * @default           default
   */
  type?:
    | 'danger'
    | 'primary'
    | 'success'
    | 'warn'
    | 'default'
    | 'purple'
    | 'main'
  /** icon 可以直接用 image src */
  icon?: string | React.ReactNode
  /** 双色调 / 单色调 */
  mode?: 'doubleColor' | 'monotone'
  border?: boolean
  /** 如果为双色调, backgrong, 和 color 有用 */
  background?: string
  color?: string
  children?: React.ReactNode
  /** label 内容，可以用children 替换 */
  name?: string
}

const CustomizeTag: React.FC<CustomizeTagProps> = (
  props: CustomizeTagProps,
) => {
  const {
    type,
    icon,
    children,
    border,
    mode,
    background,
    color,
    name = '',
  } = props
  const prefix = 'lingxi'

  const tagClassNames = cx(
    styles[`${prefix}-tag`],
    styles[`${prefix}-tag-${mode}-${type}`],
    {
      [styles.noBorder]: !border,
    },
  )

  const doubleColorStyle = useMemo(() => {
    if (mode === 'monotone') {
      return {}
    }
    /** 如果是双色调 并且 参数中有背景颜色，那么就用背景颜色 */
    if (background) {
      return {
        background,
        color,
        borderColor: background,
      }
    }
    /** 如果是双色调且包含type，那么就用type的颜色  */
    if (type) {
      return {}
    }
    /** 双色调 */
  }, [mode, background, color, type])

  return (
    <div className={tagClassNames} style={doubleColorStyle}>
      {(icon && (
        <div className={styles[`${prefix}-tag-icon`]}>
          {(typeof icon === 'string' && (
            <img src={icon} className={styles[`${prefix}-tag-icon-image`]} />
          )) ||
            icon}
        </div>
      )) ||
        null}
      <div className={styles[`${prefix}-tag-children`]}>
        <span>{children || name}</span>
      </div>
    </div>
  )
}

CustomizeTag.defaultProps = {
  icon: null,
  type: 'danger',
  border: true,
  mode: 'monotone',
  color: '#fff',
  // background: '#000'
}

export default CustomizeTag

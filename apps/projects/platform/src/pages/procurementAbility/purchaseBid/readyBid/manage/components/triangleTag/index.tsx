import React from 'react'

import styles from './index.less'

interface TriangleTagProps {
  text: string
  wrapStyle: React.CSSProperties
  bgcolor?: string
  direction?: string
}

const TriangleTag: React.FC<TriangleTagProps> = (props: any) => {
  const { text, bgcolor, direction, wrapStyle } = props
  const _returndirectionStyle = () => {
    if (direction === 'left') {
      return {
        borderColor: `transparent ${bgcolor} transparent transparent`,
        left: '-8px',
        top: '26%',
      }
    } else if (direction === 'right') {
      return {
        borderColor: `transparent ${bgcolor} transparent transparent`,
        transform: 'rotate(180deg)',
        right: '-8px',
        top: '26%',
      }
    }
  }
  return (
    <div className={styles.triangleTag} style={wrapStyle}>
      <div className={styles.directionTriangle} style={_returndirectionStyle()}></div>
      {text}
    </div>
  )
}

TriangleTag.defaultProps = {
  bgcolor: '#EA8000',
  direction: 'left',
}

export default TriangleTag

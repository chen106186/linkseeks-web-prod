import React, { useState, useEffect } from 'react'
import styles from './index.less'

export interface ImagePreviewProps {
  src: any // 图片src数组
  currentRef?: any
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ src, currentRef }) => {
  const [state, setState] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        toggle,
      }
    }
  }, [])
  const toggle = (index?: any) => {
    // 点击的索引
    if (index || index === 0) {
      setIndex(index)
    }
    setState(!state)
  }

  return (
    state && (
      <div className={styles.imgPreviewWrapper} onClick={toggle}>
        <img src={src[index]} className={styles.imgPreview} />
      </div>
    )
  )
}

ImagePreview.defaultProps = {}

export default ImagePreview

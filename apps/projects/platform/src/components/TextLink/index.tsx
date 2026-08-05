import React from 'react'
import styles from './index.less'

export interface TextLinkProps {
  url: string,
}
const TextLink:React.FC<any> = (props) => {
  return (
    <span className={styles.link}>
      {props.children}
    </span>
  )
}

export default TextLink
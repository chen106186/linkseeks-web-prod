import React from 'react'
import { Typography } from 'antd'

const { Link } = Typography

import ImIcon from '@/assets/icons/message_square.svg'
import styles from './index.less'

interface IMBtnProps {
  func: () => void
  btnStyle?: React.CSSProperties
}

const IMBtn: React.FC<IMBtnProps> = (props: any) => {
  const { func, btnStyle } = props
  return (
    <Link target="_blank" style={btnStyle}>
      <div className={styles.iMBtn} onClick={func}>
        <img src={ImIcon} alt="" />
      </div>
    </Link>
  )
}

IMBtn.defaultProps = {
  btnStyle: {
    marginLeft: '6px',
  },
}

export default IMBtn

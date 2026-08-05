import { Drawer } from 'antd'
import { useEffect, useState } from 'react'
import styles from './index.less'
import classNames from 'classnames'
import { FileOutlined } from '@ant-design/icons'
import type { ChangeItemType } from '../MemberChangedInfo'
interface Iprops {
  visible: boolean
  setVisible: (boolean) => void
  data: ChangeItemType
  isShowAfter?: boolean
  [keys: string]: any
}
const imgReg = /\.(png|jpg|gif|jpeg|webp)$/
const randerImg = (url) => {
  return (
    <div className={styles['img-item']}>
      <div
        className={classNames(styles['img-item-con'], {
          [styles['img-item-file']]: !imgReg.test(url),
        })}
      >
        {imgReg.test(url) ? (
          <img src={url} />
        ) : (
          <a href={url} target="__black">
            <FileOutlined style={{ fontSize: 36 }} />
          </a>
        )}
      </div>
    </div>
  )
}
const ImgChangeDrawer = (props: Iprops) => {
  const { visible, setVisible, data, isShowAfter = true, ...rest } = props
  const { lastValue, fieldValue, fieldLocalName } = data || {}
  const [showAfter, setShowAfter] = useState(true)
  useEffect(() => {
    setShowAfter(isShowAfter)
  }, [isShowAfter])
  const handleClose = () => {
    setVisible(false)
    // 重置默认tab
    setShowAfter(true)
  }
  return (
    <Drawer
      visible={visible}
      title={fieldLocalName}
      width="50%"
      onClose={() => {
        handleClose()
      }}
      bodyStyle={{ padding: '20px' }}
      {...rest}
    >
      <div className={styles['btn-switch']}>
        <span
          className={classNames(styles['btn-switch-item-none'], {
            [styles['btn-switch-item-active']]: !showAfter,
          })}
          onClick={() => {
            setShowAfter(false)
          }}
        >
          变更前
        </span>
        <span
          className={classNames(styles['btn-switch-item-none'], {
            [styles['btn-switch-item-active']]: showAfter,
          })}
          onClick={() => {
            setShowAfter(true)
          }}
        >
          变更后
        </span>
      </div>
      {randerImg(showAfter ? fieldValue : lastValue)}
    </Drawer>
  )
}
export default ImgChangeDrawer

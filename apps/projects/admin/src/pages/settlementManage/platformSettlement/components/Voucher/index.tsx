/*
 * @Author: Bill
 * @Date: 2020-10-21 16:05:03
 * @Description: 付款凭证
 */

import React from 'react'
import styles from './index.less'
import image_icon from '@/assets/image_icon.png'
// import Icon from '@ant-design/icons';
import { DeleteOutlined } from '@ant-design/icons'

interface VoucherFileProps {
  name: string
  proveUrl: string
}
interface Iprops {
  files: VoucherFileProps[]
  onRemove?: null | ((item) => void)
}

const Voucher: React.FC<Iprops> = (props) => {
  const { files = [] } = props

  const handleRemove = (item) => {
    !!props.onRemove && props.onRemove(item)
  }

  return (
    <>
      {files.map((item: VoucherFileProps, key: number) => {
        return (
          <div className={styles.container} key={key}>
            {/* <div></div>/ */}
            <div className={styles.image}>
              <img src={image_icon} className={styles.icon} />
            </div>
            <div className={styles.text}>
              <a href={item.proveUrl} target={'_blank'}>
                {item.name}
              </a>
            </div>
            {props.onRemove && (
              <div className={styles.view}>
                <a onClick={() => handleRemove(item)}>
                  <DeleteOutlined />
                </a>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

export default Voucher

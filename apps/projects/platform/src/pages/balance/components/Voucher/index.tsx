/*
 * @Author: Bill
 * @Date: 2020-10-21 16:05:03
 * @Description: 付款凭证
 */

import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'
import image_icon from '@/assets/imgs/image_icon.png'
import { VoucherFileProps } from '../../common/type'

interface Iprops {
  files: VoucherFileProps[]
  onRemove?: (item) => void
}

const Voucher: React.FC<Iprops> = (props) => {
  const { files = [] } = props
  const intl = useIntl()
  console.log(files)
  const handleRemove = (item) => {
    !!props.onRemove && props.onRemove(item)
  }
  return (
    <>
      {files?.map((item: VoucherFileProps, key: number) => {
        return (
          <div className={styles.container} key={key}>
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
                <a onClick={() => handleRemove(item)}>{intl.formatMessage({ id: 'balance.components.voucher' })}</a>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

export default Voucher

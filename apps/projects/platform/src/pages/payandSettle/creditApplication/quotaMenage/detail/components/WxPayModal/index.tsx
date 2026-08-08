/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-16 11:07:13
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-12-30 13:50:05
 * @Description: 微信支付弹窗
 */
import React, { useState, useEffect, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Modal, Upload } from 'antd'
import QRCode from 'qrcode'
import { priceFormat } from '@/utils/numberFomat'
import WechatIcon from '@/assets/imgs/wechat_icon.png'
import styles from './index.less'

interface WxPayModalProps {
  /**
   * 需要生成 二维码的 地址
   */
  url: string
  /**
   * 支付金额
   */
  price: number
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 弹窗取消事件
   */
  onCancel: () => void
  /**
   * 轮训查询支付结果事件
   */
  onCheckResult: () => Promise<{ success: Boolean }>
  /**
   * 轮训查询支付结果成功
   */
  onSuccess?: () => void
  /**
   * 轮训查询支付结果失败
   */
  onFail?: () => void
}

const WxPayModal: React.FC<WxPayModalProps> = ({ url, price, visible, onCancel, onCheckResult, onSuccess, onFail }) => {
  const intl = useIntl()
  const [qrCode, setQrCode] = useState<string>('')

  const getQRCode = async (params) => {
    if (!params) {
      return
    }
    // 生成二维码
    const res = await QRCode.toDataURL(params)
    setQrCode(res)
  }

  let timer = useRef(null)
  // 最多请求3600次，2000毫秒一次，二维码过期两小时
  let count = 0

  const handleCheckResult = () => {
    if (!onCheckResult) {
      return
    }
    count++
    if (count > 3600) {
      return
    }
    onCheckResult().then((res) => {
      if (!res.success) {
        timer.current = setTimeout(() => {
          handleCheckResult()
        }, 2000)
      } else {
        clearTimeout(timer.current)
        timer = null
        if (onSuccess) {
          onSuccess()
        }
      }
    })
  }

  useEffect(() => {
    getQRCode(url)
    if (url) {
      handleCheckResult()
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
        timer.current = null
      }
    }
  }, [url])

  useEffect(() => {
    if (!visible) {
      if (timer.current) {
        clearTimeout(timer.current)
        timer.current = null
      }
    }
  }, [visible])

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <Modal
      title={
        <div className={styles.common_title}>
          <div className={styles.common_title_icon}>
            <img src={WechatIcon} />
          </div>
          <span>
            {intl.formatMessage({
              id: 'payandSettle.creditApplication.quotaMenage.detail.components.wxPayModal.title',
            })}
          </span>
        </div>
      }
      width={576}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
      destroyOnClose
    >
      <div className={styles.wechat_payway}>
        <p className={styles.wechat_payway_title}>
          {intl.formatMessage({ id: 'payandSettle.creditApplication.quotaMenage.detail.components.wxPayModal.p' })}
        </p>
        <div className={styles.wechat_payway_imgbox}>{qrCode && <img src={qrCode} />}</div>
        <div className={styles.wechat_payway_needpay}>
          <label>
            {intl.formatMessage({
              id: 'payandSettle.creditApplication.quotaMenage.detail.components.wxPayModal.label.1',
            })}
          </label>
          <span>{priceFormat(price)}</span>
          <label>
            {intl.formatMessage({
              id: 'payandSettle.creditApplication.quotaMenage.detail.components.wxPayModal.label.2',
            })}
          </label>
        </div>
      </div>
    </Modal>
  )
}

export default WxPayModal

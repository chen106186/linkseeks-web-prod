import { getSettlementPlatformSettlementChannelList } from '@apps/apis'
import { message, Modal, Radio } from 'antd'
import React, { useState, useEffect, useCallback } from 'react'
import styles from './index.less'
import PayItem from './payItem'
import alipay_icon from '@/assets/icons/alipay_icon.png'
import balance_icon from '@/assets/icons/balance_icon.png'
import unionpay_icon from '@/assets/icons/unionpay_icon.png'
import wechat_icon from '@/assets/icons/wechat_icon.png'
import quicklypay_icon from '@/assets/icons/quicklypay_icon.png'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

interface Iprops {
  visible: boolean
  onConfirm: (params: { payChannel: number }) => void
  onClose: () => void
  confirmLoading: boolean
  /** 结算方信息 */
  balanceInfo: {
    /** 结算方名字 */
    name: string
    /** 结算金额 */
    amount: number
    payMethods: string
  }
}

const ICON_ENUM = {
  11: wechat_icon,
  12: alipay_icon,
  13: quicklypay_icon,
  14: unionpay_icon,
  15: balance_icon,
}

const OtherPayModal: React.FC<Iprops> = (props: Iprops) => {
  const { visible, balanceInfo, onConfirm, onClose, confirmLoading } = props
  const [payChannelOptions, setPayChannelOptions] = useState<{ label: string; value: number }[]>([])
  const [activeChannel, setActiveChannel] = useState<number | null>(null)
  const [flag, setFlag] = useState(0)

  const handleClose = () => {
    onClose?.()
  }

  const list = [
    {
      title: intl.formatMessage({ id: 'balance.jiesuanfang' }),
      value: balanceInfo?.name,
    },
    {
      title: intl.formatMessage({ id: 'balance.jiesuanjine' }),
      value: balanceInfo.amount,
    },
    {
      title: intl.formatMessage({ id: 'balance.zhifufangshi' }),
      value: balanceInfo.payMethods,
    },
  ]

  const getPayChannel = useCallback(async () => {
    // message.info("正在加载支付渠道")
    const { data, code } = await getSettlementPlatformSettlementChannelList()
    if (code === 1000) {
      setPayChannelOptions(
        data.map((_item) => ({
          label: _item.payChannelName,
          value: _item.payChannel,
          icon: ICON_ENUM[_item.payChannel] || '',
        })),
      )
    }
  }, [])

  useEffect(() => {
    if (!visible) {
      return
    }
    setFlag(0)
    getPayChannel()
  }, [visible])

  const handleRadioChange = (item: { value: number }) => {
    setActiveChannel(item.value)
  }

  const handleOnOk = () => {
    if (activeChannel === null) {
      message.error('请选择支付方式')
      return
    }
    setFlag(1)
    onConfirm?.({
      payChannel: activeChannel,
    })
  }

  return (
    <Modal
      width={548}
      title={intl.formatMessage({ id: 'balance.fukuan' })}
      onCancel={handleClose}
      maskClosable={false}
      visible={visible}
      okText={
        flag === 1
          ? intl.formatMessage({ id: 'balance.woyifukuan' })
          : intl.formatMessage({ id: 'balance.quedingfukuan' })
      }
      onOk={handleOnOk}
      confirmLoading={confirmLoading}
    >
      <div className={styles.wrapContainer}>
        {list.map((_item) => {
          return (
            <div className={styles.item} key={_item.title}>
              <span className={styles['item-title']}>{_item.title}</span>
              <span className={styles['item-value']}>{_item.value}</span>
            </div>
          )
        })}
        {/* <Radio.Group options={payChannelOptions} onChange={handleRadioChange} value={activeChannel} /> */}
      </div>
      <div className={styles.payChannel}>
        <div className={styles.title}>{intl.formatMessage({ id: 'balance.zhifuqudao' })}</div>
        <div className={styles.panChanneList}>
          {payChannelOptions.map((_item) => {
            return (
              <div className={styles.item} key={_item.value}>
                <PayItem {..._item} isActive={_item.value === activeChannel} onClick={handleRadioChange} />
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}

export default OtherPayModal

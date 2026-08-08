import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { message } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import alipayIcon from '@/assets/imgs/alipay_icon.png'
import wechatIcon from '@/assets/imgs/wechat_icon.png'
import bankIcon from '@/assets/imgs/bank_icon.png'
import blanceIcon from '@/assets/imgs/blance_icon.png'
import styles from './index.less'
import {
  GetPayCreditGetCreditResponse,
  // getPayCreditGetCredit,
  getPayCreditGetMemberCredit,
  GetPayEAccountAllInPayGetUserBalanceResponse,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { PayWayItemType } from '../types'
import { AgentPurchaseOrderInfoType } from '../../types'

export interface PayChannelType {
  payChannel: number
  payChannelName: string
}

export interface SeletePayWayItemType {
  fundMode: number
  payType: number
  payTypeName: string
  payChannel: number
  payChannelName: string
}

interface PayWayProps {
  visible: boolean
  buyerInfo: AgentPurchaseOrderInfoType
  payWayList: PayWayItemType[]
  onChange: (payway: SeletePayWayItemType) => void
  selectItem: any
  supplyMembersId: number
  supplyMembersRoleId: number
  deliveryType?: number
  balanceInfo?: GetPayEAccountAllInPayGetUserBalanceResponse
}

const PayWay: React.FC<PayWayProps> = (props) => {
  const {
    visible,
    payWayList = [],
    onChange,
    selectItem = {},
    supplyMembersId,
    deliveryType = 1,
    supplyMembersRoleId,
    balanceInfo,
    buyerInfo,
  } = props
  const intl = useIntl()
  const [expand, setExpand] = useState<boolean>(false)
  const [creditInfo, setCreditInfo] = useState<GetPayCreditGetCreditResponse>()

  const SHOW_PAYWAY_LENGTH = 3

  const handleSelectWay = (item: PayChannelType, payTypeName: string, payType: number, fundMode: number) => {
    if (item.payChannel === 6 || item.payChannel === 7) {
      if (!getCreditState(item)) {
        return
      }
    }
    onChange({
      payType,
      fundMode,
      payTypeName,
      ...item,
    })
  }

  useEffect(() => {
    if (visible) {
      fetchCreditInfo()
    }
  }, [visible])

  useEffect(() => {
    if (payWayList && payWayList.length === 1) {
      const payWayItem = payWayList[0]
      const payChannels = payWayItem.payChannels[0]
      onChange({
        fundMode: payWayItem.fundMode,
        payType: payWayItem.payType,
        payTypeName: payWayItem.payTypeName,
        payChannel: payChannels.payChannel,
        payChannelName: payChannels.payChannelName,
      })
    }
  }, [payWayList])

  const fetchCreditInfo = () => {
    const param: any = {
      memberId: buyerInfo.memberId,
      roleId: buyerInfo.roleId,
      parentMemberId: supplyMembersId,
      parentMemberRoleId: supplyMembersRoleId,
    }

    getPayCreditGetMemberCredit(param).then((res: any) => {
      if (res.code === 1000) {
        setCreditInfo(res.data)
      } else {
        message.destroy()
      }
    })
  }

  const getCreditState = (info: any): boolean => {
    let result = true
    // 判断支付方式是否授信支付
    if (info.payChannel === 6) {
      if (!creditInfo) {
        result = false
      } else if (creditInfo.isUsable === 0) {
        result = false
      }
    } else if (info.payChannel === 7) {
      // 判断如果是货到付款的方式，若物流方式不是物流配送，则不支持货到付款
      if (deliveryType !== 1) {
        result = false
      } else {
        result = true
      }
    }
    return result
  }

  return visible ? (
    <div className={styles.payway}>
      <div className={styles.common_title}>
        <span>{intl.formatMessage({ id: 'commodityDetail.index.PayType' })}</span>
      </div>
      {payWayList.map(
        (item, index: number) =>
          (!expand ? index < SHOW_PAYWAY_LENGTH : true) && (
            <div className={styles.payway_line} key={`payway_line_${index}`}>
              <div className={styles.payway_line_label}>{item.payTypeName}：</div>
              <ul className={styles.payway_pay_list}>
                {item.payChannels.map((childItem, childIndex: number) => (
                  <li
                    className={cx(
                      styles.payway_pay_list_item,
                      childItem.payChannel === selectItem.payChannel ? styles.active : '',
                      !getCreditState(childItem) ? styles.disabled : '',
                    )}
                    key={`payway_pay_list_item_${childIndex}`}
                    onClick={() => handleSelectWay(childItem, item.payTypeName, item.payType, item.fundMode)}
                  >
                    {(childItem.payChannel === 1 || childItem.payChannel === 12) && <img src={alipayIcon} />}
                    {(childItem.payChannel === 2 || childItem.payChannel === 11) && <img src={wechatIcon} />}
                    {(childItem.payChannel === 3 || childItem.payChannel === 13 || childItem.payChannel === 14) && (
                      <img src={bankIcon} />
                    )}
                    {(childItem.payChannel === 4 || childItem.payChannel === 15) && <img src={blanceIcon} />}
                    <span>{childItem.payChannelName}</span>
                    {childItem.payChannel === 15 && balanceInfo && <span>(¥{balanceInfo?.availableAmount})</span>}
                  </li>
                ))}
              </ul>
            </div>
          ),
      )}
      {payWayList && payWayList.length > SHOW_PAYWAY_LENGTH && (
        <div className={cx(styles.more_btn, styles.pad_l_100)} onClick={() => setExpand(!expand)}>
          <span>
            {expand
              ? intl.formatMessage({ id: 'order.index.payway.PutAway' })
              : intl.formatMessage({ id: 'order.index.payway.open' })}
          </span>
          <div className={styles.more_btn_icon}>
            <DownOutlined translate={undefined} rotate={expand ? 180 : 0} />
          </div>
        </div>
      )}
    </div>
  ) : null
}

export default PayWay

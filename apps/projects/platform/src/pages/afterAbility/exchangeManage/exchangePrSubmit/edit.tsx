/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-04 17:22:07
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:51:15
 * @Description:
 */
import React, { useState } from 'react'
import { Button, message } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { postAftersalesReplaceGoodsSubmitVerify } from '@apps/apis'
import { FormOutlined } from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'
import VerifyModal from '../../components/VerifyModal'

interface ReturnAddress {
  /**
   * 收货地址id
   */
  receiveId: number
  /**
   * 收货地址
   */
  receiveAddress: string
  /**
   * 收货者名称
   */
  receiveUserName: string
  /**
   * 收货者电话
   */
  receiveUserTel: string
}

interface ExchangeAddress {
  /**
   * 配送方式
   */
  deliveryType: number
  /**
   * 发货地址id
   */
  sendId: number
  /**
   * 发货地址
   */
  sendAddress: string
  /**
   * 发货者名称
   */
  sendUserName: string
  /**
   * 发货者电话
   */
  sendUserTel: string
}

const ExchangePrSubmitVerify: React.FC = () => {
  const { id } = usePageStatus()
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [exchangeAddress, setExchangeAddress] = useState<ExchangeAddress>(null)
  const [returnAddress, setReturnAddress] = useState<ReturnAddress>(null)

  const intl = useIntl()

  const handleSubmitVerify = (info, returnAddress, exchangeAddress) => {
    // 退货方式为 物流，并且退货收货地址为空时
    if (info.returnGoodsAddress.deliveryType === 1 && !returnAddress) {
      message.error(
        intl.formatMessage({
          id: 'afterService.apply.shippingAddress.refund.required',
          defaultMessage: '请选择退货收货地址',
        }),
      )
      return
    }
    if (!exchangeAddress) {
      message.error(
        intl.formatMessage({
          id: 'afterService.apply.shippingAddress.replace.required',
          defaultMessage: '请选择换货收货地址',
        }),
      )
      return
    }
    if (exchangeAddress && !exchangeAddress.deliveryType) {
      message.error(
        intl.formatMessage({
          id: 'afterService.apply.deliveryType-replace.required',
          defaultMessage: '请选择换货配送方式',
        }),
      )
      return
    }
    if (exchangeAddress && exchangeAddress.deliveryType === 1 && !exchangeAddress.id) {
      message.error(
        intl.formatMessage({
          id: 'afterService.apply.deliveryAddress.replace.required',
          defaultMessage: '请选择换货发货地址',
        }),
      )
      return
    }
    if (exchangeAddress && exchangeAddress.deliveryType === 2 && !exchangeAddress.id) {
      message.error(
        intl.formatMessage({
          id: 'afterService.apply.pickupAddress-replace.required',
          defaultMessage: '请选择换货自提地址',
        }),
      )
      return
    }
    if (returnAddress) {
      setReturnAddress({
        receiveId: returnAddress.id,
        receiveAddress: returnAddress.receiveAddress,
        receiveUserName: returnAddress.receiveUserName,
        receiveUserTel: returnAddress.receiveUserTel,
      })
    }
    if (exchangeAddress) {
      setExchangeAddress({
        deliveryType: exchangeAddress.deliveryType,
        sendId: exchangeAddress.id,
        sendAddress: exchangeAddress.sendAddress,
        sendUserName: exchangeAddress.sendUserName,
        sendUserTel: exchangeAddress.sendUserTel,
      })
    }
    setVisible(true)
  }

  const handleSubmit = (values) => {
    if (!id) {
      return
    }
    setConfirmLoading(true)
    postAftersalesReplaceGoodsSubmitVerify({
      applyId: id,
      ...values,
      ...(exchangeAddress || {}),
      ...(returnAddress || {}),
    })
      .then((res) => {
        if (res.code === 1000) {
          history.goBack()
        }
      })
      .finally(() => {
        setConfirmLoading(false)
      })
  }

  return (
    <>
      <DetailInfo
        id={id}
        target="/afterAbility/exchangeManage/exchangePrSubmit"
        headExtra={(info, returnAddress, exchangeAddress) => (
          <Button
            type="primary"
            icon={<FormOutlined />}
            onClick={() => handleSubmitVerify(info, returnAddress, exchangeAddress)}
          >
            {intl.formatMessage({ id: 'afterService.common.commitVerify', defaultMessage: '提交审核' })}
          </Button>
        )}
        isEditReturn
        isEditAddress
      />

      <VerifyModal
        visible={visible}
        confirmLoading={confirmLoading}
        onSubmit={handleSubmit}
        onVisible={() => setVisible(false)}
      />
    </>
  )
}

export default ExchangePrSubmitVerify

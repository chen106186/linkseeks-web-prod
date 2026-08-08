/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-04 17:22:07
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 20:08:18
 * @Description:
 */
import React, { useState } from 'react'
import { Button, message } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { FormOutlined } from '@ant-design/icons'
import { postAftersalesReturnGoodsSubmitVerify } from '@apps/apis'
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

const ReturnPrSubmitVerify: React.FC = () => {
  const { id } = usePageStatus()
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [returnAddress, setReturnAddress] = useState<ReturnAddress>(null)

  const intl = useIntl()

  const handleSubmit = (values) => {
    if (!id) {
      return
    }
    setConfirmLoading(true)
    postAftersalesReturnGoodsSubmitVerify({
      applyId: id,
      ...values,
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

  const handleSubmitVerify = (info, returnAddress, returnGoodsList) => {
    // 退货方式为 物流，并且退货收货地址为空时
    const isNeedReturn = returnGoodsList?.data?.some((item) => item?.isNeedReturn)
    if (isNeedReturn && info && info.returnGoodsAddress?.deliveryType === 1 && !returnAddress?.receiveAddress) {
      message.error(
        intl.formatMessage({
          id: 'afterService.apply.shippingAddress.refund.required',
          defaultMessage: '请选择退货收货地址',
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
    setVisible(true)
  }

  return (
    <>
      <DetailInfo
        id={id}
        target="/afterAbility/returnManage/returnPrSubmit"
        headExtra={(info, returnAddress, returnGoodsList) => (
          <Button
            type="primary"
            icon={<FormOutlined />}
            onClick={() => handleSubmitVerify(info, returnAddress, returnGoodsList)}
          >
            {intl.formatMessage({ id: 'afterService.common.commitVerify', defaultMessage: '提交审核' })}
          </Button>
        )}
        isEditAddress
        isEditReturn
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

export default ReturnPrSubmitVerify

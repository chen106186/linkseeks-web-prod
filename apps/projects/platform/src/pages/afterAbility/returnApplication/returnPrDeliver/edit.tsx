/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 20:02:54
 * @Description: 退货发货
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { postAftersalesReturnGoodsManualReturnDeliveryGoods } from '@apps/apis'
import { SettingOutlined } from '@ant-design/icons'
import moment from 'moment'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  RETURN_GOODS_MANUAL_DELIVERY,
  RETURN_GOODS_MANUAL_DELIVERY_CONTRACT,
  RETURN_GOODS_SIMPLE_PLATFORM,
} from '../../constants'
import DetailInfo from '../components/DetailInfo'
import ReturnDeliverDrawer, { ValuesType } from '../../components/DeliverDrawer'

const ReturnPrDeliverVerify: React.FC = () => {
  const { id } = usePageStatus()
  const [visible, setVisible] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const intl = useIntl()

  const handleSubmit = (values: ValuesType) => {
    if (!id) {
      return
    }
    const { productList, returnDeliverAddress, deliveryTime, logisticsNameTxt, logisticsOrderNo } = values
    setSubmitLoading(true)
    postAftersalesReturnGoodsManualReturnDeliveryGoods({
      returnId: +id,
      deliveryAddress: `${returnDeliverAddress.fullAddress} ${returnDeliverAddress.name}/${returnDeliverAddress.phone}`,
      productList: productList.map((item) => ({
        productId: item.productId,
        returnCount: +item.count,
        returnDetailId: item.detailId,
      })),
      deliveryTime: moment(deliveryTime).valueOf(),
      logisticsName: logisticsNameTxt,
      logisticsOrderNo,
    })
      .then((res) => {
        if (res.code === 1000) {
          handleVisibleDrawer(false)
          setTimeout(() => {
            history.goBack()
          }, 800)
        }
      })
      .finally(() => {
        setSubmitLoading(false)
      })
  }

  const handleVisibleDrawer = (flag) => {
    setVisible(!!flag)
  }

  return (
    <>
      <DetailInfo
        id={id}
        headExtra={(info) => (
          <>
            {info &&
              (info.taskType === RETURN_GOODS_MANUAL_DELIVERY ||
                info.taskType === RETURN_GOODS_MANUAL_DELIVERY_CONTRACT ||
                info.taskType === RETURN_GOODS_SIMPLE_PLATFORM) && (
                <Button type="default" icon={<SettingOutlined />} onClick={() => handleVisibleDrawer(true)}>
                  {intl.formatMessage({
                    id: 'returnApplication.returnPrDeliver.allRefund.deliver',
                    defaultMessage: '退货发货',
                  })}
                </Button>
              )}

            <ReturnDeliverDrawer
              afterType={3}
              flowType="returnDeliver"
              value={{
                productList: info?.goodsDetailList
                  .filter((item) => item.isNeedReturn && item.noDeliveryCount > 0)
                  .map((item) => ({
                    orderNo: item.orderNo,
                    productId: item.productId,
                    productName: item.productName,
                    category: item.category,
                    brand: item.brand,
                    unit: item.unit,
                    applyCount: item.returnCount,
                    deliveryCount: item.deliveryCount,
                    noDeliveryCount: item.noDeliveryCount,
                    receiveCount: item.receiveCount,
                    subCount: item.subCount,
                    count: item.noDeliveryCount,
                    detailId: item.returnDetailId,
                  })),
              }}
              deliveryType={info?.returnGoodsAddress.deliveryType}
              visible={visible}
              onClose={() => handleVisibleDrawer(false)}
              onSubmit={handleSubmit}
              submitLoading={submitLoading}
            />
          </>
        )}
        target="/afterAbility/returnApplication/returnPrDeliver"
        isEditRefundDeliver
      />
    </>
  )
}

export default ReturnPrDeliverVerify

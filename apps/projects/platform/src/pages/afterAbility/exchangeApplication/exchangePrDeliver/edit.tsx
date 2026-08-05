/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:42:32
 * @Description:
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { postAftersalesReplaceGoodsManualReturnDeliveryGoods } from '@apps/apis'
import { SettingOutlined } from '@ant-design/icons'
import moment from 'moment'
import { usePageStatus } from '@/hooks/usePageStatus'
import { EXCHANGE_GOODS_MANUAL_DELIVERY, EXCHANGE_GOODS_MANUAL_DELIVERY_CONTRACT } from '../../constants'
import DetailInfo from '../components/DetailInfo'
import ReturnDeliverDrawer, { ValuesType } from '../../components/DeliverDrawer'

const ExchangePrDeliverVerify: React.FC = () => {
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
    postAftersalesReplaceGoodsManualReturnDeliveryGoods({
      dataId: +id,
      deliveryAddress: `${returnDeliverAddress.fullAddress} ${returnDeliverAddress.name}/${returnDeliverAddress.phone}`,
      productList: productList.map((item) => ({
        productId: item.productId,
        returnCount: +item.count,
        replaceDetailId: item.detailId,
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
    <DetailInfo
      id={id}
      headExtra={(info) => (
        <>
          {info &&
            (info.taskType === EXCHANGE_GOODS_MANUAL_DELIVERY ||
              info.taskType === EXCHANGE_GOODS_MANUAL_DELIVERY_CONTRACT) && (
              <Button type="default" icon={<SettingOutlined />} onClick={() => handleVisibleDrawer(true)}>
                {intl.formatMessage({
                  id: 'returnApplication.returnPrDeliver.allRefund.deliver',
                  defaultMessage: '退货发货',
                })}
              </Button>
            )}

          <ReturnDeliverDrawer
            afterType={2}
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
                  applyCount: item.replaceCount,
                  deliveryCount: item.deliveryCount,
                  noDeliveryCount: item.noDeliveryCount,
                  receiveCount: item.receiveCount,
                  subCount: item.subCount,
                  count: item.noDeliveryCount,
                  detailId: item.detailId,
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
      target="/afterAbility/exchangeApplication/exchangePrDeliver"
      isEditRefundDeliver
    />
  )
}

export default ExchangePrDeliverVerify

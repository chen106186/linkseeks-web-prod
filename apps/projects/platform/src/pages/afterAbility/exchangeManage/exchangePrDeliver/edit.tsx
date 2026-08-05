import React, { useState } from 'react'
import { Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { postAftersalesReplaceGoodsManualReplaceDeliveryGoods } from '@apps/apis'
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
    postAftersalesReplaceGoodsManualReplaceDeliveryGoods({
      replaceId: +id,
      deliveryAddress: `${returnDeliverAddress.fullAddress} ${returnDeliverAddress.name}/${returnDeliverAddress.phone}`,
      productList: productList.map((item) => ({
        orderNo: item.orderNo,
        productId: item.productId,
        productName: item.productName,
        category: item.category,
        brand: item.brand,
        unit: item.unit,
        count: +item.count,
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
    <>
      <DetailInfo
        id={id}
        headExtra={(info) => (
          <>
            {info &&
              (info.taskType === EXCHANGE_GOODS_MANUAL_DELIVERY ||
                info.taskType === EXCHANGE_GOODS_MANUAL_DELIVERY_CONTRACT) && (
                <Button type="default" icon={<SettingOutlined />} onClick={() => handleVisibleDrawer(true)}>
                  {intl.formatMessage({ id: 'exchangeManage.exchangePrDeliver.deliver', defaultMessage: '换货发货' })}
                </Button>
              )}

            <ReturnDeliverDrawer
              afterType={2}
              flowType="exchangeDeliver"
              value={{
                productList: info?.goodsDetailList.map((item) => {
                  // 从换货统计里边找到对应的商品，
                  const current = info?.replaceStatisticsList.find(
                    (statisticsItem) => statisticsItem.productId === item.productId,
                  )
                  return {
                    orderNo: item.orderNo,
                    productId: item.productId,
                    productName: item.productName,
                    category: item.category,
                    brand: item.brand,
                    unit: item.unit,
                    applyCount: item.replaceCount,
                    deliveryCount: current?.deliveryCount || 0,
                    noDeliveryCount: current?.unDeliveryCount || 0,
                    receiveCount: current?.receiveCount || 0,
                    subCount: current?.differenceCount || 0,
                    count: current?.unDeliveryCount || 0,
                    detailId: item.detailId,
                  }
                }),
              }}
              deliveryType={info?.returnGoodsAddress.deliveryType}
              visible={visible}
              onClose={() => handleVisibleDrawer(false)}
              onSubmit={handleSubmit}
              submitLoading={submitLoading}
            />
          </>
        )}
        target="/afterAbility/exchangeManage/exchangePrDeliver"
        isEditExchangeDeliver
      />
    </>
  )
}

export default ExchangePrDeliverVerify

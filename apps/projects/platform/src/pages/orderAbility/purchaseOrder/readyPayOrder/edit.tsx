import React, { Fragment, useCallback, useRef } from 'react'
import { OrderDetailContext } from '@/pages/transaction/_public/order/context'
import { Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { useOrderDetail } from '@/pages/orderAbility/assets/hooks/useOrderDetail'
import OrderDetailSection from '@/pages/transaction/components/orderDetailSection'
import OrderPayModal from '@/pages/transaction/components/orderPayModal'
import { jumpDefaultMall } from '@/constants'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { PageHeaderWrapper } from '@apps/components'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import useVersion from '@/hooks/useVersion'

const ReadyConfirmContract: React.FC = () => {
  const { formContext, id, detailList } = useOrderDetail({ type: 'p_readyPayOrder' })
  const { TabList, versionContext, handleChangeVersion } = useVersion({ id, formContext })
  const { data, currentPayInfoId } = formContext

  const payRef = useRef<any>({})
  const intl = useIntl()

  const handleClick = useCallback(() => {
    // 处理积分支付跳转
    if (data && currentPayInfoId) {
      if (data.payments.length > 0) {
        const obj = data.payments.filter((item) => item.paymentId === Number(currentPayInfoId))[0]
        console.log(obj, currentPayInfoId)
        if (obj.payChannel === 10) {
          const spam: any = {
            orderId: [data.orderId],
            memberId: data.vendorMemberId,
            memberRoleId: data.vendorRoleId,
            batchNo: obj.batchNo,
            payAmount: obj.payAmount,
            payType: obj.payType,
            payChannel: obj.payChannel,
          }
          jumpDefaultMall(`/pay?spam=${btoa(JSON.stringify(spam))}`)
        } else {
          payRef.current.setVisible(true)
        }
      }
    }
  }, [data, currentPayInfoId])

  const renderPayPrice = () => {
    if (data) {
      if (data.payments.length > 0) {
        const obj = data.payments.filter((item) => item.paymentId === Number(currentPayInfoId))[0]
        if (obj) return obj.payAmount
      }
    }
  }

  return (
    <OrderDetailContext.Provider value={{ formContext, versionContext }}>
      <PageHeaderWrapper
        subTitle={formContext?.data?.orderNo}
        title={formContext?.data?.digest}
        items={TabList}
        extra={
          <ChangeButtonCard
            formContext={formContext}
            versionChange={handleChangeVersion}
            authButtonCard={
              <Fragment>
                {/* <AuthButton type="custom" code="pay"> */}
                <Button type="primary" onClick={handleClick}>
                  {intl.formatMessage({
                    id: 'purchaseOrder.quzhifu',
                    defaultMessage: '去支付',
                  })}
                </Button>
                {/* </AuthButton> */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#6B778C' }}>
                    {intl.formatMessage({
                      id: 'purchaseOrder.bencixuzhifu',
                      defaultMessage: '本次需支付',
                    })}
                  </div>
                  {formContext.data && <div>{renderPayPrice()}</div>}
                </div>
              </Fragment>
            }
          />
        }
      >
        <OrderDetailWrapper>
          <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
            <OrderDetailSection formContext={formContext} detailList={detailList} />
          </PreLoading>
        </OrderDetailWrapper>
      </PageHeaderWrapper>
      {/* 提交时触发的弹窗集合 */}
      <OrderPayModal currentRef={payRef} />
    </OrderDetailContext.Provider>
  )
}

export default ReadyConfirmContract

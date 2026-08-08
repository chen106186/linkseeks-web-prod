import React, { useCallback, useRef } from 'react'
import { OrderDetailContext } from '@/pages/transaction/_public/order/context'
import { Button } from 'antd'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { useOrderDetail } from '@/pages/orderAbility/assets/hooks/useOrderDetail'
import OrderHandDeleved from '@/pages/transaction/components/orderHandDeleved'
import OrderDetailSection from '@/pages/transaction/components/orderDetailSection'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { PageHeaderWrapper, AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import useVersion from '@/hooks/useVersion'

const ReadyConfirmDelevedOrderDetail: React.FC = () => {
  const { formContext, id, detailList } = useOrderDetail({ type: 's_readyConfirmDelevedOrder' })
  const { TabList, versionContext, handleChangeVersion } = useVersion({ id, formContext })
  const intl = useIntl()
  // // 是否是手工发货
  // const isHandDeleved = formContext.data && formContext.data.purchaseOrderInteriorState === SaleOrderInsideWorkState.HAND_DELEVED_ORDER

  // // 所有发货单都是否已经发货了
  // const isShowBtn = isHandDeleved || formContext.data?.orderDeliveryDetailsResponses?.some(v => v.interiorState === DeliverySideState.ADD_LOGISTICS_ORDER)

  // 是否发过货
  // const isHandDeleved = Number(batchNo) <= 0
  const isHandDeleved = true

  // 是否发货完成

  const approvedRef = useRef<any>({})

  const handleClick = useCallback(() => {
    if (isHandDeleved) {
      approvedRef.current.setVisible(true)
    } else {
      const deleveBox = document.querySelector('#deleveBox') as any
      window.scrollTo(0, deleveBox.offsetTop)
    }
  }, [isHandDeleved])

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
              // <AuthButton type="custom" code="send">
              <Button type="primary" onClick={handleClick}>
                {isHandDeleved
                  ? intl.formatMessage({
                      id: 'saleOrder.querenshougongfa',
                      defaultMessage: '确认手工发货',
                    })
                  : intl.formatMessage({ id: 'saleOrder.qufahuo', defaultMessage: '去发货' })}
              </Button>
              // </AuthButton>
            }
          />
        }
      >
        <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
          <OrderDetailSection formContext={formContext} detailList={detailList} type="saleOrder" />
        </PreLoading>
      </PageHeaderWrapper>
      {/* 提交时触发的弹窗集合 */}
      <OrderHandDeleved currentRef={approvedRef} />
    </OrderDetailContext.Provider>
  )
}

export default ReadyConfirmDelevedOrderDetail

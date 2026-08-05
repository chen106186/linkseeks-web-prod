import React, { Fragment, useCallback, useRef } from 'react'
import { OrderDetailContext } from '@/pages/transaction/_public/order/context'
import { Button } from 'antd'
import PreLoading from '@/components/PreLoading'
import { useOrderDetail } from '@/pages/orderAbility/assets/hooks/useOrderDetail'
import OrderDetailSection from '@/pages/transaction/components/orderDetailSection'
import OrderHandReceivedModal from '@/pages/transaction/components/orderHandReceivedModal'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { AuthButton, PageHeaderWrapper, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import useVersion from '@/hooks/useVersion'

const ReadyReceiveOrderDetail: React.FC = () => {
  const { formContext, id, detailList } = useOrderDetail({ type: 'p_readyReceiveOrder' })
  const { TabList, versionContext, handleChangeVersion } = useVersion({ id, formContext })
  const approvedRef = useRef<any>({})
  const intl = useIntl()

  // // 是否是手工收货
  // const isHeadReceipt = formContext.data && formContext.data.interiorState === PurchaseOrderInsideWorkState.HAND_RECEIPT_ORDER

  // // 所有收货订单都是否已经收货了
  // const isShowBtn = isHeadReceipt || formContext.data?.orderDeliveryDetailsResponses?.some(v => v.interiorState === DeliverySideState.WAREHOUSE_ORDER)

  // 是否发过货
  // const isHeadReceipt = Number(batchNo) <= 0
  const isHeadReceipt = false

  const handleClick = useCallback(() => {
    if (isHeadReceipt) {
      // 手工收货
      approvedRef.current.setVisible(true)
    } else {
      // 正常收货
      const deleveBox = document.querySelector('.deleveBox') as any
      document.getElementById('page-header-main')?.scrollTo(0, deleveBox?.offsetTop)
    }
  }, [isHeadReceipt])

  return (
    <OrderDetailContext.Provider value={{ formContext, versionContext }}>
      <PageHeaderWrapper
        title={formContext?.data?.digest}
        subTitle={formContext?.data?.orderNo}
        isAnchor
        items={TabList}
        extra={
          <ChangeButtonCard
            formContext={formContext}
            versionChange={handleChangeVersion}
            authButtonCard={
              <Fragment>
                {formContext.data && !formContext.data.receiveDone && (
                  // <AuthButton type="custom" code="collect">
                  <Button type="primary" onClick={handleClick}>
                    {isHeadReceipt
                      ? intl.formatMessage({
                          id: 'purchaseOrder.shougongshouhuo',
                          defaultMessage: '手工收货',
                        })
                      : intl.formatMessage({
                          id: 'purchaseOrder.ququerenshouhuo',
                          defaultMessage: '去确认收货',
                        })}
                  </Button>
                  // </AuthButton>
                )}
              </Fragment>
            }
          />
        }
      >
        <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
          <OrderDetailSection formContext={formContext} detailList={detailList} />
        </PreLoading>
      </PageHeaderWrapper>
      <OrderHandReceivedModal currentRef={approvedRef} />
    </OrderDetailContext.Provider>
  )
}

export default ReadyReceiveOrderDetail

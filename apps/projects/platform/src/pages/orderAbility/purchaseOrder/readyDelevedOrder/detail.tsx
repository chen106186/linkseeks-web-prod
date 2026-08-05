import React from 'react'
import { OrderDetailContext } from '@/pages/transaction/_public/order/context'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { useOrderDetail } from '@/pages/orderAbility/assets/hooks/useOrderDetail'
import OrderDetailSection from '@/pages/transaction/components/orderDetailSection'
import { PageHeaderWrapper } from '@apps/components'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import useVersion from '@/hooks/useVersion'

const ReadyDelevedOrderDetail: React.FC = () => {
  const { formContext, id, detailList } = useOrderDetail({ type: 'purchaseOrder' })
  const { TabList, versionContext, handleChangeVersion } = useVersion({ id, formContext })

  return (
    <div>
      <OrderDetailContext.Provider value={{ formContext, versionContext }}>
        <PageHeaderWrapper
          subTitle={formContext?.data?.orderNo}
          title={formContext?.data?.digest}
          items={TabList}
          extra={<ChangeButtonCard formContext={formContext} versionChange={handleChangeVersion} />}
        >
          <OrderDetailWrapper>
            <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
              <OrderDetailSection formContext={formContext} detailList={detailList} />
            </PreLoading>
          </OrderDetailWrapper>
        </PageHeaderWrapper>
      </OrderDetailContext.Provider>
    </div>
  )
}

export default ReadyDelevedOrderDetail

import React, { useCallback, useRef } from 'react'
import { OrderDetailContext } from '@/pages/transaction/_public/order/context'
import { Button } from 'antd'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { useOrderDetail } from '@/pages/orderAbility/assets/hooks/useOrderDetail'
import OrderDetailSection from '@/pages/transaction/components/orderDetailSection'
import OrderElectronModal from '@/pages/transaction/components/orderElectronModal'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import useVersion from '@/hooks/useVersion'

const ReadyConfirmContract: React.FC = () => {
  const { formContext, id, detailList } = useOrderDetail({ type: 'purchaseOrder' })
  const { TabList, versionContext, handleChangeVersion } = useVersion({ id, formContext })
  const electronRef = useRef<any>({})
  const intl = useIntl()
  const handleClick = useCallback(() => {
    electronRef.current.setVisible(true)
  }, [])

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
              <Button type="primary" onClick={handleClick}>
                {intl.formatMessage({
                  id: 'purchaseOrder.querendianzihetong',
                  defaultMessage: '确认电子合同',
                })}
              </Button>
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
      <OrderElectronModal currentRef={electronRef} />
    </OrderDetailContext.Provider>
  )
}

export default ReadyConfirmContract

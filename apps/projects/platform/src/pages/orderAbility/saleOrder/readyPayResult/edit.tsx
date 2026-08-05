import React, { useCallback, useRef } from 'react'
import { OrderDetailContext } from '@/pages/transaction/_public/order/context'
import { Button } from 'antd'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { useOrderDetail } from '@/pages/orderAbility/assets/hooks/useOrderDetail'
import OrderDetailSection from '@/pages/transaction/components/orderDetailSection'
import OrderPayResultModal from '@/pages/transaction/components/orderPayResultModal'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { PageHeaderWrapper, AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import useVersion from '@/hooks/useVersion'

const ReadyPayResultOrderDetail: React.FC = () => {
  const { formContext, id, detailList } = useOrderDetail({ type: 'saleOrder' })
  const { TabList, versionContext, handleChangeVersion } = useVersion({ id, formContext })
  const approvedRef = useRef<any>({})
  const intl = useIntl()
  const handleClick = useCallback(() => {
    approvedRef.current.setVisible(true)
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
              // <AuthButton type="custom" code="confirm">
              <Button type="primary" onClick={handleClick}>
                {intl.formatMessage({
                  id: 'saleOrder.querenzhifujie',
                  defaultMessage: '确认支付结果',
                })}
              </Button>
              // </AuthButton>
            }
          />
        }
      >
        <OrderDetailWrapper>
          <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
            <OrderDetailSection formContext={formContext} detailList={detailList} type="saleOrder" />
          </PreLoading>
        </OrderDetailWrapper>
      </PageHeaderWrapper>
      {/* 提交时触发的弹窗集合 */}
      <OrderPayResultModal currentRef={approvedRef} type="default" />
    </OrderDetailContext.Provider>
  )
}

export default ReadyPayResultOrderDetail

import React from 'react'
import { OrderDetailContext } from '@/pages/transaction/_public/order/context'
import { Button } from 'antd'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { useOrderDetail } from '@/pages/orderAbility/assets/hooks/useOrderDetail'
import OrderDetailSection from '@/pages/transaction/components/orderDetailSection'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { PageHeaderWrapper, AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import useVersion from '@/hooks/useVersion'

const ReadyConfirmReturnOrderDetail: React.FC = () => {
  const intl = useIntl()
  const { formContext, id, detailList } = useOrderDetail({ type: 'saleOrder' })
  const { TabList, versionContext, handleChangeVersion } = useVersion({ id, formContext })

  const handleSubmit = () => {
    const deleveBox = document.querySelector('#deleveBox') as any
    window.scrollTo(0, deleveBox.offsetTop)
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
              // <AuthButton type="custom" code="confirm">
              <Button type="primary" onClick={handleSubmit}>
                {intl.formatMessage({
                  id: 'saleOrder.ququerenhuidan',
                  defaultMessage: '去确认回单',
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
    </OrderDetailContext.Provider>
  )
}

export default ReadyConfirmReturnOrderDetail

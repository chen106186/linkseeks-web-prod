import React, { useState } from 'react'
import { OrderDetailContext } from '@/pages/transaction/_public/order/context'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { useOrderDetail } from '@/pages/orderAbility/assets/hooks/useOrderDetail'
import OrderDetailSection from '@/pages/transaction/components/orderDetailSection'
import { Button } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import { PageHeaderWrapper } from '@apps/components'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import useVersion from '@/hooks/useVersion'

const OrderPreview: React.FC = () => {
  const { modifyPrice = false } = usePageStatus() // 修改单价页面
  const { formContext, id, detailList } = useOrderDetail({ type: 'saleOrder' })
  const [isVersion, setIsVersion] = useState<boolean>(true)
  const { TabList, versionContext, handleChangeVersion } = useVersion({
    id,
    formContext,
    isVersion: modifyPrice ? isVersion : false,
  })

  const intl = useIntl()
  const handleClick = () => {
    history.goBack()
  }

  const handleVersionChange = (e) => {
    handleChangeVersion(e)
    setIsVersion(!isVersion)
  }

  return (
    <OrderDetailContext.Provider value={{ formContext, versionContext }}>
      <PageHeaderWrapper
        subTitle={formContext?.data?.orderNo}
        title={formContext?.data?.digest}
        items={TabList}
        extra={
          <ChangeButtonCard
            isVersion={modifyPrice ? true : false}
            formContext={formContext}
            versionChange={handleVersionChange}
            authButtonCard={
              modifyPrice && (
                <Button type="primary" onClick={handleClick}>
                  {intl.formatMessage({ id: 'saleOrder.tijiao', defaultMessage: '提交' })}
                </Button>
              )
            }
          />
        }
      >
        <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
          <OrderDetailSection formContext={formContext} detailList={detailList} type="saleOrder" />
        </PreLoading>
      </PageHeaderWrapper>
    </OrderDetailContext.Provider>
  )
}

export default OrderPreview

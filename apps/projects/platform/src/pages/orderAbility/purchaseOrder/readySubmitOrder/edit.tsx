import React, { useCallback, useState } from 'react'
import { OrderDetailContext } from '@/pages/transaction/_public/order/context'
import { Button } from 'antd'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { useOrderDetail } from '@/pages/orderAbility/assets/hooks/useOrderDetail'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import OrderDetailSection from '@/pages/transaction/components/orderDetailSection'
import { postOrderBuyerValidateSubmit } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, PageHeaderWrapper, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import useVersion from '@/hooks/useVersion'

const ReadySubmitOrderDetail: React.FC = () => {
  const { formContext, id, detailList } = useOrderDetail({ type: 'purchaseOrder' })
  const [isVersion, setIsVersion] = useState<boolean>(true)
  const { TabList, versionContext, handleChangeVersion } = useVersion({
    id,
    formContext,
    isVersion: isVersion,
  })
  const { run, loading } = useHttpRequest(postOrderBuyerValidateSubmit)
  const intl = useIntl()

  const handleClick = useCallback(async () => {
    const params = {
      orderId: Number(id),
    }
    const result = await run(params)

    if (result.code === 1000) {
      history.goBack()
    }
  }, [])

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
            isVersion
            formContext={formContext}
            versionChange={handleVersionChange}
            authButtonCard={
              // <AuthButton type="custom" code="submit">
              <Button type="primary" onClick={handleClick} loading={loading}>
                {intl.formatMessage({
                  id: 'purchaseOrder.tijiaodingdan',
                  defaultMessage: '提交订单',
                })}
              </Button>
              // </AuthButton>
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
    </OrderDetailContext.Provider>
  )
}

export default ReadySubmitOrderDetail

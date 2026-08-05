import React, { useCallback, useState } from 'react'
import { OrderDetailContext } from '@/pages/transaction/_public/order/context'
import { Button } from 'antd'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { useOrderDetail } from '@/pages/orderAbility/assets/hooks/useOrderDetail'
import OrderDetailSection from '@/pages/transaction/components/orderDetailSection'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import useVersion from '@/hooks/useVersion'

const ReadyConfirmReturnDocumentOrderDetail: React.FC = () => {
  const { formContext, id, detailList } = useOrderDetail({ type: 'saleOrder' })
  const [isVersion, setIsVersion] = useState<boolean>(true)
  const { TabList, versionContext, handleChangeVersion } = useVersion({
    id,
    formContext,
    isVersion: isVersion,
  })
  // const { run, loading } = useHttpRequest(postOrderOfOrdersToBeFiled)
  const intl = useIntl()
  // 提交表单
  const handleSubmit = useCallback(async () => {
    // const params = {
    //   id: Number(id)
    // }
    // const result = await run(params)
    // if (result.code === 1000) {
    //   history.goBack()
    // }
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
              <Button type="primary" onClick={handleSubmit}>
                {intl.formatMessage({
                  id: 'saleOrder.querenguidang',
                  defaultMessage: '确认归档',
                })}
              </Button>
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

export default ReadyConfirmReturnDocumentOrderDetail

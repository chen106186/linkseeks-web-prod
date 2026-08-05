import React, { useCallback, useRef, useState } from 'react'
import { OrderDetailContext } from '@/pages/transaction/_public/order/context'
import { Button } from 'antd'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { useOrderDetail } from '@/pages/orderAbility/assets/hooks/useOrderDetail'
import ApprovedOrderModal from '@/pages/transaction/components/approvedOrderModal'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import OrderDetailSection from '@/pages/transaction/components/orderDetailSection'
import { postOrderVendorValidateGradeOne } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { PageHeaderWrapper, AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import useVersion from '@/hooks/useVersion'

const FirstApprovedOrderDetail: React.FC = () => {
  const { formContext, id, detailList } = useOrderDetail({ type: 'saleOrder' })
  const [isVersion, setIsVersion] = useState<boolean>(true)
  const { TabList, versionContext, handleChangeVersion } = useVersion({
    id,
    formContext,
    isVersion: true,
  })
  const { run, loading } = useHttpRequest(postOrderVendorValidateGradeOne)
  const approvedRef = useRef<any>({})

  const intl = useIntl()

  const handleClick = useCallback(() => {
    approvedRef.current.setVisible(true)
  }, [])

  // 提交表单
  const handleSubmit = useCallback(() => {
    approvedRef.current.actions.submit().then(async (v) => {
      const params = {
        orderId: Number(id),
        ...v.values,
      }
      const result = await run(params)

      if (result.code === 1000) {
        approvedRef.current.setVisible(false)
        history.goBack()
      }
    })
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
              <Button type="primary" onClick={handleClick}>
                {intl.formatMessage({
                  id: 'saleOrder.tijiaoshenhe',
                  defaultMessage: '提交审核',
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
      <ApprovedOrderModal currentRef={approvedRef} onConfirm={handleSubmit} loading={loading} />
    </OrderDetailContext.Provider>
  )
}

export default FirstApprovedOrderDetail

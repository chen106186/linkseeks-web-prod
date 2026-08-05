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
import OrderElectronModal from '@/pages/transaction/components/orderElectronModal'
import { postOrderVendorValidateConfirm } from '@apps/apis'
import { getContractSignatureAuthAuthStatus } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { PageHeaderWrapper, AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import useVersion from '@/hooks/useVersion'

const ReadyConfirmOrderDetail: React.FC = () => {
  const { formContext, id, detailList } = useOrderDetail({ type: 'saleOrder' })
  const [isVersion, setIsVersion] = useState<boolean>(true)
  const { TabList, versionContext, handleChangeVersion } = useVersion({
    id,
    formContext,
    isVersion: isVersion,
  })
  const { run, loading } = useHttpRequest(postOrderVendorValidateConfirm)
  const approvedRef = useRef<any>({})
  const intl = useIntl()
  const handleClick = useCallback(() => {
    getContractSignatureAuthAuthStatus().then((res) => {
      if (res.code === 1000) {
        approvedRef.current.setVisible(true)
      }
    })
  }, [])

  const electronRef = useRef<any>({})

  // const handleClick = useCallback(() => {
  //   electronRef.current.setVisible(true)
  // }, [])

  // 提交表单
  const handleSubmit = () => {
    approvedRef.current.actions.submit().then(async (v) => {
      const params = {
        orderId: Number(id),
        ...v.values,
      }
      if (formContext.data.usingElectronicContracts && v.values.state) {
        // 使用合同 并且通过
        approvedRef.current.setVisible(false)
        electronRef.current.setVisible(true)
      } else {
        const result = await run(params)

        if (result.code === 1000) {
          approvedRef.current.setVisible(false)
          history.goBack()
        }
      }
    })
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
            isVersion
            formContext={formContext}
            versionChange={handleVersionChange}
            authButtonCard={
              // <AuthButton type="custom" code="confirm">
              <Button type="primary" onClick={handleClick}>
                {intl.formatMessage({
                  id: 'saleOrder.querendingdan',
                  defaultMessage: '确认订单',
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
      <ApprovedOrderModal
        currentRef={approvedRef}
        onConfirm={handleSubmit}
        loading={loading}
        isUseElectronicContract={formContext.data?.usingElectronicContracts ? true : false}
      />
      {/* 提交时触发的签合同弹窗集合 */}
      <OrderElectronModal currentRef={electronRef} type="saleOrder" ctx={approvedRef.current.actions} />
    </OrderDetailContext.Provider>
  )
}

export default ReadyConfirmOrderDetail

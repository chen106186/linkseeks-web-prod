import React, { useCallback, useRef, useState } from 'react'
import { OrderDetailContext } from '@/pages/transaction/_public/order/context'
import { Button, message } from 'antd'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { useOrderDetail } from '@/pages/orderAbility/assets/hooks/useOrderDetail'
import OrderDetailSection from '@/pages/transaction/components/orderDetailSection'
import CreateOrderElectronModal from '@/pages/transaction/components/createElectronModal'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { PageHeaderWrapper, AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import useVersion from '@/hooks/useVersion'
import { createFormActions } from '@apps/formily'
import { postOrderVendorValidateSubmitOrderContractTextSave } from '@apps/apis'

const addSchemaAction_ = createFormActions()
const ReadyApprovedOrderDetail: React.FC = () => {
  const { formContext, id, detailList } = useOrderDetail({ type: 'saleOrder' })
  const [isVersion, setIsVersion] = useState<boolean>(true)
  const { TabList, versionContext, handleChangeVersion } = useVersion({
    id,
    formContext,
    isVersion: isVersion,
  })
  const electronRef = useRef<any>({})
  const intl = useIntl()

  const handleSubmit = (callback) => {
    const sub_back = addSchemaAction_.submit()
    if (!sub_back) {
      callback()
    }
    sub_back?.then((val) => {
      const contractText = val.values.contractText
      const params = {
        orderId: formContext.data?.orderId,
        contractText,
      }
      postOrderVendorValidateSubmitOrderContractTextSave(params, { ctlType: 'none' }).then((res) => {
        if (res.code === 1000) {
          callback()
        } else {
          message.error(res.message)
        }
      })
    })
  }
  const handleClick = useCallback(() => {
    handleSubmit(() => electronRef.current.setVisible(true))
  }, [formContext])

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
            <OrderDetailSection
              formContext={{ ...formContext, addSchemaAction_ }}
              detailList={detailList}
              type="saleOrder"
            />
          </PreLoading>
        </OrderDetailWrapper>
      </PageHeaderWrapper>
      {/* 提交时触发的弹窗集合 */}
      <CreateOrderElectronModal currentRef={electronRef} />
    </OrderDetailContext.Provider>
  )
}

export default ReadyApprovedOrderDetail

import React, { useCallback, useRef } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Button } from 'antd'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { BidDetailContext } from '@/pages/procurement/_public/bid/context'
import { useBidDetail } from '@/pages/procurement/_public/bid/effects/useBidDetail'
import BidDetailHeader from '@/pages/procurement/components/bidDetailHeader'
import BidDetailSection from '@/pages/procurement/components/bidDetailSection'
import ApprovedModal from '@/pages/procurement/components/approvedModal'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { postPurchaseInviteTenderCheckInviteTenderRegister } from '@apps/apis'
const intl = getIntl()

const ReadyCheckedRegisterDetail: React.FC = () => {
  const { formContext, id } = useBidDetail({ type: 'callForBidInTender' })
  const { data } = formContext
  const approvedRef = useRef<any>({})

  const { action = null } = usePageStatus()

  const { run, loading } = useHttpRequest(postPurchaseInviteTenderCheckInviteTenderRegister)

  const handleClick = useCallback(() => {
    approvedRef.current.setVisible(true)
  }, [])

  // 提交审核表单
  const handleSubmit = useCallback(() => {
    approvedRef.current.actions.submit().then(async ({ values }) => {
      const params = {
        id: Number(id),
        ...values,
      }
      const result = await run(params)

      if (result.code === 1000) {
        approvedRef.current.setVisible(false)
        history.goBack()
      }
    })
  }, [])

  const anchorTitleList = [
    {
      title: intl.formatMessage({ id: 'table.purchase.liuzhuanjindu' }),
      id: 'transferProcess',
      componentName: 'TransferProcess',
    },
    { title: intl.formatMessage({ id: 'table.purchase.jibenxinxi' }), id: 'baseicInfo', type: 'basicInfo' },
    // { title: intl.formatMessage({ id: 'table.purchase.zhaobiaowuliao' }), id: 'bidMaterial', componentName: "BidMaterial" },
    // { title: intl.formatMessage({ id: 'table.purchase.zhaobiaoyaoqiu' }), id: 'bidNeed', type: "bidNeed" },
    { title: intl.formatMessage({ id: 'table.purchase.baomingyaoqiu' }), id: 'registerNeed', type: 'registerNeed' },
    { title: intl.formatMessage({ id: 'detail.purchase.signUpMsgLayout' }), id: 'registerInfo', type: 'registerInfo' },
    { title: intl.formatMessage({ id: 'detail.purchase.signUpFileLayout' }), id: 'baseicInfo', type: 'registerFile' },
    // { title: intl.formatMessage({ id: 'table.purchase.zigeyushenyao' }), id: 'checkNeed', type: "checkNeed" },
    // { title: intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiu' }), id: 'remarkNeed', type: "remarkNeed" },
    // { title: intl.formatMessage({ id: 'table.purchase.qitayaoqiu' }), id: 'otherNeed', type: "otherNeed" },
    // { title: intl.formatMessage({ id: 'table.purchase.zhaobiaofangshi' }), id: 'bidWay', componentName: "BidMethod" },
    {
      title: intl.formatMessage({ id: 'table.purchase.liuzhuanjilu' }),
      id: 'transferRecord',
      componentName: 'BidTransformRecord',
    },
  ]

  return (
    <div>
      <BidDetailContext.Provider value={formContext}>
        <BidDetailHeader
          formContext={formContext}
          anchorList={anchorTitleList}
          extraRight={
            action ? (
              <Button type="primary" onClick={handleClick}>
                {intl.formatMessage({ id: 'detail.purchase.modelTitle' })}
              </Button>
            ) : null
          }
        />
        <OrderDetailWrapper>
          <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
            <BidDetailSection formContext={formContext} anchorList={anchorTitleList} type="callForBidInTender" />
          </PreLoading>
        </OrderDetailWrapper>

        {/* 点击审核触发的弹窗集合 */}
        <ApprovedModal
          currentRef={approvedRef}
          onConfirm={handleSubmit}
          loading={loading}
          title={intl.formatMessage({ id: 'detail.purchase.modelTitle' })}
        />
      </BidDetailContext.Provider>
    </div>
  )
}

export default ReadyCheckedRegisterDetail

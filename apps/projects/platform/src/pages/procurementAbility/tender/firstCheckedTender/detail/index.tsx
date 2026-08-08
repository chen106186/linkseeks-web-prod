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
import { useHttpRequest } from '@/hooks/useHttpRequest'
import ApprovedModal from '@/pages/procurement/components/approvedModal'
import { postPurchaseSubmitTenderCheckSubmitTender } from '@apps/apis'
const intl = getIntl()

const FirstCheckedTenderDetail: React.FC = () => {
  const { formContext, id } = useBidDetail({ type: 'tender' })
  const { data } = formContext

  const { run, loading } = useHttpRequest(postPurchaseSubmitTenderCheckSubmitTender)
  const approvedRef = useRef<any>({})

  const anchorTitleList = [
    {
      title: intl.formatMessage({ id: 'table.purchase.liuzhuanjindu' }),
      id: 'transferProcess',
      componentName: 'TransferProcess',
    },
    { title: intl.formatMessage({ id: 'table.purchase.jibenxinxi' }), id: 'baseicInfo', type: 'basicInfo' },
    // { title: '投标要求', id: 'bidNeed', type: "bidNeed" },
    // { title: '投标其他要求', id: 'otherNeed', type: "otherNeed" },
    {
      title: intl.formatMessage({ id: 'table.purchase.toubiaoshangpin' }),
      id: 'bidParticulars',
      componentName: 'BidParticulars',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.liuzhuanjilu' }),
      id: 'transferRecord',
      componentName: 'BidTransformRecord',
    },
  ]

  const handleClick = useCallback(() => {
    approvedRef.current.setVisible(true)
  }, [])

  // 提交表单
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

  return (
    <div>
      <BidDetailContext.Provider value={formContext}>
        <BidDetailHeader
          formContext={formContext}
          anchorList={anchorTitleList}
          extraRight={
            <Button type="primary" onClick={handleClick}>
              {intl.formatMessage({ id: 'detail.purchase.modelTitle' })}
            </Button>
          }
        />
        <OrderDetailWrapper>
          <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
            <BidDetailSection formContext={formContext} anchorList={anchorTitleList} type="tender" />
          </PreLoading>
        </OrderDetailWrapper>

        {/* 提交时触发的弹窗集合 */}
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

export default FirstCheckedTenderDetail

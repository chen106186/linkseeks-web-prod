import React, { useCallback, useRef } from 'react'
import PreLoading from '@/components/PreLoading'
import { useBillDetail } from '../../_public/bill/effects/useBillDetail'
import { BillDetailContext } from '../../_public/bill/effects/context'
import BillDetailWrapper from '../../components/billDetailWrapper'
import BillDetailHeader from '../../components/billDetailHeader'
import BillDetailSection from '../../components/billDetailSection'
import { Button } from 'antd'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import ApprovedOrderModal from '@/pages/transaction/components/approvedOrderModal'
import { postPurchaseRequisitionTwoAudit } from '@apps/apis'
import { AuthButton } from '@apps/components'

// 待审核请购单详情 二级

const SecondOrderPreview: React.FC = () => {
  const { formContext, id, anchorTitleList } = useBillDetail({ type: 'requestBill' })
  const intl = useIntl()
  const { run, loading } = useHttpRequest(postPurchaseRequisitionTwoAudit)
  const approvedRef = useRef<any>({})

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
      <BillDetailContext.Provider value={formContext}>
        <BillDetailHeader
          formContext={formContext}
          anchorList={anchorTitleList}
          extraRight={
            <AuthButton type="custom" code="tijiaoshenhe">
              <Button type="primary" onClick={handleClick} loading={loading}>
                {intl.formatMessage({ id: 'purchaseRequisition.tijiaoshenhe', defaultMessage: '提交审核' })}
              </Button>
            </AuthButton>
          }
        />
        <BillDetailWrapper>
          <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
            <BillDetailSection formContext={formContext} anchorList={anchorTitleList} type="requestBill" />
          </PreLoading>
        </BillDetailWrapper>
      </BillDetailContext.Provider>

      {/* 提交时触发的弹窗集合 */}
      <ApprovedOrderModal currentRef={approvedRef} onConfirm={handleSubmit} loading={loading} />
    </div>
  )
}

export default SecondOrderPreview

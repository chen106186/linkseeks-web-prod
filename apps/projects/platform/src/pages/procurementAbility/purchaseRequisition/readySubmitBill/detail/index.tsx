import React, { useRef } from 'react'
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
import { postPurchaseRequisitionSubmit } from '@apps/apis'
import { AuthButton } from '@apps/components'

// 待提交请购单详情

const ReadySubmitBillDetail: React.FC = () => {
  const { formContext, id, anchorTitleList } = useBillDetail({ type: 'requestBill' })
  const intl = useIntl()
  const { run, loading } = useHttpRequest(postPurchaseRequisitionSubmit)
  const approvedRef = useRef<any>({})

  const handleClick = async () => {
    const result = await run({ id })
    if (result.code === 1000) {
      history.goBack()
    }
  }

  return (
    <div>
      <BillDetailContext.Provider value={formContext}>
        <BillDetailHeader
          formContext={formContext}
          anchorList={anchorTitleList}
          extraRight={
            <AuthButton type="custom" code="audit">
              <Button type="primary" onClick={handleClick} loading={loading}>
                {intl.formatMessage({ id: 'purchaseRequisition.shenhe', defaultMessage: '审核' })}
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
    </div>
  )
}

export default ReadySubmitBillDetail

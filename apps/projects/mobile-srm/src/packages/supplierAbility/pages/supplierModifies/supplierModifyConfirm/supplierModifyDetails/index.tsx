/*
 * @Description: 待确认变更详情
 */
import React, { useEffect, useState } from 'react'
import { useRouter, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import { getMemberMobileModityConfirmDetail } from '@apps/apis'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import SupplierProfile, { SupplierDetailsType } from '../../../../components/SupplierProfile'
import './index.scss'

type SupplierModifyDetailsRouteParams = {
  /**
   * 会员审核id
   */
  validateId?: string
}

const SupplierModifyDetails: React.FC = () => {
  const router = useRouter<SupplierModifyDetailsRouteParams>()
  const {
    params: { validateId },
  } = router

  const [supplierDetails, setSupplierModifyDetails] = useState<SupplierDetailsType | undefined>(undefined)

  const fetchSupplierModifyDetails = () => {
    if (!validateId) {
      return
    }
    showLoading({ title: '正在加载...', mask: true })
    getMemberMobileModityConfirmDetail({
      validateId,
    })
      .then((res) => {
        if (res.code === 1000) {
          setSupplierModifyDetails(res.data)
          hideLoading()
        }
      })
      .finally(() => {
        // 在真机如果出现了 Toast 会消失的很快
        // hideLoading();
      })
  }

  useEffect(() => {
    fetchSupplierModifyDetails()
  }, [])

  return (
    <PageHeaderWrapper navTitle={supplierDetails?.innerStatusName}>
      <SupplierProfile details={supplierDetails} showDepositNew />
    </PageHeaderWrapper>
  )
}

export default SupplierModifyDetails

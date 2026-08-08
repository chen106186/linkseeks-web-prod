/*
 * @Description: 待审核变更(一级)详情
 */
import React, { useEffect, useState } from 'react'
import { useRouter, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import { getMemberMobileModityGradeOneDetail } from '@apps/apis'
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
    getMemberMobileModityGradeOneDetail({
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

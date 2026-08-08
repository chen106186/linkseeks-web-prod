/*
 * @Description: 待审核入库资质详情
 */
import React, { useEffect, useState } from 'react'
import { useRouter, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import { getMemberMobileDepositQualifyDetail } from '@apps/apis'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import SupplierProfile, { SupplierDetailsType } from '../../../../components/SupplierProfile'
import './index.scss'

type SupplierDepositDetailsRouteParams = {
  /**
   * 会员审核id
   */
  validateId?: string
}

const SupplierDepositDetails: React.FC = () => {
  const router = useRouter<SupplierDepositDetailsRouteParams>()
  const {
    params: { validateId },
  } = router

  const [supplierDetails, setSupplierDepositDetails] = useState<SupplierDetailsType | undefined>(undefined)

  const fetchSupplierDepositDetails = () => {
    if (!validateId) {
      return
    }
    showLoading({ title: '正在加载...', mask: true })
    getMemberMobileDepositQualifyDetail({
      validateId,
    })
      .then((res) => {
        if (res.code === 1000) {
          setSupplierDepositDetails(res.data)
          hideLoading()
        }
      })
      .finally(() => {
        // 在真机如果出现了 Toast 会消失的很快
        // hideLoading();
      })
  }

  useEffect(() => {
    fetchSupplierDepositDetails()
  }, [])

  return (
    <PageHeaderWrapper navTitle={supplierDetails?.innerStatusName}>
      <SupplierProfile details={supplierDetails} />
    </PageHeaderWrapper>
  )
}

export default SupplierDepositDetails

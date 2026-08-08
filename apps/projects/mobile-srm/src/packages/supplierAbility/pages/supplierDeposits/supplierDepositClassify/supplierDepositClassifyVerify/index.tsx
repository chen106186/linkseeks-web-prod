/*
 * @Description: 待审核入库资料
 */
import React, { useState, useEffect } from 'react'
import { useRouter, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import { Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { getMemberMobileDepositClassifyDetail } from '@apps/apis'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { setDepositClassifyPartnerTypesStorage } from '../../../../common/utils/pageStockRefreshUtil'
import SupplierProfile, { SupplierDetailsType } from '../../../../components/SupplierProfile'
import SpaceshipWrap from '../../../../components/SpaceshipWrap'
import './index.scss'

type SupplierDepositClassifyVerifyRouteParams = {
  /**
   * 会员审核id
   */
  validateId?: string
}

const SupplierDepositClassifyVerify: React.FC = () => {
  const router = useRouter<SupplierDepositClassifyVerifyRouteParams>()
  const {
    params: { validateId },
  } = router

  const [supplierDetails, setSupplierDepositDetails] = useState<SupplierDetailsType | undefined>(undefined)

  const fetchSupplierDepositDetails = () => {
    if (!validateId) {
      return
    }
    showLoading({ title: '正在加载...', mask: true })
    getMemberMobileDepositClassifyDetail({
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

  const handleJumpVerify = () => {
    setDepositClassifyPartnerTypesStorage(supplierDetails?.partnerTypes)
    Router.navigateTo('supplierAbility/supplierDeposits/supplierDepositClassify/supplierDepositClassifyVerifyConfirm', {
      validateId,
    })
  }

  return (
    <PageHeaderWrapper navTitle={supplierDetails?.innerStatusName}>
      <SupplierProfile details={supplierDetails} />
      <SpaceshipWrap>
        <Button type="primary" onClick={handleJumpVerify}>
          入库分类
        </Button>
      </SpaceshipWrap>
    </PageHeaderWrapper>
  )
}

export default SupplierDepositClassifyVerify

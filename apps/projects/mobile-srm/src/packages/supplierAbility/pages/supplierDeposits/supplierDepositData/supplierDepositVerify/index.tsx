/*
 * @Description: 待审核入库资料
 */
import React, { useState, useEffect, useRef } from 'react'
import { useRouter, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import { Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { getMemberMobileDepositVerifyDetail } from '@apps/apis'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { setDepositDetailsStorage } from '../../../../common/utils/pageStockRefreshUtil'
import SupplierProfile, { SupplierDetailsType } from '../../../../components/SupplierProfile'
import SpaceshipWrap from '../../../../components/SpaceshipWrap'
import './index.scss'

type SupplierDepositVerifyRouteParams = {
  /**
   * 会员审核id
   */
  validateId?: string
}

const SupplierDepositVerify: React.FC = () => {
  const router = useRouter<SupplierDepositVerifyRouteParams>()
  const {
    params: { validateId },
  } = router

  const [supplierDetails, setSupplierDepositDetails] = useState<SupplierDetailsType | undefined>(undefined)

  const depositDetailsCache = useRef<SupplierDetailsType['depositDetails'] | null>(null)

  const fetchSupplierDepositDetails = () => {
    if (!validateId) {
      return
    }
    showLoading({ title: '正在加载...', mask: true })
    getMemberMobileDepositVerifyDetail({
      validateId,
    })
      .then((res) => {
        if (res.code === 1000) {
          // 缓存入库资料
          depositDetailsCache.current = res.data.depositDetails as any
          // 重新赋值展示字段
          res.data.depositDetails = res.data.depositDetailTexts
          setSupplierDepositDetails(res.data as any)
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
    setDepositDetailsStorage({
      depositDetails: depositDetailsCache.current,
      depositQualities: supplierDetails?.qualities || [],
    })
    Router.navigateTo('supplierAbility/supplierDeposits/supplierDepositData/supplierDepositVerifyConfirm', {
      validateId,
    })
  }

  return (
    <PageHeaderWrapper navTitle={supplierDetails?.innerStatusName}>
      <SupplierProfile details={supplierDetails} />
      <SpaceshipWrap>
        <Button type="primary" onClick={handleJumpVerify}>
          审核入库资料
        </Button>
      </SpaceshipWrap>
    </PageHeaderWrapper>
  )
}

export default SupplierDepositVerify

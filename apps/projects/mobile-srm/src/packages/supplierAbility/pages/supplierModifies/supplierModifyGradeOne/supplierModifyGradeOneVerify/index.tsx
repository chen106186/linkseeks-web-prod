/*
 * @Description: 待审核变更(一级)
 */
import React, { useState, useEffect } from 'react'
import { useRouter, showLoading, hideLoading, showToast } from '@apps/mobile-services/utils/taro'
import { Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { getMemberMobileModityGradeOneDetail, postMemberMobileModityGradeOne } from '@apps/apis'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import VerifyPopup, { VerifySubmitValueType } from '@/components/VerifyPopup'
import { setModifiesRefreshStorage } from '../../../../common/utils/pageStockRefreshUtil'
import useVerifyAgree from '../../../../common/hooks/useVerifyAgree'
import SupplierProfile, { SupplierDetailsType } from '../../../../components/SupplierProfile'
import SpaceshipWrap from '../../../../components/SpaceshipWrap'
import './index.scss'

type SupplierModifyGradeOneVerifyRouteParams = {
  /**
   * 会员审核id
   */
  validateId?: string
}

const SupplierModifyGradeOneVerify: React.FC = () => {
  const router = useRouter<SupplierModifyGradeOneVerifyRouteParams>()
  const {
    params: { validateId },
  } = router

  const [supplierDetails, setSupplierDepositDetails] = useState<SupplierDetailsType | undefined>(undefined)
  const [visibleVerfiyPopup, setVisibleVerfiyPopup] = useState(false)

  const { agree, toggle } = useVerifyAgree()

  const fetchSupplierDepositDetails = () => {
    if (!validateId) {
      return
    }
    showLoading({ title: '正在加载...', mask: true })
    getMemberMobileModityGradeOneDetail({
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

  const handleVisibleVerfiyPopup = (flag?: boolean) => {
    setVisibleVerfiyPopup(!!flag)
  }

  const handleVerifyConfirm = (values: VerifySubmitValueType) => {
    handleVisibleVerfiyPopup(false)

    showLoading({ title: '正在提交...', mask: true })
    // 暂无渠道信息
    postMemberMobileModityGradeOne({
      validateId: +validateId!,
      ...values,
    })
      .then((res) => {
        if (res.code === 1000) {
          showToast({ title: '操作成功', icon: 'none' })
          // 设置列表刷新标识
          setModifiesRefreshStorage(true)
          setTimeout(() => {
            Router.navigateBack()
          }, 1000)
        }
      })
      .finally(() => {
        // 在真机如果出现了 Toast 会消失的很快
        // hideLoading();
      })
  }

  const handleVerify = (flag: boolean) => {
    toggle(flag)
    handleVisibleVerfiyPopup(true)
  }

  return (
    <PageHeaderWrapper navTitle={supplierDetails?.innerStatusName}>
      <SupplierProfile details={supplierDetails} showDepositNew />
      <VerifyPopup
        visible={visibleVerfiyPopup}
        agree={agree}
        onClose={() => handleVisibleVerfiyPopup(false)}
        onConfirm={handleVerifyConfirm}
      />
      <SpaceshipWrap>
        <Button onClick={() => handleVerify(false)}>审核不通过</Button>
        <Button type="primary" onClick={() => handleVerify(true)}>
          审核通过
        </Button>
      </SpaceshipWrap>
    </PageHeaderWrapper>
  )
}

export default SupplierModifyGradeOneVerify

/*
 * @Description: 入库分类
 */
import React, { useEffect, useRef, useState } from 'react'
import { useRouter, showLoading, showToast } from '@apps/mobile-services/utils/taro'
import { View, Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { postMemberMobileDepositClassify } from '@apps/apis'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import VerifyPopup, { VerifySubmitValueType } from '@/components/VerifyPopup'
import {
  getDepositClassifyPartnerTypesStorage,
  removeDepositClassifyPartnerTypesStorage,
  setDepositsRefreshStorage,
} from '../../../../common/utils/pageStockRefreshUtil'
import useVerifyAgree from '../../../../common/hooks/useVerifyAgree'
import SpaceshipWrap from '../../../../components/SpaceshipWrap'
import SupplierClassifyForm, {
  SupplierClassifySubmitValuesType,
  SupplierClassifyFormRef,
  PartnerTypes,
} from '../../../../components/SupplierClassifyForm'
import './index.scss'

type SupplierDepositClassifyVerifyConfirmRouteParams = {
  /**
   * 会员审核id
   */
  validateId?: string
}

const SupplierDepositClassifyVerifyConfirm: React.FC = () => {
  const router = useRouter<SupplierDepositClassifyVerifyConfirmRouteParams>()
  const {
    params: { validateId },
  } = router

  const [partnerTypes, setPartnerTypes] = useState<PartnerTypes>([])
  const [visibleVerfiyPopup, setVisibleVerfiyPopup] = useState(false)

  const supplierClassifyFormRef = useRef<SupplierClassifyFormRef | null>(null)

  const classifyValue = useRef<SupplierClassifySubmitValuesType | null>(null)

  const { agree, toggle } = useVerifyAgree()

  const getDepositClassifyPartnerTypes = () => {
    if (!validateId) {
      return
    }
    const partnerTypesCache = getDepositClassifyPartnerTypesStorage()
    if (partnerTypesCache) {
      setPartnerTypes(
        partnerTypesCache
          .map((item) => ({
            label: item.text,
            value: item.id,
          }))
          .filter((item) => item.value),
      )
    }
  }

  useEffect(() => {
    getDepositClassifyPartnerTypes()
  }, [])

  const handleVisibleVerfiyPopup = (flag?: boolean) => {
    setVisibleVerfiyPopup(!!flag)
  }

  const handleSubmit = () => {
    if (!validateId) {
      return
    }
    supplierClassifyFormRef.current?.submit()
  }

  const handleFinish = async (values: SupplierClassifySubmitValuesType) => {
    classifyValue.current = values
    handleVisibleVerfiyPopup(true)
  }

  const handleVerifyConfirm = (values: VerifySubmitValueType) => {
    if (!classifyValue.current) {
      return
    }
    handleVisibleVerfiyPopup(false)

    showLoading({ title: '正在提交...', mask: true })
    postMemberMobileDepositClassify({
      validateId: +validateId!,
      ...classifyValue.current,
      categories: classifyValue.current?.categories?.map((item) => {
        if (item.details[0]) {
          return {
            ...item,
            isDefault: 0,
          }
        } else {
          return {
            ...item,
            details: [],
            isDefault: 1,
          }
        }
      }),
      ...values,
    })
      .then((res) => {
        if (res.code === 1000) {
          showToast({ title: '操作成功', icon: 'none' })
          removeDepositClassifyPartnerTypesStorage()
          // 设置列表刷新标识
          setDepositsRefreshStorage(true)
          setTimeout(() => {
            Router.navigateBack({ delta: 2 })
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
    handleSubmit()
  }

  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar title="入库分类" />
        </>
      }
    >
      <View className="supplier-classify-confirm-section">
        <SupplierClassifyForm
          ref={supplierClassifyFormRef}
          partnerTypes={partnerTypes}
          onFinishCallback={handleFinish}
        />
      </View>
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
    </PageLayout>
  )
}

export default SupplierDepositClassifyVerifyConfirm

/*
 * @Description: 解除关系
 */
import React from 'react'
import { showToast, useRouter, showLoading } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { postMemberMobileMaintenanceEliminate } from '@apps/apis'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import { setActionsRefreshStorage } from '../../../common/utils/pageStockRefreshUtil'
import ActionForm, { ActionFormValues } from '../components/ActionForm'
import './index.scss'

type SuppliereLiminateRouteParams = {
  /**
   * 会员审核id
   */
  validateId?: string
}

const SuppliereLiminate: React.FC = () => {
  const router = useRouter<SuppliereLiminateRouteParams>()
  const {
    params: { validateId },
  } = router

  const handleSubmit = (values: ActionFormValues) => {
    if (!validateId) {
      return
    }
    showLoading({ title: '正在提交...' })
    postMemberMobileMaintenanceEliminate({
      validateId: +validateId,
      date: values.date,
      reason: values.remark,
    })
      .then((res) => {
        if (res.code === 1000) {
          showToast({ title: '操作成功', icon: 'none' })
          // 设置列表刷新标识
          setActionsRefreshStorage(true)
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

  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar title="解除关系" />
        </>
      }
    >
      <View className="supplier-eliminate-section">
        <ActionForm actionType="eliminate" onSubmit={handleSubmit} />
      </View>
    </PageLayout>
  )
}

export default SuppliereLiminate

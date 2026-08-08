/*
 * @Description: 新增供应商
 */
import React, { useRef } from 'react'
import {
  useRouter,
  showToast,
  disableAlertBeforeUnload,
  enableAlertBeforeUnload,
} from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { postMemberMobileImportAdd } from '@apps/apis'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import { setListRefreshStorage } from '@/packages/supplierAbility/common/utils/pageStockRefreshUtil'
import { supplierImportIndexKey } from '../const'
import SupplierForm, { SubmitValuesType } from '../components/SupplierForm'
import './index.scss'

type SupplierAddRouteParams = {}

const SupplierAdd: React.FC = () => {
  const router = useRouter<SupplierAddRouteParams>()
  const {
    params: {},
  } = router

  const alterLock = useRef(false)

  const handleFormValuesChange = () => {
    if (alterLock.current) {
      return
    }
    alterLock.current = true
    enableAlertBeforeUnload?.({
      message: '您还有未保存的内容，是否确定要离开？',
    })
  }

  const handleSupplierFormSubmit = (values: SubmitValuesType) => {
    // showLoading({ title: '正在提交...', mask: true })
    postMemberMobileImportAdd(values, {
      timeout: 0,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        disableAlertBeforeUnload?.()
        showToast({ title: '提交成功', icon: 'none' })
        // 设置列表刷新标识
        setListRefreshStorage(supplierImportIndexKey, true)
        setTimeout(() => {
          Router.navigateBack()
        }, 1000)
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
          <NavBar title="新增供应商" customClassName="supplier-add-nav" />
        </>
      }
    >
      <SupplierForm onSubmit={handleSupplierFormSubmit} onValuesChange={handleFormValuesChange} />
    </PageLayout>
  )
}

export default SupplierAdd

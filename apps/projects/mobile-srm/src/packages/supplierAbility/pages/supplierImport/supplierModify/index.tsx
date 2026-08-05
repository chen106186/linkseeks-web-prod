/*
 * @Description: 修改供应商
 */
import React, { useEffect, useState, useRef } from 'react'
import {
  useRouter,
  showToast,
  showLoading,
  hideLoading,
  enableAlertBeforeUnload,
  disableAlertBeforeUnload,
} from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { getMemberMobileImportGet, postMemberMobileImportUpdate } from '@apps/apis'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import {
  setDetailsRefreshStorage,
  setListRefreshStorage,
} from '@/packages/supplierAbility/common/utils/pageStockRefreshUtil'
import { supplierImportIndexKey } from '../const'
import SupplierForm, { SubmitValuesType, SupplierDetailsType } from '../components/SupplierForm'
import './index.scss'

type SupplierModifyRouteParams = {
  /**
   * 会员id
   */
  memberId?: string
  /**
   * 会员审核id
   */
  validateId?: string
}

const SupplierModify: React.FC = () => {
  const router = useRouter<SupplierModifyRouteParams>()
  const {
    params: { memberId, validateId },
  } = router

  const [supplierDetails, setSupplierDetails] = useState<SupplierDetailsType | undefined>(undefined)

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

  const fetchSupplierDetails = () => {
    if (!memberId || !validateId) {
      return
    }
    showLoading({ title: '正在加载...', mask: true })
    getMemberMobileImportGet({
      memberId,
      validateId,
    })
      .then((res) => {
        if (res.code === 1000) {
          const {
            memberTypeEnum,
            groups = [],
            level,
            areaCodes, // 渠道信息
            upperMemberId, // 渠道信息
            channelLevelTag, // 渠道信息
            channelTypeId, // 渠道信息
            remark, // 渠道信息
            levelId, // 等级id
            account,
            countryCode,
            createTime,
            currentStep,
            levelTag,
            memberId,
            memberTypeName,
            name,
            outerHistory,
            outerStatusName,
            roleName,
            verifySteps,
            outerStatus,
            status,
            statusName,
            ...rest
          } = res.data

          // 注册资料
          const detail: Record<string, any> = {}
          for (let i = 0; i < groups.length; i++) {
            const item = groups[i]
            if (item.elements) {
              for (let j = 0; j < item.elements.length; j++) {
                const ele = item.elements[j]
                if (ele.fieldType !== 'list') {
                  detail[ele.fieldName as string] = ele.fieldValue
                } else {
                  detail[ele.fieldName as string] = (ele.registers as [][])?.map((registersItem) => {
                    const itemValue = {}
                    registersItem?.forEach((field: any) => {
                      itemValue[field.fieldName] = field.fieldValue
                    })
                    return itemValue
                  })
                }
              }
            }
          }

          // TODO：此处缺少渠道相关处理逻辑，暂时不需要做

          setSupplierDetails({
            ...rest,
            memberTypeId: memberTypeEnum,
            // areas: areaCodes,
            // channelLevel: channelLevelTag,
            // upperRelationId: upperMemberId,
            // level: level || undefined,
            ...detail,
          })
          hideLoading()
        }
      })
      .finally(() => {
        // 在真机如果出现了 Toast 会消失的很快
        // hideLoading();
      })
  }

  useEffect(() => {
    fetchSupplierDetails()
  }, [])

  const handleSupplierFormSubmit = (values: SubmitValuesType) => {
    if (!memberId || !validateId) {
      return
    }
    showLoading({ title: '正在修改...', mask: true })
    postMemberMobileImportUpdate(
      {
        memberId: +memberId,
        validateId: +validateId,
        ...values,
      },
      {
        timeout: 0,
      },
    )
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        disableAlertBeforeUnload?.()
        showToast({ title: '修改成功', icon: 'none' })
        // 设置列表刷新标识
        setListRefreshStorage(supplierImportIndexKey, true)
        setDetailsRefreshStorage(true)
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
          <NavBar title="修改供应商" customClassName="supplier-add-nav" />
        </>
      }
    >
      <SupplierForm
        value={supplierDetails}
        onSubmit={handleSupplierFormSubmit}
        onValuesChange={handleFormValuesChange}
      />
    </PageLayout>
  )
}

export default SupplierModify

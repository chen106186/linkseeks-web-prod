/*
 * @Description: 供应商处理
 */
import React, { useEffect, useState } from 'react'
import { useDidShow, useRouter, pxTransform, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import { Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { themeLayout } from '@/constants/theme'
import { getMemberMobileMaintenanceDetail, GetMemberMobileMaintenanceDetailResponse } from '@apps/apis'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { getDetailsRefreshStorage } from '@/packages/supplierAbility/common/utils/pageStockRefreshUtil'
import { renderFieldTypeContent } from '../../../common/utils/createMemberSchemaUtil'
import BasicInfoCellListCard from '../../../components/BasicInfoCellListCard'
import CellListCard from '../../../components/CellListCard'
import SpaceshipWrap from '../../../components/SpaceshipWrap'
import SchoolCard from '../../../components/SchoolCard'
import './index.scss'

type SupplierActionsRouteParams = {
  /**
   * 会员审核id
   */
  validateId?: string
  /**
   * 是否显示“黑名单”按钮
   */
  showBlacklist?: string
  /**
   * 是否显示“淘汰”按钮
   */
  showEliminate?: string
  /**
   * 是否显示“冻结”按钮
   */
  showFreeze?: string
  /**
   * 是否显示“解冻”按钮
   */
  showUnfreeze?: string
}

const SupplierActions: React.FC = () => {
  const router = useRouter<SupplierActionsRouteParams>()
  const {
    params: {
      validateId,
      showBlacklist: defaultShowBlacklist,
      showEliminate: defaultShowEliminate,
      showFreeze: defaultShowFreeze,
      showUnfreeze: defaultShowUnfreeze,
    },
  } = router

  const [supplierDetails, setSupplierActions] = useState<GetMemberMobileMaintenanceDetailResponse | undefined>(
    undefined,
  )
  const [showBlacklist] = useState(defaultShowBlacklist === 'true')
  const [showEliminate] = useState(defaultShowEliminate === 'true')
  const [showFreeze] = useState(defaultShowFreeze === 'true')
  const [showUnfreeze] = useState(defaultShowUnfreeze === 'true')

  const fetchSupplierActions = () => {
    if (!validateId) {
      return
    }
    showLoading({ title: '正在加载...', mask: true })
    getMemberMobileMaintenanceDetail({
      validateId,
    })
      .then((res) => {
        if (res.code === 1000) {
          setSupplierActions(res.data)
          hideLoading()
        }
      })
      .finally(() => {
        // 在真机如果出现了 Toast 会消失的很快
        // hideLoading();
      })
  }

  useEffect(() => {
    fetchSupplierActions()
  }, [])

  useDidShow(() => {
    const detailsRefresh = getDetailsRefreshStorage()
    if (detailsRefresh) {
      fetchSupplierActions()
    }
  })

  const handleJumpBlack = () => {
    if (!validateId) {
      return
    }
    Router.navigateTo('supplierAbility/supplierManagement/supplierBlack', {
      validateId,
    })
  }

  const handleJumpFreeze = () => {
    if (!validateId) {
      return
    }
    Router.navigateTo('supplierAbility/supplierManagement/supplierFreeze', {
      validateId,
    })
  }

  const handleJumpUnFreeze = () => {
    if (!validateId) {
      return
    }
    Router.navigateTo('supplierAbility/supplierManagement/supplierUnFreeze', {
      validateId,
    })
  }

  const handleJumpLiminate = () => {
    if (!validateId) {
      return
    }
    Router.navigateTo('supplierAbility/supplierManagement/suppliereLiminate', {
      validateId,
    })
  }

  return (
    <PageHeaderWrapper navTitle={supplierDetails?.outerStatusName}>
      {/* 校张 */}
      <SchoolCard
        data={{
          name: supplierDetails?.name,
          memberId: supplierDetails?.memberId,
          statusName: supplierDetails?.statusName,
        }}
      />
      {/* 基本信息 */}
      <BasicInfoCellListCard
        data={{
          memberId: supplierDetails?.memberId,
          memberTypeName: supplierDetails?.memberTypeName,
          account: supplierDetails?.account,
          name: supplierDetails?.name,
          roleName: supplierDetails?.roleName,
          phone: supplierDetails?.phone,
          outerStatus: supplierDetails?.outerStatus,
          outerStatusName: supplierDetails?.outerStatusName,
          levelTag: supplierDetails?.levelTag,
          email: supplierDetails?.email,
          createTime: supplierDetails?.registerTime,
        }}
        style={{
          marginTop: pxTransform(themeLayout['padding-xs']),
        }}
      />
      {/* 渠道信息暂无 */}
      {/* 注册资料 */}
      {supplierDetails?.groups?.map((item, index) => (
        <CellListCard
          key={index}
          title={item.groupName}
          dataSource={item.elements?.map((element) => ({
            title: element.fieldLocalName,
            value:
              element.fieldType !== 'list' ? renderFieldTypeContent(element.fieldType!, element.fieldValue) : undefined,
            label:
              element.fieldType === 'list'
                ? renderFieldTypeContent(
                    element.fieldType!,
                    element.fieldValue,
                    element.fieldLocalName,
                    element.registers,
                  )
                : undefined,
          }))}
          style={{
            marginTop: pxTransform(themeLayout['padding-xs']),
          }}
        />
      ))}
      <SpaceshipWrap full={false} align="right">
        {showBlacklist ? <Button onClick={handleJumpBlack}>拉入黑名单</Button> : null}
        {showEliminate ? <Button onClick={handleJumpLiminate}>解除关系</Button> : null}
        {showFreeze ? <Button onClick={handleJumpFreeze}>冻结</Button> : null}
        {showUnfreeze ? <Button onClick={handleJumpUnFreeze}>解冻</Button> : null}
      </SpaceshipWrap>
    </PageHeaderWrapper>
  )
}

export default SupplierActions

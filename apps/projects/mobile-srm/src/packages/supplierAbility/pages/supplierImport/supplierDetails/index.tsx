/*
 * @Description: 供应商详情
 */
import React, { useEffect, useState } from 'react'
import {
  useRouter,
  showToast,
  pxTransform,
  showLoading,
  hideLoading,
  useDidShow,
  showModal,
} from '@apps/mobile-services/utils/taro'
import { Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { themeLayout } from '@/constants/theme'
import {
  getMemberMobileImportDetail,
  postMemberMobileImportCommit,
  postMemberMobileImportDelete,
  GetMemberMobileImportDetailResponse,
} from '@apps/apis'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import {
  getDetailsRefreshStorage,
  setListRefreshStorage,
} from '@/packages/supplierAbility/common/utils/pageStockRefreshUtil'
import { supplierImportIndexKey } from '../const'
import { renderFieldTypeContent } from '../../../common/utils/createMemberSchemaUtil'
import BasicInfoCellListCard from '../../../components/BasicInfoCellListCard'
import CellListCard from '../../../components/CellListCard'
import SpaceshipWrap from '../../../components/SpaceshipWrap'
import SchoolCard from '../../../components/SchoolCard'
import './index.scss'

type SupplierDetailsRouteParams = {
  /**
   * 会员id
   */
  memberId?: string
  /**
   * 会员审核id
   */
  validateId?: string
  /**
   * 是否显示删除按钮
   */
  showDelete?: string
  /**
   * 是否显示修改按钮
   */
  showUpdate?: string
  /**
   * 是否显示提交按钮
   */
  showCommit?: string
}

const SupplierDetails: React.FC = () => {
  const router = useRouter<SupplierDetailsRouteParams>()
  const {
    params: { memberId, validateId, showDelete, showUpdate: defaultShowUpdate, showCommit: defaultShowCommit },
  } = router

  const [supplierDetails, setSupplierDetails] = useState<GetMemberMobileImportDetailResponse | undefined>(undefined)
  const [showUpdate, setShowUpdate] = useState(defaultShowUpdate === 'true')
  const [showCommit, setShowCommit] = useState(defaultShowCommit === 'true')

  const fetchSupplierDetails = () => {
    if (!memberId || !validateId) {
      return
    }
    showLoading({ title: '正在加载...', mask: true })
    getMemberMobileImportDetail({
      memberId,
      validateId,
    })
      .then((res) => {
        if (res.code === 1000) {
          setSupplierDetails(res.data)
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

  useDidShow(() => {
    const detailsRefresh = getDetailsRefreshStorage()
    if (detailsRefresh) {
      fetchSupplierDetails()
    }
  })

  const handleDelete = () => {
    if (!memberId || !validateId) {
      return
    }
    showModal({
      title: '',
      confirmText: '确认',
      cancelText: '取消',
      content: '确定要删除吗？',
      success: (result: Taro.showModal.SuccessCallbackResult) => {
        if (result.confirm) {
          return new Promise<void>((resolve) => {
            postMemberMobileImportDelete({
              memberId: +memberId,
              validateId: +validateId,
            })
              .then((res) => {
                if (res.code === 1000) {
                  // 设置列表刷新标识
                  setListRefreshStorage(supplierImportIndexKey, true)
                  Router.navigateBack()
                  resolve()
                } else {
                  resolve()
                }
              })
              .catch(() => {
                resolve()
              })
          })
        }
      },
    })
  }

  const handleJumpModify = () => {
    if (!memberId || !validateId) {
      return
    }
    Router.navigateTo('supplierAbility/supplierImport/supplierModify', {
      memberId,
      validateId,
    })
  }

  const handleCommit = () => {
    if (!memberId || !validateId) {
      return
    }
    showLoading({ title: '正在提交...' })
    postMemberMobileImportCommit({
      memberId: +memberId,
      validateId: +validateId,
    })
      .then((res) => {
        if (res.code === 1000) {
          showToast({ title: '操作成功', icon: 'none' })
          setListRefreshStorage(supplierImportIndexKey, true)
          setShowCommit(false)
          setShowUpdate(false)
        }
      })
      .finally(() => {
        // 在真机如果出现了 Toast 会消失的很快
        // hideLoading();
      })
  }

  return (
    <PageHeaderWrapper navTitle={supplierDetails?.outerStatusName}>
      {/* 校张 */}
      <SchoolCard
        data={{
          name: supplierDetails?.name,
          memberId: supplierDetails?.memberId,
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
          createTime: supplierDetails?.createTime,
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
        {showDelete === 'true' ? <Button onClick={handleDelete}>删除</Button> : null}
        {showUpdate ? <Button onClick={handleJumpModify}>修改</Button> : null}
        {showCommit ? (
          <Button type="primary" onClick={handleCommit}>
            提交审核
          </Button>
        ) : null}
      </SpaceshipWrap>
    </PageHeaderWrapper>
  )
}

export default SupplierDetails

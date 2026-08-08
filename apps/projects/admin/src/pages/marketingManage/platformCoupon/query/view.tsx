/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 09:49:42
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-26 18:12:40
 * @Description: 商家优惠券查询
 */
import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import moment from 'moment'
import { EyeAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import {
  getMarketingCouponPlatformSummaryPage,
  postMarketingCouponPlatformSummaryCancel,
  postMarketingCouponPlatformSummaryRestart,
  postMarketingCouponPlatformSummaryStop,
  postMarketingCouponPlatformWaitAuditModification,
} from '@apps/apis'
import type { ActionModalType, ActionModalValueType } from './components/ActionModal'
import ActionModal from './components/ActionModal'
import useSelectOptions from './services/hooks/useSelectOptions'

type fetchParams = {
  name: string
  id: number
  effectiveTimeStart: string | number
  effectiveTimeEnd: string | number
  releaseTimeStart: string | number
  releaseTimeEnd: string | number
  type: number
  getWay: number
  status: number
}

const fetchData = async (params: fetchParams) => {
  const payload = { ...params }
  const res = await getMarketingCouponPlatformSummaryPage(payload as any)
  return res.data
}

const PlatformCouponQuery: React.FC = () => {
  const [visibleActionModal, setVisibleActionModal] = useState(false)
  const [actionModalType, setActionModalType] = useState<ActionModalType>('cancel')
  const [actionModalConfirmLoading, setActionModalConfirmLoading] = useState(false)
  const [actionModalValue, setActionModalValue] = useState<ActionModalValueType>({ id: 0 })

  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()

  const handleShowActionModal = (modalType: ActionModalType, value: ActionModalValueType) => {
    setActionModalType(modalType)
    setVisibleActionModal(true)
    setActionModalValue(value)
  }

  const defaultColumns: RecordColumns<any>[] = [
    {
      title: 'ID',
      key: 'id',
      fixed: 'left',
      searchField: {
        title: '优惠券ID',
        type: 'Input',
      },
      width: 60,
    },
    {
      title: '优惠券名称',
      key: 'name',
      searchField: {
        main: true,
      },
      fixed: 'left',
      render: (text, record) => (
        <EyeAuthButton url={`/marketingManage/platformCoupon/query/detail?id=${record.id}`}>{text}</EyeAuthButton>
      ),
    },
    {
      title: '优惠券类型',
      key: 'typeName',
      searchField: {
        name: 'type',
        type: 'Select',
      },
    },
    {
      title: '领(发)券起始时间',
      key: 'releaseTimeStart',
      searchField: {
        type: 'DateRange',
        title: '领(发)券时间',
        name: ['releaseTimeStart', 'releaseTimeEnd'],
        placeholder: ['领(发)券起始时间', '领(发)券结束时间'],
      },
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '领(发)券截止时间',
      key: 'releaseTimeEnd',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '券有效期起始时间',
      key: 'effectiveTimeStart',
      searchField: {
        type: 'DateRange',
        title: '券有效期时间',
        name: ['effectiveTimeStart', 'effectiveTimeEnd'],
        placeholder: ['券有效起始时间', '券有效结束时间'],
      },
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '券有效期截止时间',
      key: 'effectiveTimeEnd',
      render: (text, record) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : `领取${record.invalidDay}天后失效`,
    },
    {
      title: '领券方式',
      key: 'getWayName',
      searchField: {
        name: 'getWay',
        type: 'Select',
      },
    },
    {
      title: '券面额',
      key: 'denomination',
    },
    {
      title: '发券数量',
      key: 'quantity',
    },
    {
      title: '内部状态',
      key: 'statusName',
      searchField: {
        name: 'status',
        type: 'Select',
      },
    },
    {
      title: '操作',
      key: 'option',
      render: (_, record) => (
        <>
          <AuthButton type="custom" code="cancel">
            {record.cancel && (
              <Button type="link" onClick={() => handleShowActionModal('cancel', { id: record.id })}>
                取消
              </Button>
            )}
          </AuthButton>
          <AuthButton type="custom" code="restart">
            {record.restart && (
              <Button type="link" onClick={() => handleShowActionModal('startUp', { id: record.id })}>
                重启
              </Button>
            )}
          </AuthButton>
          <AuthButton type="custom" code="edit">
            {record.update && (
              <Button
                type="link"
                onClick={() =>
                  handleShowActionModal('edit', {
                    id: record.id,
                    releaseTimeStart: moment(record.releaseTimeStart).format('YYYY-MM-DD HH:mm:ss'),
                    releaseTimeEnd: moment(record.releaseTimeEnd).format('YYYY-MM-DD HH:mm:ss'),
                    quantity: `${record.quantity}`,
                  })
                }
              >
                修改
              </Button>
            )}
          </AuthButton>
          <AuthButton type="custom" code="stop">
            {record.stop && (
              <Button type="link" onClick={() => handleShowActionModal('stop', { id: record.id })}>
                终止
              </Button>
            )}
          </AuthButton>
        </>
      ),
    },
  ]

  const handleActionConfirm = (values: any, modalType: ActionModalType) => {
    switch (modalType) {
      case 'cancel': {
        setActionModalConfirmLoading(true)
        postMarketingCouponPlatformSummaryCancel(values)
          .then((res) => {
            if (res.code === 1000) {
              setVisibleActionModal(false)
              ref.current.reload()
            }
          })
          .finally(() => {
            setActionModalConfirmLoading(false)
          })
        break
      }
      case 'startUp': {
        setActionModalConfirmLoading(true)
        postMarketingCouponPlatformSummaryRestart(values)
          .then((res) => {
            if (res.code === 1000) {
              setVisibleActionModal(false)
              ref.current.reload()
            }
          })
          .finally(() => {
            setActionModalConfirmLoading(false)
          })
        break
      }
      case 'stop': {
        setActionModalConfirmLoading(true)
        postMarketingCouponPlatformSummaryStop(values)
          .then((res) => {
            if (res.code === 1000) {
              setVisibleActionModal(false)
              ref.current.reload()
            }
          })
          .finally(() => {
            setActionModalConfirmLoading(false)
          })
        break
      }
      case 'edit': {
        setActionModalConfirmLoading(true)
        postMarketingCouponPlatformWaitAuditModification(values)
          .then((res) => {
            if (res.code === 1000) {
              setVisibleActionModal(false)
              ref.current.reload()
            }
          })
          .finally(() => {
            setActionModalConfirmLoading(false)
          })
        break
      }

      default:
        break
    }
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={defaultColumns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        searchSelectMaps={selectData}
      />
      <ActionModal
        visible={visibleActionModal}
        modalName={actionModalType}
        onClose={() => setVisibleActionModal(false)}
        value={actionModalValue}
        onConfirm={handleActionConfirm}
        submitLoading={actionModalConfirmLoading}
      />
    </PageHeaderWrapper>
  )
}

export default PlatformCouponQuery

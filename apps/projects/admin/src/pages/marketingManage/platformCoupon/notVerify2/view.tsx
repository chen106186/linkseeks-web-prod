/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 11:09:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-03 17:12:37
 * @Description: 待审核商家优惠券(二级)
 */
import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button, Modal, message } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import commonColumn from '../common/columns/coupon'
import {
  getMarketingCouponPlatformWaitAuditTwoPage,
  postMarketingCouponPlatformWaitAuditTwoAuditBatch,
} from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'

const { confirm } = Modal

const PlatformCouponNotVerify2: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()

  const fetchData = async (params: any) => {
    const payload = { ...params }
    const daterang = payload['[effectiveTimeStart,effectiveTimeEnd]']
    if (daterang?.length > 0) {
      payload.effectiveTimeStart = daterang[0]
      payload.effectiveTimeEnd = daterang[1]
    }
    delete payload['[effectiveTimeStart,effectiveTimeEnd]']
    const res = await getMarketingCouponPlatformWaitAuditTwoPage(payload as any)
    return res.data
  }

  const defaultColumns: RecordColumns<any>[] = commonColumn('/marketingManage/platformCoupon/notVerify2/detail', [
    'releaseTime',
  ]).concat([
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (_, record) => (
        <>
          <AuthButton type="custom" code="verify">
            <Button
              type="link"
              onClick={() => history.push(`/marketingManage/platformCoupon/notVerify2/verify?id=${record.id}`)}
            >
              审核
            </Button>
          </AuthButton>
        </>
      ),
    },
  ])

  const handleBatchVerify = () => {
    if (!ref.current?.selectionKeys?.length) {
      message.warning('未选择任何优惠券')
      return
    }
    confirm({
      title: '提示',
      icon: <QuestionCircleOutlined />,
      content: '确定要通过选中的优惠券吗？',
      onOk() {
        return new Promise<void>((resolve, reject) => {
          postMarketingCouponPlatformWaitAuditTwoAuditBatch({
            idList: ref.current?.selectionKeys,
          })
            .then((res) => {
              if (res.code === 1000) {
                ref.current.reload()
                resolve()
              }
              reject()
            })
            .catch(() => {
              reject()
            })
        })
      },
    })
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
        isRowSelection
        searchButtons={[
          {
            key: 'verifyBatch',
            children: '批量审核通过',
            onClick() {
              handleBatchVerify()
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default PlatformCouponNotVerify2

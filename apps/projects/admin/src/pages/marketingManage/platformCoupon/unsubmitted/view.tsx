/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 11:08:16
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-03 16:50:55
 * @Description: 待提交审核商家优惠券
 */
import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button, message, Modal } from 'antd'
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { AuthButton, EditAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import {
  getMarketingCouponPlatformWaitAuditPage,
  postMarketingCouponPlatformWaitAuditDelete,
  postMarketingCouponPlatformWaitAuditSubmitBatch,
} from '@apps/apis'
import commonColumn from '../common/columns/coupon'
import useSelectOptions from './services/hooks/useSelectOptions'

const { confirm } = Modal

type fetchParams = {
  name: string
  id: number
  effectiveTimeStart: string | number
  effectiveTimeEnd: string | number
  type: number
}

const PlatformCouponUnSubmitted: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()

  const fetchData = async (params: fetchParams) => {
    const payload = { ...params }
    const daterang = payload['[effectiveTimeStart,effectiveTimeEnd]']
    if (daterang?.length > 0) {
      payload.effectiveTimeStart = daterang[0]
      payload.effectiveTimeEnd = daterang[1]
    }
    delete payload['[effectiveTimeStart,effectiveTimeEnd]']
    const res = await getMarketingCouponPlatformWaitAuditPage(payload as any)
    return res.data
  }

  const handleCommit = (ids: number[]) => {
    const mesInstance = message.loading({
      content: '正在提交',
      duration: 0,
    })
    postMarketingCouponPlatformWaitAuditSubmitBatch({
      idList: ids,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        ref.current.reload()
      })
      .finally(() => {
        mesInstance()
      })
  }

  const handleDelete = (ids: number[]) => {
    const mesInstance = message.loading({
      content: '正在删除',
      duration: 0,
    })
    postMarketingCouponPlatformWaitAuditDelete({
      idList: ids,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        ref.current.reload()
      })
      .finally(() => {
        mesInstance()
      })
  }

  const defaultColumns: RecordColumns<any>[] = commonColumn('/marketingManage/platformCoupon/unsubmitted/detail', [
    'releaseTime',
  ]).concat([
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (_, record) => (
        <>
          <AuthButton type="custom" code="submit">
            {record.submit && (
              <Button type="link" onClick={() => handleCommit([record.id])}>
                提交
              </Button>
            )}
          </AuthButton>
          <EditAuthButton>
            {record.update && (
              <Button
                type="link"
                onClick={() => history.push(`/marketingManage/platformCoupon/unsubmitted/edit?id=${record.id}`)}
              >
                修改
              </Button>
            )}
          </EditAuthButton>
          <AuthButton type="custom" code="delete">
            {record.delete && (
              <Button type="link" onClick={() => handleDelete([record.id])}>
                删除
              </Button>
            )}
          </AuthButton>
        </>
      ),
    },
  ])

  const handleBatchCommit = () => {
    if (!ref.current?.selectionKeys?.length) {
      message.warning('未选择任何优惠券')
      return
    }
    confirm({
      title: '提示',
      icon: <QuestionCircleOutlined />,
      content: '确定要提交选中的优惠券吗？',
      onOk() {
        return new Promise<void>((resolve, reject) => {
          postMarketingCouponPlatformWaitAuditSubmitBatch({
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

  const handleBatchDelete = () => {
    if (!ref.current?.selectionKeys?.length) {
      message.warning('未选择任何优惠券')
      return
    }
    confirm({
      title: '提示',
      icon: <QuestionCircleOutlined />,
      content: '确定要删除选中的优惠券吗？',
      onOk() {
        return new Promise<void>((resolve, reject) => {
          postMarketingCouponPlatformWaitAuditDelete({
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
            key: 'add',
            children: '新增优惠券',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick() {
              history.push('/marketingManage/platformCoupon/unsubmitted/add')
            },
          },
          {
            key: 'submitBatch',
            children: '批量提交',
            onClick() {
              handleBatchCommit()
            },
          },
          {
            key: 'deleteBatch',
            children: '批量删除',
            onClick() {
              handleBatchDelete()
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default PlatformCouponUnSubmitted

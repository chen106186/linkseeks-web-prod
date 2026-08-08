/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 11:08:16
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-02 15:19:32
 * @Description: 待提交审核商家优惠券
 */
import React, { useState, useRef } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Card, Space, Button, message, Modal } from 'antd'
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { DatePicker } from '@apps/formily'
import moment from 'moment'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import NiceForm from '@/components/NiceForm'
import {
  getMarketingCouponTypeList,
  getMarketingCouponWaitAuditPage,
  GetMarketingCouponWaitAuditPageResponseDetail,
  postMarketingCouponWaitAuditDelete,
  postMarketingCouponWaitAuditSubmitBatch,
} from '@apps/apis'
import useSpliceArray from '@/hooks/useSpliceArray'
import { querySchema } from './schema'
import commonColumn from '../common/columns/coupon'
import { AuthButton } from '@apps/components'

const { confirm } = Modal

const formActions = createFormActions()

type fetchParams = {
  name: string
  id: number
  effectiveTimeStart: string | number
  effectiveTimeEnd: string | number
  type: number
}

const MerchantCouponUnsubmitted: React.FC = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])

  const fetchData = async (params: fetchParams) => {
    const { effectiveTimeStart = null, effectiveTimeEnd = null } = params
    const newParams: fetchParams = { ...params }

    if (effectiveTimeStart) {
      newParams.effectiveTimeStart = moment(effectiveTimeStart).valueOf()
    }
    if (effectiveTimeEnd) {
      newParams.effectiveTimeEnd = moment(effectiveTimeEnd).valueOf()
    }
    let res = await getMarketingCouponWaitAuditPage(newParams as any)
    return res.data
  }

  const handleCommit = (ids: number[]) => {
    const mesInstance = message.loading({
      content: `${intl.formatMessage({ id: 'merchantCoupon.Submitting' })}`,
      duration: 0,
    })
    postMarketingCouponWaitAuditSubmitBatch({
      idList: ids,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        ref.current.reloadCurrent()
      })
      .finally(() => {
        mesInstance()
      })
  }

  const handleDelete = (ids: number[]) => {
    const mesInstance = message.loading({
      content: `${intl.formatMessage({ id: 'merchantCoupon.Deleting' })}`,
      duration: 0,
    })
    postMarketingCouponWaitAuditDelete({
      idList: ids,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        ref.current.reloadCurrent()
      })
      .finally(() => {
        mesInstance()
      })
  }

  const defaultColumns: ColumnType<GetMarketingCouponWaitAuditPageResponseDetail>[] = commonColumn().concat([
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.operation' })}`,
      dataIndex: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          {record.submit && (
            <AuthButton type="custom" code="submit">
              <Button type="link" onClick={() => handleCommit([record.id])}>
                {intl.formatMessage({ id: 'merchantCoupon.submit' })}
              </Button>
            </AuthButton>
          )}
          {record.update && (
            <AuthButton type="edit" code="edit">
              <Button
                type="link"
                onClick={() => history.push(`/marketingAbility/merchantCoupon/unsubmitted/edit?id=${record.id}`)}
              >
                {intl.formatMessage({ id: 'merchantCoupon.Revise' })}
              </Button>
            </AuthButton>
          )}
          {record.delete && (
            <AuthButton type="custom" code="del">
              <Button type="link" onClick={() => handleDelete([record.id])}>
                {intl.formatMessage({ id: 'merchantCoupon.delete' })}
              </Button>
            </AuthButton>
          )}
        </>
      ),
    },
  ])
  const [columns, columnsHandle] = useSpliceArray<ColumnType<any>>(defaultColumns)

  const rowSelection = {
    onChange: (keys: number[]) => {
      setSelectedRowKeys(keys)
    },
    selectedRowKeys: selectedRowKeys,
    getCheckboxProps: (record: GetMarketingCouponWaitAuditPageResponseDetail) => ({
      disabled: record.status !== 1, // 状态不等于待提交审核的禁用
    }),
  }

  // 初始化高级筛选选项
  const fetchTypeEnums = async () => {
    const res = await getMarketingCouponTypeList()

    if (res.code === 1000) {
      const { data = [] } = res

      return {
        type: data.map((item) => ({ label: item.name, value: item.value })),
      }
    }
    return {}
  }

  const handleBatchCommit = () => {
    if (!selectedRowKeys.length) {
      message.warning(`${intl.formatMessage({ id: 'merchantCoupon.Nocouponsareselected' })}`)
      return
    }
    confirm({
      title: `${intl.formatMessage({ id: 'merchantCoupon.tip' })}`,
      icon: <QuestionCircleOutlined />,
      content: `${intl.formatMessage({ id: 'merchantCoupon.sureSubmitChosenCoupon' })}`,
      onOk() {
        return new Promise<void>((resolve, reject) => {
          postMarketingCouponWaitAuditSubmitBatch({
            idList: selectedRowKeys,
          })
            .then((res) => {
              if (res.code === 1000) {
                ref.current.reloadCurrent()
                setSelectedRowKeys([])
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
    if (!selectedRowKeys.length) {
      message.warning(`${intl.formatMessage({ id: 'merchantCoupon.Nocouponsareselected' })}?`)
      return
    }
    confirm({
      title: `${intl.formatMessage({ id: 'merchantCoupon.tip' })}`,
      icon: <QuestionCircleOutlined />,
      content: `${intl.formatMessage({ id: 'merchantCoupon.sureDeleteChosenCoupon' })}?`,
      onOk() {
        return new Promise<void>((resolve, reject) => {
          postMarketingCouponWaitAuditDelete({
            idList: selectedRowKeys,
          })
            .then((res) => {
              if (res.code === 1000) {
                ref.current.reloadCurrent()
                setSelectedRowKeys([])
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

  const ControllerBtns = () => (
    <Space size={16}>
      <AuthButton type="add" code="add">
        <Button type="primary" onClick={() => history.push('/marketingAbility/merchantCoupon/unsubmitted/add')}>
          <PlusOutlined />
          {intl.formatMessage({ id: 'merchantCoupon.Newcoupons' })}
        </Button>
      </AuthButton>
      <AuthButton type="custom" code="batchsubmit">
        <Button onClick={handleBatchCommit}>{intl.formatMessage({ id: 'merchantCoupon.Batchsubmission' })}</Button>
      </AuthButton>
      <AuthButton type="custom" code="batchdel">
        <Button onClick={handleBatchDelete}>{intl.formatMessage({ id: 'merchantCoupon.amountDelete' })}</Button>
      </AuthButton>
    </Space>
  )

  return (
    <Card>
      <StandardTable
        tableProps={{
          rowKey: 'id',
        }}
        columns={columns}
        currentRef={ref}
        fetchTableData={(params: any) => fetchData(params)}
        rowSelection={rowSelection}
        controlRender={
          <NiceForm
            actions={formActions}
            components={{
              ControllerBtns,
              RangePicker: DatePicker.RangePicker,
            }}
            onSubmit={(values) => ref.current.reload(values)}
            effects={($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              useAsyncInitSelect(['type'], fetchTypeEnums)
            }}
            schema={querySchema}
          />
        }
      />
    </Card>
  )
}

export default MerchantCouponUnsubmitted

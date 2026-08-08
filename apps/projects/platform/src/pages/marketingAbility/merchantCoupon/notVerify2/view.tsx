/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 11:09:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-01 17:08:13
 * @Description: 待审核商家优惠券(二级)
 */
import React, { useState, useRef } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Card, Space, Button, Modal, message } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { DatePicker } from '@apps/formily'
import moment from 'moment'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import NiceForm from '@/components/NiceForm'
import useSpliceArray from '@/hooks/useSpliceArray'
import verifySchema from '../common/schemas/verify'
import commonColumn from '../common/columns/coupon'
import {
  getMarketingCouponTypeList,
  getMarketingCouponWaitAuditTwoPage,
  postMarketingCouponWaitAuditTwoAuditBatch,
} from '@apps/apis'
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

const MerchantCouponNotVerify1: React.FC = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])

  const fetchData = async (params: any) => {
    const { effectiveTimeStart = null, effectiveTimeEnd = null } = params
    const newParams: fetchParams = { ...params }

    if (effectiveTimeStart) {
      newParams.effectiveTimeStart = moment(effectiveTimeStart).valueOf()
    }
    if (effectiveTimeEnd) {
      newParams.effectiveTimeEnd = moment(effectiveTimeEnd).valueOf()
    }
    let res = await getMarketingCouponWaitAuditTwoPage(newParams as any)
    return res.data
  }

  const defaultColumns = commonColumn('/marketingAbility/merchantCoupon/notVerify2/detail').concat([
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.operation' })}`,
      dataIndex: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          <AuthButton type="custom" code="verify">
            <Button
              type="link"
              onClick={() => history.push(`/marketingAbility/merchantCoupon/notVerify2/verify?id=${record.id}`)}
            >
              {intl.formatMessage({ id: 'merchantCoupon.Review' })}
            </Button>
          </AuthButton>
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

  const handleBatchVerify = () => {
    if (!selectedRowKeys.length) {
      message.warning(`${intl.formatMessage({ id: 'merchantCoupon.Nocouponsareselected' })}`)
      return
    }
    confirm({
      title: `${intl.formatMessage({ id: 'merchantCoupon.tip' })}`,
      icon: <QuestionCircleOutlined />,
      content: intl.formatMessage({ id: 'merchantCoupon.DeterminepassCoupon' }),
      onOk() {
        return new Promise<void>((resolve, reject) => {
          postMarketingCouponWaitAuditTwoAuditBatch({
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
      <AuthButton type="custom" code="batch">
        <Button onClick={handleBatchVerify}>{intl.formatMessage({ id: 'merchantCoupon.Batchauditpassed' })}</Button>
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
            schema={verifySchema}
          />
        }
      />
    </Card>
  )
}

export default MerchantCouponNotVerify1

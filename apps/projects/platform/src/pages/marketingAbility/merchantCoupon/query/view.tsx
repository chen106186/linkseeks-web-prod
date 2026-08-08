/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 09:49:42
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-30 17:00:59
 * @Description: 商家优惠券查询
 */
import { useIntl } from '@linkseeks/i18n'
import React, { useRef, useState } from 'react'
import { Card, Button } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { DatePicker } from '@apps/formily'
import moment from 'moment'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import {
  getMarketingCouponPageCondition,
  getMarketingCouponSummaryPage,
  GetMarketingCouponSummaryPageResponseDetail,
  postMarketingCouponSummaryCancel,
  postMarketingCouponSummaryRestart,
  postMarketingCouponSummaryStop,
  postMarketingCouponWaitAuditModification,
} from '@apps/apis'
import useSpliceArray from '@/hooks/useSpliceArray'
import { querySchema } from './schema'
import ActionModal, { ActionModalType, ActionModalValueType } from './components/ActionModal'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const formActions = createFormActions()

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
  const { effectiveTimeStart = null, effectiveTimeEnd = null, releaseTimeStart = null, releaseTimeEnd = null } = params
  const newParams: fetchParams = { ...params }

  if (effectiveTimeStart) {
    newParams.effectiveTimeStart = moment(effectiveTimeStart).valueOf()
  }
  if (effectiveTimeEnd) {
    newParams.effectiveTimeEnd = moment(effectiveTimeEnd).valueOf()
  }
  if (releaseTimeStart) {
    newParams.releaseTimeStart = moment(releaseTimeStart).valueOf()
  }
  if (releaseTimeEnd) {
    newParams.releaseTimeEnd = moment(releaseTimeEnd).valueOf()
  }
  let res = await getMarketingCouponSummaryPage(newParams as any)
  return res.data
}

const MerchantCouponQuery: React.FC = () => {
  const intl = useIntl()
  const [visibleActionModal, setVisibleActionModal] = useState(false)
  const [actionModalType, setActionModalType] = useState<ActionModalType>(undefined)
  const [actionModalConfirmLoading, setActionModalConfirmLoading] = useState(false)
  const [actionModalValue, setActionModalValue] = useState<ActionModalValueType>({ id: 0 })

  const ref = useRef<any>({})

  const handleShowActionModal = (modalType: ActionModalType, value: ActionModalValueType) => {
    setActionModalType(modalType)
    setVisibleActionModal(true)
    setActionModalValue(value)
  }

  const defaultColumns: ColumnType<GetMarketingCouponSummaryPageResponseDetail>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.couponName' })}`,
      dataIndex: 'name',
      align: 'center',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/marketingAbility/merchantCoupon/query/detail?id=${record.id}`}
          >
            {text}
          </EyeAuthButton>
        </DetailAuthButton>
      ),
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.DealsCoupontype' })}`,
      dataIndex: 'typeName',
      align: 'center',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.giveCouponStartTime' })}`,
      dataIndex: 'releaseTimeStart',
      align: 'center',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.giveCouponEndTime' })}`,
      dataIndex: 'releaseTimeEnd',
      align: 'center',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.effectiveTimeStart' })}`,
      dataIndex: 'effectiveTimeStart',
      align: 'center',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.effectiveTimeEnd' })}`,
      dataIndex: 'effectiveTimeEnd',
      align: 'center',
      render: (text, record) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : `领取${record.invalidDay}天后失效`,
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.getWayName' })}`,
      dataIndex: 'getWayName',
      align: 'center',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.denomination' })}`,
      dataIndex: 'denomination',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.Quantity' })}`,
      dataIndex: 'quantity',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.innerState' })}`,
      dataIndex: 'statusName',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.operation' })}`,
      dataIndex: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          {record.cancel && (
            <AuthButton type="custom" code="cancel">
              <Button type="link" onClick={() => handleShowActionModal('cancel', { id: record.id })}>
                {intl.formatMessage({ id: 'merchantCoupon.cancel' })}
              </Button>
            </AuthButton>
          )}
          {record.restart && (
            <AuthButton type="custom" code="restart">
              <Button type="link" onClick={() => handleShowActionModal('startUp', { id: record.id })}>
                {intl.formatMessage({ id: 'merchantCoupon.Restart' })}
              </Button>
            </AuthButton>
          )}
          {record.update && (
            <AuthButton type="custom" code="update">
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
                {intl.formatMessage({ id: 'merchantCoupon.Revise' })}
              </Button>
            </AuthButton>
          )}
          {record.stop && (
            <AuthButton type="custom" code="stop">
              <Button type="link" onClick={() => handleShowActionModal('stop', { id: record.id })}>
                {intl.formatMessage({ id: 'merchantCoupon.termination' })}
              </Button>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

  const [columns, columnsHandle] =
    useSpliceArray<ColumnType<GetMarketingCouponSummaryPageResponseDetail>>(defaultColumns)

  const handleActionConfirm = (values: any, modalType: ActionModalType) => {
    switch (modalType) {
      case 'cancel': {
        setActionModalConfirmLoading(true)
        postMarketingCouponSummaryCancel(values)
          .then((res) => {
            if (res.code === 1000) {
              setVisibleActionModal(false)
              ref.current.reloadCurrent()
            }
          })
          .finally(() => {
            setActionModalConfirmLoading(false)
          })
        break
      }
      case 'startUp': {
        setActionModalConfirmLoading(true)
        postMarketingCouponSummaryRestart(values)
          .then((res) => {
            if (res.code === 1000) {
              setVisibleActionModal(false)
              ref.current.reloadCurrent()
            }
          })
          .finally(() => {
            setActionModalConfirmLoading(false)
          })
        break
      }
      case 'stop': {
        setActionModalConfirmLoading(true)
        postMarketingCouponSummaryStop(values)
          .then((res) => {
            if (res.code === 1000) {
              setVisibleActionModal(false)
              ref.current.reloadCurrent()
            }
          })
          .finally(() => {
            setActionModalConfirmLoading(false)
          })
        break
      }
      case 'edit': {
        setActionModalConfirmLoading(true)
        postMarketingCouponWaitAuditModification(values)
          .then((res) => {
            if (res.code === 1000) {
              setVisibleActionModal(false)
              ref.current.reloadCurrent()
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

  // 初始化高级筛选选项
  const fetchSearchItems = async () => {
    const res = await getMarketingCouponPageCondition()

    if (res.code === 1000) {
      const { data } = res
      const { typeList = [], getWayList = [], statusList = [] } = data

      return {
        type: typeList.map((item) => ({ label: item.name, value: item.value })).filter((item) => item.value),
        getWay: getWayList.map((item) => ({ label: item.name, value: item.value })).filter((item) => item.value),
        status: statusList.map((item) => ({ label: item.name, value: item.value })).filter((item) => item.value),
      }
    }
    return {}
  }

  return (
    <Card>
      <StandardTable
        tableProps={{
          rowKey: 'id',
        }}
        columns={columns}
        currentRef={ref}
        fetchTableData={(params: any) => fetchData(params)}
        controlRender={
          <NiceForm
            actions={formActions}
            components={{
              RangePicker: DatePicker.RangePicker,
            }}
            onSubmit={(values) => ref.current.reload(values)}
            effects={($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              useAsyncInitSelect(['type', 'getWay', 'status'], fetchSearchItems)
            }}
            schema={querySchema}
          />
        }
      />

      <ActionModal
        visible={visibleActionModal}
        modalName={actionModalType}
        onClose={() => setVisibleActionModal(false)}
        value={actionModalValue}
        onConfirm={handleActionConfirm}
        submitLoading={actionModalConfirmLoading}
      />
    </Card>
  )
}

export default MerchantCouponQuery

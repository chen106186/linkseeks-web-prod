/**
 * 订单能力 - 送货计划协同 - 送货计划详情
 * @author: Gavin
 * @description:
 */
import React, { useEffect, useRef, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { formatTimeString } from '@/utils'
import _ from 'lodash'
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import { Button, message, Space, Spin, Steps, Table, Tag } from 'antd'
import { CaretDownOutlined, CaretRightOutlined, CheckCircleOutlined } from '@ant-design/icons'
import BaseInfo from '@/components/BaseInfo/BaseInfo'
import CalendarModal from '../../components/CalendarModal'
import {
  BaseInfo as base_Info,
  Circulation,
  ConfirmDeliveryPlan,
  ExternalState,
  PlanMaterial,
  PlanningCycle,
  PlanNumber,
  PlanSummary,
  Purchaser,
  SubmitDeliveryPlan,
  Supplier,
  SupplyMembersLabel,
  PlannedDelivery,
  BuyerLabel,
  DeliveryNoteGenerated,
  NoticeGenerated,
} from '../../constants'
import {
  columnB2B,
  columnSRM,
  ExternalRoamRecordTableColumn,
  initExpandIconColumn,
  jointExpandIconColumn,
} from '../../constants/page-table-column'
import { getDayAll, godAtob, integrationArrToObj, integrationOjb, newMapValues, TagStatus } from '../../utils'
import {
  getOrderDeliveryPlanDeliveryHistory,
  getOrderDeliveryPlanDeliveryOrder,
  getOrderDeliveryPlanDetail,
  getOrderDeliveryPlanDetailProductPage,
  getOrderDeliveryPlanNoticeOrder,
} from '@apps/apis'
import CustomizedTableItem from '../../components/CustomizedTableItem'
import CirculationRecords from '@/components/CirculationRecords'

const tagStatus = new TagStatus()
const statusTxt = new Map([
  [1, '待提交'],
  [2, '待确认'],
  [3, '待修订'],
  [4, '已确认'],
  [5, '已删除'],
])

const selectedTableItem = new Map()
const DeliveryPlanCollaborationDetails: React.FC = () => {
  const { ty, i, bt } = useQuery()
  // 1-B2B 2-SRM
  const deliveryPlanType = godAtob(ty as string)
  const id = godAtob(i as string)
  // notice-通知单 deliveryNote-送货单
  const pageBtn = godAtob(bt as string)

  const ref = useRef<any>()

  const [len, setLen] = useState<number>(0)
  const getAnchors = (_length: number | string) => {
    return [
      Circulation,
      base_Info,
      deliveryPlanType === '1' ? { ...PlannedDelivery, len: _length } : { ...PlanMaterial, len: _length },
    ]
  }

  const [spinning, setSpinning] = useState<boolean>(false)
  const [details, setDetails] = useState<any>({})
  // 计划送货物 列表
  const [tableData, setTableData] = useState<any>(null)
  //  操作类型  DeliveryNote-送货单、Notice-通知单
  const [operation, setOperation] = useState<'Notice' | 'DeliveryNote'>('Notice')

  //  动态 TableColumn
  const [tableColumn, setTableColumn] = useState<any>([])
  //  动态 expandIconColumn
  const [expandIconColumn, setExpandIconColumn] = useState<any>(initExpandIconColumn)

  const expandIconRowSelection = (planProductId: string) => {
    return {
      onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        // console.log(`expandIconRowSelection -> selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        // console.log('selectedRowKeys :>> ', skuId, '====>', selectedRowKeys)
        selectedTableItem.set(planProductId, selectedRowKeys)
      },
    }
  }

  const expandedRowRender = (record: any) => {
    return (
      <div className="childTable">
        <Table
          rowKey={'planOrderId'}
          columns={expandIconColumn}
          dataSource={record.orders}
          pagination={false}
          tableLayout="fixed"
          scroll={{ x: '100%' }}
          rowSelection={pageBtn ? expandIconRowSelection(record.planProductId) : null}
        />
      </div>
    )
  }

  //  计划周期 渲染日期
  const handleDateAssembleColumn = (startDate: string, endDate: string) => {
    const dates = getDayAll(formatTimeString(startDate, 'YYYY-MM-DD'), formatTimeString(endDate, 'YYYY-MM-DD'))
    const datesColumn = dates.map((item, i) => ({ title: item.substr(1), dataIndex: item, key: item, width: 80 }))
    const datesExpandIconColumn = dates.map((item, i) => ({
      title: item.substr(1),
      dataIndex: item,
      key: item,
      width: 80,
      render: (text: any, record: any) => (
        <CustomizedTableItem
          createNotice={text?.createNotice}
          createDelivery={text?.createDelivery}
          planCount={text?.planCount}
        />
      ),
    }))
    const table_column = deliveryPlanType === '1' ? columnB2B : deliveryPlanType === '2' ? columnSRM : []
    const expandIcon_column = pageBtn ? jointExpandIconColumn : initExpandIconColumn
    setTableColumn([...table_column, ...datesColumn])
    setExpandIconColumn([...expandIcon_column, ...datesExpandIconColumn])
  }

  // 获取计划送货
  const getPlannedDelivery = () => {
    getOrderDeliveryPlanDetailProductPage({
      id,
      current: '1',
      pageSize: '999',
    }).then((res) => {
      if (res.code === 1000) {
        setLen(res.data.totalCount)
        const assemble = res.data.data.map((item) => {
          return {
            ...item,
            ...integrationOjb(item.dayNumbers),
            orders: item.orders.map((o) => ({ ...o, ...integrationArrToObj(o.planDays) })),
          }
        })
        setTableData(assemble)
      }
    })
  }

  //  获取详情
  const getDetails = () => {
    getOrderDeliveryPlanDetail({
      id,
    }).then((res: any) => {
      if (res.code === 1000) {
        setDetails(res.data)
        getPlannedDelivery()
        handleDateAssembleColumn(res.data.planStartTime, res.data.planEndTime)
      }
    })
  }

  const handleSubmitVerify = (t: 'Notice' | 'DeliveryNote') => {
    setOperation(t)
    const _ids = newMapValues(selectedTableItem, true)
    if (_.isEmpty(_ids)) {
      const msg = t === 'Notice' ? '请勾选需要生成送通知单的订单' : '请勾选需要生成送货单的订单'
      message.warning(msg)
      return
    }
    ref.current.handleOpen()
  }

  // 生成通知单
  const generateNotice = (date: string) => {
    const _ids = newMapValues(selectedTableItem, true)
    setSpinning(true)
    getOrderDeliveryPlanNoticeOrder({
      planId: id,
      planOrderIds: _ids.join(),
      time: date,
    })
      .then((res: any) => {
        if (res.code === 1000) {
          if (_.isEmpty(res.data.products)) {
            message.warning('所选计划送货数量均为0, 无法生成送货通知单')
            return
          }
          let noticePath = {}
          const time = new Date().getTime()
          // 判断跳转
          const url =
            deliveryPlanType === '1'
              ? '/orderAbility/deliveryNoticeManagement/awaitB2B/add'
              : '/orderAbility/deliveryNoticeManagement/awaitSRM/add'
          noticePath[time] = res.data
          localStorage.setItem('NOTICE_PATH', JSON.stringify(noticePath))
          selectedTableItem.clear()
          setTimeout(() => {
            history.push(`${url}?time=${time}`)
          }, 1000)
        } else {
          message.warning(res.message)
        }
      })
      .finally(() => {
        setSpinning(false)
      })
  }

  // 生成送货单
  const generateDeliveryNote = (date: string) => {
    const _ids = newMapValues(selectedTableItem, true)
    setSpinning(true)
    getOrderDeliveryPlanDeliveryOrder({
      planId: id,
      planOrderIds: _ids.join(),
      time: date,
    })
      .then((res: any) => {
        if (res.code === 1000) {
          if (_.isEmpty(res.data.products)) {
            message.warning('所选计划送货数量均为0, 无法生成送货单')
            return
          }
          let noticePath = {}
          const time = new Date().getTime()
          noticePath[time] = res.data
          localStorage.setItem('DELIVERY_NOTICE_PATH', JSON.stringify(noticePath))
          selectedTableItem.clear()
          setTimeout(() => {
            history.push(`/orderAbility/deliveryNotice/synergyCreate?time=${time}&ot=${deliveryPlanType}`)
          }, 1000)
        } else {
          message.warning(res.message)
        }
      })
      .finally(() => {
        setSpinning(false)
      })
  }

  useEffect(() => {
    getDetails()
  }, [])

  useEffect(() => {
    const parent = document.querySelector('.parentTable .ant-table-content')
    parent?.addEventListener('scroll', () => {
      const child: NodeListOf<HTMLElement> = document.querySelectorAll('.childTable .ant-table-content')
      if (child) {
        Array.from(new Array(child.length)).map((_: undefined, i: number) => {
          child[i].scrollLeft = parent.scrollLeft
        })
      }
    })
  }, [])

  return (
    <Spin spinning={spinning}>
      <AnchorPage
        title={`${details?.digest} | ${details?.planNo}`}
        onBack={() => history.goBack()}
        anchors={getAnchors(len)}
        extra={
          <Space>
            {/* 条件渲染 */}
            {pageBtn === 'notice' ? (
              <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleSubmitVerify('Notice')}>
                {NoticeGenerated}
              </Button>
            ) : pageBtn === 'deliveryNote' ? (
              <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleSubmitVerify('DeliveryNote')}>
                {DeliveryNoteGenerated}
              </Button>
            ) : null}
          </Space>
        }
      >
        <BaseInfo
          className="mt-0"
          title={Circulation.name}
          id={Circulation.key}
          cols={1}
          subtitle={
            <CirculationRecords
              fetchApi={getOrderDeliveryPlanDeliveryHistory}
              params={{ id: id as string }}
              columns={ExternalRoamRecordTableColumn}
            />
          }
        >
          <Steps progressDot current={details?.status === 4 ? 1 : 0}>
            <Steps.Step title={SubmitDeliveryPlan} description={Purchaser} />
            <Steps.Step title={ConfirmDeliveryPlan} description={Supplier} />
          </Steps>
        </BaseInfo>
        <BaseInfo className="mt-16" title={base_Info.name} id={base_Info.key}>
          <BaseInfo.BaseInfoItem label={PlanNumber}> {details?.planNo} </BaseInfo.BaseInfoItem>

          <BaseInfo.BaseInfoItem label={BuyerLabel}> {details?.buyerMemberName} </BaseInfo.BaseInfoItem>

          <BaseInfo.BaseInfoItem label={PlanSummary}> {details?.digest} </BaseInfo.BaseInfoItem>

          <BaseInfo.BaseInfoItem label={PlanningCycle}>
            {' '}
            {formatTimeString(details?.planStartTime, 'YYYY-MM-DD')} ~{' '}
            {formatTimeString(details?.planEndTime, 'YYYY-MM-DD')}{' '}
          </BaseInfo.BaseInfoItem>

          <BaseInfo.BaseInfoItem label={ExternalState}>
            <Tag color={tagStatus.getTagStyle(details?.status).bgColor}>
              <span style={{ color: tagStatus.getTagStyle(details?.status).fontColor }}>
                {statusTxt.get(details?.status)}
              </span>
            </Tag>
          </BaseInfo.BaseInfoItem>
        </BaseInfo>
        <BaseInfo
          className="mt-16"
          title={deliveryPlanType === '1' ? PlannedDelivery.name : PlanMaterial.name}
          id={deliveryPlanType === '1' ? PlannedDelivery.key : PlanMaterial.key}
          cols={1}
        >
          {/* B2B 显示计划送货物料，SRM显示计划送货商品 */}
          <Table
            className="customizationTable parentTable"
            // defaultExpandAllRows
            rowKey={'planProductId'}
            columns={tableColumn}
            expandable={{
              expandIcon: ({ expanded, onExpand, record }) =>
                expanded ? (
                  <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
                ) : (
                  <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
                ),
              expandedRowRender,
            }}
            dataSource={tableData}
            tableLayout="fixed"
            scroll={{ x: '100%' }}
          />
        </BaseInfo>
      </AnchorPage>
      <CalendarModal
        ref={ref}
        onOk={(date) => {
          operation === 'Notice' ? generateNotice(date) : generateDeliveryNote(date)
        }}
      />
    </Spin>
  )
}

export default DeliveryPlanCollaborationDetails

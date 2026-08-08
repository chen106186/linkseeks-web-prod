/**
 * 订单能力 - 送货计划管理 - 待提交送货计划 SRM 详情
 * @author: Gavin
 * @description: 与B2B内容大致相同，文件分开方便后续对接以及日后变动修改二开
 */
import React, { useEffect, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import {
  BaseInfo as base_Info,
  PlanningCycle,
  SupplyMembersLabel,
  PlanSummary,
  ExternalRoamRecord,
  Circulation,
  Purchaser,
  SubmitDeliveryPlan,
  Supplier,
  ConfirmDeliveryPlan,
  PlannedDelivery,
  ExternalState,
  PlanNumber,
  PlanMaterial,
} from '../../constants'
import { Steps, Table, Tag } from 'antd'
import BaseInfo from '@/components/BaseInfo/BaseInfo'
import { columnSRM, ExternalRoamRecordTableColumn, initExpandIconColumn } from '../../constants/page-table-column'
import _ from 'lodash'
import { getDayAll, godAtob, integrationArrToObj, integrationOjb, TagStatus } from '../../utils'
import {
  getOrderDeliveryPlanDeliveryHistory,
  getOrderDeliveryPlanDetail,
  getOrderDeliveryPlanDetailProductPage,
} from '@apps/apis'
import { formatTimeString } from '@/utils'
import CustomizedTableItem from '../../components/CustomizedTableItem'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import CirculationRecords from '@/components/CirculationRecords'

const tagStatus = new TagStatus()
const statusTxt = new Map([
  [1, '待提交'],
  [2, '待确认'],
  [3, '待修订'],
  [4, '已确认'],
  [5, '已删除'],
])
const DeliveryPlanAwaitSRMDetails: React.FC = () => {
  const { i } = useQuery()
  const id = godAtob(i as string)

  const [len, setLen] = useState<number>(0)
  const getAnchors = (_length: number | string) => {
    return [Circulation, base_Info, { ...PlanMaterial, len: _length }]
  }

  //  动态 TableColumn
  const [materialTableColumn, setMaterialTableColumn] = useState<any>(columnSRM)
  //  动态 expandIconColumn
  const [expandIconColumn, setExpandIconColumn] = useState<any>(initExpandIconColumn)

  const expandedRowRender = (record, index) => {
    return (
      <div className="childTable">
        <Table
          rowKey={'orderProductId'}
          columns={expandIconColumn}
          dataSource={record.orders}
          pagination={false}
          tableLayout="fixed"
          scroll={{ x: '100%' }}
        />
      </div>
    )
  }

  //  详情
  const [details, setDetails] = useState<any>(null)
  // 计划送货物料 列表
  const [materialTableData, setMaterialTableData] = useState<any>(null)

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
    setMaterialTableColumn([...materialTableColumn, ...datesColumn])
    setExpandIconColumn([...expandIconColumn, ...datesExpandIconColumn])
  }

  // 获取计划送货 物料
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
        setMaterialTableData(assemble)
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
    <AnchorPage
      title={`${details?.digest} | ${details?.planNo}`}
      onBack={() => history.goBack()}
      anchors={getAnchors(len)}
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
        <Steps progressDot current={details?.outerStatus - 1}>
          <Steps.Step title={SubmitDeliveryPlan} description={Purchaser} />
          <Steps.Step title={ConfirmDeliveryPlan} description={Supplier} />
        </Steps>
      </BaseInfo>
      <BaseInfo className="mt-16" title={base_Info.name} id={base_Info.key}>
        <BaseInfo.BaseInfoItem label={PlanNumber}> {details?.planNo} </BaseInfo.BaseInfoItem>

        <BaseInfo.BaseInfoItem label={SupplyMembersLabel}> {details?.vendorMemberName} </BaseInfo.BaseInfoItem>

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
      <BaseInfo className="mt-16" title={PlanMaterial.name} id={PlanMaterial.key} cols={1}>
        <Table
          className="customizationTable parentTable"
          // defaultExpandAllRows
          rowKey={'planProductId'}
          columns={materialTableColumn}
          expandable={{
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
              ) : (
                <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
              ),
            expandedRowRender,
          }}
          dataSource={materialTableData}
          tableLayout="fixed"
          scroll={{ x: '100%' }}
        />
      </BaseInfo>
    </AnchorPage>
  )
}

export default DeliveryPlanAwaitSRMDetails

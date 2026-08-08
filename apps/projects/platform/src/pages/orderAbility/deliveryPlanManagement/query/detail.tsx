/**
 * 订单能力 -- 送货计划详情
 * @author: Gavin
 */
import React, { useEffect, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import _ from 'lodash'
import { formatTimeString } from '@/utils'
import { Steps, Table, Tag } from 'antd'
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import BaseInfo from '@/components/BaseInfo/BaseInfo'
import {
  BaseInfo as base_Info,
  Circulation,
  ConfirmDeliveryPlan,
  ExternalRoamRecord,
  ExternalState,
  PlanMaterial,
  PlannedDelivery,
  PlanningCycle,
  PlanNumber,
  PlanSummary,
  Purchaser,
  SubmitDeliveryPlan,
  Supplier,
  SupplyMember,
  SupplyMembersLabel,
} from '../../constants'
import {
  columnB2B,
  columnSRM,
  initExpandIconColumn,
  ExternalRoamRecordTableColumn,
} from '../../constants/page-table-column'
import { getDayAll, godAtob, integrationArrToObj, integrationOjb, TagStatus } from '../../utils'
import {
  getOrderDeliveryPlanDeliveryHistory,
  getOrderDeliveryPlanDetail,
  getOrderDeliveryPlanDetailProductPage,
} from '@apps/apis'
import CustomizedTableItem from '../../components/CustomizedTableItem'
import styles from './index.less'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import CirculationRecords from '@/components/CirculationRecords'

const intl = getIntl()

const tagStatus = new TagStatus()
const statusTxt = new Map([
  [1, '待提交'],
  [2, '待确认'],
  [3, '待修订'],
  [4, '已确认'],
  [5, '已删除'],
])

const DeliveryPlanManagementDetails: React.FC = () => {
  const { ty, i } = useQuery()
  // 1-B2B 2-SRM
  const deliveryPlanType = godAtob(ty as string)
  const id = godAtob(i as string)

  const [len, setLen] = useState<number>(0)
  const getAnchors = (_length: number | string) => {
    return [
      Circulation,
      base_Info,
      deliveryPlanType === '1' ? { ...PlannedDelivery, len: _length } : { ...PlanMaterial, len: _length },
    ]
  }
  //  动态 TableColumn
  const [tableColumn, setTableColumn] = useState<any>([])
  //  动态 expandIconColumn
  // const dynamicWidth = deliveryPlanType === '1' ? 214 : 342
  const [expandIconColumn, setExpandIconColumn] = useState<any>(initExpandIconColumn)
  const expandedRowRender = (record) => {
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

  // 详情
  const [details, setDetails] = useState<any>(null)
  // 计划送货物 列表
  const [tableData, setTableData] = useState<any>(null)

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
    setTableColumn([...table_column, ...datesColumn])
    setExpandIconColumn([...expandIconColumn, ...datesExpandIconColumn])
  }

  // 获取计划送货
  const getPlannedDelivery = () => {
    getOrderDeliveryPlanDetailProductPage({
      id,
      current: '1',
      pageSize: '999',
    }).then((res) => {
      if (res.code === 1000) {
        console.log('object :>> ', res.data.totalCount)
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
        <Steps progressDot current={details?.status === 4 ? 1 : 0}>
          <Steps.Step title={SubmitDeliveryPlan} description={Purchaser} className={styles.customStepCss} />
          <Steps.Step title={ConfirmDeliveryPlan} description={Supplier} className={styles.customStepCss} />
        </Steps>
      </BaseInfo>
      <BaseInfo className="mt-16" title={base_Info.name} id={base_Info.key}>
        <BaseInfo.BaseInfoItem label={PlanNumber}> {details?.planNo} </BaseInfo.BaseInfoItem>

        <BaseInfo.BaseInfoItem label={SupplyMembersLabel}> {details?.vendorMemberName} </BaseInfo.BaseInfoItem>

        <BaseInfo.BaseInfoItem label={PlanSummary}> {details?.digest} </BaseInfo.BaseInfoItem>

        <BaseInfo.BaseInfoItem label={PlanningCycle}>
          {' '}
          {formatTimeString(details?.planStartTime, 'YYYY-MM-DD')}{' '}
          {intl.formatMessage({ id: 'common.text.to', defaultMessage: '至' })}{' '}
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
  )
}

export default DeliveryPlanManagementDetails

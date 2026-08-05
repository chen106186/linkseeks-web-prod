/**
 * 订单能力 - 送货计划协同 - 待确认送货计划详情
 * @author: Gavin
 * @description:
 */
import React, { useEffect, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { formatTimeString } from '@/utils'
import _ from 'lodash'
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import { Button, Space, Spin, Steps, Table, Tag } from 'antd'
import { CaretDownOutlined, CaretRightOutlined, CheckCircleOutlined } from '@ant-design/icons'
import {
  Circulation,
  BaseInfo as base_Info,
  Purchaser,
  SubmitDeliveryPlan,
  Supplier,
  ConfirmDeliveryPlan,
  PlanNumber,
  PlanSummary,
  PlanningCycle,
  ExternalState,
  PlannedDelivery,
  BuyerLabel,
  PlanMaterial,
} from '../../constants'
import BaseInfo from '@/components/BaseInfo/BaseInfo'
import {
  columnB2B,
  columnSRM,
  ExternalRoamRecordTableColumn,
  initExpandIconColumn,
} from '../../constants/page-table-column'
import CustomizedModal, { SubmitFeedback } from '../../components/customizedModal'
import { getDayAll, godAtob, integrationArrToObj, integrationOjb, TagStatus } from '../../utils'
import {
  getOrderDeliveryPlanDeliveryHistory,
  getOrderDeliveryPlanDetail,
  getOrderDeliveryPlanDetailProductPage,
  postOrderDeliveryPlanConfirm,
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

const DeliveryPlanCollaborationAwaitDetails: React.FC = () => {
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

  const [spinning, setSpinning] = useState<boolean>(false)
  const [details, setDetails] = useState<any>({})
  // 计划送货物 列表
  const [tableData, setTableData] = useState<any>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  //  动态 TableColumn
  const [tableColumn, setTableColumn] = useState<any>([])
  //  动态 expandIconColumn
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

  // 提交
  const modalSubmit = (values: SubmitFeedback) => {
    // console.log('modalSubmit -> values :>> ', values)
    setSpinning(true)
    postOrderDeliveryPlanConfirm({
      id: Number(id),
      isPass: values.isPass === 1,
      remark: values.reason,
    })
      .then((res: any) => {
        setSpinning(false)
        if (res.code === 1000) history.goBack()
      })
      .catch((err: any) => {
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
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                setModalVisible(true)
              }}
            >
              单据审核
            </Button>
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
          <Steps progressDot current={details?.outerStatus - 1}>
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
      <CustomizedModal
        title="确认送货计划"
        visible={modalVisible}
        defaultRadioValue={1}
        radioGroup={[
          { label: '确认', value: 1, isReason: false },
          { label: '不确认', value: 2, isReason: true },
        ]}
        onSubmit={(values) => modalSubmit(values)}
        onCancel={(visible: boolean) => setModalVisible(visible)}
      />
    </Spin>
  )
}

export default DeliveryPlanCollaborationAwaitDetails

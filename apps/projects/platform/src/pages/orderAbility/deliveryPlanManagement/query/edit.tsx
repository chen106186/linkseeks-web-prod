/**
 * 订单能力 -- 送货计划 变更
 * @author: Gavin
 */
import React, { useEffect, useRef, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import _ from 'lodash'
import { formatTimeString } from '@/utils'
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import {
  BaseInfo as base_Info,
  Remarks,
  PlanningCycle,
  SupplyMembersLabel,
  PlanSummary,
  ExternalRoamRecord,
  ExternalState,
  Circulation,
  Purchaser,
  SubmitDeliveryPlan,
  Supplier,
  ConfirmDeliveryPlan,
  PlannedDelivery,
  DeliveryPlanRemark,
  PlanNumber,
  PlanMaterial,
} from '../../constants'
import { Button, Form, Input, InputNumber, message, Space, Spin, Steps, Table, Tag } from 'antd'
import { CaretDownOutlined, CaretRightOutlined, SaveOutlined } from '@ant-design/icons'
import BaseInfo from '@/components/BaseInfo/BaseInfo'
import {
  columnB2B,
  columnSRM,
  initExpandIconColumn,
  ExternalRoamRecordTableColumn,
} from '../../constants/page-table-column'
import {
  afterToday,
  getDayAll,
  godAtob,
  integrationArrToObj,
  integrationOjb,
  limitDecimalsF,
  limitDecimalsP,
  TagStatus,
} from '../../utils'
import {
  BrandColumn,
  ClassColumn,
  ConsigneeNumColumn,
  DeliveredNumColumn,
  MaterialModelColumn,
  MaterialNameColumn,
  MaterialNoColumn,
  OrderCreatedAtColumn,
  OrderNoColumn,
  OrderSummaryColumn,
  OrderNumColumn,
  PlannedDeliveryNumColumn,
  TransitNumColumn,
  UntilColumn,
  CommodityNoColumn,
  TradeNameColumn,
} from '../../constants/table-column'
import {
  getOrderDeliveryPlanDeliveryHistory,
  getOrderDeliveryPlanDetail,
  getOrderDeliveryPlanDetailProductPage,
  postOrderDeliveryPlanUpdate,
} from '@apps/apis'
import CirculationRecords from '@/components/CirculationRecords'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

const tagStatus = new TagStatus()
const statusTxt = new Map([
  [1, '待提交'],
  [2, '待确认'],
  [3, '待修订'],
  [4, '已确认'],
  [5, '已删除'],
])
const DeliveryPlanManagementUpdate: React.FC = () => {
  const { ty, i } = useQuery()
  // 1-B2B 2-SRM
  const deliveryPlanType = godAtob(ty as string)
  const id = godAtob(i as string)

  const [form] = Form.useForm()
  const datesRef = useRef(null)
  const tableDataRef = useRef(null)

  const [spinning, setSpinning] = useState<boolean>(false)

  const [len, setLen] = useState<number>(0)
  const getAnchors = (_length: number | string) => {
    return [
      Circulation,
      base_Info,
      deliveryPlanType === '1' ? { ...PlannedDelivery, len: _length } : { ...PlanMaterial, len: _length },
      Remarks,
    ]
  }

  //  动态 TableColumn
  const [tableColumn, setTableColumn] = useState<any>([])
  //  动态 expandIconColumn
  const [expandIconColumn, setExpandIconColumn] = useState<any>(initExpandIconColumn)

  const expandedRowRender = (record: any) => {
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
  // 计划送货 列表
  const [tableData, setTableData] = useState<any>(null)

  // 保存
  const save = () => {
    form.validateFields().then((values) => {
      if (_.isEmpty(tableDataRef.current)) {
        message.warning('没有找到可执行计划送货')
        return
      }
      setSpinning(true)
      const orders = tableDataRef.current
        .flatMap((item: any) => item.orders)
        .flatMap((o: any) => ({
          ...o,
          planDays: Object.keys(o)
            .filter((f: any) => f.startsWith('$'))
            .map((p: any) => o[p]),
        }))
      postOrderDeliveryPlanUpdate({
        planId: Number(id),
        digest: values.planSummaryText,
        remark: values.remark,
        orders,
      })
        .then((res: any) => {
          setSpinning(false)
          if (res.code === 1000) {
            history.goBack()
          }
        })
        .catch((err) => {
          setSpinning(false)
        })
    })
  }

  // 对应日期填入的送货数量
  const inputChange = (val: any, text: any, record: any) => {
    let { day } = text
    let dataArr = JSON.parse(JSON.stringify(tableDataRef.current))
    let index = dataArr.findIndex((f) => f.planProductId === record.planProductId)
    let childIndex = dataArr[index].orders.findIndex((f) => f.orderProductId === record.orderProductId)
    dataArr[index].orders[childIndex][`$${day}`].planCount = val
    tableDataRef.current = dataArr
    setTableData(dataArr)
  }

  //  计划周期
  const handleDateAssembleColumn = (startDate: string, endDate: string) => {
    const dates = getDayAll(formatTimeString(startDate, 'YYYY-MM-DD'), formatTimeString(endDate, 'YYYY-MM-DD'))
    datesRef.current = dates
    const datesColumn = dates.map((item, i) => ({ title: item.substr(1), dataIndex: item, key: item, width: 80 }))
    const datesExpandIconColumn = dates.map((item, i) => ({
      title: item.substr(1),
      dataIndex: item,
      key: item,
      width: 80,
      render: (text: any, record: any) => (
        <InputNumber
          style={{ width: '100%' }}
          bordered
          disabled={afterToday(item.substr(1))}
          parser={limitDecimalsP}
          formatter={limitDecimalsF}
          value={text?.planCount}
          onChange={(val) => inputChange(val, text, record)}
        />
      ),
    }))
    const table_column = deliveryPlanType === '1' ? columnB2B : deliveryPlanType === '2' ? columnSRM : []
    setTableColumn([...table_column, ...datesColumn])
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
        tableDataRef.current = assemble
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
        form.setFieldsValue({
          planSummaryText: res.data.digest,
          remark: '',
        })
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
    <Spin spinning={spinning}>
      <AnchorPage
        title={`${details?.digest} | ${details?.planNo}`}
        onBack={() => history.goBack()}
        anchors={getAnchors(len)}
        extra={
          <Space>
            <Button type="primary" icon={<SaveOutlined />} onClick={save}>
              保存
            </Button>
          </Space>
        }
      >
        <Form labelAlign="left" form={form}>
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

            <BaseInfo.BaseInfoItem label={SupplyMembersLabel}> {details?.vendorMemberName} </BaseInfo.BaseInfoItem>

            <Form.Item
              {...formItemLayout}
              label={PlanSummary}
              name="planSummaryText"
              rules={[{ required: true, message: '请输入' }]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>

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
          <BaseInfo className="mt-16" title={Remarks.name} id={Remarks.key} cols={1}>
            <Form.Item name="remark" rules={[{ required: false, message: '请输入' }]}>
              <Input.TextArea rows={4} maxLength={300} placeholder={DeliveryPlanRemark} />
            </Form.Item>
          </BaseInfo>
        </Form>
      </AnchorPage>
    </Spin>
  )
}

export default DeliveryPlanManagementUpdate

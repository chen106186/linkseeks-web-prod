/**
 * 订单能力 - 送货计划管理 - 待提交送货计划 SRM 新增
 * @author: Gavin
 * @description: 与B2B内容大致相同，文件分开方便后续对接以及日后变动修改二开
 */
import React, { useEffect, useRef, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import {
  BaseInfo as base_Info,
  Remarks,
  PlanningCycle,
  SupplyMembersLabel,
  PlanSummary,
  Purchaser,
  SubmitDeliveryPlan,
  Supplier,
  ConfirmDeliveryPlan,
  PlanMaterial,
  DeliveryPlanText,
  DeliveryPlanRemark,
  CreateDeliveryPlanTitleSRM,
  Circulation,
} from '../../constants'
import { Button, DatePicker, Form, Input, InputNumber, message, Space, Spin, Steps, Table } from 'antd'
import { CaretDownOutlined, CaretRightOutlined, SaveOutlined } from '@ant-design/icons'
import BaseInfo from '@/components/BaseInfo/BaseInfo'
import _ from 'lodash'
import { afterToday, convertArrToObj, disabledDate, getDayAll, limitDecimalsF, limitDecimalsP } from '../../utils'
import { RoleSelect } from '@/components/RoleSelect'
import { getOrderDeliveryPlanOrderProductPage, postOrderDeliveryPlanSrmCreate } from '@apps/apis'
import { getMemberManageLowerMerchantProviderPage } from '@apps/apis'
import { columnSRM, initExpandIconColumn } from '../../constants/page-table-column'

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 },
}

// 1：查询供应商角色，2：查询采购商角色
const ROLE_TYPE = '1'
// 1：b2b，2：srm
const ORDER_TYPE = '2'

const DeliveryPlanAwaitSRMCreate: React.FC = () => {
  const [form] = Form.useForm()
  const datesRef = useRef<any>(null)
  const materialTableDataRef = useRef(null)

  const [spinning, setSpinning] = useState<boolean>(false)

  const [len, setLen] = useState<number>(0)
  const getAnchors = (_length: number | string) => {
    return [base_Info, { ...PlanMaterial, len: _length }, Remarks]
  }

  //  动态 TableColumn
  const [materialTableColumn, setMaterialTableColumn] = useState<any>(columnSRM)
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

  // 选中 开始时间，结束时间
  const [selectedDate, setSelectedDate] = useState<Array<string>>([])
  // 选中 会员信息
  const [selectedMember, setSelectedMember] = useState<any>({})
  // 计划送货物料 列表
  const [materialTableData, setMaterialTableData] = useState<any>(null)

  // 保存
  const save = () => {
    form
      .validateFields()
      .then((values) => {
        // console.log('values :>> ', values)
        if (_.isEmpty(materialTableDataRef.current)) {
          message.warning('没有找到可执行计划送货')
          setSpinning(false)
          return
        }
        setSpinning(true)
        const productList = materialTableDataRef.current.map((item: any) => {
          return {
            ...item,
            orders: item.orders.map((o: any) => {
              const planDays = Object.keys(o)
                .filter((f: any) => f.startsWith('$'))
                .map((p: any) => o[p])
              return {
                ...o,
                planDays,
              }
            }),
          }
        })
        postOrderDeliveryPlanSrmCreate({
          vendorMemberId: selectedMember.memberId,
          vendorRoleId: selectedMember.roleId,
          vendorMemberName: selectedMember.name,
          digest: values.planSummaryText,
          planStartTime: values.dates[0].format('YYYY-MM-DD'),
          planEndTime: values.dates[1].format('YYYY-MM-DD'),
          remark: values.remark,
          productList,
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
      .catch((err) => {
        message.warning('重要信息未选择或填写, 请检查后再次提交')
      })
  }

  // 对应日期填入的送货数量
  const inputChange = (val: any, text: any, record: any) => {
    let { day } = text
    let dataArr = JSON.parse(JSON.stringify(materialTableDataRef.current))
    let index = dataArr.findIndex((f) => f.planProductId === record.planProductId)
    let childIndex = dataArr[index].orders.findIndex((f) => f.orderProductId === record.orderProductId)
    dataArr[index].orders[childIndex][`$${day}`].planCount = val
    materialTableDataRef.current = dataArr
    setMaterialTableData(dataArr)
  }

  //  计划周期 选择日期
  const handleDateAssembleColumn = (dateGroup) => {
    if (_.isArray(dateGroup)) {
      const startDate = dateGroup[0].format('YYYY-MM-DD')
      const endDate = dateGroup[1].format('YYYY-MM-DD')
      const dates = getDayAll(startDate, endDate)
      datesRef.current = dates
      setSelectedDate([startDate, endDate])
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
      setMaterialTableColumn([...columnSRM, ...datesColumn])
      setExpandIconColumn([...initExpandIconColumn, ...datesExpandIconColumn])
    } else {
      //  清空
      datesRef.current = null
      materialTableDataRef.current = null
      setSelectedDate([])
      setMaterialTableData([])
      setMaterialTableColumn(columnSRM)
      setExpandIconColumn(initExpandIconColumn)
    }
  }

  // 选中的会员信息
  const handleMemberInfo = (info) => {
    setSelectedMember(info)
  }

  // 获取计划送货 物料
  const getPlannedDelivery = () => {
    getOrderDeliveryPlanOrderProductPage({
      memberId: selectedMember.memberId,
      roleId: selectedMember.roleId,
      roleType: ROLE_TYPE,
      orderType: ORDER_TYPE,
      current: '1',
      pageSize: '999',
    }).then((res) => {
      if (res.code === 1000) {
        setLen(res.data.totalCount)
        const assemble = res.data.data.map((item) => {
          return {
            ...item,
            ...convertArrToObj(datesRef.current),
            orders: item.orders.map((o) => ({ ...o, ...convertArrToObj(datesRef.current) })),
          }
        })
        materialTableDataRef.current = assemble
        setMaterialTableData(assemble)
      }
    })
  }

  // 监听 选择日期 and 选择会员
  useEffect(() => {
    // 双条件满足 请求
    if (!_.isEmpty(selectedMember)) {
      getPlannedDelivery()
    }
    if (!_.isEmpty(selectedDate) && !_.isEmpty(selectedMember)) {
      const planSummaryText = `${selectedDate[0]}~${selectedDate[1]} ${selectedMember.name} ${DeliveryPlanText}`
      form.setFieldsValue({ planSummaryText })
    }
  }, [selectedDate, selectedMember])

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
        title={CreateDeliveryPlanTitleSRM}
        onBack={() => history.goBack()}
        anchors={getAnchors(len)}
        extra={
          <Space>
            {/* <Button>保存并新增</Button> */}
            <Button type="primary" icon={<SaveOutlined />} onClick={save}>
              保存
            </Button>
          </Space>
        }
      >
        <Form labelAlign="left" form={form}>
          <BaseInfo className="mt-0" title={base_Info.name} id={base_Info.key}>
            <Form.Item
              {...formItemLayout}
              label={PlanSummary}
              name="planSummaryText"
              rules={[{ required: true, message: '请选择' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label={SupplyMembersLabel}
              name="memberId"
              rules={[{ required: true, message: '请选择' }]}
            >
              <RoleSelect request={getMemberManageLowerMerchantProviderPage} onChange={handleMemberInfo} />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label={PlanningCycle}
              name="dates"
              rules={[{ required: true, message: '请选择' }]}
            >
              <DatePicker.RangePicker
                className="datePicker-range-separate"
                disabledDate={disabledDate}
                style={{ width: '100%' }}
                onChange={(dates) => handleDateAssembleColumn(dates)}
              />
            </Form.Item>
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

export default DeliveryPlanAwaitSRMCreate

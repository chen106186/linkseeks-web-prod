import React from 'react'
import { history } from '@linkseeks/router-manager'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import CustomBadge from '@/pages/purchaseManage/procurement/components/customBadge'
import { CALLFORBID_TYPE, PURCHASE_TYPE } from '@/constants'
import CustomTag from '../components/customTag'

/** 工具: 按属性归类 */
export const groupBy = (objectArray: any[], property: string) => {
  return objectArray.reduce(function (acc: { [x: string]: any[] }, obj: { [x: string]: any }) {
    var key = obj[property]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}

/** 根据招投标流程api返回的字段 处理成组件需要的状态数据格式 */
export const processLogResponses = (resData) => {
  const { currentInnerStep, currentOuterStep, externalTasks } = resData
  const externalLogs = externalTasks.map((item) => ({
    id: item.taskStep,
    name: item.taskName,
    roleName: item.memberRoleName,
    isActive: currentOuterStep === 0 ? true : item.taskStep <= currentOuterStep,
  }))
  const subTasks = externalTasks.filter((item) => item.taskStep === currentOuterStep)
  const interiorLogs = subTasks.length
    ? subTasks[0]['subTasks'].map((item) => ({
        id: item.taskStep,
        name: item.taskName,
        roleName: item.userRoleName,
        isActive: currentInnerStep === 0 ? true : item.taskStep < currentInnerStep,
      }))
    : null
  return {
    interiorLogs,
    externalLogs,
  }
}

// 招投标内部状态
export const insideStatusText = [
  '待提交审核',
  '审核通过',
  '报名审核通过',
  '资格预审审核通过',
  '待开标',
  '待评标',
  '待提交审核定标',
  '定标审核通过(二级)',
  '完成招标',
  '已废标',
]

// 招投标外部状态
export const outStatusText = [
  '待提交招标',
  '待平台审核招标',
  '待招标报名',
  '待资格预审',
  '待开标',
  '待评标',
  '待定标',
  '待中标公示',
  '完成招标',
  '已废标',
]

// 评标中的环节状态
export const remarkProcessStatus = [
  '未报名',
  '已评标',
  '未评标',
  '未报名',
  '未报价',
  '报名审核未通过',
  '资格审核未通过',
]

// 招标表格基本列
export const baseBidListColumns: RecordColumns<any>[] = [
  {
    title: '招标编号/项目',
    dataIndex: 'code',
    key: 'code',
    fixed: 'left',
    searchField: { type: 'Input', main: true, name: 'inviteTenderCode', title: '招标编号' },
    render: (text, record) => (
      <>
        <EyeAuthButton url={`${history.location.pathname}/detail?id=${record.id}`}>{text}</EyeAuthButton>
        <div>{record['projectName']}</div>
      </>
    ),
  },
  {
    title: '招标会员',
    align: 'left',
    dataIndex: 'memberName',
    key: 'memberName',
    searchField: { type: 'Input', name: 'projectName', title: '招标项目' },
  },
  {
    title: '采购类型',
    align: 'left',
    dataIndex: 'purchaseType',
    key: 'purchaseType',
    render: (t) => PURCHASE_TYPE[t],
  },
  {
    title: '招标方式',
    align: 'left',
    dataIndex: 'inviteTenderType',
    key: 'inviteTenderType',
    render: (t) => CALLFORBID_TYPE[t],
  },
  {
    title: '发布时间',
    align: 'left',
    dataIndex: 'createTime',
    key: 'createTime',
    searchField: {
      type: 'DateRange',
      title: '发布时间',
      name: ['startTime', 'endTime'],
      placeholder: ['发布开始时间', '发布结束时间'],
    },
    render: (text, record) => formatTimeString(record.createTime),
    width: 200,
  },
  {
    title: '投标开始/截止时间',
    align: 'left',
    dataIndex: 'inviteTenderStartTime',
    key: 'inviteTenderStartTime',
    render: (text, record) => (
      <>
        <div>
          <PlayCircleOutlined />
          &nbsp;{formatTimeString(text)}
        </div>
        <div>
          <PoweroffOutlined />
          &nbsp;{formatTimeString(record.inviteTenderEndTime)}
        </div>
      </>
    ),
    width: 200,
  },
  {
    title: '外部状态',
    align: 'left',
    dataIndex: 'inviteTenderOutStatusValue',
    key: 'inviteTenderOutStatusValue',
    render: (text, r) => <CustomTag text={text} color={r.inviteTenderOutStatusColor} />,
  },
  // {
  //   title: '内部状态',
  //   align: 'left',
  //   dataIndex: 'inviteTenderInStatusValue',
  //   key: 'inviteTenderInStatusValue',
  //   render: (text, r) => <CustomBadge text={text} color={r.inviteTenderInStatusColor} />
  // },
]

// 投标表格基本列
export const baseTenderListColumns: any[] = [
  {
    title: '投标编号/项目',
    align: 'left',
    dataIndex: 'orderNo',
    key: 'orderNo',
    render: (text, record) => (
      <>
        <EyeAuthButton url={`${history.location.pathname}/detail?id=${record.id}`}>{text}</EyeAuthButton>
        <div>{text}</div>
      </>
    ),
  },
  {
    title: '招标编号/会员',
    align: 'left',
    dataIndex: 'orderNo',
    key: 'orderNo',
    render: (text, record) => (
      <>
        <EyeAuthButton url={`${history.location.pathname}/detail?id=${record.id}`}>{text}</EyeAuthButton>
        <div>{text}</div>
      </>
    ),
  },
  {
    title: '投标开始/截止时间',
    align: 'left',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text, record) => (
      <>
        <div>
          <PlayCircleOutlined />
          {formatTimeString(record.createTime)}
        </div>
        <div>
          <PoweroffOutlined />
          {formatTimeString(record.createTime)}
        </div>
      </>
    ),
    width: 200,
  },
  {
    title: '外部状态',
    align: 'left',
    dataIndex: 'inviteTenderOutStatusValue',
    key: 'inviteTenderOutStatusValue',
    render: (text, r) => <CustomTag text={text} color={r.inviteTenderOutStatusColor} />,
  },
  {
    title: '内部状态',
    align: 'left',
    dataIndex: 'inviteTenderInStatusValue',
    key: 'inviteTenderInStatusValue',
    render: (text, r) => <CustomBadge text={text} color={r.inviteTenderInStatusColor} />,
  },
]

import React, { useRef } from 'react'
import { EyeAuthButton } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { CALLFORBID_TYPE, PURCHASE_TYPE } from '@/constants'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { BidInStateTexts, BidOutStateTexts } from '@/constants'
import CustomTag from '../../components/customTag'

// 招标查询
export const useSelfTable = () => {
  const ref = useRef({} as ActionType)

  const callForBidColumns: RecordColumns<any>[] = [
    {
      title: '序号',
      align: 'left',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 60,
      searchField: { type: 'Input', name: 'projectName', title: '招标项目' },
      render: (text, record, index) => index + 1,
    },
    {
      title: '招标编号/项目',
      align: 'left',
      dataIndex: 'code',
      key: 'code',
      fixed: 'left',
      searchField: { type: 'Input', main: true, name: 'inviteTenderCode', title: '招标编号' },
      render: (text, record) => (
        <>
          <EyeAuthButton url={`/purchaseManage/procurement/callForBidsSearch/detail?id=${record.id}`}>
            {text}
          </EyeAuthButton>
          <div>{record['projectName']}</div>
        </>
      ),
    },
    {
      title: '招标会员',
      align: 'left',
      dataIndex: 'memberName',
      key: 'memberName',
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
      title: '报名开始/截止时间',
      align: 'left',
      dataIndex: 'registerStartTime',
      key: 'registerStartTime',
      searchField: {
        type: 'DateRange',
        title: '报名时间',
        name: ['registerStartTime', 'registerEndTime'],
        placeholder: ['报名开始时间', '报名结束时间'],
      },
      render: (text, record) => (
        <>
          <div>
            <PlayCircleOutlined />
            &nbsp;{formatTimeString(record.registerStartTime)}
          </div>
          <div>
            <PoweroffOutlined />
            &nbsp;{formatTimeString(record.registerEndTime)}
          </div>
        </>
      ),
      width: 200,
    },
    {
      title: '资格预审开始/截止时间',
      align: 'left',
      dataIndex: 'checkStartTime',
      key: 'checkStartTime',
      searchField: {
        type: 'DateRange',
        title: '报名时间',
        name: ['preCheckStartTime', 'preCheckEndTime'],
        placeholder: ['预审开始时间', '预审结束时间'],
      },
      render: (text, record) => (
        <>
          {record.preCheckStartTime ? (
            <div>
              <PlayCircleOutlined />
              &nbsp;{formatTimeString(record.preCheckStartTime)}
            </div>
          ) : null}
          {record.preCheckEndTime ? (
            <div>
              <PoweroffOutlined />
              &nbsp;{formatTimeString(record.preCheckEndTime)}
            </div>
          ) : null}
        </>
      ),
      width: 200,
    },
    {
      title: '投标开始/截止时间',
      align: 'left',
      dataIndex: 'inviteTenderStartTime',
      key: 'inviteTenderStartTime',
      searchField: {
        type: 'DateRange',
        title: '报名时间',
        name: ['inviteTenderStartTime', 'inviteTenderEndTime'],
        placeholder: ['投标开始时间', '投标结束时间'],
      },
      render: (text, record) => (
        <>
          <div>
            <PlayCircleOutlined />
            &nbsp;{formatTimeString(record.inviteTenderStartTime)}
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
      title: '开标时间',
      align: 'left',
      dataIndex: 'openTenderTime',
      key: 'openTenderTime',
      render: (text, record) => formatTimeString(record.openTenderTime),
      width: 200,
    },
    {
      title: '外部状态',
      align: 'left',
      dataIndex: 'inviteTenderOutStatusValue',
      key: 'inviteTenderOutStatusValue',
      searchField: [
        {
          type: 'Select',
          name: 'outStatus',
          title: '外部状态',
          valueEnum: Object.keys(BidOutStateTexts).map((item) => ({
            label: BidOutStateTexts[item],
            value: item,
          })),
        },
        {
          type: 'Select',
          name: 'inStatus',
          title: '内部状态',
          valueEnum: Object.keys(BidInStateTexts).map((item) => ({
            label: BidInStateTexts[item],
            value: item,
          })),
        },
      ],
      render: (text, r) => <CustomTag text={text} color={r.inviteTenderOutStatusColor} />,
    },
    // {
    //   title: '内部状态',
    //   align: 'left',
    //   dataIndex: 'inviteTenderInStatus',
    //   key: 'inviteTenderInStatus',
    //   render: (text) => <CustomBadge status={text} type='inside' />
    // },
  ]

  return {
    ref,
    columns: callForBidColumns,
  }
}

import React, { useRef } from 'react'
import { EyeAuthButton } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { BidOutStateTexts } from '@/constants'
import CustomTag from '../../components/customTag'

// 投标查询
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
      searchField: { type: 'Input', name: 'projectName', title: '投标项目' },
      render: (text, record, index) => index + 1,
    },
    {
      title: '招标编号/项目',
      align: 'left',
      dataIndex: 'memberId',
      key: 'memberId',
      searchField: { type: 'Input', main: true, name: 'inviteTenderCode', title: '招标编号' },
      render: (text, record) => (
        <>
          <EyeAuthButton url={`/purchaseManage/procurement/callForBidsSearch/detail?id=${record.inviteTender.id}`}>
            {record.inviteTender.code}
          </EyeAuthButton>
          <div>{record.inviteTender.projectName}</div>
        </>
      ),
    },
    {
      title: '投标编号/会员',
      align: 'left',
      dataIndex: 'code',
      key: 'code',
      searchField: [
        { type: 'Input', name: 'submitTenderCode', title: '投标编号' },
        { type: 'Input', name: 'inviteTenderMemberName', title: '投标会员' },
      ],
      render: (text, record) => (
        <>
          {text ? (
            <EyeAuthButton url={`/purchaseManage/procurement/tenderSearch/detail?id=${record.id}`}>
              {text}
            </EyeAuthButton>
          ) : null}
          <div>{record.memberName}</div>
        </>
      ),
    },
    {
      title: '投标时间',
      align: 'left',
      dataIndex: 'inviteTender',
      key: 'inviteTender',
      render: (text, record) => formatTimeString(record.inviteTender.inviteTenderStartTime),
      width: 200,
    },
    {
      title: '开标时间',
      align: 'left',
      dataIndex: 'inviteTender',
      key: 'inviteTender',
      render: (text, record) => formatTimeString(record.inviteTender.openTenderTime),
      width: 200,
    },
    {
      title: '是否中标',
      align: 'left',
      dataIndex: 'isWin',
      key: 'isWin',
      render: (t, r) => (t === true ? '是' : t === false ? '否' : t),
    },
    {
      title: '外部状态',
      align: 'left',
      dataIndex: 'submitTenderOutStatusValue',
      key: 'submitTenderOutStatusValue',
      searchField: {
        type: 'Select',
        name: 'tenderOutStatusList',
        title: '外部状态',
        valueEnum: Object.keys(BidOutStateTexts).map((item) => ({
          label: BidOutStateTexts[item],
          value: item,
        })),
      },
      render: (text, r) => <CustomTag text={text} color={r.submitTenderOutStatusColor} />,
    },
    // {
    //   title: '内部状态',
    //   align: 'left',
    //   dataIndex: 'interiorState',
    //   key: 'interiorState',
    //   render: (text) => <CustomBadge status={text} type='inside' />
    // },
  ]

  return {
    ref,
    columns: callForBidColumns,
  }
}

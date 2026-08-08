import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button, Badge, Modal, message } from 'antd'
import { ClockCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { EyeAuthButton, AuthButton, StandardFormTable, PageHeaderWrapper } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import type { GetMemberValidateStep1PageResponseDetail } from '@apps/apis'
import { getMemberValidateStep1Page, postMemberValidateStep1Batch } from '@apps/apis'
import { MEMBER_STATUS_TAG_MAP, MEMBER_INNER_STATUS_BADGE_COLOR, MEMBER_OUTER_STATUS_TYPE } from '../constant'
import StatusTag from '../components/StatusTag'
import useSelectOptions from './services/hooks/useSelectOptions'

const { confirm } = Modal

const MemberPr1: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()

  const handleJumpAudit = (record) => {
    history.push(`/memberManage/memberPr1/edit?id=${record.memberId}&validateId=${record.validateId}`)
  }

  const defaultColumns: RecordColumns<GetMemberValidateStep1PageResponseDetail>[] = [
    {
      title: 'ID',
      key: 'memberId',
      dataIndex: 'memberId',
      fixed: 'left',
      width: 60,
    },
    {
      title: '会员名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      searchField: {
        main: true,
      },
      render: (text: any, record) => (
        <>
          <EyeAuthButton url={`/memberManage/memberPr1/detail?id=${record.memberId}&validateId=${record.validateId}`}>
            {text}
          </EyeAuthButton>
          <div>{record.levelTag}</div>
        </>
      ),
    },
    {
      title: '会员类型',
      key: 'memberType',
      dataIndex: 'memberTypeName',
      searchField: 'Select',
    },
    {
      title: '会员角色',
      dataIndex: 'roleName',
      key: 'roleId',
      searchField: 'Select',
    },
    {
      title: '申请来源/时间',
      dataIndex: 'sourceName',
      key: 'source',
      searchField: [
        { name: 'source', title: '申请来源', type: 'Select' },
        { name: 'sourceDate', title: '申请时间', type: 'DateSelect' },
      ],
      render: (text, record) => (
        <>
          <div>{text}</div>
          <div>
            <ClockCircleOutlined /> {record.registerTime}
          </div>
        </>
      ),
    },
    {
      title: '会员状态',
      dataIndex: 'statusName',
      key: 'status',
      render: (text, record) => <StatusTag type={MEMBER_STATUS_TAG_MAP[record.status]} title={text} />,
    },
    {
      title: '外部状态',
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
      render: (text, record) => <StatusTag type={MEMBER_OUTER_STATUS_TYPE[record.outerStatus]} title={text} />,
    },
    {
      title: '内部状态',
      dataIndex: 'innerStatusName',
      key: 'innerStatusName',
      render: (text, record) => (
        <Badge color={MEMBER_INNER_STATUS_BADGE_COLOR[record.innerStatus] || '#606266'} text={text} />
      ),
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (text: any, record: any) => (
        <AuthButton type="custom" code="edit">
          <Button type="link" onClick={() => handleJumpAudit(record)}>
            审核
          </Button>
        </AuthButton>
      ),
    },
  ]

  const fetchData = async (params: any) => {
    const { sourceDate, ...resetParams } = params
    const payload = { ...resetParams }

    if (sourceDate) {
      const [startDate, endDate] = sourceDate.split(',')
      payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
      payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
    }
    const res = await getMemberValidateStep1Page(payload)
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const handleBatch = () => {
    if (!ref.current.selectionKeys.length) {
      message.warning('未选择任何会员')
      return
    }
    confirm({
      title: '提示',
      icon: <QuestionCircleOutlined />,
      content: '确定要审核通过选中的会员吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const members = ref.current
          .getSelectionItems()
          .map((item) => ({ memberId: item.memberId, validateId: item.validateId }))
        return new Promise<void>((resolve, reject) => {
          postMemberValidateStep1Batch(members)
            .then((res) => {
              if (res.code === 1000) {
                ref.current.reload()
                resolve()
              }
              reject()
            })
            .catch(() => {
              reject()
            })
        })
      },
    })
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={defaultColumns}
        autoScrollX
        request={(params) => fetchData(params)}
        searchButtons={[
          {
            children: '批量审核通过',
            onClick() {
              handleBatch()
            },
            key: 'examineBatch',
          },
        ]}
        rowKey="validateId"
        searchSelectMaps={selectData}
        isRowSelection
        actionRef={ref}
      />
    </PageHeaderWrapper>
  )
}

export default MemberPr1

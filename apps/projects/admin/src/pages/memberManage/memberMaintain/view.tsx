import React, { ReactNode, useState, useRef } from 'react'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { Card, Space, Button, Menu, Popconfirm, Badge, message } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { EyeAuthButton, EditAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import UploadModal from '@/components/UploadModal'
import { formatTimeString } from '@/utils'
import {
  MEMBER_INNER_STATUS_VERIFY_PASSED,
  MEMBER_OUTER_STATUS_PLATFORM_VERIFY_PASSED,
  MEMBER_INNER_STATUS_VERIFY_NOT_PASSED,
  MEMBER_INNER_STATUS_TO_BE_COMMIT,
  MEMBER_STATUS_NORMAL,
  MEMBER_SOURCE_PLATFORM,
  MEMBER_STATUS_FROZEN,
  MEMBER_OUTER_STATUS_PLATFORM_VERIFY_NOT_PASSED,
} from '@/constants/const/member'
import { MEMBER_STATUS_TAG_MAP, MEMBER_INNER_STATUS_BADGE_COLOR, MEMBER_OUTER_STATUS_TYPE } from '../constant'
import StatusTag from '../components/StatusTag'
import type { GetMemberMaintenancePageResponse, GetMemberMaintenancePageResponseDetail } from '@apps/apis'
import {
  getMemberMaintenancePage,
  postMemberMaintenanceDelete,
  postMemberMaintenanceCancellationManualCancellation,
} from '@apps/apis'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import useSelectOptions from './services/hooks/useSelectOptions'

const memberMaintain: React.FC<[]> = () => {
  const ref = StandardFormTable.useTableRef()
  const [visibleModal, setVisibleModal] = useState(false)
  const selectData = useSelectOptions()

  const normalizeDate = (data: GetMemberMaintenancePageResponse) => {
    return {
      data: data?.data.map((item) => ({
        ...item,
        id: `${item.memberId}-${item.roleId}`, // 因为会存在相同会员id, 添加会员id和角色id拼接为唯一id
      })),
      totalCount: data.totalCount,
    }
  }

  const fetchData = async (params: any) => {
    const { sourceDate, ...resetParams } = params
    const payload = { ...resetParams }

    if (sourceDate) {
      const [startDate, endDate] = sourceDate.split(',')
      payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
      payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
    }
    const res = await getMemberMaintenancePage(payload)
    if (res.code === 1000) {
      return normalizeDate(res.data)
    }
    return { data: [], totalCount: 0 }
  }

  const handleDelete = (memberId: number, validateId: number) => {
    const mesInstance = message.loading({
      content: '正在删除',
      duration: 0,
    })
    postMemberMaintenanceDelete({
      memberId,
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        ref.current.reload()
      })
      .finally(() => {
        mesInstance()
      })
  }

  const handleLogout = (memberId: number, validateId: number) => {
    return new Promise((resolve) => {
      postMemberMaintenanceCancellationManualCancellation({
        memberId,
        validateId,
      })
        .then((res) => {
          if (res.code === 1000) {
            ref.current.reload()
          }
        })
        .finally(() => {
          resolve(true)
        })
    })
  }

  const defaultColumns: RecordColumns<GetMemberMaintenancePageResponseDetail>[] = [
    {
      title: 'ID',
      key: 'memberId',
      fixed: 'left',
      width: 60,
    },
    {
      title: '会员名称',
      key: 'name',
      fixed: 'left',
      searchField: {
        main: true,
      },
      render: (text: any, record) => (
        <>
          <EyeAuthButton
            url={`/memberManage/memberMaintain/detail?id=${record.memberId}&validateId=${record.validateId}`}
          >
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
      key: 'roleId',
      dataIndex: 'roleName',
      searchField: 'Select',
    },
    {
      title: '会员等级',
      key: 'level',
      dataIndex: 'memberLevels',
      hidden: true,
      searchField: 'Select',
    },
    {
      title: '申请来源/时间',
      key: 'sourceName',
      searchField: [
        { name: 'source', title: '申请来源', type: 'Select' },
        { name: 'sourceDate', title: '申请时间', type: 'DateSelect' },
      ],
      render: (text: any, record: any) => {
        let component: ReactNode = null
        component = (
          <>
            <div>{text}</div>
            <div>
              <ClockCircleOutlined /> {record.registerTime}
            </div>
          </>
        )
        return component
      },
    },
    {
      title: '会员状态',
      key: 'status',
      dataIndex: 'statusName',
      searchField: 'Select',
      render: (text, record) => <StatusTag type={MEMBER_STATUS_TAG_MAP[record.status]} title={text} />,
    },
    {
      title: '外部状态',
      key: 'outerStatus',
      dataIndex: 'outerStatusName',
      searchField: 'Select',
      render: (text, record) => <StatusTag type={MEMBER_OUTER_STATUS_TYPE[record.outerStatus]} title={text} />,
    },
    {
      title: '内部状态',
      key: 'innerStatus',
      dataIndex: 'innerStatusName',
      searchField: 'Select',
      render: (text, record) => (
        <Badge color={MEMBER_INNER_STATUS_BADGE_COLOR[record.innerStatus] || '#606266'} text={text} />
      ),
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (text: any, record: any) => (
        <>
          {record.innerStatus === MEMBER_INNER_STATUS_VERIFY_PASSED &&
            record.outerStatus === MEMBER_OUTER_STATUS_PLATFORM_VERIFY_PASSED && (
              <>
                {record.status === MEMBER_STATUS_NORMAL && (
                  <AuthButton type="custom" code="freeze">
                    <Link
                      to={`/memberManage/memberMaintain/freeze?id=${record.memberId}&validateId=${record.validateId}`}
                    >
                      <Button type="link">冻结</Button>
                    </Link>
                  </AuthButton>
                )}
                {record.status === MEMBER_STATUS_FROZEN && (
                  <AuthButton type="custom" code="unfreeze">
                    <Link
                      to={`/memberManage/memberMaintain/unfreeze?id=${record.memberId}&validateId=${record.validateId}`}
                    >
                      <Button type="link">解冻</Button>
                    </Link>
                  </AuthButton>
                )}
              </>
            )}
          {/* 平台代录入的会员资料才可以修改、删除 */}
          {record.source === MEMBER_SOURCE_PLATFORM &&
            (record.innerStatus === MEMBER_INNER_STATUS_TO_BE_COMMIT ||
              record.innerStatus === MEMBER_INNER_STATUS_VERIFY_NOT_PASSED) && (
              <>
                <EditAuthButton>
                  <Button
                    type="link"
                    onClick={() =>
                      history.push(
                        `/memberManage/memberMaintain/edit?id=${record.memberId}&validateId=${record.validateId}`,
                      )
                    }
                  >
                    编辑
                  </Button>
                </EditAuthButton>
                <AuthButton type="custom" code="delete">
                  <Popconfirm
                    title="确定要删除吗？"
                    okText="是"
                    cancelText="否"
                    onConfirm={() => handleDelete(record.memberId, record.validateId)}
                  >
                    <Button type="link" danger>
                      删除
                    </Button>
                  </Popconfirm>
                </AuthButton>
              </>
            )}

          {record.outerStatus === MEMBER_OUTER_STATUS_PLATFORM_VERIFY_NOT_PASSED && record.verified === 0 && (
            <AuthButton type="custom" code="logout">
              <Popconfirm
                title={
                  <div>
                    "人工注销"操作只针对注册审核不通过
                    <br />
                    的会员，执行注销后，用户可再次注册。
                  </div>
                }
                okText="确认注销"
                cancelText="取消"
                onConfirm={() => handleLogout(record.memberId, record.validateId)}
              >
                <Button type="link" danger>
                  人工注销
                </Button>
              </Popconfirm>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        actionRef={ref}
        columns={defaultColumns}
        autoScrollX
        request={(params) => fetchData(params)}
        searchButtons={[
          {
            children: '新建',
            type: 'primary',
            icon: 'add',
            onClick() {
              history.push(`/memberManage/memberMaintain/add`)
            },
          },
        ]}
        rowKey="id"
        searchSelectMaps={selectData}
      />
      <UploadModal visibleModal={visibleModal} fileText="会员资料" onCancel={() => setVisibleModal(false)} />
    </PageHeaderWrapper>
  )
}

export default memberMaintain

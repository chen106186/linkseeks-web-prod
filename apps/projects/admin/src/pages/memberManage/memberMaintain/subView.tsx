import React, { ReactNode, useState, useRef } from 'react'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { Card, Button, Popconfirm, Badge, message } from 'antd'
import { PlusOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { EyeAuthButton, EditAuthButton, AuthButton, StandardFormTable } from '@apps/components'
import UploadModal from '@/components/UploadModal'
import { formatTimeString } from '@/utils'
import {
  MEMBER_INNER_STATUS_VERIFY_PASSED,
  MEMBER_OUTER_STATUS_PLATFORM_VERIFY_PASSED,
  MEMBER_INNER_STATUS_VERIFY_NOT_PASSED,
  MEMBER_INNER_STATUS_TO_BE_COMMIT,
  MEMBER_STATUS_NORMAL,
  MEMBER_SOURCE_PLATFORM,
} from '@/constants/const/member'
import { MEMBER_STATUS_TAG_MAP, MEMBER_INNER_STATUS_BADGE_COLOR, MEMBER_OUTER_STATUS_TYPE } from '../constant'
import StatusTag from '../components/StatusTag'
import { getMemberMaintenancePage, postMemberMaintenanceDelete } from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'

const memberMaintain: React.FC<[]> = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()
  const [visibleModal, setVisibleModal] = useState(false)

  const fetchData = async (params: any) => {
    const { startDate, endDate } = params
    const payload = { ...params }

    if (startDate) {
      payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
    }
    if (endDate) {
      payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
    }
    const res = await getMemberMaintenancePage(payload)
    if (res.code === 1000) {
      return res.data
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

  const defaultColumns: RecordColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'memberId',
      key: 'memberId',
    },
    {
      title: '会员名称',
      dataIndex: 'name',
      key: 'name',
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
      dataIndex: 'memberTypeName',
      key: 'memberTypeName',
      searchField: {
        type: 'Select',
        name: 'memberType',
      },
    },
    {
      title: '会员角色',
      dataIndex: 'roleName',
      key: 'roleName',
      searchField: {
        type: 'Select',
        name: 'roleId',
      },
    },
    {
      title: '申请来源/时间',
      dataIndex: 'sourceName',
      key: 'sourceName',
      searchField: [
        {
          type: 'Select',
          name: 'source',
          title: '申请来源',
        },
        {
          type: 'Select',
          name: 'level',
          title: '会员等级',
        },
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
      key: 'statusName',
      searchField: {
        type: 'Select',
        name: 'status',
      },
      render: (text, record) => <StatusTag type={MEMBER_STATUS_TAG_MAP[record.status]} title={text} />,
    },
    {
      title: '外部状态',
      key: 'outerStatusName',
      searchField: {
        type: 'Select',
        name: 'outerStatus',
      },
      render: (text, record) => <StatusTag type={MEMBER_OUTER_STATUS_TYPE[record.outerStatus]} title={text} />,
    },
    {
      title: '内部状态',
      key: 'innerStatusName',
      searchField: {
        type: 'Select',
        name: 'innerStatus',
      },
      render: (text, record) => (
        <Badge color={MEMBER_INNER_STATUS_BADGE_COLOR[record.innerStatus] || '#606266'} text={text} />
      ),
    },
    {
      title: '操作',
      key: 'option',
      render: (text: any, record: any) => (
        <>
          {record.innerStatus === MEMBER_INNER_STATUS_VERIFY_PASSED &&
            record.outerStatus === MEMBER_OUTER_STATUS_PLATFORM_VERIFY_PASSED && (
              <AuthButton type="custom" code="freeze">
                <Link to={`/memberManage/memberMaintain/detail?id=${record.memberId}&validateId=${record.validateId}`}>
                  <Button type="link">{record.status === MEMBER_STATUS_NORMAL ? '冻结' : '解冻'}</Button>
                </Link>
              </AuthButton>
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
        </>
      ),
    },
  ]

  const handleMenuClick = (e: any) => {
    console.log('menu', e)
  }

  return (
    <Card>
      <StandardFormTable
        columns={defaultColumns}
        autoScrollX
        rowKey="validateId"
        actionRef={ref}
        request={(params: any) => fetchData(params)}
        searchSelectMaps={selectData}
        searchButtons={[
          {
            key: 'add',
            type: 'primary',
            icon: <PlusOutlined />,
            children: '新建',
            onClick() {
              history.push(`/memberManage/memberMaintain/add`)
            },
          },
          // {
          // 	icon: <DeleteOutlined />,
          // 	children: '删除导入批次',
          // 	onClick(){
          // 		handleMenuClick(1)
          // 	},
          // 	more: true
          // }
        ]}
      />
      <UploadModal visibleModal={visibleModal} fileText="会员资料" onCancel={() => setVisibleModal(false)} />
    </Card>
  )
}

export default memberMaintain

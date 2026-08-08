import { AuthButton, EyeAuthButton, Loading, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import { Button, Card, Tabs } from '@linkseeks/ui'
import './index.global.less'
import { ReactNode, useMemo, useRef, useState } from 'react'
import { ClockCircleOutlined, PlusOutlined } from '@ant-design/icons'
import StatusTag from '@/components/StatusTag'
import { MEMBER_INNER_STATUS_BADGE_COLOR, MEMBER_STATUS_TAG_MAP } from '../constant'
import { Link, useHistory } from '@linkseeks/router-core'
import { getMemberMaintenanceCancellationPage, getMemberMaintenanceCancellationPageItems } from '@apps/apis'
import { RecordColumns, SearchField } from '@apps/components/src/web/StandardFormTable/types'
import { useRequestApi } from '@linkseeks/hooks'

const TabTableItem = ({ status, selectOptions }) => {
  const fetchData = async (params: any) => {
    const payload = { ...params, cancellationStatus: status }

    let res = await getMemberMaintenanceCancellationPage(payload)
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const defaultColumns: RecordColumns<any>[] = [
    {
      title: '会员ID',
      align: 'center',
      key: 'memberId',
      fixed: 'left',
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
          <EyeAuthButton url={`/memberManage/memberOff/detail?id=${record.memberId}&validateId=${record.validateId}`}>
            {text}
          </EyeAuthButton>
          <div>{record.levelTag}</div>
        </>
      ),
    },
    {
      title: '会员类型',
      dataIndex: 'memberTypeName',
      key: 'memberType',
      searchField: { name: 'memberType', type: 'Select' },
    },
    {
      title: '会员角色',
      dataIndex: 'roleName',
      key: 'roleId',
      searchField: { name: 'roleId', type: 'Select' },
    },
    {
      title: '申请注销时间',
      key: 'applyCancellationTime',
    },
    {
      title: '会员状态',
      key: 'status',
      dataIndex: 'statusName',
      fixed: 'right',
      render: (text, record) => <StatusTag type={MEMBER_STATUS_TAG_MAP[record.status]} title={text} />,
      // render: (text, record) => <StatusTag type={MEMBER_STATUS_TAG_MAP[record.status]} title={text} />,
    },
    // 830需求，暂时隐藏该字段，后续可能开放
    // {
    //   title: '审核状态',
    //   key: 'cancellationStatusName',
    //   fixed: 'right',
    //   format: 'Status',
    //   formatPayload: {
    //     statusColors: MEMBER_INNER_STATUS_BADGE_COLOR,
    //     colorField: 'cancellationStatus',
    //   },
    //   // render: (text, record) => <StatusTag type={MEMBER_STATUS_TAG_MAP[record.cancellationStatus]} title={text} />,
    // },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (text: any, record: any) => (
        <>
          {/* 待审核注销状态出现审核按钮 */}
          {record.status === 6 && (
            <AuthButton type="custom" code="approved">
              <Link to={`/memberManage/memberOff/edit?id=${record.memberId}&validateId=${record.validateId}`}>
                <Button type="link">审核</Button>
              </Link>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

  return (
    <StandardFormTable
      tableProps={{
        rowKey: 'validateId',
      }}
      request={fetchData}
      columns={defaultColumns}
      searchSelectMaps={selectOptions}
    />
  )
}

const View = () => {
  const [activeTabKey, setActiveTabKey] = useState<any>()
  const { data, loading } = useRequestApi(getMemberMaintenanceCancellationPageItems)
  const items = useMemo(() => {
    if (data) {
      const { cancellationStatus, ...reset } = data
      // @ts-ignore
      reset.memberType = reset.memberTypes
      // @ts-ignore
      reset.roleId = reset.memberRoles
      return cancellationStatus.map((v) => ({
        label: v.label,
        key: v.value,
        children: <TabTableItem status={v.value} selectOptions={reset} />,
      }))
    } else {
      return []
    }
  }, [data])

  return (
    <PageHeaderWrapper>
      <div className="public-menu-tabs">
        {loading ? (
          <Loading />
        ) : (
          <Tabs
            defaultActiveKey={data!.cancellationStatus[0].value}
            activeKey={activeTabKey}
            onChange={(key) => {
              setActiveTabKey(key)
            }}
            items={items as any}
          />
        )}
      </div>
    </PageHeaderWrapper>
  )
}

export default View

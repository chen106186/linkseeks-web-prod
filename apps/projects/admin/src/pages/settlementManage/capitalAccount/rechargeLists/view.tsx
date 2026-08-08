import React, { useRef, useState } from 'react'
import { Button, Space } from 'antd'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { history } from '@linkseeks/router-manager'
import { EyeAuthButton, DetailAuthButton, AuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { eAccountMemberType, memberStatusMap } from '../constant'
import { getPayEAccountAllInPayProxyRechargePage } from '@apps/apis'
import AuditModal from './components/AuditModal'
// import LevelBrand from '@/components/LevelBrand'

const RechargeLists: React.FC = () => {
  const ref = useRef({} as ActionType)
  const [auditVisible, setAuditVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)

  const columns: RecordColumns<any>[] = [
    {
      title: '会员名称',
      dataIndex: 'memberName',
      key: 'memberName',
      searchField: {
        main: true,
      },
      fixed: 'left',
      render: (text, record) => (
        <>
          <EyeAuthButton
            url={`/settlementManage/capitalAccount/eAccountLists/detail?id=${record.id}&memberId=${record.memberId}`}
          >
            {text}
          </EyeAuthButton>
        </>
      ),
    },
    {
      title: '充值金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '充值状态',
      dataIndex: 'status',
      key: 'status',
      searchField: {
        type: 'Select',
        valueEnum: [
          {
            label: '待审核',
            value: 1,
          },
          {
            label: '审批不通过',
            value: 2,
          },
          {
            label: '充值成功',
            value: 3,
          },
          {
            label: '取消',
            value: 4,
          },
          {
            label: '充值失败',
            value: 5,
          },
          {
            label: '充值失败',
            value: 6,
          },
        ],
      },
      render: (t) => {
        if (t === 1) {
          return <StatusTag title={'待审核'} type="primary" />
        } else if (t === 2) {
          return <StatusTag title={'审批不通过'} type="warnning" />
        } else if (t === 3) {
          return <StatusTag title={'充值成功'} type="success" />
        } else if (t === 4) {
          return <StatusTag title={'取消'} type="default" />
        } else if (t === 5) {
          return <StatusTag title={'充值失败'} type="danger" />
        } else if (t === 6) {
          return <StatusTag title={'退款成功'} type="success" />
        }
      },
    },
    {
      title: '充值备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '充值操作人',
      dataIndex: 'createUserName',
      key: 'createUserName',
    },
    {
      title: 'ip',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '操作',
      key: 'option',
      render: (t: any, r: any) => {
        return r.status === 1 ? (
          <AuthButton type="custom" code="audit">
            <Button type="link" onClick={() => handleAudit(r)}>
              审核
            </Button>
          </AuthButton>
        ) : null
      },
    },
  ]

  const handleAudit = (record: any) => {
    setCurrentRecord(record)
    setAuditVisible(true)
  }

  const handleAuditSuccess = () => {
    ref.current?.reload()
  }

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      const obj = { ...params }
      getPayEAccountAllInPayProxyRechargePage(obj).then((res) => {
        resolve(res.data)
      })
    })
  }

  return (
    <PageHeaderWrapper backDom={false}>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
      />

      <AuditModal
        visible={auditVisible}
        onCancel={() => setAuditVisible(false)}
        onSuccess={handleAuditSuccess}
        record={currentRecord}
      />
    </PageHeaderWrapper>
  )
}

export default RechargeLists

import React, { useRef, useState } from 'react'
import { Button, Space } from 'antd'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { history } from '@linkseeks/router-manager'
import { EyeAuthButton, DetailAuthButton, AuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { eAccountMemberType, memberStatusMap } from '../constant'
import { getPayPlatFormEAccountAllInPayGetPlatFormEAccountList } from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'
import RechargeModal from './components/RechargeModal'
// import LevelBrand from '@/components/LevelBrand'

const EAccountLists: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()
  const [rechargeVisible, setRechargeVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)

  const columns: RecordColumns<any>[] = [
    {
      title: '会员名称',
      dataIndex: 'memberName',
      key: 'memberName',
      className: 'commonPickColor',
      searchField: {
        main: true,
      },
      fixed: 'left',
      render: (text, record) => (
        <>
          <EyeAuthButton url={`/settlementManage/capitalAccount/eAccountLists/detail?id=${record.id}`}>
            {text}
          </EyeAuthButton>
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
      dataIndex: 'memberRoleName',
      key: 'memberRoleName',
      searchField: {
        name: 'memberRoleId',
        type: 'Select',
      },
    },
    // {
    //   title: '会员等级',
    //   dataIndex: 'memberLevel',
    //   key: 'memberLevel',
    //   render: (t, r) => <LevelBrand level={r.level} />
    // },
    {
      title: '开户认证',
      dataIndex: 'isAuth',
      key: 'isAuth',
      render: (t) => (t ? '是' : '否'),
    },
    {
      title: '电子协议签约',
      dataIndex: 'isSign',
      key: 'isSign',
      render: (t) => (t ? '是' : '否'),
      searchField: {
        name: 'accountStatus',
        title: '账户状态',
        type: 'Select',
        valueEnum: [
          {
            label: '正常',
            value: 1,
          },
          {
            label: '已冻结',
            value: 2,
          },
        ],
      },
    },
    {
      title: '会员状态',
      dataIndex: 'memberStatus',
      key: 'memberStatus',
      searchField: {
        type: 'Select',
        valueEnum: [
          {
            label: '正常',
            value: 1,
          },
          {
            label: '已冻结',
            value: 2,
          },
        ],
      },
      render: (t) => t && <StatusTag title={memberStatusMap[t]['title']} type={memberStatusMap[t]['type']} />,
    },
    {
      title: '操作',
      key: 'option',
      render: (t: any, r: any) => (
        <Space>
          <DetailAuthButton>
            <Button
              type="link"
              onClick={() =>
                history.push(
                  `/settlementManage/capitalAccount/eAccountLists/detail?id=${r.id}&status=${r.accountStatus}`,
                )
              }
            >
              冻结/解冻
            </Button>
          </DetailAuthButton>

          <AuthButton type="custom" code="recharge">
            <Button type="link" onClick={() => handleRecharge(r)}>
              充值
            </Button>
          </AuthButton>
        </Space>
      ),
    },
  ]

  const handleRecharge = (record: any) => {
    setCurrentRecord(record)
    setRechargeVisible(true)
  }

  const handleRechargeSuccess = () => {
    ref.current?.reload()
  }

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      const obj = { ...params }
      getPayPlatFormEAccountAllInPayGetPlatFormEAccountList(obj).then((res) => {
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
        searchSelectMaps={selectData}
      />

      <RechargeModal
        visible={rechargeVisible}
        onCancel={() => setRechargeVisible(false)}
        onSuccess={handleRechargeSuccess}
        record={currentRecord}
      />
    </PageHeaderWrapper>
  )
}

export default EAccountLists

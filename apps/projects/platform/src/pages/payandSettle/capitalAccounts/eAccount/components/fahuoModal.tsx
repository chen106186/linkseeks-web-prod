import React, { useRef, useState } from 'react'
import { Button, Space, Modal } from 'antd'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { history } from '@linkseeks/router-manager'
import { PlusOutlined } from '@ant-design/icons'
import { EyeAuthButton, DetailAuthButton, AuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import {
  getPayEAccountAllInPayProxyRechargeMemberPage,
  getPayEAccountAllInPayProxyRechargeCountMemberGet,
} from '@apps/apis'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import HuankuanModel from './huankuanModel'

interface FahuoModalProps {
  visible: boolean
  onCancel: () => void
  onSuccess?: () => void
}

const FahuoModal: React.FC<FahuoModalProps> = ({ visible, onCancel, onSuccess }) => {
  const ref = useRef({} as ActionType)
  const [huankuanVisible, setHuankuanVisible] = useState(false)
  const [rechargeId, setRechargeId] = useState([])
  const [mm, setMm] = useState({ amountCount: 0, repayAmountCount: 0, balanceCount: 0 })
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'id' })

  const columns: RecordColumns<any>[] = [
    {
      title: '会员名称',
      dataIndex: 'memberName',
      key: 'memberName',
      fixed: 'left',
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
            label: '充值成功',
            value: 3,
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
      title: '操作',
      key: 'option',
      render: (t: any, r: any) => {
        return r.status === 3 ? (
          <Button type="link" onClick={() => handleAudit(r)}>
            还款
          </Button>
        ) : null
      },
    },
  ]

  const handleAudit = (row) => {
    rowSelectionCtl.setSelectedRowKeys([row.id])
    rowSelectionCtl.setSelectRow([row])
    setRechargeId([row.id])
    setHuankuanVisible(true)
  }

  const handleAuditSuccess = () => {
    ref.current?.reload()
  }

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      const obj = { ...params }
      getPayEAccountAllInPayProxyRechargeCountMemberGet().then(({ data }) => {
        setMm(data || {})
      })
      getPayEAccountAllInPayProxyRechargeMemberPage(obj).then((res) => {
        ref.current.setSelectionKeys([])
        ref.current.setSelectionItems([])
        resolve(res.data)
      })
    })
  }
  return (
    <Modal title="还款" open={visible} onCancel={onCancel} footer={null} width={1200} destroyOnClose>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '15px' }}>充值金额统计</div>
          <div>{mm.amountCount}</div>
        </div>
        <div>
          <div style={{ fontSize: '15px' }}>还款金额统计</div>
          <div>{mm.repayAmountCount}</div>
        </div>
        <div>
          <div style={{ fontSize: '15px' }}>充值余额统计</div>
          <div>{mm.balanceCount}</div>
        </div>
      </div>
      <Button
        style={{ position: 'absolute', zIndex: 999, marginTop: '10px' }}
        type="primary"
        onClick={() => {
          const selectItems = ref.current.getSelectionItems()
          setRechargeId(selectItems.map((item) => item.id))
          setHuankuanVisible(true)
        }}
      >
        批量还款
      </Button>
      <StandardFormTable
        columns={columns}
        actionRef={ref}
        rowSelection={rowSelection}
        isRowSelection
        getCheckboxProps={(record) => {
          return {
            disabled: record.status == 6, // 根据条件禁用复选框
          }
        }}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
      />

      <HuankuanModel
        visible={huankuanVisible}
        onCancel={() => setHuankuanVisible(false)}
        onSuccess={handleAuditSuccess}
        rechargeId={rechargeId}
      />
    </Modal>
  )
}

export default FahuoModal

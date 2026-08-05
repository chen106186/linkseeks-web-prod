import { forwardRef } from 'react'
import { Table, Typography } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import StatusTag from '@/components/StatusTag'
import { history } from '@linkseeks/router-manager'
const intl = getIntl()

const ContractVersions = (props: any) => {
  const { contractId, contractVersionVO, jumpUrl } = props

  const { Text } = Typography

  const handleJump = (id) => {
    if (contractId != id)
      history.push(jumpUrl ? jumpUrl + id : '/contract/manage/QueryList/QueryListdetails?contractId=' + id)
  }

  const tabcolumns: any = [
    {
      title: intl.formatMessage({ id: 'contract.hetongbianhao' }),
      dataIndex: 'contractNo',
      align: 'left',
      render: (_, item) => (
        <Text
          style={{ color: contractId == item.contractId ? '' : '#00A98F' }}
          onClick={() => handleJump(item.contractId)}
        >
          {item.contractNo}
        </Text>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.zhuangtai' }),
      dataIndex: 'outerStatusName',
      align: 'left',
      render: (_, item) => (
        <StatusTag type={item.outerStatusName !== '已停用' ? 'success' : 'default'} title={item.outerStatusName} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.creat.time' }),
      dataIndex: 'createTime',
      align: 'left',
      render: (_, item) => item.createTime,
    },
    // {
    //     title: intl.formatMessage({ id: 'contract.caozuo' }), dataIndex: 'caozuo', align: 'left',
    //     render: (_, item, index) => contractId == item.contractId ? '' : <Button type='link'>查看</Button>,
    // },
  ]

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <Table
        columns={tabcolumns}
        dataSource={contractVersionVO}
        rowKey="rowId"
        style={{
          width: '100%',
        }}
        pagination={false}
      />
    </div>
  )
}

export default forwardRef(ContractVersions)

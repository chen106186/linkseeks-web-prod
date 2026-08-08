import React, { useRef, useState } from 'react'
import type { IAntdSchemaFormProps } from '@apps/formily'
import { Button, Drawer } from 'antd'
import StandardTable from '@/components/StandardTable'
import { getIntl } from '@linkseeks/i18n'
import { getSettlementBusinessApplyAmountBuyerApplyAmountList } from '@apps/apis'
const intl = getIntl()
export interface Iprops extends IAntdSchemaFormProps {
  /* 显示隐藏 */
  visible: boolean
  item: any
  contractId: number
  setDrawerModal: Function
}
const DrawerModal: React.FC<Iprops> = ({ visible, item, setDrawerModal, contractId }) => {
  const ref = useRef({})
  // const [selectRow, setSelectRow] = useState<any[]>([]) // 抽屉选择的行数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const PaymentList: any = [
    {
      title: intl.formatMessage({ id: 'contract.qingkuandanhaozhaiyao' }),
      dataIndex: 'applyNo',
      align: 'left',
      render: (text: any, record: any) => {
        return (
          <div>
            <p> {text}</p>
            <p>{record.applyAbstract}</p>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.zhuangtai' }),
      dataIndex: 'statusName',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.qingkuanshijian' }),
      dataIndex: 'createTime',
      align: 'left',
      // render: (text: any, record: any) => (
      //   <div>{moment(Number(text)).format('YYYY-MM-DD')}</div>
      // )
    },
    {
      title: intl.formatMessage({ id: 'contract.qingkuanjine' }),
      dataIndex: 'applyAmount',
      align: 'left',
      render: (text: any) => (
        <div>
          {intl.formatMessage({ id: 'common.money' })}
          {text}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.fukuanshijian' }),
      dataIndex: 'payTime',
      align: 'left',
      // render: (text: any, record: any) => (
      //   <div>{moment(Number(text)).format('YYYY-MM-DD')}</div>
      // )
    },
    {
      title: intl.formatMessage({ id: 'contract.fukuanjine' }),
      dataIndex: 'payAmount',
      align: 'left',
      render: (text: any, record: any) => (
        <div>
          {intl.formatMessage({ id: 'common.money' })}
          {record.status === 3 ? record.applyAmount : text ? text : 0}
        </div>
      ),
    },
  ]
  /* 查看付款明细————————————————————查看付款明细———————————————————— */
  const rowSelection: any = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKey: any) => {
      // setSelectRow(selectedRows)
      setSelectedRowKeys(selectedRowKey)
    },
  }
  /* 请求查看付款明细 */
  const fetchTableData = (params) => {
    return new Promise((resolve) => {
      // /settle/accounts/business/apply/amount/buyer/apply/amount/list
      // getContractExecuteExecuteInfoPayDetailList
      getSettlementBusinessApplyAmountBuyerApplyAmountList({
        ...params,
        billNo: item.orderNO,
        contractId,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  return (
    <Drawer
      visible={visible}
      onClose={() => setDrawerModal()}
      title={intl.formatMessage({ id: 'contract.fukuanmingxi' })}
      width={900}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={() => setDrawerModal()} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'contract.quxiao' })}
          </Button>
          <Button type="primary" onClick={() => setDrawerModal()}>
            {intl.formatMessage({ id: 'contract.queding' })}
          </Button>
        </div>
      }
      destroyOnClose
    >
      <StandardTable
        tableProps={{
          rowKey: 'id',
        }}
        columns={PaymentList}
        currentRef={ref}
        rowSelection={rowSelection}
        fetchTableData={(params: any) => fetchTableData(params)}
      />
    </Drawer>
  )
}
export default DrawerModal

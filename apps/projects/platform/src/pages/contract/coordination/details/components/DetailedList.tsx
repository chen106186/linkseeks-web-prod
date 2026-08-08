import React, { useRef } from 'react'
import StandardTable from '@/components/StandardTable'
import { IAntdSchemaFormProps } from '@apps/formily'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { getContractExecutePageListForSummaryByPartyA } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export interface Iprops extends IAntdSchemaFormProps {
  /* 显示隐藏 */
  contractId: any
}
const DetailedList: React.FC<Iprops> = ({ contractId }) => {
  const ref = useRef({})
  const columnsList: any = [
    {
      title: intl.formatMessage({ id: 'contract.fukuancishu' }),
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text: any, record: any, index: number) => {
        return <span>{index + 1}</span>
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.qingkuandanhaozhaiyao' }),
      dataIndex: 'applyNo',
      align: 'center',
      render: (text: any, record: any) => {
        return (
          <>
            <EyeAuthButton url={`/contract/funds/bill/detail?applyId=${record.id}&type=pageDetailList`}>
              {text}
            </EyeAuthButton>
            <p>{record.applyAbstract}</p>
          </>
        )
      },
    },
    { title: intl.formatMessage({ id: 'contract.qingkuanshijian' }), dataIndex: 'applyTime', align: 'center' },
    {
      title: intl.formatMessage({ id: 'contract.qingkuanjine' }),
      dataIndex: 'applyAmount',
      align: 'center',
      render: (text: any, record: any, index: number) => {
        return (
          <span>
            {intl.formatMessage({ id: 'common.money' })}
            {text}
          </span>
        )
      },
    },

    { title: intl.formatMessage({ id: 'contract.fukuanshijian' }), dataIndex: 'payTime', align: 'center' },
    {
      title: intl.formatMessage({ id: 'contract.fukuanjine' }),
      dataIndex: 'payAmount',
      align: 'center',
      render: (text: any, record: any, index: number) => {
        return (
          <span>
            {intl.formatMessage({ id: 'common.money' })}
            {text}
          </span>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.fukuanfangshi' }),
      dataIndex: 'payWayName',
      align: 'center',
    },
  ]
  /* 请款统计 */
  const fetchData = (params: any) => {
    return new Promise((resolve, reject) => {
      getContractExecutePageListForSummaryByPartyA({
        ...params,
        contractId,
      })
        .then((res) => {
          if (res.code === 1000) {
            console.log(res, '这个是什么玩意')
            resolve(res.data)
          } else {
          }
        })
        .catch((err) => {
          resolve([])
        })
    })
  }
  return (
    <div id="record" className="ant-card ant-card-bordered">
      <div className="ant-card-head">
        <div className="ant-card-head-wrapper">
          <div className="ant-card-head-wrapper">
            {intl.formatMessage({ id: 'contract.hetongfukuanqingkuangtongji' })}
          </div>
        </div>
      </div>
      <div className="ant-card-body">
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          currentRef={ref}
          columns={columnsList}
          fetchTableData={(params: any) => fetchData(params)}
        />
      </div>
    </div>
  )
}
export default DetailedList

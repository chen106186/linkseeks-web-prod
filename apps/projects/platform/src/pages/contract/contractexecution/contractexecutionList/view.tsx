/* 合同执行列表 */
import React, { useRef } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card } from 'antd'
import statuStyle from '../../common/colorTag'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { tableListSchema } from '../schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import moment from 'moment'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { getContractExecutePageListByPartyA, getContractExecuteStatusList } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const intl = getIntl()
const contractexecutionList = () => {
  const ref = useRef<any>({})
  //表头
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'contract.hetongbianhaozhaiyao' }),
      dataIndex: 'contractNo',
      align: 'left',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/contract/contractexecution/contractexecutionList/detail?contractId=${record.id}`}
          >
            {text}
          </EyeAuthButton>
          <p>{record.contractAbstract}</p>
        </DetailAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.hetongshengxiaoshixiaoshi' }),
      dataIndex: 'startTime',
      align: 'left',
      render: (text, record) => (
        <div>
          <p>{text}</p>
          <p>{record.endTime}</p>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.hetongyifang' }),
      dataIndex: 'partyBName',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.hetongzongjine' }),
      dataIndex: 'totalAmount',
      align: 'left',
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: intl.formatMessage({ id: 'contract.yizhixingjine' }),
      dataIndex: 'executeAmount',
      align: 'left',
      render: (text) => {
        return (
          <div>
            <p>
              {intl.formatMessage({ id: 'common.money' })}
              {text}
            </p>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.yifukuan' }),
      dataIndex: 'payAmount',
      align: 'left',
      render: (text) => {
        return (
          <div>
            <p>
              {intl.formatMessage({ id: 'common.money' })}
              {text}
            </p>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.yiqingkuandaifukuan' }),
      dataIndex: 'unPayApplyAmount',
      align: 'left',
      render: (text) => {
        return (
          <div>
            <p>
              {intl.formatMessage({ id: 'common.money' })}
              {text}
            </p>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.weiqingkuan' }),
      dataIndex: 'unApplyAmount',
      align: 'left',
      render: (text) => {
        return (
          <div>
            <p>
              {intl.formatMessage({ id: 'common.money' })}
              {text}
            </p>
          </div>
        )
      },
    },

    {
      title: intl.formatMessage({ id: 'contract.waibuzhuangtai' }),
      dataIndex: 'outerStatusName',
      align: 'left',
      render: (text) => {
        return <span style={statuStyle.success}>{text}</span>
      },
    },
  ]
  //下拉框选中值请求
  const fetchOptions = (service) => {
    return async function () {
      const res = await service()
      if (res.code === 1000) {
        if (res.data.innerList) {
          return res.data.innerList.map((item) => {
            return { label: item.message, value: item.code }
          })
        } else {
          return res.data.outerList.map((item) => {
            return { label: item.message, value: item.code }
          })
        }
      }
      return []
    }
  }
  // 列表数据
  const fetchData = (params?: any) => {
    params.status = params.status ? params.status : 0
    params.startTime = params.startTime ? moment(Number(params.startTime)).format('YYYY-MM-DD') : ''
    params.endTime = params.endTime ? moment(Number(params.endTime)).format('YYYY-MM-DD') : ''
    params.outerStatus = params.outerStatus ? params.outerStatus : 0
    console.log(params) //可以直接打印参数
    return new Promise((resolve, reject) => {
      getContractExecutePageListByPartyA({
        ...params,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          resolve([])
        })
    })
  }
  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchData(params)}
          formilyProps={{
            ctx: {
              inline: false,
              schema: tableListSchema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'contractNo', FORM_FILTER_PATH)
                useAsyncSelect('outerStatus', fetchOptions(getContractExecuteStatusList))
              },
              components: {
                DateRangePickerUnix,
                Submit,
              },
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}
export default contractexecutionList

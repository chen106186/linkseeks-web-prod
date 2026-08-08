import React, { useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card } from 'antd'
import statuStyle from '../../common/colorTag'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { SchemaList } from '../schema'
import SearchSelect from '@/components/NiceForm/components/SearchSelect'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import moment from 'moment'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { getContractCoordinationStatusList, getContractExecutePageListByPartyB } from '@apps/apis'
const intl = getIntl()
import { customAuthUrl as AuthUrl } from '@apps/domains'

const Sign = () => {
  const ref = useRef<any>({})
  const getdate = (time) => {
    return new Date(Date.parse(time.replace(/-/g, '/'))).getTime() / 1000
  }
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
            url={`/contract/coordination/implement/detail?contractId=${record.id}&type=implement`}
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
      sorter: {
        compare: (a, b) => getdate(a.startTime) - getdate(b.startTime),
        multiple: 1,
      },
      render: (text, record) => (
        <div>
          <p>{text}</p>
          <p>{record.endTime}</p>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.hetongjiafang' }),
      dataIndex: 'partyAName',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.hetongzongjine' }),
      dataIndex: 'totalAmount',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.yizhixingjine' }),
      dataIndex: 'executeAmount',
      align: 'left',
      render: (text) => (
        <div>
          <p>
            {intl.formatMessage({ id: 'common.money' })} {text}
          </p>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.yifukuan' }),
      dataIndex: 'payAmount',
      align: 'left',
      render: (text) => (
        <div>
          <p>
            {intl.formatMessage({ id: 'common.money' })} {text}
          </p>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.yiqingkuandaifukuan' }),
      dataIndex: 'unPayApplyAmount',
      align: 'left',
      render: (text) => (
        <div>
          <p>
            {intl.formatMessage({ id: 'common.money' })} {text}
          </p>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.weiqingkuan' }),
      dataIndex: 'unApplyAmount',
      align: 'left',
      render: (text) => (
        <div>
          <p>
            {intl.formatMessage({ id: 'common.money' })} {text}
          </p>
        </div>
      ),
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
  const fetchOptions = (service) => {
    return async function () {
      const res = await service()
      if (res.code === 1000) {
        return res.data.outerList.map((item) => {
          return { label: item.message, value: item.code }
        })
      }
      return []
    }
  }

  // 列表数据
  const fetchData = (params?: any) => {
    console.log(params) //可以直接打印参数
    params.startTime = params.startTime ? moment(Number(params.startTime)).format('YYYY-MM-DD') : ''
    params.endTime = params.endTime ? moment(Number(params.endTime)).format('YYYY-MM-DD') : ''
    return new Promise((resolve, reject) => {
      getContractExecutePageListByPartyB({
        ...params,
        outerStatus: params.outerStatus || 0,
        innerStatus: params.innerStatus || 0,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
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
              schema: SchemaList,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'contractNo', FORM_FILTER_PATH)
                useAsyncSelect('outerStatus', fetchOptions(getContractCoordinationStatusList))
              },
              components: {
                DateRangePickerUnix,
                Submit,
                SearchSelect,
              },
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Sign

import React, { useRef } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card } from 'antd'
import statuStyle from '../../common/colorTag'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { CoordinationSchema } from '../schema'
import SearchSelect from '@/components/NiceForm/components/SearchSelect'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import moment from 'moment'
import { getContractCoordinationPageList, getContractCoordinationStatusList } from '@apps/apis'
const intl = getIntl()
import { customAuthUrl as AuthUrl } from '@apps/domains'
const coordinationList = () => {
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
            url={`/contract/coordination/coordinationList/detail?contractId=${record.id}`}
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
      title: intl.formatMessage({ id: 'contract.duiyingdanjuxunyuanlei' }),
      dataIndex: 'sourceNo',
      align: 'left',
      render: (text, record) => (
        <div>
          {text && record.sourceId && (
            <EyeAuthButton
              type={record.sourceType == 1 ? (record.sourceId ? 'link' : 'button') : 'link'}
              url={
                record.sourceType == 1
                  ? `/procurementAbility/offter/offter/preview?id=${record.sourceId}&number${record.sourceNo}`
                  : `/procurementAbility/callForBids/callForBidsSearch/detail?id=${record.sourceId}`
              }
            >
              {text}
            </EyeAuthButton>
          )}
          <p>{record.sourceTypeName}</p>
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
    {
      title: intl.formatMessage({ id: 'contract.neibuzhuangtai' }),
      dataIndex: 'innerStatusName',
      align: 'left',
      render: (text) => {
        return <span style={statuStyle.success}>{text}</span>
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuo' }),
      dataIndex: 'innerStatusName',
      align: 'left',
      render: (text, record) => {
        return (
          <span
            style={{ color: '#00A98F', cursor: 'pointer' }}
            onClick={() => history.push(`/contract/coordination/coordinationList/detail?contractId=${record.id}`)}
          >
            {' '}
            {intl.formatMessage({ id: 'contract.zhakan' })}{' '}
          </span>
        )
      },
    },
  ]
  const fetchOptions = (service, Status) => {
    console.log(service, 'service', Status)
    return async function () {
      const res = await service()
      if (res.code === 1000) {
        if (Status == 'outerStatus') {
          return res.data.outerList.map((item) => {
            return { label: item.message, value: item.code }
          })
        } else {
          return res.data.innerList.map((item) => {
            return { label: item.message, value: item.code }
          })
        }
      }
      return []
    }
  }
  // 列表数据
  const fetchData = (params?: any) => {
    console.log(params) //可以直接打印参数
    return new Promise((resolve, reject) => {
      params.startTime = params.startTime ? moment(Number(params.startTime)).format('YYYY-MM-DD') : ''
      params.endTime = params.endTime ? moment(Number(params.endTime)).format('YYYY-MM-DD') : ''
      getContractCoordinationPageList({
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
              schema: CoordinationSchema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'contractNo', FORM_FILTER_PATH)
                useAsyncSelect('outerStatus', fetchOptions(getContractCoordinationStatusList, 'outerStatus'))
                useAsyncSelect('innerStatus', fetchOptions(getContractCoordinationStatusList, 'innerStatus'))
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

export default coordinationList

import React, { useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card } from 'antd'
import statuStyle from '../../common/colorTag'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { Schema } from '../schema'
import SearchSelect from '@/components/NiceForm/components/SearchSelect'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import moment from 'moment'

import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { getContractCoordinationPageToBeExamineOne } from '@apps/apis'
const intl = getIntl()
const pageToBeExamineOne = () => {
  const ref = useRef<any>({})

  const [Visible, setIsModalVisible] = useState<boolean>(false)
  const [id, setid] = useState('')
  //表头
  const getdate = (time) => {
    return new Date(Date.parse(time.replace(/-/g, '/'))).getTime() / 1000
  }
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'contract.hetongbianhaozhaiyao' }),
      dataIndex: 'contractNo',
      align: 'left',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/contract/coordination/pageToBeExamineOne/detail?contractId=${record.id}`}
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
      dataIndex: 'innerStatus',
      align: 'left',
      render: (text, record) => {
        return (
          <div>
            <span style={statuStyle.point}> </span>
            <span>{record.innerStatusName}</span>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuo' }),
      dataIndex: 'state',
      align: 'left',
      render: (text, record) => {
        return (
          <AuthButton type="custom" code="submit">
            <div>
              <span
                style={{ color: '#00A98F', cursor: 'pointer' }}
                onClick={() =>
                  history.push(
                    `/contract/coordination/pageToBeExamineOne/detail?contractId=${record.id}&type=levelexamine&status=submit`,
                  )
                }
              >
                {intl.formatMessage({ id: 'contract.shenhe' })}
              </span>
            </div>
          </AuthButton>
        )
      },
    },
  ]
  const fetchOptions = (service) => {
    return async function () {
      const res = await service()
      if (res.code === 1000) {
        return res.data.map((item) => {
          return { label: item.name, value: item.status }
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
      getContractCoordinationPageToBeExamineOne({
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

  /* 提交表单 */
  const submitExamine = (id) => {
    setid(id)
    setIsModalVisible(!Visible)
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
              schema: Schema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'contractNo', FORM_FILTER_PATH)
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

export default pageToBeExamineOne

import React, { useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card } from 'antd'
import statuStyle from '../../common/colorTag'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { examineSchema } from '../schema'
import StatusTag from '@/components/StatusTag'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'

import moment from 'moment'
import { getContractManagePageToBeExamineStepOne } from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const intl = getIntl()

const Levelexamine = () => {
  const ref = useRef<any>({})
  const getdate = (time) => {
    return new Date(Date.parse(time.replace(/-/g, '/'))).getTime() / 1000
  }
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([])
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
            url={`/contract/manage/levelexamine/detail?contractId=${record.id}&type=ManageExamineStepOne`}
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
        multiple: 2,
      },
      render: (text, record) => (
        <div>
          <p>
            <PlayCircleOutlined /> &nbsp;{text}
          </p>
          <p>
            <PoweroffOutlined /> &nbsp;{record.endTime}
          </p>
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
      sorter: {
        compare: (a, b) => a.totalAmount - b.totalAmount,
        multiple: 1,
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.duiyingdanjuxunyuanlei' }),
      dataIndex: 'sourceNo',
      align: 'left',
      render: (text, record) => {
        return (
          <div>
            {text && record.sourceId && (
              <EyeAuthButton
                type={record.sourceType == 1 ? (record.sourceId ? 'link' : 'button') : 'link'}
                url={
                  record.sourceType == 1
                    ? `/procurementAbility/confirmOffer/demand?id=${record.sourceId}&number${record.sourceNo}`
                    : `/procurementAbility/callForBids/callForBidsSearch/detail?id=${record.sourceId}`
                }
              >
                {text}
              </EyeAuthButton>
            )}
            <p>{record.sourceTypeName}</p>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.waibuzhuangtai' }),
      dataIndex: 'outerStatus',
      align: 'left',
      render: (text, record) => {
        return <StatusTag type="warning" title={record.outerStatusName} />
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
          <AuthButton type="custom" code="examine">
            <div>
              <span
                style={{ color: '#00A98F', cursor: 'pointer', marginRight: 10 }}
                onClick={() =>
                  history.push(
                    `/contract/manage/levelexamine/examine?contractId=${record.id}&type=ManageExamineStepOne&status=examine`,
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

  // 列表数据
  const fetchData = (params?: any) => {
    console.log(params) //可以直接打印参数
    params.startTime = params.startTime ? moment(Number(params.startTime)).format('YYYY-MM-DD') : ''
    params.endTime = params.endTime ? moment(Number(params.endTime)).format('YYYY-MM-DD') : ''
    return new Promise((resolve, reject) => {
      getContractManagePageToBeExamineStepOne({
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

  const rowSelection: any = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchData(params)}
          rowSelection={rowSelection}
          columns={columns}
          currentRef={ref}
          formilyLayouts={{
            justify: 'space-between',
          }}
          formilyProps={{
            ctx: {
              inline: false,
              schema: examineSchema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'contractNo', FORM_FILTER_PATH)
              },
              components: {
                DateRangePickerUnix,
                Submit,
              },
            },
            layouts: {
              order: 2,
              span: 24,
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Levelexamine

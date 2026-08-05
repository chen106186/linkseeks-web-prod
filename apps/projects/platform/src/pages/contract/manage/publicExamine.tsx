import React, { useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card } from 'antd'
import statuStyle from '../common/colorTag'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { examineSchema } from './schema'
import StatusTag from '@/components/StatusTag'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import moment from 'moment'
import { getContractManageCreatePageToBeSubmitExamine, getContractManagePageToBeSubmitExamine } from '@apps/apis'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { AuthButton } from '@apps/components'
const intl = getIntl()

const Examine = ({ type }: { type?: string }) => {
  /** true :如果包含examineSubmit 则代表是待提交审核合同创建 */
  const { pathname } = useLocation()
  const isExamineSubmit = type === 'examineSubmit'
  const ref = useRef<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([])
  const getdate = (time) => {
    return new Date(Date.parse(time.replace(/-/g, '/'))).getTime() / 1000
  }

  const url = isExamineSubmit ? '/contract/manage/examineSubmit/detail' : '/contract/manage/examine/detail'
  console.log('url:', url)

  //表头
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'contract.hetongbianhaozhaiyao' }),
      dataIndex: 'contractNo',
      align: 'left',
      render: (text, record) => (
        <div>
          {/* contractexamine.see || examineSubmit.see */}
          <AuthButton type="custom" code="detail">
            <EyeAuthButton
              url={`${
                isExamineSubmit ? '/contract/manage/examineSubmit/detail' : '/contract/manage/examine/detail'
              }?contractId=${record.id}&type=${isExamineSubmit ? 'CreatSubmitExamine' : 'ManageSubmitExamine'}`}
            >
              {text}
            </EyeAuthButton>
          </AuthButton>
          <p>{record.contractAbstract}</p>
        </div>
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
            <span style={{ marginLeft: 15 }}>{record.innerStatusName}</span>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuo' }),
      dataIndex: 'state',
      align: 'left',
      render: (text, record) => {
        return isExamineSubmit ? (
          <AuthButton type="custom" code="examine">
            <div>
              <span
                style={{ color: '#00A98F', cursor: 'pointer', marginRight: 10 }}
                onClick={() =>
                  history.push(
                    `/contract/manage/examineSubmit/detail?contractId=${
                      record.id
                    }&type=${'CreatSubmitExamine'}&status=examine`,
                  )
                }
              >
                {intl.formatMessage({ id: 'contract.shenhe' })}
              </span>
            </div>
          </AuthButton>
        ) : (
          <AuthButton type="custom" code="examine">
            <div>
              <span
                style={{ color: '#00A98F', cursor: 'pointer', marginRight: 10 }}
                onClick={() =>
                  history.push(
                    `/contract/manage/examine/detail?contractId=${
                      record.id
                    }&type=${'ManageSubmitExamine'}&status=examine`,
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
    console.log('页面为：', isExamineSubmit ? '待提交审核合同创建' : '待提交审核合同签订')

    const api = isExamineSubmit ? getContractManageCreatePageToBeSubmitExamine : getContractManagePageToBeSubmitExamine
    console.log(params) //可以直接打印参数
    params.startTime = params.startTime ? moment(Number(params.startTime)).format('YYYY-MM-DD') : ''
    params.endTime = params.endTime ? moment(Number(params.endTime)).format('YYYY-MM-DD') : ''
    return new Promise((resolve, reject) => {
      api({
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

export default Examine

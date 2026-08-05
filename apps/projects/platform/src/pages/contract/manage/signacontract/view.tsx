/* 合同管理签订合同页面 */
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
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import moment from 'moment'
import '../../constants/index.less'
import { getContractManagePageToBeSign } from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const intl = getIntl()

const Signacontract = () => {
  const ref = useRef<any>({})
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
            url={`/contract/manage/signacontract/detail?contractId=${record.id}&type=Signacontract`}
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
        compare: (a, b) => a.demandPublishTime - b.demandPublishTime,
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
      title: intl.formatMessage({ id: 'contract.hetongyifang' }),
      dataIndex: 'partyBName',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.hetongzongjine' }),
      dataIndex: 'totalAmount',
      align: 'left',
      sorter: {
        compare: (a, b) => a.demandPublishTime - b.demandPublishTime,
        multiple: 1,
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.duiyingdanjuxunyuanlei' }),
      dataIndex: 'sourceNo',
      align: 'left',
      render: (text, record) => {
        let url = ''
        if (record.sourceId) {
          switch (record.sourceType) {
            case 1: {
              if (record.turn && record.sourceId) {
                url = `/procurementAbility/confirmOffer/offerInquire/preview?id=${record.sourceId}&turn=${record.turn}`
              }
              break
            }
            case 2: {
              url = `/procurementAbility/callForBids/callForBidsSearch/detail?id=${record.sourceId}`
              break
            }
            case 3: {
              url = `/procurementAbility/purchaseBid/search/detail?id=${record.sourceId}&number=${record.sourceNo}`
              break
            }
          }
        }
        return (
          <div>
            {text && record.sourceId && (
              <EyeAuthButton type={record.sourceId ? 'link' : 'button'} url={url}>
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
                    `/contract/manage/signacontract/examine?contractId=${record.id}&type=Signacontract&status=examine`,
                  )
                }
              >
                {intl.formatMessage({ id: 'contract.qiandinghetong' })}
              </span>
            </div>
          </AuthButton>
        )
      },
    },
  ]

  // 列表数据
  const fetchData = (params?: any) => {
    params.startTime = params.startTime ? moment(Number(params.startTime)).format('YYYY-MM-DD') : ''
    params.endTime = params.endTime ? moment(Number(params.endTime)).format('YYYY-MM-DD') : ''
    return new Promise((resolve, reject) => {
      getContractManagePageToBeSign({
        ...params,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch(() => {
          reject()
        })
    })
  }
  // 多选操作
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

export default Signacontract

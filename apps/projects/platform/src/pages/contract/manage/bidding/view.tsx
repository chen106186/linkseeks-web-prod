import React, { useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, message } from 'antd'
import statuStyle from '../../common/colorTag'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import StatusTag from '@/components/StatusTag'
import { BidListSchema } from '../schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import moment from 'moment'
import { getContractPurchaseInviteBidPageToBeCreate } from '@apps/apis'
import { AuthButton } from '@apps/components'
import { authService } from '@apps/services'
// import { postMemberFeignLifecycleStageRuleCheckNotAstrict } from '@apps/apis'
const intl = getIntl()

const BiddingList = () => {
  const ref = useRef<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [, setSelectRow] = useState<any[]>([]) // 模态框选择的行数据

  const getdate = (time) => {
    return new Date(Date.parse(time.replace(/-/g, '/'))).getTime() / 1000
  }

  const Like = (record) => {
    const userInfo = authService.getAuth()
    const param = {
      memberId: userInfo.memberId,
      roleId: userInfo.memberRoleId,
      subMemberId: record.bidWinnerMemberId,
      subRoleId: record.bidWinnerRoleId,
      lifeCycleStageRuleId: 2,
    }
    record.sourceId = record.inviteBidId
    record.sourceNo = record.inviteBidNO
    record.totalAmount = record.bidWinnerAmount
    record.partyBMemberId = record.bidWinnerMemberId
    record.partyBRoleId = record.bidWinnerRoleId
    record.partyBName = record.bidWinnerName
    record.sourceType = '2'
    sessionStorage.setItem('record', JSON.stringify(record))
    history.push(`/contract/manage/addList/add?contractId=${record.id}&sourceType=2`)

    // postMemberFeignLifecycleStageRuleCheckNotAstrict(param, { ctlType: 'none' }).then((res) => {
    //   if (res.data) {
    //     record.sourceId = record.inviteBidId
    //     record.sourceNo = record.inviteBidNO
    //     record.totalAmount = record.bidWinnerAmount
    //     record.partyBMemberId = record.bidWinnerMemberId
    //     record.partyBRoleId = record.bidWinnerRoleId
    //     record.partyBName = record.bidWinnerName
    //     record.sourceType = '2'
    //     sessionStorage.setItem('record', JSON.stringify(record))
    //     console.log(record)
    //     history.push(`/contract/manage/addList/add?contractId=${record.id}&sourceType=2`)
    //   } else {
    //     message.error(intl.formatMessage({ id: 'contract.creat.bidding.tip' }))
    //   }
    // })
  }
  //表头
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'contract.zhaobiaobianhaoxiangmu' }),
      dataIndex: 'inviteBidNO',
      align: 'left',
      render: (text, record) => (
        <div>
          <EyeAuthButton
            url={`/procurementAbility/callForBids/callForBidsSearch/detail?id=${record.inviteBidId}`}
            // type=""
          >
            {text}
          </EyeAuthButton>
          <p>{record.inviteBidAbstract}</p>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.toubiaobianhao' }),
      dataIndex: 'bidNo',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.zhongbiaohuiyuan' }),
      dataIndex: 'bidWinnerName',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.zhongbiaotongzhishijian' }),
      dataIndex: 'bidWinnerNoticeTime',
      align: 'left',
      sorter: {
        compare: (a, b) => getdate(a.bidWinnerNoticeTime) - getdate(b.bidWinnerNoticeTime),
        multiple: 1,
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.zhongbiaojine' }),
      dataIndex: 'bidWinnerAmount',
      align: 'left',
      sorter: {
        compare: (a, b) => a.bidWinnerAmount - b.bidWinnerAmount,
        multiple: 1,
      },
      render: (text) => {
        return (
          <div>
            {intl.formatMessage({ id: 'common.money' })}
            {text}
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.waibuzhuangtai' }),
      dataIndex: 'outerStatus',
      align: 'left',
      render: (text) => {
        return <StatusTag type="success" title={text} />
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.neibuzhuangtai' }),
      dataIndex: 'innerStatus',
      align: 'left',
      render: (text) => {
        return (
          <div>
            <span style={statuStyle.point}> </span>
            <span>{text}</span>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuo' }),
      dataIndex: 'state',
      align: 'left',
      render: (_, record) => {
        return (
          <AuthButton type="custom" code="add">
            <div>
              <span style={{ color: '#00A98F', cursor: 'pointer', marginRight: 10 }} onClick={() => Like(record)}>
                {intl.formatMessage({ id: 'contract.chuangjiancaigouzhaobiaohetong' })}
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
    return new Promise((resolve) => {
      getContractPurchaseInviteBidPageToBeCreate({
        ...params,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }
  const rowSelection: any = {
    selectedRowKeys: selectedRowKeys,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys)
      setSelectRow(selectedRows)
    },
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
          rowSelection={rowSelection}
          fetchTableData={(params: any) => fetchData(params)}
          formilyProps={{
            ctx: {
              inline: false,
              schema: BidListSchema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'inviteBidNO', FORM_FILTER_PATH)
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

export default BiddingList

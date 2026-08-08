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
import { purchaseSchema } from '../schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import moment from 'moment'
import { getContractPurchaseInquiryPageToBeCreate } from '@apps/apis'
import { AuthButton } from '@apps/components'
// import { postMemberFeignLifecycleStageRuleCheckNotAstrict } from '@apps/apis'
import { authService } from '@apps/services'

const intl = getIntl()

const PurchaseList = () => {
  const ref = useRef<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [, setSelectRow] = useState<any[]>([]) // 模态框选择的行数据

  const getdate = (time) => {
    return new Date(Date.parse(time.replace(/-/g, '/'))).getTime() / 1000
  }

  const like = (record) => {
    const userInfo = authService.getAuth()
    const param = {
      memberId: userInfo.memberId,
      roleId: userInfo.memberRoleId,
      subMemberId: record.awardMemberId,
      subRoleId: record.awardRoleId,
      lifeCycleStageRuleId: 2,
    }
    record.sourceId = record.demandId
    record.sourceNo = record.demandNO
    record.totalAmount = record.awardAmount
    record.partyBMemberId = record.awardMemberId
    record.partyBRoleId = record.awardRoleId
    record.partyBName = record.awardName
    sessionStorage.setItem('record', JSON.stringify(record))
    history.push(`/contract/manage/addList/add?contractId=${record.id}&sourceType=1`)

    // postMemberFeignLifecycleStageRuleCheckNotAstrict(param, { ctlType: 'none' }).then((res) => {
    //   if (res.data) {
    //     record.sourceId = record.demandId
    //     record.sourceNo = record.demandNO
    //     record.totalAmount = record.awardAmount
    //     record.partyBMemberId = record.awardMemberId
    //     record.partyBRoleId = record.awardRoleId
    //     record.partyBName = record.awardName
    //     sessionStorage.setItem('record', JSON.stringify(record))
    //     history.push(`/contract/manage/addList/add?contractId=${record.id}&sourceType=1`)
    //   } else {
    //     message.error(intl.formatMessage({ id: 'contract.creat.purchase.tip' }))
    //   }
    // })
  }
  //表头
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'contract.xuqiudanhaozhaiyao' }),
      dataIndex: 'demandNO',
      align: 'left',
      render: (text, record) => (
        <div>
          <EyeAuthButton
            type={record.turn ? 'link' : 'button'}
            url={`/procurementAbility/confirmOffer/offerInquire/preview?id=${record.demandId}&turn=${record.turn}`}
          >
            {text}
          </EyeAuthButton>
          <p>{record.demandAbstract}</p>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.xuqiufabushijian' }),
      dataIndex: 'demandPublishTime',
      align: 'left',
      sorter: {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        compare: (a, b) => getdate(a.demandPublishTime) - getdate(b.demandPublishTime),
        multiple: 1,
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.shoubiaohuiyuan' }),
      dataIndex: 'awardName',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.shoubiaoshijian' }),
      dataIndex: 'awardTime',
      align: 'left',
      sorter: {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        compare: (a, b) => getdate(a.awardTime) - getdate(b.awardTime),
        multiple: 1,
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.shoubiaojine' }),
      dataIndex: 'awardAmount',
      align: 'left',
      sorter: {
        compare: (a, b) => a.awardAmount - b.awardAmount,
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
              <span style={{ color: '#00A98F', cursor: 'pointer', marginRight: 10 }} onClick={() => like(record)}>
                {intl.formatMessage({ id: 'contract.chuangjiancaigouxunjiahetong' })}
              </span>
            </div>
          </AuthButton>
        )
      },
    },
  ]
  const rowSelection: any = {
    selectedRowKeys: selectedRowKeys,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys)
      setSelectRow(selectedRows)
    },
  }

  // 列表数据
  const fetchData = (params?: any) => {
    params.startTime = params.startTime ? moment(Number(params.startTime)).format('YYYY-MM-DD') : ''
    params.endTime = params.endTime ? moment(Number(params.endTime)).format('YYYY-MM-DD') : ''
    return new Promise((resolve) => {
      getContractPurchaseInquiryPageToBeCreate({
        ...params,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch(() => {
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
          rowSelection={rowSelection}
          fetchTableData={(params: any) => fetchData(params)}
          formilyProps={{
            ctx: {
              inline: false,
              schema: purchaseSchema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'demandNO', FORM_FILTER_PATH)
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

export default PurchaseList

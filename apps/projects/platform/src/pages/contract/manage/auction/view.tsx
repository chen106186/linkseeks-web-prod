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
import { ViePriceListSchema } from '../schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import moment from 'moment'
import { getContractPurchaseViePricePageToBeCreate } from '@apps/apis'
import { AuthButton } from '@apps/components'
import { authService } from '@apps/services'
// import { postMemberFeignLifecycleStageRuleCheckNotAstrict } from '@apps/apis'

const intl = getIntl()

const Auction = () => {
  const ref = useRef<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [, setSelectRow] = useState<any[]>([]) // 模态框选择的行数据
  //表头

  const Like = (record) => {
    const userInfo = authService.getAuth()
    const param = {
      memberId: userInfo.memberId,
      roleId: userInfo.memberRoleId,
      subMemberId: record.awardMemberId,
      subRoleId: record.awardRoleId,
      lifeCycleStageRuleId: 2,
    }
    record.sourceId = record.viePriceId
    record.sourceNo = record.viePriceNO
    record.totalAmount = record.awardAmount
    record.partyBMemberId = record.awardMemberId
    record.partyBRoleId = record.awardRoleId
    record.partyBName = record.awardName
    record.sourceType = '3'
    sessionStorage.setItem('record', JSON.stringify(record))
    history.push(`/contract/manage/addList/add?contractId=${record.id}&sourceType=3`)

    // postMemberFeignLifecycleStageRuleCheckNotAstrict(param, { ctlType: 'none' }).then((res) => {
    //   if (res.data) {
    //     record.sourceId = record.viePriceId
    //     record.sourceNo = record.viePriceNO
    //     record.totalAmount = record.awardAmount
    //     record.partyBMemberId = record.awardMemberId
    //     record.partyBRoleId = record.awardRoleId
    //     record.partyBName = record.awardName
    //     record.sourceType = '3'
    //     sessionStorage.setItem('record', JSON.stringify(record))
    //     history.push(`/contract/manage/addList/add?contractId=${record.id}&sourceType=3`)
    //   } else {
    //     message.error(intl.formatMessage({ id: 'contract.creat.auction.tip' }))
    //   }
    // })
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'contract.jingjiadanhao' }),
      dataIndex: 'viePriceNO',
      align: 'left',
      render: (text, record) => (
        <div>
          {/* memberCenter/procurementAbility/purchaseBid/search/detail?id=298&number=JJSQ30725 */}
          <EyeAuthButton
            url={`/procurementAbility/purchaseBid/search/detail?id=${record.viePriceId}&number=${record.viePriceNO}`}
          >
            {text}
          </EyeAuthButton>
          <p>{record.viePriceAbstract}</p>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.jingjiadanzhaiyao1' }),
      dataIndex: 'viePriceNO',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.fabushijian' }),
      dataIndex: 'publishTime',
      align: 'left',
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
              <span style={{ color: '#00A98F', cursor: 'pointer', marginRight: 10 }} onClick={() => Like(record)}>
                {intl.formatMessage({ id: 'contract.chuangjiancaigoujingjiahetong' })}
              </span>
            </div>
          </AuthButton>
        )
      },
    },
  ]

  const getdate = (time) => {
    return new Date(Date.parse(time.replace(/-/g, '/'))).getTime() / 1000
  }
  // 列表数据
  const fetchData = (params?: any) => {
    params.startTime = params.startTime ? moment(Number(params.startTime)).format('YYYY-MM-DD') : ''
    params.endTime = params.endTime ? moment(Number(params.endTime)).format('YYYY-MM-DD') : ''
    return new Promise((resolve) => {
      getContractPurchaseViePricePageToBeCreate({
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
              schema: ViePriceListSchema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'viePriceNO', FORM_FILTER_PATH)
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

export default Auction

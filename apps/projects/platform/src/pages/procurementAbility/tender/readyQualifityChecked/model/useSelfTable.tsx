import React, { useRef } from 'react'
import { Button } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import CustomTag from '@/pages/procurement/components/customTag'
import CustomBadge from '@/pages/procurement/components/customBadge'
import { TenderOutWorkState } from '@/constants/procurement'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const intl = getIntl()

// 待资格预审 逻辑
export const useSelfTable = () => {
  const ref = useRef<any>({})

  const baseBidListColumns = [
    {
      title: intl.formatMessage({ id: 'table.purchase.xuhao' }),
      align: 'left',
      dataIndex: 'id',
      key: 'id',
      render: (t, r, i) => ++i,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.code' }),
      align: 'left',
      dataIndex: 'inviteTender',
      key: 'inviteTender',
      render: (text, record) => (
        <>
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('detail') ? 'link' : 'button'}
              url={`/procurementAbility/tender/callForBidsSearch/detail?id=${record.inviteTender.id}`}
            >
              {record.inviteTender.code}
            </EyeAuthButton>
          </DetailAuthButton>
          <div>{record.inviteTender.projectName}</div>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhaobiaohuiyuan' }),
      align: 'left',
      dataIndex: 'inviteTender',
      key: 'inviteTender',
      render: (text, record) => record.inviteTender.memberName,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.fabushijian' }),
      align: 'left',
      dataIndex: 'inviteTender',
      key: 'inviteTender',
      render: (text, record) => formatTimeString(record.inviteTender.createTime),
      width: 180,
    },
    // {
    //   title: intl.formatMessage({ id: 'table.purchase.baomingkaishi/' }),
    //   align: 'left',
    //   dataIndex: 'memberRoleId',
    //   key: 'memberRoleId',
    //   render: (text, record) => <>
    //     <div><PlayCircleOutlined />&nbsp;{formatTimeString(record.inviteTender.registerStartTime)}</div>
    //     <div><PoweroffOutlined />&nbsp;{formatTimeString(record.inviteTender.registerEndTime)}</div>
    //   </>,
    //   width: 180
    // },
    {
      title: intl.formatMessage({ id: 'table.purchase.preCheckStartTime' }),
      align: 'left',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text, record) => (
        <>
          <div>
            <PlayCircleOutlined />
            &nbsp;{formatTimeString(record.inviteTender.preCheckStartTime)}
          </div>
          <div>
            <PoweroffOutlined />
            &nbsp;{formatTimeString(record.inviteTender.preCheckEndTime)}
          </div>
        </>
      ),
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }),
      align: 'left',
      dataIndex: 'submitTenderOutStatusValue',
      key: 'submitTenderOutStatusValue',
      render: (text, r) => <CustomTag text={text} color={r.submitTenderOutStatusColor} />,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.neibuzhuangtai' }),
      align: 'left',
      dataIndex: 'submitTenderInStatusValue',
      key: 'submitTenderInStatusValue',
      render: (text, r) => <CustomBadge text={text} color={r.submitTenderInStatusColor} />,
    },
  ]

  const handleSubmit = async (id) => {
    history.push(`/procurementAbility/tender/readyQualifityChecked/detail?id=${id}&action=1`)
  }

  const secondColumns: any[] = baseBidListColumns.concat([
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'left',
      dataIndex: 'ctl',
      key: 'ctl',
      width: 200,
      render: (text, record) => {
        return (
          <>
            {record.isSubmitQualifications && (
              <AuthButton type="custom" code="submit">
                <Button type="link" onClick={() => handleSubmit(record.id)}>
                  {intl.formatMessage({ id: 'table.purchase.tijiao' })}
                </Button>
              </AuthButton>
            )}
            {record.isReSubmitQualifications && (
              <AuthButton type="custom" code="chongxintijiao">
                <Button type="link" onClick={() => handleSubmit(record.id)}>
                  {intl.formatMessage({ id: 'table.purchase.chongxintijiao' })}
                </Button>
              </AuthButton>
            )}
          </>
        )
      },
    },
  ])

  return {
    columns: secondColumns,
    ref,
  }
}

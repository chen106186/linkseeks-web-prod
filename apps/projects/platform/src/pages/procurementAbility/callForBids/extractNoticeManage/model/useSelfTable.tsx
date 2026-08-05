import React, { useRef } from 'react'
import { Button } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { ExpertRectractStatus } from '@/constants/procurement'
import { AuthButton } from '@apps/components'
const intl = getIntl()
// 评标委员会 招标
export const useSelfTable = () => {
  const ref = useRef<any>({})

  const baseBidListColumns: any[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.xuhao' }),
      align: 'left',
      dataIndex: 'id',
      key: 'id',
      render: (t, r, i) => ++i,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhaobiaobianhao' }),
      align: 'left',
      dataIndex: ['inviteTender', 'code'],
      key: ['inviteTender', 'code'],
      render: (text, record) => (
        <>
          <EyeAuthButton url={`/procurementAbility/callForBids/callForBidsSearch/detail?id=${record.inviteTender.id}`}>
            {text}
          </EyeAuthButton>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhuanjiabianma' }),
      align: 'left',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhaobiaoxiangmu' }),
      align: 'left',
      dataIndex: ['inviteTender', 'projectName'],
      key: ['inviteTender', 'projectName'],
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.pingbiaokaishi/' }),
      align: 'left',
      dataIndex: ['inviteTender', 'evaluationStartTime'],
      key: ['inviteTender', 'evaluationEndTime'],
      render: (text, record) => (
        <>
          <div>
            <PlayCircleOutlined />
            {formatTimeString(record.inviteTender.evaluationStartTime)}
          </div>
          <div>
            <PoweroffOutlined />
            {formatTimeString(record.inviteTender.evaluationEndTime)}
          </div>
        </>
      ),
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhuangtai' }),
      align: 'left',
      dataIndex: 'status',
      key: 'status',
      render: (t, r) => ExpertRectractStatus[t],
    },
  ]

  const secondColumns: any[] = baseBidListColumns.concat([
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'left',
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <>
          {record.status !== 3 && (
            <AuthButton type="custom" code="queren">
              <Button
                type="link"
                onClick={() =>
                  history.push(
                    `/procurementAbility/callForBids/extractNoticeManage/detail?id=${record.id}&action=1&status=1`,
                  )
                }
              >
                {intl.formatMessage({ id: 'table.purchase.queren' })}
              </Button>
            </AuthButton>
          )}
          {record.status !== 4 && (
            <AuthButton type="custom" code="jujue">
              <Button
                type="link"
                onClick={() =>
                  history.push(
                    `/procurementAbility/callForBids/extractNoticeManage/detail?id=${record.id}&action=1&status=2`,
                  )
                }
              >
                {intl.formatMessage({ id: 'table.purchase.jujue' })}
              </Button>
            </AuthButton>
          )}
          <AuthButton type="custom" code="zhakan">
            <Button
              type="link"
              onClick={() => history.push(`/procurementAbility/callForBids/extractNoticeManage/detail?id=${record.id}`)}
            >
              {intl.formatMessage({ id: 'table.purchase.zhakan' })}
            </Button>
          </AuthButton>
        </>
      ),
    },
  ])

  return {
    columns: secondColumns,
    ref,
  }
}

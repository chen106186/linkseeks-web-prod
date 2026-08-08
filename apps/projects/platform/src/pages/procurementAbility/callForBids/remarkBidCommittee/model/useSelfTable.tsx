import React, { useRef } from 'react'
import { Button, Popconfirm } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import {
  postPurchaseExpertExtractDeleteExpertExtract,
  postPurchaseExpertExtractSendExpertExtract,
  postPurchaseExpertExtractSendExpertExtractAgain,
} from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const intl = getIntl()

// 评标委员会 招标
export const useSelfTable = () => {
  const ref = useRef<any>({})

  const handelEdit = (id) => {
    history.push(`/procurementAbility/callForBids/remarkBidCommittee/edit?id=${id}`)
  }

  const handelSend = async (id) => {
    const { code } = await postPurchaseExpertExtractSendExpertExtract({ id })
    if (code === 1000) {
      setTimeout(() => {
        ref.current.reloadCurrent()
      }, 600)
    }
  }

  const handleAgainMessage = async (id) => {
    const { code } = await postPurchaseExpertExtractSendExpertExtractAgain({ id })
    if (code === 1000) {
      setTimeout(() => {
        ref.current.reloadCurrent()
      }, 600)
    }
  }

  const handleDelete = async (id) => {
    const { code } = await postPurchaseExpertExtractDeleteExpertExtract({ id })
    if (code === 1000) {
      setTimeout(() => {
        ref.current.reloadCurrent()
      }, 600)
    }
  }

  const baseBidListColumns: any[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.xuhao' }),
      align: 'left',
      dataIndex: 'id',
      key: 'id',
      render: (t, r, i) => ++i,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhutimingcheng' }),
      align: 'left',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        const { pathname } = useLocation()
        return (
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('detail') ? 'link' : 'button'}
              url={`${pathname}/detail?id=${record.id}&preview=1`}
            >
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.numbering' }),
      align: 'left',
      dataIndex: ['inviteTender', 'code'],
      key: ['inviteTender', 'code'],
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.kaibiaoshijian' }),
      align: 'left',
      dataIndex: ['inviteTender', 'openTenderTime'],
      key: ['inviteTender', 'openTenderTime'],
      render: (text, record) => formatTimeString(text),
      width: 200,
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
            {formatTimeString(text)}
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
      title: intl.formatMessage({ id: 'table.purchase.expertCount' }),
      align: 'left',
      dataIndex: 'expertCount',
      key: 'expertCount',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.expertConfirmCount' }),
      align: 'left',
      dataIndex: 'expertConfirmCount',
      key: 'expertConfirmCount',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhuangtai' }),
      align: 'left',
      dataIndex: 'status',
      key: 'status',
      render: (t, r) =>
        t
          ? intl.formatMessage({ id: 'table.purchase.yifasong' })
          : intl.formatMessage({ id: 'table.purchase.daifasong' }),
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
          {!record.status ? (
            <>
              <AuthButton type="custom" code="fasongtongzhi">
                <Button type="link" onClick={() => handelSend(record.id)}>
                  {intl.formatMessage({ id: 'table.purchase.fasongtongzhi' })}
                </Button>
              </AuthButton>

              <AuthButton type="custom" code="del">
                <Popconfirm
                  title={intl.formatMessage({ id: 'table.purchase.quedingyaozhixing' })}
                  onConfirm={() => handleDelete(record.id)}
                  okText={intl.formatMessage({ id: 'table.purchase.shi' })}
                  cancelText={intl.formatMessage({ id: 'table.purchase.fou' })}
                >
                  <Button type="link">{intl.formatMessage({ id: 'table.purchase.shanchu' })}</Button>
                </Popconfirm>
              </AuthButton>
            </>
          ) : (
            <AuthButton type="custom" code="zaicifasongtong">
              <Button type="link" onClick={() => handleAgainMessage(record.id)}>
                {intl.formatMessage({ id: 'table.purchase.zaicifasongtong' })}
              </Button>
            </AuthButton>
          )}
          <AuthButton type="custom" code="edit">
            <Button type="link" onClick={() => handelEdit(record.id)}>
              {intl.formatMessage({ id: 'detail.purchase.edit' })}
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

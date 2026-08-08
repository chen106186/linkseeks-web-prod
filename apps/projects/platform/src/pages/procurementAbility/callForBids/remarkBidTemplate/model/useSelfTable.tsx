import { useRef } from 'react'
import { Button, message, Popconfirm } from 'antd'
import { StatusAuthButton } from '@apps/components'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import {
  getPurchaseTemplateGetTemplateIsUse,
  postPurchaseTemplateDeleteBatchTemplate,
  postPurchaseTemplateUpdateTemplateStatus,
} from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const intl = getIntl()

// 评标模板 招标
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
      title: intl.formatMessage({ id: 'table.purchase.name' }),
      align: 'left',
      dataIndex: 'name',
      key: 'name',
      render: (text: any, record: any) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/procurementAbility/callForBids/remarkBidTemplate/detail?id=${record.id}&preview=1`}
          >
            {text}
          </EyeAuthButton>
        </DetailAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.version' }),
      align: 'left',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.remark' }),
      align: 'left',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhuangtai' }),
      align: 'left',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <AuthButton type="custom" code="status">
          <StatusAuthButton
            handleConfirm={() => handleUpdateState(record)}
            record={record}
            fieldNames="status"
            expectTrueValue={true}
          />
        </AuthButton>
      ),
    },
  ]

  const handleUpdateState = (record) => {
    postPurchaseTemplateUpdateTemplateStatus({ id: record.id, status: !record.status }).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  const handleDelete = (id) => {
    if (!verifyCorrelation(id)) {
      postPurchaseTemplateDeleteBatchTemplate({ idList: [id] }).then((res) => {
        if (res.code === 1000) {
          ref.current.reloadCurrent()
        }
      })
    } else {
      return message.error(intl.formatMessage({ id: 'table.purchase.gaipingbiaomuban' }))
    }
  }

  const handleEdit = (id) => {
    if (!verifyCorrelation(id)) {
      history.push(`/procurementAbility/callForBids/remarkBidTemplate/edit?id=${id}`)
    } else {
      return message.error(intl.formatMessage({ id: 'table.purchase.gaipingbiaomuban1' }))
    }
  }

  const verifyCorrelation = async (id) => {
    const { data } = await getPurchaseTemplateGetTemplateIsUse({ id })
    return data
  }

  const secondColumns: any[] = baseBidListColumns.concat([
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'left',
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <>
          <AuthButton type="custom" code="edit">
            <Button type="link" onClick={() => handleEdit(record.id)}>
              {intl.formatMessage({ id: 'table.purchase.bianji' })}
            </Button>
          </AuthButton>
          <AuthButton type="custom" code="del">
            <Popconfirm
              title={intl.formatMessage({ id: 'table.purchase.quedingyaozhixing1' })}
              onConfirm={() => handleDelete(record.id)}
              okText={intl.formatMessage({ id: 'table.purchase.okText' })}
              cancelText={intl.formatMessage({ id: 'table.purchase.cancelText' })}
            >
              <Button type="link">{intl.formatMessage({ id: 'detail.purchase.detele' })}</Button>
            </Popconfirm>
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

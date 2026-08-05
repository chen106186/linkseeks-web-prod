import React, { useRef } from 'react'
import { StandardFormTable } from '@apps/components'
import { commonColumns } from '../constats/columns'
import {
  postTradeAskPurchasePage,
  postTradeAskPurchasePublish,
  postTradeAskPurchaseDelete,
  postTradeInquiryListDeleteAll,
} from '@apps/apis'
import { PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import { history } from '@linkseeks/router-manager'
import { message, Popconfirm } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { Button } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'

const WaitRelease = () => {
  const intl = useIntl()
  const loadingRef = useRef<boolean>(false)
  const tableRef = StandardFormTable.useTableRef()
  const translate = useWebIntl()

  /** 批量审核 */
  const fetchSubmitRelease = async (id?: number) => {
    if (loadingRef.current) {
      return
    }
    loadingRef.current = true
    let res: any = null
    if (id) {
      res = await postTradeAskPurchasePublish({ ids: [Number(id)] })
    } else {
      const selectItems = tableRef.current.getSelectionItems()
      if (selectItems.length === 0) {
        message.info(translate('web.resource.deal.qingxuanzeyaofabudexunyuanxuqiudan'))
        return
      }
      res = await postTradeAskPurchasePublish({ ids: selectItems.map((item) => item.id) })
    }
    if (res.code === 1000) {
      tableRef.current.reload()
      tableRef.current.setSelectionKeys([])
      tableRef.current.setSelectionItems([])
    }

    loadingRef.current = false
  }

  /**
   * 删除或批量删除
   * @type: 1: 单个删除, 2: 批量删除
   * */
  const fnDelectItem = async (id?: number) => {
    let res: any = null
    if (id) {
      res = await postTradeAskPurchaseDelete({ id })
    } else {
      const selectItems = tableRef.current.getSelectionItems()
      if (selectItems.length === 0) {
        message.info(translate('web.resource.deal.qingxuanzeyaoshanchudexunyuandexunyuanxuqiu'))
        return
      }
      res = await postTradeInquiryListDeleteAll({ ids: selectItems.map((item) => item.id) })
    }
    if (res.code === 1000) {
      tableRef.current.reload()
      tableRef.current.setSelectionKeys([])
      tableRef.current.setSelectionItems([])
    }
  }

  const columns = StandardFormTable.createColumns([
    ...commonColumns,
    {
      title: translate('web.common.control'),
      key: 'option',
      render: (_, record) => (
        <>
          <Popconfirm
            title={intl.formatMessage({
              id: 'transaction_components.shifoutijiaofabuqiugou',
              defaultMessage: '是否提交发布求购需求',
            })}
            okText={intl.formatMessage({ id: 'dealAbility.shi' })}
            cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
            onConfirm={() => fetchSubmitRelease(record.id)}
          >
            <Button type="link">
              {intl.formatMessage({
                id: 'transaction_components.fabu',
                defaultMessage: '发布',
              })}
            </Button>
          </Popconfirm>
          <Button type="link" onClick={() => history.push(`/dealAbility/wangBuy/list/edit?id=${record.id}`)}>
            {intl.formatMessage({
              id: 'transaction_components.xiugai',
              defaultMessage: '修改',
            })}
          </Button>
          <Popconfirm
            title={translate('web.resource.deal.shifoushanchuxunyuanxuqiudan')}
            okText={intl.formatMessage({ id: 'dealAbility.shi' })}
            cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
            onConfirm={() => fnDelectItem(record.id)}
          >
            <Button type="link">
              {intl.formatMessage({
                id: 'transaction_components.shanchu',
                defaultMessage: '删除',
              })}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ])

  const fetchData = (params) => {
    const payload = {
      ...params,
      status: 1,
    }

    if (payload.billStartTime) {
      payload.billStartTime = moment(payload.billStartTime).format('YYYY-MM-DD HH:mm:ss')
    }

    if (payload.billEndTime) {
      payload.billEndTime = moment(payload.billEndTime).format('YYYY-MM-DD HH:mm:ss')
    }

    return new Promise((resolve) => {
      postTradeAskPurchasePage(payload, { ctlType: 'none' }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  return (
    <StandardFormTable
      columns={columns}
      actionRef={tableRef}
      request={fetchData}
      isRowSelection
      rowSelectionType="checkbox"
      searchButtons={[
        {
          children: translate('web.common.add'),
          onClick() {
            history.push(`/dealAbility/wangBuy/list/add`)
          },
          icon: <PlusOutlined />,
          type: 'primary',
        },
        {
          children: translate('web.resource.deal.piliangfabu'),
          onClick() {
            fetchSubmitRelease()
          },
        },
      ]}
    />
  )
}

export default WaitRelease

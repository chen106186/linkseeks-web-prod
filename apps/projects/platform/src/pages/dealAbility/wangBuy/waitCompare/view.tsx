import React, { Fragment, useRef, useState } from 'react'
import { StandardFormTable } from '@apps/components'
import { commonColumns } from '../constats/columns'
import { postTradeAskPurchasePage, postTradeAskPurchaseInvalid } from '@apps/apis'
import moment from 'moment'
import { history } from '@linkseeks/router-manager'
import { Form, Input, message, Modal } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { Button } from '@linkseeks/ui'
import { validatorByte } from '@/utils/regExp'
import { useWebIntl } from '@apps/locales'

const WaitCompare = () => {
  const intl = useIntl()
  const loadingRef = useRef<boolean>(false)
  const tableRef = StandardFormTable.useTableRef()
  const [toVoid, setToVoid] = useState<boolean>(false)
  const [form] = Form.useForm()
  const translate = useWebIntl()

  const columns = StandardFormTable.createColumns([
    ...commonColumns,
    {
      title: translate('web.common.control'),
      key: 'option',
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => history.push(`/dealAbility/wangBuy/list/detail?id=${record.id}&comparePrices=true`)}
          >
            {translate('web.resource.deal.bijia')}
          </Button>
          {(record.status === 6 || record.status === 7) && (
            <Button
              type="link"
              onClick={() => history.push(`/dealAbility/wangBuy/list/detail?id=${record.id}&comparePrices=true`)}
            >
              {translate('web.resource.deal.xiugaishoubiaojieguo')}
            </Button>
          )}
          <Button
            type="link"
            onClick={() => {
              setToVoid(true)
              form.setFieldValue('id', record.id)
            }}
          >
            {intl.formatMessage({
              id: 'transaction_components.zuofei',
              defaultMessage: '作废',
            })}
          </Button>
          {Number(record.quoteCount) > 0 && (
            <Button type="link" onClick={() => history.push(`/dealAbility/wangBuy/offer/detail?id=${record.id}`)}>
              {intl.formatMessage({
                id: 'transaction_components.zhakanbaojia',
                defaultMessage: '查看报价',
              })}
            </Button>
          )}
        </>
      ),
    },
  ])

  const fetchData = (params) => {
    const payload = {
      ...params,
      status: 3,
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

  const fnDelectItemDesc = () => {
    form.validateFields().then((values) => {
      postTradeAskPurchaseInvalid(values).then((res) => {
        if (res.code === 1000) {
          tableRef.current.reload()
          setToVoid(false)
        }
      })
    })
  }

  return (
    <Fragment>
      <StandardFormTable columns={columns} actionRef={tableRef} request={fetchData} />
      <Modal
        title={intl.formatMessage({
          id: 'transaction_components.zuofeiyuanyin',
          defaultMessage: '作废原因',
        })}
        open={toVoid}
        onCancel={() => {
          setToVoid(false)
        }}
        onOk={(e) => {
          fnDelectItemDesc()
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label={translate('web.resource.deal.zuofeiyuanyin')}
            name="remark"
            rules={[
              {
                required: true,
                message: translate('web.common.qingtianxie'),
              },
              {
                validator: (r, v, c) => validatorByte(r, v, c, 100),
              },
            ]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  )
}

export default WaitCompare

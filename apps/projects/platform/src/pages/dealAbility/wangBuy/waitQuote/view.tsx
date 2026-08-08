import React, { Fragment, useRef, useState } from 'react'
import { StandardFormTable } from '@apps/components'
import { commonColumns } from '../constats/columns'
import { postTradeAskPurchasePage, postTradeAskPurchaseEndQuote, postTradeAskPurchaseInvalid } from '@apps/apis'
import moment from 'moment'
import { history } from '@linkseeks/router-manager'
import { Form, Input, Modal, Popconfirm } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { Button } from '@linkseeks/ui'
import { validatorByte } from '@/utils/regExp'
import { useWebIntl } from '@apps/locales'

const WaitQuote = () => {
  const intl = useIntl()
  const loadingRef = useRef<boolean>(false)
  const tableRef = StandardFormTable.useTableRef()
  const [toVoid, setToVoid] = useState<boolean>(false)
  const [form] = Form.useForm()
  const translate = useWebIntl()

  /**
   * 结束报价
   * @type: 1: 单个删除, 2: 批量删除
   * */
  const fnStopQuote = async (id: number) => {
    let res = await postTradeAskPurchaseEndQuote({ id })
    if (res.code === 1000) {
      tableRef.current.reload()
    }
  }

  const columns = StandardFormTable.createColumns([
    ...commonColumns,
    {
      title: translate('web.common.control'),
      key: 'option',
      render: (_, record) => (
        <>
          {record.status === 2 && (
            <Popconfirm
              title={translate('web.resource.deal.shifoutiqianjieshudangqianbaojia')}
              okText={intl.formatMessage({ id: 'dealAbility.shi' })}
              cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
              onConfirm={() => fnStopQuote(record.id)}
            >
              <Button type="link">{translate('web.resource.deal.jieshubaojia')}</Button>
            </Popconfirm>
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
      status: 2,
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

export default WaitQuote

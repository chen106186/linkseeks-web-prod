/*
 * @Author: Bill
 * @Date: 2020-10-19 11:53:43
 * @desc 发票管理 发票列表
 */

import React, { useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Row, Col, Switch, Popconfirm } from 'antd'
import { FormOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { IReceiptProps } from '../../common/type'
import { getSettlementInvoiceMessageList, postSettlementInvoiceMessageDelete } from '@apps/apis'

interface iProps {}

interface ItemIprops extends IReceiptProps {
  onRemove: (id: number | string) => void
}

const ReceiptItem: React.FC<ItemIprops> = (props) => {
  const { id, kind, type, invoiceTitle, taxNo, bankOfDeposit, account, address, tel, isDefault } = props
  const intl = useIntl()
  const handleRouterPush = () => {
    history.push(`/balance/settleRules/receipt/detail?id=${id}`)
  }
  const handleDelete = (id: number | string) => {
    props.onRemove(id)
  }
  return (
    <div className={styles.item}>
      <div className={styles.controller}>
        <div className={styles.edit} onClick={handleRouterPush}>
          <FormOutlined />
        </div>
        <div className={styles.remove}>
          <Popconfirm
            title={intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.popconfirm.title' })}
            onConfirm={() => handleDelete(id)}
            okText={intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.popconfirm.okText' })}
            cancelText={intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.popconfirm.cancelText' })}
          >
            <DeleteOutlined />
          </Popconfirm>
        </div>
      </div>
      <Row className={styles.row}>
        <Col span={6}>{intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.row.1.title' })}</Col>
        <Col span={18}>
          {type == 1
            ? intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.row.1.text.1' })
            : intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.row.1.text.2' })}
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col span={6}>{intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.row.2.title' })}</Col>
        <Col span={18}>
          {kind == 1
            ? intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.row.2.text.1' })
            : intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.row.2.text.2' })}
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col span={6}>{intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.row.3.title' })}</Col>
        <Col span={18}>{invoiceTitle}</Col>
      </Row>
      <Row className={styles.row}>
        <Col span={6}>{intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.row.4.title' })}</Col>
        <Col span={18}>{taxNo}</Col>
      </Row>
      <Row className={styles.row}>
        <Col span={6}>{intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.row.5.title' })}</Col>
        <Col span={18}>{account}</Col>
      </Row>
      <Row className={styles.row}>
        <Col span={6}>{intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.row.6.title' })}</Col>
        <Col span={18}>{bankOfDeposit}</Col>
      </Row>
      <Row className={styles.row}>
        <Col span={6}>{intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.row.7.title' })}</Col>
        <Col span={18}>{address}</Col>
      </Row>
      <Row className={styles.row}>
        <Col span={6}>{intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.row.8.title' })}</Col>
        <Col span={18}>{tel}</Col>
      </Row>
      <Row>
        <Col span={6}>{intl.formatMessage({ id: 'balance.settleRules.receipt.receiptItem.row.9.title' })}</Col>
        <Col span={18}>
          <Switch disabled checked={isDefault ? true : false} />
        </Col>
      </Row>
    </div>
  )
}

const Receipt: React.FC<iProps> = () => {
  const [list, setList] = useState<IReceiptProps[]>([])
  const intl = useIntl()
  const fetchData = async () => {
    const { data, code } = await getSettlementInvoiceMessageList()
    if (code === 1000) {
      return data
    }
    return []
  }
  useEffect(() => {
    fetchData().then((data: IReceiptProps[]) => {
      setList(data)
    })
  }, [])

  const handleRouterAdd = () => {
    history.push('/balance/settleRules/receipt/add')
  }

  // 删除发票
  const remove = async (id: number) => {
    const res = await postSettlementInvoiceMessageDelete({ id })
    if (res.code == 1000) {
      const newList = list.filter((item) => item.id !== id)
      setList(newList)
    }
  }

  return (
    <PageHeaderWrapper>
      <Row gutter={24}>
        {list.map((item) => {
          return (
            <Col span={8} key={item.id} className={styles.margin}>
              <ReceiptItem onRemove={remove} {...item} />
            </Col>
          )
        })}

        <Col span={8} className={styles.margin}>
          <div className={styles.add} onClick={handleRouterAdd}>
            <div>
              <PlusOutlined />
            </div>
            <div>{intl.formatMessage({ id: 'balance.settleRules.receipt.add' })}</div>
          </div>
        </Col>
      </Row>
    </PageHeaderWrapper>
  )
}

export default Receipt

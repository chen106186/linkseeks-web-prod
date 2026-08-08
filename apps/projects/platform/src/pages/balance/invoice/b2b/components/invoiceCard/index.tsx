import React, { Fragment, useEffect, useState, useMemo, useRef } from 'react'
import { Row, Col, Button, Form, Input, DatePicker } from 'antd'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'

import { priceFormat } from '@/utils/numberFomat'

import { Card } from '@linkseeks/ui'

import styles from './index.less'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
interface InvoiceCardProps {
  id: string
  title: string
  editAble: boolean
  data?: any
  formRef?: any
}

interface InvoiceListItem {
  number: number
  invoiceDate: string | number
  invoiceAmount: number
  remark: string
}

interface InvoiceListProps {
  data: InvoiceListItem
}

const Col_1 = [
  { label: translate('web.resource.balance.kaijuleixing'), key: 'typeName' },
  { label: translate('web.resource.balance.fapiaozhonglei'), key: 'kindName' },
  { label: translate('web.resource.balance.fapiaotaitou'), key: 'invoiceTitle' },
  { label: translate('web.resource.balance.nashuihao'), key: 'taxNo' },
]

const Col_2 = [
  { label: translate('web.resource.balance.kaihuhang'), key: 'bankOfDeposit' },
  { label: translate('web.common.account'), key: 'account' },
  { label: translate('web.common.address'), key: 'address' },
  { label: translate('web.common.telNumber'), key: 'tel' },
]

const InvoiceList: React.FC<InvoiceListProps> = (props: InvoiceListProps) => {
  const { data } = props
  return (
    <Row gutter={[8, 8]} className={styles.invoiceList}>
      <Col span={6}>
        <div className={styles.title}>{translate('web.resource.balance.fapiaohaoma')}</div>
        <div className={styles.content}>{data.number}</div>
      </Col>
      <Col span={6}>
        <div className={styles.title}>{translate('web.resource.balance.kaipiaoriqi')}</div>
        <div className={styles.content}>{data.invoiceDate}</div>
      </Col>
      <Col span={6}>
        <div className={styles.title}>
          {translate('web.resource.balance.kaipiaojine')}({translate('web.common.currency')})
        </div>
        <div className={styles.content}>
          {translate('web.common.currencySymbol')}
          {priceFormat(data.invoiceAmount)}
        </div>
      </Col>
      <Col span={6}>
        <div className={styles.title}>{translate('web.common.remark')}</div>
        <div className={styles.content}>{data.remark}</div>
      </Col>
    </Row>
  )
}

const InvoiceCard: React.FC<InvoiceCardProps> = (props: InvoiceCardProps) => {
  const { id, title, data } = props
  const [dataSource, setDataSource] = useState<any>([])

  const _handleAdd = () => {
    setDataSource([...dataSource, {}])
  }

  const _handleRemove = (index: number) => {
    const arr = [...dataSource]
    arr.splice(index, 1)
    setDataSource(arr)
  }

  return (
    <Card id={id} title={title}>
      <div className={styles.itemTitle}>{translate('web.resource.balance.yuandingdankaipiaoxinxi')} (DPTY12)</div>
      <Row gutter={[8, 8]}>
        <Col span={12}>
          {Col_1.map((item) => (
            <div className={styles.baseItem}>
              <div className={styles.label}>{item.label}</div>
              <div className={styles.content}>{data[item.key]}</div>
            </div>
          ))}
        </Col>
        <Col span={12}>
          {Col_2.map((item) => (
            <div className={styles.baseItem}>
              <div className={styles.label}>{item.label}</div>
              <div className={styles.content}>{data[item.key]}</div>
            </div>
          ))}
        </Col>
      </Row>
      <div className={styles.itemTitle}>{translate('web.resource.balance.yuandingdanfapiaoxinxi')}</div>
      {data?.invoiceList?.map((item, index) => (
        <InvoiceList data={item} key={`invoiceList_${index}`} />
      ))}
      <div className={styles.itemTitle}>{translate('web.resource.balance.xinzengfapiaoxinxi')}</div>
      <Row gutter={[8, 8]} className={styles.addInvoice}>
        <Col flex="auto">
          <Row gutter={[8, 8]}>
            <Col span={6}>
              {translate('web.resource.balance.fapiaohaoma')}
              <span className={styles.required}>*</span>
            </Col>
            <Col span={6}>
              {translate('web.resource.balance.kaipiaoriqi')}
              <span className={styles.required}>*</span>
            </Col>
            <Col span={6}>
              {translate('web.resource.balance.kaipiaojine')}({translate('web.common.currency')})
              <span className={styles.required}>*</span>
            </Col>
            <Col span={6}>
              {translate('web.common.remark')}
              <span className={styles.required}>*</span>
            </Col>
          </Row>
        </Col>
        <Col flex="32px"></Col>
      </Row>
      {dataSource.map((item, index) => (
        <Row key={`invoiceTable_${index}`} gutter={[8, 8]} className={styles.addInvoiceTable}>
          <Col flex="auto">
            <Row gutter={[8, 8]}>
              <Col span={6}>
                <Form.Item name={`number`} rules={[{ required: true, message: '请输入发票号码' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={`invoiceDate`} rules={[{ required: true, message: '请选择日期' }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={`invoiceAmount`} rules={[{ required: true, message: '请输入金额' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={`remark`}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col flex="32px">
            <Button
              className={styles.customerButton}
              icon={<MinusOutlined />}
              onClick={() => {
                _handleRemove(index)
              }}
            />
          </Col>
        </Row>
      ))}
      <Button block className={styles.customerButton} type="dashed" icon={<PlusOutlined />} onClick={_handleAdd}>
        {translate('web.resource.balance.xinzengfapiao')}
      </Button>
    </Card>
  )
}

export default InvoiceCard

import React, { useEffect, useState } from 'react'
import { Form, Table, Radio, Button, Input, Select, Row, Col, Typography, Space, message } from 'antd'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import style from './index.less'
import CrossSellProducts from '../modal/crossSellProducts'
import {
  getPurchasePurchaseInquiryGetMaterielsByPurchaseInquiryId,
  getPurchaseQuotedPriceMaterielDetailed,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { isEmpty } from 'lodash'
import { useQuery } from '@linkseeks/router-core'

const { Text } = Typography
const { Option } = Select

export interface IProps {
  fetchdata: any
  currentRef: any
  name: string
  /** 获取报价轮次 */
  getKey?: (e) => void
  onBadge?: Function
}
const intl = getIntl()
const OfferInfo: React.FC<IProps> = (props: any) => {
  const [form] = Form.useForm()
  const { fetchdata, currentRef, name, getKey, onBadge } = props
  const [tabs, setTabs] = useState<number[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [record, setRecord] = useState<any>({})
  const [index, setIndex] = useState<number>(0)
  const [data, setData] = useState<any>({})
  const [idx, setIdx] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const { type } = useQuery()

  /** 合计 */
  const totalAmountFn = () => {
    let total: number = 0
    if (!isEmpty(data[idx])) {
      data[idx].forEach((item) => {
        total += Number(item.purchaseCount) * (Number(item?.taxUnitPrice) || 0)
      })
    }
    setTotalAmount(total)
  }

  /** 修改税率&单价 */
  const handleEdit = (e, name, index) => {
    const params = { ...data }
    const query = [...params[idx]]
    switch (name) {
      case 'isTax':
        query[index].isTax = Number(e)
        break
      case 'taxProbability':
        query[index].taxProbability = e.target.value
        break
      case 'taxUnitPrice':
        query[index].taxUnitPrice = e.target.value
        totalAmountFn()
        break
    }
    params[idx] = [...query]
    setData(params)
  }
  /** 用于展示有第几轮的TABS */
  const [count, setCount] = useState<number>()
  const handleTabs = (num: number) => {
    const tabs: number[] = []
    for (let i = 0; i < num; i += 1) {
      tabs.push(i + 1)
    }
    setTabs(tabs.reverse())
  }
  /** 查看 */
  const handleCheck = (item: any) => {
    setVisible(true)
    setRecord(item)
  }
  /** 关联 */
  const handleRel = (item: any) => {
    setVisible(true)
    console.log(item, 'item')
    setRecord(item)
  }

  const columns = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.type' }),
      key: 'number',
      dataIndex: 'number',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.nameCode' }),
      key: 'model',
      dataIndex: 'model',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.brand' }),
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.purchaseCount1' }),
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
      render: (text: any, record: any) => (
        <>
          <Typography.Text>{text}</Typography.Text>
          &nbsp;
          <Typography.Text type="secondary">{`(${record.unit})`}</Typography.Text>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.isTax' }),
      key: 'isTax',
      dataIndex: 'isTax',
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={`isTax${index}`}
          style={{ margin: 0 }}
          rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message23' }) }]}
          initialValue={text}
        >
          <Select
            style={{ width: 100 }}
            onChange={(e) => handleEdit(e, 'isTax', index)}
            disabled={fetchdata && count !== tabs[0]}
          >
            <Option value={1}>{intl.formatMessage({ id: 'detail.purchase.okText' })}</Option>
            <Option value={0}>{intl.formatMessage({ id: 'detail.purchase.cancelText' })}</Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.taxProbability' }),
      key: 'taxProbability',
      dataIndex: 'taxProbability',
      render: (text: any, record: any, index: number) => (
        <Form.Item
          style={{ margin: 0 }}
          name={`taxProbability${index}`}
          rules={[
            {
              required: true,
              validator: (_rule, value) => {
                const pattern = /^([0]|([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
                if (!value && value !== 0) {
                  return Promise.reject(new Error(intl.formatMessage({ id: 'detail.purchase.message22' })))
                }
                if (!pattern.test(value)) {
                  return Promise.reject(new Error(intl.formatMessage({ id: 'common.taxProbabilityMSG' })))
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input
            onChange={(e) => handleEdit(e, 'taxProbability', index)}
            disabled={fetchdata && count !== tabs[0]}
            addonAfter="%"
          />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.taxUnitPrice' }),
      key: 'taxUnitPrice',
      dataIndex: 'taxUnitPrice',
      render: (text: any, record: any, index: number) => (
        <Form.Item
          style={{ margin: 0 }}
          name={`taxUnitPrice${index}`}
          rules={[
            {
              required: true,
              validator: (_rule, value) => {
                const pattern = /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/
                if (!value) {
                  return Promise.reject(new Error(intl.formatMessage({ id: 'detail.purchase.message22' })))
                }
                if (!pattern.test(value)) {
                  return Promise.reject(
                    new Error(intl.formatMessage({ id: 'transaction_components.zuiduobaoliu4weixiaoshu' })),
                  )
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input
            onChange={(e) => handleEdit(e, 'taxUnitPrice', index)}
            disabled={fetchdata && count !== tabs[0]}
            addonBefore={intl.formatMessage({ id: 'common.money' })}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <Space direction="vertical">
          <Typography.Text>{intl.formatMessage({ id: 'detail.purchase.taxPrice' })}</Typography.Text>
          <Typography.Text>
            {intl.formatMessage({ id: 'detail.purchase.totalAmount' })}: {intl.formatMessage({ id: 'common.money' })}
            {totalAmount.toFixed(2)}
          </Typography.Text>
        </Space>
      ),
      key: 'taxPrice',
      dataIndex: 'taxPrice',
      render: (text: any, record: any) => (
        <Text>
          {isNaN(Number(record.purchaseCount) * Number(record.taxUnitPrice))
            ? 0
            : (Number(record.purchaseCount) * Number(record.taxUnitPrice)).toFixed(2)}
        </Text>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.option' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (text: any, record: any, index: number) => (
        <Button
          type="link"
          onClick={() => {
            setIndex(index)
            handleRel(record)
          }}
        >
          {intl.formatMessage({ id: 'detail.purchase.modalTitle5' })}
        </Button>
      ),
    },
  ]

  /** 确定关联商品 */
  const handleConfirm = (params: any) => {
    const param = { ...data }
    const query: any[] = [...param[idx]]
    if (!!!params.product.id) {
      message.warning(
        intl.formatMessage({ id: 'table.purchase.qingxuanze', defaultMessage: '请选择' }) +
          intl.formatMessage({ id: 'detail.purchase.modalTitle5', defaultMessage: '关联报价商品' }),
      )
      return
    }
    query[index].shopId = params.shopId
    query[index].shopName = params.shopName
    query[index].shopType = params.shopType
    query[index].shopEnvironment = params.shopEnvironment
    query[index].productId = params.product.id
    query[index].customerCategoryName = params.product.customerCategoryName
    query[index].productName = params.product.name
    query[index].productBrand = params.product.brandName
    query[index].productCategory = params.product.customerCategoryName
    query[index].productAttributeJson = params.product.commodityAttribute
    query[index].enclosureUrls = params.files
    param[idx] = [...query]
    setData(param)
    setVisible(false)
  }

  const setFieldsValueFn = (params: any) => {
    params.forEach((it: any, i: number) => {
      form.setFieldsValue({
        ['isTax' + i]: it.isTax || it.isTax === 0 ? it.isTax : 1,
        ['taxProbability' + i]: it.taxProbability,
        ['taxUnitPrice' + i]: it.taxUnitPrice,
      })
    })
  }

  const fetchTableData = (turn: any, index: number) => {
    const params = {
      id: fetchdata.id,
      turn,
      current: '1',
      pageSize: '100',
    }
    const param = { ...data }
    if (type === 'quote') {
      getPurchasePurchaseInquiryGetMaterielsByPurchaseInquiryId({ ...params })
        .then((res: any) => {
          if (res.code !== 1000) {
            return
          }
          if (res.data.data.length > 0) {
            param[index] = [...res.data.data]
            if (param[index]) {
              setFieldsValueFn(param[index])
            }
          } else {
            param[index] = fetchdata.materiels
            setFieldsValueFn(param[index])
          }
          setData({ ...param })
        })
        .catch((error) => {
          console.warn(error)
        })
    } else {
      getPurchaseQuotedPriceMaterielDetailed({ ...params })
        .then((res: any) => {
          if (res.code !== 1000) {
            return
          }
          param[index] = [...res.data.data]
          if (param[index]) {
            setFieldsValueFn(param[index])
          }
          setData({ ...param })
        })
        .catch((error) => {
          console.warn(error)
        })
    }
  }

  useEffect(() => {
    if (fetchdata.id) {
      const isTurn = fetchdata.turn ? fetchdata.turn : 1
      fetchTableData(isTurn, 0)
    }
    let aCount = 0
    if (fetchdata.turn) {
      aCount = fetchdata.turn + 1
    } else {
      aCount = 1
    }
    if (name === 'edit') {
      aCount = Number(fetchdata.turn)
    }
    form.setFieldsValue({
      count: aCount,
    })
    setCount(aCount)
    handleTabs(aCount)
  }, [fetchdata])

  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          form
            .validateFields()
            .then((res) => {
              const detailss: any = []
              data[0].forEach((item) => {
                detailss.push({
                  purchaseInquiryDetailsId: type === 'quote' ? item.id : item.purchaseInquiryDetailsId,
                  taxUnitPrice: item.taxUnitPrice,
                  isTax: item.isTax || item.isTax === 0 ? item.isTax : 1,
                  taxProbability: item.taxProbability,
                  productName: item.productName,
                  productId: item.productId,
                  goodsId: item.goodsId,
                  productBrand: item.productBrand,
                  productCategory: item.productCategory,
                  productAttributeJson: item.productAttributeJson,
                  enclosureUrls: item.enclosureUrls,
                  shopId: item.shopId,
                  shopName: item.shopName,
                  shopType: item.shopType,
                  shopEnvironment: item.shopEnvironment,
                })
              })
              resolve({
                state: true,
                name: 'offer',
                data: detailss,
              })
              onBadge(0, 1)
            })
            .catch((error) => {
              if (error && error.errorFields) {
                onBadge(error.errorFields.length, 1)
              }
            })
        }),
    }
  }, [data])

  const handleRadioGroup = (e) => {
    const params = { ...data }
    const { value } = e.target
    const index = e.target['data-index']
    setIdx(index)
    setCount(value)
    if (!params[index]) {
      const isTurn = value === 1 ? 1 : index === 0 ? value - 1 : value
      fetchTableData(isTurn, index)
      /** 返回给兄弟 */
    } else {
      setFieldsValueFn(params[index])
    }
    getKey(value)
  }

  return (
    <Form form={form} className={style.offerStyle}>
      <Form.Item name="count" initialValue={count}>
        <Radio.Group onChange={handleRadioGroup}>
          {tabs.length > 0 &&
            tabs.map((item, index: any) => {
              return (
                <Radio.Button key={item} value={item} data-index={index}>
                  {intl.formatMessage({ id: 'common.trun', data: item })}
                </Radio.Button>
              )
            })}
        </Radio.Group>
      </Form.Item>
      <Table
        columns={columns}
        dataSource={data[idx]}
        rowClassName={style.editableRow}
        pagination={{ size: 'small' }}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => (
            <div className={style.childrenWrap}>
              <Row>
                <Col span={3}>
                  <div className={style.childrenTitle}>
                    <p>{intl.formatMessage({ id: 'detail.purchase.correspondence' })}</p>
                    <p>{intl.formatMessage({ id: 'detail.purchase.tenderProduct' })}</p>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={style.childrenContent}>
                    <p>
                      <span>{intl.formatMessage({ id: 'detail.purchase.productId' })}:</span>
                      {record.productId}
                    </p>
                    <p>
                      <span>{intl.formatMessage({ id: 'detail.purchase.goodstName' })}:</span>
                      {record.productName}
                    </p>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={style.childrenContent}>
                    <p>
                      <span>{intl.formatMessage({ id: 'detail.purchase.size' })}:</span>
                      {record.productAttributeJson}
                    </p>
                    <p>
                      <span>{intl.formatMessage({ id: 'detail.purchase.customerCategory' })}:</span>
                      {record.productCategory}
                    </p>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={style.childrenContent}>
                    <p>
                      <span>{intl.formatMessage({ id: 'detail.purchase.brand' })}:</span>
                      {record.categoryBrand}
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          ),
          rowExpandable: (record) => record.productId,
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
            ) : (
              <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
            ),
        }}
      />
      <CrossSellProducts
        rel={count === tabs[0] ? true : false}
        preview={count !== tabs[0] ? true : false}
        visible={visible}
        record={record}
        onClose={() => setVisible(false)}
        onClick={handleConfirm}
      />
    </Form>
  )
}
export default OfferInfo

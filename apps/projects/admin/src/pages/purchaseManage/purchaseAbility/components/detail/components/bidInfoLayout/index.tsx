import React, { useContext, useEffect, useState } from 'react'
import { Tabs, Table, Row, Col, Space, Typography, Button } from 'antd'
import { Context } from '../context'
import { Card } from '@linkseeks/ui'
import style from './index.less'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import CrossSellProducts from './modal'

export interface BidInfoProps {
  fetch?: () => Promise<unknown>
  effect?: any
  /** 获取报价轮次 */
  getKey?: (e) => void
}

const chNum: { [key: number]: string } = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
  8: '八',
  9: '九',
}

const BidInfoLayout: React.FC<BidInfoProps> = (props: any) => {
  const { effect, fetch, getKey } = props
  const context = useContext(Context)
  const [dataSource, setDataSource] = useState<any>([])
  const [turn, setTurn] = useState<Array<number>>([])
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [visible, setVisible] = useState<boolean>(false)
  const [product, setProduct] = useState<any>({})

  /** 轮次 */
  const handleTurn = (num: number) => {
    let isTurn: Array<number> = []
    for (let i = 0; i < num; i += 1) {
      isTurn.push(i + 1)
    }
    setTurn(isTurn.reverse())
  }

  const splitProductAttributeJson = (name: string, num: number) => {
    const arr = name.split('-')
    return arr[num]
  }

  const columns = [
    {
      title: '物料编号/名称',
      key: 'number',
      dataIndex: 'number',
    },
    {
      title: '规格',
      key: 'model',
      dataIndex: 'model',
    },
    {
      title: '品类',
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: '品牌',
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: '采购数量/单位',
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
      title: '含税/税率',
      key: 'isTax',
      dataIndex: 'isTax',
      render: (text: any, record: any) => (
        <>
          <Typography.Text>{text ? '是' : '否'}</Typography.Text>/
          <Typography.Text>{`(${record.taxProbability}%)`}</Typography.Text>
        </>
      ),
    },
    {
      title: '单价(含税)',
      key: 'taxUnitPrice',
      dataIndex: 'taxUnitPrice',
      render: (text: any, record: any) => <Typography.Text>￥{text.toFixed(2)}</Typography.Text>,
    },
    {
      title: (
        <Space direction="vertical">
          <Typography.Text>金额(含税)</Typography.Text>
          <Typography.Text>合计: ￥{totalAmount.toFixed(2)}</Typography.Text>
        </Space>
      ),
      key: 'taxPrice',
      dataIndex: 'taxPrice',
      render: (text: any, record: any) => <Typography.Text>￥{text.toFixed(2)}</Typography.Text>,
    },
  ]

  /** 物料信息 */
  const fetchDataSource = (params: any) => {
    fetch({ ...params }).then((res: any) => {
      if (res.code !== 1000) {
        return
      }
      const { data } = res.data
      setDataSource(data)
      let total: number = 0
      data.forEach((item) => {
        total += item.taxPrice
      })
      setTotalAmount(total)
    })
  }

  const handleOnChange = async (key: any) => {
    fetchDataSource({
      id: effect.id,
      turn: key,
      current: '1',
      pageSize: '10',
    })
    /** 返回给兄弟 */
    getKey(key)
  }

  /** 物料信息 */
  useEffect(() => {
    if (effect.turn) {
      fetchDataSource({
        id: effect.id,
        turn: effect.turn,
        current: '1',
        pageSize: '10',
      })
      handleTurn(effect.turn)
    }
  }, [effect.turn])

  const handleCheck = (item: any) => {
    setVisible(true)
    setProduct({
      ...item,
      customerCategoryName: splitProductAttributeJson(item.productAttributeJson, 1),
    })
  }

  return (
    <Card id="bidInfoLayout" title="报价信息">
      <Tabs defaultActiveKey="1" onChange={handleOnChange}>
        {turn.map((item) => (
          <Tabs.TabPane key={item} tab={`第${chNum[item]}轮`}>
            <Table
              className={style.tableStyle}
              columns={columns}
              rowKey="id"
              expandable={{
                expandedRowRender: (record) => (
                  <div className={style.childrenWrap}>
                    <Row>
                      <Col span={3}>
                        <div className={style.childrenTitle}>
                          <p>对应</p>
                          <p>招标商品</p>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={style.childrenContent}>
                          <p>
                            <span>商品ID:</span>
                            {record.productId}
                          </p>
                          <p>
                            <span>商品名称:</span>
                            {record.productName}
                          </p>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={style.childrenContent}>
                          <p>
                            <span>规格:</span>
                            {splitProductAttributeJson(record.productAttributeJson, 0)}
                          </p>
                          <p>
                            <span>品类:</span>
                            {splitProductAttributeJson(record.productAttributeJson, 1)}
                          </p>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={style.childrenContent}>
                          <p>
                            <span>品牌:</span>
                            {record.productBrand}
                          </p>
                        </div>
                      </Col>
                      <Col span={3}>
                        <div className={style.childrenContent}>
                          <Button type="link" onClick={() => handleCheck(record)}>
                            查看
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ),
                rowExpandable: (record) => !!record.productId,
                expandIcon: ({ expanded, onExpand, record }) =>
                  expanded ? (
                    <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
                  ) : (
                    <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
                  ),
              }}
              dataSource={dataSource}
              pagination={{ size: 'small' }}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
      <CrossSellProducts preview visible={visible} record={product} onClose={() => setVisible(false)} />
    </Card>
  )
}
export default BidInfoLayout

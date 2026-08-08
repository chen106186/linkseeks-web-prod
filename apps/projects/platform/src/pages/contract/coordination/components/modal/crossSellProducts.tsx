import React, { useState } from 'react'
import { Drawer, Anchor, Menu, Layout, Button, Form, Divider, Typography } from 'antd'
import cx from 'classnames'
import style from './index.less'
import { PlusSquareOutlined } from '@ant-design/icons'
import SelectProduct from './selectProduct'
import { getProductCommodityGetCommodityAttributeByCommoditySkuId } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

const { Sider, Content } = Layout
const { Text } = Typography
const { Link } = Anchor
const { SubMenu } = Menu

export interface IProps {
  visible: boolean
  record: any
  onClose?: () => void
  onClick?: (e: any) => void
}

const layout: any = {
  colon: false,
  labelCol: { style: { width: '110px' } },
  labelAlign: 'left',
}
const intl = getIntl()
const CrossSellProducts: React.FC<IProps> = (props: any) => {
  const { visible, record, onClose, onClick } = props
  const [flag, setFlag] = useState<boolean>(false)
  console.log(record)
  const [product, setProduct] = useState<any>({})
  const [attribute, setAttribute] = useState<any>([])
  const handleAnchorClick = (e) => {
    e.preventDefault()
  }

  /**报价商品属性 */
  const GetCommodityAttribute = (id) => {
    getProductCommodityGetCommodityAttributeByCommoditySkuId({ commoditySkuId: id })
      .then((res) => {
        if (res.code === 1000) {
          let { data } = res || {}
          setAttribute(data)
        }
      })
      .catch((err) => {})
  }

  /**选择报价商品回调  */
  const handleSelectPrduct = (params: any) => {
    setProduct(params)
    GetCommodityAttribute(params.id)
    setFlag(false)
  }

  /** 关闭 */
  const handleClose = () => {
    onClose()
    setProduct({})
  }
  /** 确定 */
  const handleConfirm = () => {
    onClick({
      product,
      attribute,
    })
    setAttribute([])
    setProduct({})
  }
  return (
    <>
      <Drawer
        title={intl.formatMessage({ id: 'contract.guanlianbaojiashangpin' })}
        placement="right"
        width={800}
        className={style.drawer}
        onClose={handleClose}
        visible={visible}
        destroyOnClose
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={handleClose} style={{ marginRight: 8 }}>
              {intl.formatMessage({ id: 'contract.quxiao' })}
            </Button>
            <Button onClick={handleConfirm} type="primary">
              {intl.formatMessage({ id: 'contract.queding' })}
            </Button>
          </div>
        }
      >
        <Layout>
          <Sider width={159}>
            <Anchor getContainer={() => document.getElementById('current')} onClick={handleAnchorClick}>
              <Menu>
                <Menu.Item key="1">
                  <Link href="#basic" title={intl.formatMessage({ id: 'contract.jibenxinxi' })} />
                </Menu.Item>
                {attribute.length > 0 &&
                  attribute.map((item: any, index: number) => (
                    <Menu.Item key={`attribute_${index + 1}`}>
                      <Link href={`attribute_${index + 1}`} title={item.customerAttribute.name} />
                    </Menu.Item>
                  ))}
                {/* <Menu.Item key="6">
                  <Link href='#file' title='附件' />
                </Menu.Item> */}
              </Menu>
            </Anchor>
          </Sider>
          <Content id="current">
            <Form {...layout}>
              {/* 基本信息 */}
              <div id="basic">
                <Form.Item
                  style={{ marginBottom: '10px' }}
                  label={
                    <>
                      <Divider
                        type="vertical"
                        style={{
                          width: '2px',
                          height: '16px',
                          margin: '0px 5px 0px 0px',
                          backgroundColor: '#00A98F',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '14px',
                          color: '#909399',
                        }}
                      >
                        {intl.formatMessage({ id: 'contract.jibenxinxi' })}
                      </span>
                    </>
                  }
                />
                {record && (
                  <div className={style.box}>
                    <div className={style.title}>{intl.formatMessage({ id: 'contract.duiyingcaigouwuliao' })}</div>
                    <div className={style.content}>
                      <div className={style.row}>
                        <span className={style.label}>{intl.formatMessage({ id: 'contract.wuliaobianhao' })}：</span>
                        <span className={style.col}>{record.materielNo}</span>
                      </div>
                      <div className={style.row}>
                        <span className={style.label}>{intl.formatMessage({ id: 'contract.pinpai' })}：</span>
                        <span className={style.col}>{record.brand}</span>
                      </div>
                      <div className={style.row}>
                        <span className={style.label}>{intl.formatMessage({ id: 'contract.wuliaomingcheng' })}：</span>
                        <span className={style.col}>{record.materielName}</span>
                      </div>
                      <div className={style.row}>
                        <span className={style.label}>{intl.formatMessage({ id: 'contract.pinlei' })}：</span>
                        <span className={style.col}>{record.category}</span>
                      </div>
                      <div className={style.row}>
                        <span className={style.label}>{intl.formatMessage({ id: 'contract.guigexinghao' })}：</span>
                        <span className={style.col}>{record.type}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className={cx(style.box, style.boxBlue)}>
                  <div className={cx(style.title, style.tagBlue)}>
                    {intl.formatMessage({ id: 'contract.baojiashangpin' })}
                    <Text type="danger">*</Text>
                  </div>
                  <div className={style.content}>
                    {Object.keys(product).length > 0 && (
                      <>
                        <div className={style.row}>
                          <span className={style.label}>
                            {intl.formatMessage({ id: 'contract.shangpinmingcheng' })}：
                          </span>
                          <span className={style.col}>{product.name}</span>
                        </div>
                        <div className={style.row}>
                          <span className={style.label}>{intl.formatMessage({ id: 'contract.pinpai' })}：</span>
                          <span className={style.col}>{product.brandName}</span>
                        </div>
                        <div className={style.row}>
                          <span className={style.label}>{intl.formatMessage({ id: 'contract.pinlei' })}：</span>
                          <span className={style.col}>{product.customerCategoryName}</span>
                        </div>
                      </>
                    )}
                    <Button onClick={() => setFlag(true)} block type="dashed" style={{ margin: '16px 0px' }}>
                      <PlusSquareOutlined />
                      {intl.formatMessage({ id: 'contract.xuanzeshangpin' })}
                    </Button>
                  </div>
                </div>
              </div>
              {attribute.length > 0 &&
                attribute.map((item: any, index: number) => (
                  <div id={`attribute_${index + 1}`} key={`attribute_${index + 1}`}>
                    <Form.Item
                      style={{ marginBottom: '10px' }}
                      label={
                        <>
                          <Divider
                            type="vertical"
                            style={{
                              width: '2px',
                              height: '16px',
                              margin: '0px 5px 0px 0px',
                              backgroundColor: '#00A98F',
                            }}
                          />
                          <span
                            style={{
                              fontSize: '14px',
                              color: '#909399',
                            }}
                          >
                            {item.customerAttribute.name}
                          </span>
                        </>
                      }
                    />
                    {item.customerAttributeValueList.map((child: any, childIdx: number) => (
                      <Form.Item key={childIdx} label={item.customerAttribute.name} style={{ marginBottom: 0 }}>
                        <Text>{child.value}</Text>
                      </Form.Item>
                    ))}
                  </div>
                ))}

              {/* 附件 */}
              <div id="file">
                <Form.Item
                  style={{ marginBottom: '10px' }}
                  label={
                    <>
                      <Divider
                        type="vertical"
                        style={{
                          width: '2px',
                          height: '16px',
                          margin: '0px 5px 0px 0px',
                          backgroundColor: '#00A98F',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '14px',
                          color: '#909399',
                        }}
                      >
                        {intl.formatMessage({ id: 'contract.fujian' })}
                      </span>
                    </>
                  }
                />
              </div>
            </Form>
          </Content>
        </Layout>
      </Drawer>
      <SelectProduct visible={flag} onclose={() => setFlag(false)} confirm={handleSelectPrduct} />
    </>
  )
}

export default CrossSellProducts

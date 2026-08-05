import type { ReactNode } from 'react'
import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { Steps, Card, Space, Row, Col, Descriptions, Table, Tabs, Tag, Divider, Image, Tooltip } from '@linkseeks/ui'
import { PageHeaderWrapper } from '@apps/components'
import type { ColumnType } from 'antd/lib/table/interface'
import cx from 'classnames'
import ReturnEle from '@/components/ReturnEle'
import styles from './index.less'
import { formatTimeString } from '@/utils'
import { CaretDownOutlined, CaretUpOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import type {
  GetProductCommodityPlatformGetCommodityCheckRecordResponse,
  GetProductCommodityGetCommodityResponse,
} from '@apps/apis'
import { getProductCommodityGetCommodity, getProductCommodityPlatformGetCommodityCheckRecord } from '@apps/apis'
import { getLogisticsCompanyGet, getLogisticsFreightTemplateGet, getLogisticsShipperAddressGet } from '@apps/apis'

interface IAttributeByValue {
  groupName?: string
  id?: number
  name?: string
  customerAttributeValue?: {
    id: number
    value: string
  }
}

interface IColumn {
  title: string
  dataIndex: string
  key?: string
}

const { Step } = Steps
const { TabPane } = Tabs

/* 按属性归类 */
const groupBy = (objectArray: any[], property: string) => {
  return objectArray.reduce(function (acc: { [x: string]: any[] }, obj: { [x: string]: any }) {
    const key = obj[property]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}

/** 阶梯价格排序 */
const sortLadderPrice = (price) => {
  const tempUnit: any = {}
  if (price) {
    Object.keys(price)
      .sort((a: any, b: any) => a.split('-')[0] - b.split('-')[0])
      .forEach(function (key) {
        tempUnit[key] = price[key]
      })
  }
  return tempUnit
}

const viewProducts: React.FC<{}> = () => {
  const [productDetail, setProductDetail] = useState<any>()
  const [checkRecord, setCheckRecord] = useState<GetProductCommodityPlatformGetCommodityCheckRecordResponse>()
  const [fixStep, setFixStep] = useState(0)
  const [dataByTab, setDataByTab] = useState<any[]>([])
  const [dataByTabTitle, setDataByTabTitle] = useState<any[]>([])
  const [tableColumns, setTableColumns] = useState<any[]>([])
  const [tableRenderData, setTableRenderData] = useState<any[]>([])
  const [attributeArrByImageRender, setAttributeArrByImageRender] = useState<any[]>([])
  const [imageArrByImageRender, setImageArrByImageRender] = useState<any[]>([])
  const [logisticTemplateName, setLogisticTemplateName] = useState<string>()
  const [logisticResourceCompanyName, setLogisticResourceCompanyName] = useState<string>()
  const [logisticResourceSendAddress, setLogisticResourceSendAddress] = useState<string>()
  const [showMore, setShowMore] = useState<any>({ areaShowMore: false, shopShowMore: false })
  const { id } = useQuery()

  /* 商品属性显示 */
  //以属性组和属性名称归档的数据
  const renderDataByTab = (data: GetProductCommodityGetCommodityResponse) => {
    const archiveByAttributeGroup = data.commodityAttributeList.map((_) => {
      const obj: any = { ..._.customerAttribute }
      obj.customerAttributeValueList = _.customerAttributeValueList
      return obj
    })
    const _dataByTab = groupBy(archiveByAttributeGroup, 'groupName')
    setDataByTab(Object.values(_dataByTab))
    setDataByTabTitle(Object.keys(_dataByTab))
  }

  /* 构建表格数据 */
  const constructTableData = (product: any, skuList: GetProductCommodityGetCommodityResponse['commoditySkuList']) => {
    // 构建列
    // console.log(productName, skuList, '构建列')
    const _col: any = []
    const col_productName: IColumn = { title: '商品名称', dataIndex: 'productName' }
    _col.push(col_productName)
    // 提取一项 确定货品列和属性列
    let attributeByValue: IAttributeByValue[] = []
    if (skuList.length > 0) {
      const item = skuList[0]
      if (item.commoditySkuAttributeList.length > 0) {
        // 存在多个属性
        attributeByValue = item.commoditySkuAttributeList.map((_item) => {
          const _obj = { ..._item.customerAttribute }
          _obj['customerAttributeValue'] = _item.customerAttributeValue
          return _obj
        })
        attributeByValue.map((_) => {
          _col.push({
            title: _.name,
            dataIndex: _.name,
          })
        })
      }
      if (item.materiel?.id) {
        // 存在货品
        _col.push({
          title: '对应物料',
          dataIndex: 'goods',
        })
      }
    }
    // 跨境商品 HS编码
    if (product?.isCrossBorder) {
      _col.push({
        title: 'HS编码',
        dataIndex: 'hsCode',
      })
    }
    _col.push({
      title: product?.priceType === 3 ? '所需积分' : '单价（元）',
      dataIndex: 'unitPrice',
      render: (text) => {
        if (JSON.stringify(text) === '{}') return null
        return Object.keys(text).map((v, i) => {
          return (
            <>
              <span key={i}>
                {v === '0-0' ? '' : `${v}:`}{' '}
                <span style={{ color: 'red' }}>
                  {product?.priceType === 3 ? '' : '￥'}
                  {text[v]}
                </span>
              </span>
              <br />
            </>
          )
        })
      },
    })
    _col.push({
      title: product?.planPrice === 3 ? '积分（副单位）' : '单价（副单位）',
      dataIndex: 'deputyUnitPrice',
      render: (text) => {
        if (text && Array.isArray(text)) {
          return text.map((p, pIndex) => <p key={pIndex}>{product?.planPrice === 3 ? p : `￥${p}`}</p>)
        } else if (text) {
          return product?.planPrice === 3 ? text : `￥${text}`
        }
      },
    })

    setTableColumns(_col)

    // 生成表格数据
    const _attributeArrByImageRender: any[] = []
    const _imageArrByImageRender: any[] = []
    const _tableData = skuList.map((item, index) => {
      _imageArrByImageRender.push(item.commodityPic)
      const attrArrayWithObj = item.commoditySkuAttributeList.map((_item) => {
        const _temp = {}
        //@ts-ignore
        _temp[_item.customerAttribute.name] = _item.customerAttributeValue.value
        return _temp
      })
      let attrWithObj = {}
      for (const t of attrArrayWithObj) {
        attrWithObj = { ...attrWithObj, ...t }
      }
      _attributeArrByImageRender.push(attrWithObj)

      const _price = sortLadderPrice(item.unitPrice)
      const _priceRate = item.priceRate
      const _priceNumber = Object.keys(_price)[0] === '0-0' ? Object.values(_price)[0] : Object.values(_price)

      const temp = {
        index: index,
        productName: product.name,
        goods: item.materiel?.code + '/' + item.materiel?.name + '/' + item.materiel?.type,
        ...attrWithObj,
        hsCode: item.hsCode,
        unitPrice: _price,
        deputyUnitPriceRate: _priceRate,
        deputyUnitPrice: Array.isArray(_priceNumber)
          ? _priceNumber.map((_p) => ((Number(_p) * Number(_priceRate)) / 100).toFixed(2))
          : ((Number(_priceNumber) * Number(_priceRate)) / 100).toFixed(2),
      }
      return temp
    })
    setTableRenderData(_tableData)
    setAttributeArrByImageRender(_attributeArrByImageRender)
    setImageArrByImageRender(_imageArrByImageRender)
  }

  useEffect(() => {
    if (id) {
      getProductCommodityGetCommodity({ id: id }).then((res) => {
        const { code, data } = res
        if (code === 1000) {
          setProductDetail(data)
          renderDataByTab(data)
          constructTableData(data, data.commoditySkuList)
          if (data.status === 1) setFixStep(0)
          else if (data.status === 2) setFixStep(2)
          else if (data.status === 3) setFixStep(3)
          else if (data.status === 4) setFixStep(3)
          else if (data.status === 5) setFixStep(3)
          else if (data.status === 6) setFixStep(3)
        }
      })
      getProductCommodityPlatformGetCommodityCheckRecord({ commodityId: id }).then((res) => {
        const { code, data } = res
        if (code === 1000) setCheckRecord(data)
      })
    }
  }, [])

  useEffect(() => {
    if (productDetail?.logistics?.templateId)
      getLogisticsFreightTemplateGet({ id: productDetail?.logistics?.templateId + '' }).then((res) => {
        setLogisticTemplateName(res.data.name)
      })
    if (productDetail?.logistics?.company)
      getLogisticsCompanyGet({ id: productDetail?.logistics?.company + '' }).then((res) => {
        setLogisticResourceCompanyName(res.data.name)
      })
    if (productDetail?.logistics?.sendAddressId)
      getLogisticsShipperAddressGet({ id: productDetail?.logistics?.sendAddressId + '' }).then((res) => {
        const { provinceName, cityName, districtName, address } = res.data
        console.log(provinceName + cityName + districtName + address)
        setLogisticResourceSendAddress(provinceName + cityName + districtName + address)
      })
  }, [productDetail])

  const columns: ColumnType<any>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: '角色',
      dataIndex: 'memberRoleName',
      key: 'memberRoleName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => {
        let component: ReactNode = null
        if (record.status === 1)
          component = (
            <>
              <span className="commonStatusStop" />
              待提交审核
            </>
          )
        else if (record.status === 2)
          component = (
            <>
              <span className="commonStatusModify" />
              待审核
            </>
          )
        else if (record.status === 4)
          component = (
            <>
              <span className="commonStatusValid" />
              审核通过
            </>
          )
        else if (record.status === 3)
          component = (
            <>
              <span className="commonStatusInvalid" />
              审核不通过
            </>
          )
        return component
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text: any, record: any) => {
        if (record.operation === 1) return '提交审核'
        else if (record.operation === 2) return '修改商品'
        else if (record.operation === 3) return '审核商品'
      },
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: any) => formatTimeString(text),
    },
    {
      title: '意见',
      dataIndex: 'checkRemark',
      key: 'checkRemark',
    },
  ]

  // 1 审核状态 2 商品状态
  const renderStatus = (status: number, type: number) => {
    let component: ReactNode = null
    if (type === 1) {
      if (status === 1)
        component = (
          <>
            <span className="commonStatusStop" />
            待提交审核
          </>
        )
      else if (status === 2)
        component = (
          <>
            <span className="commonStatusModify" />
            待审核
          </>
        )
      else if (status === 4)
        component = (
          <>
            <span className="commonStatusValid" />
            审核通过
          </>
        )
      else if (status === 3)
        component = (
          <>
            <span className="commonStatusInvalid" />
            审核不通过
          </>
        )
      else component = null
    } else if (status === 5)
      component = (
        <span
          style={{
            color: '#00A98F',
            padding: '2px 5px',
            background: 'rgba(235,247,242,1)',
            borderRadius: '4px',
          }}
        >
          已上架
        </span>
      )
    else if (status === 6)
      component = (
        <span style={{ padding: '2px 5px', background: 'rgba(244,245,247,1)', borderRadius: '4px' }}>已下架</span>
      )
    else component = null
    return component
  }

  /* 品类类型&商品类型 */
  const renderCustomerCategoryType = (type: number) => {
    if (type === 1) return '实物商品'
    if (type === 2) return '虚拟商品'
    if (type === 3) return '服务商品'
  }

  /* description */
  const content = (
    <>
      <Descriptions colon={true} style={{ paddingLeft: 48 }}>
        <Descriptions.Item label="商品品牌">{productDetail?.brandName}</Descriptions.Item>
        <Descriptions.Item label="商品品类">{productDetail?.categoryFullName}</Descriptions.Item>
        {renderStatus(productDetail?.status, 1) && (
          <Descriptions.Item label="审核状态">{renderStatus(productDetail?.status, 1)}</Descriptions.Item>
        )}
        {renderStatus(productDetail?.status, 2) && (
          <Descriptions.Item label="商品状态">{renderStatus(productDetail?.status, 2)}</Descriptions.Item>
        )}
        <Descriptions.Item label="商品类型">
          <span className="commonStatusValid" />
          实物商品
          {/* {renderCustomerCategoryType(productDetail?.customerCategory?.type)} */}
        </Descriptions.Item>
      </Descriptions>
    </>
  )

  const renderPriceType = (type: number) => {
    if (type === 1) return '现货价格'
    if (type === 2) return '价格需要询价'
    if (type === 3) return '积分兑换商品'
    if (type === 3) return '赠品'
  }

  const renderDeliveryType = (type: number) => {
    if (type === 1) return '物流（默认）'
    else if (type === 2) return '自提'
    else if (type === 3) return '无需配送'
    else if (type === 4) return '物流+自提'
    else return null
  }

  const renderCarriageType = (type: number) => {
    if (type === 1) return '卖家承担运费（默认）'
    if (type === 2) return '买家承担运费'
  }

  const toggleMore = (str: string) => {
    if (str === 'area') {
      setShowMore({
        shopShowMore: showMore.shopShowMore,
        areaShowMore: !showMore.areaShowMore,
      })
    } else {
      setShowMore({
        shopShowMore: !showMore.shopShowMore,
        areaShowMore: showMore.areaShowMore,
      })
    }
  }

  const renderMoreList = (data, str) => {
    const showDataSource = (str === 'area' ? showMore.areaShowMore : showMore.shopShowMore)
      ? data
      : [...data].splice(0, 3)
    return (
      <>
        <p>
          {str === 'area'
            ? showDataSource.map((_item, _i) => (
                <p key={_i}>
                  {_item.provinceName + '/' + (_item.cityName || '') + (_item.regionName ? `/${_item.regionName}` : '')}
                </p>
              ))
            : showDataSource.map((_item, _i) => <p key={_i}>{_item.name}</p>)}
        </p>
        {data.length > 3 && (
          <p onClick={() => toggleMore(str)} style={{ cursor: 'pointer' }} className="commonPickColor">
            展开{showMore.areaShowMore ? <CaretDownOutlined /> : <CaretUpOutlined />}
          </p>
        )}
      </>
    )
  }

  return (
    <PageHeaderWrapper content={content} title={productDetail?.name}>
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        <Card headStyle={{ borderBottom: 'none' }} title="流程进度">
          <Steps progressDot current={fixStep}>
            <Step title="新建商品" description="供应商" />
            <Step title="提交审核" description="供应商" />
            {productDetail?.checkType === 1 ? (
              <Step title="审核" description="供应商" />
            ) : (
              <Step title="审核" description="平台" />
            )}
            <Step title="完成" description="" />
          </Steps>
        </Card>
        <Row gutter={[26, 0]}>
          <Col span={8}>
            <Card headStyle={{ borderBottom: 'none' }} title="基本信息" style={{ height: '100%' }}>
              {productDetail?.slogan && (
                <Row>
                  <Col span={4}>
                    <p>商品标语：</p>
                  </Col>
                  <Col span={20}>
                    <p>{productDetail.slogan}</p>
                  </Col>
                </Row>
              )}
              {productDetail?.sellingPoint?.length > 0 && (
                <Row>
                  <Col span={4}>
                    <p>商品卖点：</p>
                  </Col>
                  <Col span={20}>
                    <p>
                      {productDetail.sellingPoint.map((_item) => (
                        <Tag key={_item}>{_item}</Tag>
                      ))}
                    </p>
                  </Col>
                </Row>
              )}
              {/* <Row>
                <Col span={4}>
                  <p>归属地市：</p>
                </Col>
                <Col span={20}>
                  <p>
                    {productDetail?.commodityAreaList.length > 0
                      ? renderMoreList(productDetail?.commodityAreaList, 'area')
                      : '全国'}
                  </p>
                </Col>
              </Row> */}
              {productDetail?.commodityShopList?.length > 0 && (
                <Row>
                  <Col span={4}>
                    <p>上架商城：</p>
                  </Col>
                  <Col span={20}>
                    <p>{renderMoreList(productDetail.commodityShopList, 'shop')}</p>
                  </Col>
                </Row>
              )}
            </Card>
          </Col>
          <Col span={8}>
            <Card headStyle={{ borderBottom: 'none' }} title="物流信息" style={{ height: '100%' }}>
              {renderDeliveryType(productDetail?.logistics?.deliveryType) && (
                <Row>
                  <Col span={4}>
                    <p>配送方式：</p>
                  </Col>
                  <Col span={20}>
                    <p>{renderDeliveryType(productDetail?.logistics?.deliveryType)}</p>
                  </Col>
                </Row>
              )}
              {renderCarriageType(productDetail?.logistics?.carriageType) && (
                <Row>
                  <Col span={4}>
                    <p>运送方式：</p>
                  </Col>
                  <Col span={20}>
                    <p>{renderCarriageType(productDetail?.logistics?.carriageType)}</p>
                  </Col>
                </Row>
              )}
              {productDetail?.logistics?.weight && (
                <Row>
                  <Col span={4}>
                    <p>重量：</p>
                  </Col>
                  <Col span={20}>
                    <p>{productDetail.logistics.weight}KG（公斤）</p>
                  </Col>
                </Row>
              )}
              {logisticTemplateName && (
                <Row>
                  <Col span={4}>
                    <p>运费模版：</p>
                  </Col>
                  <Col span={20}>
                    <p>{logisticTemplateName}</p>
                  </Col>
                </Row>
              )}
              {logisticResourceCompanyName && (
                <Row>
                  <Col span={4}>
                    <p>物流公司：</p>
                  </Col>
                  <Col span={20}>
                    <p>{logisticResourceCompanyName}</p>
                  </Col>
                </Row>
              )}
              {logisticResourceSendAddress && (
                <Row>
                  <Col span={4}>
                    <p>发货地址：</p>
                  </Col>
                  <Col span={20}>
                    <p>{logisticResourceSendAddress}</p>
                  </Col>
                </Row>
              )}
            </Card>
          </Col>
          <Col span={8}>
            <Card headStyle={{ borderBottom: 'none' }} title="其他信息" style={{ height: '100%' }}>
              <Row>
                <Col span={4}>
                  <p>商品类型：</p>
                </Col>
                <Col span={20}>
                  <p>{productDetail?.type === 1 ? '自营商品' : '上游供应商品'}</p>
                </Col>
              </Row>
              <Row>
                <Col span={4}>
                  <p>跨境电商进口商品：</p>
                </Col>
                <Col span={20}>
                  <p>{productDetail?.isCrossBorder ? '是' : '否'}</p>
                </Col>
              </Row>
              <Row>
                <Col span={4}>
                  <p>税率：</p>
                </Col>
                <Col span={20}>
                  <p>{productDetail?.taxRate ? `${productDetail?.taxRate}%` : null}</p>
                </Col>
              </Row>
              {productDetail?.marks && (
                <Row>
                  <Col span={4}>
                    <p>唛头：</p>
                  </Col>
                  <Col span={20}>
                    <p>{productDetail?.marks}</p>
                  </Col>
                </Row>
              )}
              {productDetail?.packing && (
                <Row>
                  <Col span={4}>
                    <p>包装清单：</p>
                  </Col>
                  <Col span={20}>
                    <p>{productDetail?.packing}</p>
                  </Col>
                </Row>
              )}
              {productDetail?.afterService && (
                <Row>
                  <Col span={4}>
                    <p>售后服务：</p>
                  </Col>
                  <Col span={20}>
                    <p>{productDetail?.afterService}</p>
                  </Col>
                </Row>
              )}
            </Card>
          </Col>
        </Row>
        <Card headStyle={{ borderBottom: 'none' }} title="商品属性">
          <Tabs defaultActiveKey="1">
            <TabPane tab="价格属性" key="111">
              <Row>
                <Col span={2}>
                  <p>计量单位：</p>
                </Col>
                <Col span={22}>
                  <p>{productDetail?.unitName}</p>
                </Col>
              </Row>
              {productDetail?.subUnitName ? (
                <Row>
                  <Col span={2}>
                    <p>计量副单位：</p>
                  </Col>
                  <Col span={22}>
                    <p>{productDetail?.subUnitName}</p>
                  </Col>
                </Row>
              ) : null}
              <Row>
                <Col span={2}>
                  <p>最小起订：</p>
                </Col>
                <Col span={22}>
                  <p>{productDetail?.minOrder}</p>
                </Col>
              </Row>
            </TabPane>
            {dataByTabTitle.map((_item, _index) => (
              <TabPane tab={_item} key={_index}>
                {dataByTab[_index].length > 0 &&
                  dataByTab[_index].map((__item) => (
                    <Row key={__item.id}>
                      <Col span={2}>
                        <p>{__item.name}：</p>
                      </Col>
                      <Col span={22}>
                        {__item.customerAttributeValueList.length > 0 &&
                          __item.customerAttributeValueList.map((___item) => (
                            <p key={___item.id}>
                              <span>{___item.value}</span>
                            </p>
                          ))}
                      </Col>
                    </Row>
                  ))}
              </TabPane>
            ))}
          </Tabs>
        </Card>
        <Card headStyle={{ borderBottom: 'none' }} title="单价设置">
          <Row>
            <Col span={2}>
              <p>产品定价：</p>
            </Col>
            <Col span={6}>
              <p>{renderPriceType(productDetail?.priceType)}</p>
            </Col>
            <Col span={2}>
              <p>会员折扣：</p>
            </Col>
            <Col span={6}>
              <p>{productDetail?.isMemberPrice && '允许使用会员折扣购买'}</p>
            </Col>
          </Row>
          <Table dataSource={tableRenderData} columns={tableColumns} pagination={false} />
        </Card>
        <Card headStyle={{ borderBottom: 'none' }} title="商品图片">
          {productDetail?.isAllAttributePic ? (
            <>
              <Row>
                <Col span={3}>
                  <p>设置方式：</p>
                </Col>
                <Col span={21}>
                  <p>所有属性共用商品图片（默认）</p>
                </Col>
              </Row>
              {/* 没有价格属性默认一行直接显示图片 */}
              <div className={styles.productImgBox}>
                {productDetail?.commoditySkuList?.length &&
                  productDetail?.commoditySkuList[0].commodityPic.length > 0 &&
                  productDetail?.commoditySkuList[0].commodityPic.map((_item, index) => (
                    <div style={{ marginRight: 24 }}>
                      <Image width={200} key={index} src={_item} />
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <>
              <Row>
                <Col span={3}>
                  <p>设置方式：</p>
                </Col>
                <Col span={21}>
                  <p>按属性设置商品图片</p>
                </Col>
              </Row>
              <Divider />
              {attributeArrByImageRender.map((item, index) => (
                <div key={index}>
                  <Row>
                    <Col span={3}>
                      <p>属性：</p>
                    </Col>
                    <Col span={21}>
                      <p>{Object.values(item).join('/')}</p>
                    </Col>
                  </Row>
                  <Divider />
                  <div className={styles.productImgBox}>
                    {imageArrByImageRender.length > 0 &&
                      imageArrByImageRender[index].map((_item, _index) => (
                        <div style={{ marginRight: 24 }}>
                          <Image width={200} key={index} src={_item} />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </Card>
        <Card headStyle={{ borderBottom: 'none' }} title="商品描述">
          {/* 文字区块 */}
          {productDetail?.commodityRemark?.word?.length > 0 && (
            <div className={cx(styles.descriptionBox, styles.descriptionWordBox)}>
              {productDetail?.commodityRemark?.word.map((_item, _index) => _item && <p key={_index}>{_item}</p>)}
            </div>
          )}
          {/* 视频区块 */}
          {productDetail?.commodityRemark?.video?.length > 0 && (
            <div className={styles.descriptionBox}>
              {productDetail?.commodityRemark?.video.map((_item, _index) => (
                <div key={_index} className={styles['picture-item']}>
                  <video src={_item} controls={true}>
                    您的浏览器不支持视频标签，请及时升级。
                  </video>
                </div>
              ))}
            </div>
          )}
          {/* 图片区块 */}
          {productDetail?.commodityRemark?.imageList?.length > 0 && (
            <div className={styles.descriptionBox}>
              <div>
                <p>商品图片:</p>
                {productDetail?.commodityRemark?.imageList
                  .filter((item) => item.imageType === 1)
                  .map(
                    (_item, _index) =>
                      _item && (
                        <div key={_index} className={styles['picture-item']}>
                          <img src={_item.url} />
                        </div>
                      ),
                  )}
              </div>
              <div>
                <p>厂商资质图片:</p>
                {productDetail?.commodityRemark?.imageList
                  .filter((item) => item.imageType === 2)
                  .map(
                    (_item, _index) =>
                      _item && (
                        <div key={_index} className={styles['picture-item']}>
                          <img src={_item.url} />
                        </div>
                      ),
                  )}
              </div>
              <div>
                <p>商品检测报告:</p>
                {productDetail?.commodityRemark?.imageList
                  .filter((item) => item.imageType === 3)
                  .map(
                    (_item, _index) =>
                      _item && (
                        <div key={_index} className={styles['picture-item']}>
                          <img src={_item.url} />
                        </div>
                      ),
                  )}
              </div>
            </div>
          )}
          {productDetail?.commodityRemark?.imageList?.length === 0 &&
            productDetail?.commodityRemark?.video?.length === 0 &&
            productDetail?.commodityRemark?.word?.length === 0 && <p className={styles.descriptNull}>暂无数据！</p>}
        </Card>{' '}
        <Card headStyle={{ borderBottom: 'none' }} title="SEO优化">
          <Row>
            <Col span={3}>
              <p>
                Title：
                <Tooltip title="用于显示在页面title标签的内容，便于搜索引擎抓取">
                  <QuestionCircleOutlined />
                </Tooltip>
              </p>
            </Col>
            <Col span={21}>
              <p>{productDetail?.title}</p>
            </Col>
          </Row>
          <Row>
            <Col span={3}>
              <p>
                Description：
                <Tooltip title="用于显示在页面Description标签的内容，便于搜索引擎抓取">
                  <QuestionCircleOutlined />
                </Tooltip>
              </p>
            </Col>
            <Col span={21}>
              <p>{productDetail?.description}</p>
            </Col>
          </Row>
          <Row>
            <Col span={3}>
              <p>
                Keywords：
                <Tooltip title="用于显示在页面Keywords标签的内容，便于搜索引擎通过关键词搜索时抓取页面，多个关键词用豆号分隔">
                  <QuestionCircleOutlined />
                </Tooltip>
              </p>
            </Col>
            <Col span={21}>
              <p>{productDetail?.keywords}</p>
            </Col>
          </Row>
        </Card>
        <Card headStyle={{ borderBottom: 'none' }} title="审核历史">
          <Table dataSource={checkRecord} columns={columns} pagination={false} />
        </Card>
      </Space>
    </PageHeaderWrapper>
  )
}

export default viewProducts

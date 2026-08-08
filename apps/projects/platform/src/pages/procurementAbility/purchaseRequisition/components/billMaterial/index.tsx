import React, { useContext, useState } from 'react'
import { Col, Row, Spin, Table, Button } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import MellowCard from '@/components/MellowCard'
import { BillDetailContext } from '../../_public/bill/effects/context'
import { useIntl } from '@linkseeks/i18n'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { getOrderCommonPurchaseRequisitionDetailVendorOrderPage } from '@apps/apis'
import style from './index.less'

import RelationSaleOrderDrawer from '../relationSaleOrder'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
/**
 * 请购单 请购物料
 */

export interface BidMaterialProps {
  cardTitle?: string
}

const BidMaterial: React.FC<BidMaterialProps> = ({ cardTitle }) => {
  const bidDetailContext = useContext(BillDetailContext)
  const { data } = bidDetailContext
  const intl = useIntl()

  const [tableData, setTableData] = useState<any>([...data.product.products])
  const [relationSaleOrderVisible, setRelationSaleOrderVisible] = useState<boolean>(false)
  const [purchaseProductId, setPurchaseProductId] = useState<any>()

  const _openRelationSaleOrder = (record: any) => {
    setPurchaseProductId(record.id)
    setRelationSaleOrderVisible(true)
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.wuliaobianhao', defaultMessage: '物料编号' }),
      dataIndex: 'productNo',
      key: 'productNo',
      width: 128,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.wuliaomingcheng', defaultMessage: '物料名称' }),
      dataIndex: 'name',
      key: 'name',
      width: 256,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.guigexinghao', defaultMessage: '规格型号' }),
      dataIndex: 'spec',
      key: 'spec',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.wuliaozu', defaultMessage: '物料组' }),
      dataIndex: 'goodsGroup',
      key: 'goodsGroup',
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.pinlei', defaultMessage: '品类' }),
      dataIndex: 'category',
      key: 'category',
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.pinpai', defaultMessage: '品牌' }),
      dataIndex: 'brand',
      key: 'brand',
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.danwei', defaultMessage: '单位' }),
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.shengchangchangjia', defaultMessage: '生产厂家' }),
      dataIndex: 'manuFacturer',
      key: 'manuFacturer',
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.changdi', defaultMessage: '产地' }),
      dataIndex: 'placeOrigin',
      key: 'placeOrigin',
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.yugudanjia', defaultMessage: '预估单价' }),
      dataIndex: 'price',
      key: 'price',
      render: (t) => (t ? `${translate('web.common.currencySymbol')}${t}` : null),
      width: 96,
    },
    {
      title: (
        <>
          <p>{intl.formatMessage({ id: 'purchaseRequisition.shuliang', defaultMessage: '数量' })}</p>
          <p>{Number(data.product.quantity).toFixed(2)}</p>
        </>
      ),
      dataIndex: 'quantity',
      key: 'quantity',
      width: 96,
    },

    {
      title: (
        <>
          <p>{intl.formatMessage({ id: 'purchaseRequisition.yugujine', defaultMessage: '预估金额' })}</p>
          <p>{`${translate('web.common.currencySymbol')}${Number(data.product.productAmount).toFixed(2)}`}</p>
        </>
      ),
      dataIndex: 'amount',
      key: 'amount',
      render: (t) => (t ? `${translate('web.common.currencySymbol')}${t}` : null),
      width: 128,
    },
    // {
    //   title: intl.formatMessage({ id: 'purchaseRequisition.yizhuandingdanshu', defaultMessage: '已转订单数量' }),
    //   dataIndex: 'transferQuantity',
    //   key: 'transferQuantity',
    // },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.guanliandanju' }),
      dataIndex: 'remark',
      key: 'remark',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            _openRelationSaleOrder(record)
          }}
        >
          {intl.formatMessage({ id: 'purchaseRequisition.associatedSalesOrder' })}
        </Button>
      ),
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.beizu', defaultMessage: '备注' }),
      dataIndex: 'remark',
      key: 'remark',
      width: 96,
    },
  ]

  const renderDescription = async (record) => {
    const newData = [...tableData]
    const index = newData.findIndex((item) => record.id === item.id)
    const item = newData[index]
    item.description = (
      <div className={style.childrenWrap}>
        <Row>
          <Col span={3}>
            <div className={style.childrenTitle}>
              <p>{intl.formatMessage({ id: 'purchaseRequisition.wuliao' })}</p>
              <p>{intl.formatMessage({ id: 'purchaseRequisition.xinxi' })}</p>
            </div>
          </Col>
          <Col span={6}>
            <div className={style.childrenContent}>
              <p>
                <span>
                  {intl.formatMessage({ id: 'purchaseRequisition.guigexinghao', defaultMessage: '规格型号' })}:
                </span>
                {record.spec}
              </p>
              <p>
                <span>{intl.formatMessage({ id: 'purchaseRequisition.pinlei', defaultMessage: '品类' })}:</span>
                {record.category}
              </p>
            </div>
          </Col>
          <Col span={6}>
            <div className={style.childrenContent}>
              <p>
                <span>{intl.formatMessage({ id: 'purchaseRequisition.pinpai', defaultMessage: '品牌' })}:</span>
                {record.brand}
              </p>
              <p>
                <span>{intl.formatMessage({ id: 'purchaseRequisition.danwei', defaultMessage: '单位' })}:</span>
                {record.unit}
              </p>
            </div>
          </Col>
          <Col span={6}>
            <div className={style.childrenContent}>
              <p>
                <span>
                  {intl.formatMessage({ id: 'purchaseRequisition.shengchangchangjia', defaultMessage: '生产厂家' })}:
                </span>
                {record.manuFacturer}
              </p>
              <p>
                <span>{intl.formatMessage({ id: 'purchaseRequisition.changdi', defaultMessage: '产地' })}:</span>
                {record.placeOrigin}
              </p>
            </div>
          </Col>
        </Row>
      </div>
    )
    setTableData([...newData])
  }

  return (
    <MellowCard title={cardTitle} style={{ marginTop: 24 }} className={style.billMaterial} bordered={false} fullHeight>
      <Table
        dataSource={tableData}
        columns={columns}
        // expandable={{
        //   expandedRowRender: record => <p style={{ margin: 0 }}>{record?.id ? (record.description || <Spin size="small" style={{ margin: '15px auto', width: '100%' }} />) : null}</p>,
        //   rowExpandable: record => record.name !== 'Not Expandable',
        //   expandIcon: ({ expanded, onExpand, record }) =>
        //     expanded ? (
        //       <CaretDownOutlined onClick={e => onExpand(record, e)} />
        //     ) : (
        //       <CaretRightOutlined onClick={e => onExpand(record, e)} />
        //     ),
        //   onExpand: (expanded, record) => {
        //     console.log('展开')
        //     if (expanded) {
        //       renderDescription(record)
        //     }
        //   }
        // }}
        rowKey="id"
        pagination={{ size: 'small' }}
        scroll={{ x: true }}
      />
      <RelationSaleOrderDrawer
        purchaseProductId={purchaseProductId}
        visible={relationSaleOrderVisible}
        fetch={getOrderCommonPurchaseRequisitionDetailVendorOrderPage}
        onClose={() => {
          setRelationSaleOrderVisible(false)
        }}
      />
      {/* <Row justify="end" style={{ marginTop: 24 }}>
        <Col span={2}>
          <div>{intl.formatMessage({ id: 'purchaseRequisition.shuliangheji', defaultMessage: '数量合计' })}</div>
          <div>{Number(data.product.quantity).toFixed(2)}</div>
        </Col>
        <Col span={2}>
          <div>{intl.formatMessage({ id: 'purchaseRequisition.jinezongji', defaultMessage: '金额总计' })}</div>
          <div>{`${translate('web.common.currencySymbol')}${Number(data.product.productAmount).toFixed(2)}`}</div>
        </Col>
      </Row> */}
    </MellowCard>
  )
}

BidMaterial.defaultProps = {}

export default BidMaterial

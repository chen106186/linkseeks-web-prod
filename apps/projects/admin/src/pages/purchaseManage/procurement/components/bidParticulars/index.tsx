import React, { useContext, useState } from 'react'
import { Table, Row, Col, Spin } from 'antd'
import MellowCard from '@/components/MellowCard'
import { BidDetailContext } from '@/pages/purchaseManage/procurement/_public/bid/context'
import style from './index.less'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { columns } from './constant'
import { getProductCommodityGetCommodity, getProductCommodityGetCommodityAttributeByCommoditySkuId } from '@apps/apis'

/**
 * 中标明细和投标物料嵌套表格
 */

export interface BidParticularsProps {
  cardTitle?: string
}

const BidParticulars: React.FC<BidParticularsProps> = ({ cardTitle }) => {
  const bidDetailContext = useContext(BidDetailContext)
  const { data, ctl } = bidDetailContext

  const [tableData, setTableData] = useState<any>(() => {
    return data.submitTender
      ? data.submitTender.submitTenderMateriel.map((item) => ({
          file: item.file,
          id: item.id,
          inviteTenderMaterielId: item.inviteTenderMateriel.id,
          isTax: item.isTax,
          price: item.price,
          remark: item.remark,
          taxRate: item.taxRate,
          brandName: item.inviteTenderMateriel.brandName,
          categoryName: item.inviteTenderMateriel.categoryName,
          code: item.inviteTenderMateriel.code,
          count: item.inviteTenderMateriel.count,
          inviteTenderMaterielFile: item.inviteTenderMateriel.file,
          name: item.inviteTenderMateriel.name,
          type: item.inviteTenderMateriel.type,
          unitName: item.inviteTenderMateriel.unitName,
          awardTenderRatio: item.awardTenderRatio,
          commodityId: item.commodityId,
          commodityName: item.commodityName,
          commoditySkuId: item.commoditySkuId,
        }))
      : []
  })

  const [tableColumn, setTableColumn] = useState<any>(() => {
    let totalMoney = 0
    data.submitTender
      ? data.submitTender.submitTenderMateriel.map((item) => {
          totalMoney += item.price * item.inviteTenderMateriel.count
        })
      : []
    let tempCol: any = [...columns]
    tempCol[tempCol.length] = {
      title: (
        <span>
          金额(含税)
          <br />
          合计: ￥{totalMoney}
        </span>
      ),
      dataIndex: 'money',
      key: 'money',
      render: (t, r) => `￥${Number((r.price * r.count).toFixed(2))}`,
    }
    return tempCol
  })

  const renderDescription = async (record) => {
    if (!record.commoditySkuId) {
      return
    }
    // 商品信息
    let res = await getProductCommodityGetCommodity({ id: record.commoditySkuId })
    // 商品规格信息
    let spec = await getProductCommodityGetCommodityAttributeByCommoditySkuId({
      commoditySkuId: record.commodityId,
    })
    const { code, data } = res
    if (code === 1000) {
      const newData = [...tableData]
      const index = newData.findIndex((item) => record.id === item.id)
      const item = newData[index]
      item.description = (
        <div className={style.childrenWrap}>
          <Row>
            <Col span={3}>
              <div className={style.childrenTitle}>
                <p>对应</p>
                <p>投标商品</p>
              </div>
            </Col>
            <Col span={6}>
              <div className={style.childrenContent}>
                <p>
                  <span>商品编号:</span>
                  {data.code}
                </p>
                <p>
                  <span>商品名称:</span>
                  {data.name}
                </p>
              </div>
            </Col>
            <Col span={6}>
              <div className={style.childrenContent}>
                <p>
                  <span>规格型号:</span>
                  {spec.data.length
                    ? spec.data.map((item) => item.customerAttributeValueList[0].value).join('/')
                    : null}
                </p>
                <p>
                  <span>品类:</span>
                  {data.customerCategory.fullName}
                </p>
              </div>
            </Col>
            <Col span={6}>
              <div className={style.childrenContent}>
                <p>
                  <span>品牌:</span>
                  {data?.brand?.name}
                </p>
              </div>
            </Col>
            {/* <Col span={3}>
            <div className={style.childrenContent}>
              <p><a>查看</a></p>
            </div>
          </Col> */}
          </Row>
        </div>
      )
      setTableData([...newData])
    }
  }

  return (
    <>
      <MellowCard title={cardTitle} bordered={false} fullHeight className={style.particulars} style={{ marginTop: 24 }}>
        <Table
          columns={tableColumn}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>
                {record?.commodityId
                  ? record.description || <Spin size="small" style={{ margin: '15px auto', width: '100%' }} />
                  : null}
              </p>
            ),
            rowExpandable: (record) => record.name !== 'Not Expandable',
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
              ) : (
                <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
              ),
            onExpand: (expanded, record) => {
              console.log('通过商品Id 查询商品信息显示在嵌套中', record, expanded)
              if (!record?.commodityId && expanded) {
                // return message.error('您没有关联商品')
                return null
              }
              if (expanded) {
                renderDescription(record)
              }
            },
          }}
          dataSource={tableData}
          rowKey="id"
          pagination={{ size: 'small' }}
        />
      </MellowCard>
    </>
  )
}

BidParticulars.defaultProps = {}

export default BidParticulars

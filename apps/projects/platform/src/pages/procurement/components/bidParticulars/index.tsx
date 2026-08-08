import React, { useContext, useState } from 'react'
import { Table, Row, Col, Spin } from 'antd'
import MellowCard from '@/components/MellowCard'
import { BidDetailContext } from '@/pages/procurement/_public/bid/context'
import style from './index.less'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { columns } from './constant'
import { getProductCommodityGetCommodity, getProductCommodityGetCommodityAttributeByCommoditySkuId } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
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
          isAwardTender: item.isAwardTender,
          commodityId: item.commodityId,
          commodityName: item.commodityName,
          commoditySkuId: item.commoditySkuId,
        }))
      : []
  })

  const [tableColumn, setTableColumn] = useState<any>(() => {
    let totalMoney = 0
    data.submitTender
      ? data.submitTender.submitTenderMateriel.forEach((item) => {
          if (cardTitle === intl.formatMessage({ id: 'table.purchase.zhongbiaomingxi' })) {
            totalMoney += item.isAwardTender
              ? (item.price * item.inviteTenderMateriel.count * Number(item.awardTenderRatio)) / 100
              : 0
          } else {
            totalMoney += item.price * item.inviteTenderMateriel.count
          }
        })
      : []
    let tempCol: any = [...columns]
    // 中标数量
    if (cardTitle === intl.formatMessage({ id: 'table.purchase.zhongbiaomingxi' })) {
      tempCol[tempCol.length - 1] = {
        title: intl.formatMessage({ id: 'table.purchase.zhongbiaoshuliang' }),
        dataIndex: 'awardTenderRatio',
        key: 'awardTenderRatio',
        render: (t, r) => ((Number(t) / 100) * Number(r.count)).toFixed(2),
      }
    }
    // 总计
    tempCol[tempCol.length] = {
      title: (
        <span>
          {cardTitle === intl.formatMessage({ id: 'table.purchase.zhongbiaomingxi' })
            ? intl.formatMessage({ id: 'detail.purchase.label' })
            : intl.formatMessage({ id: 'detail.purchase.taxPrice' })}
          <br />
          {intl.formatMessage({ id: 'detail.purchase.totalAmount' })}: {translate('web.common.currencySymbol')}
          {totalMoney.toFixed(2)}
        </span>
      ),
      dataIndex: 'money',
      key: 'money',
      render: (t, r) =>
        cardTitle === intl.formatMessage({ id: 'table.purchase.zhongbiaomingxi' })
          ? `${translate('web.common.currencySymbol')}${Number(
              (((r.price * Number(r.awardTenderRatio)) / 100) * r.count).toFixed(2),
            )}`
          : `${translate('web.common.currencySymbol')}${Number((r.price * r.count).toFixed(2))}`,
    }
    return tempCol
  })

  const renderDescription = async (record) => {
    if (!record.commodityId) {
      return
    }
    // 商品信息
    let res = await getProductCommodityGetCommodity({ id: record.commodityId })
    // 商品规格信息
    let spec = await getProductCommodityGetCommodityAttributeByCommoditySkuId({
      commoditySkuId: record.commoditySkuId,
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
                <p>{intl.formatMessage({ id: 'table.purchase.duiying' })}</p>
                <p>{intl.formatMessage({ id: 'table.purchase.toubiaoshangpin' })}</p>
              </div>
            </Col>
            <Col span={6}>
              <div className={style.childrenContent}>
                <p>
                  <span>{intl.formatMessage({ id: 'table.purchase.shangpinbianhao' })}:</span>
                  {data.code}
                </p>
                <p>
                  <span>{intl.formatMessage({ id: 'table.purchase.shangpinmingcheng' })}:</span>
                  {data.name}
                </p>
              </div>
            </Col>
            <Col span={6}>
              <div className={style.childrenContent}>
                <p>
                  <span>{intl.formatMessage({ id: 'table.purchase.guigexinghao' })}:</span>
                  {spec.data.length
                    ? spec.data.map((item) => item.customerAttributeValueList[0].value).join('/')
                    : null}
                </p>
                <p>
                  <span>{intl.formatMessage({ id: 'table.purchase.pinlei' })}:</span>
                  {data.customerCategory.fullName}
                </p>
              </div>
            </Col>
            <Col span={6}>
              <div className={style.childrenContent}>
                <p>
                  <span>{intl.formatMessage({ id: 'table.purchase.pinpai' })}:</span>
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
      <MellowCard title={cardTitle} bordered={false} fullHeight className={style.particulars} style={{ marginTop: 16 }}>
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
          dataSource={
            cardTitle === intl.formatMessage({ id: 'table.purchase.zhongbiaomingxi' })
              ? tableData.filter((item) => item.isAwardTender)
              : tableData
          }
          rowKey="id"
          pagination={{ size: 'small' }}
        />
      </MellowCard>
    </>
  )
}

BidParticulars.defaultProps = {}

export default BidParticulars

import { useState } from 'react'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { Button, Spin } from 'antd'
import { productInfoColumns } from '../constant'
import ProductTableCell, { ProductEditableRow } from '../components/productTableCell'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { Row, Col } from 'antd'
import style from '../index.less'
import { getProductCommodityGetCommodity, getProductCommodityGetCommodityAttributeByCommoditySkuId } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
// 对象按key排序（运用于商城传过来的阶梯价格排序）
export const sortByKey = (params) => {
  let keys = Object.keys(params).sort((x, y) => parseInt(x) - parseInt(y))
  let newParams = {}
  keys.forEach((key) => {
    newParams[key] = params[key]
  })
  return newParams
}

export const getUnitPriceTotal = (record) => {
  const purchaseCount = Number(record['count']) || 0

  if (typeof record.price === 'number') {
    return Number((record.price * purchaseCount).toFixed(2))
  }
}

/**
 * @param ctx schemaAction
 * @param relevanceRef 关联报价商品抽屉的ref
 */
export const useProductTable = (ctx: ISchemaFormActions | ISchemaFormAsyncActions, relevanceRef: any) => {
  const clickRelevance = (r) => {
    relevanceRef.current.setVisible(true)
    relevanceRef.current.setCurrentMaterial(r)
  }

  const [productColumns, setProductColumns] = useState(() => {
    productInfoColumns[productInfoColumns.length - 1].render = (t, r) => {
      return (
        <Button type="link" onClick={() => clickRelevance(r)}>
          {intl.formatMessage({ id: 'table.purchase.guanliantoubiaoshang' })}
        </Button>
      )
    }

    return productInfoColumns
  })

  const productComponents = {
    body: {
      row: ProductEditableRow,
      cell: ProductTableCell,
    },
  }

  const handleSave = (row) => {
    return new Promise((resolve, reject) => {
      const newData = [...ctx.getFieldValue('submitTenderMateriel')]
      const index = newData.findIndex((item) => row.id === item.id)
      const item = newData[index]
      row['money'] = getUnitPriceTotal(row)
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
      ctx.setFieldValue('submitTenderMateriel', newData)

      // thead总计变动
      let _ = [...productInfoColumns]
      _[_.length - 2]['title'] = (
        <>
          <div>{intl.formatMessage({ id: 'detail.purchase.taxPrice' })}</div>
          <div>
            {intl.formatMessage({ id: 'table.purchase.zongji' })}：{translate('web.common.currencySymbol')}
            <span style={{ fontWeight: 'bolder' }}>
              {newData.reduce((prev, next) => (prev * 100 + (next.money || 0) * 100) / 100, 0)}
            </span>
          </div>
        </>
      )
      setProductColumns(_)

      resolve({ item, newData })
    })
  }

  const productMergeColumns = productColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: ctx.getFormState().editable === false ? false : col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        formItem: col.formItem,
        formItemProps: col.formItemProps,
        handleSave,
      }),
    }
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
      const newData = [...ctx.getFieldValue('submitTenderMateriel')]
      const index = newData.findIndex((item) => record.id === item.id)
      const item = newData[index]

      newData[index] = item

      item.description = (
        <div className={style.childrenWrap}>
          <Row>
            <Col span={3}>
              <div className={style.childrenTitle}>
                <p>{intl.formatMessage({ id: 'detail.purchase.correspondence' })}</p>
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
      ctx.setFieldValue('submitTenderMateriel', newData)
      // console.log(item, data)
    }
  }

  // 嵌套子表格
  const productChildren = {
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
        // return message.error('请先选择关联商品')
        return null
      }
      if (expanded) {
        renderDescription(record)
      }
    },
  }

  return {
    productColumns: productMergeColumns,
    productComponents,
    productChildren,
  }
}

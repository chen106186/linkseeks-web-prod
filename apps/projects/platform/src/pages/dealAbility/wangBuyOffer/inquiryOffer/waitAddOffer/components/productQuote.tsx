import React, { useEffect, useMemo, useState } from 'react'
import { Form, Table, Select, InputNumber, DatePicker, message, Button, Input } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { Card } from '@linkseeks/ui'
import moment from 'moment'
import {
  getCommodityShopShopBList,
  GetCommodityShopShopBListResponse,
  getProductCommodityGetPublishedShop,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { FormInstance } from 'antd/es/form/Form'
import isEmpty from 'lodash/isEmpty'
import { useWebIntl } from '@apps/locales'
import ProductModalTable from './productModalTable'
import { useProductTable } from '../hooks/useProductTable'

interface ProductQuoteLayoutProps {
  /** 回显 */
  productQuote?: any[]
  form?: FormInstance<any>
  setProductQuote: any
}
const intl = getIntl()

const { Option } = Select

const range = (start: number, end: number) => {
  const result: number[] = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}

const startDisabledTime = () => ({
  disabledHours: () => range(0, 24).filter((item) => item < new Date().getHours()),
  disabledMinutes: () => range(0, 60).filter((item) => item < new Date().getMinutes()),
})

export const fetchPublishedShopById = (id: string): Promise<any[]> => {
  return new Promise((resolve) => {
    getProductCommodityGetPublishedShop({ id })
      .then((res) => {
        if (res.code === 1000 && res.data && res.data.length > 0) {
          resolve(res.data)
        } else {
          resolve([])
        }
      })
      .catch(() => {
        resolve([])
      })
  })
}

const ProductQuoteLayout: React.FC<ProductQuoteLayoutProps> = (props: any) => {
  const { productQuote, form, setProductQuote } = props
  const [dataSource, setDataSource] = useState<any[]>([])
  const [commodityIndex, setCommodityIndex] = useState<number>(0)
  const [shopList, setShopList] = useState<GetCommodityShopShopBListResponse>([])
  // 订单商品
  const { selectedIds, searchSelectMaps, productTableRef, productRef, ...sectionProps } = useProductTable()
  const translate = useWebIntl()

  const fetchShopList = () => {
    getCommodityShopShopBList().then((res) => {
      if (res.code === 1000 && res.data) {
        setShopList(res.data)
      }
    })
  }

  useEffect(() => {
    fetchShopList()
  }, [])

  const endDisabledTime = (index) => {
    const startHours = moment(form.getFieldValue(`quoteStartTime${index}`)).format('HH')
    const startMinutes = moment(form.getFieldValue(`quoteStartTime${index}`)).format('mm')
    return {
      disabledHours: () => range(0, 24).filter((item) => item < Number(startHours)),
      disabledMinutes: () => range(0, 60).filter((item) => item <= Number(startMinutes)),
    }
  }

  const handleSelectChange = (val, type, index) => {
    form.setFieldsValue({
      [`${type}${index}`]: val,
    })
    dataSource[index][type] = val

    if (type === 'quoteStartTime' || type === 'quoteEndTime') {
      dataSource[index][type] = moment(val).format('YYYY-MM-DD HH:mm:ss')
    } else if (type === 'taxRate') {
      // 修改税率 会触发含税金额和不含税金额的计算
      // 含税情况下
      if (form.getFieldValue(`includeTax${index}`) === 1 && form.getFieldValue(`unitPriceWithoutTax${index}`)) {
        // 含税单价 = 不含税单价 / (1 + 税率%)
        dataSource[index]['unitPriceWithTax'] = (
          form.getFieldValue(`unitPriceWithoutTax${index}`) /
          (1 + val / 100)
        ).toFixed(2)
        // 含税金额 = 含税单价 * 数量
        dataSource[index]['totalPriceWithTax'] = (
          dataSource[index]['unitPriceWithTax'] * dataSource[index]['num']
        ).toFixed(2)

        form.setFieldsValue({
          [`unitPriceWithTax${index}`]: dataSource[index]['unitPriceWithTax'],
          [`totalPriceWithTax${index}`]: dataSource[index]['totalPriceWithTax'],
        })
      } else if (form.getFieldValue(`includeTax${index}`) === 0 && form.getFieldValue(`unitPriceWithTax${index}`)) {
        // 不含税情况下

        // 不含税单价 = 含税单价 * (1 + 税率%)
        dataSource[index]['unitPriceWithoutTax'] = (
          form.getFieldValue(`unitPriceWithTax${index}`) *
          (1 + val / 100)
        ).toFixed(2)
        // 不含税金额 = 不含税单价 * 数量
        dataSource[index]['totalPriceWithoutTax'] = (
          dataSource[index]['unitPriceWithoutTax'] * dataSource[index]['num']
        ).toFixed(2)

        form.setFieldsValue({
          [`unitPriceWithoutTax${index}`]: dataSource[index]['unitPriceWithoutTax'],
          [`totalPriceWithoutTax${index}`]: dataSource[index]['totalPriceWithoutTax'],
        })
      }
    } else if (type === 'unitPriceWithTax') {
      // 修改含税单价，会触发不含税单价，含税金额，不含税金额的计算
      const taxRate = form.getFieldValue(`taxRate${index}`)
      dataSource[index]['unitPriceWithoutTax'] = (val / (1 + (taxRate ? taxRate / 100 : 0))).toFixed(2)
      dataSource[index]['totalPriceWithTax'] = (val * dataSource[index]['num']).toFixed(2)
      dataSource[index]['totalPriceWithoutTax'] = (
        dataSource[index]['unitPriceWithoutTax'] * dataSource[index]['num']
      ).toFixed(2)

      form.setFieldsValue({
        [`totalPriceWithTax${index}`]: dataSource[index]['totalPriceWithTax'],
        [`unitPriceWithoutTax${index}`]: dataSource[index]['unitPriceWithoutTax'],
        [`totalPriceWithoutTax${index}`]: dataSource[index]['totalPriceWithoutTax'],
      })
    } else if (type === 'unitPriceWithoutTax') {
      const taxRate = form.getFieldValue(`taxRate${index}`)
      dataSource[index]['unitPriceWithTax'] = (val * (1 + (taxRate ? taxRate / 100 : 0))).toFixed(2)
      dataSource[index]['totalPriceWithoutTax'] = (val * dataSource[index]['num']).toFixed(2)
      dataSource[index]['totalPriceWithTax'] = (
        dataSource[index]['unitPriceWithTax'] * dataSource[index]['num']
      ).toFixed(2)

      form.setFieldsValue({
        [`totalPriceWithTax${index}`]: dataSource[index]['totalPriceWithTax'],
        [`unitPriceWithTax${index}`]: dataSource[index]['unitPriceWithTax'],
        [`totalPriceWithTax${index}`]: dataSource[index]['totalPriceWithTax'],
      })
    }

    setDataSource([...dataSource])
    setProductQuote([...dataSource])
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'priceManage.schema.formProduct.wuliaobianhao' }),
      key: 'goodsNo',
      dataIndex: 'goodsNo',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'material.name' }),
      key: 'goodsName',
      dataIndex: 'goodsName',
      width: 150,
    },
    {
      // title: '规格型号',
      title: intl.formatMessage({ id: 'material.type' }),
      key: 'specification',
      dataIndex: 'specification',
      width: 150,
    },
    {
      // title: '品类',
      title: intl.formatMessage({ id: 'material.category.required' }),
      key: 'categoryName',
      dataIndex: 'categoryName',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'material.brand' }),
      // title: '品牌',
      key: 'brandName',
      dataIndex: 'brandName',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'material.unit' }),
      // title: '单位',
      key: 'unit',
      dataIndex: 'unit',
      width: 150,
    },
    {
      title: translate('web.resource.deal.xunyuanshuliang'),
      key: 'num',
      dataIndex: 'num',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'contract.hanshui' }),
      // title: '含税',
      key: 'includeTax',
      dataIndex: 'includeTax',
      width: 150,
      render: (text, record, index) => (
        <Form.Item
          name={`includeTax${index}`}
          style={{ marginBottom: 0 }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'dealAbility.qingshurubaojiadanjia' }),
            },
          ]}
        >
          <Select
            value={text}
            style={{ width: 120 }}
            onChange={(val) => {
              handleSelectChange(val, 'includeTax', index)
            }}
          >
            <Option value={1}>{intl.formatMessage({ id: 'contract.hanshui' })}</Option>
            <Option value={0}>{intl.formatMessage({ id: 'table.purchase.buhanshui' })}</Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      // title: '税率',
      title: intl.formatMessage({ id: 'detail.purchase.taxProbability' }),
      dataIndex: 'taxRate',
      key: 'taxRate',
      width: 150,
      render: (text, record, index) => (
        <Form.Item
          name={`taxRate${index}`}
          style={{ marginBottom: 0 }}
          rules={[
            {
              required: record.includeTax,
              message: intl.formatMessage({ id: 'logistics.qingshurushuil' }),
            },
          ]}
        >
          <InputNumber
            min={0}
            max={100}
            onChange={(val) => {
              handleSelectChange(val, 'taxRate', index)
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.taxUnitPrice' }),
      // title: '单价(含税)',
      key: 'unitPriceWithTax',
      dataIndex: 'unitPriceWithTax',
      width: 150,
      render: (text, record, index) => (
        <Form.Item
          name={`unitPriceWithTax${index}`}
          style={{ marginBottom: 0 }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'dealAbility.qingshurubaojiadanjia' }),
            },
          ]}
        >
          <InputNumber
            disabled={form.getFieldValue(`includeTax${index}`) !== 1}
            onChange={(val) => {
              handleSelectChange(val, 'unitPriceWithTax', index)
            }}
          />
        </Form.Item>
      ),
    },
    {
      // title: '单价(不含税)',
      title: intl.formatMessage({ id: 'balance.invoice.columns.price.not' }),
      key: 'unitPriceWithoutTax',
      dataIndex: 'unitPriceWithoutTax',
      width: 150,
      render: (text, record, index) => (
        <Form.Item
          name={`unitPriceWithoutTax${index}`}
          style={{ marginBottom: 0 }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'dealAbility.qingshurubaojiadanjia' }),
            },
          ]}
        >
          <InputNumber
            disabled={form.getFieldValue(`includeTax${index}`) !== 0}
            onChange={(val) => {
              handleSelectChange(val, 'unitPriceWithoutTax', index)
            }}
          />
        </Form.Item>
      ),
    },
    {
      // title: '报价有效从',
      title: intl.formatMessage({ id: 'detail.purchase.baojiayouxiaocong' }),
      key: 'quoteStartTime',
      dataIndex: 'quoteStartTime',
      width: 150,
      render: (text, record, index) => (
        <Form.Item
          name={`quoteStartTime${index}`}
          style={{ marginBottom: 0 }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'dealAbility.qingshurubaojiadanjia' }),
            },
            {
              required: true,
              validator: (_rule, value) => {
                const startDate = moment(value).format('YYYY-MM-DD HH:mm')
                const endDate = moment(form.getFieldValue(`quoteEndTime${index}`)).format('YYYY-MM-DD HH:mm')
                if (startDate && endDate && startDate >= endDate)
                  return Promise.reject(new Error('必须小于报价有效结束时间'))
                return Promise.resolve()
              },
            },
          ]}
        >
          <DatePicker
            onChange={(val) => {
              handleSelectChange(val, 'quoteStartTime', index)
            }}
            showTime
            style={{ width: '100%' }}
            disabledDate={(current) => current && current < moment().startOf('day')}
            disabledTime={startDisabledTime}
            format="YYYY-MM-DD HH:mm"
          />
        </Form.Item>
      ),
    },
    {
      // title: '报价有效到',
      title: intl.formatMessage({ id: 'detail.purchase.baojiayouxiaodao' }),
      key: 'quoteEndTime',
      dataIndex: 'quoteEndTime',
      width: 150,
      render: (text, record, index) => (
        <Form.Item
          name={`quoteEndTime${index}`}
          style={{ marginBottom: 0 }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'dealAbility.qingshurubaojiadanjia' }),
            },
          ]}
        >
          <DatePicker
            onChange={(val) => {
              handleSelectChange(val, 'quoteEndTime', index)
            }}
            showTime
            disabledDate={(current) => current && current < moment().startOf('day')}
            disabledTime={() => endDisabledTime(index)}
            style={{ width: '100%' }}
            format="YYYY-MM-DD HH:mm"
          />
        </Form.Item>
      ),
    },
    {
      // title: '含税金额',
      title: intl.formatMessage({ id: 'detail.purchase.label32' }),
      key: 'totalPriceWithTax',
      dataIndex: 'totalPriceWithTax',
      width: 150,
      render: (text: any) => <>{text}</>,
    },
    {
      // title: '不含税金额',
      title: intl.formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.buhanshuijine' }),
      key: 'totalPriceWithoutTax',
      dataIndex: 'totalPriceWithoutTax',
      width: 150,
      render: (text: any) => <>{text}</>,
    },
    {
      title: intl.formatMessage({ id: 'contract.guanlianbaojiashangpin' }),
      key: 'commodityName',
      dataIndex: 'commodityName',
      width: 150,
      render: (text, record, index) => (
        <>
          <Form.Item name={`commodityId${index}`} style={{ marginBottom: 0 }} initialValue={record.commodityId} hidden>
            <Input value={record.commodityId} disabled />
          </Form.Item>
          <Form.Item name={`skuId${index}`} style={{ marginBottom: 0 }} initialValue={record.skuId} hidden>
            <Input value={record.skuId} disabled />
          </Form.Item>
          <Form.Item
            name={`commodityName${index}`}
            style={{ marginBottom: 0 }}
            initialValue={text}
            rules={[
              {
                required: true,
                message: translate('web.resource.deal.qingguanlianbaojiashangpin'),
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
        </>
      ),
    },
    {
      title: translate('web.resource.deal.xiaoshouqudao'),
      key: 'shopId',
      dataIndex: 'shopId',
      width: 150,
      render: (text, record, index) => (
        <>
          <Form.Item name={`shopName${index}`} style={{ marginBottom: 0 }} initialValue={record.shopName} hidden>
            <Input value={record.shopName} disabled />
          </Form.Item>
          <Form.Item
            name={`shopId${index}`}
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: translate('web.resource.deal.qingxuanzexiaoshouqudao'),
              },
            ]}
            initialValue={text}
          >
            <Select
              onChange={(value) => {
                handleSelectChange(value, 'shopId', index)
              }}
              options={record.publishedShops?.map((item) => ({
                label: item.name,
                value: item.shopId,
              }))}
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caozuo' }),
      key: 'operate',
      dataIndex: 'operate',
      width: 150,
      fixed: 'right',
      render: (_text, _data, index) => (
        <Button type="link" onClick={() => handleConnectProduct(index)}>
          {intl.formatMessage({ id: 'contract.guanlianbaojiashangpin' })}
        </Button>
      ),
    },
  ]

  const fnInitTableMessage = (productQuoteDesc) => {
    productQuoteDesc.forEach((item, index) => {
      form.setFieldsValue({
        [`includeTax${index}`]: item?.includeTax, // 含税
        [`taxRate${index}`]: item.taxRate, // 税率
        [`unitPriceWithTax${index}`]: item.unitPriceWithTax, // 单价(含税)
        [`unitPriceWithoutTax${index}`]: item.unitPriceWithoutTax, // 单价(不含税)
        [`quoteStartTime${index}`]: item.quoteStartTime ? moment(item.quoteStartTime) : '', // 报价有效从
        [`quoteEndTime${index}`]: item.quoteEndTime ? moment(item.quoteEndTime) : '', // 报价有效到
      })
    })
  }
  useEffect(() => {
    if (!isEmpty(productQuote)) {
      fnInitTableMessage(productQuote)
      setDataSource([...productQuote])
      setProductQuote([...productQuote])
    }
  }, [productQuote])

  const handleConnectProduct = (index) => {
    setCommodityIndex(index)
    productTableRef?.current?.setVisible(true)
  }

  const handleProductSelect = async (value) => {
    dataSource[commodityIndex].commodityName = value.name
    dataSource[commodityIndex].commodityId = value.commodityId
    dataSource[commodityIndex].skuId = value.id
    const publishedShops = await fetchPublishedShopById(value.commodityId)

    if (publishedShops.length > 0) {
      dataSource[commodityIndex].publishedShops = publishedShops
      const defaultShop =
        publishedShops.find((item) => item.environment === 1 && !item.isSelfShop) ||
        publishedShops.find((item) => item.environment === 1) ||
        publishedShops[0]

      dataSource[commodityIndex].shopId = defaultShop?.shopId
      dataSource[commodityIndex].shopName = defaultShop?.name
      form.setFieldsValue({
        [`shopId${commodityIndex}`]: defaultShop?.shopId,
        [`shopName${commodityIndex}`]: defaultShop?.name,
      })
    }

    form.setFieldsValue({
      [`commodityName${commodityIndex}`]: value.name,
      [`commodityId${commodityIndex}`]: value.commodityId,
      [`skuId${commodityIndex}`]: value.id,
    })

    const dataSourceDesc = JSON.parse(JSON.stringify(dataSource))
    setDataSource([...dataSourceDesc])
    setProductQuote([...dataSourceDesc])
    productTableRef?.current?.setVisible(false)
    productTableRef?.current?.clearSelection()
  }

  return (
    <>
      <Card id="productQuoteLayout" title={intl.formatMessage({ id: 'dealAbility.baojia' })}>
        <Form.Item name="inquiryListProductRequests">
          <Table
            rowKey={(record) => record.productId}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            scroll={{ x: 2200 }}
          />
        </Form.Item>
      </Card>
      <ProductModalTable
        selectedIds={selectedIds}
        searchSelectMaps={searchSelectMaps}
        tableRef={productTableRef}
        currentRef={productRef}
        form={form}
        sectionProps={sectionProps}
        onConfirm={(values) => handleProductSelect(values)}
      />
    </>
  )
}

export default ProductQuoteLayout

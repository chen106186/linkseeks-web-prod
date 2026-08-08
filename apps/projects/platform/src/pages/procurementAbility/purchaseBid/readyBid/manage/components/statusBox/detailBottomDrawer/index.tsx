import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { Row, Col, Input, Drawer, Table, Space, Typography, message, Form, Button, Select } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { priceFormat } from '@/utils/numberFomat'
import { postPurchaseOnlineBiddingSubmitReportPrice, getProductCommodityGetPublishedShop } from '@apps/apis'
import { useWebIntl } from '@apps/locales'
import BtnItem from '../../../../../../components/detail/components/bidDetailBtnItem'

import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'
import SelectProduct from '@/pages/procurementAbility/offter/addOffter/modal/selectProduct'

const { Text } = Typography

interface DetailBottomDrawerProps {
  visible: boolean
  onClose: () => void
  detail: any
  refresh?: () => void
}

const intl = getIntl()

const transforType = {
  1: intl.formatMessage({ id: 'detail.purchase.okText' }),
  0: intl.formatMessage({ id: 'detail.purchase.cancelText' }),
}

const DetailBottomDrawer: React.FC<DetailBottomDrawerProps> = (props: any) => {
  const { visible, onClose, detail, refresh } = props
  const { awardProcess = [], materiels = [], offerCount, isOpenPurchase, isOpenRanking } = detail
  const [form] = Form.useForm()
  const [activeItem, setActiveItem] = useState<any>('')
  const [activeIndex, setActiveIndex] = useState<any>('')
  const [dataSource, setDataSource] = useState<any>(materiels)
  const [dataSource2, setDataSource2] = useState<any>(materiels)
  const [btnLoading, setBtnLoading] = useState<boolean>(false)
  const [relationModalVisible, setRelationModalVisible] = useState<boolean>(false)
  const [currentRow, setCurrentRow] = useState<any>()
  const translate = useWebIntl()

  useEffect(() => {
    if (visible) {
      setDataSource(materiels)
      setDataSource2(materiels)
      form.resetFields()
    }
  }, [visible])

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.type' }),
      dataIndex: 'number',
      key: 'number',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary" key={'number_1'}>
            {text}
          </Text>
          <Text type="secondary" key={'number_2'}>
            {record.name}
          </Text>
        </Space>
      ),
    },
    { title: intl.formatMessage({ id: 'detail.purchase.nameCode' }), key: 'model', dataIndex: 'model' },
    { title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }), key: 'category', dataIndex: 'category' },
    { title: intl.formatMessage({ id: 'detail.purchase.brand' }), key: 'brand', dataIndex: 'brand' },
    {
      title: intl.formatMessage({ id: 'detail.purchase.purchaseCount1' }),
      dataIndex: 'unit',
      key: 'unit',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary" key={'unit_1'}>
            {record.purchaseCount}
          </Text>
          <Text type="secondary" key={'unit_2'}>
            {text}
          </Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.isTax1' }),
      dataIndex: 'isTax',
      key: 'isTax',
      render: (text: any, record: any, index: number) =>
        activeItem ? (
          <Space direction="vertical">
            <Text type="secondary" key={'isTax_1'}>
              {transforType[record.isTax]}
            </Text>
            {record.taxRate ? (
              <Text type="secondary" key={'isTax_2'}>
                {record.taxRate ? `${record.taxRate}%` : ''}
              </Text>
            ) : null}
          </Space>
        ) : (
          <Form.Item
            name={`tax_${index}`}
            noStyle
            rules={[{ required: true, message: intl.formatMessage({ id: 'logistics.qingshurushuil' }) }]}
          >
            <Input
              value={record.taxRate}
              style={{ width: 150, verticalAlign: 'top' }}
              onChange={(e) => {
                _changeTax(record, e.target.value, index)
              }}
              addonAfter="%"
            />
          </Form.Item>
        ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.taxUnitPrice' }),
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (text: any, record: any, index: number) =>
        activeItem ? (
          <Text type="secondary" key={'unitPrice_1'}>
            {intl.formatMessage({ id: 'common.money' })}
            {priceFormat(record.unitPrice)}
          </Text>
        ) : (
          <Form.Item
            name={`unitPrice_${index}`}
            noStyle
            rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message56' }) }]}
          >
            <Input
              value={record.unitPrice}
              style={{ width: 150, verticalAlign: 'top' }}
              onChange={(e) => {
                _changeUnitPrice(record, e.target.value, index)
              }}
              addonBefore={intl.formatMessage({ id: 'common.money' })}
            />
          </Form.Item>
        ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.taxPrice' }),
      dataIndex: 'price',
      key: 'price',
      render: (text: any, record: any) => (
        <Text type="secondary">{text && `${intl.formatMessage({ id: 'common.money' })}${priceFormat(text)}`}</Text>
      ),
    },
    {
      title: translate('web.resource.order.guanlianshangpinxiaoshoushangcheng'),
      dataIndex: 'operation',
      key: 'operation',
      render: (text: any, record: any, index: number) => {
        return activeItem ? (
          record.shopName
        ) : (
          <Form.Item
            name={`shopId_${activeItem ? activeItem.peportTime : '0'}_${index}`}
            noStyle
            rules={[{ required: true, message: translate('web.common.qingxuanze') }]}
          >
            <Select
              disabled={activeItem}
              value={record.shopOptions && record.shopOptions.length > 0 ? record.shopId : undefined}
              options={record.shopOptions || []}
              style={{ width: 150, verticalAlign: 'top' }}
              onChange={(value) => {
                const shopInfo = record.shopOptions.find((item: any) => Number(item.value) === Number(value))
                _changeRelationShop(shopInfo, index)
              }}
            />
          </Form.Item>
        )
      },
    },
    {
      title: '',
      dataIndex: 'operation',
      key: 'operation',
      render: (text: any, record: any, index: number) => {
        return (
          <Button
            type="link"
            disabled={activeItem}
            onClick={() => {
              setCurrentRow({
                ...record,
                index,
              })
              setRelationModalVisible(true)
            }}
          >
            {translate('web.resource.order.guanlianshangpin')}
          </Button>
        )
      },
    },
  ]

  const _changeTax = (record: any, value: any, index: any) => {
    let _val = value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
    let _dataSource = [...dataSource2]
    const _i = _dataSource.findIndex((item) => item.id === record.id)
    let _item = { ..._dataSource[_i] }
    _item.taxRate = _val
    _item.isTax = _val != 0 ? 1 : 0
    _dataSource[_i] = _item
    setDataSource(_dataSource)
    setDataSource2(_dataSource)
    form.setFieldsValue({ [`tax_${index}`]: _val })
  }

  const _changeUnitPrice = (record: any, value: any, index: any) => {
    let _val = value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g, '$1')
    let _dataSource = [...dataSource2]
    const _i = _dataSource.findIndex((item) => item.id === record.id)
    let _item = { ..._dataSource[_i] }
    _item.unitPrice = _val
    _item.price = _calcTotal(_val, _dataSource[_i].purchaseCount)
    _dataSource[_i] = _item
    setDataSource(_dataSource)
    setDataSource2(_dataSource)
    form.setFieldsValue({ [`unitPrice_${index}`]: _val })
  }

  const _changeRelationCommodity = (product: any, shopOptions: any[]) => {
    if (currentRow) {
      const _dataSource = [...dataSource]
      _dataSource[currentRow.index] = {
        ..._dataSource[currentRow.index],
        commodityName: product.commodityName,
        commodityId: product.commodityId,
        commoditySkuId: product.id,
        commodityCategory: product.customerCategoryName,
        commodityBrand: product.brandName,
        commodityAttributeJson: product.commodityAttribute,
        shopOptions,
      }
      setDataSource(_dataSource)
      setDataSource2(_dataSource)
    }
  }

  const _changeRelationShop = (shopInfo: any, index: any) => {
    const _dataSource = [...dataSource]
    _dataSource[index] = {
      ..._dataSource[index],
      shopId: shopInfo.shopId,
      shopName: shopInfo.name,
      shopType: shopInfo.type,
      shopEnvironment: shopInfo.environment,
    }
    setDataSource(_dataSource)
    setDataSource2(_dataSource)
    console.log(`shopId_${activeItem ? activeItem.peportTime : '0'}_${index}`, shopInfo.shopId, '----')
    form.setFieldsValue({ [`shopId_${activeItem ? activeItem.peportTime : '0'}_${index}`]: shopInfo.shopId })
  }

  const _calcTotal = (price: any, purchaseCount: any) => {
    return Number(price) * Number(purchaseCount) || 0
  }

  const _calcCurrentTotal = useMemo(() => {
    return dataSource2?.reduce((total, cur) => total + (cur.price || 0), 0) || 0
  }, [dataSource2])

  const chooseItem = (item?: any, index?: number) => {
    if (item) {
      setActiveItem(item)
      setActiveIndex(index)
      const detailss = item.detailss.map((item: any) => {
        const rowRecord = dataSource2.find((record) => record.id === item.id)

        if (rowRecord) {
          return {
            ...item,
            shopOptions: rowRecord.shopOptions || [],
            shopId: rowRecord.shopId || undefined,
            commodityName: rowRecord.commodityName || undefined,
            commodityId: rowRecord.commodityId || undefined,
            skuId: rowRecord.id || undefined,
          }
        }
        return item
      })
      setDataSource(detailss)
    } else {
      setActiveItem('')
      setActiveIndex('')
      setDataSource(dataSource2)
    }
  }

  const bidOk = () => {
    if (btnLoading) {
      return
    }
    form.validateFields().then((values) => {
      const _price = dataSource2.reduce((total: any, cur: any) => total + Number(cur.price), 0)
      if (detail?.minLowPrice && Number(detail.minLowPrice) - _price < detail.minPrice) {
        message.error(intl.formatMessage({ id: 'detail.purchase.tips15' }))
        return
      }
      let _dataSource2 = dataSource2.map((item) => {
        if (!item.taxRate || item.taxRate == '0') {
          item.isTax = 0
        }
        return item
      })
      const _params = {
        biddingId: detail.biddingId,
        onlineId: detail.id,
        materiels: _dataSource2,
      }
      setBtnLoading(true)
      postPurchaseOnlineBiddingSubmitReportPrice(_params)
        .then((res) => {
          if (res.code === 1000) {
            onClose && onClose()
            refresh && refresh()
          }
        })
        .finally(() => setBtnLoading(false))
    })
  }

  const fetchPublishShopById = (commodityId: string): Promise<any[]> => {
    return new Promise((resolve) => {
      getProductCommodityGetPublishedShop({ id: commodityId })
        .then((res) => {
          if (res.code === 1000 && res.data) {
            resolve(res.data.map((item) => ({ ...item, label: item.name, value: item.shopId })))
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  /**选择报价商品回调  */
  const handleSelectPrduct = async (params: any) => {
    console.log('params: ', params)
    if (params) {
      const shopOptions = await fetchPublishShopById(params.commodityId)
      _changeRelationCommodity(params, shopOptions)
      setRelationModalVisible(false)
    } else {
      message.warning(translate('web.resource.order.qingxuanzeguanliandeshngpin'))
    }
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: 'detail.purchase.modalTitle14' })}
      placement={'bottom'}
      closable={false}
      onClose={onClose}
      open={visible}
      key={'bottom'}
      height={450}
      className={styles.drawer}
      extra={<Button onClick={onClose}>{intl.formatMessage({ id: 'detail.purchase.cancelOffer' })}</Button>}
      zIndex={998}
    >
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <Row gutter={[8, 8]} style={{ marginBottom: '10px' }} wrap={false}>
          <Col
            span={7}
            key={'BtnItem_0'}
            onClick={() => {
              chooseItem()
            }}
          >
            <BtnItem
              btnType={3}
              detail={{ sumPice: _calcCurrentTotal, peportPriceSum: offerCount + 1 }}
              active={!activeItem}
              onOk={bidOk}
              onCancle={onClose}
              btnLoading={btnLoading}
            />
          </Col>
          {awardProcess?.map((item, index, arr) => {
            let _ratio = 0
            const _arrLength = arr.length
            if (index != _arrLength - 1 && _arrLength > 2) {
              _ratio = Number((((item.sumPice - arr[index + 1].sumPice) / arr[index + 1].sumPice) * 100).toFixed(2))
            }
            return (
              <Col
                span={7}
                key={`${item.id}_${item.peportTime}`}
                onClick={() => {
                  chooseItem(item, index)
                }}
              >
                <BtnItem
                  btnType={2}
                  detail={{ ...item, isOpenPurchase, isOpenRanking, ratio: _ratio, selfRanking: index + 1 }}
                  active={index === activeIndex}
                />
              </Col>
            )
          })}
        </Row>
      </div>
      <Form form={form}>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </Form>
      <SelectProduct
        id={currentRow?.skuId}
        visible={relationModalVisible}
        onclose={() => setRelationModalVisible(false)}
        confirm={handleSelectPrduct}
      />
    </Drawer>
  )
}

export default DetailBottomDrawer

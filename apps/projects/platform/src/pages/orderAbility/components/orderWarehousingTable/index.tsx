import React, { useState, useEffect, useMemo } from 'react'
import { Col, Row, Spin, Table, Button, Select, Tooltip } from 'antd'
import type { ColumnType } from 'antd/lib/table/interface'
import { getProductSelectGetWarehouse } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import OrderWarehousingRelation from '../orderWarehousingRelation'
import style from './index.less'

const { Option } = Select

interface OrderWarehousingTableProps {
  type: number
  tableDatas?: any[]
  form?: any
}

// 重组数据
const _mixTable = (data, key) => {
  const _list = []
  data?.forEach((item) => {
    _list.push({
      ...item,
      batchProId: `${item.orderNo}-${item[key]}`,
      received: item.deliveryCount,
    })
  })
  return _list
}

const OrderWarehousingTable: React.FC<OrderWarehousingTableProps> = ({ type, tableDatas, form }) => {
  const intl = useIntl()

  const [wareHouseOptions, setWareHouseOptions] = useState<any>([])
  const [tableData, setTableData] = useState<any>([])
  const [relationVisible, setRelationVisible] = useState<boolean>(false)
  const [proId, setProId] = useState<any>()
  // const [lock, setLock] = useState<boolean>(true);

  const _isSrm = useMemo(() => {
    if (type === 2) {
      return true
    }
    return false
  }, [type])

  const _showTable = useMemo(() => {
    return true
  }, [])

  const _proIdKey = useMemo(() => {
    return 'skuId'
  }, [_isSrm])

  useEffect(() => {
    getProductSelectGetWarehouse().then((res) => {
      if (res.code === 1000) {
        setWareHouseOptions(res.data)
      }
    })
  }, [])

  useEffect(() => {
    setTableData(_mixTable(tableDatas, _proIdKey))
  }, [tableDatas, _proIdKey])

  // useEffect(() => {
  //   if (wareHouseOptions.length > 0 && tableData?.length > 0 && lock) {
  //     let _tableData: any = [...tableData];
  //     _tableData = _tableData?.map((item) => {
  //       return { ...item, inboundWarehouseId: wareHouseOptions[0].id, warehouseRole: wareHouseOptions[0].warehouseAdminName }
  //     })
  //     setLock(false)
  //     setTableData(_tableData)
  //   }
  // }, [wareHouseOptions, tableData, lock])

  useEffect(() => {
    if (tableData?.length > 0) {
      const warehousingOrderProductDetailVOS = tableData.map((item) => {
        const _productObj = {
          ...item,
          warehouseId: item.warehouseId,
          inboundWarehouseId: item.inboundWarehouseId,
          warehouseRole: item.warehouseRole,
          received: item.received,
        }
        if (item?.relationProduct?.id) {
          _productObj.goodsId = item?.relationProduct?.id
          _productObj.skuId = item?.relationProduct?.code
          _productObj.name = item?.relationProduct?.name
          _productObj.category = item?.relationProduct?.customerCategory?.name
          _productObj.brand = item?.relationProduct?.brand?.name
          _productObj.unit = item?.relationProduct?.unitName
          _productObj.spec = item?.relationProduct?.type
          _productObj.materialGroupId = item?.relationProduct?.materialGroup?.id
          _productObj.productContent = `${item?.relationProduct.code}/${item?.relationProduct.name}/${item?.relationProduct.type}`
        }
        return _productObj
      })
      form?.setFieldsValue({ warehousingOrderProductDetailVOS: warehousingOrderProductDetailVOS })
    }
  }, [tableData, _proIdKey])

  const _openRelationSaleOrder = (record: any) => {
    setProId(record['batchProId'])
    setRelationVisible(true)
  }

  const _selectWarehouse = (record, value) => {
    const _index = tableData.findIndex((item) => item['batchProId'] === record['batchProId'])
    const _item = { ...tableData[_index] }
    _item['inboundWarehouseId'] = value
    _item['warehouseRole'] = value
      ? wareHouseOptions[wareHouseOptions.findIndex((item) => item.id === value)]['warehouseAdminName']
      : ''
    const _tableData = [...tableData]
    _tableData[_index] = _item
    setTableData(_tableData)
  }

  const columnsSrm: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'transaction_components.dingdanhao' }),
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 96,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({
        id: 'purchaseRequisition.wuliaobianhao',
        defaultMessage: '物料编号',
      }),
      dataIndex: 'skuId',
      key: 'skuId',
      width: 96,
    },
    {
      title: intl.formatMessage({
        id: 'purchaseRequisition.wuliaomingcheng',
        defaultMessage: '物料名称',
      }),
      dataIndex: 'productName',
      key: 'productName',
      width: 288,
    },
    {
      title: intl.formatMessage({
        id: 'purchaseRequisition.guigexinghao',
        defaultMessage: '规格型号',
      }),
      dataIndex: 'spec',
      key: 'spec',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.pinlei', defaultMessage: '品类' }),
      dataIndex: 'category',
      key: 'category',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.pinpai', defaultMessage: '品牌' }),
      dataIndex: 'brand',
      key: 'brand',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.danwei', defaultMessage: '单位' }),
      dataIndex: 'unit',
      key: 'unit',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'order.warehouseHouse' }),
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'balance.shouhuoshuliang' }),
      dataIndex: 'received',
      key: 'received',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.inboundWarehouseId' }),
      dataIndex: 'inboundWarehouseId',
      key: 'inboundWarehouseId',
      width: 192,
      render: (text, record) => (
        <Select
          allowClear
          value={text}
          style={{ width: 176 }}
          onChange={(e) => {
            _selectWarehouse(record, e)
          }}
        >
          {wareHouseOptions?.map((item) => (
            <Option value={item.id} key={`${item.id}`}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
      fixed: 'right',
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      dataIndex: 'action',
      key: 'action',
      width: 128,
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            _openRelationSaleOrder(record)
          }}
        >
          {intl.formatMessage({ id: 'transaction_components.relationMaterials' })}
        </Button>
      ),
      fixed: 'right',
    },
  ]

  const columnsB2B: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'transaction_components.dingdanhao' }),
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 96,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.productId' }),
      dataIndex: 'skuId',
      key: 'skuId',
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.shangpinmingcheng' }),
      dataIndex: 'productName',
      key: 'productName',
      width: 288,
      ellipsis: true,
      render: (t, r) => <Tooltip title={`${t}/${r.spec}`}>{`${t}/${r.spec}`}</Tooltip>,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.pinlei', defaultMessage: '品类' }),
      dataIndex: 'category',
      key: 'category',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.pinpai', defaultMessage: '品牌' }),
      dataIndex: 'brand',
      key: 'brand',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.danwei', defaultMessage: '单位' }),
      dataIndex: 'unit',
      key: 'unit',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'order.warehouseHouse' }),
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'balance.shouhuoshuliang' }),
      dataIndex: 'received',
      key: 'received',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.inboundWarehouseId' }),
      dataIndex: 'inboundWarehouseId',
      key: 'inboundWarehouseId',
      width: 192,
      render: (text, record) => (
        <Select
          allowClear
          value={text}
          style={{ width: 176 }}
          onChange={(e) => {
            _selectWarehouse(record, e)
          }}
        >
          {wareHouseOptions?.map((item) => (
            <Option value={item.id} key={`${item.id}`}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
      fixed: 'right',
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      dataIndex: 'action',
      key: 'action',
      width: 128,
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            _openRelationSaleOrder(record)
          }}
        >
          {intl.formatMessage({ id: 'transaction_components.relationMaterials' })}
        </Button>
      ),
      fixed: 'right',
    },
  ]

  const renderDescription = async (record) => {
    const newData = [...tableData]
    const index = newData.findIndex((item) => record['batchProId'] === item['batchProId'])
    const item = newData[index]
    item.description = (
      <div className={style.childrenWrap}>
        <Row>
          <Col span={3}>
            <div className={style.childrenTitle}>
              <p>{intl.formatMessage({ id: 'afterService.apply.supplierMember.title' })}</p>
              <p>{intl.formatMessage({ id: 'transaction_components.warehouseMaterials' })}</p>
            </div>
          </Col>
          <Col span={6}>
            <div className={style.childrenContent}>
              <p>
                <span>
                  {intl.formatMessage({
                    id: 'purchaseRequisition.wuliaobianhao',
                    defaultMessage: '物料编号',
                  })}
                  :
                </span>
                {record?.relationProduct?.code}
              </p>
              <p>
                <span>
                  {intl.formatMessage({
                    id: 'purchaseRequisition.wuliaomingcheng',
                    defaultMessage: '物料名称',
                  })}
                  :
                </span>
                {record?.relationProduct?.name}
              </p>
            </div>
          </Col>
          <Col span={6}>
            <div className={style.childrenContent}>
              <p>
                <span>{intl.formatMessage({ id: 'detail.purchase.size' })}：</span>
                {record?.relationProduct?.type}
              </p>
              <p>
                <span>{intl.formatMessage({ id: 'purchaseRequisition.pinlei', defaultMessage: '品类' })}：</span>
                {record?.relationProduct?.customerCategory?.name}
              </p>
            </div>
          </Col>
          <Col span={6}>
            <div className={style.childrenContent}>
              <p>
                <span>{intl.formatMessage({ id: 'purchaseRequisition.pinpai', defaultMessage: '品牌' })}：</span>
                {record?.relationProduct?.brand?.name}
              </p>
            </div>
          </Col>
        </Row>
      </div>
    )
    setTableData([...newData])
  }

  const relationConfirm = (rows: any) => {
    const _index = tableData.findIndex((item) => item['batchProId'] === proId)
    const _item = { ...tableData[_index] }
    _item.relationProduct = rows[0]
    const _tableData = [...tableData]
    _tableData[_index] = _item
    setTableData(_tableData)
    setRelationVisible(false)
  }
  if (_showTable) {
    return (
      <div className={style['billMaterial']}>
        <p style={{ color: '#91959B', fontSize: 12, marginBottom: 8 }}>
          {intl.formatMessage({ id: 'transaction_components.orderWarehousingTable.tips.1' })}
        </p>
        <p style={{ color: '#91959B', fontSize: 12, marginBottom: 8 }}>
          {intl.formatMessage({ id: 'transaction_components.orderWarehousingTable.tips.2' })}
        </p>
        <Table
          dataSource={tableData}
          columns={_isSrm ? columnsSrm : columnsB2B}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>
                {record?.batchProId
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
              console.log('展开')
              if (expanded) {
                renderDescription(record)
              }
            },
          }}
          rowKey={'batchProId'}
          pagination={false}
          scroll={{ x: '100%' }}
        />
        <OrderWarehousingRelation
          recordData={tableData?.find((item) => item['batchProId'] === proId)?.relationProduct}
          visible={relationVisible}
          onClose={() => {
            setRelationVisible(false)
          }}
          onConfirm={relationConfirm}
        />
      </div>
    )
  }

  return null
}

OrderWarehousingTable.defaultProps = {}

export default OrderWarehousingTable

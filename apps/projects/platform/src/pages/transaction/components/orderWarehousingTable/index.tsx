import React, { useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Col, Row, Spin, Table, Button, Select, Tooltip, Tabs, message } from 'antd'
import type { ColumnType } from 'antd/lib/table/interface'
import { useLocation } from '@linkseeks/router-core'
import BatchUpload_icon from '@/assets/imgs/batchUpload.png'
import BatchUpload_checked_icon from '@/assets/imgs/batchUpload_checked.png'
import BatchUpload_check_icon from '@/assets/imgs/batchUpload_check.png'
import MellowCard from '@/components/MellowCard'
import ModalForm from '@/components/ModalForm'
import { UPLOAD_TYPE } from '@/constants'
import { authService } from '@apps/services'
import { createFormActions } from '@apps/formily'
import { getProductWarehouseRuleConfigGetWarehouseAutoEnter, getProductSelectGetWarehouse } from '@apps/apis'
import { postOrderBuyerValidateReceiveConfirm } from '@apps/apis'
import { OrderDetailContext } from '../../_public/order/context'
import { useIntl } from '@linkseeks/i18n'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import OrderWarehousingRelation from '../orderWarehousingRelation'
import { OrderModeB2b, OrderModeSrm } from './constants'
import style from './index.less'

const { Option } = Select
const { TabPane } = Tabs
const receiveActions = createFormActions()

interface OrderWarehousingTableProps {
  tableType?: 'purchaseOrder' | 'receivingNote'
}

// 重组数据
const _mixTable = (data, key) => {
  const _list = []
  data?.forEach((item) => {
    item?.products.forEach((_item) => {
      _list.push({
        ..._item,
        batchProId: `${item.batchNo}-${_item[key]}`,
        received: _item.delivered,
      })
    })
  })
  return _list
}

const OrderWarehousingTable: React.FC<OrderWarehousingTableProps> = ({ tableType = 'purchaseOrder' }) => {
  const {
    formContext: { data, reloadFormData, ctl },
  } = useContext(OrderDetailContext)
  const { deliveryDetails = [], orderMode, orderNo, outerStatus, orderId } = data || {}
  const { pathname } = useLocation()
  const preview = pathname.indexOf('detail') !== -1
  const { accessToken } = authService.getAuth() || {}

  const intl = useIntl()

  const [wareHouseOptions, setWareHouseOptions] = useState<any>([])
  const [tableData, setTableData] = useState<any>([])
  const [showComponents, setShowComponents] = useState<boolean>(false)
  const [relationVisible, setRelationVisible] = useState<boolean>(false)
  const [proId, setProId] = useState<any>()
  const [activeKey, setActiveKey] = useState<string>('1')
  const receiveRef = useRef<any>({})
  const [, setDisabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // 是否是确认收货页
  const isReceived = pathname.indexOf('readyReceiveOrder') !== -1

  useEffect(() => {
    if (data?.autoEnterBatchNo) {
      setActiveKey(String(data?.autoEnterBatchNo))
    }
  }, [data])

  const _isSrm = useMemo(() => {
    if (tableType === 'purchaseOrder') {
      return OrderModeSrm.includes(orderMode)
    }
    return false
  }, [orderMode, tableType])

  const _showTable = useMemo(() => {
    if (tableType === 'purchaseOrder') {
      return OrderModeB2b.includes(orderMode) || OrderModeSrm.includes(orderMode)
    }
    return false
  }, [orderMode, tableType])

  const _proIdKey = useMemo(() => {
    return _isSrm ? 'productId' : 'skuId'
  }, [_isSrm])

  const _tableMemo = useMemo(() => {
    return deliveryDetails.filter((item) => item.batchNo === Number(activeKey))
  }, [activeKey, deliveryDetails])

  useEffect(() => {
    getProductWarehouseRuleConfigGetWarehouseAutoEnter().then((res) => {
      if (res.code === 1000 && res.data) {
        setShowComponents(res.data?.isCreate ?? false)
      }
    })
    getProductSelectGetWarehouse().then((res) => {
      if (res.code === 1000) {
        setWareHouseOptions(res.data)
      }
    })
  }, [])

  useEffect(() => {
    setTableData(_mixTable(_tableMemo, _proIdKey))
  }, [_tableMemo, _proIdKey])

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
    const _data = { ...data }
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
      _data.warehousingOrderProductDetailVOS = warehousingOrderProductDetailVOS
    } else {
      _data.warehousingOrderProductDetailVOS = []
    }
    ctl?.setData(_data)
  }, [tableData, _proIdKey])

  const _openRelationSaleOrder = (record: any) => {
    setProId(record.batchProId)
    setRelationVisible(true)
  }

  const _selectWarehouse = (record, value) => {
    const _index = tableData.findIndex((item) => item.batchProId === record.batchProId)
    const _item = { ...tableData[_index] }
    _item.inboundWarehouseId = value
    _item.warehouseRole = value
      ? wareHouseOptions[wareHouseOptions.findIndex((item) => item.id === value)].warehouseAdminName
      : ''
    const _tableData = [...tableData]
    _tableData[_index] = _item
    setTableData(_tableData)
  }

  const columnsSrm: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'transaction_components.dingdanhao' }),
      dataIndex: 'orderProductId',
      key: 'orderProductId',
      width: 96,
      fixed: 'left',
      render: () => orderNo,
    },
    {
      title: intl.formatMessage({
        id: 'purchaseRequisition.wuliaobianhao',
        defaultMessage: '物料编号',
      }),
      dataIndex: 'productId',
      key: 'productId',
      width: 96,
    },
    {
      title: intl.formatMessage({
        id: 'purchaseRequisition.wuliaomingcheng',
        defaultMessage: '物料名称',
      }),
      dataIndex: 'name',
      key: 'name',
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
      dataIndex: 'orderProductId',
      key: 'orderProductId',
      width: 96,
      fixed: 'left',
      render: () => orderNo,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.productId' }),
      dataIndex: 'skuId',
      key: 'skuId',
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.shangpinmingcheng' }),
      dataIndex: 'name',
      key: 'name',
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
    const index = newData.findIndex((item) => record.batchProId === item.batchProId)
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
    const _index = tableData.findIndex((item) => item.batchProId === proId)
    const _item = { ...tableData[_index] }
    _item.relationProduct = rows[0]
    const _tableData = [...tableData]
    _tableData[_index] = _item
    setTableData(_tableData)
    setRelationVisible(false)
  }
  console.log('orderMode', orderMode, 'showTable', _showTable, 'showComponents', showComponents)

  const _tabOnchange = (key: string) => {
    setActiveKey(key)
  }

  // 提交凭证
  const handleSubmit = useCallback(() => {
    receiveActions.submit().then(async ({ values }: any) => {
      if (values.receiveBill && values.receiveBill[0]) {
        values.receiveBill = values.receiveBill[0].data
      }
      if (orderId) {
        values.orderId = orderId
        values.batchNo = _tableMemo[0]?.batchNo
      }
      if (data.warehousingOrderProductDetailVOS) {
        values.warehousingOrderProductDetailVOS = data.warehousingOrderProductDetailVOS
        for (const key in data.warehousingOrderProductDetailVOS) {
          if (
            data.warehousingOrderProductDetailVOS[key].inboundWarehouseId &&
            !data.warehousingOrderProductDetailVOS[key].goodsId
          ) {
            return message.error('请选择关联物料')
          }
        }
      }
      setLoading(true)
      const result = await postOrderBuyerValidateReceiveConfirm(values)
      if (result.code === 1000) {
        receiveActions.reset()
        setLoading(false)
        receiveRef.current.setVisible(false)
        setTimeout(() => {
          reloadFormData?.()
          setDisabled(false)
        }, 800)
      } else {
        setLoading(false)
        setDisabled(false)
      }
    })
  }, [data, _tableMemo])

  // 确认收货
  const handleConfirm = async () => {
    receiveRef.current.setVisible(true)
  }

  if (_showTable && showComponents && !preview && isReceived && outerStatus !== 100) {
    return (
      <MellowCard
        id="orderWarehousingTable"
        title={intl.formatMessage({ id: 'transaction_components.orderWarehousingTable.title' })}
        style={{ marginTop: 24 }}
        className={style.billMaterial}
        bordered={false}
        fullHeight
      >
        <p style={{ color: '#91959B', fontSize: 12, marginBottom: 8 }}>
          {intl.formatMessage({ id: 'transaction_components.orderWarehousingTable.tips.1' })}
        </p>
        <p style={{ color: '#91959B', fontSize: 12, marginBottom: 8 }}>
          {intl.formatMessage({ id: 'transaction_components.orderWarehousingTable.tips.2' })}
        </p>
        <Tabs activeKey={activeKey} onChange={_tabOnchange}>
          {deliveryDetails.map((_item) => (
            <TabPane
              tab={
                <>
                  {`第${_item.batchNo}批`}
                  <img
                    style={{ width: 16, marginLeft: 16, marginBottom: 2 }}
                    src={_item.showReceive ? BatchUpload_check_icon : BatchUpload_checked_icon}
                  />
                </>
              }
              key={String(_item.batchNo)}
            />
          ))}
        </Tabs>
        {_tableMemo?.[0]?.showReceive ? (
          <>
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
            <Button
              style={{ marginTop: 16 }}
              type="primary"
              onClick={() => {
                handleConfirm()
              }}
            >
              本批次确认收货
            </Button>
          </>
        ) : (
          <div key={'batchIcon0'} className={style.batchIcon}>
            <img src={BatchUpload_icon} />
            <p>本批次已确认收货</p>
          </div>
        )}
        <OrderWarehousingRelation
          recordData={tableData?.find((item) => item.batchProId === proId)?.relationProduct}
          visible={relationVisible}
          onClose={() => {
            setRelationVisible(false)
          }}
          onConfirm={relationConfirm}
        />
        <ModalForm
          modalTitle={intl.formatMessage({ id: 'transaction_components.querenshouhuo' })}
          currentRef={receiveRef}
          confirm={handleSubmit}
          cancel={() => setDisabled(false)}
          actions={receiveActions}
          schema={{
            type: 'object',
            properties: {
              NO_SUBMIT: {
                type: 'object',
                'x-component': 'mega-layout',
                'x-component-props': {
                  labelAlign: 'top',
                },
                properties: {
                  orderId: {
                    type: 'number',
                    title: intl.formatMessage({ id: 'transaction_components.dangqianid' }),
                    visible: false,
                  },
                  batchNo: {
                    type: 'number',
                    title: intl.formatMessage({ id: 'transaction_components.shouhuopici' }),
                    visible: false,
                  },
                  receiveBill: {
                    title: intl.formatMessage({ id: 'transaction_components.shouhuohuidan' }),
                    'x-component': 'Upload',
                    'x-component-props': {
                      listType: 'text',
                      maxCount: 1,
                      action: '/api/support/file/upload',
                      data: { fileType: UPLOAD_TYPE },
                      headers: {
                        accessToken,
                      },
                      locale: {
                        uploadText: intl.formatMessage({ id: 'common.button.upload' }),
                      },
                    },
                  },
                },
              },
            },
          }}
          modalProps={{ confirmLoading: loading }}
        />
      </MellowCard>
    )
  }

  return null
}

OrderWarehousingTable.defaultProps = {}

export default OrderWarehousingTable

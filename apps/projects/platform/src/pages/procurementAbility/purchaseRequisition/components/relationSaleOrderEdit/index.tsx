import React, { useRef, useState, useEffect } from 'react'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { Space, Button, Typography, Drawer, Checkbox } from 'antd'
import StatusColors from '@/components/StatusColors'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import Submit from '@/components/NiceForm/components/Submit'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { getIntl } from '@linkseeks/i18n'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'

import { getOrderCommonPurchaseVendorOrderAssociationPage, getOrderCommonOuterStatusDropItems } from '@apps/apis'

import { saleOrderTransformRequisitionStatus, saleOrderTransformRequisitionSchemaEdit } from '../../constant'

const { Text } = Typography
const formActions = createFormActions()

const intl = getIntl()
interface RelationSaleOrderEditProps {
  visible: boolean
  recordData: any
  onClose: () => void
  onConfirm: (rows: any) => void
}

const RelationSaleOrderEdit: React.FC<RelationSaleOrderEditProps> = (props: any) => {
  const { visible, onClose, recordData, onConfirm } = props
  const [selectRow, selectRowFns] = useRowSelectionTable({
    customKey: 'orderProductId',
  })
  const ref = useRef<any>({})
  const [outerStatusList, setOuterStatusList] = useState<any>()
  const [requisitioned, setRequisitioned] = useState<boolean>(true)
  const [isBind, setIsBind] = useState<boolean>(false)
  const [lock, setLock] = useState<boolean>(false)
  useEffect(() => {
    getOrderCommonOuterStatusDropItems().then((res) => {
      if (res.code === 1000) {
        const _list = [1, 3, 100, 101, 102]
        setOuterStatusList(res.data.filter((item) => !_list.includes(item.id)))
      }
    })
  }, [])
  useEffect(() => {
    ref.current?.reload && ref.current?.reload()
  }, [requisitioned, isBind, recordData])
  useEffect(() => {
    console.log(recordData?.orderProductIds)
    if (lock) {
      selectRowFns.setSelectedRowKeys(recordData?.orderProductIds ?? [])
    }
  }, [lock, recordData])

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dingdanhao' }),
      align: 'center',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 112,
      fixed: 'left',
      render: (text, record) => {
        return <Button type="link">{text}</Button>
      },
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dingdandingdandigest' }),
      align: 'center',
      dataIndex: 'digest',
      key: 'digest',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.caigouhuiyuan' }),
      align: 'center',
      dataIndex: 'buyerMemberName',
      key: 'buyerMemberName',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.xiadanshijian' }),
      align: 'center',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.productId' }),
      align: 'center',
      dataIndex: 'skuId',
      key: 'skuId',
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.shangpinmingcheng' }),
      align: 'center',
      dataIndex: 'productName',
      key: 'productName',
      width: 192,
    },
    {
      title: intl.formatMessage({ id: 'order.orderProductPosition' }),
      dataIndex: 'orderProductPositionVOS',
      key: 'orderProductPositionVOS',
      width: 160,
      render: (text, record) => (
        <div>
          {record?.orderProductPositionVOS?.map((_item, _index) => (
            <div key={`${record.skuId}_${_index}`}>
              {_item.positionName}：{_item.positionQuantity}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'priceManage.effect.unitPrice' }),
      align: 'center',
      dataIndex: 'price',
      key: 'price',
      width: 112,
      render: (text) => `${intl.formatMessage({ id: 'common.money' })}${text}`,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caigoushuliang' }),
      align: 'center',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 112,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.productInfoColumns.price' }),
      align: 'center',
      dataIndex: 'amount',
      key: 'amount',
      width: 112,
      render: (text) => `${intl.formatMessage({ id: 'common.money' })}${text}`,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
      align: 'center',
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
      width: 160,
      render: (text, record) => (
        <StatusTag title={text} type={saleOrderTransformRequisitionStatus[record.outerStatus] || 'default'} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.requisitionStatus' }),
      align: 'center',
      dataIndex: 'requisitioned',
      key: 'requisitioned',
      width: 96,
      render: (text, record) => (
        <StatusColors
          status={text ? 5 : 8}
          type="saleInside"
          mode="Badge"
          text={
            text
              ? intl.formatMessage({ id: 'purchaseOrder.requisitioned' })
              : intl.formatMessage({ id: 'purchaseOrder.notRequisitioned' })
          }
        />
      ),
    },
  ]

  /** 列表数据 */
  const fetchData = async (params?: any) => {
    if (visible) {
      try {
        const _params = {
          ...params,
          isBind,
          productId: recordData?.productId ?? recordData?.id,
          requisitioned: !requisitioned,
        }
        const { data } = await getOrderCommonPurchaseVendorOrderAssociationPage(_params)
        setLock(true)
        return data
      } catch (error) {
        return { data: [], total: 0 }
      }
    }
  }

  const ControllerBtns = (
    <Space>
      <Checkbox checked={requisitioned} onChange={(e) => setRequisitioned(e.target.checked)}>
        {intl.formatMessage({ id: 'purchaseOrder.displayOnlyUNRequisitionedSalesOrders' })}
      </Checkbox>
      <Checkbox checked={isBind} onChange={(e) => setIsBind(e.target.checked)}>
        {intl.formatMessage({ id: 'purchaseOrder.displayOnlyTheProductIDBoundToTheCurrentMaterial' })}
      </Checkbox>
    </Space>
  )

  const handleConfirm = () => {
    onConfirm?.(selectRowFns.selectedRowKeys)
    onClose?.()
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: 'purchaseRequisition.associatedSalesOrder' })}
      width={1200}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'detail.purchase.cancel' })}
          </Button>
          <Button onClick={handleConfirm} type="primary">
            {intl.formatMessage({ id: 'table.purchase.confirm' })}
          </Button>
        </div>
      }
    >
      <StandardTable
        keepAlive={false}
        fetchTableData={(params) => fetchData(params)}
        columns={columns}
        currentRef={ref}
        rowSelection={selectRow}
        rowKey="orderProductId"
        controlRender={
          <NiceForm
            key="RelationSaleOrderEdit"
            actions={formActions}
            onSubmit={(values) => ref.current.reload(values)}
            effects={($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'orderNo', FORM_FILTER_PATH)
            }}
            schema={saleOrderTransformRequisitionSchemaEdit(outerStatusList)}
            components={{
              DateRangePickerUnix,
              Submit,
              controllerBtns: () => ControllerBtns,
            }}
          />
        }
        tableProps={{
          scroll: {
            x: '100%',
          },
        }}
      />
    </Drawer>
  )
}
export default RelationSaleOrderEdit

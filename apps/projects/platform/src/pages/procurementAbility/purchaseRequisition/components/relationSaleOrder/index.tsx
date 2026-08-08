import React, { useRef, useCallback, useEffect } from 'react'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { Space, Button, Typography, Drawer } from 'antd'

import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { getIntl } from '@linkseeks/i18n'

import { saleOrderTransformRequisitionStatus } from '../../constant'

const { Text } = Typography
const formActions = createFormActions()

const intl = getIntl()
interface RelationSaleOrderProps {
  visible: boolean
  fetch: Promise<any>
  purchaseProductId: any
  onClose: () => void
}

const RelationSaleOrder: React.FC<RelationSaleOrderProps> = (props: any) => {
  const { visible, onClose, fetch, purchaseProductId } = props
  const tableRef = useRef<any>({})
  useEffect(() => {
    tableRef.current?.reload && tableRef.current?.reload()
  }, [purchaseProductId])
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dingdanhao' }),
      align: 'center',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 112,
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
  ]

  /** 列表数据 */
  const fetchData = useCallback(
    (params?: any) => {
      return new Promise((resolve, reject) => {
        visible &&
          fetch({ purchaseProductId, ...params })
            .then((res) => {
              resolve(res.data)
            })
            .catch((error) => {
              console.warn(error)
            })
      })
    },
    [purchaseProductId],
  )

  // 搜索
  const search = (values: any) => {
    tableRef.current.reload(values)
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
          <Button onClick={onClose} type="primary">
            {intl.formatMessage({ id: 'table.purchase.confirm' })}
          </Button>
        </div>
      }
    >
      <StandardTable
        keepAlive={false}
        currentRef={tableRef}
        columns={columns}
        tableProps={{
          rowKew: 'orderProductId',
          scroll: {
            x: '100%',
          },
        }}
        fetchTableData={(params: any) => fetchData(params)}
        controlRender={<NiceForm actions={formActions} onSubmit={(values) => search(values)}></NiceForm>}
      />
    </Drawer>
  )
}
export default RelationSaleOrder

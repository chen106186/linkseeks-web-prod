import React, { useRef, useState, useEffect } from 'react'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { Button, Drawer, message } from 'antd'
import Submit from '@/components/NiceForm/components/Submit'
import NiceForm from '@/components/NiceForm'
import { getIntl } from '@linkseeks/i18n'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'

import { getProductMaterielGetDoesNotFreezeMaterielList } from '@apps/apis'

import { orderWarehousingRelationSchema } from './schema'

const formActions = createFormActions()

const intl = getIntl()
interface OrderWarehousingRelationProps {
  visible: boolean
  recordData: any
  onClose: () => void
  onConfirm: (rows: any) => void
}

const OrderWarehousingRelation: React.FC<OrderWarehousingRelationProps> = (props: any) => {
  const { visible, onClose, recordData, onConfirm } = props
  const [selectRow, selectRowFns] = useRowSelectionTable({
    customKey: 'id',
    type: 'radio',
  })
  const ref = useRef<any>({})
  useEffect(() => {}, [])

  useEffect(() => {
    selectRowFns.setSelectedRowKeys([recordData?.id] ?? [])
  }, [recordData])

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'purchaseRequisition.wuliaobianhao',
        defaultMessage: '物料编号',
      }),
      dataIndex: 'code',
      key: 'code',
      width: 128,
    },
    {
      title: intl.formatMessage({
        id: 'purchaseRequisition.wuliaomingcheng',
        defaultMessage: '物料名称',
      }),
      dataIndex: 'name',
      key: 'name',
      width: 304,
    },
    {
      title: intl.formatMessage({
        id: 'purchaseRequisition.guigexinghao',
        defaultMessage: '规格型号',
      }),
      dataIndex: 'type',
      key: 'type',
      width: 192,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.pinlei', defaultMessage: '品类' }),
      dataIndex: 'customerCategory',
      key: 'customerCategory',
      width: 192,
      render: (text, record) => (text?.name ? `${text?.name}` : ''),
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.pinpai', defaultMessage: '品牌' }),
      dataIndex: 'brand',
      key: 'brand',
      width: 192,
      render: (text, record) => (text?.name ? `${text?.name}` : ''),
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.danwei', defaultMessage: '单位' }),
      dataIndex: 'unit',
      key: 'unit',
      width: 192,
    },
  ]

  /** 列表数据 */
  const fetchData = async (params?: any) => {
    if (visible) {
      try {
        const _params = { ...params }
        const { data } = await getProductMaterielGetDoesNotFreezeMaterielList(_params)
        return data
      } catch (error) {
        return { data: [], total: 0 }
      }
    }
  }

  const handleConfirm = () => {
    if (selectRowFns.selectRow.length <= 0) {
      message.error(intl.formatMessage({ id: 'transaction_components.relationMaterials.error' }))
      return
    }
    onConfirm?.(selectRowFns.selectRow)
    onClose?.()
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: 'transaction_components.relationMaterials' })}
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
        rowKey="id"
        controlRender={
          <NiceForm
            key="orderWarehousingRelation"
            actions={formActions}
            onSubmit={(values) => ref.current.reload(values)}
            effects={($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'code', FORM_FILTER_PATH)
            }}
            schema={orderWarehousingRelationSchema}
            components={{
              Submit,
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
export default OrderWarehousingRelation

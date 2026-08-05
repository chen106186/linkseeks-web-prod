import React, { useRef, useImperativeHandle } from 'react'
import { useIntl } from '@linkseeks/i18n'
import PolymericTable from '@/components/PolymericTable'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import type { GetContractPurchaseRequisitionPageByProductIdsRequest } from '@apps/apis'
import { getContractPurchaseRequisitionPageByProductIds } from '@apps/apis'
import { requisitionColumns } from '../../constant'
import { useModalTable } from '../../model/useModalTable'
import { Button, Drawer } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
type RequisitionType = {
  /**
   * 请购单id
   */
  requisitionId: number
  /**
   * 下单数量
   */
  orderQuantity: number
}

export interface RequisitionModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction?: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?: () => any
}

export interface RequisitionModalTableRef {
  show: (record: RequisitionType[]) => void
}

// 关联请购单弹窗
const RequisitionModalTable: React.ForwardRefRenderFunction<RequisitionModalTableRef, RequisitionModalTableProps> = (
  props,
  ref,
) => {
  const { type = 'radio' } = props
  const { visible, setVisible } = useModalTable({ type })
  const intl = useIntl()

  const requisitions = useRef<RequisitionType[]>([])

  const fetchDataSource = async () => {
    const res = await getContractPurchaseRequisitionPageByProductIds({
      prpIdsStr: requisitions.current.map((item) => item.requisitionId).join(','),
    } as GetContractPurchaseRequisitionPageByProductIdsRequest)
    if (res.code === 1000) {
      const compountedData = res.data.data.map((item) => {
        const currentEntity = requisitions.current.find((requisition) => requisition.requisitionId === item.prpId) || {}
        return {
          ...item,
          ...currentEntity,
        }
      })
      return {
        ...res.data,
        data: compountedData,
      }
    }
    return { data: [], totalCount: 0 }
  }

  const handleShow = (records: RequisitionType[]) => {
    requisitions.current = records
    setVisible(true)
  }

  useImperativeHandle(ref, () => ({
    show: handleShow,
  }))

  return (
    <Drawer
      title={
        <span style={{ color: '#252D37', fontSize: 16, fontWeight: 500 }}>
          {intl.formatMessage({
            id: 'transaction_components.guanlianqinggoudan',
            defaultMessage: '关联请购单',
          })}
        </span>
      }
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={() => setVisible(false)}>
            {translate('web.common.confirmEmpty')}
          </Button>
        </div>
      }
      extra={<CloseOutlined style={{ color: '#91959B', fontSize: 24 }} onClick={() => setVisible(false)} />}
      width={1200}
      visible={visible}
      closable={false}
      onClose={() => setVisible(false)}
      bodyStyle={{
        paddingBottom: 0,
      }}
      destroyOnClose
    >
      <PolymericTable
        rowKey="prpId"
        columns={requisitionColumns}
        fetchDataSource={fetchDataSource}
        pagination={{ showSizeChanger: false }}
        scroll={{ x: 1200 }}
        full
      />
    </Drawer>
  )
}

const RequisitionModalTableForWard = React.forwardRef<RequisitionModalTableRef, RequisitionModalTableProps>(
  RequisitionModalTable,
)

export default RequisitionModalTableForWard

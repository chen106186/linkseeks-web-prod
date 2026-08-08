import { guid } from '@/utils/uuid'
import { Button, Drawer, FormInstance, Pagination, Table } from 'antd'
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import DeliveryNoticeOrderFactory from '../../assets/handles/DeliveryNoticeOrder'
import {
  PlannedDeliveryMaterialExpandableTableColumn,
  PlannedDeliveryMaterialTableColumn,
  PlannedDeliveryProductTableColumn,
} from '../../constants/page-table-column'
import ExpandedRowTableRender from './ExpandedRowTableRender'
import { PlusOutlined } from '@ant-design/icons'
import { useWebIntl } from '@apps/locales'

let selectedRowKeys = new Map()
interface DeliveryGoodTableModalProps {
  form: FormInstance
  onChange: (value) => void
  disabled?: boolean
  orderType?: number
  value?: any
  title?: string
}

/**
 * 查询计划周期内的计划送货物料 Table Select
 * @param form 当前页面操作的form
 * @param onChange table 选择的callback (value:OrderInfo[]) => void
 */
function DeliveryGoodTableModal(props: DeliveryGoodTableModalProps) {
  const { onChange, form, disabled, orderType, title, value } = props
  const [visible, setVisible] = useState(false)
  const service = DeliveryNoticeOrderFactory.getInstance()
  const [tableData, setTableData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState<number>(1)
  const [canShow, setCanShow] = useState([])
  const translate = useWebIntl()

  useEffect(() => {
    const _canShow = tableData.slice((page - 1) * 10, page * 10)
    setCanShow(_canShow)
  }, [page])

  const handleVisible = useCallback(() => {
    setVisible(true)
    selectedRowKeys = value
  }, [visible, value])

  const handleSubmit = useCallback(() => {
    console.log(selectedRowKeys)
    onChange(selectedRowKeys)
    setVisible(false)
  }, [visible, value])

  useEffect(() => {
    if (form.getFieldValue('member') && !tableData?.length) {
      service.getOrderDeliveryPlanOrderProductPage(form, 1, orderType).then(handleResponseHttp)
    }
  }, [visible])

  const handleResponseHttp = (res) => {
    if (!res?.data) return
    const data = res.data
    let result = data.map((v) => {
      return {
        ...v,
        id: v.no,
      }
    })
    setTableData(result)
    setCanShow(result.slice(0, 10))
    setTotal(res.totalCount)
  }

  const expandedRowRender = (record, index) => {
    let combination = (record.orders as any[]).map((v) => {
      let result = {
        ...record,
        ...v,
      }
      delete result['orders']
      return result
    })

    return (
      <ExpandedRowTableRender
        selectedRowKeys={value.get(index)}
        dataSource={combination}
        onChange={(keys) => {
          selectedRowKeys.set(index, keys)
          onChange(selectedRowKeys)
        }}
      />
    )
  }
  return (
    <>
      {!disabled && (
        <div className="mt-16">
          <Button
            onClick={handleVisible}
            icon={<PlusOutlined />}
            style={{
              width: '100%',
              backgroundColor: '#FAFBFC',
              borderStyle: 'dashed',
            }}
          >
            {translate('web.common.select')}
          </Button>
        </div>
      )}

      <Drawer
        title={title}
        open={visible}
        width="90vw"
        onClose={() => {
          setVisible(false)
        }}
        footer={
          <Button.Group>
            <Button type="primary" onClick={handleSubmit}>
              {translate('web.common.queren')}
            </Button>
          </Button.Group>
        }
      >
        {canShow.map((t, i) => {
          return (
            <Table
              key={`${t.skuId}_${t.planProductId}_${i}`}
              className="mt-16"
              columns={orderType == 1 ? PlannedDeliveryProductTableColumn : PlannedDeliveryMaterialTableColumn}
              rowKey={(row) => row.no}
              dataSource={[t]}
              expandedRowRender={(r) => expandedRowRender(r, i)}
              defaultExpandAllRows={true}
              defaultExpandedRowKeys={tableData.map((i) => i.no)}
              // expandIcon={() => ""}
              pagination={false}
            />
          )
        })}

        <Pagination
          size="small"
          className="mt-16"
          total={total}
          onChange={(page: number) => {
            setPage(page)
          }}
        />
        {/* <Pagination size="small" className="mt-16" total={total} onChange={(page: number) => {
          service.getOrderDeliveryPlanOrderProductPage(form, page, orderType).then(handleResponseHttp)
        }} /> */}
      </Drawer>
    </>
  )
}

export default DeliveryGoodTableModal

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Card, Space, Button, Tabs } from 'antd'
import StandardTable from '@/components/StandardTable'
import StatusColors from '@/components/StatusColors'
import { PageHeaderWrapper } from '@apps/components'
import { saleOrderTransformRequisitionColumns, saleOrderTransformRequisitionSchema } from '../constant'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import Submit from '@/components/NiceForm/components/Submit'
import NiceForm from '@/components/NiceForm'
import { AuthButton } from '@apps/components'
import { createFormActions } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { getOrderCommonPurchaseVendorOrderConvertPage, getOrderCommonOuterStatusDropItems } from '@apps/apis'
import { postProductCommodityCommonCheckAssociatedMateriel } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
const { TabPane } = Tabs

// 销售订单转请购单

export interface SaleOrderTransformRequisitionProps {}

const formActions = createFormActions()

const SaleOrderTransformRequisition: React.FC<SaleOrderTransformRequisitionProps> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const fetchParams = useRef<any>({})
  const [outerStatusList, setOuterStatusList] = useState<any>()
  const [requisitioned, setRequisitioned] = useState<boolean>(false)
  const [totalCount, setTotalCount] = useState<number>(0)

  const fetchTableData = async (params) => {
    const { data } = await getOrderCommonPurchaseVendorOrderConvertPage(params)
    if (!requisitioned) {
      setTotalCount(data.totalCount)
    }
    return data
  }

  useEffect(() => {
    getOrderCommonOuterStatusDropItems().then((res) => {
      if (res.code === 1000) {
        const _list = [2, 3, 16, 100, 101, 102]
        setOuterStatusList(res.data.filter((item) => !_list.includes(item.id)))
      }
    })
  }, [])

  useEffect(() => {
    ref.current?.reload && ref.current?.reload?.()
  }, [requisitioned])

  const [selectRow, selectRowFns] = useRowSelectionTable({
    customKey: 'orderProductId',
  })

  const loadingTableData = (params) => {
    const _params = { ...params, requisitioned }
    fetchParams.current = _params
    return fetchTableData(_params)
  }

  const secondColumns = () => {
    const alreadyColumns = saleOrderTransformRequisitionColumns('saleOrderTransformRequisition.see')
    if (alreadyColumns) {
      return alreadyColumns.concat([
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
        {
          title: intl.formatMessage({
            id: 'purchaseRequisition.caozuo',
            defaultMessage: '操作',
          }),
          align: 'center',
          dataIndex: 'ctl',
          key: 'ctl',
          width: 128,
          fixed: 'right',
          render: (_, record) => (
            <AuthButton type="custom" code={'create'}>
              <Button
                type="link"
                onClick={() => {
                  handleTransform(record)
                }}
              >
                {intl.formatMessage({ id: 'purchaseOrder.createRequisition' })}
              </Button>
            </AuthButton>
          ),
        },
      ])
    }
  }

  const ControllerBtns = (
    <Space>
      <AuthButton type="custom" code={'createBatch'}>
        <Button
          type="primary"
          disabled={selectRowFns.selectedRowKeys.length <= 0}
          onClick={() => {
            handleTransform()
          }}
        >
          {intl.formatMessage({ id: 'purchaseOrder.batchCreatePurchaseRequisition' })}
        </Button>
      </AuthButton>
    </Space>
  )

  const onChange = (key: string) => {
    setRequisitioned(key === '1' ? true : false)
  }

  const handleTransform = (record?: any) => {
    let _list = []
    if (record) {
      _list = [{ ...record }]
    } else {
      _list = [...selectRowFns.selectRow]
    }
    postProductCommodityCommonCheckAssociatedMateriel({ orderSkuList: _list }).then((res) => {
      if (res.code === 1000) {
        selectRowFns.setSelectRow([])
        selectRowFns.setSelectedRowKeys([])
        const formData = res.data.map((item) => {
          return {
            ...item,
            id: item.materielId,
            code: item.materielCode,
            goodsGroup: item.materielGroup,
            type: item.spec,
          }
        })
        history.push('/procurementAbility/purchaseRequisition/readyAddBill/add', { rows: formData })
      }
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <Tabs defaultActiveKey="2" onChange={onChange}>
          <TabPane tab={intl.formatMessage({ id: 'common.text.all' })} key="1"></TabPane>
          <TabPane
            tab={`${intl.formatMessage({ id: 'purchaseOrder.notRequisitioned' })}${
              totalCount ? `(${totalCount})` : ''
            }`}
            key="2"
          ></TabPane>
        </Tabs>
        <StandardTable
          fetchTableData={(params) => loadingTableData(params)}
          columns={secondColumns()}
          currentRef={ref}
          rowSelection={selectRow}
          rowKey="orderProductId"
          controlRender={
            <NiceForm
              key="SaleOrderTransformRequisition"
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'orderNo', FORM_FILTER_PATH)
              }}
              schema={saleOrderTransformRequisitionSchema(outerStatusList)}
              components={{
                DateRangePickerUnix,
                Submit,
                controllerBtns: () => ControllerBtns,
              }}
              // expressionScope={{ controllerBtns: ControllerBtns() }}
            />
          }
          tableProps={{
            scroll: {
              x: '100%',
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

SaleOrderTransformRequisition.defaultProps = {}

export default SaleOrderTransformRequisition

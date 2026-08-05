import React, { useState, useRef, useCallback } from 'react'
import { Card, Button, Modal, message, Tooltip } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { baseOrderListColumns } from '../constant'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { tableListSchema } from '@/pages/orderAbility/constants/table-schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import styles from '../index.less'
import ModalForm from '@/components/ModalForm'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import TableOperation from '@/components/TableOperation'
import {
  MANUAL_MATERIAL_ORDER_TYPE,
  MATERIAL_SAMPLE_ORDER_TYPE,
  ORDER_TYPE2_BIDDING_CONTRACT,
  ORDER_TYPE2_CHANNEL_DIRECT,
  ORDER_TYPE2_CHANNEL_SPOT,
  ORDER_TYPE2_ENQUIRY_CONTRACT,
  ORDER_TYPE2_INQUIRY,
  ORDER_TYPE2_REQUISITION,
  ORDER_TYPE2_SPOT,
  ORDER_TYPE2_TENDER_CONTRACT,
  ORDER_TYPE_FRAMECONTRACT,
  ORDER_TYPE_POINTS,
  ORDER_TYPE_PRODUCESAMPLE,
  ORDER_TYPE_PURCHASE_REQUISITION_CONTRACT,
} from '@/constants/order'
import { authService } from '@apps/services'
import moment from 'moment'
import type { GetOrderBuyerPageResponseDetail } from '@apps/apis'
import {
  getOrderBuyerGetDeliveryTime,
  getOrderBuyerPage,
  postOrderBuyerCancel,
  postOrderBuyerPageDelete,
  postOrderBuyerRefund,
  postOrderBuyerUpdateDeliveryTime,
  getOrderBuyerExport,
} from '@apps/apis'
import SaleAfter from '../components/saleAfter'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { COLUMNS_LARGE_WIDTH } from '@/constants/table'
import type { CustomColumnsConfigureRef } from '@/components/SortableTableHeader'
import SortableTableHeader, { useSortableColumns, CustomColumnsConfigure } from '@/components/SortableTableHeader'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { exportFile } from '@apps/utils'
import { dateLocale } from '@/components/NiceForm/utils/locale'
import { useWebIntl } from '@apps/locales'
// 订单查询

export interface PurchaseOrderProps {}

const fetchTableData = async (params) => {
  const { data } = await getOrderBuyerPage(params)
  return data
}

const formActions = createFormActions()
const destroyActions = createFormActions()
const adjustActions = createFormActions()

const PurchaseOrder: React.FC<PurchaseOrderProps> = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const [saleVisible, setSaleVisible] = useState<any>(false)
  const [checkedId, setCheckedId] = useState<any>()
  const [recordId, setRecordId] = useState<any>()
  const [orderType, setOrderType] = useState<any>()
  const ref = useRef<any>({})
  const destoryRef = useRef<any>({})
  const adjustRef = useRef<any>({})
  const { run, loading } = useHttpRequest(postOrderBuyerCancel)
  const [showDataSource, setShowDataSource] = useState([
    { id: 1, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName1' }) },
    { id: 2, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName2' }) },
    { id: 3, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName3' }) },
  ])

  /** 变更订单 */
  const handleOrderedit = (record) => {
    switch (record?.orderType) {
      case ORDER_TYPE2_INQUIRY:
        history.push(`/orderAbility/purchaseOrder/readyAddB2bOrder/edit?id=${record?.orderId}`)
        break
      case ORDER_TYPE2_SPOT:
      case ORDER_TYPE2_CHANNEL_DIRECT:
      case ORDER_TYPE2_CHANNEL_SPOT:
      case ORDER_TYPE_PRODUCESAMPLE:
        history.push(`/orderAbility/purchaseOrder/readyAddCashOrder/edit?id=${record?.orderId}`)
        break
      case ORDER_TYPE2_ENQUIRY_CONTRACT:
      case ORDER_TYPE2_TENDER_CONTRACT:
      case ORDER_TYPE2_BIDDING_CONTRACT:
      case ORDER_TYPE_PURCHASE_REQUISITION_CONTRACT:
      case ORDER_TYPE_FRAMECONTRACT:
        history.push(`/orderAbility/purchaseOrder/readyAddSrmOrder/edit?id=${record?.orderId}`)
        break
      case ORDER_TYPE2_REQUISITION:
        history.push(`/orderAbility/purchaseOrder/readyAddRequisitionOrder/edit?id=${record?.orderId}`)
        break
      case MANUAL_MATERIAL_ORDER_TYPE:
      case MATERIAL_SAMPLE_ORDER_TYPE:
        history.push(`/orderAbility/purchaseOrder/readyAddMaterialOrder/edit?id=${record?.orderId}`)
        break
    }
  }

  const handleAdjust = async (record) => {
    adjustRef.current.setVisible(true)
    const { code, data: _data } = await getOrderBuyerGetDeliveryTime({
      shopId: record.shopId,
      orderId: record.orderId,
    })
    if (code === 1000) {
      adjustActions.setFieldValue('orderId', record.orderId)
      adjustActions.setFieldValue('reason', _data.reason)
      if (_data.deliverDate) {
        adjustActions.setFieldValue(
          'deliverDate',
          moment(_data.deliverDate).format(_data.deliveryTime ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'),
        )
      }
      adjustActions.setFieldState('deliverDate', (state) => {
        state.props['x-component-props'].disabledDate = (current) => {
          // 有预约天数
          if (_data.appointmentDay && _data?.days) {
            return current && (current < moment().startOf('day') || current > moment().add(_data.days, 'days'))
          } else {
            return current && current < moment().startOf('day')
          }
        }
        if (_data.deliveryTime) {
          // 有时间段 时间控件不显示时分
          state.props['x-component-props'].showTime = false
          state.props['x-component-props'].format = 'YYYY-MM-DD'
        } else {
          state.props['x-component-props'].showTime = true
          state.props['x-component-props'].format = 'YYYY-MM-DD HH:mm'
        }
      })
      adjustActions.setFieldState('timeLine', (prevState) => {
        prevState.visible = _data.deliveryTime
        if (_data.paramList?.length) {
          prevState.props.enum = _data.paramList.map((item) => ({
            label: `${item.startTime}-${item.endTime}`,
            value: `${item.startTime}-${item.endTime}`,
          }))
        } else {
          prevState.visible = false
        }
      })
      if (_data.deliveryTime && _data.deliverPeriod) {
        adjustActions.setFieldValue('timeLine', _data.deliverPeriod)
      }
    }
  }

  const handleEvaluate = (_id) => {
    console.log(_id)
    history.push(`/orderAbility/purchaserEvaluation/unevaluated`)
  }

  const handleCancel = async (id) => {
    destoryRef.current.setVisible(true)
    destroyActions.reset()
    destroyActions.setFieldValue('orderId', id)
  }

  const handleRefund = (r) => {
    const { orderId } = r
    Modal.confirm({
      title: intl.formatMessage({ id: 'purchaseOrder.handle.title1' }),
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk() {
        postOrderBuyerRefund({ orderId }).then(({ code }) => {
          if (code === 1000) {
            ref.current.reloadCurrent()
          }
        })
      },
    })
  }

  const handleDelete = (r) => {
    const { orderId } = r
    Modal.confirm({
      title: intl.formatMessage({ id: 'purchaseOrder.handle.title2' }),
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk() {
        postOrderBuyerPageDelete({ orderId }).then(({ code }) => {
          if (code === 1000) {
            ref.current.reloadCurrent()
          }
        })
      },
    })
  }
  // 售后唤起弹窗
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleSaleAfter = ({ orderId, orderType }) => {
    setSaleVisible(true)
    setRecordId(orderId)
    setOrderType(orderType)
    if (orderType === ORDER_TYPE_POINTS) {
      setShowDataSource(() => [{ id: 1, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName1' }) }])
    } else {
      setShowDataSource(() => [
        { id: 1, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName1' }) },
        { id: 2, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName2' }) },
        { id: 3, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName3' }) },
      ])
    }
  }

  const handleConfirmContract = (record) => {
    // message.loading(translate("web.resource.contract.zhengzaiqingqiuhetong"))
    // postOrderBuyerConfirmSignature({
    // 	orderId: record?.orderId,
    // }).then((res) => {
    // 	if (res.code === 1000) {
    // 		message.destroy();
    // 		Modal.confirm({
    // 			title: translate("web.resource.contract.qingqiuhetongwanchengshifoutiaozhuan"),
    // 			onOk: () => {
    // 				window.open(res.data)
    // 			},
    // 		});
    // 	}
    // });
  }

  /** 参照后台数据生成 */
  const renderOptionButton = (record: any) => {
    const buttonGroup = {
      [translate('web.common.biangeng')]: record?.showChange,
      [intl.formatMessage({ id: 'purchaseOrder.operation1', defaultMessage: '取消订单' })]: record.showCancel,
      [intl.formatMessage({ id: 'purchaseOrder.operation2', defaultMessage: '售后' })]: record.showAfterSales,
      [intl.formatMessage({ id: 'purchaseOrder.operation3', defaultMessage: '评价' })]: record.showComment,
      [intl.formatMessage({ id: 'purchaseOrder.operation4', defaultMessage: '调整送货时间' })]:
        record.showModifyDeliverTime,
      [intl.formatMessage({ id: 'purchaseOrder.operation6', defaultMessage: '退款' })]: record.showRefund,
      [intl.formatMessage({ id: 'purchaseOrder.operation7', defaultMessage: '删除' })]: record.showDelete,
      [translate('web.resource.order.querendianzihetong')]: record.showConfirmContract,
      [translate('web.resource.order.qianshudianzihetong')]: record.showConfirmSignContract,
    }

    const operationHandler = {
      [translate('web.common.biangeng')]: () => handleOrderedit(record),
      [intl.formatMessage({ id: 'purchaseOrder.operation1' })]: () => handleCancel(record.orderId),
      [intl.formatMessage({ id: 'purchaseOrder.operation2' })]: () => handleSaleAfter(record),
      [intl.formatMessage({ id: 'purchaseOrder.operation3' })]: () => handleEvaluate(record.orderId),
      [intl.formatMessage({ id: 'purchaseOrder.operation4' })]: () => handleAdjust(record),
      [intl.formatMessage({ id: 'purchaseOrder.operation6' })]: () => handleRefund(record),
      [intl.formatMessage({ id: 'purchaseOrder.operation7' })]: () => handleDelete(record),
      [translate('web.resource.order.querendianzihetong')]: () => handleConfirmContract(record),
      [translate('web.resource.order.qianshudianzihetong')]: () => handleConfirmContract(record),
    }

    const buttonPermissionsMap = {
      [translate('web.common.biangeng')]: 'edit',
      [intl.formatMessage({ id: 'purchaseOrder.operation1' })]: 'cancel',
      [intl.formatMessage({ id: 'purchaseOrder.operation2' })]: 'after',
      [intl.formatMessage({ id: 'purchaseOrder.operation3' })]: 'unevaluated',
      [intl.formatMessage({ id: 'purchaseOrder.operation4' })]: 'adjust',
      [intl.formatMessage({ id: 'purchaseOrder.operation6' })]: 'refund',
      [intl.formatMessage({ id: 'purchaseOrder.operation7' })]: 'delete',
      [translate('web.resource.order.querendianzihetong')]: 'confirmContract',
      [translate('web.resource.order.qianshudianzihetong')]: 'signContract',
    }
    return (
      <TableOperation
        buttonTextFieldMap={buttonGroup}
        operationHandler={operationHandler}
        buttonPermissionsMap={buttonPermissionsMap}
      />
    )
  }

  const secondColumns = () => {
    const alreadyColumns = baseOrderListColumns()
    if (alreadyColumns) {
      alreadyColumns.splice(6, 0, {
        title: intl.formatMessage({ id: 'purchaseOrder.addressTitle' }),
        dataIndex: 'deliverAddress',
        key: 'deliverAddress',
        ellipsis: true,
        width: COLUMNS_LARGE_WIDTH,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      })
      return alreadyColumns.concat([
        {
          title: intl.formatMessage({ id: 'purchaseOrder.operation' }),
          width: 192,
          dataIndex: 'ctl',
          key: 'ctl',
          render: (text, record) => renderOptionButton(record),
          fixed: 'right',
        },
      ])
    }
  }

  const [columns, setColumns] = useSortableColumns<GetOrderBuyerPageResponseDetail>(secondColumns(), false)

  const fetchParams = useRef<any>({})
  const customColumnsConfigureRef = useRef<CustomColumnsConfigureRef | null>(null)
  const { accessToken } = authService.getAuth() || {}

  const loadingTableData = (params) => {
    fetchParams.current = { ...params }
    return fetchTableData(params)
  }

  const handleOk = () => {
    if (checkedId) {
      switch (checkedId) {
        case 1:
          history.push(
            `/afterAbility/exchangeApplication/exchangePrSubmit/add?orderId=${recordId}&orderType=${orderType}`,
          )
          break
        case 2:
          history.push(`/afterAbility/returnApplication/returnPrSubmit/add?orderId=${recordId}&orderType=${orderType}`)
          break
        case 3:
          history.push(`/afterAbility/repairApplication/repairPrSubmit/add?orderId=${recordId}&orderType=${orderType}`)
          break
      }
    } else {
      message.error(intl.formatMessage({ id: 'purchaseOrder.error' }))
    }
  }

  // 提交取消
  const handleSubmit = useCallback(() => {
    destroyActions.submit().then(async ({ values }: any) => {
      const result = await run(values)
      if (result.code === 1000) {
        destroyActions.reset()
        destoryRef.current.setVisible(false)
        setTimeout(() => {
          ref.current.reloadCurrent()
        }, 800)
      }
    })
  }, [])

  const handleExport = async () => {
    const p = { ...fetchParams.current }
    delete p.current
    delete p.pageSize
    let exportParams = ''
    Object.keys(p).forEach((item) => {
      if (p[item]) {
        exportParams += `&${item}=${p[item]}`
      }
    })

    exportFile(getOrderBuyerExport, exportParams)
  }

  const handleSubmitAdjust = () => {
    adjustActions.submit().then(async ({ values }: any) => {
      const params = { ...values }
      if (values?.timeLine) {
        params.deliverPeriod = `${params.deliverDate} ${params.timeLine}`
      } else {
        params.deliverPeriod = params.deliverDate
      }
      const result = await postOrderBuyerUpdateDeliveryTime(params)
      if (result.code === 1000) {
        adjustActions.reset()
        adjustRef.current.setVisible(false)
        setTimeout(() => {
          ref.current.reloadCurrent()
        }, 800)
      }
    })
  }

  const resetAdjustSelect = () => {
    adjustActions.reset()
  }

  const controllerBtns = (
    <AuthButton type="custom" code="export">
      <Button style={{ width: 140 }} onClick={handleExport} type="default">
        {intl.formatMessage({ id: 'purchaseOrder.export' })}
      </Button>
    </AuthButton>
  )

  const EnhanceCustomColumnsConfigure = useCallback(
    () => (
      <CustomColumnsConfigure
        defaultColumns={columns}
        onConfirm={(newColumns) => setColumns(newColumns)}
        ref={customColumnsConfigureRef}
      />
    ),
    [],
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => loadingTableData(params)}
          columns={columns}
          currentRef={ref}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              expressionScope={{
                controllerBtns,
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'orderNo', FORM_FILTER_PATH)
              }}
              schema={tableListSchema()}
              components={{
                DateRangePickerUnix,
                Submit,
                EnhanceCustomColumnsConfigure,
              }}
            />
          }
          tableProps={{
            rowKey: 'orderNo',
            scroll: { x: 1200 },
            components: {
              header: {
                row: SortableTableHeader.DraggableHeaderRow,
                cell: SortableTableHeader.DraggableHeaderCell,
              },
            },
            onHeaderRow: (internalColumns, index) => ({
              columns: internalColumns,
              index,
              setColumns,
            }),
          }}
        />
      </Card>
      <SaleAfter
        visible={saleVisible}
        showDataSource={showDataSource}
        currentSelectedKey={checkedId}
        onOk={handleOk}
        onCancel={() => setSaleVisible(false)}
        onClickItem={(id) => setCheckedId(id)}
      />
      <ModalForm
        modalTitle={intl.formatMessage({ id: 'purchaseOrder.modalTitle2' })}
        currentRef={destoryRef}
        confirm={handleSubmit}
        actions={destroyActions}
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
                  title: intl.formatMessage({ id: 'purchaseOrder.schemaTitle1' }),
                  visible: false,
                },
                reason: {
                  type: 'textarea',
                  'x-component-props': {
                    rows: 4,
                    placeholder: intl.formatMessage({ id: 'purchaseOrder.schemaPlaceholder1' }),
                  },
                  title: intl.formatMessage({ id: 'purchaseOrder.schemaTitle2' }),
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'purchaseOrder.message1' }),
                    },
                    {
                      limitByte: true,
                      maxByte: 100,
                    },
                  ],
                },
              },
            },
          },
        }}
        modalProps={{ confirmLoading: loading }}
      />
      {/* 调整送货时间 */}
      <ModalForm
        modalTitle={intl.formatMessage({ id: 'purchaseOrder.modalTitle3' })}
        currentRef={adjustRef}
        confirm={handleSubmitAdjust}
        cancel={resetAdjustSelect}
        actions={adjustActions}
        // className={styles.adjustModal}
        schema={{
          type: 'object',
          properties: {
            NO_SUBMIT: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelAlign: 'top',
                labelCol: 5,
              },
              properties: {
                orderId: {
                  type: 'number',
                  title: intl.formatMessage({ id: 'purchaseOrder.schemaTitle1' }),
                  visible: false,
                },
                deliverDate: {
                  type: 'string',
                  'x-component': 'date',
                  title: intl.formatMessage({ id: 'purchaseOrder.schemaTitle3' }),
                  required: true,
                  'x-component-props': {
                    // disabledDate: current => {
                    //   return current && current < moment().startOf('day')
                    // },
                    // showTime: true,
                    // format: 'YYYY-MM-DD HH:mm',
                    style: { width: '100%' },
                    locale: dateLocale(),
                  },
                },
                timeLine: {
                  title: intl.formatMessage({ id: 'purchaseOrder.schemaTitle4' }),
                  type: 'radio',
                  enum: [],
                  'x-component-props': {
                    disabled: false,
                    optionType: 'button',
                    className: styles.adjustFormItem,
                  },
                },
                reason: {
                  type: 'textarea',
                  'x-component-props': {
                    rows: 4,
                    placeholder: intl.formatMessage({ id: 'purchaseOrder.schemaPlaceholder1' }),
                  },
                  title: intl.formatMessage({ id: 'purchaseOrder.schemaTitle5' }),
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'purchaseOrder.message1' }),
                    },
                    {
                      limitByte: true,
                      maxByte: 100,
                    },
                  ],
                },
              },
            },
          },
        }}
        effects={($) => {
          $('onFormInit').subscribe(() => {})
        }}
      />
    </PageHeaderWrapper>
  )
}

PurchaseOrder.defaultProps = {}

export default PurchaseOrder

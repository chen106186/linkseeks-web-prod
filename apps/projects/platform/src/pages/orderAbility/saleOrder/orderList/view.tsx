/* eslint-disable */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Card, Button, Space, message, Modal, Form, Row, Col, Input, Spin, Radio, Tooltip, Switch } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { baseOrderListColumns, useTransformOrderTable } from '../constant'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { saleTableListSchema as tableListSchema } from '@/pages/orderAbility/constants/table-schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import Submit from '@/components/NiceForm/components/Submit'
import NiceForm from '@/components/NiceForm'
import { createFormActions, registerVirtualBox } from '@apps/formily'
import ModalForm from '@/components/ModalForm'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import TableOperation from '@/components/TableOperation'
import { authService } from '@apps/services'
import styles from '../index.less'
import QRCode from 'qrcode'
import { MEMBER_ROLE_TYPE_SERVICE_CONSUMER } from '@/constants/member'
import {
  getOrderVendorGeneratePayLink,
  getOrderVendorMiniAppCode,
  getOrderVendorPage,
  GetOrderVendorPageResponseDetail,
  postOrderVendorCancel,
  postOrderVendorTerminate,
  postOrderVendorTransfer,
  postOrderVendorTransferPreview,
  getOrderVendorExport,
  getOrderVendorProductExport,
} from '@apps/apis'
import appImg from '@/assets/icons/app.png'
import miniappImg from '@/assets/icons/miniapp.png'
import scanImg from '@/assets/icons/scan.png'
import { h5PageAddressByScan } from '@/constants/order'
import useAgentInfo from '../agentPurchaseOrder/hooks/useAgentInfo'
import { COLUMNS_LARGE_WIDTH, COLUMNS_ACTION_WIDTH } from '@/constants/table'
import SortableTableHeader, {
  useSortableColumns,
  CustomColumnsConfigure,
  CustomColumnsConfigureRef,
} from '@/components/SortableTableHeader'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { exportFile } from '@apps/utils'
import { useWebIntl } from '@apps/locales'
import UploadContract from '../components/uploadContract'
import useAccess from '@apps/services/auth/useAccess'
import { downFileByBuffer } from '@/utils/index'

// 销售订单查询

export interface SaleOrderProps {}

// 订单来源商城类型
export const WED = 1
export const H5 = 2
export const MINIAPP = 3
export const APP = 4

// 单来源商城类型对应字符
export const ORDER_SHOP_ORIGIN_MAP = {
  [WED]: 'web',
  [H5]: 'h5',
  [MINIAPP]: 'miniapp',
  [APP]: 'app',
}

const SALE_ORDER_EXPORT_LOCK_KEY = 'sale_order_list_export_lock'
const SALE_ORDER_EXPORT_LOCK_EXPIRE_TIME = 10 * 60 * 1000

const getSaleOrderExportLock = () => {
  try {
    const lockText = window.localStorage.getItem(SALE_ORDER_EXPORT_LOCK_KEY)
    if (!lockText) {
      return null
    }
    const lock = JSON.parse(lockText)
    if (!lock?.expireTime || lock.expireTime <= Date.now()) {
      window.localStorage.removeItem(SALE_ORDER_EXPORT_LOCK_KEY)
      return null
    }
    return lock
  } catch (error) {
    window.localStorage.removeItem(SALE_ORDER_EXPORT_LOCK_KEY)
    return null
  }
}

const hasSaleOrderExportLock = () => Boolean(getSaleOrderExportLock())

const setSaleOrderExportLock = () => {
  window.localStorage.setItem(
    SALE_ORDER_EXPORT_LOCK_KEY,
    JSON.stringify({
      createTime: Date.now(),
      expireTime: Date.now() + SALE_ORDER_EXPORT_LOCK_EXPIRE_TIME,
    }),
  )
}

const clearSaleOrderExportLock = () => {
  window.localStorage.removeItem(SALE_ORDER_EXPORT_LOCK_KEY)
}

const fetchTableData = async (params) => {
  const { data } = await getOrderVendorPage(params)
  return data
}

const formActions = createFormActions()
const destroyActions = createFormActions()
const pauseActions = createFormActions()
const transformActions = createFormActions()

const SaleOrder: React.FC<SaleOrderProps> = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const { pathname } = useLocation()
  const ref = useRef<any>({})
  const destoryRef = useRef<any>({})
  const pauseRef = useRef<any>({})
  const orderIds = useRef<number[]>([])
  const [pageLoading, setPageLoding] = useState<boolean>(false)
  const [payChartVisible, setPayChartVisible] = useState<boolean>(false)
  const [payForm] = Form.useForm()
  const [payModel, setPayModel] = useState<'web' | 'app' | 'miniapp' | null>('web')
  const currentPayRef = useRef<any>({})
  const [qrCode, setQrCode] = useState('')
  const [transformLoading, setTransformLoading] = useState<boolean>(false)
  const [exportLoading, setExportLoading] = useState<boolean>(() => hasSaleOrderExportLock())
  const [confirmContract, setConfirmContract] = useState<boolean>(false)
  const [selectOrderId, setSelectOrderId] = useState<number>()
  const { run, loading } = useHttpRequest(postOrderVendorCancel)
  const { run: runPause, loading: loadingEnd } = useHttpRequest(postOrderVendorTerminate)
  const { transformRef, orderColumns } = useTransformOrderTable(transformActions)

  const { handleAccess } = useAccess()
  const [btnIsTransfer, setBtnIsTransfer] = useState<boolean>(handleAccess('transfer'))

  // 提交取消
  const handleSubmit = () => {
    destroyActions.submit().then(async ({ values }: any) => {
      const result = await run({
        orderId: values.id || cancelId.current,
        reason: values.cancelReason,
      })
      if (result.code === 1000) {
        destroyActions.reset()
        destoryRef.current.setVisible(false)
        setTimeout(() => {
          ref.current.reloadCurrent()
        }, 800)
      }
    })
  }

  // 提交中止
  const handleSubmitPause = () => {
    pauseActions.submit().then(async ({ values }: any) => {
      const result = await runPause({ orderId: values.id, reason: values.auditOpinion })
      if (result.code === 1000) {
        pauseRef.current.setVisible(false)
        setTimeout(() => {
          ref.current.reloadCurrent()
        }, 800)
      }
    })
  }

  const handleEvaluate = () => {
    history.push(`/orderAbility/supplierEvaluation/unevaluated`)
  }

  const handleModifyPrice = (record) => {
    history.push(`${pathname}/detail?id=${record.orderId}&modifyPrice=true`)
  }

  const handleModifyOrder = async (record) => {
    setPageLoding(true)
    await dispatchByOrder({
      shopId: record.shopId,
      buyerMemberId: record.buyerMemberId,
      buyerMemberName: record.buyerMemberName,
      buyerRoleId: record.buyerRoleId,
      orderId: record.orderId,
    })
    setPageLoding(false)
  }

  // 单个转单 传入默认第一个角色
  const onlyTransform = (orderId) => {
    if (!serversRoles.length) {
      return message.error(
        intl.formatMessage({
          id: 'saleOrder.dangqiandengluhui',
          defaultMessage: '当前登录会员，无服务消费者角色，无法进行转单',
        }),
      )
    }
    handelTransformOrder(serversRoles[0]?.roleId, orderId)
    transformActions.setFieldValue('orderId', orderId)
  }

  const generatePayChart = (record) => {
    getOrderVendorGeneratePayLink({ orderId: record.orderId }).then(({ data }) => {
      currentPayRef.current = data
      setPayChartVisible(true)
    })
  }

  // 上传合同弹窗
  const fnUpContract = (value) => {
    setSelectOrderId(value.orderId)
    setConfirmContract(true)
  }

  /**
   * 确认签署合同
   * @param record
   */
  const fnConfirmContract = (record) => {
    // message.loading(translate("web.resource.contract.zhengzaiqingqiuhetong"))
    // postOrderVendorConfirmSignature({
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
  const renderOptionButton = (record) => {
    const buttonGroup = {
      // ['发货']: record?.innerStatus === 118 && record?.outerStatus === 11, // 内外部为待确认发货
      [intl.formatMessage({ id: 'saleOrder.zhuandan', defaultMessage: '转单' })]: record.showTransfer,
      // ['转请购单']: record?.innerStatus === 118 && record?.outerStatus === 11, // 内外部为待确认发货,
      [intl.formatMessage({ id: 'saleOrder.quxiaodingdan', defaultMessage: '取消订单' })]: record.showCancel,
      [intl.formatMessage({ id: 'saleOrder.zhongzhi', defaultMessage: '中止' })]: record.showTerminate,
      [intl.formatMessage({ id: 'saleOrder.pingjia', defaultMessage: '评价' })]: record.showComment,
      [intl.formatMessage({ id: 'saleOrder.xiugaidingdanjia', defaultMessage: '修改订单价格' })]:
        record.showModifyPrice,
      [intl.formatMessage({ id: 'saleOrder.xiugaidingdan', defaultMessage: '修改订单' })]: record.showModifyOrder,
      [intl.formatMessage({ id: 'saleOrder.shengchengzhifulian', defaultMessage: '生成支付链接' })]:
        record.showGeneratePayLink,
      [intl.formatMessage({ id: 'saleOrder.shangchuanhetong', defaultMessage: '上传合同' })]: record.showUploadContract,
      [intl.formatMessage({ id: 'saleOrder.querenqianshuhetong', defaultMessage: '确认签署合同' })]:
        record.showConfirmSignContract,
    }

    const operationHandler = {
      // ['发货']: () => {},
      [intl.formatMessage({ id: 'saleOrder.zhuandan', defaultMessage: '转单' })]: () => onlyTransform(record.orderId),
      // ['转请购单']: () => {},
      [intl.formatMessage({ id: 'saleOrder.quxiaodingdan', defaultMessage: '取消订单' })]: () => handleCancel(record),
      [intl.formatMessage({ id: 'saleOrder.zhongzhi', defaultMessage: '中止' })]: () => handleSuspend(record),
      [intl.formatMessage({ id: 'saleOrder.pingjia', defaultMessage: '评价' })]: () => handleEvaluate(),
      [intl.formatMessage({ id: 'saleOrder.xiugaidingdanjia', defaultMessage: '修改订单价格' })]: () =>
        handleModifyPrice(record),
      [intl.formatMessage({ id: 'saleOrder.xiugaidingdan', defaultMessage: '修改订单' })]: () =>
        handleModifyOrder(record),
      [intl.formatMessage({ id: 'saleOrder.shengchengzhifulian', defaultMessage: '生成支付链接' })]: () =>
        generatePayChart(record),
      [intl.formatMessage({ id: 'saleOrder.shangchuanhetong', defaultMessage: '上传合同' })]: () =>
        fnUpContract(record),
      [intl.formatMessage({ id: 'saleOrder.querenqianshuhetong', defaultMessage: '确认签署合同' })]: () =>
        fnConfirmContract(record),
    }

    const buttonPermissionsMap = {
      // ['发货']: 'DevTest',
      [intl.formatMessage({ id: 'saleOrder.zhuandan', defaultMessage: '转单' })]: 'transfer',
      // ['转请购单']: 'DevTest',
      [intl.formatMessage({ id: 'saleOrder.quxiaodingdan', defaultMessage: '取消订单' })]: 'cancel',
      [intl.formatMessage({ id: 'saleOrder.zhongzhi', defaultMessage: '中止' })]: 'suspend',
      [intl.formatMessage({ id: 'saleOrder.pingjia', defaultMessage: '评价' })]: 'evaluate',
      [intl.formatMessage({ id: 'saleOrder.xiugaidingdanjia', defaultMessage: '修改订单价格' })]: 'modifyPrice',
      [intl.formatMessage({ id: 'saleOrder.xiugaidingdan', defaultMessage: '修改订单' })]: 'modifyOrder',
      [intl.formatMessage({ id: 'saleOrder.shengchengzhifulian', defaultMessage: '生成支付链接' })]: 'generatePayChart',
      [intl.formatMessage({ id: 'saleOrder.shangchuanhetong', defaultMessage: '上传合同' })]: 'uploadContract',
      [intl.formatMessage({ id: 'saleOrder.querenqianshuhetong', defaultMessage: '确认签署合同' })]: 'confirmContract',
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
        title: intl.formatMessage({ id: 'saleOrder.songhuodizhi', defaultMessage: '送货地址' }),
        dataIndex: 'deliverAddress',
        key: 'deliverAddress',
        ellipsis: true,
        width: COLUMNS_LARGE_WIDTH,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      })
      return alreadyColumns.concat([
        {
          title: translate('web.resource.afterAbility.shouhouqingkuang'),
          dataIndex: 'afterSaleStatus',
          key: 'afterSaleStatus',
          fixed: 'right',
          width: COLUMNS_ACTION_WIDTH,
          render: (text) => {
            switch (text) {
              case 0:
                return translate('web.resource.afterAbility.weishouhou')
              case 1:
                return translate('web.resource.afterAbility.bufenshouhou')
              case 2:
                return translate('web.resource.afterAbility.quanbushouhou')
            }
          },
        },
        {
          title: intl.formatMessage({ id: 'saleOrder.caozuo', defaultMessage: '操作' }),

          dataIndex: 'ctl',
          key: 'ctl',
          render: (_text, record) => renderOptionButton(record),
          fixed: 'right',
          width: COLUMNS_ACTION_WIDTH,
        },
      ])
    }
  }

  const [columns, setColumns] = useSortableColumns<GetOrderVendorPageResponseDetail>(secondColumns(), true)

  const { roles, accessToken } = authService.getAuth() || {}
  const serversRoles = roles.filter((item) => item['roleType'] === MEMBER_ROLE_TYPE_SERVICE_CONSUMER)

  const fetchParams = useRef<any>({})
  const cancelId = useRef()
  const customColumnsConfigureRef = useRef<CustomColumnsConfigureRef | null>(null)

  const { dispatchByOrder } = useAgentInfo()

  const loadingTableData = (params) => {
    fetchParams.current = { ...params }
    return fetchTableData(params)
  }

  useEffect(() => {
    const syncExportLock = () => {
      setExportLoading(hasSaleOrderExportLock())
    }
    const timer = window.setInterval(syncExportLock, 1000)
    window.addEventListener('storage', syncExportLock)
    syncExportLock()
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('storage', syncExportLock)
    }
  }, [])

  useEffect(() => {
    if (payModel === 'web') {
      payForm.setFieldsValue({
        payChart: `${window.location.origin}/orderAbility/purchaseOrder/readyPayOrder/edit?id=${currentPayRef.current.orderId}`,
      })
    } else if (payModel === 'app') {
      // 生成二维码
      QRCode.toDataURL(`${h5PageAddressByScan}?path=MycommodityDetails&orderId=${currentPayRef.current.orderId}`)
        .then((url: any) => {
          setQrCode(url)
        })
        .catch((err: any) => {
          console.error(err)
        })
    } else if (payModel === 'miniapp') {
      getOrderVendorMiniAppCode({ orderId: currentPayRef.current.orderId + '' }).then((res) => {
        setQrCode(res.data)
      })
    }
  }, [payModel, currentPayRef.current])

  const onSave = () => {
    const img: any = document.getElementById('qrcodeElement')
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height)
    const url = canvas.toDataURL('image/png')
    const downloadLink = document.getElementById('downloadLink')
    downloadLink.setAttribute('href', url)

    downloadLink.setAttribute(
      'download',
      `${intl.formatMessage({ id: 'saleOrder.daochuerweima', defaultMessage: '导出二维码' })}.png`,
    )
    downloadLink.click()
  }

  const copyHandle = (content) => {
    const copy = (e) => {
      e.preventDefault()
      e.clipboardData.setData('text/plain', content)
      message.success(intl.formatMessage({ id: 'saleOrder.fuzhichenggong', defaultMessage: '复制成功' }))
      document.removeEventListener('copy', copy)
    }
    document.addEventListener('copy', copy)
    document.execCommand('Copy')
  }

  const handleCopy = () => {
    const content = payForm.getFieldValue('payChart')
    copyHandle(content)
  }

  const handleCancel = (r) => {
    destoryRef.current.setVisible(true)
    destroyActions.setFieldValue('id', r.orderId)
    cancelId.current = r.orderId
  }

  const handleSuspend = (r) => {
    pauseRef.current.setVisible(true)
    pauseActions.setFieldValue('id', r.orderId)
    pauseActions.setFieldValue('state', 1)
  }

  const [selectedKeys, setSelectedKeys] = useState<number[]>([])
  const selectRef = useRef([])
  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys) => {
      setSelectedKeys(selectedRowKeys)
      selectRef.current = selectedRowKeys
    },
    getCheckboxProps: (record) => ({
      disabled: !record.showTransfer && btnIsTransfer,
      name: record.name,
    }),
  }

  // 转单调接口逻辑
  const handelTransformOrder = async (defaultRoleId, orderId?) => {
    orderIds.current = selectRef.current.length ? selectRef.current : orderId ? [orderId] : []
    if (orderId) {
      const { code, data } = await postOrderVendorTransferPreview({
        roleId: defaultRoleId,
        orderIds: [orderId],
      })
      if (code === 1000) {
        transformRef.current.setVisible(true)
        transformActions.setFieldValue('orders', data)
        transformActions.setFieldState('NOT_SUBMIT_TITLE', (prevState) => {
          prevState.props['x-component-props'].number = 1
        })
      }
    } else if (selectRef.current.length) {
      const { code, data } = await postOrderVendorTransferPreview({
        roleId: defaultRoleId,
        orderIds: selectRef.current,
      })
      if (code === 1000) {
        transformRef.current.setVisible(true)
        transformActions.setFieldValue('orders', data)
        transformActions.setFieldState('NOT_SUBMIT_TITLE', (prevState) => {
          prevState.props['x-component-props'].number = selectRef.current.length
        })
      }
    } else {
      return message.error(
        intl.formatMessage({
          id: 'saleOrder.qingxuanzexuyao',
          defaultMessage: '请选择需要转单的订单',
        }),
      )
    }
  }

  // 批量转
  const batchTransform = () => {
    if (!serversRoles.length) {
      return message.error(
        intl.formatMessage({
          id: 'saleOrder.dangqiandengluhui',
          defaultMessage: '当前登录会员，无服务消费者角色，无法进行转单',
        }),
      )
    }
    handelTransformOrder(serversRoles[0]?.roleId)
    transformActions.setFieldValue('orderId', null)
  }

  const resetRoleSelect = () => {
    transformActions.setFieldValue('roleId', serversRoles[0]?.roleId)
    transformActions.setFieldState('NOT_SUBMIT_TITLE', (prevState) => {
      prevState.props['x-component-props'].roleName = serversRoles[0]?.roleName
    })
  }

  const handleSubmitTransform = () => {
    setTransformLoading(true)
    transformActions.submit((values) => {
      const { roleId, orders } = values
      postOrderVendorTransfer({ roleId, orderIds: orders.map((item) => item.orderId) }).then((res) => {
        if (res.code === 1000) {
          setSelectedKeys([])
          resetRoleSelect()
          transformRef.current.setVisible(false)
          setTimeout(() => {
            ref.current.reloadCurrent()
          }, 800)
        }
        setTransformLoading(false)
      })
    })
  }

  const handleExport = async () => {
    if (hasSaleOrderExportLock()) {
      setExportLoading(true)
      message.warning('销售订单正在导出，请等待下载完成后再试')
      return
    }

    Modal.confirm({
      title: '确认导出',
      content: '将按当前查询条件导出销售订单。导出完成前请勿重复点击或刷新页面。',
      okText: '确认导出',
      cancelText: '取消',
      onOk: async () => {
        if (hasSaleOrderExportLock()) {
          setExportLoading(true)
          message.warning('销售订单正在导出，请等待下载完成后再试')
          return
        }
        const p = { ...fetchParams.current }
        delete p.current
        delete p.pageSize
        setSaleOrderExportLock()
        setExportLoading(true)
        try {
          await exportFile(getOrderVendorExport, p)
        } catch (error) {
          message.error('导出失败，请稍后重试')
        } finally {
          clearSaleOrderExportLock()
          setExportLoading(false)
        }
      },
    })
  }

  //导出订单商品清单
  const ExportOrderItems = () => {
    if (selectRef.current.length > 5000) {
      message.warning(intl.formatMessage({ id: 'balance.export.quantity.limit' }))
      return
    }

    const values = selectRef.current.length ? { orderIdList: selectRef.current } : formActions.getFormState().values
    console.log(values, 'valuesvaluesvalues')

    getOrderVendorProductExport(values, { responseType: 'blob', getResponse: true }).then((res: any) => {
      const { response } = res
      if (response.status == 200) {
        const suffixName = response.headers.get('content-disposition').split('.')[1]
        const fileName = `销售订单查询.${suffixName}`
        downFileByBuffer(response.data, fileName)
      }
    })
  }

  const onChangePayModel = (e) => {
    setPayModel(e.target.value)
    setQrCode('')
  }

  const controllerBtns = (
    <Space>
      <AuthButton type="custom" code="export">
        <Tooltip title={exportLoading ? '销售订单正在导出，请等待下载完成后再试' : ''}>
          <span>
            <Button
              style={{ width: 140 }}
              onClick={handleExport}
              type="default"
              loading={exportLoading}
              disabled={exportLoading}
            >
              {exportLoading ? '导出中' : intl.formatMessage({ id: 'saleOrder.daochu', defaultMessage: '导出' })}
            </Button>
          </span>
        </Tooltip>
      </AuthButton>
      <AuthButton type="custom" code="transferswitch">
        <Switch
          checkedChildren="转单"
          unCheckedChildren="导出"
          checked={btnIsTransfer}
          onChange={(e) => {
            setSelectedKeys([])
            selectRef.current = []
            setBtnIsTransfer(e)
          }}
        />
      </AuthButton>
      <AuthButton type="custom" code="transfer">
        <Button type="primary" onClick={() => batchTransform()} disabled={!btnIsTransfer}>
          {intl.formatMessage({ id: 'saleOrder.zhuandan', defaultMessage: '转单' })}
        </Button>
      </AuthButton>
      <AuthButton type="custom" code="exportorder">
        <Button type="primary" onClick={() => ExportOrderItems()} disabled={btnIsTransfer}>
          {'导出订单商品清单'}
        </Button>
      </AuthButton>
    </Space>
  )

  registerVirtualBox('CustomTitle', ({ props }) => {
    return (
      <p>
        {intl.formatMessage({ id: 'saleOrder.dangqiangouyunle', defaultMessage: '当前勾运了' })}
        <b> {props['x-component-props'].number} </b>
        {intl.formatMessage({
          id: 'saleOrder.zhangdingdanjinhang',
          defaultMessage: '张订单进行转单，转单后生成的采购订单可通过会员角色',
        })}
        <b> {props['x-component-props'].roleName || serversRoles[0]?.roleName} </b>
        {intl.formatMessage({ id: 'saleOrder.jinhangzhakan', defaultMessage: '进行查看' })}
      </p>
    )
  })

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
      <Spin spinning={pageLoading}>
        <Card>
          <StandardTable
            fetchTableData={(params) => loadingTableData(params)}
            columns={columns}
            rowSelection={rowSelection}
            currentRef={ref}
            rowKey="orderId"
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
        {/* 取消原因 */}
        <ModalForm
          modalTitle={intl.formatMessage({
            id: 'saleOrder.quxiaoyuanyin',
            defaultMessage: '取消原因',
          })}
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
                  id: {
                    type: 'number',
                    title: '当前id',
                    visible: false,
                  },
                  cancelReason: {
                    type: 'textarea',
                    'x-component-props': {
                      rows: 4,
                      placeholder: intl.formatMessage({
                        id: 'saleOrder.zaicishuruni',
                        defaultMessage: '在此输入你的原因, 最多50个汉字',
                      }),
                    },
                    title: intl.formatMessage({
                      id: 'saleOrder.quxiaoyuanyin',
                      defaultMessage: '取消原因',
                    }),
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'saleOrder.qingshuruquxiao',
                          defaultMessage: '请输入取消原因',
                        }),
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
        {/* 中止原因 */}
        <ModalForm
          modalTitle={intl.formatMessage({
            id: 'saleOrder.zhongzhiyuanyin',
            defaultMessage: '中止原因',
          })}
          currentRef={pauseRef}
          confirm={handleSubmitPause}
          actions={pauseActions}
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
                  id: {
                    type: 'number',
                    title: '当前id',
                    visible: false,
                  },
                  state: {
                    type: 'number',
                    title: '同意',
                    visible: false,
                  },
                  auditOpinion: {
                    type: 'textarea',
                    'x-component-props': {
                      rows: 4,
                      placeholder: intl.formatMessage({
                        id: 'saleOrder.zaicishuruni',
                        defaultMessage: '在此输入你的原因, 最多50个汉字',
                      }),
                    },
                    title: intl.formatMessage({
                      id: 'saleOrder.zhongzhiyuanyin',
                      defaultMessage: '中止原因',
                    }),
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'saleOrder.qingshuruquxiao',
                          defaultMessage: '请输入取消原因',
                        }),
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
          modalProps={{ confirmLoading: loadingEnd }}
        />
        {/* 确认转单 */}
        <ModalForm
          modalTitle={intl.formatMessage({
            id: 'saleOrder.querenzhuandan',
            defaultMessage: '确认转单',
          })}
          currentRef={transformRef}
          confirm={handleSubmitTransform}
          cancel={resetRoleSelect}
          actions={transformActions}
          modalProps={{
            confirmLoading: transformLoading,
          }}
          schema={{
            type: 'object',
            properties: {
              roleId: {
                type: 'number',
                title: intl.formatMessage({
                  id: 'saleOrder.huiyuanjuese(',
                  defaultMessage: '会员角色(转单采购)',
                }),
                required: true,
                enum: [
                  {
                    label: intl.formatMessage({
                      id: 'saleOrder.caigoushang(mo',
                      defaultMessage: '采购商(默认)',
                    }),
                    value: 1,
                  },
                  {
                    label: intl.formatMessage({
                      id: 'saleOrder.qudaocaigoushang',
                      defaultMessage: '渠道采购商',
                    }),
                    value: 2,
                  },
                ],
              },
              NOT_SUBMIT_TITLE: {
                type: 'object',
                'x-component': 'CustomTitle',
                'x-component-props': {
                  number: 0,
                  roleName: null,
                },
              },
              orders: {
                type: 'array',
                'x-component': 'MultTable',
                required: true,
                'x-component-props': {
                  rowKey: 'orderId',
                  columns: '{{orderColumns}}',
                  pagination: false,
                },
              },
              orderId: {
                type: 'number',
                visible: false,
              },
            },
          }}
          effects={($, actions) => {
            $('onFormInit').subscribe(() => {
              actions.setFieldState('roleId', (prevState) => {
                prevState.props.enum = serversRoles.map((item) => ({
                  label: item.roleName,
                  value: item.roleId,
                }))
              })
            })
            actions.setFieldValue('roleId', serversRoles[0]?.roleId)
            $('onFieldInputChange', 'roleId').subscribe((state) => {
              actions.setFieldState('NOT_SUBMIT_TITLE', (prevState) => {
                prevState.props['x-component-props'].roleName = state.values[1].title
              })
              handelTransformOrder(state['value'], actions.getFieldValue('orderId'))
            })
          }}
          expressionScope={{
            orderColumns,
          }}
        />
        {/* 支付链接 */}
        <Modal
          title={intl.formatMessage({ id: 'saleOrder.zhifulianjie', defaultMessage: '支付链接' })}
          visible={payChartVisible}
          onCancel={() => setPayChartVisible(false)}
          footer={false}
          width={600}
          destroyOnClose={true}
          afterClose={() => setQrCode('')}
        >
          <div>
            <div style={{ marginBottom: 10 }}>
              <p>{intl.formatMessage({ id: 'saleOrder.xuanzeleixin', defaultMessage: '选择类型：' })}</p>
              <Radio.Group onChange={onChangePayModel} value={payModel}>
                <Radio value="web">WEB</Radio>
                <Radio value="app">APP</Radio>
                <Radio value="miniapp">
                  {intl.formatMessage({ id: 'saleOrder.xiaochengxu', defaultMessage: '小程序' })}
                </Radio>
                <Radio value="H5">H5</Radio>
              </Radio.Group>
            </div>
            {payModel === 'web' && (
              <Form form={payForm} name="pay-form" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                <Form.Item
                  label={intl.formatMessage({
                    id: 'saleOrder.dangqiandingdan',
                    defaultMessage: '当前订单',
                  })}
                  name="order"
                >
                  <span>{currentPayRef.current.orderNo}</span>
                </Form.Item>
                <Form.Item
                  label={intl.formatMessage({
                    id: 'saleOrder.dingdanlaiyuan',
                    defaultMessage: '订单来源',
                  })}
                  name="origin"
                >
                  <span>{currentPayRef.current.shopName}</span>
                </Form.Item>
                <Form.Item
                  label={intl.formatMessage({
                    id: 'saleOrder.zhifulianjie',
                    defaultMessage: '支付链接',
                  })}
                >
                  <Row>
                    <Col span={20}>
                      <Form.Item
                        name="payChart"
                        noStyle
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'saleOrder.cixiangweibitian',
                              defaultMessage: '此项为必填',
                            }),
                          },
                        ]}
                      >
                        <Input id="linkInput" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Button type="primary" onClick={handleCopy}>
                        {intl.formatMessage({
                          id: 'saleOrder.fuzhilianjie',
                          defaultMessage: '复制链接',
                        })}
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            )}
            {payModel === 'app' && (
              <div className={styles.appPayContainer}>
                <div className={styles.appPayContent}>
                  <div className={styles.appPayLeft}>
                    <div className={styles.leftTitle}>
                      <img src={appImg} alt="" width={32} height={32} />
                      <h2>
                        {intl.formatMessage({
                          id: 'saleOrder.APPsaoma',
                          defaultMessage: 'APP扫码',
                        })}
                      </h2>
                    </div>
                    <p>
                      <span className={styles.listLabel}>
                        {intl.formatMessage({
                          id: 'saleOrder.dingdanzhaiyao：',
                          defaultMessage: '订单摘要：',
                        })}
                      </span>
                      <span>{currentPayRef.current.digest}</span>
                    </p>
                    <p>
                      <span className={styles.listLabel}>
                        {intl.formatMessage({
                          id: 'saleOrder.caigouhuiyuan：',
                          defaultMessage: '采购会员：',
                        })}
                      </span>
                      <span>{currentPayRef.current.buyerMemberName}</span>
                    </p>
                    <p>
                      <span className={styles.listLabel}>
                        {intl.formatMessage({
                          id: 'saleOrder.dingdanzonge：',
                          defaultMessage: '订单总额：',
                        })}
                      </span>
                      <span>
                        {intl.formatMessage({ id: 'common.money', defaultMessage: '￥' })}
                        {currentPayRef.current.productAmount}
                      </span>
                    </p>
                  </div>
                  <div className={styles.appPayRight}>
                    <div>
                      {qrCode ? <img id="qrcodeElement" src={qrCode} alt="" width={130} height={130} /> : <Spin />}
                    </div>
                    <p>
                      <img src={scanImg} alt="" width={16} height={16} />{' '}
                      {intl.formatMessage({
                        id: 'saleOrder.saoyisaojinruApp',
                        defaultMessage: '扫一扫进入APP支付',
                      })}
                    </p>
                  </div>
                </div>
                <p>
                  <Button type="primary" onClick={onSave}>
                    {intl.formatMessage({
                      id: 'saleOrder.baocuntupian',
                      defaultMessage: '保存图片',
                    })}
                  </Button>
                </p>
                <p className={styles.appPayBottom}>
                  <p>
                    <span className={styles.listLabel}>
                      {intl.formatMessage({
                        id: 'saleOrder.dangqiandingdan：',
                        defaultMessage: '当前订单：',
                      })}
                    </span>
                    <span>{currentPayRef.current.orderNo}</span>
                  </p>
                  <p>
                    <span className={styles.listLabel}>
                      {intl.formatMessage({
                        id: 'saleOrder.dingdanlaiyuan：',
                        defaultMessage: '订单来源：',
                      })}
                    </span>
                    <span>{currentPayRef.current.shopName}</span>
                  </p>
                </p>
              </div>
            )}
            {payModel === 'miniapp' && (
              <div className={styles.appPayContainer}>
                <div className={styles.appPayContent}>
                  <div className={styles.appPayLeft}>
                    <div className={styles.leftTitle}>
                      <img src={miniappImg} alt="" width={32} height={32} />
                      <h2>
                        {intl.formatMessage({
                          id: 'saleOrder.xiaochengxusaoma',
                          defaultMessage: '小程序扫码',
                        })}
                      </h2>
                    </div>
                    <p>
                      <span className={styles.listLabel}>
                        {intl.formatMessage({
                          id: 'saleOrder.dingdanzhaiyao：',
                          defaultMessage: '订单摘要：',
                        })}
                      </span>
                      <span>{currentPayRef.current.digest}</span>
                    </p>
                    <p>
                      <span className={styles.listLabel}>
                        {intl.formatMessage({
                          id: 'saleOrder.caigouhuiyuan：',
                          defaultMessage: '采购会员：',
                        })}
                      </span>
                      <span>{currentPayRef.current.buyerMemberName}</span>
                    </p>
                    <p>
                      <span className={styles.listLabel}>
                        {intl.formatMessage({
                          id: 'saleOrder.dingdanzonge：',
                          defaultMessage: '订单总额：',
                        })}
                      </span>
                      <span>
                        {intl.formatMessage({ id: 'common.money', defaultMessage: '￥' })}
                        {currentPayRef.current.productAmount}
                      </span>
                    </p>
                  </div>
                  <div className={styles.appPayRight}>
                    <div>
                      {qrCode ? <img id="qrcodeElement" src={qrCode} alt="" width={130} height={130} /> : <Spin />}
                    </div>
                    <p>
                      <img src={scanImg} alt="" width={16} height={16} />{' '}
                      {intl.formatMessage({
                        id: 'saleOrder.saoyisaojinruMiniapp',
                        defaultMessage: '扫一扫进入小程序支付',
                      })}
                    </p>
                  </div>
                </div>
                <p>
                  <Button type="primary" onClick={onSave}>
                    {intl.formatMessage({
                      id: 'saleOrder.baocuntupian',
                      defaultMessage: '保存图片',
                    })}
                  </Button>
                </p>
                <p className={styles.appPayBottom}>
                  <p>
                    <span className={styles.listLabel}>
                      {intl.formatMessage({
                        id: 'saleOrder.dangqiandingdan：',
                        defaultMessage: '当前订单：',
                      })}
                    </span>
                    <span>{currentPayRef.current.orderNo}</span>
                  </p>
                  <p>
                    <span className={styles.listLabel}>
                      {intl.formatMessage({
                        id: 'saleOrder.dingdanlaiyuan：',
                        defaultMessage: '订单来源：',
                      })}
                    </span>
                    <span>{currentPayRef.current.shopName}</span>
                  </p>
                </p>
              </div>
            )}
          </div>
        </Modal>
        <UploadContract visible={confirmContract} setVisible={setConfirmContract} />
        <a href="" id="downloadLink" style={{ visibility: 'hidden', display: 'none' }}></a>
      </Spin>
    </PageHeaderWrapper>
  )
}

SaleOrder.defaultProps = {}

export default SaleOrder

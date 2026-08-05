import React, { useRef, useState, useEffect } from 'react'
import { Button, Popconfirm, Card, Space, Form } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { AuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  getOrderOrderProductSalesBoardPage,
  getOrderOrderProductSalesBoardTotal,
  getOrderOrderProductSalesBoardExport,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { getWebIntl } from '@apps/locales'
import { getPurchaseOrderSelectOption } from '@/pages/productManage/assets/effect'
import { useIntl } from '@linkseeks/i18n'
import { downFileByBuffer } from '@/utils/index'

const formActions = createFormActions()
const translate = getWebIntl()
const PriceManage: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const [dateToSet, setDateToSet] = useState(false)
  const schema: any = () => {
    const res = getPurchaseOrderSelectOption()
    if (res) {
      const { outerStatus: PurchaseOrderOutWorkStateTexts } = res

      return {
        type: 'object',
        properties: {
          topLayout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              grid: true,
            },
            properties: {
              ctl: {
                type: 'object',
                'x-component': 'Children',
                'x-component-props': {
                  children: '{{controllerBtns}}',
                },
              },
              FLEX_END_LAYOUT: {
                type: 'object',
                'x-component': 'flex-layout',
                'x-component-props': {
                  rowStyle: {
                    justifyContent: 'flex-end',
                  },
                  colStyle: {
                    marginLeft: 16,
                  },
                },
                properties: {
                  productSkuName: {
                    type: 'object',
                    'x-component': 'Search',
                    'x-component-props': {
                      placeholder: '请输入商品名称',
                      align: 'flex-end',
                    },
                  },
                },
              },
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              rowStyle: {
                flexWrap: 'nowrap',
              },
              colStyle: {
                marginLeft: 20,
              },
            },
            properties: {
              vendorName: {
                type: 'string',
                'x-component-props': {
                  placeholder: `请输入供应商名称`,
                },
              },
              orderStatus: {
                type: 'string',
                'x-component-props': {
                  placeholder: `请选择订单状态`,
                },
                enum: PurchaseOrderOutWorkStateTexts.map((item) => ({
                  label: item.text,
                  value: item.id,
                })),
              },
              dateType: {
                type: 'string',
                'x-component-props': {
                  placeholder: `请选择时段`,
                },
                enum: [
                  { label: '今日', value: 'today' },
                  { label: '昨日', value: 'yesterday' },
                  { label: '本周', value: 'thisWeek' },
                  { label: '上周', value: 'lastWeek' },
                  { label: '本月', value: 'thisMonth' },
                  { label: '上月', value: 'lastMonth' },
                ],
              },
              '[payStartTime, payEndTime]': {
                type: 'daterange',
                // "x-component": 'DateRangePickerUnix',
                'x-component-props': {
                  // showTime: true,
                  placeholder: ['订单支付开始时间', '订单支付结束时间'],
                },
              },
              submit: {
                'x-component': 'Submit',
                'x-component-props': {
                  children: intl.formatMessage({ id: 'purchaseRequisition.chaxun' }),
                },
              },
            },
          },
        },
      }
    }
  }

  const [data, setData] = useState<any>({
    productCount: 0, //商品数
    soldAmount: 0, //已销售金额
    soldQuantity: 0, // 已销售数量
    returningQuantity: 0, //退货中数量
    returningAmount: 0, //退货中金额
    returnedQuantity: 0, //已退货数量
    returnedAmount: 0, //已退货金额
  })

  const [form] = Form.useForm()

  const columns = [
    {
      title: '商品SPUID',
      dataIndex: 'skuId',
      key: 'skuId',
    },
    {
      title: '商品SKUID',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: '商品SKU名称',
      dataIndex: 'productSkuName',
      key: 'productSkuName',
      width: 300,
    },
    {
      title: '归属供应商',
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    {
      title: '已销售金额',
      dataIndex: 'soldAmount',
      key: 'soldAmount',
    },
    {
      title: '已销售数量',
      dataIndex: 'soldQuantity',
      key: 'soldQuantity',
    },
    {
      title: '退货中数量',
      dataIndex: 'returningQuantity',
      key: 'returningQuantity',
    },
    {
      title: '退货中金额',
      dataIndex: 'returningAmount',
      key: 'returningAmount',
    },
    {
      title: '已退货数量',
      dataIndex: 'returnedQuantity',
      key: 'returnedQuantity',
    },
    {
      title: '已退货金额',
      dataIndex: 'returnedAmount',
      key: 'returnedAmount',
    },
  ]

  function getTimeRange(type, detailed = false) {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const date = now.getDate()
    const day = now.getDay() || 7

    let startDate, endDate

    switch (type) {
      case 'today':
        startDate = new Date(year, month, date)
        endDate = new Date(year, month, date)
        break
      case 'yesterday':
        startDate = new Date(year, month, date - 1)
        endDate = new Date(year, month, date - 1)
        break
      case 'tomorrow':
        startDate = new Date(year, month, date + 1)
        endDate = new Date(year, month, date + 1)
        break
      case 'thisWeek':
        startDate = new Date(year, month, date - (day - 1))
        endDate = new Date(year, month, date + (7 - day))
        break
      case 'lastWeek':
        startDate = new Date(year, month, date - (day - 1) - 7)
        endDate = new Date(year, month, date + (7 - day) - 7)
        break
      case 'thisMonth':
        startDate = new Date(year, month, 1)
        endDate = new Date(year, month + 1, 0)
        break
      case 'lastMonth':
        const lastMonth = month === 0 ? 11 : month - 1
        const lastYear = month === 0 ? year - 1 : year
        startDate = new Date(lastYear, lastMonth, 1)
        endDate = new Date(year, month, 0)
        break
      default:
        throw new Error('参数错误！请传入：today/yesterday/tomorrow/thisWeek/lastWeek/thisMonth/lastMonth')
    }

    const formatTime = (date) => {
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      const h = String(date.getHours()).padStart(2, '0')
      const min = String(date.getMinutes()).padStart(2, '0')
      const s = String(date.getSeconds()).padStart(2, '0')
      return `${y}-${m}-${d}`
    }

    const getTimeDetails = (date) => ({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      formatted: formatTime(date),
    })

    return {
      start: detailed ? getTimeDetails(startDate) : formatTime(startDate),
      end: detailed ? getTimeDetails(endDate) : formatTime(endDate),
      timestamp: {
        start: startDate.getTime(),
        end: endDate.getTime(),
      },
    }
  }

  const fetchData = (params) => {
    // 为fetchTotalData创建单独的参数对象，排除分页参数
    const { current, pageSize, ...totalParams } = params
    fetchTotalData({
      ...totalParams,
      payStartTime: params.payStartTime ? params.payStartTime + ' 00:00:00' : '',
      payEndTime: params.payEndTime ? params.payEndTime + ' 23:59:59' : '',
    })
    return new Promise((resolve, reject) => {
      getOrderOrderProductSalesBoardPage({
        ...params,
        payStartTime: params.payStartTime ? params.payStartTime + ' 00:00:00' : '',
        payEndTime: params.payEndTime ? params.payEndTime + ' 23:59:59' : '',
      }).then((res) => {
        // const { data } = res
        resolve(res.data)
      })
    })
  }

  const fetchTotalData = async (params) => {
    try {
      const res = await getOrderOrderProductSalesBoardTotal(params)
      if (res.data) {
        setData(res.data)
        form.setFieldsValue(res.data)
      }
    } catch (error) {
      console.error('获取总计数据失败:', error)
    }
  }

  /* 导出 */
  const handleExport = () => {
    // const { selectedRowKeys = [], selectRow = [], setSelectedRowKeys, setSelectRow } = selectRowFns
    // if (selectedRowKeys.length > 5000) {
    //   message.warning(intl.formatMessage({ id: 'balance.export.quantity.limit' }))
    //   return
    // }
    const values = formActions.getFormState().values
    getOrderOrderProductSalesBoardExport(
      {
        ...values,
        payStartTime: values.payStartTime ? values.payStartTime + ' 00:00:00' : '',
        payEndTime: values.payEndTime ? values.payEndTime + ' 23:59:59' : '',
      },
      { responseType: 'blob', getResponse: true },
    ).then((res: any) => {
      const { response } = res
      if (response.status == 200) {
        const suffixName = response.headers.get('content-disposition').split('.')[1]
        // 导出日期
        const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const fileName = `${currentDate}_商品销量看板.${suffixName}`
        downFileByBuffer(response.data, fileName)
        ref.current.reloadCurrent()
      }
    })
  }

  const controllerBtns = (
    <Space>
      <AuthButton type="custom" code="export">
        <Button type="primary" onClick={handleExport}>
          {'导出'}
        </Button>
      </AuthButton>
    </Space>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          columns={columns}
          currentRef={ref}
          tableProps={{
            rowKey: 'skuId',
            scroll: {
              x: 1200,
            },
          }}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <>
              <NiceForm
                actions={formActions}
                onSubmit={(values) => {
                  ref.current.reload(values)
                  // fetchTotalData(values)
                }}
                expressionScope={{
                  controllerBtns,
                }}
                effects={($, actions) => {
                  useStateFilterSearchLinkageEffect($, actions, 'productSkuName', FORM_FILTER_PATH)
                  FormEffectHooks.onFieldChange$('dateType').subscribe((state) => {
                    if (state.value) {
                      const t = getTimeRange(state.value)
                      actions.setFieldValue('payEndTime', t.start)
                      actions.setFieldValue('payStartTime', t.end)
                      actions.setFieldValue('[payStartTime, payEndTime]', [t.start, t.end])
                    }
                  })
                  FormEffectHooks.onFieldChange$('[payStartTime, payEndTime]').subscribe((state) => {
                    if (state.active) {
                      if (state.value && state.value.length) {
                        actions.setFieldValue('dateType', null)
                      }
                    }
                  })
                }}
                schema={schema()}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: '#666' }}>总计</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>商品种数:</div>
                  <div style={{ fontSize: '12px', color: '#333' }}>{data.productCount || 0}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>已销售金额:</div>
                  <div style={{ fontSize: '12px', color: '#333' }}>{data.soldAmount || 0}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>已销售数量:</div>
                  <div style={{ fontSize: '12px', color: '#333' }}>{data.soldQuantity || 0}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>退货中数量:</div>
                  <div style={{ fontSize: '12px', color: '#333' }}>{data.returningQuantity || 0}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>退货中金额:</div>
                  <div style={{ fontSize: '12px', color: '#333' }}>{data.returningAmount || 0}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>已退货数量:</div>
                  <div style={{ fontSize: '12px', color: '#333' }}>{data.returnedQuantity || 0}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>已退货金额:</div>
                  <div style={{ fontSize: '12px', color: '#333' }}>{data.returnedAmount || 0}</div>
                </div>
              </div>
            </>
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default PriceManage

import React, { useRef, useState } from 'react'
import { Card } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { baseOrderListColumns, tableSearchListSchema } from '../constant'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import Submit from '@/components/NiceForm/components/Submit'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import ModalForm from '@/components/ModalForm'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import TableOperation from '@/components/TableOperation'
import { getPurchaseRequisitionPage, postPurchaseRequisitionCancel, postPurchaseRequisitionPause } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { getMemberUserPage } from '@apps/apis'

// 请购单查询

export interface RequestBillProps {}

const fetchTableData = async (params) => {
  const { data } = await getPurchaseRequisitionPage(params)
  return data
}

const formActions = createFormActions()
const destroyActions = createFormActions()
const pauseActions = createFormActions()

const RequestBill: React.FC<RequestBillProps> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const destoryRef = useRef<any>({})
  const pauseRef = useRef<any>({})
  const [curentId, setCurrentId] = useState<number>()

  const { run, loading } = useHttpRequest(postPurchaseRequisitionCancel)
  const { run: runPause, loading: loadingEnd } = useHttpRequest(postPurchaseRequisitionPause)
  const fetchParams = useRef<any>({})

  const loadingTableData = (params) => {
    fetchParams.current = { ...params }
    return fetchTableData(params)
  }

  // 提交取消
  const handleSubmit = () => {
    destroyActions.submit().then(async ({ values }: any) => {
      const result = await run({ ...values, id: curentId })
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
      const result = await runPause({ ...values, id: curentId })
      if (result.code === 1000) {
        pauseRef.current.setVisible(false)
        setTimeout(() => {
          ref.current.reloadCurrent()
        }, 800)
      }
    })
  }

  const handleCancel = (r) => {
    destoryRef.current.setVisible(true)
    setCurrentId(r.id)
    // destroyActions.setFieldValue('id', r.id)
  }

  const handleSuspend = (r) => {
    pauseRef.current.setVisible(true)
    setCurrentId(r.id)
    // pauseActions.setFieldValue('id', r.id)
  }

  /** 参照后台数据生成 */
  const renderOptionButton = (record) => {
    const btnAuthOfOperationTextMap = {
      [intl.formatMessage({
        id: 'purchaseRequisition.quxiaodingdan',
        defaultMessage: '取消订单',
      })]: 'cancel',
      [intl.formatMessage({
        id: 'purchaseRequisition.zhongzhi',
        defaultMessage: '中止',
      })]: 'stop',
    }

    const buttonGroup = {
      [intl.formatMessage({
        id: 'purchaseRequisition.quxiaodingdan',
        defaultMessage: '取消订单',
      })]: record.showCancel,
      [intl.formatMessage({
        id: 'purchaseRequisition.zhongzhi',
        defaultMessage: '中止',
      })]: record.showPause,
    }

    const operationHandler = {
      [intl.formatMessage({
        id: 'purchaseRequisition.quxiaodingdan',
        defaultMessage: '取消订单',
      })]: () => handleCancel(record),
      [intl.formatMessage({
        id: 'purchaseRequisition.zhongzhi',
        defaultMessage: '中止',
      })]: () => handleSuspend(record),
    }

    return (
      <TableOperation
        buttonTextFieldMap={buttonGroup}
        operationHandler={operationHandler}
        buttonPermissionsMap={btnAuthOfOperationTextMap}
      />
    )
  }

  const secondColumns = () => {
    const alreadyColumns = baseOrderListColumns('preview')
    if (alreadyColumns) {
      return alreadyColumns.concat([
        {
          title: intl.formatMessage({
            id: 'purchaseRequisition.caozuo',
            defaultMessage: '操作',
          }),
          align: 'left',
          dataIndex: 'ctl',
          key: 'ctl',
          width: 128,
          fixed: 'right',
          render: (text, record) => renderOptionButton(record),
        },
      ])
    }
  }
  const handleSearch = async (value) => {
    console.log(value)
    if (!value) {
      formActions.setFieldState('requisitionerId', (fieldState) => {
        fieldState.props.enum = []
      })
      return
    }
    const data: any = { name: value, status: '1', pageSize: 10, current: 1 }
    const res = await getMemberUserPage(data)
    const list = res.data.data.map((item) => {
      return { label: item.name, value: item.userId }
    })
    formActions.setFieldState('requisitionerId', (fieldState) => {
      fieldState.props.enum = list
    })
    console.log(list)
  }
  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => loadingTableData(params)}
          columns={secondColumns()}
          currentRef={ref}
          rowKey="id"
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'requisitionNo', FORM_FILTER_PATH)
              }}
              expressionScope={{
                handleSearch,
              }}
              schema={tableSearchListSchema()}
              components={{
                DateRangePickerUnix,
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
      </Card>
      {/* 取消原因 */}
      <ModalForm
        modalTitle={intl.formatMessage({
          id: 'purchaseRequisition.quxiaoyuanyin',
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
                // id: {
                //   type: 'number',
                //   title: '当前id',
                //   visible: false,
                // },
                reason: {
                  type: 'textarea',
                  'x-component-props': {
                    rows: 4,
                    placeholder: intl.formatMessage({
                      id: 'purchaseRequisition.zaicishuruni',
                      defaultMessage: '在此输入你的原因, 最多50个汉字',
                    }),
                  },
                  title: intl.formatMessage({
                    id: 'purchaseRequisition.quxiaoyuanyin',
                    defaultMessage: '取消原因',
                  }),
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'purchaseRequisition.qingshuruquxiao',
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
          id: 'purchaseRequisition.zhongzhiyuanyin',
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
                // id: {
                //   type: 'number',
                //   title: '当前id',
                //   visible: false,
                // },
                reason: {
                  type: 'textarea',
                  'x-component-props': {
                    rows: 4,
                    placeholder: intl.formatMessage({
                      id: 'purchaseRequisition.zaicishuruni',
                      defaultMessage: '在此输入你的原因, 最多50个汉字',
                    }),
                  },
                  title: intl.formatMessage({
                    id: 'purchaseRequisition.zhongzhiyuanyin',
                    defaultMessage: '中止原因',
                  }),
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'purchaseRequisition.qingshuruquxiao',
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
    </PageHeaderWrapper>
  )
}

RequestBill.defaultProps = {}

export default RequestBill

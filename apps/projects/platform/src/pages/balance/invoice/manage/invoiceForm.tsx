import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Button, DatePicker, message } from 'antd'
import { FormDetailContext } from '@/formSchema/context'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import FormDetailHeader from '@/components/FormDetailHeader'
import TableModal from '@/components/TableModal'
import { AuthButton } from '@apps/components'
import { LinkOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { increaseSchema, searchSchema } from './schema'
import styles from './index.less'
import FormDetailWrapper from '@/components/FormDetailWrapper'
import {
  getSettlementMemberSettlementAccountStatementAddPageInvoicingProcess,
  getSettlementMemberSettlementAccountStatementInvoiceReconciliationRows,
  getSettlementMemberSettlementAccountStatementDetail,
  postSettlementMemberSettlementAccountStatementAddOrUpdateInvoice,
  getSettlementMemberSettlementAccountStatementInvoiceRowList,
} from '@apps/apis'
import NiceForm from '@/components/NiceForm'
import { formKeys, reconciliationColumn, statementsColumn } from './contants'
import { InvoiceDetailType, InvoiceFromValuesType } from './types'
import { useInvoiceDetailTable } from './model/useInvoiceDetailTable'
import moment from 'moment'
import UploadInvoice from '../components/UploadInvoice'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { PATTERN_MAPS } from '@/constants/regExp'

const { onFieldValueChange$ } = FormEffectHooks
const addSchemaAction = createFormActions()

const RangePicker = DatePicker.RangePicker

/** 页面操作类型 */
export enum OperateType {
  add = 'add',
  edit = 'edit',
  detail = 'detail',
}

interface InvoiceFormProps {
  reconciliationId: number
  id: number
  type: OperateType
  title: string
}

const InvoiceForm: React.FC<InvoiceFormProps> = (props) => {
  const intl = useIntl()
  const { reconciliationId, id, type, title } = props
  const [btnLoading, setBtnLoading] = useState(false)
  const { formContext } = useFormDetail()
  const [initFormValue] = useState<any>({
    rows: [],
  })
  const [invoiceDrawerVisible, setInvoiceDrawerVisible] = useState<boolean>(false) // 选择单据
  const [statementsDrawerVisible, setStatementsDrawerVisible] = useState<boolean>(false) // 选择对账单抽屉
  const { invoiceDetailColumns, invoiceDetailComponents, canSave } = useInvoiceDetailTable(
    addSchemaAction,
    type === OperateType.detail ? 'detail' : 'edit',
  )
  const [current] = useState<number>(1)
  const [pageSize] = useState<number>(20)

  useEffect(() => {
    if (reconciliationId) {
      initFormData()
    }
  }, [])

  const fetchInvoiceRowList = async () => {
    const params = {
      id,
      current,
      pageSize,
    }
    const res = await getSettlementMemberSettlementAccountStatementInvoiceRowList(params)
    if (res.code === 1000 && res.data && res.data.data.length > 0) {
      let data = res.data.data
      if (type === OperateType.edit) {
        data = data.map((item: any) => {
          return {
            ...item,
            treatReconciliationQuantity: ((item.treatReconciliationQuantity || 0) + (item.currentNumber || 0)).toFixed(
              3,
            ),
          }
        })
      }
      addSchemaAction.setFieldValue('rows', data)
    }
  }

  const initFormData = async () => {
    addSchemaAction.setFieldValue('operateType', type)
    const detailInfo = await fetchInvoiceDetail(reconciliationId)
    if (detailInfo) {
      if (type !== OperateType.add) {
        formKeys.push(...['id', 'code', 'invoiceDate', 'number', 'remark', 'urlImgs'])
        await fetchInvoiceRowList()
      }

      // 设置表单数据
      Object.keys(detailInfo).forEach((key) => {
        if (formKeys.includes(key)) {
          if (key === 'createTime' && !id) {
            addSchemaAction.setFieldValue(key, moment(Number(detailInfo[key])).format('YYYY-MM-DD HH:mm:ss'))
          } else {
            addSchemaAction.setFieldValue(key, detailInfo[key])
          }
        }
      })

      if (detailInfo?.returnResource) {
        addSchemaAction.setFieldState('returnResource', (state) => {
          state.visible = true
        })
      }
      // 如果是待开票跳转过来新增
      if (reconciliationId) {
        addSchemaAction.setFieldState('reconciliationNo', (state) => {
          state.props.readOnly = true
          state.props['x-rules'] = undefined
          state.props['x-component-props'] = undefined
        })
      }

      // 先清理页面表单的错误验证项
      setTimeout(() => {
        addSchemaAction.clearErrors()
      }, 200)
      setInvoiceDrawerVisible(false)
    }
  }

  const providerValue = {
    schemaActions: addSchemaAction,
    formContext,
  }

  /**
   * 获取发票详情
   */
  const fetchInvoiceDetail = async (reconciliationId?: number): Promise<InvoiceDetailType | undefined> => {
    const params: { reconciliationId?: number; id?: number } = {}
    if (reconciliationId) {
      params.reconciliationId = reconciliationId
    }
    if (id) {
      params.id = id
    }
    const res = await getSettlementMemberSettlementAccountStatementDetail(params)
    if (res.code === 1000 && res.data) {
      return res.data as InvoiceDetailType
    } else {
      message.info(res.message)
    }
    return undefined
  }

  const handleSelectReconciliationClick = () => {
    setInvoiceDrawerVisible(true)
  }

  // 选择单据号按钮
  const SelectNoBtn = !reconciliationId ? (
    <Button type="primary" className={styles.select_btn} onClick={handleSelectReconciliationClick}>
      <LinkOutlined className={styles.select_icon} />
    </Button>
  ) : null

  const handleSelectStatementsClick = () => {
    const reconciliationNo = addSchemaAction.getFieldValue('reconciliationNo')
    if (reconciliationNo) {
      setStatementsDrawerVisible(true)
    } else {
      message.info(
        intl.formatMessage({ id: 'balance.invoice.select.statement.required', defaultMessage: '请先选择单据' }),
      )
    }
  }

  // 选择对账单按钮
  const SelectStatementsButton =
    type !== OperateType.detail ? (
      <div className={styles.select_statements_button} onClick={() => handleSelectStatementsClick()}>
        <PlusOutlined className={styles.select_statements_button_icon} />
        <span>{intl.formatMessage({ id: 'balance.invoice.btn.select.statements', defaultMessage: '选择对账单' })}</span>
      </div>
    ) : null

  const handleStatementsModalConfirm = (selectRow: number[] | string[], selectedRows: { [key: string]: any }[]) => {
    if (selectedRows && selectedRows.length > 0) {
      const list = addSchemaAction.getFieldValue('rows') || []
      // 对选择的账单明细数据进行处理
      const selectList = selectedRows.map((item) => {
        return {
          ...item,
          reconciliationId: addSchemaAction.getFieldValue('reconciliationId'),
          reconciliationRowId: item.id,
          name: item.productName,
          priceNoTax: (item.price / (1 + item.taxRate / 100)).toFixed(2), // 单价（不含税）
          taxMoneyAmount: (
            ((item.price * item.currentReconciliationQuantity) / (1 + item.taxRate / 100)) *
            (item.taxRate / 100)
          ).toFixed(2), // 税额
          currentQuantity: item.currentReconciliationQuantity, // 本次对账数量
          currentMoney: item.currentMoney, // 本次对账金额（含税）
          currentNumber: item.treatReconciliationQuantity?.toFixed(3), // 本次开票数量
          currentMoneyAmount: item.treatMoney?.toFixed(2), // 本次开票金额(含税)
          currentMoneyNoTax: ((item.price * item.treatReconciliationQuantity) / (1 + item.taxRate / 100)).toFixed(2), // 本次开票金额（不含税）
        }
      })
      const newList = [...selectList, ...list]
      addSchemaAction.setFieldValue('rows', newList)
      setStatementsDrawerVisible(false)
    } else {
      message.info('请先选择对账单')
    }
  }

  const handleStatementsModalClose = () => {
    setStatementsDrawerVisible(false)
  }

  const handleReconciliationModalConfirm = async (_: number[] | string[], selectedRows: { [key: string]: any }[]) => {
    const selectedItem = selectedRows[0]
    if (selectedItem) {
      const detailInfo = await fetchInvoiceDetail(selectedItem.reconciliationId)
      // 拼接发票数据，覆盖单据数据
      const info = {
        ...detailInfo,
        ...selectedItem,
      }
      // 如果手工新增，则显示选择单据按钮，单据号、单据摘要、单据类型、单据时间从选择的单据中获取
      Object.keys(info).forEach((key) => {
        if (formKeys.includes(key)) {
          addSchemaAction.setFieldValue(key, info[key])
        }
      })
      if (detailInfo?.returnResource) {
        addSchemaAction.setFieldState('returnResource', (state) => {
          state.visible = true
        })
      }
      addSchemaAction.setFieldValue('rows', [])
      setInvoiceDrawerVisible(false)
    } else {
      message.info(
        intl.formatMessage({ id: 'balance.invoice.reconciliationNo.required', defaultMessage: '请选择单据号' }),
      )
    }
  }

  const handleReconciliationModalClose = () => {
    setInvoiceDrawerVisible(false)
  }

  /**
   * 查询待开票和开票中单据数据
   * @param params
   */
  const fetchReconciliationData = async (params) => {
    const searchParams = {
      ...params,
    }
    const { data } = await getSettlementMemberSettlementAccountStatementAddPageInvoicingProcess(searchParams)
    return data
  }

  /**
   * 查询对账单数据
   * @param params
   */
  const fetchStatementsData = async (params) => {
    const searchParams = {
      ...params,
      reconciliationId: addSchemaAction.getFieldValue('reconciliationId'),
      reconciliationNo: addSchemaAction.getFieldValue('reconciliationNo'),
    }
    const { data } = await getSettlementMemberSettlementAccountStatementInvoiceReconciliationRows(searchParams)
    return data
  }

  const checkInvoiceDetail = (values: InvoiceFromValuesType): boolean => {
    for (const item of values.rows) {
      console.log(canSave, 'canSave')
      if (!canSave) {
        return false
      }

      if (Number(item.currentNumber) > Number(item.treatReconciliationQuantity)) {
        message.error(
          intl.formatMessage({
            id: 'balance.invoice.count.tip',
            defaultMessage: '开票数量不能超过待开票数量({count})',
            count: item.treatReconciliationQuantity,
          }),
        )
        return false
      }
      if (Number(item.currentMoneyAmount) > Number(item.currentMoney)) {
        message.error(
          intl.formatMessage({
            id: 'balance.invoice.check.tip',
            defaultMessage:
              '订单号：{orderNo},收货单号：{receiveNo},物料编号：{productNo}的开票金额大于对账单的对账金额！不能提交',
            orderNo: item.orderNo,
            receiveNo: item.receiveNo,
            productNo: item.productNo,
          }),
        )
        return false
      }
    }
    return true
  }

  const handleSubmit = async (values: InvoiceFromValuesType) => {
    try {
      if (!checkInvoiceDetail(values)) {
        return
      }
      // 格式化开票日期
      values['invoiceDate'] = moment(values['invoiceDate']).format('YYYY-MM-DD HH:mm:ss')
      setBtnLoading(true)
      const res = await postSettlementMemberSettlementAccountStatementAddOrUpdateInvoice(values)
      if (res.code === 1000) {
        message.destroy()
        if (type === OperateType.add) {
          message.success(intl.formatMessage({ id: 'balance.invoice.invoice.success', defaultMessage: '开票成功' }))
        } else if (type === OperateType.edit) {
          message.success(intl.formatMessage({ id: 'balance.invoice.modify.success', defaultMessage: '修改成功' }))
        }

        history.push('/balance/invoice/manage')
      }
      setBtnLoading(false)
    } catch (error) {
      setBtnLoading(false)
    }
  }

  return (
    <div className={styles['mian']}>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={title}
          schema={increaseSchema}
          showProcess={type !== OperateType.detail}
          extraRight={
            type !== OperateType.detail
              ? [
                  <Button
                    key="1"
                    onClick={() => addSchemaAction.submit()}
                    loading={btnLoading}
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    {intl.formatMessage({
                      id: 'common.button.save',
                      defaultMessage: '保存',
                    })}
                  </Button>,
                ]
              : []
          }
        />
        <FormDetailWrapper>
          <div className={styles.restContainer}>
            <NiceForm
              previewPlaceholder=" "
              value={initFormValue}
              actions={addSchemaAction}
              schema={increaseSchema}
              onSubmit={handleSubmit}
              components={{
                UploadInvoice,
              }}
              effects={($, ctx) => {
                formContext.useAttachmentChangeForContext(ctx)

                // 注入锚点标题数量同步
                formContext.useAnchorCountChangeForContext(ctx, ['rows'])

                // 格式化单据时间
                // onFieldValueChange$('createTime').subscribe(fieldState => {
                //   if (reconciliationId && !id) {
                //     ctx.setFieldValue('createTime', fieldState.value ? moment(fieldState.value).format('YYYY-MM-DD HH:mm:ss') : undefined)
                //   }
                // })

                if (type === OperateType.detail) {
                  // 格式化开票日期
                  onFieldValueChange$('invoiceDate').subscribe((fieldState) => {
                    ctx.setFieldValue(
                      'invoiceDate',
                      fieldState.value ? moment(fieldState.value).format('YYYY-MM-DD') : undefined,
                    )
                  })
                }
              }}
              expressionScope={{
                SelectNoBtn,
                SelectStatementsButton,
                invoiceDetailColumns,
                invoiceDetailComponents,
                operateType: type,
              }}
            />
          </div>
        </FormDetailWrapper>
      </FormDetailContext.Provider>
      <TableModal
        title={intl.formatMessage({ id: 'balance.invoice.manage.invoiceModal.title', defaultMessage: '选择单据' })}
        modalType="Drawer"
        visible={invoiceDrawerVisible}
        schema={searchSchema}
        tableProps={{
          rowKey: 'reconciliationNo',
        }}
        components={{
          RangePicker,
        }}
        rowSelection={{
          getCheckboxProps: (_record) => {
            const reconciliationNo = addSchemaAction.getFieldValue('reconciliationNo')
            return {
              disabled: reconciliationNo === _record.reconciliationNo,
            }
          },
        }}
        columns={reconciliationColumn}
        effects={($, actions) => {
          useStateFilterSearchLinkageEffect($, actions, 'megaLayout.reconciliationNo', FORM_FILTER_PATH)
        }}
        mode="radio"
        fetchData={fetchReconciliationData}
        onClose={handleReconciliationModalClose}
        onOk={handleReconciliationModalConfirm}
      />
      <TableModal
        title={intl.formatMessage({ id: 'balance.invoice.manage.statementsModal.title', defaultMessage: '对账单明细' })}
        modalType="Drawer"
        width={1400}
        visible={statementsDrawerVisible}
        schema={{
          type: 'object',
          properties: {},
        }}
        tableProps={{
          rowKey: 'id',
        }}
        rowSelection={{
          getCheckboxProps: (_record) => {
            const rows = addSchemaAction.getFieldValue('rows')
            return {
              disabled: rows.some((item) => item.id === _record.id),
            }
          },
        }}
        columns={statementsColumn}
        mode="checkbox"
        fetchData={fetchStatementsData}
        onClose={handleStatementsModalClose}
        onOk={handleStatementsModalConfirm}
      />
    </div>
  )
}

export default InvoiceForm

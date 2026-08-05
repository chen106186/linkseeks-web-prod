import React, { useRef, useCallback, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Space, Button, Popconfirm } from 'antd'
import NiceForm from '@/components/NiceForm'
import StandardTable from '@/components/StandardTable'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { createFormActions } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { schema } from './schema'
import moment from 'moment'
import { ColumnsType } from 'antd/es/table'
import { timeRange } from '@/utils'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, useLocation } from '@linkseeks/router-core'
import { DOC_TYPE_PROCESS_INVOICE, DEPENDENT_DOC_PRODUCTION, DOC_TYPE_PROCESS_RECEIPT } from '@/constants/commodity'
import {
  PROCESS_TITLE,
  PENDING_ADD_PROCESS_PATH,
  PROCESSING_INVOICE_TO_BE_ADD_PATH,
  PENDING_ADD_LOGISTICS_PATH,
  PENDING_DELIVERD_PATH,
  ASSIGN_PENDING_RECEIVE,
  PENDING_RECEIPT_PATH,
} from '../../common'
import {
  getEnhanceProcessToBeAddDeliveryList,
  getEnhanceProcessToBeAddLogisticsList,
  getEnhanceProcessToBeConfirmReceiptList,
  getEnhanceProcessToBeDeliveryList,
  getEnhanceSupplierToBeAddStorageList,
  getEnhanceSupplierToBeReceiveList,
  postEnhanceProcessToBeAddDeliveryExam,
  postEnhanceSupplierToBeAddStorageExam,
} from '@apps/apis'

const formActions = createFormActions()
const ADD_PROCESS_PATH = '/commodityAbility/stockSellStorage/bills/add'
const ADD_DELIVERY_PATH = '/commodityAbility/stockSellStorage/bills/add'
const ADD_LOGISTICS_PATH = '/logisticsAbility/logisticsBillSubmit/waitSbumitLogisticsBill/add'
const DETAIL_LOGISTICS_PATH = '/logisticsAbility/logisticsBillSubmit/logisticsBillQuery/preview'

const SERVICE_MAPS = {
  [PENDING_ADD_PROCESS_PATH]: getEnhanceSupplierToBeAddStorageList,
  [PROCESSING_INVOICE_TO_BE_ADD_PATH]: getEnhanceProcessToBeAddDeliveryList,
  [PENDING_ADD_LOGISTICS_PATH]: getEnhanceProcessToBeAddLogisticsList,
  [PENDING_DELIVERD_PATH]: getEnhanceProcessToBeDeliveryList,
  [PENDING_RECEIPT_PATH]: getEnhanceProcessToBeConfirmReceiptList,
  [ASSIGN_PENDING_RECEIVE]: getEnhanceSupplierToBeReceiveList,
}

/**
 * 记录 outerStatus 还有 innerStatus， 在不同状态的时候会渲染不同的组件
 * 例子 3_15 此时 状态为待审核加工发货单， 那么对应的columns 的render组件是 <a>审核</a>
 */
enum OuterAndInnerStatus {
  /**
   * 待新增加工发货单
   */
  pending_add_process = '3_14',
  /**
   * 待审核加工发货单
   */
  pending_exam_add_process = '3_15',
  /**
   * 待新增物流单
   */
  pending_add_logistics = '4_16',
  /**
   * 待确认物流单
   */
  pending_confirm_logistics = '4_17',
  /**
   * 物流单不接受
   */
  editing_logistics = '4_-17',
  /**
   * 待确认发货
   */
  pending_confirm_deliver = '5_18',
  /**
   * 待新增加工入库单
   */
  pending_add_process_in_warehouse = '6_19',
  /**
   * 待审核加工入库单
   */
  pending_exam_process_in_warehouse = '6_20',
  /**
   * 待确认收货
   */
  pending_confirm_receive = '7_21',
  /**
   * 待确认回单
   */
  pending_confirm_receipt = '8_22',
}

enum ExamType {
  delivery = 'deliver', //加工发货单
  warehouseReceipt = 'warehouseReceipt', // 加工入库单
}

const processStock: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const { pathname } = useLocation()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [visibleID, setVisibleID] = useState<null | number>(null)
  const isAssign = [PENDING_ADD_PROCESS_PATH, ASSIGN_PENDING_RECEIVE].includes(pathname)

  const fetchData = useCallback(
    async (params: any) => {
      const { docTime, ...rest } = params
      const { st, et } = timeRange(docTime)
      const postData = {
        startTime: st,
        endTime: et,
        ...rest,
      }
      const res = await SERVICE_MAPS[pathname](postData)
      return res.data
    },
    [pathname],
  )

  const columns: ColumnsType = [
    {
      title: intl.formatMessage({ id: 'handling.no' }),
      dataIndex: 'noticeNo',
      render: (text, record: any) => {
        return <EyeAuthButton url={`${pathname}/detail?id=${record.id}`}>{text}</EyeAuthButton>
      },
    },
    { title: intl.formatMessage({ id: 'handling.assign.add.noticeDesc' }), dataIndex: 'summary' },
    isAssign
      ? { title: intl.formatMessage({ id: 'handling.processName' }), dataIndex: 'processName' }
      : { title: intl.formatMessage({ id: 'handling.supply.member' }), dataIndex: 'supplierName' },
    ,
    {
      title: intl.formatMessage({ id: 'handling.docTime' }),
      dataIndex: 'createTime',
      render: (text, record) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: intl.formatMessage({ id: 'handling.query.processStock.deliveryBatch' }),
      dataIndex: 'deliveryBatch',
      render: (text, record) => {
        return text ? intl.formatMessage({ id: 'handling.query.processStock.deliveryBatch.no', n: text }) : ''
      },
    },
    {
      title: () =>
        [PENDING_ADD_PROCESS_PATH, ASSIGN_PENDING_RECEIVE].includes(pathname)
          ? intl.formatMessage({ id: 'handling.query.processStock.storageNo' })
          : intl.formatMessage({ id: 'handling.query.processStock.delivery' }),
      dataIndex: 'deliveryNo',
      render: (text, record: any) => {
        if (!text) {
          return null
        }
        const url = '/commodityAbility/stockSellStorage/bills/detail'
        const type = [PENDING_ADD_PROCESS_PATH, ASSIGN_PENDING_RECEIVE].includes(pathname) ? 'storage' : 'delivery'
        const id = type === 'storage' ? record.storageId : record.deliveryId
        if (!id) {
          return null
        }
        return <EyeAuthButton url={`${url}?id=${id}`}>{record[`${type}No`]}</EyeAuthButton>
      },
    },
    { title: intl.formatMessage({ id: 'handling.outerStatus' }), dataIndex: 'outerStatusName' },
    { title: intl.formatMessage({ id: 'handling.innerStatus' }), dataIndex: 'innerStatusName' },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      dataIndex: 'action',
      render: (text, record: any) => {
        // 这里暂时不知道status的状态， 先用内部状态判断, 审核的先不处理, 感觉应该用入库单号去判断吧
        const outerStatus = record.outerStatus
        const innerStatus = record.innerStatus
        const MAP = {
          [OuterAndInnerStatus.pending_add_process]: (
            <Link
              to={`${ADD_PROCESS_PATH}?relevanceInvoicesId=${record.id}&invoicesTypeId=${DOC_TYPE_PROCESS_INVOICE}&relevanceInvoices=${DEPENDENT_DOC_PRODUCTION}`}
            >
              {intl.formatMessage({ id: 'handling.query.processStock.add.processShipment' })}
            </Link>
          ),
          [OuterAndInnerStatus.pending_exam_add_process]: (
            <Popconfirm
              title={intl.formatMessage({
                id: 'handling.query.processStock.exam.deliverNo',
                deliveryNo: record.deliveryNo,
              })}
              // title={intl.formatMessage({id: 'handling.query.processStock.exam.deliverNo'}).replace(/{(.*?)}/, record.deliveryNo)}
              visible={visibleID === record.id}
              placement="left"
              okText={intl.formatMessage({ id: 'common.button.confirm' })}
              cancelText={intl.formatMessage({ id: 'common.button.cancel' })}
              onCancel={handleCancel}
              okButtonProps={{ loading: confirmLoading }}
              onConfirm={() => handleExam(record.id, ExamType.delivery)}
            >
              <a onClick={() => handleVisible(record.id)}>{intl.formatMessage({ id: 'handling.toExamine' })}</a>
            </Popconfirm>
          ),
          [OuterAndInnerStatus.pending_add_logistics]: (
            <Link to={`${ADD_LOGISTICS_PATH}?createType=3&id=${record.id}`}>
              {intl.formatMessage({ id: 'handling.query.processStock.add.logisticDoc' })}
            </Link>
          ),
          [OuterAndInnerStatus.pending_confirm_logistics]: (
            <Link to={`${DETAIL_LOGISTICS_PATH}?id=${record.logisticsOrderId}`}>
              {intl.formatMessage({ id: 'handling.query.processStock.view.logisticDoc' })}
            </Link>
          ),
          [OuterAndInnerStatus.editing_logistics]: (
            <Link
              to={`/logisticsAbility/logisticsBillSubmit/waitSbumitLogisticsBill/edit?id=${record.logisticsOrderId}`}
            >
              {intl.formatMessage({ id: 'common.button.edit' })}
            </Link>
          ),
          [OuterAndInnerStatus.pending_confirm_deliver]: (
            <Link to={`${PENDING_DELIVERD_PATH}/detail?id=${record.id}`}>
              {intl.formatMessage({ id: 'handling.query.processStock.deliver.goods' })}
            </Link>
          ),
          [OuterAndInnerStatus.pending_add_process_in_warehouse]: (
            <Link
              to={`${ADD_DELIVERY_PATH}?relevanceInvoicesId=${record.id}&invoicesTypeId=${DOC_TYPE_PROCESS_RECEIPT}&relevanceInvoices=${DEPENDENT_DOC_PRODUCTION}`}
            >
              {intl.formatMessage({ id: 'handling.query.processStock.add.receiptDoc' })}
            </Link>
          ),
          [OuterAndInnerStatus.pending_exam_process_in_warehouse]: (
            <Popconfirm
              title={intl.formatMessage({
                id: 'handling.query.processStock.exam.storageNo',
                storageNo: record.storageNo,
              })}
              visible={visibleID === record.id}
              placement="left"
              okText={intl.formatMessage({ id: 'common.button.confirm' })}
              cancelText={intl.formatMessage({ id: 'common.button.cancel' })}
              onCancel={handleCancel}
              okButtonProps={{ loading: confirmLoading }}
              onConfirm={() => handleExam(record.id, ExamType.warehouseReceipt)}
            >
              <a onClick={() => handleVisible(record.id)}>{intl.formatMessage({ id: 'handling.toExamine' })}</a>
            </Popconfirm>
          ),
          [OuterAndInnerStatus.pending_confirm_receive]: (
            <Link to={`${ASSIGN_PENDING_RECEIVE}/detail?id=${record.id}`}>
              {intl.formatMessage({ id: 'handling.query.processStock.receive.goods' })}
            </Link>
          ),
          [OuterAndInnerStatus.pending_confirm_receipt]: (
            <Link to={`${PENDING_RECEIPT_PATH}/detail?id=${record.id}`}>
              {intl.formatMessage({ id: 'handling.query.processStock.confirmReceipt' })}
            </Link>
          ),
        }
        return MAP[`${outerStatus}_${innerStatus}`]
      },
    },
  ]

  /**
   * 审核加工发货单
   * /enhance/process/toBeAddDelivery/exam 待新增发货单
   * /enhance/supplier/toBeAddStorage/exam 待新增入库单
   * @param id  审核单id
   * @param type  deliver | warehouseReceipt
   */
  const handleExam = (id: number, type: string) => {
    const exam_service = {
      [ExamType.delivery]: postEnhanceProcessToBeAddDeliveryExam,
      [ExamType.warehouseReceipt]: postEnhanceSupplierToBeAddStorageExam,
    }
    console.log(type)
    setConfirmLoading(true)
    exam_service[type]({ id }).then(({ code, data }) => {
      setConfirmLoading(false)
      setVisibleID(null)
      if (code === 1000) {
        formActions.submit()
      }
    })
  }

  /**
   * 查询
   * @params values 表单字段
   */
  const handleSearch = useCallback(
    (values: any) => {
      const { docTime, memberName, ...rest } = values
      const { st, et } = timeRange(docTime)
      const others = isAssign ? { processName: memberName } : { supplierName: memberName }

      let searchData = {
        ...rest,
        startTime: st,
        endTime: et,
        ...others,
      }
      console.log(searchData)
      ref.current.reload(searchData)
    },
    [ref],
  )

  /**
   * Popconfirm Visible 单一原则
   */
  const handleVisible = (id: number) => {
    setVisibleID(id)
  }

  /**
   * Popconfirm Cancel
   */
  const handleCancel = () => {
    setVisibleID(null)
  }

  return (
    <PageHeaderWrapper title={PROCESS_TITLE[pathname]}>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={handleSearch}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'noticeNo', FORM_FILTER_PATH)
                $('onFormMount').subscribe((fieldState) => {
                  actions.setFieldState('memberName', (state) => {
                    state.props['x-component-props']['placeholder'] = isAssign
                      ? intl.formatMessage({ id: 'handling.processName' })
                      : intl.formatMessage({ id: 'handling.supply.member' })
                  })
                })
              }}
              schema={schema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default processStock

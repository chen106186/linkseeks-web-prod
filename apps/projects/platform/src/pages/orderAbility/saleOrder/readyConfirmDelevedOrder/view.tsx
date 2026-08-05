import React, { useEffect, useState, useRef } from 'react'
import { Button, Card, message, Space, Modal } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper, AuthButton } from '@apps/components'
import { useSelfTable } from './model/useSelfTable'
import { tableListSchema } from '../constant'
import { useIntl } from '@linkseeks/i18n'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import '../index.less'
import {
  getOrderVendorValidateDeliveryPage,
  getOrderVendorProductExport,
  getOrderVendorValidateDeliveryDetail,
} from '@apps/apis'
import { downFileByBuffer } from '@/utils/index'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import OrderHandDeleved from '@/pages/transaction/components/orderHandDeleved/indexx'
import type { ITableControllerRef } from '@/components/StandardTable/TableController'

// 待确认发货单

export interface FirstApprovedOrderProps {}

const FirstApprovedOrder: React.FC<FirstApprovedOrderProps> = (props) => {
  const intl = useIntl()
  const [fahuoList, setFahuoList] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(-1) // -1 表示没有弹窗显示
  const [isProcessing, setIsProcessing] = useState<boolean>(false) // 是否正在处理中
  const [k, setK] = useState<number>(0)
  const { columns } = useSelfTable()
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'orderId' })
  const fetchTableData = async (params) => {
    rowSelectionCtl.setSelectedRowKeys([])
    rowSelectionCtl.setSelectRow([])
    const { data } = await getOrderVendorValidateDeliveryPage(params)
    return data
  }

  // 创建表格 ref
  const tableRef = useRef<ITableControllerRef>(null)
  const approvedRef = useRef<any>({})

  const handleExport = async () => {
    if (rowSelectionCtl.selectRow.length === 0) {
      return message.error(
        intl.formatMessage({ id: 'purchaseOrder.qingxiangouxuanding', defaultMessage: '请先勾选订单' }),
      )
    }
    const p = { orderIdList: rowSelectionCtl.selectRow.map((i) => i.orderId), orderOuterStatus: 11 }
    getOrderVendorProductExport(p, { responseType: 'blob', getResponse: true }).then((res: any) => {
      const { response } = res
      if (response.status == 200) {
        const suffixName = response.headers.get('content-disposition').split('.')[1]
        // 导出日期
        const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const fileName = `${currentDate}_订单商品清单.${suffixName}`
        downFileByBuffer(response.data, fileName)
      }
    })
  }

  const handleFahuo = async () => {
    if (isProcessing) {
      return message.warning('正在处理中，请稍后...')
    }

    if (rowSelectionCtl.selectRow.length === 0) {
      return message.error(
        intl.formatMessage({ id: 'purchaseOrder.qingxiangouxuanding', defaultMessage: '请先勾选订单' }),
      )
    }

    setIsProcessing(true)
    const hideLoading = message.loading({ content: '正在获取订单详情...', key: 'fetchDetail', duration: 0 })
    try {
      const orderDetails = await Promise.all(
        rowSelectionCtl.selectRow.map(async (item) => {
          try {
            const {
              response: {
                data: {
                  data: { orderKind },
                },
              },
            } = await getOrderVendorValidateDeliveryDetail({ orderId: item.orderId })
            return { ...item, orderKind }
          } catch (error) {
            console.error(`获取订单 ${item.orderId} 详情失败:`, error)
            return null
          }
        }),
      )

      // 过滤掉获取失败的订单
      const validOrders = orderDetails.filter((item) => item !== null)

      if (validOrders.length === 0) {
        message.error('获取订单详情失败')
        setIsProcessing(false)
        hideLoading()
        return
      }

      // if (validOrders.length < rowSelectionCtl.selectRow.length) {
      //   message.warning(
      //     `成功获取 ${validOrders.length} 个订单详情，${
      //       rowSelectionCtl.selectRow.length - validOrders.length
      //     } 个订单获取失败`,
      //   )
      // }

      setFahuoList(validOrders)
      setK(k + 1)
      setTimeout(() => {
        approvedRef.current.setVisible(true)
      }, 100)
      // 从第一个开始显示
      // setCurrentIndex(0)
    } catch (error) {
      message.error('获取订单详情失败')
    } finally {
      hideLoading()
      setIsProcessing(false)
    }
  }

  // 刷新表格数据
  const refreshTable = () => {
    if (tableRef.current) {
      // 使用 reload 方法刷新表格（从第一页开始）
      tableRef.current.resetTableData()
      // 或者如果你不想重置页码，可以使用 reloadCurrent
      // tableRef.current.reloadCurrent()
    }
  }

  // 处理成功关闭
  const handleSuccess = () => {
    // message.success('发货成功')
    // 刷新表格数据
    refreshTable()
    // 继续处理下一个
    // handleNext()
  }

  // 处理取消关闭
  const handleCancel = () => {
    if (currentIndex + 1 === fahuoList.length) {
      // 完全取消，清空列表
      setFahuoList([])
      rowSelectionCtl.setSelectedRowKeys([])
      rowSelectionCtl.setSelectRow([])
      setCurrentIndex(-1)
      message.info('已取消批量发货')
      // 可选：刷新表格数据
      refreshTable()
      return
    }
    Modal.confirm({
      title: '确认取消批量发货',
      content: `当前已处理 ${currentIndex + 1}/${fahuoList.length} 个订单，确定要取消继续处理后续订单吗？`,
      onOk: () => {
        // 完全取消，清空列表
        setFahuoList([])
        rowSelectionCtl.setSelectedRowKeys([])
        rowSelectionCtl.setSelectRow([])
        setCurrentIndex(-1)
        message.info('已取消批量发货')
        // 可选：刷新表格数据
        refreshTable()
      },
      onCancel: () => {
        // 继续处理下一个
        handleNext()
      },
    })
  }

  // 处理关闭弹窗（无论成功还是失败）
  const handleClose = () => {
    // 继续处理下一个
    // handleNext()
  }

  // 处理下一个订单
  const handleNext = () => {
    if (currentIndex < fahuoList.length - 1) {
      // 还有下一个订单
      setCurrentIndex(currentIndex + 1)
    } else {
      // 所有订单处理完毕
      message.success(`所有订单处理完毕，共处理 ${fahuoList.length} 个订单`)
      setFahuoList([])
      setCurrentIndex(-1)
      // 刷新表格数据
      refreshTable()
      // 清空选中行
      rowSelectionCtl.setSelectedRowKeys([])
      rowSelectionCtl.setSelectRow([])
    }
  }

  return (
    <PageHeaderWrapper>
      {/* 只显示当前索引对应的弹窗 */}
      {/* {currentIndex >= 0 && fahuoList[currentIndex] && (
      )} */}
      <OrderHandDeleved key={k} currentRef={approvedRef} fahuoList={fahuoList} onSuccess={handleSuccess} />

      {/* 显示处理进度提示 */}
      {/* {currentIndex >= 0 && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
          <Card size="small">
            正在处理 {currentIndex + 1}/{fahuoList.length} 个订单
          </Card>
        </div>
      )} */}
      <Card>
        <StandardTable
          ref={tableRef} // 添加 ref
          keepAlive={false}
          fetchTableData={(params) => fetchTableData(params)}
          rowSelection={rowSelection}
          columns={columns}
          tableProps={{ scroll: { x: '100%' } }}
          rowKey={'orderId'}
          formilyLayouts={{
            justify: 'space-between',
          }}
          formilyProps={{
            ctx: {
              inline: false,
              schema: tableListSchema(),
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'orderNo', FORM_FILTER_PATH)
              },
              components: {
                DateRangePickerUnix,
                Submit,
              },
            },
            layouts: {
              order: 2,
              span: 16,
            },
          }}
          formilyChilds={{
            children: (
              <Space>
                <AuthButton type="custom" code="export">
                  <Button onClick={handleExport} disabled={isProcessing}>
                    导出订单商品清单
                  </Button>
                </AuthButton>
                <Button onClick={handleFahuo} loading={isProcessing} type="primary">
                  批量发货
                </Button>
              </Space>
            ),
            layouts: {},
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

FirstApprovedOrder.defaultProps = {}

export default FirstApprovedOrder

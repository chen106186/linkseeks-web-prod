import React, { useEffect, useState } from 'react'
import { Drawer, Button, Pagination, message } from 'antd'
import { useModalTable } from '../../model/useModalTable'
import { createFormActions, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { mergeChildrenTableColumns, mergeParentTableColumns } from '../../constant'
import styles from './index.less'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { mergeSearchSchema } from './schema'
import NestTable from '@/components/NestTable'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getUnitPriceTotal } from '../../model/useProductTable'
import { authService } from '@apps/services'

export interface MergeOrderModalTableProps {
  title: string
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?(selectionCtl)
  handleUpdate?: any
}

const formActions = createFormActions()

// 合并下单弹窗
const MergeOrderModalTable: React.FC<MergeOrderModalTableProps> = (props) => {
  const { title, type = 'checkbox', schemaAction, confirmModal, currentRef, handleUpdate } = props
  const { visible, setVisible } = useModalTable({ type })
  const { pageStatus } = usePageStatus()
  // 当前点击合并的行
  const [currentClickRow, setCurrentClickRow] = useState<any>()

  const [loading, setLoading] = useState(false)
  const [childSelectedRowKeys, setChildSelectedRowKeys] = useState<any>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [childSelectedRows, setChildSelectedRows] = useState<any>([])
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [dataSource, setDataSource] = useState<any>({ totalCount: 0, data: [] })

  const [page, setPage] = useState({ pageSize: 10, current: 1 })

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        setCurrentClickRow,
      }
    }
  }, [])

  useEffect(() => {
    if (visible) {
      getMergeOrderList(page)
    }
  }, [visible])

  const getMergeOrderList = (params) => {
    setLoading(true)
    let memberId = authService.getAuth().memberId
    // getOrderMergeOrderList({...params, memberId}).then(res => {
    //   setDataSource(res.data)
    //   setLoading(false)
    // })
  }

  // search
  const handleSearch = (values) => {
    getMergeOrderList({ ...values, ...page, current: 1 })
    setPage(() => ({
      ...page,
      current: 1,
    }))
  }

  // operate choose
  const handleParentSelectChange = (record, selected, selectedRows, nativeEvent) => {
    let patentArr = [...selectedRowKeys]
    let childArr = [...childSelectedRowKeys]
    let setChildArr = dataSource.data.find((d) => d.id === record.id).productDateilss.map((item) => item.id)
    if (selected) {
      patentArr.push(record.id)
      childArr = Array.from(new Set([...setChildArr, ...childArr]))
    } else {
      patentArr.splice(
        patentArr.findIndex((item) => item === record.id),
        1,
      )
      childArr = childArr.filter((item) => !setChildArr.some((e) => e === item))
    }
    setSelectedRowKeys(patentArr)
    setChildSelectedRowKeys(childArr)
  }

  const hanldeParentSelectAll = (selected, selectedRows, changeRows) => {
    let patentArr = [...selectedRowKeys]
    let setChildArr = []
    changeRows.forEach((e) => {
      setChildArr = [...setChildArr, ...e.productDateilss.map((item) => item.id)]
    })
    if (selected) {
      patentArr = Array.from(new Set([...patentArr, ...changeRows.map((item) => item.id)]))
      setChildSelectedRowKeys(setChildArr)
    } else {
      patentArr = patentArr.filter((item) => !changeRows.some((e) => e.id === item))
      setChildSelectedRowKeys([])
    }
    setSelectedRowKeys(patentArr)
  }

  const handleChildSelectChange = (record, selected, selectedRows, nativeEvent) => {
    let childArr = [...childSelectedRowKeys]
    if (selected) {
      childArr.push(record.id)
    } else {
      childArr.splice(
        childArr.findIndex((item) => item === record.id),
        1,
      )
    }
    selectedRows = selectedRows.filter((a) => a !== undefined)
    for (let item of dataSource.data) {
      if (item.productDateilss.find((d) => d.id === record.id)) {
        let parentArr = [...selectedRowKeys]
        if (item.productDateilss.length === selectedRows.length) {
          parentArr.push(item.id)
        } else {
          if (parentArr.length && parentArr.find((d) => d === item.id)) {
            parentArr.splice(
              parentArr.findIndex((item1) => item1 === item.id),
              1,
            )
          }
        }
        setSelectedRowKeys(parentArr)
        break
      }
    }
    setChildSelectedRowKeys(childArr)
  }

  const handleChildSelectAll = (selected, selectedRows, changeRows) => {
    let childArr = [...childSelectedRowKeys]
    if (selected) {
      childArr = Array.from(new Set([...childArr, ...changeRows.map((item) => item.id)]))
    } else {
      childArr = childArr.filter((item) => !changeRows.some((e) => e.id === item))
    }
    for (let item of dataSource.data) {
      if (item.productDateilss.find((d) => d.id === changeRows[0].id)) {
        let parentArr = [...selectedRowKeys]
        if (selected) {
          parentArr.push(item.id)
        } else {
          parentArr.splice(
            parentArr.findIndex((item) => item === item.id),
            1,
          )
        }
        setSelectedRowKeys(parentArr)
        break
      }
    }
    setChildSelectedRowKeys(childArr)
  }

  // confirm
  const handleConfirm = async () => {
    if (!childSelectedRowKeys.length) {
      message.error('请选择待合并订单')
      return
    }
    let _originSource = [...dataSource.data]
    // 只选一个子级 selectedRowKeys可能为空
    let _selectedRows = _originSource.filter((item) => selectedRowKeys.includes(item.id))
    setSelectedRows(() => _selectedRows)

    let allchildren = _originSource.map((item) => item['productDateilss']).reduce((prev, next) => prev.concat(next), [])
    let _childSelectedRows = allchildren.filter((item) => childSelectedRowKeys.includes(item.id))
    setChildSelectedRows(() => _childSelectedRows)

    if (
      _childSelectedRows.map((item) => item.productId).filter((_item) => _item !== _childSelectedRows[0]['productId'])
        .length
    ) {
      message.error('请选择待合并订单中商品ID相同的商品')
      return
    }

    // 开始数量合并
    let processOrderProductRequests = schemaAction.getFieldValue('orderProductRequests')
    console.log(processOrderProductRequests, '合并之前')
    let __ = [...processOrderProductRequests].map((item) => {
      item['productId'] = item.productId || item.id
      if (item.id === currentClickRow.id) {
        // let count = _childSelectedRows.length > 1 ? _childSelectedRows.reduce((a, b) => a.purchaseCount + b.purchaseCount) : _childSelectedRows[0].purchaseCount
        // @to fix 第一次合并无法填入采购数量 新增情况下：手工模式不累加，报价单模式累加；编辑模式都累加
        // item["purchaseCount"] = count + (item?.purchaseCount || 0)
        item['purchaseCount'] =
          _childSelectedRows.length > 1
            ? _childSelectedRows.reduce((a, b) => a.purchaseCount + b.purchaseCount)
            : _childSelectedRows[0].purchaseCount
        item['money'] = getUnitPriceTotal(item, pageStatus)
      }
      return item
    })
    console.log('开始合并', __)
    schemaAction.setFieldValue('orderProductRequests', __)

    console.log(
      _originSource,
      selectedRowKeys,
      childSelectedRowKeys,
      selectedRows,
      childSelectedRows,
      _selectedRows,
      _childSelectedRows,
    )

    // 生成orderProducts参数
    let _orderProducts = _childSelectedRows.map((item) => {
      for (let _index in _originSource) {
        let _childKey = _originSource[_index]['productDateilss'].map((_) => _.id)
        if (_childKey.includes(item.id)) {
          return {
            mergeOrderId: _originSource[_index]['id'],
            productId: item['productId'],
          }
        }
      }
    })

    let hasVal = schemaAction.getFieldValue('ordeProducts') || []
    schemaAction.setFieldValue('ordeProducts', [..._orderProducts, ...hasVal])

    // 执行update 更新总价
    handleUpdate()

    confirmModal && confirmModal({ childSelectedRowKeys, _childSelectedRows, selectedRowKeys, _selectedRows })
    setVisible(false)
    clearSelected()
  }

  // cancel
  const handleClose = () => {
    setVisible(false)
    clearSelected()
  }

  const clearSelected = () => {
    setChildSelectedRowKeys([])
    setSelectedRowKeys([])
    setChildSelectedRows([])
    setSelectedRows([])
  }

  const handleAfterVisibleChange = (visible) => {
    if (!visible) {
      handleClose()
    }
  }

  // page
  const handlePaginationChange = (page, pageSize) => {
    setPage(() => ({
      current: page,
      pageSize,
    }))
    getMergeOrderList({ current: page, pageSize })
  }

  const sizeChange = (current, size) => {
    setPage(() => ({
      ...page,
      pageSize: size,
    }))
    getMergeOrderList({ ...page, pageSize: size })
  }

  return (
    <Drawer
      title={title}
      width={1200}
      onClose={handleClose}
      afterVisibleChange={handleAfterVisibleChange}
      visible={visible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={handleClose} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={handleConfirm} type="primary">
            确定
          </Button>
        </div>
      }
      destroyOnClose
    >
      <div className={styles['order-head']}>
        <NiceForm
          actions={formActions}
          onSubmit={handleSearch}
          effects={($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'orderNo', FORM_FILTER_PATH)
          }}
          schema={mergeSearchSchema}
        />
      </div>
      <div className={styles['order-body']}>
        <NestTable
          NestColumns={[mergeParentTableColumns, mergeChildrenTableColumns]}
          className="common_tb"
          rowClassName={(_, index) => index % 2 === 0 && 'tb_bg'}
          rowKey="id"
          childrenDataKey="productDateilss"
          dataSource={dataSource['data']}
          loading={loading}
          childRowSelection={{
            selectedRowKeys: childSelectedRowKeys,
            onSelect: handleChildSelectChange,
            onSelectAll: handleChildSelectAll,
          }}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onSelect: handleParentSelectChange,
            onSelectAll: hanldeParentSelectAll,
          }}
        />
      </div>
      {dataSource['data'] && dataSource['data']['length'] ? (
        <div className={styles['order-foot']}>
          <Pagination
            current={page.current}
            pageSize={page.pageSize}
            total={dataSource['totalCount']}
            onChange={handlePaginationChange}
            showQuickJumper
            showSizeChanger
            showTotal={(total) => `共 ${total} 条`}
            onShowSizeChange={sizeChange}
          />
        </div>
      ) : null}
    </Drawer>
  )
}

MergeOrderModalTable.defaultProps = {}

export default MergeOrderModalTable

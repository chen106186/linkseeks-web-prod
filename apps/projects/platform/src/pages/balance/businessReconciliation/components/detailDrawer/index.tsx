import React, { useState, useEffect, useRef } from 'react'
import { Drawer, Table, Typography, message, Button } from 'antd'
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons'
import type { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'
import { createFormActions } from '@apps/formily'
import { getSettlementBusinessReconciliationToReconciliationList } from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import StatusTag from '@/components/StatusTag'
import Submit from '@/components/NiceForm/components/Submit'
import NiceForm from '@/components/NiceForm'
import { getIntl } from '@linkseeks/i18n'

const { Link } = Typography
const formActions = createFormActions()

interface DetailDrawerProps {
  visible: boolean
  searchParams?: any
  onClose?: () => void
  onOk?: (rows: any) => void
}
const intl = getIntl()
const DetailDrawer: React.FC<DetailDrawerProps> = (props: DetailDrawerProps) => {
  const { visible, searchParams, onClose, onOk } = props
  const ref = useRef<any>({})
  const [childSelectedRowKeys, setChildSelectedRowKeys] = useState<any>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [childSelectedRows, setChildSelectedRows] = useState<any>([])
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [dataSource, setDataSource] = useState<any>([])
  const loadingTableData = async (params) => {
    const _params = { ...params, ...searchParams }
    const { data } = await getSettlementBusinessReconciliationToReconciliationList(_params)
    setDataSource(data)
    return data
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'balance.dingdanhao' }),
      key: 'billNo',
      dataIndex: 'billNo',
      render: (text: any) => <Link>{text}</Link>,
    },
    {
      title: intl.formatMessage({ id: 'balance.fukuanfang' }),
      key: 'payer',
      dataIndex: 'payer',
    },
    {
      title: intl.formatMessage({ id: 'balance.fahuopici' }),
      key: 'deliveryBatch',
      dataIndex: 'deliveryBatch',
      render: (text: any) =>
        intl.formatMessage({
          id: 'balance.businessReconciliation.components.detailDrawer.columns.deliveryBatch.text',
          data: text,
        }),
    },
    {
      title: intl.formatMessage({ id: 'balance.fahuodanhao' }),
      key: 'deliveryNo',
      dataIndex: 'deliveryNo',
      render: (text: any) => <Link>{text}</Link>,
    },
    {
      title: intl.formatMessage({ id: 'balance.fahuoshijian' }),
      key: 'deliveryTime',
      dataIndex: 'deliveryTime',
      render: (text: any) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'balance.shouhuodanhao' }),
      key: 'receiveNo',
      dataIndex: 'receiveNo',
      render: (text: any) => <Link>{text}</Link>,
    },
    {
      title: intl.formatMessage({ id: 'balance.shouhuoshijian' }),
      key: 'receiveTime',
      dataIndex: 'receiveTime',
      render: (text: any) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'balance.dingdanzhuangtai' }),
      key: 'orderStatus',
      dataIndex: 'orderStatus',
      render: (text: any) => <StatusTag type="primary" title={text} />,
    },
    {
      title: intl.formatMessage({ id: 'balance.dingdanleixing' }),
      key: 'orderTypeName',
      dataIndex: 'orderTypeName',
      render: (text: any) => <StatusTag type="primary" title={text} />,
    },
    {
      title: intl.formatMessage({ id: 'balance.danjuleixing' }),
      key: 'billTypeName',
      dataIndex: 'billTypeName',
      render: (text: any) => <StatusTag type="primary" title={text} />,
    },
  ]

  const childColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'balance.jiesuanfangshi' }),
      key: 'payWayName',
      dataIndex: 'payWayName',
    },
    {
      title: intl.formatMessage({ id: 'balance.yujijiesuanriqi' }),
      key: 'expectPayTime',
      dataIndex: 'expectPayTime',
      render: (text: any) => formatTimeString(text, 'YYYY-MM-DD'),
    },
    {
      title: intl.formatMessage({ id: 'balance.wuliaobianhao' }),
      key: 'productNo',
      dataIndex: 'productNo',
    },
    {
      title: intl.formatMessage({ id: 'balance.wuliaomingcheng' }),
      key: 'productName',
      dataIndex: 'productName',
    },
    {
      title: intl.formatMessage({ id: 'balance.guigexinghao' }),
      key: 'spec',
      dataIndex: 'spec',
    },
    {
      title: intl.formatMessage({ id: 'balance.pinlei' }),
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'balance.pinpai' }),
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'balance.danwei' }),
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: intl.formatMessage({ id: 'balance.hanshuishuil' }),
      key: 'taxRate',
      dataIndex: 'taxRate',
      render: (text) => {
        return text > 0
          ? `${intl.formatMessage({ id: 'balance.shi' })}/${text}%`
          : intl.formatMessage({ id: 'balance.fou' })
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.danjia' }),
      key: 'price',
      dataIndex: 'price',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.shouhuoshuliang' }),
      key: 'receiveQuantity',
      dataIndex: 'receiveQuantity',
    },
    {
      title: intl.formatMessage({ id: 'balance.yiduizhangjine' }),
      key: 'reconciledMoney',
      dataIndex: 'reconciledMoney',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.daiduizhangshuliang' }),
      key: 'reconciliationQuantity',
      dataIndex: 'reconciliationQuantity',
    },
    {
      title: intl.formatMessage({ id: 'balance.daiduizhangjine' }),
      key: 'reconciliationMoneyAmount',
      dataIndex: 'reconciliationMoneyAmount',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
  ]

  const handleChildSelectChange = (record, selected, selectedRow) => {
    const childArr = [...childSelectedRowKeys]
    const childRowArr = [...childSelectedRows]
    if (selected) {
      childArr.push(record.productId)
      childRowArr.push(record)
    } else {
      childArr.splice(
        childArr.findIndex((item) => item === record.productId),
        1,
      )
      childRowArr.splice(
        childRowArr.findIndex((item) => item.productId === record.productId),
        1,
      )
    }
    const _selectedRow = selectedRow.filter((a) => a !== undefined)
    for (const item of dataSource.data) {
      if (item.products.find((d) => d.productId === record.productId)) {
        const parentArr = [...selectedRowKeys]
        const parentRowArr = [...selectedRows]
        if (_selectedRow.length > 0) {
          if (!parentArr.includes(item.id)) {
            parentArr.push(item.id)
            parentRowArr.push(item)
          }
        } else {
          if (parentArr.length && parentArr.find((d) => d === item.id)) {
            parentArr.splice(
              parentArr.findIndex((item1) => item1 === item.id),
              1,
            )
            parentRowArr.splice(
              parentRowArr.findIndex((item1) => item1.id === item.id),
              1,
            )
          }
        }
        setSelectedRows(parentRowArr)
        setSelectedRowKeys(parentArr)
        break
      }
    }
    setChildSelectedRows(childRowArr)
    setChildSelectedRowKeys(childArr)
  }

  const handleChildSelectAll = (selected, selectedRow, changeRows) => {
    let childArr = [...childSelectedRowKeys]
    let childRowArr = [...childSelectedRows]
    if (selected) {
      childArr = Array.from(new Set([...childArr, ...changeRows.map((item) => item.productId)]))
      childRowArr = Array.from(new Set([...childRowArr, ...changeRows]))
    } else {
      childArr = childArr.filter((item) => !changeRows.some((e) => e.productId === item))
      childRowArr = childRowArr.filter((item) => !changeRows.some((e) => e.productId === item.productId))
    }
    for (const item of dataSource.data) {
      if (item.products.find((d) => d.productId === changeRows[0].productId)) {
        const parentArr = [...selectedRowKeys]
        const parentRowArr = [...selectedRows]
        if (selected) {
          if (!parentArr.includes(item.id)) {
            parentArr.push(item.id)
            parentRowArr.push(item)
          }
        } else {
          parentArr.splice(
            parentArr.findIndex((item1) => item1 === item.id),
            1,
          )
          parentRowArr.splice(
            parentRowArr.findIndex((item1) => item1.id === item.id),
            1,
          )
        }
        setSelectedRows(parentRowArr)
        setSelectedRowKeys(parentArr)
        break
      }
    }
    setChildSelectedRows(childRowArr)
    setChildSelectedRowKeys(childArr)
  }

  const handleParentSelectChange = (record, selected) => {
    const patentArr = [...selectedRowKeys]
    const patentRowArr = [...selectedRows]
    let childArr = [...childSelectedRowKeys]
    let childRowArr = [...childSelectedRows]
    const setChildArr = dataSource.data.find((d) => d.id === record.id).products.map((item) => item.productId)
    const setChildRowArr = dataSource.data.find((d) => d.id === record.id).products
    if (selected) {
      patentArr.push(record.id)
      patentRowArr.push(record)
      childArr = Array.from(new Set([...setChildArr, ...childArr]))
      childRowArr = Array.from(new Set([...setChildRowArr, ...childRowArr]))
    } else {
      patentArr.splice(
        patentArr.findIndex((item) => item === record.id),
        1,
      )
      patentRowArr.splice(
        patentRowArr.findIndex((item) => item.id === record.id),
        1,
      )
      childArr = childArr.filter((item) => !setChildArr.some((e) => e === item))
      childRowArr = childRowArr.filter((item) => !setChildRowArr.some((e) => e.productId === item.productId))
    }
    setSelectedRows(patentRowArr)
    setSelectedRowKeys(patentArr)
    setChildSelectedRows(childRowArr)
    setChildSelectedRowKeys(childArr)
  }

  const hanldeParentSelectAll = (selected, selectedRow, changeRows) => {
    let patentArr = [...selectedRowKeys]
    let patentRowArr = [...selectedRows]
    let setChildArr = []
    let setChildRowArr = []
    changeRows.forEach((e) => {
      setChildArr = [...setChildArr, ...e.products.map((item) => item.productId)]
      setChildRowArr = [...setChildRowArr, ...e.products]
    })
    if (selected) {
      patentArr = Array.from(new Set([...patentArr, ...changeRows.map((item) => item.id)]))
      patentRowArr = Array.from(new Set([...patentRowArr, ...changeRows]))
      setChildSelectedRows(setChildRowArr)
      setChildSelectedRowKeys(setChildArr)
    } else {
      patentArr = patentArr.filter((item) => !changeRows.some((e) => e.id === item))
      patentRowArr = patentRowArr.filter((item) => !changeRows.some((e) => e.id === item.id))
      setChildSelectedRows([])
      setChildSelectedRowKeys([])
    }
    setSelectedRows(patentRowArr)
    setSelectedRowKeys(patentArr)
  }

  const childRenderTable = (record) => {
    return (
      <Table
        columns={childColumns}
        size="middle"
        dataSource={record.products || []}
        rowKey="productId"
        rowSelection={{
          selectedRowKeys: childSelectedRowKeys,
          onSelect: handleChildSelectChange,
          onSelectAll: handleChildSelectAll,
        }}
        pagination={false}
      />
    )
  }

  const _onOk = () => {
    if (selectedRowKeys.length <= 0) {
      message.error(
        intl.formatMessage({
          id: 'balance.businessReconciliation.components.detailDrawer.message.1',
        }),
      )
      return
    }
    for (const item of selectedRows) {
      if (item.payer !== selectedRows[0].payer) {
        message.error(
          intl.formatMessage({
            id: 'balance.businessReconciliation.components.detailDrawer.message.2',
          }),
        )
        return
      }
    }
    for (const child of childSelectedRows) {
      if (child.taxRate !== childSelectedRows[0].taxRate) {
        message.error(
          intl.formatMessage({
            id: 'balance.businessReconciliation.components.detailDrawer.message.2',
          }),
        )
        return
      }
    }
    const _rows = []
    selectedRows.forEach((item) => {
      item.products.forEach((child) => {
        if (childSelectedRowKeys.includes(child.productId)) {
          _rows.push({
            ...child,
            ...item,
            orderId: item.billId,
            orderNo: item.billNo,
            expectPayTime: formatTimeString(child?.expectPayTime, 'YYYY-MM-DD'),
          })
        }
      })
    })

    console.log(_rows)
    onOk?.(_rows)
  }

  useEffect(() => {
    if (visible) {
      ref?.current?.reloadCurrent()
    } else {
      setChildSelectedRowKeys([])
      setSelectedRowKeys([])
      setChildSelectedRows([])
      setSelectedRows([])
    }
  }, [visible])

  return (
    <Drawer
      title={intl.formatMessage({ id: 'balance.xuanzedaiduizhangmingxi' })}
      placement={'right'}
      onClose={onClose}
      visible={visible}
      key={'right'}
      width={'80%'}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'balance.quxiao' })}
          </Button>
          <Button onClick={_onOk} type="primary">
            {intl.formatMessage({ id: 'balance.tijiao' })}
          </Button>
        </div>
      }
    >
      <StandardTable
        keepAlive={false}
        fetchTableData={(params) => loadingTableData(params)}
        columns={columns}
        currentRef={ref}
        rowKey="id"
        tableProps={{
          expandable: {
            expandedRowRender: childRenderTable,
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
              ) : (
                <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
              ),
          },
        }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onSelect: handleParentSelectChange,
          onSelectAll: hanldeParentSelectAll,
        }}
        controlRender={
          <NiceForm
            actions={formActions}
            onSubmit={(values) => ref.current.reload(values)}
            effects={($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'billNo', FORM_FILTER_PATH)
            }}
            schema={{
              type: 'object',
              properties: {
                mageLayout: {
                  type: 'object',
                  'x-component': 'mega-layout',
                  'x-component-props': {
                    grid: true,
                  },
                  properties: {
                    billNo: {
                      type: 'string',
                      'x-component': 'Search',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'balance.qingshurudingdanhao' }),
                        align: 'flex-start',
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
                      justifyContent: 'flex-start',
                    },
                    colStyle: {
                      marginRight: 16,
                    },
                  },
                  properties: {
                    deliveryBatch: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'balance.qingshurufahuopici' }),
                        allowClear: true,
                      },
                    },
                    deliveryNo: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'balance.qingshurufahuodanhao' }),
                        allowClear: true,
                      },
                    },
                    receiveNo: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'balance.qingshurushouhuodanhao' }),
                        allowClear: true,
                      },
                    },
                    '[expectPayTimeStart,expectPayTimeEnd]': {
                      type: 'string',
                      'x-component': 'daterange',
                      'x-component-props': {
                        placeholder: [
                          intl.formatMessage({ id: 'balance.yujijiesuankaishishijian' }),
                          intl.formatMessage({ id: 'balance.yujijiesuanjieshushijian' }),
                        ],
                        allowClear: true,
                      },
                    },
                    submit: {
                      'x-component': 'Submit',
                      'x-component-props': {
                        children: intl.formatMessage({ id: 'balance.chaxun' }),
                      },
                    },
                  },
                },
              },
            }}
            components={{
              Submit,
            }}
          />
        }
      />
    </Drawer>
  )
}

export default DetailDrawer

/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useRef, useState } from 'react'
import type { FormInstance } from 'antd'
import { Card, Typography, Space, Button, Table, message, Form, InputNumber } from 'antd'
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons'
import type { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { AuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { priceFormat } from '@/utils/numberFomat'
import {
  getSettlementBusinessReconciliationToReconciliationList,
  getSettlementBusinessReconciliationItemPayType,
  postSettlementBusinessReconciliationUpdatePrice,
} from '@apps/apis'
import { createFormActions } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'

import { fetchOptions } from '../../common'
import { EditIcon } from '@linkseeks/icons'

const intl = getIntl()
const { Link } = Typography

// 待对账列表

const formActions = createFormActions()

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  form: FormInstance
  editing: boolean
  dataIndex: string
  title: any
  record: any
  index: number
  children: React.ReactNode
  handleSave: <T>(arg: T) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  form,
  dataIndex,
  title,
  record,
  index,
  children,
  handleSave,
  ...restProps
}) => {
  const save = async () => {
    try {
      const values = await form.validateFields()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              validator: async (_, value) => {
                const _pattern = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
                if (!value) {
                  return Promise.reject(new Error(`${title}不为空或大于0`))
                }
                if (!_pattern.test(value)) {
                  return Promise.reject(new Error('最多保留2位小数'))
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <InputNumber onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const ReadyReconciliation: React.FC = () => {
  const ref = useRef<any>({})
  const [form] = Form.useForm()
  const [childSelectedRowKeys, setChildSelectedRowKeys] = useState<any>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [childSelectedRows, setChildSelectedRows] = useState<any>([])
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [dataSource, setDataSource] = useState<any>([])
  const loadingTableData = async (params) => {
    const { data } = await getSettlementBusinessReconciliationToReconciliationList(params)
    const _data = {
      data: data.data.map((m) => ({
        ...m,
        products: m?.products?.map((p) => ({
          ...p,
          currencyTypeName: m.currencyTypeName,
          parentId: m.id,
          billNo: m?.billNo,
          receiveNo: m?.receiveNo,
        })),
      })),
      totalCount: data?.totalCount,
    }
    setDataSource(_data)
    return _data
  }

  const [editingKey, setEditingKey] = useState('')

  const isEditing = (record) => `${record?.parentId}_${record?.productId}` === editingKey

  const handleEdit = (record) => {
    form.setFieldsValue({ ...record })
    setEditingKey(`${record?.parentId}_${record?.productId}`)
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
          id: 'balance.businessReconciliation.readyReconciliation.columns.deliveryBatch.text',
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

  const childColumns: (ColumnType<any> & { editable?: boolean })[] = [
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
      title: intl.formatMessage({ id: 'balance.bizhong' }),
      key: 'currencyTypeName',
      dataIndex: 'currencyTypeName',
    },
    {
      title: `${intl.formatMessage({ id: 'balance.danjia' })}(${intl.formatMessage({
        id: 'balance.hanshui',
      })})`,
      key: 'price',
      dataIndex: 'price',
      editable: true,
      render: (text: any, record) => (
        <Space>
          <Typography.Text>{priceFormat(text)}</Typography.Text>
          <EditIcon onClick={() => handleEdit(record)} />
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'balance.shouhuoshuliang' }),
      key: 'receiveQuantity',
      dataIndex: 'receiveQuantity',
    },
    {
      title: intl.formatMessage({ id: 'balance.yantuishuliang', defaultMessage: '验退数量' }),
      key: 'rejectCount',
      dataIndex: 'rejectCount',
      render: (text: any) => text || '--',
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessReconciliation.readyReconciliation.columns.reconciledQuantity',
      }),
      key: 'reconciledQuantity',
      dataIndex: 'reconciledQuantity',
    },
    {
      title: `${intl.formatMessage({ id: 'balance.yiduizhangjine' })}(${intl.formatMessage({
        id: 'balance.hanshui',
      })})`,
      key: 'reconciledMoney',
      dataIndex: 'reconciledMoney',
      render: (text: any) => priceFormat(text),
    },
    {
      title: intl.formatMessage({ id: 'balance.daiduizhangshuliang' }),
      key: 'reconciliationQuantity',
      dataIndex: 'reconciliationQuantity',
    },
    {
      title: `${intl.formatMessage({ id: 'balance.daiduizhangjine' })}(${intl.formatMessage({
        id: 'balance.hanshui',
      })})`,
      key: 'reconciliationMoneyAmount',
      dataIndex: 'reconciliationMoneyAmount',
      render: (text: any) => priceFormat(text),
    },
  ]

  const handleSave = (record) => {
    const param = {
      billNo: record?.billNo,
      receiveNo: record?.receiveNo,
      productNo: record?.productNo,
      price: record?.price,
    }
    postSettlementBusinessReconciliationUpdatePrice(param).then((res) => {
      if (res.code !== 1000) {
        return
      }
      setEditingKey('')
      ref.current.reloadCurrent()
    })
  }

  const childEditColumns = childColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        form,
        editing: isEditing(record),
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

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
    selectedRow = selectedRow.filter((a) => a !== undefined)
    for (const item of dataSource.data) {
      if (item.products.find((d) => d.productId === record.productId)) {
        const parentArr = [...selectedRowKeys]
        const parentRowArr = [...selectedRows]
        if (selectedRow.length > 0) {
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
            parentArr.findIndex((item) => item === item.id),
            1,
          )
          parentRowArr.splice(
            parentRowArr.findIndex((item) => item.id === item.id),
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
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={childEditColumns as (ColumnType<any> & { editable?: boolean })[]}
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
      </Form>
    )
  }

  const _generate = () => {
    if (selectedRowKeys.length <= 0) {
      message.error(intl.formatMessage({ id: 'balance.businessReconciliation.readyReconciliation.message.1' }))
      return
    }
    for (const item of selectedRows) {
      if (item.payer !== selectedRows[0].payer) {
        message.error(
          intl.formatMessage({
            id: 'balance.businessReconciliation.readyReconciliation.message.2',
          }),
        )
        return
      }
    }
    for (const child of childSelectedRows) {
      if (child.taxRate !== childSelectedRows[0].taxRate) {
        message.error(
          intl.formatMessage({
            id: 'balance.businessReconciliation.readyReconciliation.message.2',
          }),
        )
        return
      }
    }
    const _rows = []
    for (const key in selectedRows) {
      const _item = {
        ...selectedRows[key],
        orderId: selectedRows[key].billId,
        orderNo: selectedRows[key].billNo,
      }
      const _products = []
      for (const childKey in _item.products) {
        if (childSelectedRowKeys.includes(_item.products[childKey].productId)) {
          _products.push({
            ..._item.products[childKey],
            expectPayTime: formatTimeString(_item.products[childKey]?.expectPayTime, 'YYYY-MM-DD'),
          })
        }
      }
      _item.products = [..._products]
      if (_item.products.length > 0) {
        _rows.push(_item)
      }
    }
    console.log(_rows)
    history.push('/balance/businessReconciliation/readyAdd/add', { rows: _rows })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
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
                useAsyncSelect('payWay', fetchOptions(getSettlementBusinessReconciliationItemPayType))
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
                      ctl: {
                        type: 'object',
                        'x-component': 'controllerBtns',
                      },
                      billNo: {
                        type: 'string',
                        'x-component': 'Search',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'balance.qingshurudingdanhao' }),
                          align: 'flex-end',
                          allowClear: true,
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
                      payer: {
                        type: 'string',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'balance.qingshurufukuanfang' }),
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
                      payWay: {
                        type: 'string',
                        'x-component-props': {
                          placeholder: intl.formatMessage({
                            id: 'balance.qingxuanzejiesuanfangshi',
                          }),
                          allowClear: true,
                        },
                        enum: [],
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
                controllerBtns: () => (
                  <Space>
                    <AuthButton type="custom" code="shengchengduizhangdan">
                      <Button size="middle" onClick={_generate}>
                        {intl.formatMessage({ id: 'balance.shengchengduizhangdan' })}
                      </Button>
                    </AuthButton>
                  </Space>
                ),
              }}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default ReadyReconciliation

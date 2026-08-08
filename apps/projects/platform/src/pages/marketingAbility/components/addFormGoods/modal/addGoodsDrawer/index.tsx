import { useIntl } from '@linkseeks/i18n'
import React, { useRef, useCallback, useEffect, useState } from 'react'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { Space, Button, Typography, Drawer } from 'antd'

import { priceFormat } from '@/utils/numberFomat'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'

const { Text } = Typography
const formActions = createFormActions()

interface AddGoodsDrawerProps {
  visible: boolean
  onClose?: Function
  onConfirm?: Function
  effects?: string
  fetch?: Promise<any>
}

const AddGoodsDrawer: React.FC<AddGoodsDrawerProps> = (props: any) => {
  const intl = useIntl()
  const { visible, onClose, onConfirm, effects, fetch } = props
  /**多选 */
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number>>([])
  const [selectedRows, setSelectedRows] = useState<Array<any>>([])
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
    },
  }

  const tableRef = useRef<any>({})
  useEffect(() => {
    if (visible) {
      tableRef.current?.reload && tableRef.current?.reloadCurrent()
    }
  }, [visible])

  const columns: ColumnType<any>[] = [
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.xuhao' })}`,
      align: 'left',
      dataIndex: 'id',
      key: 'id',
      render: (t, r, i) => t,
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.shangpintupian' })}`,
      key: 'img',
      dataIndex: 'img',
      render: (text: any, record: any) => text,
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.shangpinmingcheng' })}`,
      key: 'name',
      dataIndex: 'name',
      render: (text: any, record: any) => text,
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.pinlei' })}`,
      key: 'category',
      dataIndex: 'category',
      render: (text: any, record: any) => text,
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.pinpai' })}`,
      key: 'brand',
      dataIndex: 'brand',
      render: (text: any, record: any) => text,
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.shangpinzhuangtai' })}`,
      key: 'status',
      dataIndex: 'status',
      render: (text: any, record: any) => text,
    },
  ]

  /** 列表数据 */
  const fetchData = useCallback((params?: any) => {
    return new Promise((resolve, reject) => {
      visible &&
        fetch({ ...params }).then((res) => {
          resolve(res.data)
        })
    })
  }, [])

  // 搜索
  const search = (values: any) => {
    tableRef.current.reload(values)
  }

  const _onConfirm = () => {
    onConfirm && onConfirm(selectedRows)
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: 'marketingAbility.xuanzeshangpin' })}
      width={1200}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'marketingAbility.quxiao' })}
          </Button>
          <Button onClick={_onConfirm} type="primary">
            {intl.formatMessage({ id: 'marketingAbility.queding' })}
          </Button>
        </div>
      }
    >
      <StandardTable
        currentRef={tableRef}
        columns={columns}
        rowSelection={rowSelection}
        tableProps={{ rowKew: 'id' }}
        fetchTableData={(params: any) => fetchData(params)}
        formilyProps={{
          ctx: {
            inline: false,
            onSubmit: (values) => search(values),
            effects: ($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, effects, FORM_FILTER_PATH)
            },
            schema: {
              type: 'object',
              properties: {
                megalayout: {
                  type: 'object',
                  'x-component': 'mega-layout',
                  properties: {
                    name: {
                      type: 'string',
                      'x-component': 'SearchFilter',
                      'x-mega-props': {},
                      'x-component-props': {
                        placeholder: `${intl.formatMessage({ id: 'marketingAbility.sousuo' })}`,
                        align: 'flex-left',
                      },
                    },
                  },
                },
                [FORM_FILTER_PATH]: {
                  type: 'object',
                  'x-component': 'flex-layout',
                  'x-component-props': {
                    rowStyle: {
                      justifyContent: 'flex-start',
                      flexWrap: 'nowrap',
                    },
                    colStyle: {
                      //改变间隔
                      marginRight: 20,
                    },
                  },
                  properties: {
                    PRO_LAYOUT: {
                      type: 'object',
                      'x-component': 'mega-layout',
                      'x-mega-props': {
                        span: 5,
                      },
                      'x-component-props': {
                        inline: true,
                      },
                      properties: {
                        category: {
                          type: 'string',
                          'x-component-props': {
                            placeholder: `${intl.formatMessage({ id: 'marketingAbility.shangpinpinlei' })}`,
                          },
                        },
                        brand: {
                          type: 'string',
                          'x-component-props': {
                            placeholder: `${intl.formatMessage({ id: 'marketingAbility.shangpinpinpai' })}`,
                          },
                        },
                      },
                    },
                    sumbit: {
                      'x-component': 'Submit',
                      'x-mega-props': {
                        span: 1,
                      },
                      'x-component-props': {
                        children: `${intl.formatMessage({ id: 'marketingAbility.chaxun' })}`,
                      },
                    },
                  },
                },
              },
            },
            components: {
              Submit,
            },
          },
        }}
      />
    </Drawer>
  )
}
export default AddGoodsDrawer

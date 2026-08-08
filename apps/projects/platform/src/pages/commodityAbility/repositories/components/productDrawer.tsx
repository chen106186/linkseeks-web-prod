import React, { ReactText, useRef, useEffect, useLayoutEffect } from 'react'
import { createFormActions, FormEffectHooks, ISchema } from '@apps/formily'
import { ColumnType } from 'antd/lib/table/interface'
import { Drawer, Space, Button, Image } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useCustomerCategoriesBusinessEffects } from '@/formSchema/effects/useCustomerCategoriesBusinessEffects'
import { getProductCommodityCommonGetCommodityListBySeller } from '@apps/apis'

export interface ProductDrawerProps {
  currentRef: any
  visible: boolean
  cancel: () => void
  confirm: (data: any) => void
  selectRows?: any[]
}

const ProductDrawer: React.FC<ProductDrawerProps> = (props) => {
  const { currentRef, visible, cancel, confirm, selectRows } = props
  const intl = useIntl()

  const selfRef = currentRef || useRef<any>({})
  const [rowSelection, RowCtl] = useRowSelectionTable({ customKey: 'id' })
  const formActions = createFormActions()

  useEffect(() => {
    if (visible) {
      // 重新开启时需reload接口
      // fix: 去掉自动reload接口, 防止重复请求
      // fix: 新增forceRender接口， 用于控制弹窗是否需要reload
      selfRef.current.reload && selfRef.current.reload()
    } else {
      selfRef.current.resetField &&
        selfRef.current.resetField({
          validate: false,
        })
    }
  }, [visible])

  useEffect(() => {
    RowCtl.setSelectRow(selectRows)
    RowCtl.setSelectedRowKeys(selectRows?.map((item) => item.id) ?? [])
  }, [selectRows])

  const defaultColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'repositories.components.batchPositionSetting.columnsSetProduct.id' }),
      dataIndex: 'commodityId',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.shangpintupian' }),
      dataIndex: 'mainPic',
      width: 80,
      render: (text) => <Image width={32} height={32} src={text} />,
    },
    {
      title: intl.formatMessage({ id: 'repositories.components.batchPositionSetting.columnsSetProduct.name' }),
      dataIndex: 'name',
      width: 360,
    },
    {
      title: intl.formatMessage({
        id: 'repositories.components.batchPositionSetting.columnsSetProduct.customerCategoryName',
      }),
      dataIndex: 'customerCategoryName',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'repositories.components.batchPositionSetting.columnsSetProduct.brandName' }),
      dataIndex: 'brandName',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'repositories.components.productDrawer.upperMemberName' }),
      dataIndex: 'upperMemberName',
      width: 248,
    },
    {
      title: intl.formatMessage({ id: 'commodity.products.columns.type' }),
      dataIndex: 'type',
      width: 256,
      render: (text) => intl.formatMessage({ id: `commodity.products.columns.type.${text}` }),
    },
  ]

  const repositSchema: ISchema = {
    type: 'object',
    properties: {
      megaLayout: {
        type: 'object',
        'x-component': 'mega-layout',
        properties: {
          topLayout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              grid: true,
              justifyContent: 'flex-start',
            },
            properties: {
              name: {
                type: 'string',
                'x-component': 'Search',
                'x-mega-props': {},
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'components.sousuo', defaultMessage: '搜索' }),
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
                flexWrap: 'wrap',
                width: '100%',
                justifyContent: 'flex-start',
              },
              colStyle: {
                marginRight: 20,
              },
            },
            properties: {
              customerCategoryId: {
                type: 'string',
                'x-component': 'CustomCategorySearch',
                'x-component-props': {
                  placeholder: intl.formatMessage({
                    id: 'purchaseRequisition.shangpinpinlei',
                    defaultMessage: '商品品类',
                  }),
                  showSearch: true,
                  notFoundContent: null,
                  style: { width: '145px' },
                  dataoption: [],
                  fieldNames: { label: 'name', value: 'id', children: 'children' },
                },
              },
              submit: {
                'x-component': 'Submit',
                'x-mega-props': {
                  span: 1,
                },
                'x-component-props': {
                  children: intl.formatMessage({ id: 'purchaseRequisition.chaxun', defaultMessage: '查询' }),
                },
              },
            },
          },
        },
      },
    },
  }

  const fetchData = (params: any) => {
    return new Promise((resolve, reject) => {
      getProductCommodityCommonGetCommodityListBySeller({
        ...params,
        shopType: 1,
        environment: 1,
        isGoods: true,
        statusList: '4,5,6,7',
      }).then((res) => {
        resolve(res.data)
      })
    })
  }

  const _confirm = () => {
    confirm(RowCtl.selectRow)
  }

  return (
    <Drawer
      width={1200}
      title={intl.formatMessage({ id: 'repositories.components.positionSetting.modalTable.2' })}
      onClose={cancel}
      open={visible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={cancel} style={{ marginRight: 16 }}>
            {intl.formatMessage({ id: 'components.quxiao', defaultMessage: '取消' })}
          </Button>
          <Button type="primary" onClick={_confirm}>
            {intl.formatMessage({ id: 'components.queding', defaultMessage: '确定' })}
          </Button>
        </div>
      }
    >
      <StandardTable
        columns={defaultColumns}
        currentRef={selfRef}
        tableProps={{ rowKey: 'id' }}
        rowSelection={rowSelection}
        fetchTableData={(params: any) => fetchData(params)}
        controlRender={
          <NiceForm
            actions={formActions}
            onSubmit={(values) => selfRef.current.reload(values)}
            effects={($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              // 初始化品类数据
              useCustomerCategoriesBusinessEffects($, actions, {
                fieldName: 'customerCategoryId',
              })
            }}
            schema={repositSchema}
          />
        }
      />
    </Drawer>
  )
}

ProductDrawer.defaultProps = {}

export default ProductDrawer

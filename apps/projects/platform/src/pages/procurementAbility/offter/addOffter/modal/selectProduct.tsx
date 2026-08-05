import React, { useEffect, useRef } from 'react'
import { Drawer, Button } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { searchSelectGetSelectCategoryOptionEffect } from '@/pages/transaction/effect/index'
import { OfferProductSchema } from '../../../schema'
import { ISchema } from '@apps/formily'
import {
  getProductCommodityCommonGetCommodityListBySeller,
  getProductSelectGetSelectBrand,
  getProductSelectGetSelectCustomerCategory,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

const formActions = createFormActions()

interface Iprops {
  id?: number
  visible: boolean
  onclose?()
  confirm?(e: any)
}
const intl = getIntl()
const SelectProduct: React.FC<Iprops> = (props: any) => {
  const ref = useRef<any>({})
  const { id, visible, onclose, confirm } = props
  const [rowSelection, RowCtl] = useRowSelectionTable({ customKey: 'id', type: 'radio' })
  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.goodstName' }),
      key: 'name',
      dataIndex: 'name',
      render: (name, record) => {
        return `${name}${record.commodityAttribute ? `/${record.commodityAttribute}` : ''}`
      },
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
      key: 'customerCategoryName',
      dataIndex: 'customerCategoryName',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.brand' }),
      key: 'brandName',
      dataIndex: 'brandName',
    },
  ]
  const fetchGoodsData = (params: any) => {
    return new Promise((resolve) => {
      const data = {
        environment: 1,
        shopType: 1,
        priceTypeList: '1,2',
      }
      getProductCommodityCommonGetCommodityListBySeller({ ...params, ...data }).then((res) => {
        resolve(res.data)
      })
    })
  }
  /** 关闭 */
  const onClose = () => {
    onclose()
    RowCtl.setSelectRow([])
    RowCtl.setSelectedRowKeys([])
  }

  /** schema */
  const SELECT_PRODUCTS_SCHEMA: ISchema = {
    type: 'object',
    properties: {
      megalayout: {
        type: 'object',
        'x-component': 'mega-layout',
        properties: {
          name: {
            type: 'string',
            'x-component': 'Search',
            'x-mega-props': {},
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'detail.purchase.goodstName' }),
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
            'x-component': 'flex-layout',
            'x-mega-props': {
              span: 5,
            },
            'x-component-props': {
              inline: true,
              colStyle: {
                //改变间隔
                marginRight: 20,
              },
            },
            properties: {
              customerCategoryId: {
                type: 'string',
                'x-component': 'SearchSelect',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
                  fetchSearch: getProductSelectGetSelectCustomerCategory,
                  style: {
                    width: 160,
                  },
                },
              },
              brandId: {
                type: 'string',
                'x-component': 'SearchSelect',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'detail.purchase.brand' }),
                  fetchSearch: getProductSelectGetSelectBrand,
                  style: {
                    width: 160,
                  },
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
              children: intl.formatMessage({ id: 'detail.purchase.search' }),
            },
          },
        },
      },
    },
  }

  // 搜索
  const search = (values: any) => {
    ref.current.reload(values)
  }

  useEffect(() => {
    if (id) {
      RowCtl.setSelectedRowKeys([id])
    } else {
      RowCtl.setSelectedRowKeys([])
    }
  }, [visible])

  return (
    <Drawer
      open={visible}
      onClose={onclose}
      title={intl.formatMessage({ id: 'detail.purchase.selectGoods' })}
      width={900}
      zIndex={999}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'detail.purchase.cancel' })}
          </Button>
          <Button onClick={() => confirm(RowCtl.selectRow[0])} type="primary">
            {intl.formatMessage({ id: 'detail.purchase.confirm' })}
          </Button>
        </div>
      }
    >
      <StandardTable
        currentRef={ref}
        columns={columns}
        tableProps={{ rowKew: 'id' }}
        rowSelection={rowSelection}
        fetchTableData={(params) => fetchGoodsData(params)}
        controlRender={
          <NiceForm
            actions={formActions}
            onSubmit={(values) => search(values)}
            effects={($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              FormEffectHooks.onFieldChange$('category').subscribe((state) => {
                searchSelectGetSelectCategoryOptionEffect(actions, 'category')
              })
            }}
            schema={SELECT_PRODUCTS_SCHEMA}
          ></NiceForm>
        }
      />
    </Drawer>
  )
}
export default SelectProduct

import React, { useRef } from 'react'
import { Drawer, Button } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { searchSelectGetSelectCategoryOptionEffect } from '@/pages/transaction/effect/index'
import { OfferProductSchema } from '../../schema'
import { getProductCommodityCommonGetCommodityListBySeller } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

const formActions = createFormActions()
const intl = getIntl()
interface Iprops {
  visible: boolean
  onclose?()
  confirm?(e: any)
}

const SelectProduct: React.FC<Iprops> = (props: any) => {
  const ref = useRef({})
  const { visible, onclose, confirm } = props
  const [rowSelection, RowCtl] = useRowSelectionTable({ customKey: 'id', type: 'radio' })
  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'contract.shangpinmingcheng' }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'contract.pinlei' }),
      key: 'customerCategoryName',
      dataIndex: 'customerCategoryName',
    },
    {
      title: intl.formatMessage({ id: 'contract.pinpai' }),
      key: 'brandName',
      dataIndex: 'brandName',
      render: (text: any) => <span>{text}</span>,
    },
  ]
  const fetchGoodsData = (params: any) => {
    return new Promise((resolve) => {
      getProductCommodityCommonGetCommodityListBySeller({ ...params, environment: 1, shopType: 1 })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          resolve([])
        })
    })
  }
  /** 关闭 */
  const onClose = () => {
    onclose()
    RowCtl.setSelectRow([])
    RowCtl.setSelectedRowKeys([])
  }
  const onconfirm = () => {
    confirm(RowCtl.selectRow[0])
    RowCtl.setSelectRow([])
    RowCtl.setSelectedRowKeys([])
  }
  return (
    <Drawer
      visible={visible}
      onClose={onclose}
      title={intl.formatMessage({ id: 'contract.xuanzeshangpin' })}
      width={900}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'contract.quxiao' })}
          </Button>
          <Button onClick={onconfirm} type="primary">
            {intl.formatMessage({ id: 'contract.queding' })}
          </Button>
        </div>
      }
      destroyOnClose
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
            effects={($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              FormEffectHooks.onFieldChange$('category').subscribe((state) => {
                searchSelectGetSelectCategoryOptionEffect(actions, 'category')
              })
            }}
            schema={OfferProductSchema}
          ></NiceForm>
        }
      />
    </Drawer>
  )
}
export default SelectProduct

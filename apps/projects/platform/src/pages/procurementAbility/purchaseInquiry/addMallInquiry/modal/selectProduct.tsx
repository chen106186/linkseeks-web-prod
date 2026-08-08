import React, { useRef } from 'react'
import { Drawer, Button, Cascader } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { searchSelectGetSelectCategoryOptionEffect } from '@/pages/transaction/effect/index'
import { useAsyncCascader, fetchTreeData } from '../../../effect'
import { SelectProductSchema } from '../../../schema'
import { getProductMaterielGetMaterielList } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

const formActions = createFormActions()

interface Iprops {
  visible: boolean
  onclose?()
  confirm?(e: any)
}
const intl = getIntl()
const SelectProduct: React.FC<Iprops> = (props: any) => {
  const ref = useRef({})
  const { visible, onclose, confirm } = props
  const [rowSelection, RowCtl] = useRowSelectionTable({ customKey: 'id', type: 'radio' })
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.code' }),
      key: 'code',
      dataIndex: 'code',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.productName' }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.nameCode' }),
      key: 'type',
      dataIndex: 'type',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
      key: 'customerCategory',
      dataIndex: 'customerCategory',
      render: (text: any) => <span>{text && Object.keys(text).length > 0 && text.name}</span>,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.brand' }),
      key: 'brand',
      dataIndex: 'brand',
      render: (text: any) => <span>{text && Object.keys(text).length > 0 && text.name}</span>,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.unitName' }),
      key: 'unitName',
      dataIndex: 'unitName',
    },
  ]
  const fetchGoodsData = (params: any) => {
    const materialGroupId = params.materialGroupId
      ? params.materialGroupId[params.materialGroupId.length - 1]
      : undefined
    return new Promise((resolve) => {
      getProductMaterielGetMaterielList({ ...params, materialGroupId })
        .then((res) => {
          const { data } = res
          resolve(data)
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }

  return (
    <Drawer
      visible={visible}
      onClose={onclose}
      title={intl.formatMessage({ id: 'detail.purchase.modalTitle1' })}
      width={900}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={onclose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'detail.purchase.cancel' })}
          </Button>
          <Button onClick={() => confirm(RowCtl)} type="primary">
            {intl.formatMessage({ id: 'detail.purchase.confirm' })}
          </Button>
        </div>
      }
    >
      <StandardTable
        currentRef={ref}
        columns={columns}
        tableProps={{ rowkey: 'id' }}
        rowSelection={rowSelection}
        fetchTableData={(params) => fetchGoodsData(params)}
        controlRender={
          <NiceForm
            components={{ Cascader }}
            actions={formActions}
            effects={($, actions) => {
              useAsyncCascader('materialGroupId', fetchTreeData)
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              FormEffectHooks.onFieldChange$('category').subscribe((state) => {
                searchSelectGetSelectCategoryOptionEffect(actions, 'category')
              })
            }}
            schema={SelectProductSchema}
          ></NiceForm>
        }
      />
    </Drawer>
  )
}
export default SelectProduct

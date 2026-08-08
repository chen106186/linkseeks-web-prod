import React, { useEffect, useRef } from 'react'
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
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getProductMaterielGetMaterielList } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

const formActions = createFormActions()

interface Iprops {
  /** 显示隐藏 */
  visible: boolean
  /** 关闭 */
  onclose?()
  /** 确认 */
  confirm?(e: any)
  /** 回显时选中的勾选 */
  rowCtlData?: Array<any>[]
}
const intl = getIntl()
const SelectProduct: React.FC<Iprops> = (props: any) => {
  const ref = useRef<any>({})
  const { visible, onclose, confirm, rowCtlData } = props
  const [rowSelection, RowCtl] = useRowSelectionTable({ customKey: 'id' })
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.materialCode' }),
      key: 'code',
      dataIndex: 'code',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.materialName' }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.goodsGroup' }),
      key: 'materialGroup',
      dataIndex: 'materialGroup',
      render: (text: any) => <span>{text && Object.keys(text).length > 0 && text.name}</span>,
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
      // 查询物料状态为 已确认 的数据
      getProductMaterielGetMaterielList({ ...params, materialGroupId, ids: [99] })
        .then((res) => {
          const { data } = res
          resolve(data)
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }

  useEffect(() => {
    if (rowCtlData) {
      console.log(rowCtlData, 'rowCtlData')
      RowCtl.setSelectRow(
        rowCtlData.map((item: any) => {
          return {
            id: item.productId,
            code: item.number,
            name: item.name,
            materialGroup: { name: item.goodsGroup },
            type: item.model,
            customerCategory: { name: item.category },
            brand: { name: item.brand },
            unitName: item.unit,
            costPrice: item.costPrice,
            needCount: item.needCount,
            needPrice: item.needPrice,
            arriveTime: item.arriveTime,
          }
        }),
      )
      RowCtl.setSelectedRowKeys(rowCtlData.map((v) => v.productId))
    }
  }, [rowCtlData])

  const search = (values: any) => {
    ref.current.reload(values)
  }

  return (
    <Drawer
      visible={visible}
      onClose={onclose}
      title={intl.formatMessage({ id: 'detail.purchase.modalTitle29' })}
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
        tableProps={{ rowKew: 'id' }}
        rowSelection={rowSelection}
        fetchTableData={(params) => fetchGoodsData(params)}
        controlRender={
          <NiceForm
            components={{ Cascader }}
            actions={formActions}
            onSubmit={(values) => search(values)}
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

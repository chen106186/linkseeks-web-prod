import { guid } from '@/utils/uuid'
import { Button, Drawer, FormInstance, Pagination, Table, message } from 'antd'
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import DeliveryNoticeOrderFactory from '../../assets/handles/DeliveryNoticeOrder'
import {
  PlannedDeliveryMaterialExpandableTableColumn,
  PlannedDeliveryMaterialTableColumn,
  PlannedDeliveryProductTableColumn,
} from '../../constants/page-table-column'
import ExpandedRowTableRender from './ExpandedRowTableRender'
import { PlusOutlined } from '@ant-design/icons'

import TableModal from '@/pages/transaction/components/tableModal'
import { ColumnType } from 'antd/lib/table'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import {
  getProductCustomerGetCustomerCategoryTree,
  getProductMaterielGetMaterielList,
  getProductSelectGetSelectBrand,
  getProductSelectGetSelectCustomerCategory,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { useAsyncCascader, fetchTreeData } from '../../effect'

let selectedRowKeys = new Map()
interface DeliveryGoodTableModalProps {
  form: FormInstance
  onChange: (value) => void
  disabled?: boolean
  orderType?: number
  value?: any
  title?: string
}

/**
 * 查询计划周期内的计划送货物料 Table Select
 * @param form 当前页面操作的form
 * @param onChange table 选择的callback (value:OrderInfo[]) => void
 */
function DeliveryGoodTableModal(props: DeliveryGoodTableModalProps) {
  const intl = useIntl()
  const { onChange, form, disabled, orderType, title, value } = props
  const [visible, setVisible] = useState(false)
  const service = DeliveryNoticeOrderFactory.getInstance()
  const [tableData, setTableData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState<number>(1)
  const [canShow, setCanShow] = useState([])

  /*选择物料*/
  const [searchVisible, setSearchVisible] = useState<boolean>(false)
  const [ids, setIds] = useState<Array<number>[]>([])
  const [product, setProduct] = useState<any>({})

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
      title: intl.formatMessage({ id: 'detail.purchase.goodsGroup' }),
      key: 'goodsGroup',
      dataIndex: 'goodsGroup',
      render: (text: any, record: any, index: number) => {
        return text ? text : record?.materialGroup?.name
      },
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
  /** 选择货品点击 */
  const confirm = (selectRowKeys: string[] | number[], selectRowRecord: any) => {
    const selectRow = selectRowRecord
    if (ids.includes(selectRow[0].id)) {
      message.error(intl.formatMessage({ id: 'detail.purchase.message32' }))
      return
    }
    if (selectRow.length > 0) {
      const data: any = selectRow[0]
      selectedRowKeys.set(selectRow.code, selectRow)
      onChange(selectedRowKeys)
      if (data.customerCategory) {
        const fullId = data.customerCategory.fullId
        const ids = fullId.replace(/\b(0+)/gi, '').split('.')
        form.setFieldsValue({
          ids: ids.join(',').split(','),
        })
      } else {
        form.setFieldsValue({
          ids: data.ids,
        })
      }

      form.setFieldsValue({
        number: data.code,
        name: data.name,
        model: data.type,
        brand: data.brand && data.brand.name,
        unit: data.unitName,
        goodsGroup: data?.materialGroup?.name,
      })
      setProduct(data)
      setVisible(false)
    } else {
      message.error(intl.formatMessage({ id: 'detail.purchase.message33' }))
    }
  }

  useEffect(() => {
    const _canShow = tableData.slice((page - 1) * 10, page * 10)
    setCanShow(_canShow)
  }, [page])

  const handleVisible = useCallback(() => {
    setVisible(true)
    selectedRowKeys = value
  }, [visible, value])

  useEffect(() => {
    if (form.getFieldValue('member') && !tableData?.length) {
      service.getOrderDeliveryPlanOrderProductPage(form, 1, orderType).then(handleResponseHttp)
    }
  }, [visible])

  const handleResponseHttp = (res) => {
    if (!res?.data) return
    const data = res.data
    let result = data.map((v) => {
      return {
        ...v,
        id: v.no,
      }
    })
    setTableData(result)
    setCanShow(result.slice(0, 10))
    setTotal(res.totalCount)
  }

  return (
    <>
      {!disabled && (
        <div className="mt-16">
          <Button
            onClick={handleVisible}
            icon={<PlusOutlined />}
            style={{
              width: '10%',
              backgroundColor: '#FAFBFC',
              borderStyle: 'dashed',
            }}
          >
            选择送样物料
          </Button>
        </div>
      )}

      {/* 选择货品 */}
      <TableModal
        modalType="Drawer"
        visible={visible}
        title={intl.formatMessage({ id: 'detail.purchase.modalTitle1' })}
        mode="checkbox"
        tableProps={{
          rowKey: 'id',
        }}
        fetchData={fetchGoodsData}
        onClose={() => setVisible(false)}
        onOk={confirm}
        columns={columns}
        effects={($, actions) => {
          actions.reset()
          useAsyncCascader('materialGroupId', fetchTreeData)
          useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
        }}
        schema={{
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
                    placeholder: intl.formatMessage({ id: 'detail.purchase.productName' }),
                    align: 'flex-left',
                    adadded: true,
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
                    code: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'detail.purchase.code' }),
                      },
                    },
                    customerCategoryId: {
                      type: 'string',
                      'x-component': 'SearchSelect',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'detail.purchase.message28' }),
                        className: 'fixed-ant-selected-down', // 该类强制将显示的下拉框出现在select下, 只有这里出现问题, ??
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
                        placeholder: intl.formatMessage({ id: 'detail.purchase.message31' }),
                        fetchSearch: getProductSelectGetSelectBrand,
                        style: {
                          width: 160,
                        },
                      },
                    },
                    materialGroupId: {
                      type: 'string',
                      'x-component': 'Cascader',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'detail.purchase.message93' }),
                        allowClear: true,
                        fieldNames: { label: 'name', value: 'id', children: 'children' },
                        style: { width: '150px' },
                        showSearch: true,
                      },
                    },
                    type: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'detail.purchase.nameCode' }),
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
        }}
      />
    </>
  )
}

export default DeliveryGoodTableModal

/**
 * @Description 采购物料抽屉
 */
import React, { useRef, useState, useImperativeHandle } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Drawer, Button, message, Table, Form, Input } from 'antd'
import type { ColumnType } from 'antd/lib/table/interface'
import { CaretDownOutlined, CaretRightOutlined, CloseOutlined } from '@ant-design/icons'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import type { GetContractManagePagePurchaseMaterielListResponseDetail } from '@apps/apis'
import { getContractManagePagePurchaseMaterielList } from '@apps/apis'
import { OrderModalType } from '@/constants/order'
import { PATTERN_MAPS } from '@/constants/regExp'
import type { FetchParamsType, NormalTableRefHandleType } from '@/components/PolymericTable'
import PolymericTable from '@/components/PolymericTable'
import { querySchema } from './schema'
import { convertDataToEntities, fillConductCheck, cleanConductCheck, getLevelEntities } from './conductUtil'
import type { PostOrderMaterialData } from '../../interface'
import styles from './index.less'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
export type MaterialType = GetContractManagePagePurchaseMaterielListResponseDetail & {
  /**
   * 唯一key
   */
  key: string
  /**
   * 关联请购单数据
   */
  requisitionList: GetContractManagePagePurchaseMaterielListResponseDetail['requisitionList'][0] &
    {
      orderQuantity?: number
    }[]
}

export type OrderMaterialsConfirmValue = MaterialType[]

export type OrderMaterialsSubmitValue = {
  materials: {
    requisitionList: Record<string, string>
  }
}

type ExtraFetchType = FetchParamsType & {
  /**
   * 物料编号
   */
  code: string
  /**
   * 物料名称
   */
  materielName: string
  /**
   * 规格型号
   */
  type: string
}

export interface OrderMaterialsDrawerProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 值
   */
  value: MaterialType[]
  /**
   * Form 确认事件
   */
  onConfirm: (values: OrderMaterialsConfirmValue) => void
  /**
   * 抽屉关闭事件
   */
  onClose: () => void
  /**
   * 合同id
   */
  contractId: number
  /**
   * 下单模式
   */
  orderMode: number
}

export interface OrderMaterialsDrawerRef {
  deleteItem: (record: PostOrderMaterialData) => void
  deleteAll: () => void
  initCheckedKeys: (dataSource: OrderMaterialsConfirmValue) => void
}

type RequisitionListItem = GetContractManagePagePurchaseMaterielListResponseDetail['requisitionList'][0] & {
  /**
   * 唯一key
   */
  key: string
  /**
   * 采购数量
   */
  orderQuantity?: string | number
}

type MaterialsListItem = Omit<GetContractManagePagePurchaseMaterielListResponseDetail, 'requisitionList'> & {
  /**
   * 唯一key
   */
  key: string
  /**
   * 关联请购单数据
   */
  children: RequisitionListItem[]
}

export type FetchReponseType = {
  data: MaterialsListItem[]
  totalCount: number
}

const normalizeMaterialsList = (
  dataSource: GetContractManagePagePurchaseMaterielListResponseDetail[],
): MaterialsListItem[] => {
  const ret: MaterialsListItem[] = []
  dataSource.forEach(({ requisitionList, ...rest }) => {
    ret.push({
      ...rest,
      key: `m_${rest.id}`,
      children: requisitionList?.map((requisition) => ({
        ...requisition,
        key: `r_${requisition.detailId}`,
      })),
    })
  })
  return ret
}

const OrderMaterialsDrawer: React.ForwardRefRenderFunction<OrderMaterialsDrawerRef, OrderMaterialsDrawerProps> = (
  props,
  ref,
) => {
  const { visible, onConfirm, onClose, contractId, orderMode } = props
  const [checkedKeysState, setCheckedKeysState] = useState([])
  const [halfCheckedState, setHalfCheckedState] = useState([])

  const [expandedRowKeys, setExpandedRowKeys] = useState([])

  const polymericRef = useRef<NormalTableRefHandleType | null>(null)

  const keyEntities = useRef<any>({})

  const requisitionListValue = useRef<OrderMaterialsSubmitValue['materials']['requisitionList']>({})

  // 缓存初始勾选值，由于编辑回填勾选时，并不知道全部列表数据
  // 所以需要缓冲勾选值，在列表加载完毕的时候去做默认勾选
  const initCheckeds = useRef([])

  const [form] = Form.useForm()

  const intl = useIntl()

  // 是否是请购单合同下单
  const isPurchaseOrderContract = orderMode === OrderModalType.PURCHASE_REQUISITION_CONTRACT_ORDER

  const columns: ColumnType<MaterialType>[] = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    // },
    {
      title: intl.formatMessage({
        id: 'purchaseOrder.orderCollect.materialColumns.productNo',
        defaultMessage: '物料编号',
      }),
      dataIndex: 'materielNo',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.name', defaultMessage: '物料名称' }),
      dataIndex: 'materielName',
      width: 320,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.spec', defaultMessage: '规格型号' }),
      dataIndex: 'type',
      width: 192,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.category', defaultMessage: '品类' }),
      dataIndex: 'category',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.brand', defaultMessage: '品牌' }),
      dataIndex: 'brand',
      width: 160,
    },
    {
      title: intl.formatMessage({
        id: 'purchaseOrder.orderCollect.contractColumns.contractFreeCount',
        defaultMessage: '合同剩余',
      }),
      dataIndex: 'contractFreeCount',
      width: 144,
    },
    // {
    //   title: intl.formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.unit', defaultMessage: '单位' }),
    //   dataIndex: 'unit',
    // },
  ].map((column) => ({ ...column, ellipsis: true }))

  const handleInitSelectRows = (checkeds: string[], selected: boolean) => {
    const { levelMap, maxLevel } = getLevelEntities(keyEntities.current)

    if (selected) {
      // 去重
      const keys = Array.from(new Set([...checkedKeysState, ...checkeds]))
      const { halfCheckedKeys, checkedKeys } = fillConductCheck(keys, levelMap, maxLevel)
      setCheckedKeysState(checkedKeys)
      setHalfCheckedState(halfCheckedKeys)
    }
    if (!selected) {
    }
  }

  const fetchMaterialsList = async (params: ExtraFetchType) => {
    if (!contractId) {
      return { data: [], totalCount: 0 }
    }
    const res = await getContractManagePagePurchaseMaterielList({
      ...(params as any),
      current: `${params.current}`,
      pageSize: `${params.pageSize}`,
      contractId,
    })
    if (res.code === 1000) {
      const dataSource = normalizeMaterialsList(res.data.data)
      keyEntities.current = {
        ...keyEntities.current,
        ...convertDataToEntities(dataSource).keyEntities,
      }
      setExpandedRowKeys(dataSource.map((item) => item.key))
      if (initCheckeds.current.length > 0) {
        handleInitSelectRows(initCheckeds.current, true)
      }
      return {
        data: dataSource,
        totalCount: res.data.totalCount,
      }
    }
    return { data: [], totalCount: 0 }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSelectRow = (record: MaterialsListItem, selected: boolean) => {
    const { levelMap, maxLevel } = getLevelEntities(keyEntities.current)

    if (selected) {
      const keys = [...checkedKeysState, record.key]
      const { halfCheckedKeys, checkedKeys } = fillConductCheck(keys, levelMap, maxLevel)
      setCheckedKeysState(checkedKeys)
      setHalfCheckedState(halfCheckedKeys)
    }
    if (!selected) {
      const keySet = new Set(checkedKeysState)
      keySet.delete(record.key)
      const keys = Array.from(keySet)
      const { halfCheckedKeys, checkedKeys } = cleanConductCheck(keys, halfCheckedState, levelMap, maxLevel)
      setCheckedKeysState(checkedKeys)
      setHalfCheckedState(halfCheckedKeys)
    }
  }

  const handlehandleSelectAll = (
    selected: boolean,
    selectedRows: MaterialsListItem[],
    changeRows: MaterialsListItem[],
  ) => {
    const { levelMap, maxLevel } = getLevelEntities(keyEntities.current)

    if (selected) {
      const keys = [...checkedKeysState, ...selectedRows.filter(Boolean).map((item) => item.key)]
      const { halfCheckedKeys, checkedKeys } = fillConductCheck(keys, levelMap, maxLevel)
      setCheckedKeysState(checkedKeys)
      setHalfCheckedState(halfCheckedKeys)
    }
    if (!selected) {
      const keySet = new Set(checkedKeysState)
      changeRows.forEach((record) => {
        keySet.delete(record.key)
      })
      const keys = Array.from(keySet)
      const { halfCheckedKeys, checkedKeys } = cleanConductCheck(keys, halfCheckedState, levelMap, maxLevel)
      setCheckedKeysState(checkedKeys)
      setHalfCheckedState(halfCheckedKeys)
    }
  }

  const expandedRowRender = (parentRecord: MaterialsListItem) => {
    const expandedColumns: ColumnType<RequisitionListItem>[] = [
      {
        title: translate('web.resource.order.guanlianqinggoudan'),
        dataIndex: 'requisitionNo',
        width: 192,
      },
      {
        title: translate('web.resource.order.qinggoudanshenyu'),
        dataIndex: 'surplusQuantity',
        width: 472,
        // render: (text, record) => text || record.quantity,
        render: (text) => text,
      },
      {
        title: translate('web.resource.order.xiadanshuliang'),
        dataIndex: 'materielNo',
        width: 472,
        render: (text, record) => (
          <div className={styles['member-rights-editable']}>
            <Form.Item
              name={['materials', 'requisitionList', `${record.key}`]}
              rules={[
                {
                  required: checkedKeysState.includes(record.key) ? true : false,
                  message: translate.formatFormInputTip(translate('web.resource.order.xiadanshuliang')),
                },
                {
                  pattern: PATTERN_MAPS.quantity,
                  message: translate.formatFormInputTip(translate('web.common.zhenshu')),
                },
                {
                  validator: (_, value) => {
                    const intVal = +value
                    // const max = record.surplusQuantity || record.quantity
                    const max = record.surplusQuantity
                    if (intVal > max) {
                      return Promise.reject('下单数量不可超过请购单剩余数量')
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>
        ),
      },
    ]
    return (
      <Table
        columns={expandedColumns}
        dataSource={parentRecord.children}
        rowKey="key"
        pagination={false}
        rowSelection={{
          selectedRowKeys: checkedKeysState,
          onSelect: handleSelectRow,
          onSelectAll: handlehandleSelectAll,
        }}
      />
    )
  }

  const handleConfirm = () => {
    if (!checkedKeysState.length) {
      message.warning('请选择采购物料')
      return
    }

    // 非请购单确认逻辑
    if (!isPurchaseOrderContract) {
      const ret: OrderMaterialsConfirmValue = []

      for (let i = 0; i < checkedKeysState.length; i++) {
        const checked = checkedKeysState[i]
        const entity = keyEntities.current[checked]
        ret.push(entity)
      }
      onConfirm?.(ret)
      handleClose()
      return
    }

    form
      .validateFields()
      .then(() => {
        const ret: OrderMaterialsConfirmValue = []

        // const checkedKeys = Object.keys(materials.requisitionList);
        const checkedKeys = Object.keys(requisitionListValue.current)
        for (let i = 0; i < checkedKeys.length; i++) {
          const checked = checkedKeys[i]
          const { parentNode, ...restEntityProps } = keyEntities.current[checked]
          // 只需要处理带有父级的数据
          if (!parentNode || !checkedKeysState.includes(checked)) {
            continue
          }
          const { children, ...restParent } = parentNode
          const index = ret.findIndex((item) => item.id === parentNode.id)
          if (index === -1) {
            const material: OrderMaterialsConfirmValue[0] = {
              ...restParent,
              requisitionList: [],
            }
            material.requisitionList.push({
              ...restEntityProps,
              orderQuantity: +requisitionListValue.current[checked],
            })
            ret.push(material)
          } else {
            // 合并数据到已存在的父级中
            ret[index].requisitionList.push({
              ...restEntityProps,
              orderQuantity: +requisitionListValue.current[checked],
            })
          }
        }
        onConfirm?.(ret)
        handleClose()
      })
      .catch((err) => {
        console.warn('err', err)
      })
  }

  const handleDelete = (record: PostOrderMaterialData) => {
    handleSelectRow(record as any, false)
    // 删除是整个物料，所以底下关联的请购单都需要清空数据
    // record.requisitions.forEach((item) => {
    //   form.setFieldsValue({
    //     materials: {
    //       requisitionList: {
    //         [item.requisitionId]: '',
    //       },
    //     },
    //   });
    // });
  }

  const handleDeleteAll = () => {
    setCheckedKeysState([])
    setHalfCheckedState([])
    form.setFieldsValue({
      materials: {
        requisitionList: {},
      },
    })
  }

  const handleBeforePaginationChange = async () => {
    try {
      await form.validateFields()
      return true
    } catch (error) {
      return false
    }
  }

  const handleFormValuesChange = (_, allValues: OrderMaterialsSubmitValue) => {
    const { materials } = allValues
    requisitionListValue.current = {
      ...requisitionListValue.current,
      ...(materials.requisitionList || {}),
    }
  }

  const handleExpandedRowsChange = (expandedKeys: string[]) => {
    setExpandedRowKeys(expandedKeys)
  }

  const handleInitCheckedKeys = (dataSource: OrderMaterialsConfirmValue) => {
    const normalized = normalizeMaterialsList(dataSource)
    keyEntities.current = {
      ...keyEntities.current,
      ...convertDataToEntities(normalized).keyEntities,
    }
    // 初始勾选
    const checkeds = []
    normalized.forEach((item) => {
      // 有 children 则表示是 请购单合同下单
      if (item.children && item.children.length) {
        item.children.forEach((child) => {
          checkeds.push(child.key)
        })
      } else {
        checkeds.push(item.key)
      }
    })
    initCheckeds.current = checkeds

    // 设置Form初始值
    const requisitionValue: Record<string, string> = {}
    for (let i = 0; i < normalized.length; i++) {
      const item = normalized[i]
      if (item.children && item.children.length) {
        item.children.forEach((child) => {
          requisitionValue[child.key] = child.orderQuantity as string
        })
      }
    }
    // 没有值的话跳过设置
    if (Object.keys(requisitionValue).length) {
      form.setFieldsValue({
        materials: {
          requisitionList: requisitionValue,
        },
      })
      requisitionListValue.current = {
        ...requisitionListValue.current,
        ...(requisitionValue || {}),
      }
    }
  }

  useImperativeHandle(ref, () => ({
    deleteItem: handleDelete,
    deleteAll: handleDeleteAll,
    initCheckedKeys: handleInitCheckedKeys,
  }))

  return (
    <Drawer
      title="选择采购物料"
      width={1200}
      onClose={handleClose}
      visible={visible}
      closable={false}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={handleClose} style={{ marginRight: 16 }}>
            {translate('web.common.cancel')}
          </Button>
          <Button onClick={handleConfirm} type="primary">
            {translate('web.common.confirmEmpty')}
          </Button>
        </div>
      }
      extra={<CloseOutlined style={{ color: '#91959B', fontSize: 24 }} onClick={handleClose} />}
      bodyStyle={{
        paddingBottom: 0,
      }}
      destroyOnClose
    >
      <PolymericTable
        rowKey="key"
        columns={columns}
        fetchDataSource={(params) => fetchMaterialsList(params as ExtraFetchType)}
        rowSelection={{
          selectedRowKeys: checkedKeysState,
          onSelect: handleSelectRow,
          onSelectAll: handlehandleSelectAll,
        }}
        defaultPageSize={10}
        expandable={
          isPurchaseOrderContract
            ? {
                expandedRowRender,
                expandIcon: ({ expanded, onExpand, record }) =>
                  expanded ? (
                    <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
                  ) : (
                    <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
                  ),
                childrenColumnName: 'xx', // 默认是 children，与 dataSource数据中 冲突，随便改了名称，否则不能正常展开
                expandedRowKeys,
                onExpandedRowsChange: handleExpandedRowsChange,
              }
            : undefined
        }
        searchFormProps={{
          schema: querySchema,
          effects: ($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'code', FORM_FILTER_PATH)
          },
        }}
        ref={polymericRef}
        components={{
          table: ({ children }) => (
            <Form form={form} onValuesChange={handleFormValuesChange}>
              <table>{children}</table>
            </Form>
          ),
        }}
        beforePaginationChange={handleBeforePaginationChange}
        full
      />
    </Drawer>
  )
}

const OrderMaterialsDrawerForWard = React.forwardRef<OrderMaterialsDrawerRef, OrderMaterialsDrawerProps>(
  OrderMaterialsDrawer,
)

export default OrderMaterialsDrawerForWard

import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { Table, Button, message, Pagination } from 'antd'
import { drawerShopColumns, drawerMaterialColumns, deliverShopColumns } from './columns'
import { materialSearchSchema, goodsSearchSchema } from './schema'
import DrawerTable from '@/components/DrawerTable'
import NiceForm from '@/components/NiceForm'
import moment from 'moment'
import { PlusOutlined } from '@ant-design/icons'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  getProductCommodityCommonGetCommodityListByBuyer,
  getProductMaterielGetDoesNotFreezeMaterielList,
  getProductSelectGetSelectBrand,
  getProductCustomerGetMemberCustomerCategoryTree,
  getProductSelectGetMemberBrand,
} from '@apps/apis'
import type { DeliverMaterialTableProps, Props, ShopListItem, Enums } from './interface'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncCascader, fetchTreeData } from '@/formSchema/effects/useAsyncCascader'
import { useCustomerCategoriesBusinessEffects } from '@/formSchema/effects/useCustomerCategoriesBusinessEffects'
import { createFormActions } from '@apps/formily'
import CustomEditTable from '../CustomEditTable'
import { useSearchBrandOptionEffect } from '../../effect'
import { useIntl } from '@linkseeks/i18n'
import style from './index.less'
import { useWebIntl } from '@apps/locales'
import { useSelectUnit } from '@apps/services'

const formActions = createFormActions()

const getShopListFetch = {
  '1': getProductMaterielGetDoesNotFreezeMaterielList, //srm物料列表
  '2': getProductCommodityCommonGetCommodityListByBuyer, //b2b商品列表
}

const setParamsArrayIdToStr = (params: Record<string, any>, keyArr: string[]) => {
  keyArr.forEach((key) => {
    if (params[key] && Array.isArray(params[key])) {
      Object.assign(params, { [key]: params[key].pop() })
    }
  })
  return params
}

const DeliverMaterialTable: React.FC<DeliverMaterialTableProps | Props> = (props) => {
  const {
    showSelectModalBtn = true,
    showAddBtn = true,
    roleType = 1,
    columns = [],
    prefix,
    suffix,
    rowKey,
    confirm,
    handleChange = () => {},
    addHandle = () => {},
    formilyProps,
    showWarning = false,
    recipientDrawer,
    tableFromRefList,
    supplier,
    selectUnit,
    shopTableKey = 'id',
  } = props?.props?.['x-component-props'] || props
  const intl = useIntl()
  const value = props?.value || props?.dataSource || []
  const { tableProps, cancelTip, fetchTableData, modalProps, formilyProps: modalFormilyProps } = recipientDrawer || {}

  const [shopModal, setShopModal] = useState(false)
  const [operationRow, setOperationRow] = useState<{ record?: ShopListItem; dataIndex?: keyof ShopListItem }>({})
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [visible, setVisible] = useState(false)

  const molalRef = useRef<any>({})
  const neederRef = useRef<any>({})
  const translate = useWebIntl()
  const tableRowKey = useMemo(() => tableProps.rowKey || 'id', [tableProps.rowKey])
  const { fetchUnitOptions } = useSelectUnit('custom')

  // 弹窗标题
  const drawerTitle = useMemo(
    () =>
      roleType == 2
        ? intl.formatMessage({
            id: 'commodity.deliverManagement.xuanzesongyangshangpin',
            defaultMessage: '选择送样商品',
          })
        : intl.formatMessage({
            id: 'commodity.deliverManagement.xuanzesongyangwuliao',
            defaultMessage: '选择送样物料',
          }),
    [roleType],
  )

  // 新增按钮文案
  const addBtnTitle = useMemo(
    () =>
      roleType == 2
        ? intl.formatMessage({
            id: 'commodity.deliverManagement.xinzengsongyangshangpin',
            defaultMessage: '新增送样商品',
          })
        : intl.formatMessage({
            id: 'commodity.deliverManagement.xinzengsongyangwuliao',
            defaultMessage: '新增送样物料',
          }),
    [roleType],
  )

  // 弹窗的列表数据格式
  const dreawColums = useMemo(() => (roleType == 2 ? drawerShopColumns : drawerMaterialColumns), [roleType])

  // 表格分页数据
  const tableValue = useMemo(() => {
    return value.slice((current - 1) * pageSize, pageSize * current)
  }, [value, pageSize, current])

  // 已经选择的商品id
  const shopIdList = useMemo(() => {
    // 过滤出已经选择的所有商品/物料
    const hasShopList = value.filter((item) => item.source === 1)
    if (hasShopList) {
      return hasShopList.map((item) => item.skuId)
    }
    return []
  }, [value])

  const [demanderRowSelect, rowCtl] = useRowSelectionTable({ type: 'radio', customKey: tableRowKey })
  const [shopRowSelect, shopRowCtl] = useRowSelectionTable({ type: 'checkbox', customKey: shopTableKey })

  // 添加物料/商品信息
  const addShopHandler = useCallback(async () => {
    const selectRow = shopRowCtl.selectRow
    const newSelectList = selectRow.map((item, index) => {
      const newItem = {
        index,
        skuId: String(item.id),
        name: item.name,
        category: item.customerCategoryName,
        categoryId: item.categoryId,
        brand: item.brandName || '',
        unit: item.unitName,
        demandQuantity: '',
        demandTime: moment().format('YYYY-MM-DD HH:mm'),
        demandPerson: '',
        demandDepartment: '',
        attachment: [],
        readOnlyList: {
          skuId: true,
          name: true,
          spec: true,
          category: true,
          brand: true,
        },
        source: 1,
        disabled: false,
      }
      if (roleType == 1) {
        Object.assign(newItem, { spec: item.type || '' })
      }
      return newItem
    })
    setShopModal(false)
    confirm?.(newSelectList)
    // 清空已选数据
    shopRowCtl.setSelectRow([])
    shopRowCtl.setSelectedRowKeys([])
  }, [roleType, confirm, shopRowCtl])

  // 搜索物料/商品信息
  const search = (values: any) => {
    // 把搜索的参数是数组的转成字符串
    setParamsArrayIdToStr(values, ['customerCategoryId', 'materialGroupId', 'brandId'])
    // 调用fetchdata方法
    setTimeout(() => {
      molalRef.current?.reload(values)
    }, 100)
  }

  // 搜索需求人
  const searchNeeder = (values: any) => {
    // 调用fetchdata方法
    neederRef.current?.reload(values)
  }

  // 获取送样物料那里的单位列表
  const getSelectCnUnit = useCallback(async (name?: string) => {
    try {
      const unit = await fetchUnitOptions(name)
      return unit
    } catch (error) {
      return []
    }
  }, [])

  // 显示需求人弹窗
  const handleModalVisible = useCallback(
    (record: ShopListItem, dataIndex: keyof ShopListItem) => {
      if (!fetchTableData) {
        message.warning(intl.formatMessage({ id: 'components.qingchuanrufetchTableDatashuxing' }))
        return
      }
      setOperationRow({ record, dataIndex })
      setVisible(true)
    },
    [fetchTableData],
  )

  // 自定义表格的各个操作事件的中间层
  const middleHandleChange = useCallback(
    (record: ShopListItem, dataIndex: keyof ShopListItem | 'operation') => {
      if (dataIndex === 'demandPerson') {
        handleModalVisible(record, dataIndex)
        return
      }
      if (dataIndex === 'operation') {
        tableFromRefList.current = tableFromRefList.current.filter((item) => item.key !== record.index)
      }
      handleChange?.(record, dataIndex)
    },
    [handleChange, handleModalVisible, tableFromRefList],
  )

  // table的columns数据格式
  const tableColumns = useMemo(() => {
    const listTeamColumns = Array.isArray(columns) ? columns : deliverShopColumns
    return listTeamColumns.map((col) => {
      if (!col.editable) {
        return { ...col }
      }
      return {
        ...col,
        onCell: (record: ShopListItem) => {
          const editProps = { enums: selectUnit.current.slice() || [], ...col?.editProps }
          if (col.dataIndex === 'demandTime' && record.demandTime) {
            Object.assign(editProps, { defaultValue: record?.demandTime })
          }
          if (col.dataIndex === 'unit') {
            Object.assign(editProps, {
              getEnumsApi: async (searchName: string) => {
                try {
                  const res = (await getSelectCnUnit(searchName)) as unknown as Enums
                  record.unitEnums = res
                  return res
                } catch (error) {
                  record.unitEnums = []
                  return []
                }
              },
            })
          }
          return {
            ...col,
            component: col.component,
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            editProps,
            tablefromref: tableFromRefList,
            rowlength: value.length,
            handleChange: middleHandleChange,
            readOnly: record?.readOnlyList?.[col.dataIndex] || record?.readOnlyAll || false,
          }
        },
      }
    })
  }, [middleHandleChange, columns, value.length, selectUnit, tableFromRefList, getSelectCnUnit])

  // 显示物料/商品弹窗
  const showSelectModal = useCallback(() => {
    if (supplier.current && !Object.keys(supplier.current).length) {
      return message.info(
        intl.formatMessage({
          id: 'commodity.deliverManagement.qingxuanzegongyingshang',
          defaultMessage: '请选择供应商',
        }),
      )
    }
    setShopModal(true)
    // 兼容首次不会触发调取接口的情况
    // molalRef.current?.reload?.({
    //   current: 1,
    //   pageSize: 10,
    // })
  }, [supplier])

  // 关闭物料/商品弹窗
  const cancelHandler = useCallback(() => {
    if (!shopRowCtl.selectRow.length && showWarning) {
      message.warning(intl.formatMessage({ id: 'commodity.deliverManagement.weixuanze', defaultMessage: '未选择' }))
    }
    setShopModal(false)
  }, [shopRowCtl.selectRow, showWarning])

  // 确定选择的需求人弹窗
  const handleConfirm = () => {
    const rows = rowCtl.selectRow
    const keys = rows.map((item) => item[tableRowKey])
    rowCtl.setSelectedRowKeys(keys)
    setVisible(false)
    // rows自行结构出需要的字段出来，否则可能会与record的字段冲突替代了原来的数据
    handleChange?.(
      {
        ...operationRow.record,
        demandPerson: rows[0].name || '',
        demandDepartment: rows[0].orgName || '',
      },
      operationRow.dataIndex,
    )
  }

  // 取消/关闭需求人弹窗
  const handleCancel = () => {
    if (!rowCtl.selectRow.length && cancelTip) {
      message.warning(cancelTip)
    }
    setVisible(false)
  }

  // 初始化物料弹窗搜索栏
  const DeliverMaterialSearchEffects = ($, action) => {
    useStateFilterSearchLinkageEffect($, action, 'name', FORM_FILTER_PATH)
    // srm物料搜索栏需要物料组下拉栏
    if (roleType == 1) {
      useAsyncCascader('materialGroupId', fetchTreeData)
      // 初始化品类数据
      useCustomerCategoriesBusinessEffects($, action, {
        fieldName: 'customerCategoryId',
      })
      // 品牌
      useSearchBrandOptionEffect(action, 'brandId', async (params) => {
        try {
          const { code, data } = await getProductSelectGetSelectBrand(params)
          if (code === 1000) {
            return data
          }
          return []
        } catch {
          return []
        }
      })
    } else {
      const { memberId, roleId: memberRoleId } = supplier.current
      // 初始化品类数据
      useAsyncCascader('customerCategoryId', async () => {
        try {
          const { data, code } = await getProductCustomerGetMemberCustomerCategoryTree({
            memberId,
            memberRoleId,
          })
          if (code === 1000) {
            return data
          }
          return []
        } catch {
          return []
        }
      })
      // 品牌
      useSearchBrandOptionEffect(action, 'brandId', async (params) => {
        try {
          const { code, data } = await getProductSelectGetMemberBrand({
            memberId,
            memberRoleId,
            ...params,
          })
          if (code === 1000) {
            return data
          }
          return []
        } catch {
          return []
        }
      })
    }
  }

  const fetchShopList = (role: number | string, params: Record<string, any>) => {
    return new Promise((resolve, reject) => {
      const queryParams = { ...params }
      if (role === 2) {
        const { memberId, roleId: memberRoleId } = supplier.current
        Object.assign(queryParams, { memberId, memberRoleId, priceTypeList: '1,2', idNotInList: shopIdList })
      } else {
        Object.assign(queryParams, { materielIdList: shopIdList })
      }
      getShopListFetch[role](queryParams, { ctlType: 'none' })
        .then((res) => {
          if (res.code === 1000) {
            if (res?.data?.data) {
              res.data.data = res.data.data.map((item) => ({
                ...item,
                categoryId: item?.customerCategory?.id || item?.customerCategoryId || '',
                // 兼容一下物料弹窗表单
                customerCategoryName: item?.customerCategory?.name || item?.customerCategoryName || '',
                materialGroupName: item?.materialGroup?.name || item?.materialGroup || '',
                brandName: item?.brand?.name || item?.brandName || '',
              }))
            }
            resolve(res.data)
          }
          reject(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // 更新一下页码，免得删除操作后出现表格空白
  useEffect(() => {
    if (!tableValue.length && current != 1) {
      setCurrent((num) => num - 1)
    }
  }, [tableValue, current])

  useEffect(() => {
    // 拉取初始单位列表
    getSelectCnUnit()
      .then((res) => {
        selectUnit.current = res
      })
      .catch((err) => {
        selectUnit.current = err
      })
  }, [])

  return (
    <>
      <div style={{ width: '100%' }}>
        {!!showSelectModalBtn && (
          <Button icon={<PlusOutlined />} className={style.teamMemberBtn} onClick={showSelectModal}>
            {drawerTitle}
          </Button>
        )}
        {prefix}
        <Table
          rowKey={rowKey || 'id'}
          columns={tableColumns}
          dataSource={tableValue}
          components={CustomEditTable(tableColumns)}
          scroll={{ x: 1200 }}
          onRow={(record) => {
            return {
              rowlength: tableValue.length,
              record,
              tablefromref: tableFromRefList,
            }
          }}
          pagination={false}
        />
        <div className={style.pagination}>
          <Pagination
            pageSize={pageSize}
            current={current}
            showQuickJumper
            showSizeChanger
            total={value.length}
            showTotal={(total: number) => translate('web.common.paginationtotal', { total })}
            onChange={(page: number, pageSizeNumber: number) => {
              tableFromRefList.current = []
              setCurrent(page)
              setPageSize(pageSizeNumber)
            }}
          />
        </div>
        {!!showAddBtn && (
          <Button icon={<PlusOutlined />} type="dashed" className={style.addBtn} block onClick={addHandle}>
            {addBtnTitle}
          </Button>
        )}

        {suffix}
      </div>
      {/* 商品/物料弹窗 */}
      <DrawerTable
        drawerTitle={drawerTitle}
        visible={shopModal}
        columns={dreawColums}
        currentRef={molalRef}
        keepAlive={false}
        fetchTableData={(params) => fetchShopList(roleType, params)}
        confirm={addShopHandler}
        cancel={cancelHandler}
        rowSelection={shopRowSelect}
        customKey={shopTableKey}
        tableProps={{
          rowKey: shopTableKey,
        }}
        preserveSelectedRowKeys
        controlRender={
          <NiceForm
            actions={formActions}
            onSubmit={(values) => search(values)}
            schema={roleType == 1 ? materialSearchSchema : goodsSearchSchema}
            effects={DeliverMaterialSearchEffects}
            {...formilyProps?.ctx}
          />
        }
      />
      {/* 需求人选择弹窗 */}
      <DrawerTable
        confirm={handleConfirm}
        cancel={handleCancel}
        visible={visible}
        width={1000}
        {...modalProps}
        drawerTitle={modalProps.title}
        rowSelection={demanderRowSelect}
        resetModal={{
          destroyOnClose: true,
        }}
        currentRef={neederRef}
        controlRender={
          <NiceForm actions={formActions} onSubmit={(values) => searchNeeder(values)} {...modalFormilyProps?.ctx} />
        }
        {...recipientDrawer}
      />
    </>
  )
}

DeliverMaterialTable.isFieldComponent = true

export default DeliverMaterialTable

/**
 * 表格结构公共弹窗
 */
import React, { useRef, useState, useCallback, forwardRef, memo, useImperativeHandle } from 'react'
import { Tabs, Table, Checkbox, Modal } from 'antd'
import StandardTable from '@/components/StandardTable'
import type { ColumnType } from 'antd/lib/table'
import NiceForm from '@/components/NiceForm'
import type { IFormEffect, ISchema, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { createFormActions } from '@apps/formily'
import type { HandleType } from '@/components/CommonDrawer'
import CommonDrawer from '@/components/CommonDrawer'
import { useIntl } from '@linkseeks/i18n'
import { SelectType_Type } from '../CommonTableSelect'
import { Select_Content_Type } from '../constant'

export type RefHandleType = {
  show: (flag?: boolean, params?: any, data?: any) => void
  setRows: (rows: any[]) => void
}

interface PropsType {
  onOk?: (rows: any[], rowKeys: any[]) => void // 弹窗确定回调
  onQueryAll?: (value?: any) => void // 选中全部的回调（仅在弹窗确定的时候调用）
  fieldCode?: string // 配置的弹窗字段编码
  fieldLabel?: string // 配置的弹窗字段名称
  selectCache?: any[] // 数据选中缓存，用来标识可不可选
  tableColumns: ColumnType<any>[] // 表格 columns
  title: string // 弹窗标题
  queryAllLabel: string // 选择全部的Label
  rowKey?: string // 表格rowKey
  fetchTableApi: Function // 获取表格数据的接口
  fnTableParams?: (params: any) => any // 调整表格接口参数的方法
  controlComponents?: Record<string, React.JSXElementConstructor<any>> // 表格筛选 components
  controlEffects?: IFormEffect<any, ISchemaFormActions | ISchemaFormAsyncActions> // 表格筛选 effects
  controlSchema?: ISchema // 表格筛选 schema
  disabled?: boolean // 禁用
  selectType: SelectType_Type
}

const CommonTableDrawer = (props: PropsType, ref) => {
  const intl = useIntl()
  const formActions = createFormActions()
  const {
    onOk,
    onQueryAll,
    fieldCode = 'code',
    fieldLabel,
    selectCache,
    tableColumns,
    title,
    queryAllLabel,
    rowKey = 'id',
    fetchTableApi,
    fnTableParams,
    controlComponents = {},
    controlEffects,
    controlSchema = {},
    disabled,
    selectType,
  } = props

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]) // 选中的key
  const [selectedRows, setSelectedRows] = useState<any>([]) // 选中的数据
  const [isQueryAll, setIsQueryAll] = useState<boolean>(false) // 是否选择全部，此全部表示总数据的全部，非表格内置的全部选择框
  const [tabKey, setTabKey] = useState<string>('1') // tabKey

  const tableRef = useRef<any>({}) // 表格ref
  const drawRef = useRef<HandleType>() // 弹窗ref
  const isValuesChangeRef = useRef<boolean>(false) // 记录此次是否操作过选择框

  /**
   * 字段编码可能为 xxx 或 xxx.yyy 或 xxx.yyy.zzz 等形式
   * 所有需要将其处理为数组形式并找到我们真正需要的字段值
   * @param data 列表 item 数据
   * @returns
   */
  const getRealCodeValue = (data: any) => {
    const codeArr = fieldCode?.split('.') || []
    const len = codeArr.length
    if (len) {
      let result = data
      for (let i = 0; i < len; i++) {
        result = result?.[codeArr[i]]
      }

      if (selectType === Select_Content_Type.SelectGoods) {
        return `${result}${data?.commodityAttribute ? `/${data.commodityAttribute}` : ''}`
      }
      return result
    }
  }

  /**
   * 弹窗确定
   */
  const handleOk = useCallback(() => {
    isValuesChangeRef.current = false
    onQueryAll?.(isQueryAll)
    onOk?.(
      selectedRows.map((item) => ({ id: item.id, value: item.value })),
      selectedRowKeys,
    )
  }, [selectedRows, selectedRowKeys, isQueryAll])

  /**
   * 获取表格数据
   * @param params
   * @returns
   */
  const fetchData = (params: any) => {
    const fetchParams = fnTableParams?.(params) || params
    return new Promise((resolve) => {
      fetchTableApi(fetchParams, { ctlType: 'none' }).then(({ code, data }) => {
        if (code === 1000) {
          resolve({
            totalCount: data.totalCount,
            data: data.data?.map((item) => ({ ...item, value: getRealCodeValue(item) })),
          })
        }
      })
    })
  }

  /**
   * 表格选择
   * @param record
   * @param selected
   * @param selectedRow
   * @param nativeEvent
   */
  const handleSelectChange = (record, selected) => {
    const childArr = [...selectedRowKeys]
    const childRowArr = [...selectedRows]
    if (selected) {
      childArr.push(record.id)
      childRowArr.push(record)
    } else {
      childArr.splice(
        childArr.findIndex((item) => item === record.id),
        1,
      )
      childRowArr.splice(
        childRowArr.findIndex((item) => item.id === record.id),
        1,
      )
    }
    isValuesChangeRef.current = true
    setSelectedRowKeys(childArr)
    setSelectedRows(childRowArr)
  }

  /**
   * 表格选择（表格内置的）全部
   * @param selected
   * @param selectedRow
   * @param changeRows
   */
  const handleSelectAll = (selected, selectedRow, changeRows) => {
    let childArr = [...selectedRowKeys]
    let childRowArr = [...selectedRows]
    if (selected) {
      childArr = Array.from(new Set([...childArr, ...changeRows.map((item) => item.id)]))
      childRowArr = Array.from(new Set([...childRowArr, ...changeRows]))
    } else {
      childArr = childArr.filter((item) => !changeRows.some((e) => e.id === item))
      childRowArr = childRowArr.filter((item) => !changeRows.some((e) => e.id === item.id))
    }
    isValuesChangeRef.current = true
    setSelectedRowKeys(childArr)
    setSelectedRows(childRowArr)
  }

  /**
   * 选择全部（总数据意义上的全部）
   * @param checked
   */
  const onSelectAllMaterial = (checked: boolean) => {
    isValuesChangeRef.current = true
    setIsQueryAll(checked)
    setSelectedRows([])
    setSelectedRowKeys([])
  }

  useImperativeHandle(ref, () => ({
    show(flag: boolean, params = {}, data: any) {
      drawRef?.current?.show(flag, params)
      if (data) {
        setSelectedRows(data?.selectData || [])
        const selectKeys = data?.selectData?.map((item) => item.id) || []
        setSelectedRowKeys(selectKeys)
        setIsQueryAll(data?.isQueryAll || false)
        setTabKey(data?.isSeeMore ? '2' : '1')
      }
    },
    setRows(rows: any[]) {
      const rowKeys = rows.map((item) => item.id)
      setSelectedRows(rows)
      setSelectedRowKeys(rowKeys)
    },
  }))

  const columns: ColumnType<any>[] = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: fieldLabel, dataIndex: 'value', key: 'value' },
  ]

  return (
    <CommonDrawer
      ref={drawRef}
      title={title}
      width={1000}
      destroyOnClose
      bodyStyle={{ paddingTop: 0 }}
      onOk={handleOk}
      confirmDisabled={disabled}
      onCancel={(fnClose) => {
        if (isValuesChangeRef.current) {
          Modal.confirm({
            content: intl.formatMessage({
              id: 'common.close.tips',
              defaultMessage: '您还有未保存的内容，是否确定要关闭？',
            }),
            onOk: () => {
              isValuesChangeRef.current = false
              fnClose()
            },
          })
          return
        }
        fnClose()
      }}
    >
      <div style={{ position: 'relative', top: 90 }}>
        {/* 其他XX字段有选择过XX的话，就不能选择全部XX */}
        {/* 同样的，选过全部XX之后，其他XX字段就不能选择和输入XX相关的信息 */}
        <Checkbox
          checked={isQueryAll}
          onChange={(e) => onSelectAllMaterial(e.target.checked)}
          disabled={!!selectCache.length || disabled}
        >
          {queryAllLabel}
        </Checkbox>
      </div>
      <Tabs
        activeKey={tabKey}
        onChange={(key: string) => {
          setTabKey(key)
        }}
      >
        <Tabs.TabPane
          tab={intl.formatMessage({ id: 'processRuleSetting.kexuanze', defaultMessage: '可选择' })}
          key="1"
          className="use-ant-pagination-mini"
        >
          {!isQueryAll && (
            <StandardTable
              keepAlive={false}
              currentRef={tableRef}
              columns={tableColumns}
              tableProps={{ rowKey }}
              fetchTableData={(params: any) => fetchData(params)}
              rowSelection={{
                selectedRowKeys: selectedRowKeys,
                onSelect: handleSelectChange,
                onSelectAll: handleSelectAll,
                getCheckboxProps: (record: any) => ({
                  disabled: selectCache.includes(record.id) || disabled,
                }),
              }}
              controlRender={
                <NiceForm
                  actions={formActions}
                  onSubmit={(values) => tableRef.current.reload(values)}
                  components={controlComponents}
                  effects={($, actions) => {
                    controlEffects?.($, actions)
                  }}
                  schema={controlSchema}
                />
              }
            />
          )}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={`${intl.formatMessage({
            id: 'processRuleSetting.yixuanze',
            defaultMessage: '已选择',
          })}（${selectedRows.length}）`}
          key="2"
        >
          <Table rowKey={rowKey} dataSource={selectedRows} columns={columns} pagination={false} />
        </Tabs.TabPane>
      </Tabs>
    </CommonDrawer>
  )
}

export default memo(forwardRef(CommonTableDrawer))

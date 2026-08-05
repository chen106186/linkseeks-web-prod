import React, { useRef, useImperativeHandle, useEffect } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card } from 'antd'
import StandardTable from '@/components/StandardTable'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ColumnType } from 'antd/lib/table/interface'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormEffectHooks, ISchemaFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { searchSelectGetSelectCategoryOptionEffect } from '@/pages/transaction/effect/index'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import moment from 'moment'
const { onFormMount$ } = FormEffectHooks
interface Iprops {
  /** 列表接口 */
  // fetch?: () => Promise<unknown>,
  fetch?: any
  /** 多选返回 */
  fetchRowkeys?(e: any)
  /** 操作按钮 */
  controllerBtns?: React.ReactNode
  /** 搜索的schema */
  schema?: any
  /** 列表表头 */
  columns: ColumnType<any>[]
  /** schema搜索第一个的name */
  effects?: string
  /** 是否多选 */
  selectedRow?: boolean
  /** 刷新 */
  reload?: any
  /** 外部状态接口 */
  externalStatusFetch?: Promise<unknown>
  /** 内部状态接口 */
  interiorStatusFetch?: Promise<unknown>
  /** 状态选择接口 */
  useStateEffects?: () => void
  /** rowKey */
  rowKey?: string
  /** 选择的keyId */
  activeKey?: string
  /** 禁用 */
  getCheckboxProps?: (record: any) => void
  /**
   * pageTitle
   */
  pageTitle?: string
  /** 默认参数 */
  defaultParams?: any

  /** 选中的列表 */
  fetchRowSelect?: (e) => void

  /**
   * 自定义effects
   */
  customerEffects?: (context: any, actions: ISchemaFormActions | ISchemaFormActions) => void
  /**
   * 副标题，大部分场景是放 归属公司 组件
   */
  subTitle?: React.ReactNode
}
const formActions = createFormActions()
const Table: React.FC<Iprops> = (props: any) => {
  const {
    schema,
    columns,
    effects,
    fetch,
    controllerBtns,
    selectedRow,
    reload,
    fetchRowkeys,
    externalStatusFetch,
    interiorStatusFetch,
    useStateEffects,
    rowKey,
    activeKey,
    getCheckboxProps,
    defaultParams,
  } = props
  const tableRef = useRef<any>({})
  const [selectRow, selectRowFns] = useRowSelectionTable({
    customKey: activeKey || 'id',
    extendsSelection: {
      getCheckboxProps: (record) => getCheckboxProps && getCheckboxProps(record),
    },
  })
  /** 列表数据 */
  const fetchData = (params?: any) => {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(fetch)) {
        if (params?.billEndTime) {
          params.billEndTime = moment(parseInt(params.billEndTime)).format('YYYY-MM-DD HH:mm:ss')
        }

        if (params?.billStartTime) {
          params.billStartTime = moment(parseInt(params.billStartTime)).format('YYYY-MM-DD HH:mm:ss')
        }
        fetch({ ...params, ...defaultParams }, { ctlType: 'none' })
          .then((res) => {
            const data = {
              totalCount: res.data.totalCount,
              data: res.data.data || [],
            }
            resolve(data)
          })
          .catch((error) => {
            console.warn(error)
          })
        return
      }
      resolve({
        code: 1000,
        data: fetch,
      })
    })
  }

  useImperativeHandle(reload, () => ({
    reloadCurrent: () => {
      tableRef.current.reloadCurrent()
      selectRowFns.setSelectRow([])
      selectRowFns.setSelectedRowKeys([])
    },
  }))

  // 搜索
  const search = (values: any) => {
    tableRef.current.reload(values)
  }

  const useBusinessEffects = () => {
    const linkage = useLinkageUtils()
    onFormMount$().subscribe(() => {
      externalStatusFetch &&
        externalStatusFetch
          .then((res) => {
            console.log(res, 10086)
            const _enum = res.data.map((item) => {
              return { label: item.name, value: item.state }
            })
            linkage.enum('externalState', _enum)
            linkage.enum('externalStatusList', _enum)
            linkage.enum('status', _enum)
          })
          .catch((error) => {
            console.warn(error)
          })
      interiorStatusFetch &&
        interiorStatusFetch
          .then((res) => {
            const _enum = res.data.map((item) => {
              return { label: item.name, value: item.state }
            })
            linkage.enum('interiorState', _enum)
            linkage.enum('innerStatusList', _enum)
          })
          .catch((error) => {
            console.warn(error)
          })
    })
  }

  useEffect(() => {
    fetchRowkeys && fetchRowkeys(selectRowFns.selectedRowKeys)
  }, [selectRowFns])

  return (
    <PageHeaderWrapper backDom={false}>
      <Card>
        <StandardTable
          currentRef={tableRef}
          columns={columns}
          tableProps={{ rowKey: rowKey ? rowKey : 'id', scroll: { x: '100%' } }}
          rowSelection={selectedRow && selectRow}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              components={{
                controllerBtns: () => controllerBtns,
              }}
              onSubmit={(values) => search(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, effects, FORM_FILTER_PATH)
                FormEffectHooks.onFieldChange$('category').subscribe((state) => {
                  searchSelectGetSelectCategoryOptionEffect(actions, 'category')
                })
                useBusinessEffects()
                useStateEffects && useStateEffects()
              }}
              schema={schema}
            ></NiceForm>
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Table

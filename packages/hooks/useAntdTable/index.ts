import { useEffect, useMemo, useRef, useState } from 'react'
import useMemoizedFn from '../useMemoizedFn'
import usePagination from '../usePagination'
import useUpdateEffect from '../useUpdateEffect'

import type { Antd4ValidateFields, AntdTableOptions, Data, Params, Service, AntdTableResult } from './types'

const useAntdTable = <TData extends Data, TParams extends Params>(
  service: Service<TData, TParams>,
  options: AntdTableOptions<TData, TParams> = {},
) => {
  const {
    form,
    defaultType = 'simple',
    defaultParams,
    manual = false,
    refreshDeps = [],
    ready = true,
    ...rest
  } = options
  // 这里将表格可能会返回的值全部收集起来，后续如果有filter和sorter可逐步放开
  //@ts-ignore
  const handleService = useMemoizedFn((payload, params) => {
    const { current, pageSize, filter, sorter, extra } = payload
    return service({ current, pageSize, ...defaultParams[0], ...params })
  })
  const runSuccessRef = useRef(false)
  const result = usePagination<TData, TParams>(handleService, {
    manual: true,
    defaultParams,
    ...rest,
    onSuccess(...args) {
      runSuccessRef.current = true
      rest.onSuccess?.(...args)
    },
  })

  const { params = [], run, data } = result

  // @ts-ignore
  const dataSource = data?.data?.totalCount !== undefined ? data?.data.data : data?.data
  const cacheFormTableData = params[2] || ({} as any)

  const [type, setType] = useState(cacheFormTableData?.type || defaultType)

  const allFormDataRef = useRef<Record<string, any>>({})
  const defaultDataSourceRef = useRef([])

  const isAntdV4 = !!form?.getInternalHooks

  // get current active field values
  const getActiveFieldValues = () => {
    if (!form) {
      return {}
    }

    // antd 4
    if (isAntdV4) {
      return form.getFieldsValue(null, () => true)
    }
  }

  const validateFields = (): Promise<Record<string, any>> => {
    if (!form) {
      return Promise.resolve({})
    }
    const activeFieldsValue = getActiveFieldValues()
    const fields = Object.keys(activeFieldsValue)

    // antd 4
    if (isAntdV4) {
      return (form.validateFields as Antd4ValidateFields)(fields)
    }
  }

  const restoreForm = () => {
    if (!form) {
      return
    }

    // antd v4
    if (isAntdV4) {
      return form.setFieldsValue(allFormDataRef.current)
    }
  }

  const changeType = () => {
    const activeFieldsValue = getActiveFieldValues()
    allFormDataRef.current = {
      ...allFormDataRef.current,
      ...activeFieldsValue,
    }
    setType((t) => (t === 'simple' ? 'advance' : 'simple'))
  }

  const _submit = (initPagination?: TParams[0]) => {
    if (!ready) {
      return
    }
    setTimeout(() => {
      validateFields()
        .then((values = {}) => {
          const pagination = {
            pageSize: options.defaultPageSize || 10,
            ...(params?.[0] || {}),
            current: options.defaultCurrent || 1,
            // 外部传入的参数优先级最高
            ...initPagination,
          }
          if (!form) {
            // @ts-ignore
            run(pagination)
            return
          }

          // record all form data
          allFormDataRef.current = {
            ...allFormDataRef.current,
            ...values,
          }

          // @ts-ignore
          run(pagination, values, {
            allFormData: allFormDataRef.current,
            type,
          })
        })
        .catch((err) => err)
    })
  }

  const reset = () => {
    if (form) {
      form.resetFields()
    }
    _submit({
      ...(defaultParams?.[0] || {}),
      pageSize: options.defaultPageSize || options.defaultParams?.[0]?.pageSize || 10,
      current: 1,
    })
  }

  const reload = () => {
    _submit({
      ...(defaultParams?.[0] || {}),
      pageSize: options.defaultPageSize || options.defaultParams?.[0]?.pageSize || 10,
      current: 1,
    })
  }

  const submit = (e?: any) => {
    e?.preventDefault?.()
    _submit({
      pageSize: options.defaultPageSize || options.defaultParams?.[0]?.pageSize || 10,
      current: 1,
      ...(defaultParams?.[0] || {}),
    })
  }

  const onTableChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    const [oldPaginationParams, ...restParams] = params || []
    run(
      // @ts-ignore
      {
        ...oldPaginationParams,
        current: pagination.current,
        pageSize: pagination.pageSize,
        filters,
        sorter,
        extra,
      },
      ...restParams,
    )
  }

  // init
  useEffect(() => {
    // if has cache, use cached params. ignore manual and ready.
    if (params.length > 0) {
      allFormDataRef.current = cacheFormTableData?.allFormData || {}
      restoreForm()
      // @ts-ignore
      run(...params)
      return
    }
    if (!manual && ready) {
      allFormDataRef.current = defaultParams?.[1] || {}
      restoreForm()

      _submit(defaultParams?.[0])
    }
  }, [])

  // change search type, restore form data
  useUpdateEffect(() => {
    if (!ready) {
      return
    }
    restoreForm()
  }, [type])

  // refresh & ready change on the same time
  const hasAutoRun = useRef(false)
  hasAutoRun.current = false

  useUpdateEffect(() => {
    if (!manual && ready) {
      hasAutoRun.current = true
      if (form) {
        form.resetFields()
      }
      allFormDataRef.current = defaultParams?.[1] || {}
      restoreForm()
      _submit(defaultParams?.[0])
    }
  }, [ready])

  useUpdateEffect(() => {
    if (hasAutoRun.current) {
      return
    }
    if (!ready) {
      return
    }
    if (!manual) {
      hasAutoRun.current = true
      result.pagination.changeCurrent(1)
    }
  }, [...refreshDeps])
  return {
    ...result,
    tableProps: {
      /**
       * @notice 这里的dataSource做了兼容处理，允许传入的service 是以{ data: [], totalCount: number }返回，也可以是 { data: { data: [], totalCount: number }, code: number }
       */
      dataSource: dataSource || defaultDataSourceRef.current,
      loading: result.loading,
      onChange: useMemoizedFn(onTableChange),
      pagination: {
        current: result.pagination.current,
        pageSize: result.pagination.pageSize,
        total: result.pagination.total,
      },
    },
    search: {
      submit: useMemoizedFn(submit),
      type,
      changeType: useMemoizedFn(changeType),
      reset: useMemoizedFn(reset),
      reload: useMemoizedFn(reload),
    },
  } as AntdTableResult<TData, TParams>
}

export default useAntdTable

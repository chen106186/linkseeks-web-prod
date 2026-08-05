import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Drawer, Space, Popconfirm } from 'antd'
import { PageHeaderWrapper, AuthButton, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { SchemaForm, createAsyncFormActions } from '@apps/formily'
import { monitoringBodyJsonEditSchema as editSchema } from './schemas'
import {
  getApiErrorRecordGetPageRecords,
  postApiErrorRecordResend,
  postApiErrorRecordBatchResend,
  postApiErrorRecordUpdateBodyById,
} from '@apps/apis'
import styles from './index.less'
import useSelectOptions from './services/hooks/useSelectOptions'

const editActions = createAsyncFormActions()

const DEFAULT_EMPTY_TABLE = { totalCount: 0, data: [] }

/**
 *
 * @function 业务监控
 */
const MonitoringIndex: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>()
  const ref = StandardFormTable.useTableRef()
  const selectData = useSelectOptions()
  const [queryParams, setQueryParams] = useState<any>({})
  useEffect(() => {
    ref.current.reload()
  }, [])
  /** 编辑消息体 */
  const handleEditBody = async (values: any) => {}

  /** 根据选中数据id重新执行 */
  const postReExecutionBySelections = async (recordIds?: number[]) => {
    const ids = recordIds ? recordIds : ref?.current?.selectionKeys
    console.log(ref, 'ref')
    if (ids.length) {
      try {
        setIsLoading(true)
        const res = await postApiErrorRecordResend({ id: ids }, { useApiPrefix: true })
        if (res.code === 1000) {
          ref.current.reload()
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 0,
      fixed: 'left',
    },
    {
      title: '主题',
      dataIndex: 'apiName',
      key: 'apiName',
      searchField: {
        type: 'Select',
        name: 'type',
        linkage(value, searchAction, form) {
          if (!value) {
            form.setFieldValue('url', undefined)
          }
        },
      },
    },
    {
      title: '数据流向',
      dataIndex: 'typeName',
      key: 'typeName',
      searchField: {
        type: 'Select',
        name: 'url',
      },
    },
    {
      title: '错误日志（告警内容）',
      dataIndex: 'remark',
      key: 'remark',
      searchField: 'Input',
    },
    {
      title: '消息体（json）',
      dataIndex: 'body',
      key: 'body',
      searchField: {
        main: true,
      },
    },
    {
      title: '告警时间',
      dataIndex: 'createTime',
      key: 'createTime',
      searchField: {
        type: 'DateRange',
        name: ['startTime', 'endTime'],
        placeholder: ['起始时间', '截止时间'],
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      fixed: 'right',
      render: (id, record) => (
        <Space>
          <AuthButton type="custom" code="reStart">
            <a onClick={() => postReExecutionBySelections([id])}>重新执行</a>
          </AuthButton>
          <AuthButton type="custom" code="edit">
            <a onClick={() => setEditingRecord(record)}>编辑</a>
          </AuthButton>
        </Space>
      ),
    },
  ].map((column) => ({
    ...column,
    ellipsis: true,
    textWrap: 'word-break',
  }))

  /** 查询业务监控列表 */
  const getMonitoringData = async (params: any) => {
    setIsLoading(true)
    try {
      setQueryParams(params)
      const res = await getApiErrorRecordGetPageRecords(params, { useApiPrefix: true })
      return res?.data || DEFAULT_EMPTY_TABLE
    } catch (error) {
      return DEFAULT_EMPTY_TABLE
    } finally {
      setIsLoading(false)
    }
  }

  /** 根据筛选条件重新执行全部 */
  const postReExecutionByConditions = async () => {
    try {
      setIsLoading(true)
      const res = await postApiErrorRecordBatchResend(
        {
          ...queryParams,
          current: undefined,
          pageSize: undefined,
        },
        { useApiPrefix: true },
      )
      if (res.code === 1000) {
        ref.current.reload()
      }
    } catch (error) {
      console.log(error, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  /** 编辑保存消息体json */
  const postJsonBodyEdition = async () => {
    const { values } = await editActions.submit()
    const res = await postApiErrorRecordUpdateBodyById(
      {
        id: editingRecord?.id,
        body: values?.body,
      },
      { useApiPrefix: true },
    )
    if (res.code === 1000) {
      setEditingRecord(undefined)
      ref.current.reload()
    }
  }

  useEffect(() => {
    if (editingRecord?.body) {
      editActions.setFieldValue('body', editingRecord.body || '')
    }
  }, [editingRecord])

  return (
    <PageHeaderWrapper
      backDom={false}
      extra={
        <div>
          <AuthButton type="custom" code="batch">
            <Popconfirm
              okText="确定"
              cancelText="取消"
              placement="topRight"
              title={`确定要批量执行吗？`}
              onOpenChange={(visible) => visible && window.scrollTo(0, 0)}
              onConfirm={() => postReExecutionBySelections()}
            >
              <Button type="primary" className={styles['batch-executor']}>
                批量执行
              </Button>
            </Popconfirm>
          </AuthButton>
          <AuthButton type="custom" code="restart">
            <Popconfirm
              okText="确定"
              cancelText="取消"
              placement="topRight"
              onConfirm={postReExecutionByConditions}
              title="确定要根据当前筛选条件，重新执行全部吗？"
              onOpenChange={(visible) => visible && window.scrollTo(0, 0)}
            >
              <Button type="primary" className={styles['batch-executor']}>
                全部重新执行
              </Button>
            </Popconfirm>
          </AuthButton>
        </div>
      }
    >
      <Card className={styles['monitoring-index']}>
        <StandardFormTable
          columns={columns}
          autoScrollX
          request={(params) => getMonitoringData(params)}
          rowKey="id"
          actionRef={ref}
          isRowSelection
          searchSelectMaps={selectData}
          tableProps={{
            loading: isLoading,
          }}
        />
      </Card>

      <Drawer
        width="1200"
        destroyOnClose
        title="编辑消息体（json）"
        className={styles['json-edit-drawer']}
        open={Boolean(editingRecord)}
        onClose={() => setEditingRecord(undefined)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setEditingRecord(undefined)}>取消</Button>
              <Button type="primary" onClick={postJsonBodyEdition}>
                保存
              </Button>
            </Space>
          </div>
        }
      >
        <SchemaForm schema={editSchema} actions={editActions} />
      </Drawer>
    </PageHeaderWrapper>
  )
}

export default MonitoringIndex

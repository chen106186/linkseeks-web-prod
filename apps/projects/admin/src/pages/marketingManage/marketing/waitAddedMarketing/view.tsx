/** 待新增平台营销活动 */
import React, { Fragment, useRef, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button, Popconfirm, message } from 'antd'
import StatusTag from '@/components/StatusTag'
import { EyeAuthButton, AuthButton, EditAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import {
  getMarketingPlatformActivityPageTobeAdd,
  postMarketingPlatformActivityDelete,
  postMarketingPlatformActivityDeleteBatch,
  postMarketingPlatformActivitySubmit,
  postMarketingPlatformActivitySubmitBatch,
} from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'

const WaitAddedMarketing: React.FC = () => {
  const ref = useRef({} as ActionType)
  const [loading, setLoading] = useState<boolean>(false)
  const selectData = useSelectOptions()
  /** 批量审核 */
  const fetchSubmitBatch = async (id?: number) => {
    let res: any = null
    if (id) {
      res = await postMarketingPlatformActivitySubmit({ id: Number(id) })
    } else {
      if (ref.current?.selectionKeys.length > 0) {
        res = await postMarketingPlatformActivitySubmitBatch({ idList: ref.current?.selectionKeys })
      } else {
        message.info('请选择一条记录')
      }
    }
    if (res.code === 1000) {
      ref.current.reload()
    }
  }

  /**
   * 删除或批量删除
   * @type: 1: 单个删除, 2: 批量删除
   * */
  const fetchDeleteBatch = async (id?: number) => {
    let res: any = null
    if (id) {
      res = await postMarketingPlatformActivityDelete({ id })
    } else {
      res = await postMarketingPlatformActivityDeleteBatch({ idList: ref.current?.selectionKeys })
    }
    setLoading(true)
    if (res.code !== 1000) {
      setLoading(false)
      return
    }
    setLoading(false)
    ref.current.reload()
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '活动ID',
      key: 'id',
      dataIndex: 'id',
      fixed: 'left',
      width: 60,
      searchField: {
        type: 'InputNumber',
      },
    },
    {
      title: '活动名称',
      key: 'activityName',
      dataIndex: 'activityName',
      fixed: 'left',
      searchField: {
        main: true,
      },
      render: (text, record) => (
        <EyeAuthButton url={`/marketingManage/marketing/waitAddedMarketing/detail?id=${record.id}`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: '活动类型',
      key: 'activityType',
      dataIndex: 'activityType',
      searchField: 'Select',
      render: (_text, record) => <>{record.activityTypeName}</>,
    },
    {
      title: '活动开始时间',
      key: 'startTime',
      dataIndex: 'startTime',
      searchField: {
        type: 'DateRange',
        title: '发布时间',
        name: ['startTime', 'endTime'],
        placeholder: ['开始时间', '结束时间'],
      },
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '活动结束时间',
      key: 'endTime',
      dataIndex: 'endTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '报名开始时间',
      key: 'signUpStartTime',
      dataIndex: 'signUpStartTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '报名结束时间',
      key: 'signUpEndTime',
      dataIndex: 'signUpEndTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '外部状态',
      key: 'outerStatus',
      dataIndex: 'outerStatus',
      render: (text, record) => <StatusTag type="danger" title={record.outerStatusName} />,
    },
    {
      title: '内部状态',
      key: 'innerStatus',
      dataIndex: 'innerStatus',
      render: (text, record) => <StatusTag type="danger" title={record.innerStatusName} />,
    },
    {
      title: '操作',
      key: 'state',
      dataIndex: 'state',
      fixed: 'right',
      render: (text, record) => (
        <Fragment>
          <AuthButton type="custom" code="submit">
            {record.submit && (
              <Popconfirm
                title="确定要提交吗？"
                okText="是"
                cancelText="否"
                onConfirm={() => fetchSubmitBatch(record.id)}
              >
                <Button type="link">提交</Button>
              </Popconfirm>
            )}
          </AuthButton>
          <EditAuthButton>
            {record.update && (
              <Button
                type="link"
                onClick={() => history.push(`/marketingManage/marketing/waitAddedMarketing/edit?id=${record.id}`)}
              >
                修改
              </Button>
            )}
          </EditAuthButton>
          <AuthButton type="custom" code="delete">
            {record.delete && (
              <Popconfirm
                title="确定要删除吗？"
                okText="是"
                cancelText="否"
                onConfirm={() => fetchDeleteBatch(record.id)}
              >
                <Button type="link">删除</Button>
              </Popconfirm>
            )}
          </AuthButton>
        </Fragment>
      ),
    },
  ]

  const fetchData = async (params: any) => {
    return new Promise((resolve) => {
      const payload = { ...params }
      getMarketingPlatformActivityPageTobeAdd({ ...payload }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        searchSelectMaps={selectData}
        isRowSelection
        searchButtons={[
          {
            key: 'add',
            children: '新增',
            icon: <PlusOutlined />,
            type: 'primary',
            onClick() {
              history.push(`/marketingManage/marketing/waitAddedMarketing/add`)
            },
          },
          {
            key: 'deleteBatch',
            children: '批量删除',
            icon: <DeleteOutlined />,
            loading: loading,
            onClick() {
              fetchDeleteBatch()
            },
          },
          {
            key: 'submitBatch',
            children: '批量提交审核',
            loading: loading,
            onClick() {
              fetchSubmitBatch()
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}
export default WaitAddedMarketing

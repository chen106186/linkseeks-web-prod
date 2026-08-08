/**
 * 流程配置
 * @author: Crayon
 */
import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { PageHeaderWrapper, AddAuthButton, EditAuthButton, AuthButton, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { Button, Modal, Popconfirm, Space } from 'antd'
import {
  getEngineProcessEnginePage,
  postEngineProcessEngineDelete,
  postEngineProcessEngineInitEngine,
} from '@apps/apis'
import { PlusOutlined } from '@ant-design/icons'

const ProcessConfig: React.FC = () => {
  const ref = useRef({} as ActionType)

  const fetchData = async (params) => {
    const { data } = await getEngineProcessEnginePage(params)
    return data
  }

  const onDelete = async (id: number) => {
    const res = await postEngineProcessEngineDelete({ processEngineId: id })
    if (res.code === 1000) {
      ref.current.reload()
    }
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '流程ID',
      dataIndex: 'processKey',
      key: 'processKey',
    },
    {
      title: '流程名称',
      dataIndex: 'processName',
      key: 'processName',
      searchField: {
        main: true,
      },
    },
    {
      title: '流程类型',
      dataIndex: 'typeName',
      key: 'typeName',
    },
    {
      title: '流程描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (_, record: any) => {
        return (
          <Space size={16}>
            <EditAuthButton>
              <a
                onClick={() => {
                  history.push(`/systemManage/systemConfig/process/edit?id=${record.processEngineId}`)
                }}
              >
                修改
              </a>
            </EditAuthButton>
            <AuthButton type="custom" code="delete">
              <Popconfirm
                title="确定要执行这个操作?"
                onConfirm={() => onDelete(record.processEngineId)}
                okText="是"
                cancelText="否"
              >
                <a>删除</a>
              </Popconfirm>
            </AuthButton>
          </Space>
        )
      },
    },
  ]

  const handleInitEngine = () => {
    Modal.confirm({
      content: '确认要执行全量初始化？',
      centered: true,
      onOk: () => {
        return new Promise((resolve, reject) => {
          postEngineProcessEngineInitEngine()
            .then((res) => {
              if (res.code === 1000) {
                resolve(true)
                ref.current.reload()
              } else {
                reject()
              }
            })
            .catch(() => {
              reject()
            })
        })
      },
    })
  }

  return (
    <PageHeaderWrapper
      extra={
        <Space>
          <AuthButton type="custom" code="init">
            <Button type="primary" onClick={handleInitEngine}>
              全量初始化
            </Button>
          </AuthButton>
          <AddAuthButton>
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                history.push('/systemManage/systemConfig/process/add')
              }}
              type="primary"
            >
              新增
            </Button>
          </AddAuthButton>
        </Space>
      }
    >
      <StandardFormTable actionRef={ref} columns={columns} rowKey="processEngineId" request={fetchData} autoScrollX />
    </PageHeaderWrapper>
  )
}

export default ProcessConfig

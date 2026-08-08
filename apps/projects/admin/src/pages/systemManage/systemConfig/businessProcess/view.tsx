/**
 * 流程业务规则配置
 * @author: Crayon
 */
import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { PageHeaderWrapper, EditAuthButton, AuthButton, AddAuthButton, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { Button, Popconfirm, Space } from 'antd'
import { getEngineProcessRuleConfigPage, postEngineProcessRuleConfigDelete } from '@apps/apis'
import { PlusOutlined } from '@ant-design/icons'

const ProcessSetting: React.FC = () => {
  const ref = useRef({} as ActionType)

  const fetchData = async (params) => {
    const { data } = await getEngineProcessRuleConfigPage(params)
    return data
  }

  const onDelete = async (id: number) => {
    const res = await postEngineProcessRuleConfigDelete({ processRuleConfigId: id })
    if (res.code === 1000) {
      ref.current.reload()
    }
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '流程ID',
      dataIndex: 'processId',
      key: 'processId',
    },
    {
      title: '流程名称',
      dataIndex: 'processName',
      key: 'processName',
      searchField: 'Input',
    },
    {
      title: '流程步骤标识',
      dataIndex: 'processStep',
      key: 'processStep',
    },
    {
      title: '流程步骤名称',
      dataIndex: 'processStepName',
      key: 'processStepName',
    },
    {
      title: '流程步骤名称对应菜单URL',
      dataIndex: 'processStepMenuPath',
      key: 'processStepMenuPath',
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (value: any, record: any) => {
        return (
          <Space size={16}>
            <EditAuthButton>
              <a
                onClick={() => {
                  history.push(`/systemManage/systemConfig/businessProcess/edit?id=${record.processRuleConfigId}`)
                }}
              >
                修改
              </a>
            </EditAuthButton>
            <AuthButton type="custom" code="delete">
              <Popconfirm
                title="确定要执行这个操作?"
                onConfirm={() => onDelete(record.processRuleConfigId)}
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

  return (
    <PageHeaderWrapper
      backDom={false}
      extra={
        <AddAuthButton>
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              history.push('/systemManage/systemConfig/businessProcess/add')
            }}
            type="primary"
          >
            新增
          </Button>
        </AddAuthButton>
      }
    >
      <StandardFormTable
        actionRef={ref}
        columns={columns}
        rowKey="processRuleConfigId"
        request={fetchData}
        autoScrollX
      />
    </PageHeaderWrapper>
  )
}

export default ProcessSetting

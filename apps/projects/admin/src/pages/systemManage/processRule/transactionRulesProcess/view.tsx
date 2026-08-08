import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Space } from 'antd'
import { DetailAuthButton, EditAuthButton, AuthButton, StandardFormTable, PageHeaderWrapper } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { PlusOutlined } from '@ant-design/icons'
import PopconfirmBtn from '@/components/PopconfirmBtn'
import { _createTime, _id, _isDefault, _name, _operation, _processName, _status } from '../../constant/columns'
import {
  getOrderPlatformTradeProcessPage,
  postOrderPlatformTradeProcessDelete,
  postOrderPlatformTradeProcessStatusUpdate,
} from '@apps/apis'

const ProcessList: React.FC = () => {
  const ref = useRef({} as ActionType)

  const columns: RecordColumns<any>[] = [
    _id,
    _name(`/systemManage/processRule/transactionRulesProcess/detail?id=`),
    _processName,
    _createTime(),
    _isDefault,
    _status(({ processId }, status: number) => {
      postOrderPlatformTradeProcessStatusUpdate({ processId, status }).then((res) => {
        if (res.code === 1000) {
          ref.current.reload()
        }
      })
    }),
    {
      ..._operation,
      render: (_text, record) => (
        <Space size={16}>
          <DetailAuthButton>
            <a
              onClick={() => {
                history.push(`/systemManage/processRule/transactionRulesProcess/detail?id=${record.processId}`)
              }}
            >
              查看
            </a>
          </DetailAuthButton>
          {!!(!record.status || record.isDefault === 1) && (
            <>
              <EditAuthButton>
                <a
                  onClick={() => {
                    history.push(`/systemManage/processRule/transactionRulesProcess/add?id=${record.processId}`)
                  }}
                >
                  修改
                </a>
              </EditAuthButton>
              <AuthButton type="custom" code="delete">
                {record.isDefault !== 1 && (
                  <PopconfirmBtn
                    onConfirm={() => {
                      postOrderPlatformTradeProcessDelete({ processId: record.processId }).then((res) => {
                        if (res.code === 1000) {
                          ref.current.reload()
                        }
                      })
                    }}
                  >
                    删除
                  </PopconfirmBtn>
                )}
              </AuthButton>
            </>
          )}
        </Space>
      ),
    },
  ]

  const fetchData = async (params: any) => {
    const { data } = await getOrderPlatformTradeProcessPage(params)
    return data
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        actionRef={ref}
        columns={columns}
        rowKey="processId"
        request={fetchData}
        autoScrollX
        searchButtons={[
          {
            key: 'add',
            type: 'primary',
            icon: <PlusOutlined />,
            children: '新增',
            onClick() {
              history.push('/systemManage/processRule/transactionRulesProcess/add')
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}
export default ProcessList

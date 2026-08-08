import React, { useState } from 'react'
import { Space, Button, Modal, message } from 'antd'
import { PageHeaderWrapper, AuthButton, StandardFormTable } from '@apps/components'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useSelfTable } from './model/useLists'
import { getPayPlatFormAssetAccountGetCheckCashOutList, postPayPlatFormAssetAccountBatchCheck } from '@apps/apis'

const { confirm } = Modal

const CheckWithdraw: React.FC = () => {
  const { columns, ref } = useSelfTable()
  const [loading, setLoading] = useState(false)

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      const payload = { ...params }
      getPayPlatFormAssetAccountGetCheckCashOutList(payload).then((res) => {
        resolve(res.data)
      })
    })
  }

  const handleBatchCheck = () => {
    if (ref.current.selectionKeys.length > 0) {
      if (ref.current.getSelectionItems().some((item) => item.status !== 1)) {
        return message.error('只能选择状态为申请提现的项目进行操作！')
      }
      confirm({
        title: '确定要执行批量审核操作？',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          setLoading(true)
          postPayPlatFormAssetAccountBatchCheck({ idList: ref.current.selectionKeys }).then((res) => {
            if (res.code === 1000) {
              setTimeout(() => {
                setLoading(false)
                ref.current.reload()
              }, 800)
            } else {
              setLoading(false)
            }
          })
        },
        okType: 'danger',
        onCancel() {
          console.log('Cancel')
        },
        okText: '确定',
        cancelText: '取消',
      })
    } else {
      message.error('请先选择对应项目进行操作！')
    }
  }

  const controllerBtns = (
    <Space>
      <AuthButton type="custom" code="examineBatch">
        <Button onClick={handleBatchCheck}>批量审核通过</Button>
      </AuthButton>
    </Space>
  )

  return (
    <PageHeaderWrapper backDom={false}>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        isRowSelection
        searchButtons={[
          {
            key: 'ref',
            children: '批量审核通过',
            onClick() {
              handleBatchCheck()
            },
          },
        ]}
        tableProps={{ loading: loading }}
      />
    </PageHeaderWrapper>
  )
}

export default CheckWithdraw

import React, { useState, useEffect } from 'react'
import { Card, Button, message } from 'antd'
import { PATTERN_MAPS } from '@/constants/regExp'
import { VIP_RULE_TRANSACTION, VIP_RULE_LOGIN, VIP_RULE_COMMENT } from '@/constants/const/member'
import { PageHeaderWrapper } from '@apps/components'
import { ContainerOutlined } from '@ant-design/icons'
import { EditableCellTable } from '@/components/PolymericTable'
import { EditableCellProps, EditableColumns } from '@/components/PolymericTable/interface'
import {
  getMemberManageLevelRulePage,
  GetMemberManageLevelRulePageResponseDetail,
  postMemberManageLevelRuleScore,
} from '@apps/apis'

const MemberUpgradeRule: React.FC<[]> = () => {
  const PAGE_SIZE = 10
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [dataSource, setDataSource] = useState<GetMemberManageLevelRulePageResponseDetail[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitDisabled, setSubmitDisabled] = useState(false)

  const getRuleList = async (params) => {
    setListLoading(true)
    const res = await getMemberManageLevelRulePage(params)

    if (res.code === 1000) {
      const { data = [], totalCount } = res.data
      setDataSource(data)
      setTotal(totalCount)
    }
    setListLoading(false)
  }

  useEffect(() => {
    getRuleList({
      current: page,
      pageSize: size,
    })
  }, [])

  const columns: EditableColumns[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '项目',
      dataIndex: 'ruleName',
      align: 'center',
      render: (text: any, record: any) => <span>{text}</span>,
    },
    {
      title: '项目说明',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '可获取的分值',
      dataIndex: 'score',
      align: 'center',
      width: '30%',
      editable: true,
    },
  ]

  const handlePaginationChange = (current: number, pageSize: number) => {
    setPage(current)
    setSize(pageSize)
    getRuleList({
      current,
      pageSize,
    })
  }

  // 重新保存 dataSource
  const handleSave = (row) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => item.id === row.id)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
      score: +row.score,
    })
    setDataSource(newData)
  }

  // 表单元素校验失败事件
  const handleValidateError = (errInfo) => {
    // do something
  }

  const handleSubmit = async () => {
    if (!dataSource.length) {
      return
    }
    const payload = dataSource.map((item) => ({
      id: item.id,
      score: item.score,
    }))

    setSubmitLoading(true)
    try {
      const res = await postMemberManageLevelRuleScore(
        {
          items: payload,
        },
        {
          ctlType: 'none',
          penetrateError: true,
        },
      )

      if (res.code === 1000) {
        message.success('保存成功')
        getRuleList({
          current: page,
          pageSize: size,
        })
      } else {
        message.destroy()
        message.error(res.message)
      }
      setSubmitLoading(false)
    } catch (error) {
      setSubmitLoading(false)
    }
  }

  const rulesMap = {
    [VIP_RULE_TRANSACTION]: [
      {
        pattern: PATTERN_MAPS.money,
        message: '请输入整数或小数',
      },
    ],
    [VIP_RULE_LOGIN]: [
      {
        pattern: /^[0]$|^[1-9]+[0-9]*$/,
        message: '请输入整数数值',
      },
    ],
    [VIP_RULE_COMMENT]: [
      {
        pattern: /^[0]$|^[1-9]+[0-9]*$/,
        message: '请输入整数数值',
      },
    ],
  }

  const newColumns: any = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record, index): EditableCellProps => ({
        onSave: handleSave,
        onValidateError: handleValidateError,
        record,
        index,
        dataIndex: col.dataIndex,
        title: col.title,
        editable: col.editable || false,
        rules: [
          {
            required: true,
            message: '请输入相应值',
          },
          ...(rulesMap[record.ruleTypeEnum] || []),
        ],
        addonAfter: record.ruleTypeEnum === VIP_RULE_TRANSACTION ? '%' : null,
      }),
    }
  })

  return (
    <PageHeaderWrapper
      backDom={false}
      extra={
        <Button
          type="primary"
          icon={<ContainerOutlined />}
          loading={submitLoading}
          disabled={submitDisabled}
          onClick={handleSubmit}
        >
          保存
        </Button>
      }
    >
      <Card>
        <EditableCellTable
          dataSource={dataSource}
          columns={newColumns}
          loading={listLoading}
          pagination={{
            pageSize: size,
            total,
          }}
          onPaginationChange={handlePaginationChange}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default MemberUpgradeRule

import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Card, Button, Tooltip } from 'antd'
import { VIP_RULE_TRANSACTION, VIP_RULE_LOGIN, VIP_RULE_COMMENT } from '@/constants/member'
import { getMemberCustomerAbilityLevelRulePage, postMemberCustomerAbilityLevelRuleUpdatescore } from '@apps/apis'
import { PageHeaderWrapper } from '@apps/components'
import { ContainerOutlined } from '@ant-design/icons'
import { EditableCellTable } from '@/components/PolymericTable'
import { EditableCellProps, EditableRowProps, EditableColumns } from '@/components/PolymericTable/interface'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const MemberUpgradeRule: React.FC<[]> = () => {
  const PAGE_SIZE = 10
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [dataSource, setDataSource] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitDisabled, setSubmitDisabled] = useState(false)

  const intl = useIntl()

  const getRuleList = async (params) => {
    setListLoading(true)
    const res = await getMemberCustomerAbilityLevelRulePage(params)

    if (res.code === 1000) {
      const { data, totalCount } = res.data
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
      title: intl.formatMessage({ id: 'member.memberUpgradeRule.columns.id' }),
      dataIndex: 'id',
      width: '15%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberUpgradeRule.columns.ruleName' }),
      dataIndex: 'ruleName',
      width: '15%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberUpgradeRule.columns.remark' }),
      dataIndex: 'remark',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: intl.formatMessage({ id: 'member.memberUpgradeRule.columns.levelTypeName' }),
      dataIndex: 'levelTypeName',
      width: '15%',
    },
    {
      title: intl.formatMessage({ id: 'member.memberUpgradeRule.columns.score' }),
      dataIndex: 'score',
      width: '15%',
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
    console.log('errInfo', errInfo)
  }

  const handleSubmit = async () => {
    if (!dataSource.length) {
      return
    }
    try {
      const payload = dataSource.map((item) => ({
        id: item.id,
        score: item.score,
      }))

      setSubmitLoading(true)
      const res = await postMemberCustomerAbilityLevelRuleUpdatescore({
        items: payload,
      })

      if (res.code === 1000) {
        getRuleList({
          current: page,
          pageSize: size,
        })
      }
    } catch (error) {
    } finally {
      setSubmitLoading(false)
    }
  }

  const rulesMap = {
    [VIP_RULE_TRANSACTION]: [
      {
        pattern: /^([0]|[1-9]+[0-9]*)(\.[0-9]+)?$/,
        message: intl.formatMessage({ id: 'member.memberUpgradeRule.transaction.rules-legal' }),
      },
    ],
    [VIP_RULE_LOGIN]: [
      {
        pattern: /^[0]$|^[1-9]+[0-9]*$/,
        message: intl.formatMessage({ id: 'member.memberUpgradeRule.login.rules-legal' }),
      },
    ],
    [VIP_RULE_COMMENT]: [
      {
        pattern: /^[0]$|^[1-9]+[0-9]*$/,
        message: intl.formatMessage({ id: 'member.memberUpgradeRule.comment.rules-legal' }),
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
            message: intl.formatMessage({ id: 'member.memberUpgradeRule.columns.rules-required' }),
          },
          ...(rulesMap[record.ruleTypeEnum] || []),
        ],
        addonAfter: record.ruleTypeEnum === VIP_RULE_TRANSACTION ? '%' : null,
      }),
    }
  })

  const handleFieldsChange = (changedFields) => {
    const first = changedFields[0]
    if (first && first.errors.length) {
      setSubmitDisabled(true)
    } else {
      setSubmitDisabled(false)
    }
  }

  return (
    <PageHeaderWrapper
      extra={
        <AuthButton type="custom" code="submit">
          <Button
            type="primary"
            icon={<ContainerOutlined />}
            loading={submitLoading}
            disabled={submitDisabled}
            onClick={handleSubmit}
          >
            {intl.formatMessage({ id: 'member.memberUpgradeRule.save' })}
          </Button>
        </AuthButton>
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
          onRow={(): EditableRowProps => ({
            onFieldsChange: handleFieldsChange,
          })}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default MemberUpgradeRule

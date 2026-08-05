/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-28 15:24:56
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 17:22:19
 * @Description:
 */
import React, { useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Popconfirm, Button, Row, Col } from 'antd'
import theme from '../../../../../../../../../config/lingxi.theme.config'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { pagingArr } from './utils'
import ComingCtl, { ValueType as ComingCtlValueType } from '../ComingCtl'
import Search from '../Search'
import styles from './index.less'

const PAGE_SIZE = 5

const ComingConfigTable = (props) => {
  const { value = [], mutators, editable } = props
  const { roleId } = props.props['x-component-props'] || {}
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(PAGE_SIZE)

  const intl = useIntl()

  const handleDelete = (id: number) => {
    const newData = [...value]
    const index = newData.findIndex((item) => item.id === id)
    if (index !== -1) {
      newData.splice(index, 1)
    }
    mutators.change(newData)
  }

  const columns: EditableColumns[] = [
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.components.ComingConfigTable.columns.id' }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.components.ComingConfigTable.columns.fieldLocalName' }),
      dataIndex: 'fieldLocalName',
    },
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.components.ComingConfigTable.columns.groupName' }),
      dataIndex: 'groupName',
    },
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.components.ComingCtl.columns.fieldTypeName' }),
      dataIndex: 'fieldTypeName',
    },
    {
      title: intl.formatMessage({
        id: 'member.memberFlowRule.components.ComingCtl.columns.validate',
        defaultMessage: '变更需要审核',
      }),
      dataIndex: 'validate',
      render: (text) =>
        text
          ? intl.formatMessage({ id: 'common.button.yes', defaultMessage: '是' })
          : intl.formatMessage({ id: 'common.button.no', defaultMessage: '否' }),
    },
    {
      title: intl.formatMessage({
        id: 'member.memberFlowRule.components.ComingCtl.columns.allowSelect',
        defaultMessage: '搜索项',
      }),
      dataIndex: 'allowSelect',
      render: (text) =>
        text
          ? intl.formatMessage({ id: 'common.button.yes', defaultMessage: '是' })
          : intl.formatMessage({ id: 'common.button.no', defaultMessage: '否' }),
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      dataIndex: 'option',
      width: '20%',
      render: (_, record: any) => (
        <>
          {editable && (
            <Popconfirm
              title={intl.formatMessage({ id: 'member.memberFlowRule.components.ComingConfigTable.delete.tip' })}
              okText={intl.formatMessage({ id: 'member.memberFlowRule.components.ComingConfigTable.delete.yes' })}
              cancelText={intl.formatMessage({ id: 'member.memberFlowRule.components.ComingConfigTable.delete.no' })}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link" danger>
                {intl.formatMessage({ id: 'member.memberFlowRule.components.ComingConfigTable.delete' })}
              </Button>
            </Popconfirm>
          )}
        </>
      ),
    },
  ]

  const handleSearch = (next: string) => {
    setKeyword(next)
    setPage(1)
  }

  const handleConfirm = (value: ComingCtlValueType[]) => {
    mutators.change(value)
  }

  const handlePaginationChange = (current: number, pageSize: number) => {
    setPage(current)
    setSize(pageSize)
  }

  const filtered = keyword ? value.filter((item) => item.fieldLocalName.includes(keyword)) : [...value]
  let dataSource = filtered

  if (!editable) {
    dataSource = pagingArr(page, size, filtered)
  }

  return (
    <div className={styles['config-table']}>
      <Row
        justify="space-between"
        style={{
          marginBottom: theme['@margin-md'],
        }}
      >
        <Col span={16}>
          <ComingCtl value={value} roleId={roleId} onConfirm={handleConfirm} isCanAdd={editable} />
        </Col>
        <Col span={6}>
          <Search onSearch={handleSearch} />
        </Col>
      </Row>
      <PolymericTable
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        loading={false}
        pagination={
          !editable
            ? {
                current: page,
                pageSize: size,
                total: filtered.length,
              }
            : null
        }
        onPaginationChange={handlePaginationChange}
      />
    </div>
  )
}

ComingConfigTable.isFieldComponent = true

export default ComingConfigTable

/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-28 15:06:41
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 17:40:06
 * @Description: 平台注册资料
 */
import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Row, Col, Descriptions, Checkbox, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import theme from '../../../../../../../../../config/lingxi.theme.config'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import Search from '../Search'
import { getMemberSupplierProcessRuleRoleConfigPage } from '@apps/apis'

const PAGE_SIZE = 10

interface FetchListParams {
  /**
   * 角色id
   */
  roleId?: number
  /**
   * 当前页
   */
  current?: number
  /**
   * 当前页数
   */
  pageSize?: number
  /**
   * 名称
   */
  name?: string
}

interface IProps {
  /**
   * 角色id
   */
  roleId: number
}

const PlatformConfigTable = (props: IProps) => {
  const { roleId } = props
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(PAGE_SIZE)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({ data: [], totalCount: 0 })

  const intl = useIntl()

  const columns: EditableColumns[] = [
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.components.PlatformConfigTable.columns.id' }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.components.PlatformConfigTable.columns.fieldLocalName' }),
      dataIndex: 'fieldLocalName',
    },
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.components.PlatformConfigTable.columns.groupName' }),
      dataIndex: 'groupName',
    },
  ]

  const fetchMemberProcessRuleRoleConfigPage = async (params: FetchListParams = {}) => {
    if (!roleId) {
      return
    }
    setLoading(true)
    const nextName = params.name !== undefined ? params.name : name
    const res = await getMemberSupplierProcessRuleRoleConfigPage({
      roleId: `${roleId}`,
      current: `${params?.current || page}`,
      pageSize: `${params?.pageSize || size}`,
      name: nextName,
    })
    if (res.code === 1000) {
      setData(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMemberProcessRuleRoleConfigPage()
  }, [props.roleId])

  const handlePaginationChange = (current: number, pageSize: number) => {
    setPage(current)
    setSize(pageSize)
    fetchMemberProcessRuleRoleConfigPage({
      current,
      pageSize,
    })
  }

  const handleSearchChange = (value: string) => {
    setName(value)
  }

  const handleSearch = (value: string) => {
    fetchMemberProcessRuleRoleConfigPage({ current: 1, name: value })
  }

  return (
    <>
      <Row
        justify="space-between"
        align="middle"
        style={{
          marginBottom: theme['@margin-md'],
        }}
      >
        <Col span={16}>
          <Descriptions column={1} colon={false}>
            <Descriptions.Item
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {intl.formatMessage({ id: 'member.memberFlowRule.components.PlatformConfigTable.title' })}
                  <Tooltip
                    title={intl.formatMessage({
                      id: 'member.memberFlowRule.components.PlatformConfigTable.title-description',
                    })}
                  >
                    <QuestionCircleOutlined style={{ margin: '0 3px', cursor: 'default', marginLeft: 3 }} size={16} />
                  </Tooltip>
                </div>
              }
              labelStyle={{ width: 180 }}
              style={{
                paddingBottom: 0,
              }}
            >
              <Checkbox checked disabled>
                {intl.formatMessage({ id: 'member.memberFlowRule.components.PlatformConfigTable.default' })}
              </Checkbox>
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={6}>
          <Search value={name} onChange={handleSearchChange} onSearch={handleSearch} />
        </Col>
      </Row>
      <PolymericTable
        rowKey="id"
        dataSource={data.data}
        columns={columns}
        loading={loading}
        pagination={{
          current: page,
          pageSize: size,
          total: data.totalCount,
        }}
        onPaginationChange={handlePaginationChange}
      />
    </>
  )
}

export default PlatformConfigTable

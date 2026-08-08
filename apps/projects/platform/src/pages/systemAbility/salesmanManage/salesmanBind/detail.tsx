import React, { useEffect, useMemo, useState } from 'react'
import { Form, Button, Row, Col, Typography, Input } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { Card as CardLayout } from '@linkseeks/ui'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { useLocation, getCurrentRouter } from '@linkseeks/router-core'
import { createFormActions } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { getMemberAbilitySalesChannel } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'

const formActions = createFormActions()

export const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  labelAlign: 'left',
}
const intl = getIntl()

export const Tablink = [
  { key: 'basicLayout', label: intl.formatMessage({ id: 'shop.seo.tab.basic' }) },
  { key: 'manageLayout', label: intl.formatMessage({ id: 'channel.member.tab.manage.subordinate' }) },
]

const SalesmanBindDetail = (props) => {
  const ref = React.useRef<any>(null)

  const { pageStatus, id } = usePageStatus()

  const [tableData, setTableData] = useState<any[]>([])
  const [data, setData] = useState<any>({})
  const [keywordName, setKeywordName] = useState<string>('')
  const { pathname } = useLocation()

  const columns: ColumnType<any>[] = [
    {
      key: 'memberId',
      dataIndex: 'memberId',
      title: intl.formatMessage({ id: 'channel.member.table.memberId' }),
      ellipsis: true,
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: intl.formatMessage({ id: 'channel.member.table.memberName' }),
      ellipsis: true,
    },
    {
      key: 'memberTypeName',
      dataIndex: 'memberTypeName',
      title: intl.formatMessage({ id: 'channel.member.table.memberTypeName' }),
      ellipsis: true,
    },
    {
      key: 'roleName',
      dataIndex: 'roleName',
      title: intl.formatMessage({ id: 'channel.member.table.roleName' }),
      ellipsis: true,
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: intl.formatMessage({ id: 'channel.member.table.createTime' }),
      ellipsis: true,
    },
    {
      key: 'levelTag',
      dataIndex: 'levelTag',
      title: intl.formatMessage({ id: 'channel.member.table.levelTag' }),
      ellipsis: true,
    },
    {
      key: 'statusName',
      dataIndex: 'statusName',
      title: intl.formatMessage({ id: 'channel.member.table.statusName' }),
      ellipsis: true,
    },
  ]

  const fetchData = (params?: any) => {
    return new Promise((resolve, reject) => {
      resolve({
        code: 1000,
        data: [],
      })
    })
  }

  // 搜索
  const search = (values: any) => {
    ref.current.reload(values)
  }

  const fliterTableData = useMemo(() => {
    if (!keywordName) {
      return tableData
    }
    return tableData.filter((v) => v.name.toString().includes(keywordName))
  }, [tableData, keywordName])

  const fetchSaleChannel = async () => {
    getMemberAbilitySalesChannel({
      userId: id,
      current: '1',
      pageSize: '20',
      name: keywordName,
    }).then((res) => {
      if (res.code === 1000) {
        setData(res.data)
        setTableData(res.data.data)
      }
    })
  }

  useEffect(() => {
    fetchSaleChannel()
  }, [])

  const handleSearchChannel = () => {}

  return (
    <PageHeaderWrapper
      // hideBreak
      title={getCurrentRouter(pathname)?.title}
      items={Tablink}
    >
      <React.Fragment>
        <CardLayout id="basicLayout" title={intl.formatMessage({ id: 'shop.seo.tab.basic' })}>
          <Row gutter={[48, 24]}>
            <Col span={12}>
              <Form {...layout}>
                <Form.Item label={intl.formatMessage({ id: 'channel.form.salesman' })}>
                  <Typography.Text>{data?.name}</Typography.Text>
                </Form.Item>
                <Form.Item label={intl.formatMessage({ id: 'channel.member.table.orgName' })}>
                  <Typography.Text>{data?.orgName}</Typography.Text>
                </Form.Item>
                <Form.Item label={intl.formatMessage({ id: 'channel.member.table.jobTitle' })}>
                  <Typography.Text>{data?.jobTitle}</Typography.Text>
                </Form.Item>
                <Form.Item label={intl.formatMessage({ id: 'channel.member.table.memberRoleName' })}>
                  <Typography.Text>{data?.memberRoleName}</Typography.Text>
                </Form.Item>
                <Form.Item label={intl.formatMessage({ id: 'channel.member.table.bindphone' })}>
                  <Typography.Text>{data?.phone}</Typography.Text>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </CardLayout>
        <CardLayout id="manageLayout" title={intl.formatMessage({ id: 'channel.member.tab.manage.subordinate' })}>
          <Row justify="space-between" style={{ marginBottom: 20 }}>
            <Col style={{ display: 'flex' }}>
              <Input.Search
                placeholder={intl.formatMessage({ id: 'channel.form.memberName.placeholder' })}
                value={keywordName}
                onChange={(e) => setKeywordName(e.target.value)}
                onPressEnter={handleSearchChannel}
              />
              <Button type="default" style={{ marginLeft: 20 }} onClick={() => setKeywordName('')}>
                {intl.formatMessage({ id: 'common.button.reset' })}
              </Button>
            </Col>
          </Row>
          <StandardTable
            columns={columns}
            rowKey="relationId"
            tableProps={{
              dataSource: fliterTableData,
              pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                size: 'small',
                pageSizeOptions: ['10', '20', '50', '100'],
                total: fliterTableData.length,
                showTotal: () =>
                  intl.formatMessage({ id: 'componnets.standardTablePages', totalPage: fliterTableData.length }),
              },
            }}
          />
        </CardLayout>
      </React.Fragment>
    </PageHeaderWrapper>
  )
}
export default SalesmanBindDetail

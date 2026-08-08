import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Row, Col, Space, Popconfirm } from 'antd'
import TableLayout from '@/components/TableLayout'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { PlusOutlined } from '@ant-design/icons'
import { getMemberAbilitySalesPage, postMemberAbilitySalesDelete } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'

const PortalSystem = () => {
  const intl = useIntl()
  const tableRef = useRef<any>({})
  const { pathname } = useLocation()
  const updateItem = (record) => {
    history.push(`/systemAbility/salesmanManage/salesmanBind/edit?id=${record.userId}`)
  }

  const deleteItem = async (record) => {
    // 删除该项
    await postMemberAbilitySalesDelete({
      userId: record.userId,
    })
    tableRef.current.reloadCurrent()
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'channel.member.table.account' }),
      key: 'account',
      dataIndex: 'account',
    },
    {
      title: intl.formatMessage({ id: 'channel.member.table.name' }),
      key: 'name',
      dataIndex: 'name',
      render: (text, record) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/systemAbility/salesmanManage/salesmanBind/detail?id=${record.userId}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'channel.member.table.orgName' }),
      key: 'orgName',
      dataIndex: 'orgName',
    },
    {
      title: intl.formatMessage({ id: 'channel.member.table.bindphone' }),
      key: 'phone',
      dataIndex: 'phone',
    },
    {
      title: intl.formatMessage({ id: 'channel.member.table.jobTitle' }),
      key: 'jobTitle',
      dataIndex: 'jobTitle',
    },
    {
      title: intl.formatMessage({ id: 'channel.member.table.memberRoleName' }),
      key: 'memberRoleName',
      dataIndex: 'memberRoleName',
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      key: 'options',
      dataIndex: 'options',
      render: (text: any, record: any) => {
        return (
          <>
            <EditAuthButton>
              <Button type="link" onClick={() => updateItem(record)}>
                {intl.formatMessage({ id: 'common.button.modify' })}
              </Button>
            </EditAuthButton>
            {
              <AuthButton type="custom" code="delete">
                <Popconfirm
                  title={intl.formatMessage({ id: 'common.tip.option.confirm' })}
                  onConfirm={() => deleteItem(record)}
                  okText={intl.formatMessage({ id: 'common.button.yes' })}
                  cancelText={intl.formatMessage({ id: 'common.button.no' })}
                >
                  <Button type="link">{intl.formatMessage({ id: 'common.button.delete' })}</Button>
                </Popconfirm>
              </AuthButton>
            }
          </>
        )
      },
    },
  ]

  return (
    <TableLayout
      reload={tableRef}
      columns={columns}
      effects="account"
      rowKey="userId"
      fetch={getMemberAbilitySalesPage}
      schema={{
        type: 'object',
        properties: {
          megalayout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              grid: true,
            },
            properties: {
              ctl: {
                type: 'object',
                'x-component': 'controllerBtns',
              },
              account: {
                type: 'string',
                'x-component': 'Search',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'channel.member.table.account' }),
                },
              },
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              rowStyle: {
                flexWrap: 'nowrap',
              },
              colStyle: {
                marginLeft: 20,
              },
            },
            properties: {
              PRO_LAYOUT: {
                type: 'object',
                'x-component': 'mega-layout',
                'x-mega-props': {
                  span: 5,
                },
                'x-component-props': {
                  inline: true,
                },
                properties: {
                  name: {
                    type: 'string',
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'channel.member.table.name' }),
                      style: {
                        width: 160,
                      },
                    },
                  },
                },
              },
              sumbit: {
                'x-component': 'Submit',
                'x-mega-props': {
                  span: 1,
                },
                'x-component-props': {
                  children: intl.formatMessage({ id: 'portalSystem.chaxun', defaultMessage: '查询' }),
                },
              },
            },
          },
        },
      }}
      controllerBtns={
        <Row>
          <Col span={24}>
            <Space direction="horizontal" size={16}>
              <AddAuthButton>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => history.push(`/systemAbility/salesmanManage/salesmanBind/add`)}
                >
                  {intl.formatMessage({ id: 'portalSystem.added', defaultMessage: '新增' })}
                </Button>
              </AddAuthButton>
            </Space>
          </Col>
        </Row>
      }
    />
  )
}
export default PortalSystem

import React, { Fragment, useRef, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Row, Col, Space, Popconfirm, Switch } from 'antd'
import TableLayout from '@/components/TableLayout'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { PlusOutlined } from '@ant-design/icons'
import { getMemberStorePage, postMemberStoreDelete, postMemberStoreEnable } from '@apps/apis'
import { StatusAuthButton } from '@apps/components'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'

const PortalSystem = () => {
  const intl = useIntl()
  const { pathname } = useLocation()
  const tableRef = useRef<any>({})
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  const handleStatus = (record) => {
    setConfirmLoading(true)
    postMemberStoreEnable({
      id: record.id,
    }).then((res) => {
      setConfirmLoading(false)
      tableRef.current.reloadCurrent()
    })
  }

  const _delete = async (record) => {
    setConfirmLoading(true)
    await postMemberStoreDelete({ id: record.id }).then((res) => {
      setConfirmLoading(false)
      tableRef.current.reloadCurrent()
    })
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'portalSystem.mendiandaima', defaultMessage: '门店代码' }),
      key: 'code',
      dataIndex: 'code',
    },
    {
      title: intl.formatMessage({ id: 'portalSystem.mendianmingcheng', defaultMessage: '门店名称' }),
      key: 'name',
      dataIndex: 'name',
      render: (text, record) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/systemAbility/authConfig/portalSystem/detail?id=${record.id}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'portalSystem.mendiandizhi', defaultMessage: '门店地址' }),
      key: 'fullAddress',
      dataIndex: 'fullAddress',
    },
    {
      title: intl.formatMessage({ id: 'portalSystem.youbian', defaultMessage: '邮编' }),
      key: 'postalCode',
      dataIndex: 'postalCode',
    },
    {
      title: intl.formatMessage({ id: 'portalSystem.suoshujigou', defaultMessage: '所属机构' }),
      key: 'orgName',
      dataIndex: 'orgName',
    },
    {
      title: intl.formatMessage({ id: 'portalSystem.lianxiren', defaultMessage: '联系人' }),
      key: 'contactName',
      dataIndex: 'contactName',
    },
    {
      title: intl.formatMessage({ id: 'portalSystem.lianxidianhua', defaultMessage: '联系电话' }),
      key: 'phone',
      dataIndex: 'phone',
      render: (text, record) => (
        <>
          {record.countryCode}&nbsp;{text}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'portalSystem.zhuangtai', defaultMessage: '状态' }),
      key: 'status',
      dataIndex: 'status',
      render: (_text, record) => (
        <AuthButton type="custom" code="status">
          <StatusAuthButton handleConfirm={() => handleStatus(record)} record={record} />
        </AuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'portalSystem.caozuo', defaultMessage: '操作' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (_text, record) => (
        <Fragment>
          {record.showUpdate && (
            <EditAuthButton>
              <Button
                type="link"
                onClick={() => history.push(`/systemAbility/authConfig/portalSystem/edit?id=${record.id}`)}
              >
                {intl.formatMessage({ id: 'portalSystem.bianji', defaultMessage: '编辑' })}
              </Button>
            </EditAuthButton>
          )}
          {record.showDelete && (
            <AuthButton type="custom" code="delete">
              <Popconfirm
                title={intl.formatMessage({ id: 'portalSystem.quedingyaoshanchuma', defaultMessage: '确定要删除吗？' })}
                okText={intl.formatMessage({ id: 'portalSystem.shi', defaultMessage: '是' })}
                cancelText={intl.formatMessage({ id: 'portalSystem.fou', defaultMessage: '否' })}
                onConfirm={() => _delete(record)}
                okButtonProps={{ loading: confirmLoading }}
              >
                <Button type="link">
                  {intl.formatMessage({ id: 'portalSystem.shanchu', defaultMessage: '删除' })}
                </Button>
              </Popconfirm>
            </AuthButton>
          )}
        </Fragment>
      ),
    },
  ]

  return (
    <TableLayout
      reload={tableRef}
      columns={columns}
      effects="name"
      fetch={getMemberStorePage}
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
              name: {
                type: 'string',
                'x-component': 'Search',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'portalSystem.mendianmingcheng', defaultMessage: '门店名称' }),
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
              contactName: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'portalSystem.lianxiren', defaultMessage: '联系人' }),
                  style: {
                    width: 160,
                  },
                },
              },
              status: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'portalSystem.zhuangtai', defaultMessage: '状态' }),
                  style: {
                    width: 160,
                  },
                },
                enum: [
                  { label: intl.formatMessage({ id: 'portalSystem.qiyong', defaultMessage: '启用' }), value: 1 },
                  { label: intl.formatMessage({ id: 'portalSystem.tingyong', defaultMessage: '停用' }), value: 0 },
                ],
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
                  onClick={() => history.push(`/systemAbility/authConfig/portalSystem/add`)}
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

import React, { useRef } from 'react'
import { Row, Col, Card, Button, Dropdown, Menu, Space, Popconfirm, Modal } from 'antd'
import { createFormActions } from '@apps/formily'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { DownOutlined } from '@ant-design/icons'
import { tagColorStyle } from '../utils/utils'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import NiceForm from '@/components/NiceForm'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { ColumnType } from 'antd/lib/table/interface'
import moment from 'moment'
import { PageHeaderWrapper } from '@apps/components'
import { schema } from './schema'
import { ANNOUNCE_COLUMN_TYPE } from '../utils/utils'
import { getManageMemberNoticePage, postManageMemberNoticeDelete, postManageMemberNoticeUpdateStatus } from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const actions = createFormActions()

const STATUS_MAP = {
  '1': getIntl().formatMessage({ id: 'content.common.waitUp' }),
  '2': getIntl().formatMessage({ id: 'content.common.hadUp' }),
  '3': getIntl().formatMessage({ id: 'content.common.hadDown' }),
}

const STATUS_LIST = [
  '',
  getIntl().formatMessage({ id: 'content.common.up' }),
  getIntl().formatMessage({ id: 'content.common.down' }),
  getIntl().formatMessage({ id: 'content.common.up' }),
]
const CAN_MODIFY = [1, 3]

const controllerBtns = (
  <Row>
    <Col span={6}>
      <AuthButton type="add" code="contentAbility.add">
        <Button onClick={() => history.push('/contentAbility/announcements/add')} type="primary">
          {getIntl().formatMessage({ id: 'common.button.add' })}
        </Button>
      </AuthButton>
    </Col>
  </Row>
)

// 获取列表
const fetchData = (params: any) => {
  return new Promise((resolve) => {
    getManageMemberNoticePage(params).then((res) => {
      resolve(res.data)
    })
  })
}

const Announcements = () => {
  const intl = useIntl()
  const ref = useRef<any>({})

  const columns: ColumnType<any>[] = [
    { title: 'ID', dataIndex: 'id' },
    {
      title: intl.formatMessage({ id: 'content.info.column' }),
      dataIndex: 'columnType',
      render: (text) => {
        return <div>{ANNOUNCE_COLUMN_TYPE[text]}</div>
      },
    },
    {
      title: intl.formatMessage({ id: 'content.info.title' }),
      dataIndex: 'title',
      render: (text: string, record: any) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/contentAbility/announcements/detail?id=${record.id}&preview=1`}
          >
            {text}
          </EyeAuthButton>
        </DetailAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'content.info.time' }),
      dataIndex: 'createTime',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.formatMessage({ id: 'common.table.status' }),
      dataIndex: 'status',
      render: (text, record) => {
        return <span style={{ ...tagColorStyle[record.status], padding: '3px 5px' }}>{STATUS_MAP[record.status]}</span>
      },
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      render: (val, record) => {
        const menu = (
          <Menu>
            <AuthButton type="custom" code="edit">
              <Menu.Item key="edit">
                <Link to={`/contentAbility/announcements/detail?id=${record.id}`}>
                  {intl.formatMessage({ id: 'common.button.edit' })}
                </Link>
              </Menu.Item>
            </AuthButton>
            <AuthButton type="custom" code="del">
              <Menu.Item key="delete" onClick={() => handleDelete(record.id)}>
                <a>{intl.formatMessage({ id: 'common.button.delete' })}</a>
              </Menu.Item>
            </AuthButton>
          </Menu>
        )
        return (
          <Space>
            <AuthButton type="custom" code="state">
              <Popconfirm
                title={intl.formatMessage({ id: 'common.tip.option.confirm' })}
                onConfirm={() =>
                  handleUpdateStatus(
                    record.id,
                    STATUS_LIST[record.status] == intl.formatMessage({ id: 'content.common.up' }) ? 2 : 3,
                  )
                }
                okText={intl.formatMessage({ id: 'common.button.yes' })}
                cancelText={intl.formatMessage({ id: 'common.button.no' })}
              >
                <a href="#">{STATUS_LIST[record.status]}</a>
              </Popconfirm>
            </AuthButton>

            {CAN_MODIFY.includes(record.status) ? (
              <Dropdown overlay={menu}>
                <a>
                  {intl.formatMessage({ id: 'common.text.more' })} <DownOutlined />
                </a>
              </Dropdown>
            ) : null}
          </Space>
        )
      },
    },
  ]

  const handleDelete = (id) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'common.tip.option.confirm' }),
      onOk: () => {
        postManageMemberNoticeDelete({ id: id }).then((res) => {
          if (res.code === 1000) {
            ref.current.reloadCurrent()
          }
        })
      },
    })
  }

  // 修改状态
  const handleUpdateStatus = (id, status) => {
    // 该方法是上下架 所以 enableStatus 无用，随意传
    postManageMemberNoticeUpdateStatus({ id: id, shelfStatus: status, enableStatus: 0 }).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          columns={columns}
          currentRef={ref}
          tableProps={{ rowKey: 'id' }}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={actions}
              onSubmit={(values) => ref.current.reload(values)}
              expressionScope={{
                controllerBtns,
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'title', FORM_FILTER_PATH)
              }}
              schema={schema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Announcements

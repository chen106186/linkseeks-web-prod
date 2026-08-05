import React, { useEffect, useRef } from 'react'
import { Row, Col, Card, Button, Dropdown, Menu, Space, Modal, Popconfirm } from 'antd'
import { createFormActions } from '@apps/formily'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { DownOutlined } from '@ant-design/icons'
import { schema } from './schema'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import NiceForm from '@/components/NiceForm'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { ColumnType } from 'antd/lib/table/interface'
import { COLUMN_CATEGORY } from '../constant'
import moment from 'moment'
import { PageHeaderWrapper } from '@apps/components'
import {
  getManageMemberColumnAll,
  getManageMemberInformationPage,
  postManageMemberInformationBatch,
  postManageMemberInformationDelete,
  postManageMemberInformationUpdateStatus,
} from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const formActions = createFormActions()

const tagColorStyle = {
  '1': { color: '#606266', background: '#F4F5F7' },
  '2': { color: '#00A98F', background: '#EBF7F2' },
  '3': { color: '#E63F3B', background: '#FFEBE6' },
}

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

const Infomation = () => {
  const intl = useIntl()
  const ref = useRef<any>({})

  const columns: ColumnType<any>[] = [
    { title: 'ID', dataIndex: 'id' },
    {
      title: intl.formatMessage({ id: 'content.columns.category' }),
      dataIndex: 'type',
      render: (text) => COLUMN_CATEGORY[text],
    },
    { title: intl.formatMessage({ id: 'content.columns.name' }), dataIndex: 'columnName' },
    {
      title: intl.formatMessage({ id: 'content.info.title' }),
      dataIndex: 'title',
      render: (text: string, record: any) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/contentAbility/infomations/detail?id=${record.id}&preview=1`}
          >
            {text}
          </EyeAuthButton>
        </DetailAuthButton>
      ),
    },
    { title: intl.formatMessage({ id: 'content.info.category' }), dataIndex: 'categoryName' },
    { title: intl.formatMessage({ id: 'content.info.recommendTag' }), dataIndex: 'labelNames' },
    {
      title: intl.formatMessage({ id: 'content.info.sort' }),
      dataIndex: 'sort',
      sorter: (a, b) => a.sort - b.sort,
    },
    {
      title: intl.formatMessage({ id: 'content.info.time' }),
      dataIndex: 'createTime',
      sorter: (a, b) => a.createTime - b.createTime,
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
        // 只有待上架， 下架才有删除
        const menu = (
          <Menu>
            <AuthButton type="custom" code="edit">
              <Menu.Item>
                <Link to={`/contentAbility/infomations/detail?id=${record.id}`}>
                  {intl.formatMessage({ id: 'common.button.edit' })}
                </Link>
              </Menu.Item>
            </AuthButton>
            <AuthButton type="custom" code="del">
              <Menu.Item onClick={() => handleDelete(record.id)}>
                <a>{intl.formatMessage({ id: 'common.button.delete' })}</a>
              </Menu.Item>
            </AuthButton>
          </Menu>
        )
        return (
          <Space>
            {/* infomations.state */}
            <AuthButton type="custom" code="state">
              <Popconfirm
                title={intl.formatMessage({ id: 'common.tip.option.confirm' })}
                onConfirm={() =>
                  handleUpdateState(
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

  // 获取列表
  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getManageMemberInformationPage(params).then((res) => {
        resolve(res.data)
      })
    })
  }

  useEffect(() => {
    getManageMemberColumnAll().then((res) => {
      const { code, data } = res
      console.log(res)
      if (code === 1000) {
        const columnsList = data.map((item) => ({ label: item.name, value: item.id }))
        formActions.setFieldState('columnId', (state) => {
          state.props.enum = columnsList
        })
      }
    })
  }, [])

  // 修改状态
  const handleUpdateState = (id, status) => {
    // 该方法是上下架 所以 enableStatus 无用，随意传
    postManageMemberInformationUpdateStatus({ id: id, shelfStatus: status, enableStatus: 0 }).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'common.tip.option.confirm' }),
      onOk: () => {
        postManageMemberInformationDelete({ id: id }).then((res) => {
          if (res.code === 1000) {
            ref.current.reloadCurrent()
          }
        })
      },
    })
  }

  const controllerBtns = (
    <Row>
      <Col span={6}>
        <AuthButton type="add" code="add">
          <Button onClick={() => history.push('/contentAbility/infomations/add')} type="primary">
            {intl.formatMessage({ id: 'common.button.add' })}
          </Button>
        </AuthButton>
      </Col>
    </Row>
  )

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
              actions={formActions}
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

export default Infomation

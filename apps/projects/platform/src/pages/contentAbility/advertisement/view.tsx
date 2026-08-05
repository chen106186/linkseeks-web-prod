import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Space, Card, Button, Dropdown, Menu, Popconfirm, message } from 'antd'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  getManageMemberAdvertPage,
  GetManageContentAdvertPageRequest,
  getManageContentColumnAll,
  getManageContentInformationPage,
  postManageMemberAdvertDelete,
  postManageMemberAdvertUpdateStatus,
  postManageContentInformationBatch,
  postManageContentInformationDelete,
  postManageContentInformationUpdateStatus,
} from '@apps/apis'
import { createFormActions } from '@apps/formily'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { schema } from './schema'
// import { COLUMN_CATEGORY } from '@/constants/const/content';
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton, AuthButton } from '@apps/components'
import moment from 'moment'
import { PlusOutlined } from '@ant-design/icons'
import { ADVERTISE_APP_COLUMN_TYPE, ADVERTISE_WEB_COLUMN_TYPE } from '../utils/utils'
const ALL_TYPE = Object.assign({}, ADVERTISE_WEB_COLUMN_TYPE, ADVERTISE_APP_COLUMN_TYPE)

const formActions = createFormActions()

/** 待上架 */
const PENDING = 1
/** 已上架 */
const IS_UP = 2
/** 已下架 */
const IS_DOWN = 3

// const STATUS = ["待上架", "已上架", "已下架"]
const STATUS = [
  getIntl().formatMessage({ id: 'content.common.waitUp' }),
  getIntl().formatMessage({ id: 'content.common.hadUp' }),
  getIntl().formatMessage({ id: 'content.common.hadDown' }),
]

const AllQuery = () => {
  const ref = useRef<any>({})

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    {
      title: getIntl().formatMessage({ id: 'common.text.title' }),
      dataIndex: 'title',
      render: (text: string, record: any) => (
        <DetailAuthButton>
          <EyeAuthButton url={`/contentAbility/advertisement/detail?id=${record.id}&preview=1`}>{text}</EyeAuthButton>
        </DetailAuthButton>
      ),
    },
    {
      title: getIntl().formatMessage({ id: 'content.info.column' }),
      dataIndex: 'columnType',
      render: (text, record) => {
        return <div>{ALL_TYPE[text]}</div>
      },
    },
    {
      title: getIntl().formatMessage({ id: 'content.info.time' }),
      dataIndex: 'createTime',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: getIntl().formatMessage({ id: 'common.table.status' }),
      dataIndex: 'status',
      render: (value, record) => {
        return <a>{STATUS[record.status - 1]}</a>
      },
    },
    {
      title: getIntl().formatMessage({ id: 'balance.accountsReceivable.invoice.columns.operation' }),
      render: (value, record) => {
        return (
          <Space>
            <a onClick={() => handleUp(record.id, record.status === IS_UP ? IS_DOWN : IS_UP)}>
              {record.status === PENDING || record.status === IS_DOWN
                ? getIntl().formatMessage({ id: 'commodity.products.buttonGroup.5' })
                : getIntl().formatMessage({ id: 'commodity.products.buttonGroup.6' })}
            </a>
            {record.status === PENDING || record.status === IS_DOWN ? (
              <Popconfirm
                title={getIntl().formatMessage({ id: 'activityPage.ifConfirmDelete' })}
                onConfirm={() => handleDelete(record.id)}
                okText={getIntl().formatMessage({ id: 'balance.components.writeOffDrawer.ok' })}
                cancelText={getIntl().formatMessage({ id: 'authConfig.cancel' })}
              >
                <a>{getIntl().formatMessage({ id: 'common.button.delete' })}</a>
              </Popconfirm>
            ) : null}
          </Space>
        )
      },
    },
  ]

  const handleUp = async (id: number, status: 2 | 3) => {
    // 该方法是上下架 所以 enableStatus 无用，随意传
    const { code, data } = await postManageMemberAdvertUpdateStatus({ id, shelfStatus: status, enableStatus: 0 })
    if (code === 1000) {
      formActions.submit()
    }
  }

  const handleDelete = async (id: number) => {
    message.loading(`${getIntl().formatMessage({ id: 'member.management.import.query.delete-deleting' })}。。。`)
    const { data, code } = await postManageMemberAdvertDelete({ id })
    if (code === 1000) {
      formActions.submit()
    }
  }

  const ControllerBtns = () => (
    <Space>
      <AuthButton type="add">
        <Button
          type="primary"
          onClick={() => {
            history.push('/contentAbility/advertisement/add')
          }}
          icon={<PlusOutlined />}
        >
          {getIntl().formatMessage({ id: 'common.button.add' })}
        </Button>
      </AuthButton>
    </Space>
  )

  const handleSearch = (values: GetManageContentAdvertPageRequest) => {
    const format = 'YYYY-MM-DD'
    const { startTime, endTime, ...rest } = values
    const withTimes =
      startTime && endTime
        ? {
            startTime: moment(startTime, format).valueOf(),
            endTime: moment(endTime, format).valueOf(),
          }
        : {}
    const postData = {
      ...withTimes,
      ...rest,
    }
    ref.current.reload(postData)
  }

  const fetchData = async (params: GetManageContentAdvertPageRequest) => {
    const { data, code } = await getManageMemberAdvertPage(params)
    if (code === 1000) {
      return data
    }
    return {
      totalCount: 0,
      data: [],
    }
  }

  return (
    <PageHeaderWrapper title={getIntl().formatMessage({ id: 'advertisement.title' })}>
      <Card>
        <StandardTable
          columns={columns as any}
          currentRef={ref}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              components={{ ControllerBtns }}
              actions={formActions}
              onSubmit={handleSearch}
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

export default AllQuery

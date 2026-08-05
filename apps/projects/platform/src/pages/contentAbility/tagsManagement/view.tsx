import React, { useRef } from 'react'
import { Card, Button, Popconfirm, Row, Col } from 'antd'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { ColumnType } from 'antd/lib/table/interface'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { StatusAuthButton } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { getManageMemberLabelPage, postManageMemberLabelDelete, postManageMemberLabelUpdateStatus } from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { PageHeaderWrapper } from '@apps/components'
const actions = createFormActions()

const Tags = () => {
  const intl = useIntl()
  const ref = useRef<any>({})

  const columns: ColumnType<any>[] = [
    { title: 'ID', dataIndex: 'id' },
    {
      title: intl.formatMessage({ id: 'content.tag.name' }),
      dataIndex: 'name',
      render: (text: string, record: any) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/contentAbility/tagsManagement/detail?id=${record.id}&preview=1`}
          >
            {text}
          </EyeAuthButton>
        </DetailAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'content.tag.explain' }),
      dataIndex: 'explain',
    },
    {
      title: intl.formatMessage({ id: 'common.table.status' }),
      align: 'center',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <AuthButton type="custom" code="state">
          <StatusAuthButton fieldNames="status" handleConfirm={() => handleModify(record)} record={record} />
        </AuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      align: 'center',
      key: 'operate',
      dataIndex: 'operate',
      render: (_, record) =>
        !record.status && (
          <>
            <AuthButton type="custom" code="edit">
              <Button type="link" onClick={() => history.push(`/contentAbility/tagsManagement/detail?id=${record.id}`)}>
                {intl.formatMessage({ id: 'common.button.modify' })}
              </Button>
            </AuthButton>

            <AuthButton type="custom" code="del">
              <Popconfirm
                title={intl.formatMessage({ id: 'common.tip.option.confirm' })}
                onConfirm={() => handleRemove(record.id)}
              >
                <Button type="link">{intl.formatMessage({ id: 'common.button.delete' })}</Button>
              </Popconfirm>
            </AuthButton>
          </>
        ),
    },
  ]

  const schema = {
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
            'x-component': 'Children',
            'x-component-props': {
              children: '{{controllerBtns}}',
            },
          },
          name: {
            type: 'string',
            'x-component': 'Search',
            'x-mega-props': {},
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'content.tag.name' }),
              advanced: false,
            },
          },
        },
      },
    },
  }

  // 获取列表
  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getManageMemberLabelPage(params).then((res) => {
        resolve(res.data)
      })
    })
  }

  // 修改状态
  const handleModify = (value) => {
    const { id, status } = value
    const postData = {
      id: id,
      enableStatus: status ^ 1,
    }
    postManageMemberLabelUpdateStatus(postData).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  // 栏目删除
  const handleRemove = (id: number) => {
    ///manage/contentColumn/delete
    postManageMemberLabelDelete({ id: id }).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  const controllerBtns = (
    <Row>
      <Col span={6}>
        <AuthButton type="add" code="add">
          <Button onClick={() => history.push('/contentAbility/tagsManagement/add')} type="primary">
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
          tableProps={{ rowKey: 'id' }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={actions}
              expressionScope={{ controllerBtns }}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'title', FORM_FILTER_PATH)
              }}
              schema={schema}
            ></NiceForm>
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Tags

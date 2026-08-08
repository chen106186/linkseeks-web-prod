import React, { useRef } from 'react'
import { Card, Button, Popconfirm, Row, Col } from 'antd'
import { createFormActions, ISchema } from '@apps/formily'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { StatusAuthButton } from '@apps/components'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { PlusOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { getManageMemberColumnPage, postManageMemberColumnDelete, postManageMemberColumnUpdateStatus } from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const formActions = createFormActions()

const columnList: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})

  const schema: ISchema = {
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
              placeholder: intl.formatMessage({ id: 'content.columns.name' }),
              advanced: false,
            },
          },
        },
      },
    },
  }

  // 停用/启用
  const handleModify = async (record: any) => {
    await postManageMemberColumnUpdateStatus({
      id: record.id,
      enableStatus: record.status === 1 ? 0 : 1,
      shelfStatus: undefined,
    })
    ref.current.reloadCurrent()
  }

  // 栏目删除
  const handleRemove = async (id: number) => {
    const res = await postManageMemberColumnDelete({ id })
    if (res.code === 1000) {
      ref.current.reloadCurrent()
    }
  }

  // 获取列表
  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getManageMemberColumnPage(params).then((res) => {
        resolve(res.data)
      })
    })
  }

  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'content.columns.name' }),
      dataIndex: 'name',
      key: 'name',
      render: (text: any, record: any) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/contentAbility/columnsManagement/detail?id=${record.id}&preview=1`}
          >
            {text}
          </EyeAuthButton>
        </DetailAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'content.columns.category' }),
      align: 'center',
      dataIndex: 'type',
      key: 'type',
      render: (text) =>
        text === 1
          ? intl.formatMessage({ id: 'content.columns.market' })
          : intl.formatMessage({ id: 'content.columns.information' }),
    },
    {
      title: intl.formatMessage({ id: 'content.columns.sort' }),
      align: 'center',
      dataIndex: 'sort',
      key: 'sort',
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
              <Button
                type="link"
                onClick={() => history.push(`/contentAbility/columnsManagement/detail?id=${record.id}`)}
              >
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

  const controllerBtns = (
    <Row>
      <Col span={6}>
        <AuthButton type="add" code="add">
          <Button
            onClick={() => history.push('/contentAbility/columnsManagement/add')}
            type="primary"
            icon={<PlusOutlined />}
          >
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
              actions={formActions}
              expressionScope={{ controllerBtns }}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              }}
              schema={schema}
            ></NiceForm>
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default columnList

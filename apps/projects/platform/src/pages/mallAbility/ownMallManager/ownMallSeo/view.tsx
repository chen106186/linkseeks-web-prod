import React, { useRef } from 'react'
import { Card, Button, Popconfirm, Row, Col, message } from 'antd'
import { ISchema } from '@apps/formily'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl, getIntl } from '@linkseeks/i18n'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { StatusAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { PlusOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import { DOORTYPE } from '@/constants/procurement'
import { getCommodityWebSeoWebPage, postCommodityWebSeoWebDelete, postCommodityWebSeoWebUpdateStatus } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'

const formActions = createFormActions()
const intl = getIntl()

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
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'shop.seo.table.name' }),
            advanced: false,
          },
        },
      },
    },
  },
}

const controllerBtns = (
  <Row>
    <Col span={6}>
      <AddAuthButton>
        <Button
          onClick={() => history.push('/mallAbility/ownMallManager/ownMallSeo/add')}
          type="primary"
          icon={<PlusOutlined />}
        >
          {intl.formatMessage({ id: 'common.button.add' })}
        </Button>
      </AddAuthButton>
    </Col>
  </Row>
)

const SeoList: React.FC<{}> = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { pathname } = useLocation()
  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'shop.seo.table.name' }),
      dataIndex: 'name',
      key: 'name',
      render: (text: any, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/mallAbility/ownMallManager/ownMallSeo/detail?id=${record.id}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'shop.seo.table.link' }),
      align: 'center',
      dataIndex: 'link',
      key: 'link',
      render: (text) => (text ? `http://${text}` : ''),
    },
    {
      title: intl.formatMessage({ id: 'shop.seo.table.status' }),
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
      key: 'operate',
      dataIndex: 'operate',
      render: (_, record) =>
        !record.status && (
          <>
            <EditAuthButton>
              <Button
                type="link"
                onClick={() => history.push(`/mallAbility/ownMallManager/ownMallSeo/edit?id=${record.id}`)}
              >
                {intl.formatMessage({ id: 'common.button.modify' })}
              </Button>
            </EditAuthButton>
            <AuthButton type="custom" code="delete">
              <Popconfirm
                title={intl.formatMessage({ id: 'common.tip.option.confirm' })}
                onConfirm={() => handleDelete(record.id)}
              >
                <Button type="link">{intl.formatMessage({ id: 'common.button.delete' })}</Button>
              </Popconfirm>
            </AuthButton>
          </>
        ),
    },
  ]

  // 停用/启用
  const handleModify = async (record: any) => {
    await postCommodityWebSeoWebUpdateStatus({
      id: record.id,
      status: record.status === 1 ? 0 : 1,
    })
    ref.current.reloadCurrent()
  }

  // 删除
  const handleDelete = async (id) => {
    const res = await postCommodityWebSeoWebDelete({ id })
    if (res.code === 1000) {
      ref.current.reloadCurrent()
    }
  }

  // 获取列表
  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getCommodityWebSeoWebPage({ doorType: DOORTYPE.OWN_DOORTYPE, ...params })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          } else {
            message.error(res.message)
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

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

export default SeoList

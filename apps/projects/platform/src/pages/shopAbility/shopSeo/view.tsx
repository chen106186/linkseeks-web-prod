import React, { ReactNode, useRef } from 'react'
import { ISchema } from '@apps/formily'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Row, Col, Button, Popconfirm, Typography, message } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { searchSelectGetSelectCategoryOptionEffect } from '@/pages/transaction/effect/index'
import { PauseCircleOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { getCommodityWebSeoWebPage, postCommodityWebSeoWebDelete, postCommodityWebSeoWebUpdateStatus } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'

const ShopSeo = () => {
  const ref = useRef<any>({})
  const formActions = createFormActions()
  const intl = useIntl()
  /** 修改状态 */
  const confirm = (e: any) => {
    const status = e.status === 1 ? 0 : 1
    postCommodityWebSeoWebUpdateStatus({ id: e.id, status }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      ref.current.reloadCurrent()
    })
  }
  /** 删除 */
  const handleDelete = (id: number) => {
    postCommodityWebSeoWebDelete({ id }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      ref.current.reloadCurrent()
    })
  }

  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'shop.seo.table.name' }),
      key: 'name',
      dataIndex: 'name',
      render: (text: any, record: any) => (
        <DetailAuthButton>
          <Typography.Link href={`/shopAbility/shopSeo/detail?id=${record.id}`}>{text}</Typography.Link>
        </DetailAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'shop.seo.table.link' }),
      key: 'link',
      dataIndex: 'link',
    },
    {
      title: intl.formatMessage({ id: 'shop.seo.table.status' }),
      key: 'status',
      dataIndex: 'status',
      width: 256,
      render: (text: any, record: any) => {
        let component: ReactNode = null
        component = (
          <AuthButton type="custom" code="state">
            <Popconfirm
              title={intl.formatMessage({ id: 'common.tip.option.confirm' })}
              onConfirm={() => confirm(record)}
              okText={intl.formatMessage({ id: 'common.button.yes' })}
              cancelText={intl.formatMessage({ id: 'common.button.no' })}
            >
              <Button type="link" style={record.status === 1 ? { color: '#00A98F' } : { color: 'red' }}>
                {record.status === 1 ? (
                  <>
                    {intl.formatMessage({ id: 'common.status.effective' })} <PlayCircleOutlined />
                  </>
                ) : (
                  <>
                    {intl.formatMessage({ id: 'common.status.invalid' })} <PauseCircleOutlined />
                  </>
                )}
              </Button>
            </Popconfirm>
          </AuthButton>
        )
        return component
      },
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      key: 'action',
      dataIndex: 'action',
      width: 256,
      render: (_text: any, record: any) =>
        record.status === 0 && (
          <>
            <AuthButton type="custom" code="delete">
              <Popconfirm
                title={intl.formatMessage({ id: 'common.tip.option.confirm' })}
                onConfirm={() => handleDelete(record.id)}
                okText={intl.formatMessage({ id: 'common.button.yes' })}
                cancelText={intl.formatMessage({ id: 'common.button.no' })}
              >
                <Button type="link">{intl.formatMessage({ id: 'common.button.delete' })}</Button>
              </Popconfirm>
            </AuthButton>

            <EditAuthButton>
              <Button type="link" onClick={() => history.push(`/shopAbility/shopSeo/edit?id=${record.id}`)}>
                {intl.formatMessage({ id: 'common.button.modify' })}
              </Button>
            </EditAuthButton>
          </>
        ),
    },
  ]

  // 搜索
  const search = (values: any) => {
    ref.current.reload(values)
  }

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getCommodityWebSeoWebPage({ ...params, doorType: 1 }, { penetrateError: true })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          } else {
            message.error(res.message)
            resolve({
              data: [],
              totalCount: 0,
            })
          }
        })
        .catch(() => {
          resolve({
            data: [],
            totalCount: 0,
          })
        })
    })
  }

  const controllerBtns = (
    <Row>
      <Col span={6}>
        <AuthButton type="add">
          <Button onClick={() => history.push('/shopAbility/shopSeo/add')} type="primary" icon={<PlusOutlined />}>
            {intl.formatMessage({ id: 'common.button.add' })}
          </Button>
        </AuthButton>
      </Col>
    </Row>
  )

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
              placeholder: intl.formatMessage({ id: 'shop.seo.table.name' }),
              advanced: false,
            },
          },
        },
      },
    },
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              expressionScope={{ controllerBtns }}
              onSubmit={(values) => search(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                FormEffectHooks.onFieldChange$('category').subscribe((state) => {
                  searchSelectGetSelectCategoryOptionEffect(actions, 'category')
                })
              }}
              schema={schema}
            ></NiceForm>
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}
export default ShopSeo

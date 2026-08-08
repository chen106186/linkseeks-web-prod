import React, { ReactNode, useRef } from 'react'
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Row, Col, Button, Popconfirm, Typography } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { postCommodityWebSeoWebUpdateStatus, postCommodityWebSeoWebDelete, getCommodityWebSeoWebPage } from '@apps/apis'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { searchSelectGetSelectCategoryOptionEffect } from '@/pages/transaction/effect/index'
import { PauseCircleOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { AuthButton } from '@apps/components'

const intl = getIntl()

const PurchasSeo = () => {
  const ref = useRef<any>({})
  const formActions = createFormActions()
  /** 修改状态 */
  const confirm = (e: any) => {
    const status = e.status === 1 ? 0 : 1
    postCommodityWebSeoWebUpdateStatus({ id: e.id, status })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        ref.current.reloadCurrent()
      })
      .catch((error) => {
        console.warn(error)
      })
  }
  /** 删除 */
  const handleDelete = (id: number) => {
    postCommodityWebSeoWebDelete({ id })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        ref.current.reloadCurrent()
      })
      .catch((error) => {
        console.warn(error)
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
      title: intl.formatMessage({ id: 'detail.purchase.pageName' }),
      key: 'name',
      dataIndex: 'name',
      width: 200,
      render: (text: any, record: any) => (
        <Typography.Link href={`/procurementAbility/purchasDoor/purchasSeo/detail?id=${record.id}`}>
          {text}
        </Typography.Link>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.doorLink' }),
      key: 'link',
      dataIndex: 'link',
      render: (text) => `http://${text}`,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.status' }),
      key: 'status',
      dataIndex: 'status',
      width: 256,
      render: (text: any, record: any) => {
        let component: ReactNode = null
        component = (
          <AuthButton type="custom" code="state">
            <Popconfirm
              title={intl.formatMessage({ id: 'detail.purchase.placeholder1' })}
              onConfirm={() => confirm(record)}
              okText={intl.formatMessage({ id: 'table.purchase.okText' })}
              cancelText={intl.formatMessage({ id: 'table.purchase.cancelText' })}
            >
              <Button type="link" style={record.status === 1 ? { color: '#00A98F' } : { color: 'red' }}>
                {record.status === 1 ? (
                  <>
                    {intl.formatMessage({ id: 'detail.purchase.label23' })} <PlayCircleOutlined />
                  </>
                ) : (
                  <>
                    {intl.formatMessage({ id: 'detail.purchase.label24' })} <PauseCircleOutlined />
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
      title: intl.formatMessage({ id: 'table.purchase.operate' }),
      key: 'action',
      dataIndex: 'action',
      width: 256,
      render: (_text: any, record: any) => (
        <>
          <AuthButton type="custom" code="del">
            <Popconfirm
              title={intl.formatMessage({ id: 'detail.purchase.placeholder1' })}
              onConfirm={() => handleDelete(record.id)}
              disabled={record.status === 1}
              okText={intl.formatMessage({ id: 'table.purchase.okText' })}
              cancelText={intl.formatMessage({ id: 'table.purchase.cancelText' })}
            >
              <Button disabled={record.status === 1} type="link">
                {intl.formatMessage({ id: 'table.purchase.delete' })}
              </Button>
            </Popconfirm>
          </AuthButton>

          <AuthButton type="custom" code="edit">
            <Button
              disabled={record.status === 1}
              type="link"
              onClick={() => history.push(`/procurementAbility/purchasDoor/purchasSeo/edit?id=${record.id}`)}
            >
              {intl.formatMessage({ id: 'table.purchase.eidt' })}
            </Button>
          </AuthButton>
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
      getCommodityWebSeoWebPage({ ...params, doorType: 3 })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }

  const controllerBtns = (
    <Row>
      <Col span={6}>
        <AuthButton type="add" code="add">
          <Button
            onClick={() => history.push('/procurementAbility/purchasDoor/purchasSeo/add')}
            type="primary"
            icon={<PlusOutlined />}
          >
            {intl.formatMessage({ id: 'table.purchase.added' })}
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
              placeholder: intl.formatMessage({ id: 'detail.purchase.pageName' }),
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
export default PurchasSeo

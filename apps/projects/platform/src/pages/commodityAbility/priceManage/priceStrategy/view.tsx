import React, { useRef } from 'react'
import { Button, Popconfirm, Card, Space } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { searchCustomerCategoryOptionEffect, searchBrandOptionEffect } from '../effect'
import { schema } from '../schema'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { StatusAuthButton } from '@apps/components'
import { PlusOutlined } from '@ant-design/icons'
import {
  getProductCommodityUnitPriceStrategyGetUnitPriceStrategyList,
  postProductCommodityUnitPriceStrategyDeleteUnitPriceStrategy,
  postProductCommodityUnitPriceStrategyUpdateUnitPriceStrategyStatus,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { getWebIntl } from '@apps/locales'

const formActions = createFormActions()
const translate = getWebIntl()
const PriceManage: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const { pathname } = useLocation()

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'priceManage.priceStrategy.columns.id' }),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'priceManage.priceStrategy.columns.name' }),
      dataIndex: 'name',
      key: 'name',
      className: 'commonPickColor',
      render: (text, record) => (
        <EyeAuthButton
          url={`/commodityAbility/priceManage/priceStrategy/detail?id=${record.id}&preview=1`}
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    // {
    //   title: '商品ID',
    //   dataIndex: ["commodity", "id"],
    //   key: 'commodity',
    // },
    {
      title: intl.formatMessage({ id: 'priceManage.priceStrategy.columns.commodityCode' }),
      dataIndex: ['commodity', 'code'],
      key: 'commodity',
    },
    {
      title: intl.formatMessage({ id: 'priceManage.priceStrategy.columns.commodityName' }),
      dataIndex: ['commodity', 'name'],
      key: 'commodity',
    },
    {
      title: intl.formatMessage({ id: 'priceManage.priceStrategy.columns.customerCategory' }),
      dataIndex: ['commodity', 'customerCategoryName'],
      key: 'commodity',
    },
    {
      title: intl.formatMessage({ id: 'priceManage.priceStrategy.columns.brand' }),
      dataIndex: ['commodity', 'brandName'],
      key: 'commodity',
    },
    {
      title: intl.formatMessage({ id: 'priceManage.priceStrategy.columns.unitName' }),
      dataIndex: ['commodity', 'unitName'],
      key: 'commodity',
    },
    {
      title: intl.formatMessage({ id: 'priceManage.priceStrategy.columns.priceType' }),
      dataIndex: ['commodity', 'priceType'],
      key: 'priceType',
      render: (t, r) => {
        if (t === 1) return intl.formatMessage({ id: 'priceManage.priceStrategy.columns.priceType.1' })
        if (t === 2) return intl.formatMessage({ id: 'priceManage.priceStrategy.columns.priceType.2' })
        if (t === 3) return intl.formatMessage({ id: 'priceManage.priceStrategy.columns.priceType.3' })
      },
    },
    {
      title: intl.formatMessage({ id: 'priceManage.priceStrategy.columns.min' }),
      dataIndex: 'min',
      key: 'min',
      render: (text, reocrd) => {
        if (reocrd.commodity.priceType === 1) {
          if (reocrd.max === reocrd.min)
            return (
              <>
                {translate('web.common.currencySymbol')}
                {reocrd.min}
              </>
            )
          else
            return (
              <>
                {translate('web.common.currencySymbol')}
                {reocrd.min} ~ {translate('web.common.currencySymbol')}
                {reocrd.max}
              </>
            )
        }
        if (reocrd.commodity.priceType === 3) {
          if (reocrd.max === reocrd.min) return <>{reocrd.min}</>
          else
            return (
              <>
                {reocrd.min} ~ {reocrd.max}
              </>
            )
        }
        if (reocrd.commodity.priceType === 2) return null
      },
    },
    {
      title: intl.formatMessage({ id: 'priceManage.priceStrategy.columns.isEnable' }),
      dataIndex: 'isEnable',
      key: 'isEnable',
      render: (text, record) => (
        <AuthButton type="custom" code="state">
          <StatusAuthButton
            handleConfirm={() => handleUpdateState(record)}
            record={record}
            fieldNames="isEnable"
            expectTrueValue={true}
          />
        </AuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'priceManage.priceStrategy.columns.option' }),
      dataIndex: 'option',
      width: 128,
      fixed: 'right',
      render: (text, record) => {
        return (
          <>
            <EditAuthButton>
              <Button type="link" className="padLeft0" onClick={() => handleModify(record)}>
                {intl.formatMessage({ id: 'dealAbility.xiugai' })}
              </Button>
            </EditAuthButton>
            <AuthButton type="custom" code="delete">
              <Popconfirm
                title={intl.formatMessage({ id: 'priceManage.priceStrategy.popconfirm.title' })}
                okText={intl.formatMessage({ id: 'priceManage.priceStrategy.popconfirm.okText' })}
                cancelText={intl.formatMessage({ id: 'priceManage.priceStrategy.popconfirm.cancelText' })}
                onConfirm={() => handleDelete(record)}
              >
                <Button type="link" className="padLeft0">
                  {intl.formatMessage({ id: 'priceManage.priceStrategy.popconfirm.link' })}
                </Button>
              </Popconfirm>
            </AuthButton>
          </>
        )
      },
    },
  ]

  const fetchData = (params) => {
    return new Promise((resolve, reject) => {
      getProductCommodityUnitPriceStrategyGetUnitPriceStrategyList(params).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const handleUpdateState = (record) => {
    postProductCommodityUnitPriceStrategyUpdateUnitPriceStrategyStatus({
      id: record.id,
      isEnable: !record.isEnable,
    }).then((res) => {
      if (res.code === 1000) {
        setTimeout(() => {
          ref.current.reloadCurrent()
        }, 1000)
      }
    })
  }

  const handleModify = (record) => {
    history.push(`${pathname}/edit?id=${record.id}`)
  }

  const handleDelete = (record) => {
    postProductCommodityUnitPriceStrategyDeleteUnitPriceStrategy({ id: record.id }).then((res) => {
      if (res.code === 1000) {
        setTimeout(() => {
          ref.current.reloadCurrent()
        }, 1000)
      }
    })
  }

  const controllerBtns = (
    <Space>
      <AddAuthButton>
        <Button type="primary" onClick={() => history.push(`${pathname}/add`)}>
          <PlusOutlined />
          {intl.formatMessage({ id: 'priceManage.priceStrategy.controllerBtns' })}
        </Button>
      </AddAuthButton>
    </Space>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          columns={columns}
          currentRef={ref}
          tableProps={{
            rowKey: 'id',
            scroll: {
              x: 1600,
            },
          }}
          fetchTableData={(params) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              expressionScope={{
                controllerBtns,
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                FormEffectHooks.onFieldChange$('brandId').subscribe((state) => {
                  searchBrandOptionEffect(actions, 'brandId')
                })
                FormEffectHooks.onFieldChange$('customerCategoryId').subscribe((state) => {
                  searchCustomerCategoryOptionEffect(actions, 'customerCategoryId')
                })
              }}
              schema={schema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default PriceManage

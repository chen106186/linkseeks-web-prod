import React, { useRef, ReactNode, useMemo } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Card, message } from 'antd'
import { BatchApprovedModal, ImageBox, PageHeaderWrapper, RecordColumns, StandardFormTable } from '@apps/components'
import { formatTimeString } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import {
  GetProductCommodityGetUnCheckCommodityListResponseDetail,
  getProductCommodityGetUnCheckCommodityList,
  getProductCustomerGetCustomerCategoryTree,
  getProductSelectGetSelectBrand,
  postProductCommodityPlatformCheckCommodityBatch,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton } from '@apps/components'
import { CommodityPriceEnum, priceTypeLabel } from '../products/constant'
import { useRequestApi, useToggle } from '@linkseeks/hooks'
import { useWebIntl } from '@apps/locales'

const CheckProduct: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const { pathname } = useLocation()
  const { data: brandData } = useRequestApi(getProductSelectGetSelectBrand)
  const { data: _categoryData } = useRequestApi(getProductCustomerGetCustomerCategoryTree)
  const tableRef = StandardFormTable.useTableRef()
  const translate = useWebIntl()

  const [batchApprovedVisible, toggleBatchApproved] = useToggle()

  const categoryData = useMemo(() => {
    const transform = (list) =>
      list.map((v) => ({
        label: v.name,
        value: v.id,
        children: v.children ? transform(v.children) : null,
      }))
    return _categoryData ? transform(_categoryData) : []
  }, [_categoryData])

  const columns: RecordColumns<GetProductCommodityGetUnCheckCommodityListResponseDetail>[] = [
    {
      title: translate('web.resource.commodity.ID'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      searchField: {
        type: 'Input',
        name: 'commodityId',
      },
      fixed: 'left',
    },
    {
      title: translate('web.resource.commodity.shanpinzhutu'),
      dataIndex: 'mainPic',
      key: 'mainPic',
      width: 100,
      fixed: 'left',
      render: (logoUrl) => <ImageBox width={48} height={48} src={logoUrl} preview />,
    },
    {
      title: translate('web.resource.commodity.name'),
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      className: 'commonPickColor',
      width: 230,
      searchField: {
        main: true,
        type: 'Input',
      },
      render: (text, record) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/commodityAbility/commodity/checkProduct/detail?id=${record.id}&preview=1`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: translate('web.resource.commodity.shanpinpinlei'),
      dataIndex: 'customerCategoryFullName',
      key: 'customerCategoryFullName',
      searchField: {
        type: 'Cascader',
        name: 'customerCategoryId',
        valueEnum: categoryData,
      },
    },
    {
      title: translate('web.resource.commodity.shanpinpinpai'),
      dataIndex: 'brandName',
      key: 'brandName',
      searchField: {
        type: 'SearchSelect',
        name: 'brandId',
        valueEnum: brandData?.map((v) => ({
          label: v.name,
          value: v.id,
        })),
        order: 30,
      },
    },
    {
      title: translate('web.common.unit'),
      dataIndex: 'unitName',
      key: 'unitName',
    },
    {
      title: translate('web.resource.commodity.shanpindingjia'),
      dataIndex: 'priceType',
      key: 'priceType',
      searchField: {
        type: 'Select',
        name: 'priceTypeList',
        valueEnum: CommodityPriceEnum,
        placeholder: '商品定价',
        order: 20,
      },
      render: (text) => priceTypeLabel[text],
    },
    {
      title: translate('web.resource.commodity.price'),
      key: 'min',
      searchField: {
        type: 'NumberRanage',
        name: ['min', 'max'],
        placeholder: ['最低价格', '最高价格'],
      },
      render: (text, reocrd: any) => {
        if (reocrd.priceType === 1 || reocrd.priceType === 4) {
          if (reocrd.max === reocrd.min)
            return (
              <>
                {intl.formatMessage({ id: 'commodity.products.columns.currency' })}
                {reocrd.min}
              </>
            )
          else
            return (
              <>
                {intl.formatMessage({ id: 'commodity.products.columns.currency' })}
                {reocrd.min} ~ {intl.formatMessage({ id: 'commodity.products.columns.currency' })}
                {reocrd.max}
              </>
            )
        }
        if (reocrd.priceType === 3) {
          if (reocrd.max === reocrd.min) return <>{reocrd.min}</>
          else
            return (
              <>
                {reocrd.min} ~ {reocrd.max}
              </>
            )
        }
        if (reocrd.priceType === 2) return null
      },
    },
    {
      title: translate('web.resource.commodity.shenqingshenheshijian'),
      dataIndex: 'applyTime',
      key: 'applyTime',
      render: (text) => text && formatTimeString(text),
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.applyTime - b.applyTime,
    },
    {
      title: translate('web.common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (text, record: any) => {
        let component: ReactNode = null
        if (record.status === 1)
          component = (
            <>
              <span className="commonStatusStop"></span>
              {intl.formatMessage({ id: 'commodity.checkProduct.status.1' })}
            </>
          )
        else if (record.status === 2)
          component = (
            <>
              <span className="commonStatusModify"></span>
              {intl.formatMessage({ id: 'commodity.checkProduct.status.2' })}
            </>
          )
        else if (record.status === 3)
          component = (
            <>
              <span className="commonStatusValid"></span>
              {intl.formatMessage({ id: 'commodity.checkProduct.status.3' })}
            </>
          )
        else if (record.status === 4)
          component = (
            <>
              <span className="commonStatusInvalid"></span>
              {intl.formatMessage({ id: 'commodity.checkProduct.status.4' })}
            </>
          )
        else if (record.status === 5)
          component = (
            <span
              style={{ color: '#00A98F', padding: '2px 5px', background: 'rgba(235,247,242,1)', borderRadius: '4px' }}
            >
              {intl.formatMessage({ id: 'commodity.checkProduct.status.5' })}
            </span>
          )
        else if (record.status === 6)
          component = (
            <span style={{ padding: '2px 5px', background: 'rgba(244,245,247,1)', borderRadius: '4px' }}>
              {intl.formatMessage({ id: 'commodity.checkProduct.status.6' })}
            </span>
          )
        return component
      },
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      render: (text, record) => {
        return (
          <>
            <AuthButton type="custom" code="check">
              <Button
                type="link"
                onClick={() => history.push(`/commodityAbility/commodity/checkProduct/check?id=${record.id}`)}
              >
                {intl.formatMessage({ id: 'commodity.checkProduct.check' })}
              </Button>
            </AuthButton>
          </>
        )
      },
    },
  ]

  const fetchData = (params) => {
    return new Promise((resolve, reject) => {
      getProductCommodityGetUnCheckCommodityList(params).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const handleBatchExamine = () => {
    const selectItems = tableRef.current.selectionKeys
    if (!selectItems.length) {
      message.error(
        intl.formatMessage({
          id: 'commodity.products.handleBatch.error.1',
          defaultMessage: '请选择需要批量操作的商品',
        }),
      )
      return
    }

    toggleBatchApproved()
  }

  const handleSubmitBatchApproved = async (value) => {
    const selectItems = tableRef.current.selectionKeys
    const { code } = await postProductCommodityPlatformCheckCommodityBatch({
      idList: selectItems,
      ...value,
    })
    if (code === 1000) {
      toggleBatchApproved()
      tableRef.current.reload()
    }
  }
  return (
    <PageHeaderWrapper>
      {/* <Card> */}
      <StandardFormTable
        columns={columns}
        request={fetchData}
        actionRef={tableRef}
        autoScrollX
        isRowSelection
        searchButtons={[
          {
            children: intl.formatMessage({
              id: 'stockSellStorage.piliangshenhe',
              defaultMessage: '批量审核',
            }),
            key: 'batchExamine',
            type: 'primary',
            onClick: handleBatchExamine,
          },
        ]}
      />
      {/* </Card> */}
      <BatchApprovedModal
        title={translate('web.resource.commodity.shanpinpiliangshenhe')}
        open={batchApprovedVisible}
        onOk={handleSubmitBatchApproved}
        onCancel={toggleBatchApproved}
        approvedStatus={[4, 3]}
      />
    </PageHeaderWrapper>
  )
}

export default CheckProduct

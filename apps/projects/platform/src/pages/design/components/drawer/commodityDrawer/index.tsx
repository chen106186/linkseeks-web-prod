import React, { useState, useEffect, useMemo } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Drawer, Button, message, Space, Tooltip } from 'antd'
import { StandardFormTable } from '@apps/components'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import moment from 'moment'
import { usePageStatus } from '@/hooks/usePageStatus'
import StatusTag from '@/components/StatusTag'
import { authService } from '@apps/services'
import ActivityImage from '@/assets/couponIcons/ActivityImage.svg'
import {
  getMarketingAdornGoodsListAdorn,
  getProductCommodityTemplateGetBrandList,
  getProductCustomerGetCustomerCategoryTreeHasCommodity,
} from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useWebIntl } from '@apps/locales'
import styles from './index.less'

interface CommodityDrawerProps {
  visible: boolean
  onClose: () => void
  onConfirm?: (record) => void
  selectId?: string | number[]
  filterParam?: any
  selectType?: 'radio' | 'checkbox'
  layoutType: LAYOUT_TYPE
  showActivity?: boolean
}

const _returnCategoryList = (list: any, obj: any) => {
  if (obj) {
    obj.name && list.unshift(obj.name)
    if (obj.category) {
      _returnCategoryList(list, obj.category)
    }
  }
}

const CommodityDrawer: React.FC<CommodityDrawerProps> = (props: CommodityDrawerProps) => {
  const {
    visible,
    onClose,
    onConfirm,
    selectId,
    filterParam,
    selectType = 'radio',
    layoutType = LAYOUT_TYPE.shop,
    showActivity = true,
  } = props
  const { memberId, memberRoleId } = authService.getAuth() || {}
  const { shopId } = usePageStatus()
  const { data: _categoryData } = useRequestApi(getProductCustomerGetCustomerCategoryTreeHasCommodity, {
    defaultParams: [{ shopId }],
  })
  const { data: brandRes } = useRequestApi(getProductCommodityTemplateGetBrandList, {
    defaultParams: [
      {
        current: '1',
        pageSize: '100',
        shopId,
        memberId,
        memberRoleId,
      },
    ],
  })

  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([])
  const tableRef = StandardFormTable.useTableRef()
  const translate = useWebIntl()
  const intl = useIntl()

  const categoryData = useMemo(() => {
    const transform = (list) =>
      list.map((v) => ({
        label: v.name,
        value: v.id,
        children: v.children ? transform(v.children) : null,
      }))
    return _categoryData ? transform(_categoryData) : []
  }, [_categoryData])

  useEffect(() => {
    if (tableRef && tableRef.current && visible) {
      tableRef.current.setSelectionKeys(selectId ? [selectId] : [])
    }
  }, [selectId, visible])

  const expandedRowRender = (record: any) => {
    return (
      <>
        {record?.activityList?.map((item, index) => {
          return (
            <a
              key={index}
              style={{ marginBottom: 8 }}
              href={`/marketingAbility/selfManagement/search/detail?id=${item.id}`}
              target={'_blank'}
            >
              <Space direction="horizontal">
                <img src={ActivityImage} style={{ width: 24, height: 24, borderRadius: 4 }} />
                <span>{item?.name}</span>
                <div className={styles['defaultTag']}>{item?.type}</div>
                <StatusTag
                  title={
                    item?.belongType === 1
                      ? intl.formatMessage({ id: 'common.text.platform.activity' })
                      : intl.formatMessage({ id: 'common.text.business.activity' })
                  }
                  type={item?.belongType === 1 ? 'primary' : 'success'}
                />
                <div style={{ color: '#301333' }}>
                  {intl.formatMessage({ id: 'common.text.validity.date' })}：
                  {item.startTime && moment(item.startTime).format('YYYY-MM-DD HH:mm:ss')}{' '}
                  {intl.formatMessage({ id: 'common.text.to' })}{' '}
                  {item.endTime && moment(item.endTime).format('YYYY-MM-DD HH:mm:ss')}{' '}
                </div>
              </Space>
            </a>
          )
        })}
      </>
    )
  }

  const columns = StandardFormTable.createColumns([
    {
      title: intl.formatMessage({ id: 'editor.drawer.activity.columns.productInfo' }),
      dataIndex: 'name',
      key: 'name',
      searchField: {
        main: true,
      },
      render: (_, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 420 }}>
          <div>
            <img src={record.mainPic} style={{ width: 48, height: 48, borderRadius: 4 }} />
          </div>
          <Tooltip title={record.name}>
            <div className={styles.commodityName}>{record.name}</div>
          </Tooltip>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'editor.columns.commodityId' }),
      key: 'idInList',
      searchField: 'Input',
      hidden: true,
    },
    {
      title: intl.formatMessage({ id: 'editor.columns.category' }),
      dataIndex: 'customerCategoryName',
      key: 'customerCategoryName',
      width: 160,
      searchField: {
        type: 'Cascader',
        name: 'customerCategoryId',
        valueEnum: categoryData,
      },
      render: (text) => {
        return text && <StatusTag title={text} type="default" />
      },
    },
    {
      title: intl.formatMessage({ id: 'editor.columns.brand' }),
      dataIndex: 'brandName',
      key: 'brandName',
      width: 160,
      searchField: {
        type: 'SearchSelect',
        name: 'brandId',
        valueEnum: brandRes?.data?.map((v) => ({
          label: v.name,
          value: v.id,
        })),
      },
    },
    {
      title: intl.formatMessage({ id: 'editor.columns.unitName' }),
      dataIndex: 'unitName',
      key: 'unitName',
      render: (_text, _record) => {
        if (_record.priceType === 1) {
          return (
            <div className={styles.priceInfo}>
              <span>￥{_record.min}</span>
              <span className={styles.unit}>({_record.unitName})</span>
            </div>
          )
        } else if (_record.priceType === 2) {
          return translate('web.resource.mall.xunjia')
        } else if (_record.priceType === 3) {
          return (
            <div className={styles.priceInfo}>
              <span>
                {_record.min}
                {translate('web.resource.mall.integral')}
              </span>
            </div>
          )
        }
        return ''
      },
    },
  ])

  const _onConfirm = () => {
    const selectedRows = tableRef.current.getSelectionItems()
    if (selectedRows.length > 0) {
      if (selectType === 'radio') {
        onConfirm?.(selectedRows[0])
      } else {
        onConfirm?.(selectedRows)
      }
    } else {
      message.warning(intl.formatMessage({ id: 'common.tip.select.required' }))
    }
  }

  const fetchTableData = async (params: any) => {
    const _params = {
      ...params,
      shopId,
      memberId,
      memberRoleId,
      ...filterParam,
    }
    if (params.idInList) {
      _params.idInList =
        Array.isArray(params.idInList) && params.idInList.length > 0 ? params.idInList.join(',') : params.idInList
    }
    if (selectId) {
      _params.idNotInList = Array.isArray(selectId) ? selectId.join(',') : selectId
    }

    const { data } = await getMarketingAdornGoodsListAdorn(_params)
    setExpandedRowKeys(data?.data?.map((item) => item.id) || [])
    return data
  }

  const drawerStyle = { background: '#FAFBFC' }

  return (
    <Drawer
      headerStyle={drawerStyle}
      bodyStyle={drawerStyle}
      footerStyle={drawerStyle}
      width={1000}
      title={intl.formatMessage({ id: 'editor.drawer.commodity.title' })}
      open={visible}
      onClose={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'common.button.cancel' })}
          </Button>
          <Button onClick={_onConfirm} type="primary">
            {intl.formatMessage({ id: 'common.button.confirm' })}
          </Button>
        </div>
      }
    >
      <StandardFormTable
        actionRef={tableRef}
        columns={columns}
        request={(params) => fetchTableData(params)}
        isRowSelection
        rowSelectionType={selectType}
        tableProps={{
          expandable: showActivity
            ? {
                expandedRowRender,
                expandedRowKeys,
                indentSize: 0,
                defaultExpandAllRows: true,
              }
            : undefined,
          className: styles['table'],
        }}
      />
    </Drawer>
  )
}

export default CommodityDrawer

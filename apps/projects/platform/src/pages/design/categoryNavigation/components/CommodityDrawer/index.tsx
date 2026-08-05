import React, { useState, useRef, useEffect } from 'react'
import { useQuery } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Drawer, Button, message, Space, Tooltip } from 'antd'
import StandardTable from '@/components/StandardTable'
import styles from './index.less'
import CommoditySchema from './schema'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Search from '@/components/NiceForm/components/Search'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import Submit from '@/components/NiceForm/components/Submit'
import StatusTag from '@/components/StatusTag'
import CustomInputSearch from '@/components/NiceForm/components/CustomInputSearch'
import CustomCategorySearch from '@/components/NiceForm/components/CustomCategorySearch'
import defaultActivityImage from '@/assets/activity/ActivityImage.svg'
import moment from 'moment'
import { getMarketingAdornChannelGoodsListAdorn } from '@apps/apis'
interface CommodityDrawerProps {
  visible: boolean
  onClose: () => void
  onConfirm?: (record) => void
  selectId?: string | number[]
  filterParam?: any
  selectType?: 'radio' | 'checkbox'
  service?: ((data: any) => Promise<any>) | null
  formEffects?: (context: any, formAction: any) => void
  /** 格式化s搜索参数 */
  formatedFilterParams?: (params: any) => any
}

const _returnCategoryList = (list: any, obj: any) => {
  if (!obj) {
    return
  }
  obj.name && list.unshift(obj.name)
  if (obj.category) {
    _returnCategoryList(list, obj.category)
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
    service = null,
    formEffects,
    formatedFilterParams = () => {},
  } = props
  const { shopId }: any = useQuery()
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>(selectId ? [selectId] : [])
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([])
  const ref = useRef<any>({})
  const intl = useIntl()

  useEffect(() => {
    setSelectedRowKeys(selectId ? [selectId] : [])
  }, [selectId])

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
                <img src={defaultActivityImage} style={{ width: 24, height: 24, borderRadius: 4 }} />
                <span>{item?.name}</span>
                <div className={styles['defaultTag']}>{item?.type}</div>
                <StatusTag
                  title={
                    item?.belongType === 1
                      ? intl.formatMessage({ id: 'editor.category.platform.activity' })
                      : intl.formatMessage({ id: 'editor.category.business.activity' })
                  }
                  type={item?.belongType === 1 ? 'primary' : 'success'}
                />
                <div style={{ color: '#301333' }}>
                  {intl.formatMessage({ id: 'editor.drawer.coupons.columns.releaseTimeEnd' })}：
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

  /*eslint-disable*/
  const columns = [
    {
      title: intl.formatMessage({ id: 'editor.drawer.activity.columns.productInfo' }),
      dataIndex: 'name',
      key: 'name',
      render: (text: any, record: any) => (
        <Space direction="horizontal" style={{ width: 300 }}>
          <img src={record.mainPic} style={{ width: 64, height: 64, borderRadius: 4 }} />
          <Tooltip title={record.name}>
            <div className={styles.commodityName}>{record.name}</div>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'editor.columns.category', defaultMessage: '品类' }),
      dataIndex: 'customerCategory',
      render: (_, _record) => {
        let _list = []
        _returnCategoryList(_list, _record?.customerCategory)
        return (
          <Space direction="horizontal">
            {_list?.map((item, index) => (
              <StatusTag key={index} title={item} type="default" />
            ))}
          </Space>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'editor.columns.brand', defaultMessage: '品牌' }),
      dataIndex: 'brand',
      render: (_, _record) => <span>{_record?.brand?.name}</span>,
    },
    {
      title: intl.formatMessage({ id: 'editor.columns.unitName' }),
      dataIndex: 'unitName',
      render: (_text, _record) => {
        return (
          <div className={styles.priceInfo}>
            <span>
              {intl.formatMessage({ id: 'common.money' })}
              {_record.min}
            </span>
            <span className={styles.unit}>({_record.unitName})</span>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'editor.columns.memberName' }),
      dataIndex: 'memberName',
    },
  ]

  const _onConfirm = () => {
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
    const formated = formatedFilterParams?.(params) || filterParam || {}
    const _params = {
      // ...params,
      shopId,
      idNotInList: Array.isArray(selectId) ? selectId.join(',') : selectId,
      ...formated,
    }
    const fetchService = service || getMarketingAdornChannelGoodsListAdorn
    const { data } = await fetchService(_params)
    setExpandedRowKeys(data?.data?.map((item) => item.id) || [])
    return data
  }
  const rowSelection: any = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows)
      setSelectedRowKeys(selectedRowKeys)
    },
    type: selectType,
  }

  const drawerStyle = { background: '#FAFBFC' }

  return (
    <Drawer
      headerStyle={drawerStyle}
      bodyStyle={drawerStyle}
      footerStyle={drawerStyle}
      width={1200}
      title={intl.formatMessage({ id: 'editor.setting.goods.select.btn' })}
      visible={visible}
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
      <StandardTable
        keepAlive={false}
        fetchTableData={(params) => fetchTableData(params)}
        columns={columns}
        currentRef={ref}
        rowSelection={rowSelection}
        rowKey={'id'}
        tableProps={{
          expandable: { expandedRowRender, expandedRowKeys, indentSize: 0, defaultExpandAllRows: true },
          className: styles['table'],
        }}
        formilyLayouts={{
          justify: 'space-between',
        }}
        formilyProps={{
          ctx: {
            inline: false,
            schema: CommoditySchema,
            effects: ($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              formEffects?.($, actions)
              // FormEffectHooks.onFieldChange$('brandId').subscribe(_ => {
              //   searchBrandOptionEffect(shopId, actions, 'brandId');
              // });
              // FormEffectHooks.onFieldChange$('categoryId').subscribe(_ => {
              //   searchCustomerCategoryOptionEffect(shopId, actions, 'categoryId');
              // });
            },
            components: { ModalSearch: Search, DateRangePickerUnix, Submit, CustomInputSearch, CustomCategorySearch },
          },
        }}
      />
    </Drawer>
  )
}

export default CommodityDrawer

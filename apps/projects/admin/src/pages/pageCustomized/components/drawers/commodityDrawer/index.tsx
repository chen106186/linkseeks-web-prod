import React, { useState, useRef, useEffect } from 'react'
import { Drawer, Button, message, Space, Tooltip } from 'antd'
import { StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { usePageStatus } from '@/hooks/usePageStatus'
import styles from './index.less'

import { getMarketingAdornGoodsListAdorn } from '@apps/apis'
import StatusTag from '@/components/StatusTag'

import ActivityImage from '@/assets/activity/ActivityImage.svg'
import { formatTimeString } from '@/utils'
import useSelectOptions from './services/hooks/useSelectOptions'

interface CommodityDrawerProps {
  visible: boolean
  onClose: () => void
  onConfirm?: (record) => void
  selectId?: string | number[]
  filterParam?: any
  selectType?: 'radio' | 'checkbox'
  showActivity?: boolean
}

const CommodityDrawer: React.FC<CommodityDrawerProps> = (props: CommodityDrawerProps) => {
  const { visible, onClose, onConfirm, showActivity = true, selectId, filterParam, selectType = 'radio' } = props
  const { shopId } = usePageStatus()
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([])
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions({ shopId })

  useEffect(() => {
    if (ref.current?.setSelectionKeys) {
      ref.current?.setSelectionKeys(selectId ? [selectId] : [])
    }
  }, [selectId])

  const expandedRowRender = (record: any) => {
    return (
      <>
        {record?.activityList?.map((item, index) => {
          return (
            <a
              key={index}
              style={{ marginBottom: 8 }}
              href={
                item?.belongType === 1
                  ? `/marketingManage/marketing/marketingSearch/preview?id=${item.id}`
                  : `/marketingManage/merchantMarketing/merchantMarketingSearch/preview?id=${item.id}`
              }
              target={'_blank'}
              rel="noreferrer"
            >
              <Space direction="horizontal">
                <img src={ActivityImage} style={{ width: 24, height: 24, borderRadius: 4 }} />
                <span>{item?.name}</span>
                <div className={styles['defaultTag']}>{item?.type}</div>
                <StatusTag
                  title={item?.belongType === 1 ? '平台活动' : '商家活动'}
                  type={item?.belongType === 1 ? 'primary' : 'success'}
                />
                <div style={{ color: '#301333' }}>
                  有效期：{item.startTime && formatTimeString(item.startTime)} 至{' '}
                  {item.endTime && formatTimeString(item.endTime)}{' '}
                </div>
              </Space>
            </a>
          )
        })}
      </>
    )
  }

  /*eslint-disable*/
  const columns: RecordColumns<any>[] = [
    {
      title: '商品信息',
      key: 'name',
      searchField: {
        main: true,
        title: '搜索',
        type: 'Input',
      },
      width: 320,
      render: (text: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 350 }}>
          <div>
            <img src={record.mainPic} style={{ width: 64, height: 64, borderRadius: 4 }} />
          </div>
          <Tooltip title={record.name}>
            <div className={styles.commodityName}>{record.name}</div>
          </Tooltip>
        </div>
      ),
    },
    {
      title: '品类',
      key: 'customerCategoryName',
      searchField: {
        name: 'categoryId',
        type: 'Cascader',
      },
      render: (text) => {
        return text && <StatusTag title={text} type="default" />
      },
    },
    {
      title: '品牌',
      key: 'brandName',
      searchField: {
        name: 'brandId',
        type: 'Select',
      },
    },
    {
      title: '价格',
      key: 'unitName',
      searchField: {
        type: 'DateRange',
        name: ['publishStartTime', 'publishEndTime'],
        placeholder: ['开始时间', '结束时间'],
      },
      render: (_text, _record) => {
        if (_record.priceType === 1) {
          return (
            <div className={styles.priceInfo}>
              <span>￥{_record.min}</span>
              <span className={styles.unit}>({_record.unitName})</span>
            </div>
          )
        } else if (_record.priceType === 2) {
          return '询价'
        } else if (_record.priceType === 3) {
          return (
            <div className={styles.priceInfo}>
              <span>{_record.min}积分</span>
            </div>
          )
        }
        return ''
      },
    },
    {
      title: '商家名称',
      key: 'memberName',
      searchField: 'Input',
    },
  ]

  const _onConfirm = () => {
    if (ref.current.getSelectionItems().length > 0) {
      if (selectType === 'radio') {
        onConfirm?.(ref.current.getSelectionItems()[0])
      } else {
        onConfirm?.(ref.current.getSelectionItems())
      }
    } else {
      message.warning('请选择一条记录')
    }
  }

  const fetchTableData = async (params: any) => {
    const _params = {
      ...params,
      shopId,
      idNotInList: Array.isArray(selectId) ? selectId.join(',') : selectId,
      ...filterParam,
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
      title={'选择商品'}
      open={visible}
      onClose={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={_onConfirm} type="primary">
            确定
          </Button>
        </div>
      }
    >
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchTableData(params)}
        rowKey="id"
        isRowSelection
        rowSelectionType={selectType}
        actionRef={ref}
        tableProps={
          showActivity
            ? {
                expandable: { expandedRowRender, expandedRowKeys, indentSize: 0, defaultExpandAllRows: true },
                className: styles['table'],
              }
            : {}
        }
        searchSelectMaps={selectData}
      />
    </Drawer>
  )
}

export default CommodityDrawer

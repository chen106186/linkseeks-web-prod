import React, { useState, useRef, useEffect } from 'react'
import { Drawer, Button, Radio, message, Space, Typography } from 'antd'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { usePageStatus } from '@/hooks/usePageStatus'

import {
  getMarketingCouponPlatformActivityPageSelectPage,
  getMarketingCouponPlatformActivityPageSelectMerchantPage,
} from '@apps/apis'
import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'
import StatusTag from '@/components/StatusTag'

import CouponPlatformIcon from '@/assets/activity/coupon_platform.png'
import CouponShopIcon from '@/assets/activity/coupon_shop.png'

const options = [
  { label: '平台', value: 1 },
  { label: '商家', value: 2 },
]

interface CouponsDrawerProps {
  visible: boolean
  onClose: () => void
  onConfirm?: (record) => void
  selectId?: number
  // 1平台，2商家
  belongType?: 1 | 2
  selectType?: 'radio' | 'checkbox'
  disabledKeys?: string[]
}

const CouponsDrawer: React.FC<CouponsDrawerProps> = (props: CouponsDrawerProps) => {
  const { visible, onClose, onConfirm, selectType = 'radio', selectId, belongType, disabledKeys } = props
  const { shopId } = usePageStatus()
  const [type, setType] = useState(belongType || 1)
  const ref = useRef({} as ActionType)

  /*eslint-disable*/
  const columns: RecordColumns<any>[] = [
    {
      title: '优惠券信息',
      dataIndex: 'name',
      key: 'name',
      searchField: {
        title: '优惠券名称',
        name: 'name',
        type: 'Input',
      },
      render: (text: any, record: any) => (
        <Space direction="horizontal" style={{ width: 300 }}>
          <img
            src={record.type === 1 ? CouponPlatformIcon : CouponShopIcon}
            style={{ width: 40, height: 40, borderRadius: 4 }}
          />
          <Space direction="vertical" style={{ width: 300 }}>
            {text}
            <Typography.Text type="secondary">ID:{record.id}</Typography.Text>
          </Space>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'typeName',
      key: 'typeName',
      searchField: {
        main: true,
        name: 'id',
        title: '搜索',
      },
    },
    {
      title: '领券方式',
      dataIndex: 'getWayName',
      key: 'getWayName',
    },
    {
      title: '面额',
      dataIndex: 'denomination',
      key: 'denomination',
      render: (text: any) => <span style={{ color: '#D32F2F' }}>¥ {priceFormat(text)}</span>,
    },
    {
      title: '使用条件',
      dataIndex: 'useConditionMoney',
      key: 'useConditionMoney',
      render: (text: any) => `满 ${text} 元使用`,
    },
    {
      title: '有效期',
      dataIndex: 'releaseTimeEnd',
      key: 'releaseTimeEnd',
      render: (_: any, record: any) => (
        <>
          <div>
            <PlayCircleOutlined />
            &nbsp;{formatTimeString(record.releaseTimeStart, 'YYYY-MM-DD HH:mm')}
          </div>
          <div>
            <PoweroffOutlined />
            &nbsp;{formatTimeString(record.releaseTimeEnd, 'YYYY-MM-DD HH:mm')}
          </div>
        </>
      ),
    },
    {
      title: '所属',
      dataIndex: 'belongName',
      key: 'belongName',
      searchField:
        type === 2
          ? {
              name: 'memberName',
              type: 'Input',
              title: '商家名称',
            }
          : undefined,
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <StatusTag
            title={record.belongType === 1 ? '平台' : '商家'}
            type={record.belongType === 1 ? 'success' : 'primary'}
          />
          {record.belongType === 2 && <Typography.Text type="secondary">{text}</Typography.Text>}
        </Space>
      ),
    },
  ]

  const _onConfirm = () => {
    if (ref.current.getSelectionItems().length > 0) {
      if (selectType === 'radio') {
        onConfirm?.({ ...ref.current.getSelectionItems()[0] })
      } else {
        onConfirm?.(ref.current.getSelectionItems())
      }
    } else {
      message.warning('请选择一条记录')
    }
  }

  const _onRadioChange = (e: any) => {
    setType(e.target.value)
    ref?.current?.clearSelection()
    ref?.current?.reload()
  }

  const fetchTableData = async (params: any) => {
    const _params = { ...params, shopId }
    let _fetch: any
    switch (type) {
      case 1:
        _fetch = getMarketingCouponPlatformActivityPageSelectPage
        break
      case 2:
        _fetch = getMarketingCouponPlatformActivityPageSelectMerchantPage
        break
    }
    const { data } = await _fetch(_params)
    return data
  }

  const drawerStyle = { background: '#FAFBFC' }

  return (
    <Drawer
      width={1200}
      title={'选择优惠券'}
      open={visible}
      onClose={onClose}
      headerStyle={drawerStyle}
      bodyStyle={drawerStyle}
      footerStyle={drawerStyle}
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
      <div style={{ textAlign: 'right' }}>
        <Radio.Group options={options} onChange={_onRadioChange} value={type} optionType="button" />
      </div>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchTableData(params)}
        rowKey="id"
        isRowSelection
        rowSelectionType={selectType}
        actionRef={ref}
        getCheckboxProps={(record: any) => ({
          disabled: disabledKeys?.includes(`${record.id}-${record.belongType}`),
        })}
      />
    </Drawer>
  )
}

export default CouponsDrawer

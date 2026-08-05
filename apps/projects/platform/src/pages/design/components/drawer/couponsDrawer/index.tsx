import React, { useEffect } from 'react'
import { useWebIntl } from '@apps/locales'
import { usePageStatus } from '@/hooks/usePageStatus'
import { Drawer, Button, message, Space, Typography } from 'antd'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'
import StatusTag from '@/components/StatusTag'
import { getMarketingCouponActivityPageSelectPage } from '@apps/apis'
import CouponPlatformIcon from '@/assets/couponIcons/coupon_platform.png'
import CouponShopIcon from '@/assets/couponIcons/coupon_shop.png'
import { StandardFormTable } from '@apps/components'
import { getWebIntl } from '@apps/locales'

interface CouponsDrawerProps {
  visible: boolean
  onClose: () => void
  onConfirm?: (record) => void
  selectId?: number
  selectType?: 'radio' | 'checkbox'
  disabledKeys?: number[]
  // 1平台，2商家
  belongType?: 1 | 2
}

const CouponsDrawer: React.FC<CouponsDrawerProps> = (props: CouponsDrawerProps) => {
  const { visible, onClose, onConfirm, selectType = 'radio', disabledKeys, selectId } = props
  const { shopId } = usePageStatus()
  const tableRef = StandardFormTable.useTableRef()
  const translate = useWebIntl()

  const columns = StandardFormTable.createColumns([
    {
      title: translate('web.resource.shop.youhuiquanxinxi'),
      dataIndex: 'name',
      key: 'name',
      searchField: {
        type: 'Input',
        placeholder: translate('web.resource.shop.youhuiquanmingcheng'),
      },
      render: (text: any, record: any) => (
        <Space direction="horizontal" style={{ width: 180 }}>
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
      title: translate('web.resource.shop.youhuiquanid'),
      dataIndex: 'id',
      key: 'id',
      hidden: true,
      searchField: 'Input',
    },
    {
      title: translate('web.common.leixing'),
      dataIndex: 'typeName',
      key: 'typeName',
    },
    {
      title: translate('web.resource.shop.lingquanfangshi'),
      dataIndex: 'getWayName',
      key: 'getWayName',
    },
    {
      title: translate('web.resource.shop.miane'),
      dataIndex: 'denomination',
      key: 'denomination',
      render: (text: any) => (
        <span style={{ color: '#D32F2F' }}>
          {translate('web.common.currencySymbol')}
          {priceFormat(text)}
        </span>
      ),
    },
    {
      title: translate('web.resource.shop.shiyongtiaojian'),
      dataIndex: 'useConditionMoney',
      key: 'useConditionMoney',
      render: (text: any) => translate('web.resource.shop.manmoneyshiyong', { money: text }),
    },
    {
      title: translate('web.resource.shop.youxiaoqi'),
      dataIndex: 'effectiveTimeStart',
      key: 'effectiveTimeStart',
      render: (_: any, record: any) =>
        record.effectiveType === 1 ? (
          <>
            <div>&nbsp;{formatTimeString(record.effectiveTimeStart, 'YYYY-MM-DD HH:mm')}</div>
            <div>&nbsp;{formatTimeString(record.effectiveTimeEnd, 'YYYY-MM-DD HH:mm')}</div>
          </>
        ) : (
          <div>{translate('web.resource.shop.zilingqujitianneixiaoxiao', { day: record.invalidDay })}</div>
        ),
    },
    // {
    //   title: translate('web.resource.shop.guishu'),
    //   dataIndex: 'belongName',
    //   key: 'belongName',
    //   render: (text: any, record: any) => (
    //     <Space direction="vertical">
    //       <StatusTag
    //         title={
    //           record.belongType === 1 ? translate('web.resource.shop.pingtai') : translate('web.resource.mall.shangjia')
    //         }
    //         type={record.belongType === 1 ? 'success' : 'primary'}
    //       />
    //       {record.belongType === 2 && <Typography.Text type="secondary">{text}</Typography.Text>}
    //     </Space>
    //   ),
    // },
  ])

  const _onConfirm = () => {
    const selectedRows = tableRef.current.getSelectionItems()
    if (selectedRows.length > 0) {
      if (selectType === 'radio') {
        onConfirm?.({ ...selectedRows[0] })
      } else {
        onConfirm?.(selectedRows)
      }
    } else {
      message.warning(translate('web.common.selectOneRequest'))
    }
  }

  const fetchTableData = async (params: any) => {
    const _params = { ...params, shopId }
    const { data } = await getMarketingCouponActivityPageSelectPage(_params)
    return data
  }

  const drawerStyle = { background: '#FAFBFC' }

  return (
    <Drawer
      width={1000}
      title={translate('web.resource.shop.xuanzeyouhuiquan')}
      open={visible}
      onClose={onClose}
      headerStyle={drawerStyle}
      bodyStyle={drawerStyle}
      footerStyle={drawerStyle}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {translate('web.common.cancel')}
          </Button>
          <Button onClick={_onConfirm} type="primary">
            {translate('web.common.confirm')}
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
        getCheckboxProps={(record: any) => ({
          disabled: disabledKeys?.includes(record.id), // Column configuration not to be checked
        })}
      />
    </Drawer>
  )
}

export default CouponsDrawer

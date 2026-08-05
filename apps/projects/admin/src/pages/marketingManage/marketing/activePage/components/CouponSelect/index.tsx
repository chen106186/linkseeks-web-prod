import React, { useImperativeHandle, useRef, RefObject } from 'react'
import { Drawer, Button } from '@linkseeks/ui'
import { StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { Space } from 'antd'
import { priceFormat } from '@/utils/numberFomat'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { formatTimeString } from '@/utils'
import StatusTag from '@/components/StatusTag'
import member from '@/assets/member.png'
import cube from '@/assets/cube.png'
import cx from 'classnames'
import styles from './index.less'

interface Iprops {
  visible: boolean
  onCancel: () => void
  /** 单选或者多选 */
  mode: 'checkbox' | 'radio'
  formExtra: React.ReactNode
  fetchData: (params: any) => Promise<{
    totalCount: number
    data: any[]
  }>
  onOk: (selectedRow) => void
  value: any[]
  rowSelection?: any
  tableRef?: RefObject<ActionType>
  getCheckboxProps?: any
}

const CouponSelect: React.FC<Iprops> = (props) => {
  const { visible, onCancel, mode = 'checkbox', formExtra, fetchData, onOk, value, tableRef, ...rest } = props

  const columns: RecordColumns<any>[] = [
    {
      title: '优惠券信息',
      key: 'couponInfo',
      searchField: {
        name: 'id',
        title: '优惠券ID',
        type: 'Input',
      },
      fixed: 'left',
      render: (_text, _record) => {
        /** 这里判断有点问题@tofix 没字段可以判断了 */
        const isPlatform = _record.belongType === 1

        return (
          <Space align="center">
            <div className={cx(styles.couponImage, { [styles.platform]: isPlatform })}>
              <img className={styles.image} src={isPlatform ? cube : member} />
            </div>
            <div className={styles.wrap}>
              <div className={styles.title}>{_record.name}</div>
              <div className={styles.id}>ID: {_record.id}</div>
            </div>
          </Space>
        )
      },
    },
    {
      title: '类型',
      key: 'typeName',
      searchField: {
        type: 'Input',
        name: 'couponName',
        title: '优惠券名称',
      },
    },
    {
      title: '领券方式',
      key: 'getWayName',
    },
    {
      title: '面额',
      key: 'denomination',
      render: (_text, _record) => {
        return <span className={styles.denomination}>{`￥${priceFormat(_record.denomination)}`}</span>
      },
    },
    {
      title: '使用条件',
      key: 'condition',
      render: (text, _record) => {
        return <span>{`满 ${_record.useConditionMoney} 元使用`}</span>
      },
    },
    {
      title: '有效期',
      key: 'time',
      render: (_text, _record) => {
        return (
          <div>
            <div>
              <PlayCircleOutlined className={styles.icon} />
              <span className={styles.time}>{formatTimeString(_record.releaseTimeStart)}</span>
            </div>
            <div>
              <PoweroffOutlined className={styles.icon} />
              <span className={styles.time}>{_record.releaseTimeEnd && formatTimeString(_record.releaseTimeEnd)}</span>
            </div>
          </div>
        )
      },
    },
    {
      title: '所属',
      key: 'belong',
      render: (_text, _record) => {
        const isPlatform = _record.belongType === 1
        return (
          <Space direction="vertical">
            <StatusTag title={isPlatform ? '平台' : '商家'} type={isPlatform ? 'success' : 'primary'} />
            <div className={styles.belong}>{_record.belongName}</div>
          </Space>
        )
      },
    },
  ]

  const triggerOk = () => {
    onOk?.(tableRef?.current?.getSelectionItems())
  }

  const renderFooter = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button
          onClick={() => {
            triggerOk()
          }}
          type="primary"
        >
          提交
        </Button>
      </div>
    )
  }

  const otherProps = { footer: renderFooter(), maskClosable: true, onClose: onCancel }

  return (
    <Drawer
      title={'选择优惠券'}
      open={visible}
      forceRender
      // onOk={handleOk}
      width={920}
      {...otherProps}
    >
      {formExtra}
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={fetchData}
        rowKey="key"
        actionRef={tableRef}
        isRowSelection
        rowSelectionType={mode}
        {...rest}
      />
    </Drawer>
  )
}

export default CouponSelect

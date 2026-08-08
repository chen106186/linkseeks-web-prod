import React from 'react'
import { ISchema } from '@apps/formily'
import { Space } from 'antd'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import moment from 'moment'
import cx from 'classnames'
import TableModal from './tableModal'
import styles from './index.less'
import StatusTag from '@/components/StatusTag'
import member from '@/assets/activity/member.png'
import cube from '@/assets/activity/cube.png'
import { priceFormat } from '@/utils/numberFomat'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useIntl } from '@linkseeks/i18n'

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
  onOk: (selectedKeys, selectedRow) => void
  value: any[]
  rowSelection?: any
}

const format = 'YYYY-MM-DD HH:mm:ss'

const CouponSelect: React.FC<Iprops> = React.forwardRef((props: Iprops, couponRef) => {
  const intl = useIntl()
  const { visible, onCancel, mode = 'checkbox', formExtra, fetchData, onOk, value, rowSelection = {} } = props

  const columns = [
    {
      title: intl.formatMessage({ id: 'activityPage.couponInfo' }),
      dataIndex: 'couponInfo',
      render: (_text, _record) => {
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
      title: intl.formatMessage({ id: 'activityPage.typeName' }),
      dataIndex: 'typeName',
    },
    {
      title: intl.formatMessage({ id: 'activityPage.getWayName' }),
      dataIndex: 'getWayName',
    },
    {
      title: intl.formatMessage({ id: 'activityPage.denomination' }),
      dataIndex: 'denomination',
      render: (_text, _record) => {
        return (
          <span className={styles.denomination}>
            {`${intl.formatMessage({ id: 'common.money' })}${priceFormat(_record.denomination)}`}
          </span>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'activityPage.condition' }),
      dataIndex: 'condition',
      render: (text, _record) => {
        return (
          <span>{`${intl.formatMessage({ id: 'activityPage.fill' })} ${_record.useConditionMoney} ${intl.formatMessage({
            id: 'activityPage.yuanUse',
          })}`}</span>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'activityPage.time' }),
      dataIndex: 'time',
      render: (_text, _record) => {
        return (
          <div>
            <div>
              <PlayCircleOutlined className={styles.icon} />
              <span className={styles.time}>{moment(_record.releaseTimeStart).format(format)}</span>
            </div>
            <div>
              <PoweroffOutlined className={styles.icon} />
              <span className={styles.time}>
                {_record.releaseTimeEnd && moment(_record.releaseTimeEnd).format(format)}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'activityPage.belong' }),
      dataIndex: 'belong',
      render: (_text, _record) => {
        const isPlatform = _record.belongType === 1
        return (
          <Space direction="vertical">
            <StatusTag
              title={
                isPlatform
                  ? intl.formatMessage({ id: 'activityPage.platform' })
                  : intl.formatMessage({ id: 'activityPage.shoper' })
              }
              type={isPlatform ? 'success' : 'primary'}
            />
            <div className={styles.belong}>{_record.belongName}</div>
          </Space>
        )
      },
    },
  ]

  const triggerOk = (selectRowKeys, selectedRow) => {
    onOk?.(selectRowKeys, selectedRow)
  }

  const paginationStyle = { position: 'absolute', right: 0, bottom: '-40px' }

  const schema: ISchema = {
    type: 'object',
    properties: {
      megaLayout: {
        type: 'object',
        'x-component': 'mega-layout',
        properties: {
          id: {
            type: 'string',
            'x-component': 'Search',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'activityPage.SearchCouponID' }),
              align: 'flex-left',
              tip: intl.formatMessage({ id: 'activityPage.inputCouponIDSearch' }),
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              inline: true,
              full: true,
            },
            properties: {
              couponName: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'activityPage.CouponName' }),
                },
              },
              submit: {
                'x-component': 'Submit',
                'x-mega-props': {
                  span: 1,
                },
                'x-component-props': {
                  children: intl.formatMessage({ id: 'activityPage.search' }),
                },
              },
            },
          },
        },
      },
    },
  }

  return (
    <>
      <TableModal
        ref={couponRef as any}
        modalType={'Drawer'}
        width={920}
        visible={visible}
        onClose={onCancel}
        title={intl.formatMessage({ id: 'activityPage.chooseCoupon' })}
        columns={columns}
        schema={schema}
        onOk={triggerOk}
        fetchData={fetchData}
        paginationStyle={paginationStyle as any}
        // radioOptions={options}
        formExtra={formExtra}
        radioChange
        tableProps={{
          rowKey: (record) => record?.id,
        }}
        effects={($, actions) => {
          useStateFilterSearchLinkageEffect($, actions, 'id', FORM_FILTER_PATH)
        }}
        mode={mode}
        value={value}
        rowSelection={rowSelection}
      />
    </>
  )
})

export default CouponSelect

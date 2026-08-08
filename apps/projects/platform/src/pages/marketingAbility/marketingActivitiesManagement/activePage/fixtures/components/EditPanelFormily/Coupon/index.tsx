import React, { useRef, useState, useCallback, useEffect, useMemo, useContext } from 'react'
import { Button, Radio, Space, message } from 'antd'
import { useToggle } from '@linkseeks/hooks'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import moment from 'moment'
import { changeProps, clearSelectedStatus } from '@apps/design-core'
import styles from './index.less'
import CouponSelect from '../../CouponSelect'
import { Context as ShopContext } from '../../../common/context/shopContext'
import useGetSameKeys from '../../../common/hooks/useGetSameKeys'
import { getMarketingCouponActivityPageSelectPage } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

type ColumnType<T> = {
  title: string
  dataIndex: string
  render?: (text: string, record: T) => React.ReactNode
}

interface Iprops {
  value?: {
    id: number
    name: string
  }
  mutators: {
    change: (data: any) => void
  }
}

const PLATFORM = 1
const format = 'YYYY-MM-DD HH:mm:ss'

const FormilyCoupon: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const intl = useIntl()
  const { value = null } = props
  const { shopId } = useContext(ShopContext) || {}
  const { sameKeys } = useGetSameKeys()
  const disabledCouponKeys = useMemo(() => sameKeys['coupon'], [sameKeys])
  const [drawerVisible, setDrawerVisible] = useToggle()
  const ref = useRef()

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'activityPage.id' }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'activityPage.CouponName' }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'activityPage.couponTypeName' }),
      dataIndex: 'typeName',
    },
    {
      title: intl.formatMessage({ id: 'activityPage.getWayName' }),
      dataIndex: 'getWayName',
    },
    {
      title: intl.formatMessage({ id: 'activityPage.denomination' }),
      dataIndex: 'denomination',
    },
    {
      title: intl.formatMessage({ id: 'activityPage.useConditionMoney' }),
      dataIndex: 'useConditionMoney',
    },
    {
      title: intl.formatMessage({ id: 'activityPage.time' }),
      dataIndex: 'validityTime',
      render: (_text, _record) => {
        return (
          <div>
            <span>{_record?.releaseTimeStart && moment(_record?.releaseTimeStar).format(format)}</span>
            {intl.formatMessage({ id: 'activityPage.to' })}
            <span>{_record?.releaseTimeEnd && moment(_record?.releaseTimeEnd).format(format)}</span>
          </div>
        )
      },
    },
  ]

  const onOk = (selectedKey: string[], selectedRow: any[]) => {
    batchedUpdates(() => {
      // setInnerValue(selectedRow[0]);
      props.mutators.change(selectedRow[0])
      setDrawerVisible(false)
    })
  }

  const fetchData = useCallback(async (params: any) => {
    const { radio = PLATFORM, ...rest } = params
    const service = getMarketingCouponActivityPageSelectPage
    const { data, code } = await service({ ...rest, shopId: shopId! })
    if (code === 1000) {
      return data
    }

    return {
      totalCount: 0,
      data: [],
    }
  }, [])
  const selectedValue = useMemo(() => [value], [value])
  const rowSelection = {
    getCheckboxProps: (_record) => {
      return {
        disabled: disabledCouponKeys.includes(parseInt(_record.id)),
      }
    },
  }

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.module}>
            <Button onClick={() => setDrawerVisible(true)}>
              {intl.formatMessage({ id: 'activityPage.chooseCoupon' })}
            </Button>
          </div>
          <div className={styles.info}>
            {columns.map((_item) => {
              return (
                <div key={_item.dataIndex} className={styles.row}>
                  <span className={styles.name}>{_item.title}</span>
                  <span className={styles.value}>
                    {_item?.render?.(value?.[_item.dataIndex], value) || value?.[_item.dataIndex]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <CouponSelect
        visible={drawerVisible}
        onCancel={() => setDrawerVisible(false)}
        mode="radio"
        // formExtra={formExtra}
        ref={ref as any}
        fetchData={fetchData}
        onOk={onOk}
        value={selectedValue}
        rowSelection={rowSelection}
      />
    </div>
  )
}

FormilyCoupon.isFieldComponent = true

export default FormilyCoupon

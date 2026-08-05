import React, { useRef, useState, useCallback, useEffect, useMemo, useContext } from 'react'
import { Button, Radio } from 'antd'
import { useToggle } from '@linkseeks/hooks'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import { formatTimeString } from '@/utils'
import { StandardFormTable } from '@apps/components'
import styles from './index.less'
import CouponSelect from '../../CouponSelect'
import { Context as ShopContext } from '../../../common/context/shopContext'
import useGetSameKeys from '../../../common/hooks/useGetSameKeys'
import {
  getMarketingCouponPlatformActivityPageSelectMerchantPage,
  getMarketingCouponPlatformActivityPageSelectPage,
} from '@apps/apis'
import { useSelector } from '@apps/design-react'

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
const BUSINESS = 2
const options = [
  { label: '平台', value: PLATFORM },
  { label: '商家', value: BUSINESS },
]

const FormilyCoupon: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value = null } = props
  const { shopId } = useContext(ShopContext) || {}
  const { sameKeys } = useGetSameKeys()
  const { selectedInfo } = useSelector<any, any>(['selectedInfo'])
  const [drawerVisible, setDrawerVisible] = useToggle()
  const [radioValue, setRadioValue] = useState(PLATFORM)
  const tableRef = StandardFormTable.useTableRef()
  const disabledCouponKeys = useMemo(() => {
    if (selectedInfo && selectedInfo.props.id && selectedInfo.props.belongType) {
      return [`${selectedInfo.props.id}-${selectedInfo.props.belongType}`]
    }
    return []
  }, [selectedInfo])

  const columns: ColumnType<any>[] = [
    {
      title: '优惠券ID',
      dataIndex: 'id',
    },
    {
      title: '优惠券名称',
      dataIndex: 'name',
    },
    {
      title: '优惠券类型',
      dataIndex: 'typeName',
    },
    {
      title: '领券方式',
      dataIndex: 'getWayName',
    },
    {
      title: '面额',
      dataIndex: 'denomination',
    },
    {
      title: '使用条件',
      dataIndex: 'useConditionMoney',
    },
    {
      title: '有效期',
      dataIndex: 'validityTime',
      render: (_text, _record) => {
        return (
          <div>
            <span>{_record?.releaseTimeStart && formatTimeString(_record?.releaseTimeStart)}</span>至
            <span>{_record?.releaseTimeEnd && formatTimeString(_record?.releaseTimeEnd)}</span>
          </div>
        )
      },
    },
  ]

  // useEffect(() => {
  //   if (!visible) {
  //     return ;
  //   }
  //   setInnerValue(value);
  // }, [value]);

  const handleClose = () => {
    setRadioValue(PLATFORM)
    setDrawerVisible(false)
  }

  const onChange = (e) => {
    setRadioValue(e.target.value)
  }

  useEffect(() => {
    if (tableRef.current && tableRef.current.reload) {
      tableRef.current?.reload()
    }
  }, [radioValue])

  const formExtra = (
    <div style={{ textAlign: 'right' }}>
      <Radio.Group options={options} value={radioValue} onChange={onChange} optionType="button" />
    </div>
  )

  const onOk = (selectedRow: any[]) => {
    batchedUpdates(() => {
      // setInnerValue(selectedRow[0]);
      props.mutators.change(selectedRow[0])
      setDrawerVisible(false)
      setRadioValue(PLATFORM)
    })
  }

  const fetchData = useCallback(
    async (params: any) => {
      const service =
        radioValue === PLATFORM
          ? getMarketingCouponPlatformActivityPageSelectPage
          : getMarketingCouponPlatformActivityPageSelectMerchantPage
      /** @tofix shopId */
      const { data, code } = await service({ ...params, shopId: shopId! })
      if (code === 1000) {
        return {
          totalCount: data.totalCount,
          data: data.data.map((item) => ({
            ...item,
            key: `${item.id}-${item.belongType}`,
          })),
        }
      }

      return {
        totalCount: 0,
        data: [],
      }
    },
    [radioValue],
  )

  const selectedValue = useMemo(() => [value], [value])

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.module}>
            <Button onClick={() => setDrawerVisible(true)}>选择优惠券</Button>
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
        onCancel={handleClose}
        mode="radio"
        formExtra={formExtra}
        tableRef={tableRef as any}
        fetchData={fetchData}
        onOk={onOk}
        value={selectedValue}
        getCheckboxProps={(_record) => ({
          disabled: disabledCouponKeys.includes(`${_record.id}-${_record.belongType}`),
        })}
      />
    </div>
  )
}

FormilyCoupon.isFieldComponent = true

export default FormilyCoupon

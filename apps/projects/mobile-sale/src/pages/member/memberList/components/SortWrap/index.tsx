import React, { useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Icons, Text } from '@apps/mobile-ui'
import cs from 'classnames'
import styles from './index.module.scss'

type SortType = 'default' | 'asc' | 'desc' // 默认 升序 降序

export type SortParamsType = {
  defaultSort: boolean
  timesSort: SortType
  moneySort: SortType
}

type SortMapType = {
  default: SortType
  asc: SortType
  desc: SortType
}

type SearchWrapType = {
  onHandleBack: (params: SortParamsType) => void
}

enum SORT_TYPE {
  DEFAULT = 'default',
  ASC = 'asc',
  DESC = 'desc',
}

enum ACTIVE_COLOR {
  FOCUS = '#00A98F',
  BLUR = '#91959B',
}

export const SORT_TYPE_VALUE = {
  [SORT_TYPE.DEFAULT]: undefined,
  [SORT_TYPE.ASC]: 1,
  [SORT_TYPE.DESC]: 2,
}

const initParams: SortParamsType = {
  defaultSort: true,
  timesSort: 'default',
  moneySort: 'default',
}

const SORT_MAP: SortMapType = {
  default: 'asc',
  asc: 'desc',
  desc: 'default',
}

const SearchWrap = ({ onHandleBack }: SearchWrapType) => {
  const intl = useIntl()
  const [sortParams, setSortParams] = useState<SortParamsType>(initParams)

  // 筛选
  const onScreen = (key) => {
    switch (key) {
      case 'defaultSort':
        setSortParams(initParams)
        onHandleBack?.(initParams)
        break
      case 'timesSort':
      case 'moneySort':
        const params = { ...sortParams }
        params[key] = SORT_MAP[params[key]]
        params.defaultSort = params.timesSort === SORT_TYPE.DEFAULT && params.moneySort === SORT_TYPE.DEFAULT
        setSortParams(params)
        onHandleBack?.(params)
        break
    }
  }

  return (
    <View className={styles['screen-wrap']}>
      <View
        className={cs(styles['sort-btn'], sortParams.defaultSort && styles['active'])}
        onClick={() => onScreen('defaultSort')}
      >
        {intl.formatMessage({ id: 'member.default', defaultMessage: '默认' })}
      </View>
      <View className={styles['sort-btn']} onClick={() => onScreen('timesSort')}>
        <Text className={cs(sortParams.timesSort !== SORT_TYPE.DEFAULT && styles['active'])}>
          {intl.formatMessage({ id: 'member.numberOfOrders', defaultMessage: '下单次数' })}
        </Text>
        <View className={styles['sort-icon']}>
          <Icons
            name="ArrowUpFill"
            size={12}
            color={sortParams.timesSort === SORT_TYPE.ASC ? ACTIVE_COLOR.FOCUS : ACTIVE_COLOR.BLUR}
          />
          <Icons
            name="ArrowDownFill"
            size={12}
            color={sortParams.timesSort === SORT_TYPE.DESC ? ACTIVE_COLOR.FOCUS : ACTIVE_COLOR.BLUR}
          />
        </View>
      </View>
      <View className={styles['sort-btn']} onClick={() => onScreen('moneySort')}>
        <Text className={cs(sortParams.moneySort !== SORT_TYPE.DEFAULT && styles['active'])}>
          {intl.formatMessage({ id: 'member.amountPayable', defaultMessage: '应付金额' })}
        </Text>
        <View className={styles['sort-icon']}>
          <Icons
            name="ArrowUpFill"
            size={12}
            color={sortParams.moneySort === SORT_TYPE.ASC ? ACTIVE_COLOR.FOCUS : ACTIVE_COLOR.BLUR}
          />
          <Icons
            name="ArrowDownFill"
            size={12}
            color={sortParams.moneySort === SORT_TYPE.DESC ? ACTIVE_COLOR.FOCUS : ACTIVE_COLOR.BLUR}
          />
        </View>
      </View>
    </View>
  )
}

export default SearchWrap

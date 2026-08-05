/*
 * @Author: GHua
 * @Date: 2022-03-25 20:27:42
 * @LastEditTime: 2022-03-31 19:21:44
 * @LastEditors: GHua
 * @Description:
 */
import React from 'react'
import {
  AppstoreOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  LeftOutlined,
  RightOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import cx from 'classnames'
import { COMMODITY_SHOW_TYPE } from '@/pages/orderAbility/saleOrder/agentPurchaseOrder/constants'
import styles from './index.less'
import { FILTER_PARAM, FILTER_SEARCH_TYPE } from '../CommonFilter/types'
import { useIntl } from '@linkseeks/i18n'

interface SortBarProps {
  isMro?: boolean
  checkPrice?: boolean
  current: number
  pageSize: number
  totalCount: number
  filterType: FILTER_SEARCH_TYPE
  showType?: COMMODITY_SHOW_TYPE
  filterParam: FILTER_PARAM | undefined
  onShowTypeChange?: (type: COMMODITY_SHOW_TYPE) => void
  onCheckPriceChange?: (state: boolean) => void
  onPageChange?: (page: number) => void
  onFilterChange?: (values: FILTER_PARAM | undefined) => void
}

const SortBar: React.FC<SortBarProps> = (props) => {
  const { totalCount, current, pageSize, onShowTypeChange, onCheckPriceChange, onPageChange, onFilterChange } = props
  const intl = useIntl()
  const handlePageChange = (page: number) => {
    onPageChange && onPageChange(page)
  }

  return (
    <div className={styles.tool_bar}>
      <div className={styles.tool_bar_left} />
      <div className={styles.tool_bar_right}>
        <div className={styles.count}>
          <span>{intl.formatMessage({ id: 'supplier.import.find.sort.common', defaultMessage: '共' })}</span>
          <label>{totalCount}</label>
          <span>{intl.formatMessage({ id: 'customerAbility.import.find.sort.items', defaultMessage: '客户' })}</span>
        </div>
        <div className={styles.pageBox}>
          <LeftOutlined
            className={cx(styles.pageBoxIcon, current === 1 ? styles.disabled : '')}
            onClick={() => {
              if (current > 1) {
                handlePageChange(current - 1)
              }
            }}
          />
          <div className={styles.pageBox_main}>
            <span>{current}</span>
            <span>/</span>
            <span>{Math.ceil(totalCount / pageSize) || 1}</span>
          </div>
          <RightOutlined
            className={cx(styles.pageBoxIcon, current >= Math.ceil(totalCount / pageSize) ? styles.disabled : '')}
            onClick={() => {
              if (current < Math.ceil(totalCount / pageSize)) {
                handlePageChange(current + 1)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default SortBar

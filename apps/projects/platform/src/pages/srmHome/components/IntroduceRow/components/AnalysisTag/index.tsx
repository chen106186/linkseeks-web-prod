/**
 * @Description 统计增长tag
 */
import React from 'react'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

export interface AnalysisCardProps {
  /**
   * 值
   */
  value: number
}

const AnalysisCard: React.FC<AnalysisCardProps> = (props) => {
  const { value } = props
  const translate = useWebIntl()
  return (
    <div className={styles['analysis-tag']}>
      <div
        className={classNames(styles['analysis-tag-tofu'], {
          [styles['analysis-tag-tofu-up']]: value >= 0,
          [styles['analysis-tag-tofu-down']]: value < 0,
        })}
      >
        {value >= 0 ? (
          <CaretUpOutlined style={{ paddingRight: 4, paddingLeft: 4 }} />
        ) : (
          <CaretDownOutlined style={{ paddingRight: 4, paddingLeft: 4 }} />
        )}
        {`${value}%`}
      </div>
      <div className={styles['analysis-tag-desc']}>{translate('web.resource.srmHome.xiangbizuori')}</div>
    </div>
  )
}

export default AnalysisCard

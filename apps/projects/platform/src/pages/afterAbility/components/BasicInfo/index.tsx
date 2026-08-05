/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-11 10:46:57
 * @LastEditors: Crayon
 * @LastEditTime: 2021-10-14 09:56:42
 * @Description: 申请单基础信息
 */
import React, { CSSProperties } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Descriptions } from 'antd'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import styles from './index.less'

export interface ColumnProps {
  span?: number
  contentStyle?: CSSProperties
  labelStyle?: CSSProperties
}

export interface DataItem {
  /**
   * 标题
   */
  title: React.ReactNode
  /**
   * 值
   */
  value: React.ReactNode
  /**
   * DescriptionItem 描述列 props
   */
  columnProps?: ColumnProps
}

interface IProps extends MellowCardProps {
  /**
   * 数据
   */
  data: DataItem[]
}

const defaultColumnProps: ColumnProps = {
  labelStyle: {
    width: 104,
  },
}

const AfterServiceBasicInfo: React.FC<IProps> = (props: IProps) => {
  const { data, ...rest } = props

  const intl = useIntl()

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'afterService.components.BasicInfo.title', defaultMessage: '基本信息' })}
      bodyStyle={{
        paddingBottom: 0,
      }}
      className={styles.basicInfo}
      {...rest}
    >
      <Descriptions column={3}>
        {data.map((item, index) => (
          <Descriptions.Item
            key={index}
            label={item.title}
            {...({ ...defaultColumnProps, ...item.columnProps } || defaultColumnProps)}
          >
            {item.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </MellowCard>
  )
}

export default AfterServiceBasicInfo

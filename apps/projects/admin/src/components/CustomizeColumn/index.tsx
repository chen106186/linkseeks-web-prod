import React, { CSSProperties, ReactNode } from 'react'
import { Descriptions, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import styles from './index.less'

export interface ColumnProps {
  span?: number
  contentStyle?: CSSProperties
  labelStyle?: CSSProperties
  /**
   * 帮助提示
   */
  tips?: boolean
  /**
   * 帮助提示文本
   */
  tipsText?: string
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
   * DescriptionItem props
   */
  columnProps?: ColumnProps
}

export interface IProps extends MellowCardProps {
  /**
   * 数据
   */
  data: DataItem[]
  /**
   * column 列数，默认 3
   */
  column?: number
}

const defaultColumnProps: ColumnProps = {
  labelStyle: {
    width: 104,
  },
  contentStyle: {
    paddingRight: 32,
  },
}

const CustomizeColumn: React.FC<IProps> = (props: IProps) => {
  const { data, column = 3, ...rest } = props
  const { className } = rest
  const mergeCls = classNames(styles['customize-column'], className)

  const renderTips = (text: React.ReactNode, tips) => {
    return React.createElement(
      Tooltip,
      { title: tips },
      <div>
        <span>{text}</span>
        <QuestionCircleOutlined style={{ margin: '0 4px' }} />
      </div>,
    )
  }

  return (
    <MellowCard
      bodyStyle={{
        paddingBottom: 0,
      }}
      {...rest}
      className={mergeCls}
    >
      <Descriptions column={column}>
        {data.map((item, index) => {
          const mergeColumns = Object.assign({}, defaultColumnProps, item.columnProps)
          const { tips, tipsText, ...restColumns } = mergeColumns
          return (
            <Descriptions.Item key={index} label={item.title} {...restColumns}>
              {!tips ? item.value : renderTips(item.value, tipsText)}
            </Descriptions.Item>
          )
        })}
      </Descriptions>
    </MellowCard>
  )
}

CustomizeColumn.defaultProps = {
  column: 3,
}

export default CustomizeColumn

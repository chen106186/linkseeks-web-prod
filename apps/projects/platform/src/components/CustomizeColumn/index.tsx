import type { CSSProperties } from 'react'
import React from 'react'
import { Descriptions, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import type { MellowCardProps } from '@/components/MellowCard'
import MellowCard from '@/components/MellowCard'
import styles from './index.less'
import { changeIcon } from '@/pages/commodityAbility/material/components/wl_extras'

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
   * 过去值
   */
  old_value?: React.ReactNode
  /**
   * 是否有变化
   */
  isChange?: 'change' | 'add' | 'del' | boolean
  /**
   * 值处理
   */
  render?: (value: any) => React.ReactNode
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
  /**
   * 变更前
   */
  before?: boolean
  /**
   * 不显示变更图标
   */
  noBeforeIcon?: boolean
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
  const { data, column = 3, before, noBeforeIcon, ...rest } = props
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
        {data?.length &&
          data.map((item, index) => {
            const mergeColumns = Object.assign({}, defaultColumnProps, item.columnProps)
            const { tips, tipsText, ...restColumns } = mergeColumns
            const val = !before ? item.value : item.old_value
            return (
              <Descriptions.Item key={index} label={item.title} {...restColumns}>
                <div className={styles.val_body}>
                  <div>{!tips ? val : renderTips(val, tipsText)}</div>
                  <div>{!(before || noBeforeIcon) && item.isChange && changeIcon(item.isChange, item.old_value)}</div>
                </div>
              </Descriptions.Item>
            )
          })}
        {data?.length && data.length % 2 === 1 && (
          <Descriptions.Item>
            <div>{''}</div>
          </Descriptions.Item>
        )}
      </Descriptions>
    </MellowCard>
  )
}

CustomizeColumn.defaultProps = {
  column: 3,
}

export default CustomizeColumn

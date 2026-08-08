/*
 * @Author: XieZhiXiong
 * @Date: 2020-08-26 17:32:45
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-12-29 15:06:05
 * @Description: 基于 antd Card 封装的适合项目 UI 的 Card，使用方式跟 antd Card 一样，这里只是修改了样式
 */
import React from 'react'
import { Card } from 'antd'
import classNames from 'classnames'
import { CardProps } from 'antd/lib/card'
import styled from 'styled-components'
import styles from './index.less'

const Wrap = styled((props) => <div {...props} />)`
  > .ant-card {
    border-radius: 8px;

    .ant-card-head {
      border-bottom: none;
      padding: 0 16px;

      .ant-card-head-title {
        line-height: 24px;
        padding-bottom: 0;
        font-size: 16px;
        font-weight: 500;
        color: rgba(23, 43, 77, 1);
      }

      .ant-card-extra {
        margin-top: 8px;
        padding: 0;
      }
    }

    .ant-card-body {
      padding: 16px;
    }
  }

  &.fullHeight {
    height: 100%;

    .ant-card {
      height: 100%;
      display: flex;
      flex-direction: column !important;

      .ant-card-head {
        flex-shrink: 0;
      }

      .ant-card-body {
        flex: 1;
      }
    }
  }
`

export interface MellowCardProps extends CardProps {
  blockClassName?: string
  fullHeight?: boolean // 是否占满父级的高度，一般用于多列使用改组件的情况
}

const MellowCard: React.FC<MellowCardProps> = (props) => {
  const { children, blockClassName, fullHeight, style, ...rest } = props
  const cls = classNames({
    fullHeight: fullHeight,
  })

  return (
    <Wrap className={cls} style={style}>
      <Card bordered={false} {...rest}>
        {children}
      </Card>
    </Wrap>
  )
}

export default MellowCard

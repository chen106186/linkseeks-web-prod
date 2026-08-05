import React from 'react'
import { Card } from 'antd'
import classNames from 'classnames'
import { CardProps } from 'antd/lib/card'
import styled from 'styled-components'

const Wrap = styled((props) => <div {...props} />)`
  > .ant-card {
    border-radius: 8px;
    margin-bottom: 16px;

    .ant-card-head {
      border-bottom: none;

      .ant-card-head-title {
        line-height: 20px;
        padding-bottom: 0;
        font-size: 14px;
        font-weight: 500;
        color: rgba(23, 43, 77, 1);
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

export interface FormItemCardProps extends CardProps {
  /**
   * 是否占满父级的高度，一般用于多列使用改组件的情况
   */
  fullHeight?: boolean
}

const FormItemCard: React.FC<FormItemCardProps> = (props) => {
  const { children, fullHeight, ...rest } = props

  const cls = classNames({
    fullHeight: fullHeight,
  })

  return (
    <Wrap className={cls}>
      <Card bordered={false} {...rest}>
        {children}
      </Card>
    </Wrap>
  )
}

export default FormItemCard

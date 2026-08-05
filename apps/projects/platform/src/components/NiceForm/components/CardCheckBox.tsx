import React from 'react'
import { Row, Col } from 'antd'
import styled from 'styled-components'
import { findItemAndDelete } from '@/utils'
import cx from 'classnames'

const RowStyleLayout = styled((props) => <div {...props} />)`
  .card-checkbox {
    display: flex;
    flex-wrap: wrap;
  }
  .card-checkbox-item {
    width: 320px;
    height: 48px;
    margin-right: 32px;
    margin-bottom: 16px;
    border: 1px solid rgba(235, 236, 240, 1);
    padding: 0 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .card-checkbox-item.active {
    border-color: #00b382;
    position: relative;
  }
  .card-checkbox-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-right: 6px solid #00b382;
    border-bottom: 6px solid #00b382;
  }
  .card-logo {
    display: block;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .card-logo.default {
    background: #669ede;
    text-align: center;
    line-height: 32px;
    color: #fff;
    font-size: 12px;
  }
  .card-checkbox-title {
    font-size: 12px;
    color: #606266;
  }
`

const CardCheckBox = (props) => {
  const { dataSource = [], type = 'checkbox' } = props.props['x-component-props']
  const value: number[] = props.value || []

  const handleChange = (id) => {
    // 如果处于不可编辑状态, 则无法选择
    if (!props.editable) {
      return false
    }
    if (value.includes(id)) {
      const newValue = findItemAndDelete(value, id)
      props.mutators.change(newValue)
    } else {
      // 扩展单选模式
      type === 'radio' ? props.mutators.change([id]) : props.mutators.change([...value, id])
    }
  }

  const isChecked = (id) => {
    return value.includes(id)
  }
  return (
    <RowStyleLayout>
      <Row className="card-checkbox">
        {dataSource &&
          dataSource.map((v, i) => {
            return (
              <Col
                key={v.id}
                className={cx('card-checkbox-item', isChecked(v.id) ? 'active' : '')}
                onClick={() => handleChange(v.id)}
              >
                {v.logoUrl ? (
                  <img className="card-logo" src={v.logoUrl} />
                ) : (
                  <div className="card-logo default">logo</div>
                )}
                <span className="card-checkbox-title">{v.name}</span>
              </Col>
            )
          })}
      </Row>
    </RowStyleLayout>
  )
}

CardCheckBox.defaultProps = {}

CardCheckBox.isFieldComponent = true

export default CardCheckBox

import React from 'react'
import { Row, Col, Button } from 'antd'
import styled from 'styled-components'
import { ArrayList, SchemaField, toArr, FormPath } from '@apps/formily'

const ArrayComponents = {
  CircleButton: (props) => <Button {...props} />,
  TextButton: (props) => <Button text {...props} />,
  AdditionIcon: () => <div>+Add</div>,
  RemoveIcon: () => <div>Remove</div>,
  MoveDownIcon: () => <div>Down</div>,
  MoveUpIcon: () => <div>Up</div>,
}

const RowStyleLayout = styled((props) => <div {...props} />)`
  padding: 24px 64px 24px 24px;
  background: #ffffff;

  .ant-btn {
    margin-right: 16px;
  }

  .ant-form-item {
    display: flex;
    margin-right: 16px;
    margin-bottom: 16px;
  }

  > .ant-form-item {
    margin-bottom: 0;
    margin-right: 0;
  }

  .goodInfo {
    display: flex;
    align-items: align;

    &-left {
      flex-shrink: 0;
      margin-right: 16px;
      width: 100px;
      height: 100px;

      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &-title {
      line-height: 14px;
      margin-bottom: 18px;
      font-size: 12px;
      font-weight: 400;
      color: #303133;
    }

    &-desc {
      line-height: 12px;
      margin-bottom: 16px;
      font-size: 12px;
      font-weight: 400;
      color: #909399;
    }

    &-price {
      line-height: 14px;
      font-size: 12px;
      font-weight: 500;
      color: #303133;
    }
  }

  .main {
    position: relative;
    padding-left: 24px;

    > .ant-form-item {
      margin-bottom: 0;
      margin-right: 0;
    }

    ::after {
      content: ' ';
      display: block;
      position: absolute;
      top: 6%;
      left: 0;
      bottom: 6%;
      border-left: 1px dashed #eef0f3;
    }
  }
`

const EvaluationList = (props) => {
  const { value, schema, className, editable, path, mutators } = props
  const {
    renderAddition,
    renderRemove,
    renderMoveDown,
    renderMoveUp,
    renderEmpty,
    renderExtraOperations,
    ...componentProps
  } = schema.getExtendsComponentProps() || {}

  return (
    <ArrayList
      value={value}
      minItems={schema.minItems}
      maxItems={schema.maxItems}
      editable={editable}
      components={ArrayComponents}
    >
      {toArr(value).map((item, index) => {
        return (
          <RowStyleLayout {...componentProps} key={index}>
            <Row align="middle">
              <Col span={8}>
                <div className="goodInfo">
                  <div className="goodInfo-left">
                    <img src={item.good ? item.good.pic : ''} />
                  </div>
                  <div className="goodInfo-right">
                    <div className="goodInfo-title">{item.good.productName}</div>
                    <div className="goodInfo-desc">
                      X {item.good.purchaseCount || ''}
                      {item.good.unit || ''}
                    </div>
                    <div className="goodInfo-price">{`¥ ${item.good.price}`}</div>
                  </div>
                </div>
              </Col>
              <Col span={16}>
                <div className="main">
                  <SchemaField path={FormPath.parse(path).concat(index)} />
                </div>
              </Col>
            </Row>
          </RowStyleLayout>
        )
      })}
    </ArrayList>
  )
}

EvaluationList.isFieldComponent = true

export default EvaluationList

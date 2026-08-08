import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd';
import styled from 'styled-components'
import { findItemAndDelete } from '@/utils'
import cx from 'classnames'

const RowStyleLayout = styled(props => <div {...props} />)`
  .card-checkbox-item {
    width: 130px;
    height: 32px;
    margin-right: 32px;
    margin-bottom: 16px;
    border:1px solid rgba(235,236,240,1);
    padding: 0 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .card-checkbox-item.active {
    border-color: #00B382;
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
    border-right: 6px solid #00B382;
    border-bottom: 6px solid #00B382;
  }
  .card-logo {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 6px;
  }
  .card-checkbox-title {
    font-size: 12px;
    color: #606266;
  }
`

interface IProps {
  dataSource: any[],
  cardChange: any,
  name: string,
  type?: string,
  editable?: boolean,
}

const CardCheckBox = (props: IProps) => {
  const { dataSource = [], type = 'checkbox', editable = true, cardChange, name } = props
  const [value, setValue] = useState<any>([])

  useEffect(() => {
    let transport = {}
    transport[name] = value[0]
    cardChange(transport)
  }, [value])

  const handleChange = (id) => {
    if (!editable) {
      return false
    }
    if (value.includes(id)) {
      const newValue = findItemAndDelete(value, id)
      setValue(newValue)
    } else {
      // type === 'radio' ? props.mutators.change([id]) : props.mutators.change([...value, id])
      type === 'radio' ? setValue([id]) : setValue([...value, id])
    }
  }

  const isChecked = (id) => {
    return value.includes(id)
  }

  return (
    <RowStyleLayout>
      <div className='card-checkbox'>
        {
          dataSource.map(({title, items}, index) => (
            <Row key={index}>
              <Col span={6}>
                <p>{title}：</p>
              </Col>
              <Col span={18}>
                <Row>
                  {
                    items.length > 0 && items.map((v, i) =>
                      <Col key={v.id} className={cx('card-checkbox-item', isChecked(v.id) ? 'active' : '')} onClick={() => handleChange(v.id)}>
                        {v.logoUrl ? <img className='card-logo' src={v.logoUrl} /> : null}
                        <span className='card-checkbox-title'>{v.name}</span>
                      </Col>
                    )
                  }
                </Row>
              </Col>
            </Row>
          ))
        }
      </div>
    </RowStyleLayout>
  )
}

CardCheckBox.defaultProps = {}

export default CardCheckBox
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ISchemaFieldComponentProps, useFieldState } from '@apps/formily'
import { Row, Col, Tag } from 'antd'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { getOrderTradeProcessBaseList } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const SelectStyles = styled((props) => <div className="select-list" {...props}></div>)`
  .select_style_border {
    border: 1px solid #eef0f3;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    cursor: pointer;
    line-height: 28px;
    position: relative;
  }

  .select_style_border.active {
    border: 1px solid #00b382;
  }
  .select_style_border.active::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 12px solid #00a98f;
    border-left: 12px solid transparent;
    bottom: 0;
    right: 0;
    z-index: 5;
  }
`

enum ProcessTagColor {
  'red',
  'orange',
  'purple',
  'blue',
  'green',
}

const SelectProcesss = (props: ISchemaFieldComponentProps) => {
  const [formInitValue, setFormInitValue] = useState<any>(null)
  const [state, setFieldState] = useFieldState({
    dataSource: [],
    showMore: false,
  })
  const { dataSource, showMore } = state
  const { value, mutators, editable } = props
  const intl = useIntl()
  useEffect(() => {
    getOrderTradeProcessBaseList().then((res) => {
      setFieldState({
        dataSource: res.data,
        showMore,
      })
    })
  }, [])

  const showDataSource = showMore ? dataSource : [...dataSource].splice(0, 3)

  const handleCheck = (id) => {
    if (editable) {
      mutators.change(id)
    }
  }

  const toogleMore = () => {
    setFieldState({
      dataSource,
      showMore: !showMore,
    })
  }

  const renderProcessType = (v: any) => {
    return <Tag color={ProcessTagColor[v.processType - 1]}>{v['processTypeName']}</Tag>
  }

  return (
    <div style={{ width: '100%' }}>
      <SelectStyles>
        {showDataSource.map((v) => (
          <div
            key={v.baseProcessid}
            onClick={() => handleCheck(v.baseProcessid)}
            className={cx('select_style_border', value === v.baseProcessid ? 'active' : '')}
          >
            <div>
              <Row style={{ color: '#303133' }}>
                <Col>{v.processName}</Col>
                <Col style={{ marginLeft: 6 }}>{renderProcessType(v)}</Col>
              </Row>
              <div style={{ color: '#909399' }}>{v.description}</div>
            </div>
          </div>
        ))}
      </SelectStyles>
      {dataSource.length > 3 && (
        <div onClick={toogleMore} style={{ textAlign: 'center', cursor: 'pointer' }}>
          {intl.formatMessage({ id: 'processRuleSetting.xianshigengduo', defaultMessage: '显示更多' })}
          {showMore ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </div>
      )}
    </div>
  )
}

SelectProcesss.defaultProps = {}

SelectProcesss.isFieldComponent = true

export default SelectProcesss

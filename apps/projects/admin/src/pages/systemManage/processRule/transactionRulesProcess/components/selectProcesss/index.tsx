import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ISchemaFieldComponentProps, useFieldState } from '@apps/formily'
import { Row, Col, Tag } from 'antd'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { getOrderPlatformTradeProcessBaseList } from '@apps/apis'

const SelectStyles = styled((props) => <div className="select-list" {...props}></div>)`
  .select_style_border {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    padding: 8px 14px;
    line-height: 28px;
    border: 1px solid #eef0f3;
    cursor: pointer;
  }

  .select_style_border.active {
    border: 1px solid #00b382;
  }
  .select_style_border.active::after {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 5;
    width: 0;
    height: 0;
    border-bottom: 12px solid #00a98f;
    border-left: 12px solid transparent;
    content: '';
  }
`

enum ProcessTagColor {
  'red',
  'orange',
  'purple',
  'blue',
  'geekblue',
  'magenta',
  'cyan',
}

enum ProcessTagType {
  '订单交易流程',
  '售后换货流程',
  '售后退货流程',
  '售后维修流程',
  '生产加工流程',
  '积分订单流程',
  '跨境电商进口订单流程',
}

const SelectProcesss = (props: ISchemaFieldComponentProps) => {
  const [formInitValue, setFormInitValue] = useState<any>(null)
  const [state, setFieldState] = useFieldState<any>({
    dataSource: [],
    showMore: false,
  })
  const { dataSource, showMore } = state
  const { value, mutators, editable } = props
  // @注释说明：多选变单选
  // const { mutators, editable } = props
  // const value: number[] = props.value || []

  useEffect(() => {
    getOrderPlatformTradeProcessBaseList().then((res) => {
      setFieldState({
        dataSource: res.data,
        showMore,
      })
    })
  }, [])

  const showDataSource = showMore ? dataSource : [...dataSource].splice(0, 3)

  const handleCheck = (id) => {
    console.log(id, 'id')
    if (editable) {
      mutators.change(id)
    }

    // if (!editable) {
    //   return false
    // }
    // if (value.includes(id)) {
    //   const newValue = findItemAndDelete(value, id)
    //   mutators.change(newValue)
    // } else {
    //   mutators.change([...value, id])
    // }
  }

  // const isChecked = (id) => {
  //   return value.includes(id)
  // }

  const toogleMore = () => {
    setFieldState({
      dataSource,
      showMore: !showMore,
    })
  }

  const renderProcessType = (v: any) => {
    return <Tag color={ProcessTagColor[v.processType - 1]}>{ProcessTagType[v.processType - 1]}</Tag>
  }

  return (
    <div style={{ width: '100%' }}>
      <SelectStyles>
        {
          // showDataSource.map(v => <div key={v.baseProcessid} onClick={() => handleCheck(v.baseProcessid)} className={cx('select_style_border', isChecked(v.baseProcessid) ? 'active' : '')}>
          showDataSource.map((v) => (
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
          ))
        }
      </SelectStyles>
      {dataSource.length > 3 && (
        <div onClick={toogleMore} style={{ textAlign: 'center', cursor: 'pointer' }}>
          显示更多{showMore ? <CaretDownOutlined /> : <CaretUpOutlined />}
        </div>
      )}
    </div>
  )
}

SelectProcesss.defaultProps = {}

SelectProcesss.isFieldComponent = true

export default SelectProcesss

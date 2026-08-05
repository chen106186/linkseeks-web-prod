import React, { useState, useRef, useContext, useEffect } from 'react'
import { Form, Input, Checkbox, Row, Col, InputNumber } from 'antd'
import style from '../../index.less'
import { BidDetailContext } from '@/pages/purchaseManage/procurement/_public/bid/context'
import checkmark from '@/assets/checkmark_circle.png'

/**
 * 招标定标表格中 授标的每一项 待审核专用
 */

export interface GivenBidItemProps {
  /** 当前行数据 */
  currentData: any
  /** 所有数据 */
  datas: any
  /** 当前渲染的列索引等 */
  currentColumn: any
  /** 所有的列索引 */
  columns: any
  /** 当前列索引 */
  currentIndex: any
}

export const GivenBidItem: React.FC<GivenBidItemProps> = ({
  currentData,
  datas,
  currentColumn,
  columns,
  currentIndex,
}) => {
  const { data, ctl } = useContext(BidDetailContext)
  const [tableDataSource, setTableDataSource] = useState<any>([])
  const [tableColumns, setTableColumns] = useState<any>([])

  const onChangeInput = (v) => {
    setTableDataSource(() => {
      const newData = [...datas]
      const currentRow = newData[currentIndex]
      currentRow[currentColumn.dataIndex]['awardRate'] = v
      newData.splice(currentIndex, 1, currentRow)
      return newData
    })
  }

  const chanegChecked = (e) => {
    setTableDataSource(() => {
      const newData = [...datas]
      const currentRow = newData[currentIndex]
      currentRow[currentColumn.dataIndex]['isAwardTender'] = e.target.checked
      // 默认100
      currentRow[currentColumn.dataIndex]['awardRate'] = 100
      newData.splice(currentIndex, 1, currentRow)
      return newData
    })

    if (e.target.checked) {
      e.nativeEvent.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.border =
        '1px solid #00A98F'
      e.nativeEvent.target.parentElement.parentElement.nextSibling.style.display = 'inline-block'
    } else {
      e.nativeEvent.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.border =
        'none'
      e.nativeEvent.target.parentElement.parentElement.nextSibling.style.display = 'none'
    }
  }

  return (
    <div className={style.throwBidInfo}>
      <div className={style['card-list']}>
        <Row>
          <Col span={8}>
            <p className={style['card-list_title']}>含税单价:</p>
          </Col>
          <Col>
            <p>￥{currentData[currentColumn.dataIndex]['price']}</p>
          </Col>
        </Row>
      </div>
      <div className={style['card-list']}>
        <Row>
          <Col span={8}>
            <p className={style['card-list_title']}>含税金额:</p>
          </Col>
          <Col>
            <p>￥{(currentData[currentColumn.dataIndex]['price'] * currentData['count']).toFixed(2)}</p>
          </Col>
        </Row>
      </div>
      <div className={style['card-list']}>
        <Row>
          <Col span={8}>
            <p className={style['card-list_title']}>是否含税:</p>
          </Col>
          <Col>
            <p>{currentData[currentColumn.dataIndex]['isTax'] ? '是' : '否'}</p>
          </Col>
        </Row>
      </div>
      <div className={style['card-list']}>
        <Row>
          <Col span={8}>
            <p className={style['card-list_title']}>税率:</p>
          </Col>
          <Col>
            <p>{`${currentData[currentColumn.dataIndex]['taxRate']}%`}</p>
          </Col>
        </Row>
      </div>
      <div className={style['card-list']}>
        <Row>
          <Col span={8}>
            <p className={style['card-list_title']}>授标:</p>
          </Col>
          <Col>
            <p>
              {currentData[currentColumn.dataIndex]['isAwardTender'] ? (
                <span>
                  {currentData[currentColumn.dataIndex]['awardRate']}%&nbsp;&nbsp;
                  <img src={checkmark} alt="已授标" style={{ width: 12, height: 12 }} />
                </span>
              ) : (
                <span>—</span>
              )}

              {/* <Checkbox defaultChecked={currentData[currentColumn.dataIndex]['isAwardTender']} style={{marginRight: 16}} onChange={chanegChecked} />
            <InputNumber
              defaultValue={currentData[currentColumn.dataIndex]['awardRate']}
              min={0}
              max={100}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={onChangeInput}
              style={{display: 'none'}}
            /> */}
            </p>
          </Col>
        </Row>
      </div>
    </div>
  )
}

GivenBidItem.defaultProps = {}

export default GivenBidItem

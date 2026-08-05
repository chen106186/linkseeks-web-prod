import React, { useContext } from 'react'
import { Checkbox, Row, Col, InputNumber } from 'antd'
import style from '../../index.less'
import { ReadyConfirmBidContext } from '@/pages/procurement/_public/bid/context'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
/**
 * 招标定标表格中 授标的每一项 待定标专用
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
  const { submitData, submitCtl } = useContext(ReadyConfirmBidContext)
  // const { paramsTableData: tableDataSource, simulateColumn: tableColumns } = submitData
  const { setParamsTableData: setTableDataSource, setSimulateColumn: setTableColumns } = submitCtl

  const onChangeInput = (v) => {
    setTableDataSource(() => {
      const newData = [...datas]
      const currentRow = newData[currentIndex]
      currentRow[currentColumn.dataIndex]['awardTenderRatio'] = v
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
      currentRow[currentColumn.dataIndex]['awardTenderRatio'] = 100
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

  const currentItemData = currentData[currentColumn.dataIndex]

  return (
    <div
      className={style.throwBidInfo}
      style={{ border: currentItemData['isAwardTender'] ? '1px solid #00A98F' : 'none' }}
    >
      <div className={style['card-list']}>
        <Row>
          <Col span={8}>
            <p className={style['card-list_title']}>{intl.formatMessage({ id: 'detail.purchase.label33' })}:</p>
          </Col>
          <Col>
            <p>
              {translate('web.common.currencySymbol')}
              {currentItemData['price']}
            </p>
          </Col>
        </Row>
      </div>
      <div className={style['card-list']}>
        <Row>
          <Col span={8}>
            <p className={style['card-list_title']}>{intl.formatMessage({ id: 'detail.purchase.label32' })}:</p>
          </Col>
          <Col>
            <p>
              {translate('web.common.currencySymbol')}
              {(currentItemData['price'] * currentData['count']).toFixed(2)}
            </p>
          </Col>
        </Row>
      </div>
      <div className={style['card-list']}>
        <Row>
          <Col span={8}>
            <p className={style['card-list_title']}>{intl.formatMessage({ id: 'detail.purchase.label31' })}:</p>
          </Col>
          <Col>
            <p>
              {currentItemData['isTax']
                ? intl.formatMessage({ id: 'table.purchase.shi' })
                : intl.formatMessage({ id: 'table.purchase.fou' })}
            </p>
          </Col>
        </Row>
      </div>
      <div className={style['card-list']}>
        <Row>
          <Col span={8}>
            <p className={style['card-list_title']}>{intl.formatMessage({ id: 'detail.purchase.taxProbability' })}:</p>
          </Col>
          <Col>
            <p>{`${currentItemData['taxRate']}%`}</p>
          </Col>
        </Row>
      </div>
      <div className={style['card-list']}>
        <Row>
          <Col span={8}>
            <p className={style['card-list_title']}>{intl.formatMessage({ id: 'detail.purchase.isAward' })}:</p>
          </Col>
          <Col>
            <p>
              <Checkbox
                defaultChecked={currentItemData['isAwardTender']}
                style={{ marginRight: 16 }}
                disabled={true}
                onChange={chanegChecked}
              />
              <InputNumber
                defaultValue={currentItemData['awardTenderRatio']}
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => value.replace('%', '')}
                onChange={onChangeInput}
                disabled={true}
                style={{ display: currentItemData['isAwardTender'] ? 'inline-block' : 'none' }}
              />
            </p>
          </Col>
        </Row>
      </div>
    </div>
  )
}

GivenBidItem.defaultProps = {}

export default GivenBidItem

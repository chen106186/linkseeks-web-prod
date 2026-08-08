import { Col, Modal, ModalProps, Row } from 'antd'
import React from 'react'
import styled from 'styled-components'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'

interface dataProps {
  id: number
  name: string
}

interface SaleAfterProps extends ModalProps {
  /** 售后项数据源 */
  showDataSource: dataProps[]
  /** 点击售后项的回调 */
  onClickItem: (id: number) => void
  /** 当前选中id */
  currentSelectedKey: number
}

const SelectStyles = styled((props) => <div className="select-list" {...props}></div>)`
  .select_style_border {
    border: 1px solid #eef0f3;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    line-height: 32px;
    height: 32px;
    position: relative;
  }

  .select_style_border.active {
    border: 1px solid #00b382;
    color: #00a98f;
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

/**
 * 订单售后弹框
 * @param props
 * @returns
 */
const SaleAfter: React.FC<SaleAfterProps> = (props) => {
  const intl = useIntl()
  const { showDataSource = [], onClickItem, currentSelectedKey, ...restProps } = props

  return (
    <Modal title={intl.formatMessage({ id: 'purchaseOrder.modalTitle1' })} {...restProps}>
      <div style={{ width: '100%' }}>
        <SelectStyles>
          {showDataSource.map((v) => (
            <div
              key={v.id}
              onClick={() => onClickItem(v.id)}
              className={cx('select_style_border', currentSelectedKey === v.id ? 'active' : '')}
            >
              <div>
                <Row style={{ color: '#303133' }}>
                  <Col>{v.name}</Col>
                </Row>
              </div>
            </div>
          ))}
        </SelectStyles>
      </div>
    </Modal>
  )
}

SaleAfter.defaultProps = {}

export default SaleAfter

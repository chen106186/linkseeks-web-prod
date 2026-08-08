import React, { useState } from 'react'
import { Modal, Row, Col, Tooltip, Checkbox } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'

const CheckboxGroup = Checkbox.Group

export interface IProps {
  visible: boolean
  storeList: Array<any>
  onCancel?: () => void
  getStroeList?: (e: any) => void
}
const intl = getIntl()
const Store: React.FC<IProps> = (props: any) => {
  const { visible, storeList, onCancel, getStroeList } = props
  const [storeId, setStoreId] = useState<any>([])
  /** 确定 */
  const handleSubmit = () => {
    getStroeList(storeId)
  }
  /** 选择商城 */
  const onchange = (value) => {
    setStoreId(value)
  }

  return (
    <Modal
      title={intl.formatMessage({ id: 'detail.purchase.selectMall' })}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Checkbox.Group style={{ width: '100%' }} onChange={onchange}>
        <Row gutter={[8, 24]}>
          <Col span={24}>
            <Tooltip placement="topRight" title={intl.formatMessage({ id: 'detail.purchase.tips2' })}>
              {intl.formatMessage({ id: 'detail.purchase.tips3' })}
              <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
            </Tooltip>
          </Col>
          {storeList.map((item: any) => (
            <Col span={8} key={item.id}>
              <Checkbox value={item.id}>{item.name}</Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    </Modal>
  )
}
export default Store

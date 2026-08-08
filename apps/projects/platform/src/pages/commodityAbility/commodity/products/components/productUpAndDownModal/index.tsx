import { Modal, Form, Row, Col, Radio, Space, Button } from '@linkseeks/ui'
import { useProduct } from '../../services/context'
import { useControl } from '../../services/useControl'
import { useWebIntl } from '@apps/locales'

const ProductUpAndDownModal = () => {
  const { isUp, upDownModal, upForm, isDisabledOKbtn, shopsOption } = useProduct()
  const { handleCancelUp, handleUp } = useControl()
  const translate = useWebIntl()

  const batchChangeShopStatus = (status) => {
    upForm.setFieldsValue(
      shopsOption.reduce((prev, next) => {
        prev[next.shopId] = status
        return prev
      }, {} as any),
    )
  }
  return (
    <Modal
      title={
        isUp ? translate('web.resource.commodity.shangpinshangjia') : translate('web.resource.commodity.shanpinxiajia')
      }
      open={upDownModal}
      onOk={() => upForm.submit()}
      onCancel={handleCancelUp}
      forceRender={true}
      okButtonProps={{ disabled: isDisabledOKbtn }}
      width={600}
    >
      <Form labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} form={upForm} onFinish={handleUp}>
        {/* 优化上下架操作用户体验 */}
        <h4>
          {isUp
            ? translate('web.resource.commodity.qingcaozuoshangjia')
            : translate('web.resource.commodity.qingcaozuoxiajia')}
        </h4>
        <Row>
          {Array.isArray(shopsOption) &&
            shopsOption.map((item, index) => (
              <Col span={12} key={item.shopId}>
                <Form.Item name={item.shopId} label={item.name}>
                  <Radio.Group>
                    <Radio value={true}>{translate('web.resource.commodity.shangjia')}</Radio>
                    <Radio value={false}>{translate('web.resource.commodity.xiajia')}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            ))}
          <Space>
            <Button type="primary" onClick={() => batchChangeShopStatus(true)}>
              {translate('web.resource.commodity.yijianshangjia')}
            </Button>
            <Button type="primary" onClick={() => batchChangeShopStatus(false)}>
              {translate('web.resource.commodity.yijianxiajia')}
            </Button>
          </Space>
        </Row>
      </Form>
    </Modal>
  )
}

export default ProductUpAndDownModal

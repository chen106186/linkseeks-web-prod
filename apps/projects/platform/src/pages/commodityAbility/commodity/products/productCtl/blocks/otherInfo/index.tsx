import { Card, Col, Input, Row } from '@linkseeks/ui'
import { FormLayoutWrapper, FormItemWrapper, CardWrapper } from '@apps/services/commodity'

import { useWebIntl } from '@apps/locales'
import { Validator } from '@apps/validator'

const validate = new Validator()
const OtherInfo = () => {
  const translate = useWebIntl()
  return (
    <CardWrapper id="8" title={translate('web.common.qitaxinxi')}>
      <FormLayoutWrapper>
        <FormItemWrapper
          rules={[validate.validateTextLength({ length: 25 })]}
          label={translate('web.resource.commodity.maitou')}
          name="marks"
        >
          <Input placeholder={translate.formatByteLength({ byteNum: 25, chineseNum: 25 })} />
        </FormItemWrapper>

        <FormItemWrapper
          rules={[validate.validateTextLength({ length: 150 })]}
          label={translate('web.resource.commodity.shouhoufuwu')}
          name="afterService"
        >
          <Input placeholder={translate.formatByteLength({ byteNum: 150, chineseNum: 150 })} />
        </FormItemWrapper>

        <FormItemWrapper
          rules={[validate.validateTextLength({ length: 60 })]}
          label={translate('web.resource.commodity.baozhuangqingdan')}
          name="packing"
        >
          <Input placeholder={translate.formatByteLength({ byteNum: 60, chineseNum: 60 })} />
        </FormItemWrapper>
      </FormLayoutWrapper>
    </CardWrapper>
  )
}

export default OtherInfo

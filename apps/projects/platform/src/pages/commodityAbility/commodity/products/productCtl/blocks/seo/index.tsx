import { Card, Col, Input, Row } from '@linkseeks/ui'
import { FormLayoutWrapper, FormItemWrapper, CardWrapper } from '@apps/services/commodity'
import { useWebIntl } from '@apps/locales'
import { Validator } from '@apps/validator'

const validate = new Validator()
const Seo = () => {
  const translate = useWebIntl()
  return (
    <CardWrapper id="9" title={translate('web.resource.commodity.seoyouhua')}>
      <FormLayoutWrapper>
        <FormItemWrapper
          rules={[validate.validateTextLength({ length: 50 })]}
          label={translate('web.common.title')}
          name="title"
        >
          <Input placeholder={translate.formatByteLength({ byteNum: 50, chineseNum: 50 })} />
        </FormItemWrapper>

        <FormItemWrapper
          rules={[validate.validateTextLength({ length: 200 })]}
          label={translate('web.resource.commodity.miaoshu')}
          name="description"
        >
          <Input placeholder={translate.formatByteLength({ byteNum: 200, chineseNum: 200 })} />
        </FormItemWrapper>

        <FormItemWrapper
          rules={[validate.validateTextLength({ length: 100 })]}
          label={translate('web.resource.commodity.guanjianci')}
          name="keywords"
        >
          <Input placeholder={translate.formatByteLength({ byteNum: 100, chineseNum: 100 })} />
        </FormItemWrapper>
      </FormLayoutWrapper>
    </CardWrapper>
  )
}

export default Seo

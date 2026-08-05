import { useRef } from 'react'
import { Card, Col, Input, Row, RadioGroup, Select, Switch, Form } from '@linkseeks/ui'
import {
  DELIVERY_TYPE_ENUM,
  FREIGHT_TYPE_ENUM,
  PRICE_TYPE_ENUM,
  DELIVERY_TYPE,
  useDeliveryTypeField,
  useCarriageTypeField,
  CARRIAGE_TYPE,
  useIsCrossBorderField,
  IS_TEMPLATE,
  useFreightTemplateField,
  usePriceTypeField,
  FormLayoutWrapper,
  FormItemWrapper,
  CardWrapper,
  useProductForm,
} from '@apps/services/commodity'
import { useEffect, useMemo } from 'react'
import { AddressManageSelectFormItem } from '@apps/components'
import { useLogisticsCompany } from '@apps/services'
import { useWebIntl } from '@apps/locales'
import { useRequestApi } from '@linkseeks/hooks'
import { getLogisticsSelectListFreightTemplate } from '@apps/apis'
import { Validator } from '@apps/validator'

const validate = new Validator()
const LogisticInfo = () => {
  const translate = useWebIntl()
  const deliveryTypeValue = useDeliveryTypeField()
  const freightTypeValue = useCarriageTypeField()
  const isCrossBorderValue = useIsCrossBorderField()
  // const freightTemplateValue = useFreightTemplateField()
  const priceTypeValue = usePriceTypeField()
  const [logisticsCompanyOptions, logisticsCompanyLoading] = useLogisticsCompany()
  const { data: freightTemplateList, loading } = useRequestApi(getLogisticsSelectListFreightTemplate)
  const { formInstance } = useProductForm()
  const pageInitRef = useRef(false)
  const freightTemplateListOption = useMemo(() => {
    if (freightTemplateList) {
      return freightTemplateList.map((v) => ({
        label: v.name,
        value: v.id,
      }))
    } else {
      return []
    }
  }, [freightTemplateList])

  // 卖家承担运费
  const isSellFree = useMemo(() => {
    return freightTypeValue === FREIGHT_TYPE_ENUM.BUYER
  }, [freightTypeValue])
  const deliveryTypeCtl = useMemo(() => {
    return {
      // 无需配送
      noRequired: deliveryTypeValue === 3,
      // 物流
      logistics: deliveryTypeValue === 1,
      // 自提
      pickup: deliveryTypeValue === 2,
    }
  }, [deliveryTypeValue])

  useEffect(() => {
    // 如果切换了运费方式，则要判断是否清空运费模板项
    // 页面初始化不清空数据
    if (!pageInitRef.current && freightTypeValue) {
      pageInitRef.current = true
      return
    }
    if (freightTypeValue === FREIGHT_TYPE_ENUM.BUYER) {
      // 运费方式是买家承担时，需要将使用运费模板置为false，同时运费模板清空
      formInstance.setFieldValue(IS_TEMPLATE, false)
      formInstance.setFieldValue(['logistics', 'templateId'], undefined)
    }
  }, [freightTypeValue])

  // 若商品是跨境电商，则配送方式只能是物流
  useEffect(() => {
    if (isCrossBorderValue) {
      formInstance.setFieldValue(DELIVERY_TYPE, DELIVERY_TYPE_ENUM.LOGISTICS)
    }
  }, [isCrossBorderValue])

  const validateDecimalPlaces = (rule, value, callback) => {
    const decimalRegex = /^\d+(\.\d{1,3})?$/ // 正则表达式，匹配小数点后最多三位数字

    if (value && !decimalRegex.test(value)) {
      callback(translate('web.resource.commodity.xiaoshusanwei'))
    } else {
      callback()
    }
  }

  const validateSendCycle = (rule, value, callback) => {
    if (value) {
      if (!/^\d+$/.test(value)) {
        callback(translate('web.resource.member.qingshuruzhengshu'))
      }
    }

    callback()
  }

  return (
    <CardWrapper id="7" title={translate('web.resource.logistics.wuliuxinxi')}>
      <FormLayoutWrapper>
        <FormItemWrapper
          label={translate('web.resource.commodity.fahuozhouqi')}
          name="sendCycle"
          rules={[{ validator: validateSendCycle }]}
          full
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 4 }}
        >
          <Input
            prefix={translate('web.resource.commodity.xiadanhou')}
            suffix={translate('web.resource.commodity.fahuo')}
            center
          />
        </FormItemWrapper>
        <FormItemWrapper
          label={translate('web.resource.logistics.peisongfangshi')}
          name={DELIVERY_TYPE}
          rules={[
            {
              required: true,
              message: translate.formatFormSelectTip(translate('web.resource.logistics.peisongfangshi')),
            },
          ]}
          initialValue={1}
          full
          labelCol={{ span: 3 }}
        >
          <RadioGroup
            options={[
              { label: translate('web.resource.commodity.wuliuleixing1'), value: DELIVERY_TYPE_ENUM.LOGISTICS },
              {
                label: translate('web.resource.commodity.wuliuleixing2'),
                value: DELIVERY_TYPE_ENUM.SELF_PICKUP,
                disabled: isCrossBorderValue,
              },
              {
                label: translate('web.resource.commodity.wuliuleixing3'),
                value: DELIVERY_TYPE_ENUM.LOGISTICS_SELF_PICKUP,
                disabled: isCrossBorderValue,
              },
              {
                label: translate('web.resource.logistics.wuliu2'),
                value: DELIVERY_TYPE_ENUM.NOT_SEND,
                disabled: isCrossBorderValue,
              },
            ]}
          />
        </FormItemWrapper>
        <FormItemWrapper
          display={!(deliveryTypeCtl.noRequired || deliveryTypeCtl.pickup)}
          label={translate('web.resource.commodity.yunfeifangshi')}
          name={CARRIAGE_TYPE}
          initialValue={1}
          rules={[
            {
              required: true,
              message: translate.formatFormSelectTip(translate('web.resource.commodity.yunfeifangshi')),
            },
          ]}
        >
          <RadioGroup
            options={[
              { label: translate('web.resource.commodity.maijiachendan'), value: FREIGHT_TYPE_ENUM.SELLER },
              {
                label: translate('web.resource.commodity.maijiachendanyunfei2'),
                value: FREIGHT_TYPE_ENUM.BUYER,
                disabled: priceTypeValue === PRICE_TYPE_ENUM.POINT_GOODS_PRICE,
              },
            ]}
          />
        </FormItemWrapper>

        <FormItemWrapper
          label={translate('web.resource.commodity.yunfeimuban')}
          name={['logistics', 'templateId']}
          // display={!!freightTemplateValue}
          display={isSellFree}
          rules={[
            {
              required: true,
              message: translate.formatFormSelectTip(translate('web.resource.commodity.yunfeimuban')),
            },
          ]}
        >
          <Select
            options={freightTemplateListOption}
            loading={loading}
            placeholder={translate.formatFormSelectTip(translate('web.resource.commodity.yunfeimuban'))}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
          />
        </FormItemWrapper>
        <FormItemWrapper
          rules={[
            {
              required: true,
              message: translate.formatFormInputTip(translate('web.resource.commodity.zhongliang')),
            },
            validate.validateDecimal({ length: 3 }),
            validate.validateNumberRange({ min: 0, max: 10000 }),
          ]}
          label={translate('web.resource.commodity.zhongliang')}
          name={['logistics', 'weight']}
          display={!(deliveryTypeCtl.noRequired || deliveryTypeCtl.pickup)}
        >
          <Input suffix="KG" />
        </FormItemWrapper>
        {/* <FormItemWrapper
          label={translate('web.resource.commodity.shifoushiyongyunfeimuban')}
          name={IS_TEMPLATE}
          valuePropName="checked"
          display={isSellFree}
        >
          <Switch />
        </FormItemWrapper> */}

        <FormItemWrapper
          label={translate('web.resource.commodity.fahuo_zitidizhi')}
          // 这里是前端约定的字段，实际后端只需要sendAddressId
          name={['logistics', 'sendAddressInfo']}
          display={!deliveryTypeCtl.noRequired}
          rules={[
            {
              required: true,
              message: translate.formatFormSelectTip(translate('web.common.address')),
            },
          ]}
        >
          <AddressManageSelectFormItem />
        </FormItemWrapper>

        <FormItemWrapper
          label={translate('web.resource.commodity.wuliugongsi')}
          name={['logistics', 'companyId']}
          display={!(deliveryTypeCtl.noRequired || deliveryTypeCtl.pickup)}
          rules={[
            {
              required: true,
              message: translate.formatFormSelectTip(translate('web.resource.commodity.wuliugongsi')),
            },
          ]}
        >
          <Select
            placeholder={translate.formatFormSelectTip(translate('web.resource.commodity.wuliugongsi'))}
            options={logisticsCompanyOptions}
            loading={logisticsCompanyLoading}
            showSearch
            optionFilterProp="label"
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
          />
        </FormItemWrapper>
        <Form.Item name={['logistics', 'id']} hidden></Form.Item>
      </FormLayoutWrapper>
    </CardWrapper>
  )
}

export default LogisticInfo

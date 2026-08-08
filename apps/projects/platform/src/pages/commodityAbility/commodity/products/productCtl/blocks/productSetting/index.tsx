import { Card, Checkbox, Col, Input, Radio, Switch, Select, Form, Space } from '@linkseeks/ui'
import { FormTags, UploadFile, SingleCardUpload } from '@apps/components'
import { getManageContentNoticePage } from '@apps/apis'
import {
  COMMDITY_TYPE_TEXTS,
  PRICE_TYPE_ENUM,
  FormItemWrapper,
  CardWrapper,
  FormLayoutWrapper,
  useFormField,
  useProductForm,
  useIsCrossBorderField,
  IS_CROSS_BORDER,
  usePriceTypeField,
  PRICE_TYPE,
  COMMODITY_TYPE,
  COMMODITY_TYPE_ENUM,
  useTypeField,
  SUB_UNIT_ID,
} from '@apps/services/commodity'
import { useCNUnit } from '@apps/services'
import { useEffect, useMemo, useState } from 'react'

import { useWebIntl } from '@apps/locales'
import { Validator } from '@apps/validator'
const validate = new Validator()
const ProductSetting = () => {
  const translate = useWebIntl()
  const { checkDisabled, extraDataRef } = useProductForm()
  const [unitData, unitLoading] = useCNUnit()
  const [rylx] = useState([
    { label: '非认养', value: 0 },
    { label: '第三方溯源', value: 1 },
    { label: '平台溯源', value: 2 },
  ])
  const [ryxy, setRyxy] = useState([])

  const productTypeValue = useTypeField()
  // 跨境商品
  const isCrossBorderValue = useIsCrossBorderField()
  // 商品定价
  const productPriceValue = usePriceTypeField()

  // 不参与接口传递
  const [isTaxValue] = useFormField('isTax')
  const [adoptionTypeValue] = useFormField('adoptionType')
  const formInstance = Form.useFormInstance()

  //  --------- 商品类型联动 ---------
  const disabledCross = useMemo(() => {
    // 若选择上游供应商品， 则需要禁用掉跨境电商商品的选择
    return productTypeValue === COMMODITY_TYPE_ENUM.SUPPER_MEMBER
  }, [productTypeValue])

  // 是否禁用积分商品选择
  const disabledPointPrice = useMemo(() => {
    return isCrossBorderValue || productTypeValue === COMMODITY_TYPE_ENUM.SUPPER_MEMBER
  }, [isCrossBorderValue, productTypeValue])
  // 商品定价是否是现货价格
  const isSpots = useMemo(() => {
    return productPriceValue === PRICE_TYPE_ENUM.SPOT_PRICE
  }, [productPriceValue, formInstance])

  useEffect(() => {
    // 若选择上游供应商品，则跨境商品只能选择否
    disabledCross && formInstance.setFieldValue(IS_CROSS_BORDER, false)
  }, [disabledCross])
  useEffect(() => {
    getManageContentNoticePage({ current: '1', pageSize: '10', columnType: '7', status: '2' }).then(
      ({ data: { data } }) => {
        setRyxy(
          data.map((item) => {
            return { label: item.title, value: item.id }
          }),
        )
      },
    )
  }, [])
  //  --------- 跨境商品联动 ---------
  useEffect(() => {
    /**
     * 若跨境商品 选择为 是, 则有如下限制
     * 商品定价只能选现货价格、赠品两种
     * 配送方式只能选物流
     */
    if (isCrossBorderValue) {
      if (
        formInstance.getFieldValue(PRICE_TYPE) === PRICE_TYPE_ENUM.INQUIRY_PRICE ||
        formInstance.getFieldValue(PRICE_TYPE) === PRICE_TYPE_ENUM.POINT_GOODS_PRICE
      ) {
        // 如果已经选了除现货价格和赠品之外的选项时，需要归位成现货价格
        formInstance.setFieldValue(PRICE_TYPE, PRICE_TYPE_ENUM.SPOT_PRICE)
      }

      // @todo 配送方式只能选物流，未完成
    }
  }, [isCrossBorderValue])
  return (
    <CardWrapper id="2" title={translate('web.resource.commodity.shanpinshezhi')}>
      <FormLayoutWrapper>
        <FormItemWrapper required hidden name="unitName" label={translate('web.resource.commodity.jiliangdanwei')}>
          <Input disabled />
        </FormItemWrapper>
        <FormItemWrapper
          label={translate('web.resource.commodity.jiliangdanwei')}
          tooltip={translate('web.resource.commodity.jiliangdanweitishi')}
          name="unitId"
          rules={[
            {
              message: translate.formatFormSelectTip(translate('web.resource.commodity.jiliangdanwei')),
              required: true,
            },
          ]}
        >
          <Select
            placeholder={translate('web.resource.commodity.jiliangdanwei')}
            options={unitData}
            loading={unitLoading}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
            onSelect={(value, option) => {
              extraDataRef.current.unitName = String(option.label)
            }}
          />
        </FormItemWrapper>
        <FormItemWrapper
          label={translate('web.resource.commodity.jiliangfudanwei')}
          tooltip={translate('web.resource.commodity.jiliangfudanweitishi')}
          name={SUB_UNIT_ID}
        >
          <Select
            placeholder={translate('web.resource.commodity.jiliangfudanwei')}
            options={unitData}
            loading={unitLoading}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
            allowClear
          />
        </FormItemWrapper>

        <FormItemWrapper
          label={translate('web.resource.commodity.zuixiaoqiding')}
          tooltip={translate('web.resource.commodity.zuixiaoqidingtishi')}
          name="minOrder"
          rules={[
            { required: true },
            validate.validateDecimal({ length: 3 }),
            validate.validateNumberRange({ min: 0, max: 100000 }),
          ]}
        >
          <Input type="number" />
        </FormItemWrapper>
        <FormItemWrapper
          label={translate('web.resource.commodity.shanpinleixing')}
          tooltip={translate('web.resource.commodity.shanpinleixingtishi')}
          name={COMMODITY_TYPE}
          rules={[{ required: true }]}
          initialValue={COMMODITY_TYPE_ENUM.SELF}
        >
          <Radio.Group>
            <Radio value={COMMODITY_TYPE_ENUM.SELF}>{COMMDITY_TYPE_TEXTS[COMMODITY_TYPE_ENUM.SELF]}</Radio>
            <Radio value={COMMODITY_TYPE_ENUM.SUPPER_MEMBER}>
              {COMMDITY_TYPE_TEXTS[COMMODITY_TYPE_ENUM.SUPPER_MEMBER]}
            </Radio>
          </Radio.Group>
        </FormItemWrapper>
        <FormItemWrapper
          label={translate('web.resource.commodity.shanpinleixing')}
          tooltip={translate('web.resource.commodity.shanpinleixingtishi')}
          name={COMMODITY_TYPE}
          rules={[{ required: true }]}
          initialValue={COMMODITY_TYPE_ENUM.SELF}
        >
          <Radio.Group>
            <Radio value={COMMODITY_TYPE_ENUM.SELF}>{COMMDITY_TYPE_TEXTS[COMMODITY_TYPE_ENUM.SELF]}</Radio>
            <Radio value={COMMODITY_TYPE_ENUM.SUPPER_MEMBER}>
              {COMMDITY_TYPE_TEXTS[COMMODITY_TYPE_ENUM.SUPPER_MEMBER]}
            </Radio>
          </Radio.Group>
        </FormItemWrapper>

        <FormItemWrapper
          label={translate('web.resource.commodity.kuajingdianshan')}
          tooltip={translate('web.resource.commodity.kuajingdianshantishi')}
          name={IS_CROSS_BORDER}
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={false}
        >
          <Radio.Group disabled={disabledCross}>
            <Radio value={true}>{translate('web.common.shi')}</Radio>
            <Radio value={false}>{translate('web.common.fou')}</Radio>
          </Radio.Group>
        </FormItemWrapper>

        <FormItemWrapper
          label={translate('web.resource.commodity.shanpindingjia')}
          tooltip={translate('web.resource.commodity.shanpindingjiatishi')}
          name={PRICE_TYPE}
          rules={[{ required: true }]}
          initialValue={PRICE_TYPE_ENUM.SPOT_PRICE}
          wrapperCol={{
            span: 16,
          }}
        >
          <Radio.Group disabled={checkDisabled}>
            <Radio value={PRICE_TYPE_ENUM.SPOT_PRICE}>{translate('web.resource.commodity.xianhuojiage')}</Radio>
            <Radio value={PRICE_TYPE_ENUM.INQUIRY_PRICE} disabled={isCrossBorderValue}>
              {translate('web.resource.commodity.jiagexuyaoxunjia')}
            </Radio>
            <Radio value={PRICE_TYPE_ENUM.POINT_GOODS_PRICE} disabled={disabledPointPrice}>
              {translate('web.resource.commodity.jifenduihuanshanping')}
            </Radio>
            <Radio value={PRICE_TYPE_ENUM.GIFT_PRICE}>{translate('web.resource.commodity.zengpin')}</Radio>
          </Radio.Group>
        </FormItemWrapper>

        <FormItemWrapper
          label={translate('web.resource.payment.huiyuanzhekou')}
          tooltip={translate('web.resource.commodity.huiyuanzhekoutishi')}
          name="isMemberPrice"
          valuePropName="checked"
          dependencies={[PRICE_TYPE]}
          hidden={!isSpots}
        >
          <Checkbox>{translate('web.resource.commodity.yunxuhuiyuanzhekoujia')}</Checkbox>
        </FormItemWrapper>

        <FormItemWrapper label={translate('web.resource.commodity.shifouhanshui')}>
          <Space size={24}>
            <FormItemWrapper name="isTax" noStyle initialValue={true} valuePropName="checked">
              <Switch />
            </FormItemWrapper>

            {isTaxValue && (
              <FormItemWrapper
                name="taxRate"
                noStyle
                required
                rules={[
                  validate.validateRequired({
                    message: translate.formatFormInputTip(translate('web.resource.payment.shuilv')),
                  }),
                  validate.validateDecimal({ length: 2 }),
                  validate.validateNumber({ min: 0 }),
                ]}
              >
                <Input
                  placeholder={translate('web.resource.payment.shuilv')}
                  style={{ width: 300 }}
                  addonAfter={'%'}
                  type="number"
                />
              </FormItemWrapper>
            )}
          </Space>
        </FormItemWrapper>
        <FormItemWrapper
          label="认领类型"
          name="adoptionType"
          required
          rules={[
            validate.validateRequired({
              message: '请选择认领类型',
            }),
          ]}
        >
          <Select
            placeholder="请选择认领类型"
            options={rylx}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
          />
        </FormItemWrapper>
        <FormItemWrapper
          label="认养合作方"
          name="adoptionPartner"
          required={[1, 2].includes(adoptionTypeValue)}
          rules={
            [1, 2].includes(adoptionTypeValue)
              ? [
                  validate.validateRequired({
                    message: '请输入认养合作方',
                  }),
                ]
              : []
          }
        >
          <Input placeholder="请输入认养合作方" style={{ width: 300 }} />
        </FormItemWrapper>
        <FormItemWrapper label="我的权益链接" name="adoptionTraceUrl">
          <Input placeholder="请输入认养溯源链接" style={{ width: 300 }} />
        </FormItemWrapper>
        <FormItemWrapper label="认养证书图片" name="adoptionCertificatePic">
          <SingleCardUpload maxSize={2} />
        </FormItemWrapper>
        <FormItemWrapper label="认养协议" name="adoptionAgreementId">
          <Select
            placeholder="请选择认养协议"
            options={ryxy}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
          />
        </FormItemWrapper>
      </FormLayoutWrapper>
    </CardWrapper>
  )
}

export default ProductSetting

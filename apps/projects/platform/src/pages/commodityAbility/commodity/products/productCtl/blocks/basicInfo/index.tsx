import { Button, Cascader, Col, Form, Input, Row, Select } from '@linkseeks/ui'
import { FormTags, UploadFile, SingleCardUpload } from '@apps/components'
import { useProductBrand, useProductCategoryTree, useSalesAreaTemplate } from '@apps/services'
import { useWebIntl } from '@apps/locales'
import { Validator } from '@apps/validator'
import {
  COMMODITY_CATEGORY_TYPE_MAPS,
  useProductForm,
  COMMODITY_PIC,
  BRAND_ID,
  CUSTOMER_CATEGORY_ID,
  FormLayoutWrapper,
  FormItemWrapper,
  CardWrapper,
} from '@apps/services/commodity'
import { useEffect } from 'react'
const validate = new Validator()
const BasicInfo = () => {
  const [categoryData, categoryLoading] = useProductCategoryTree()
  const [brandData, brandLoading] = useProductBrand()
  const [salesAreaTemplate, salesAreaTemplateLoading] = useSalesAreaTemplate()
  const {
    disabled,
    checkDisabled,
    commodityType,
    noCheckDisabled,
    extraDataRef,
    productData,
    codeDisabled,
    isSingleSpecs,
    setSpecsSettingDataSource,
  } = useProductForm()
  const productName = Form.useWatch('name')
  const translate = useWebIntl()

  // useEffect(() => {
  //   if (isSingleSpecs) {
  //     // 单规格商品下，需要联动规格设置中的商品名称
  //     setSpecsSettingDataSource((dataSource) => {
  //       if (dataSource && dataSource.length > 0) {
  //         dataSource[0]?.setProductName(productName)
  //       }
  //       return [...dataSource]
  //     })
  //   }
  // }, [productName, isSingleSpecs])

  return (
    <CardWrapper id="1" title={translate('web.common.jibenxinxi')}>
      <FormLayoutWrapper>
        {productData?.type === 2 && productData?.customerCategoryFullName ? (
          <>
            <FormItemWrapper
              label={translate('web.resource.commodity.shanpinpinlei')}
              name={CUSTOMER_CATEGORY_ID}
              required
              hidden
              rules={[
                validate.validateRequired({
                  message: translate.formatFormSelectTip(translate('web.resource.commodity.shanpinpinlei')),
                }),
              ]}
            >
              <Input disabled />
            </FormItemWrapper>
            <FormItemWrapper
              label={translate('web.resource.commodity.shanpinpinlei')}
              name="customerCategoryFullName"
              required
              rules={[
                validate.validateRequired({
                  message: translate.formatFormSelectTip(translate('web.resource.commodity.shanpinpinlei')),
                }),
              ]}
            >
              <Input disabled />
            </FormItemWrapper>
          </>
        ) : (
          <FormItemWrapper
            label={translate('web.resource.commodity.shanpinpinlei')}
            name={CUSTOMER_CATEGORY_ID}
            required
            rules={[
              validate.validateRequired({
                message: translate.formatFormSelectTip(translate('web.resource.commodity.shanpinpinlei')),
              }),
            ]}
          >
            <Cascader
              fieldNames={{ label: 'name', value: 'id', children: 'children' }}
              options={categoryData}
              loading={categoryLoading}
              placeholder={translate.formatFormSelectTip(translate('web.resource.commodity.pinleileixing'))}
              disabled={noCheckDisabled}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              displayRender={(label, selectOption) => {
                extraDataRef.current.categoryFullName = label.join('/')
                return label.join('/')
              }}
            />
          </FormItemWrapper>
        )}
        <FormItemWrapper
          label={translate('web.resource.commodity.name')}
          tooltip={translate('web.resource.commodity.shanpinminchengtishi')}
          name="name"
          required
          rules={[
            validate.validateRequired({
              message: translate.formatFormInputTip(translate('web.resource.commodity.name')),
            }),
            validate.validateTextLength({ length: 45 }),
          ]}
        >
          <Input placeholder={translate('web.resource.commodity.name')} />
        </FormItemWrapper>
        <FormItemWrapper label={translate('web.resource.commodity.pinleileixing')} name="type">
          <span>{COMMODITY_CATEGORY_TYPE_MAPS[commodityType]}</span>
        </FormItemWrapper>
        <FormItemWrapper
          label={translate('web.resource.commodity.shanpinbiaoyu')}
          name="slogan"
          tooltip={translate('web.resource.commodity.shanpinbiaoyutishi')}
          rules={[validate.validateTextLength({ length: 45 })]}
        >
          <Input placeholder={translate('web.resource.commodity.shanpinbiaoyu')} />
        </FormItemWrapper>
        <FormItemWrapper label={translate('web.resource.commodity.shanpinpinpai')} name={BRAND_ID}>
          <Select
            placeholder={translate('web.resource.commodity.shanpinpinpai')}
            options={brandData}
            loading={brandLoading}
            fieldNames={{ label: 'name', value: 'id' }}
            disabled={false}
            allowClear
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
            onSelect={(value, option) => {
              extraDataRef.current.brandName = String(option.name) || ''
            }}
          />
        </FormItemWrapper>
        <FormItemWrapper
          label={translate('web.resource.commodity.shanpinmaidian')}
          tooltip={translate('web.resource.commodity.shanpinmaidiantishi')}
          name="sellingPoint"
        >
          <FormTags maxLength={8} maxTags={3} disabled={disabled} />
        </FormItemWrapper>
        <FormItemWrapper noStyle>
          <FormItemWrapper
            label={translate('web.resource.commodity.xiaoshouquyu')}
            tooltip={translate('web.resource.commodity.xiaoshouquyutishi')}
            name="salesAreaTemplateId"
          >
            <Select
              placeholder={translate.formatFormSelectTip(translate('web.resource.commodity.xiaoshouquyu'))}
              options={salesAreaTemplate}
              loading={salesAreaTemplateLoading}
              fieldNames={{ label: 'name', value: 'id' }}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              allowClear
            />
          </FormItemWrapper>
          {/* <Row>
						<Col offset={6}>
							{ areaShowList && areaShowList.length > 0 && areaShowList.join(';') }
						</Col>
					</Row> */}
        </FormItemWrapper>
        <FormItemWrapper
          label={translate('web.resource.commodity.shangpinbianma')}
          tooltip={translate('web.resource.commodity.skucodetip')}
          name="code"
          rules={[
            {
              pattern: /^[A-Za-z0-9_\-]{5,30}$/,
              message: translate('web.resource.commodity.skucodetipmessage'),
            },
          ]}
        >
          <Input
            disabled={codeDisabled}
            maxLength={30}
            placeholder={translate('web.resource.commodity.shangpinbianma')}
          />
        </FormItemWrapper>
        <FormItemWrapper
          label={translate('web.resource.commodity.shanpinzhutu')}
          name={COMMODITY_PIC}
          required
          rules={[
            validate.validateRequired({
              message: translate.formatFormSelectTip(translate('web.resource.commodity.shanpinzhutu')),
            }),
          ]}
        >
          <SingleCardUpload maxSize={2} />
        </FormItemWrapper>
        <FormItemWrapper hidden name="upperCommodityId">
          <Input />
        </FormItemWrapper>
        <FormItemWrapper hidden name="upperMemberId">
          <Input />
        </FormItemWrapper>
        <FormItemWrapper hidden name="upperMemberName">
          <Input />
        </FormItemWrapper>
        <FormItemWrapper hidden name="upperMemberRoleId">
          <Input />
        </FormItemWrapper>
        <FormItemWrapper hidden name="upperMemberRoleName">
          <Input />
        </FormItemWrapper>
      </FormLayoutWrapper>
    </CardWrapper>
  )
}

export default BasicInfo

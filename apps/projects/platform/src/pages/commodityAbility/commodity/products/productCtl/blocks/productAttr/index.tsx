import {
  FormLayoutWrapper,
  SubTitleWrapper,
  useProductForm,
  CardWrapper,
  useCustomerCategoryIdField,
  AttributeDisplayType,
  AttributeModel,
} from '@apps/services/commodity'
import { useEffect, useMemo, useRef } from 'react'
import AttrModal from '../../components/AttributeModal'
import InputFormItem from './InputFormItem'
import AttributeSelectFormItem from '../../components/AttributeSelectFormItem'
import { useWebIntl } from '@apps/locales'

const ProductAttr = () => {
  const translate = useWebIntl()
  const categoryId = useCustomerCategoryIdField()
  const {
    productOriginalData,
    handleCheckPass,
    getCategoryRun,
    getCategoryRefresh,
    categoryAttributeList,
    specsAttributeList,
    checkDisabled,
  } = useProductForm()
  const attrModalRef = useRef<any>({})
  useEffect(() => {
    // 如果是审核通过状态下，则禁用品类，并且sku数据全部从商品详情中获取
    if (categoryId && !checkDisabled) {
      getCategoryRun({ id: categoryId[categoryId.length - 1] })
    }
  }, [categoryId, checkDisabled])

  /**
   * 渲染属性列表
   * 根据不同类型，单选/多选/输入，渲染不一样的组件
   * 内部通过antd的 Form组件 name属性可嵌套，进行了三种类型的筛选
   * 最后需要通过数据转换处理，将这一块的数据转换成后端想要的形式
   * @param attributeModels 属性列表
   * @param isPrice 是否是规格属性
   */
  const renderAttrList = (attributeModels: AttributeModel[], isPrice: boolean = true) => {
    if (attributeModels.length === 0) {
      return null
    }
    return attributeModels.map((attributeModel) => {
      const { id, options = [], name, required, extraProps, type } = attributeModel
      if (attributeModel.displayType === AttributeDisplayType.SINGLE) {
        return (
          <AttributeSelectFormItem
            key={id}
            options={options}
            attrModalRef={attrModalRef}
            name={name}
            required={required}
            id={id}
            type={type}
            isPrice={isPrice}
            {...extraProps}
          />
        )
      }

      if (attributeModel.displayType === AttributeDisplayType.MULTIPLE) {
        return (
          <AttributeSelectFormItem
            key={id}
            options={options}
            attrModalRef={attrModalRef}
            name={name}
            id={id}
            required={required}
            isPrice={isPrice}
            {...extraProps}
          />
        )
      }

      if (attributeModel.displayType === AttributeDisplayType.TEXT) {
        return <InputFormItem key={id} name={name} id={id} isPrice={isPrice} {...extraProps} />
      }
    })
  }
  return (
    <CardWrapper id="3" title={translate('web.resource.commodity.shanpinshuxing')}>
      <SubTitleWrapper title={translate('web.resource.commodity.leimushuxing')}>
        <FormLayoutWrapper>{renderAttrList(categoryAttributeList, false)}</FormLayoutWrapper>
      </SubTitleWrapper>
      <SubTitleWrapper title={translate('web.resource.commodity.guigeshuxing')}>
        <FormLayoutWrapper>{renderAttrList(specsAttributeList)}</FormLayoutWrapper>
      </SubTitleWrapper>
      <AttrModal
        ref={attrModalRef}
        refresh={() => {
          if (categoryId && !checkDisabled) {
            getCategoryRefresh()
          } else {
            productOriginalData && handleCheckPass(productOriginalData)
          }
        }}
      />
    </CardWrapper>
  )
}

export default ProductAttr

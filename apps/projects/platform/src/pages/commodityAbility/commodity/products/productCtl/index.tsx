import { PageHeaderWrapper } from '@apps/components'
import BasicInfo from './blocks/basicInfo'
import Seo from './blocks/seo'
import { Button, Form, FormContextProvider, Space } from '@linkseeks/ui'
import OtherInfo from './blocks/otherInfo'
import LogisticInfo from './blocks/logisticInfo'
import ProductDetail from './blocks/productDetail'
import ProductAttr from './blocks/productAttr'
import ProductSetting from './blocks/productSetting'
import SpecsSetting from './blocks/specsSetting'
import CameraBinding from './blocks/cameraBinding'
import {
  postProductCommodityDraftSaveOrUpdateCommodityDraft,
  postProductCommoditySaveOrUpdateCommodity,
} from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useWebIntl } from '@apps/locales'
import { useHistory } from '@linkseeks/router-core'
import {
  useTabLink,
  submitTransform,
  ProductFormProvider,
  useProductForm,
  COMMODITY_PAGE_STATUS,
} from '@apps/services/commodity'

/**
 * 新增，编辑商品页面
 */
const ProductCtlWrapper = () => {
  const { id, isDraft } = usePageStatus()
  const state = useProductForm()
  const translate = useWebIntl()
  const history = useHistory()
  const { tabItems } = useTabLink()
  const { run, loading } = useRequestApi(postProductCommoditySaveOrUpdateCommodity, {
    manual: true,
    onSuccess({ code }) {
      // 保存成功后回退到列表页
      if (code === 1000) {
        history.replace('/commodityAbility/commodity/products')
      }
    },
  })
  const { run: runDraft, loading: loadingDraft } = useRequestApi(postProductCommodityDraftSaveOrUpdateCommodityDraft, {
    manual: true,
    onSuccess: ({ code }) => {
      // 保存成功后回退到列表页
      if (code === 1000) {
        history.replace('/commodityAbility/commodity/products')
      }
    },
  })
  const { formInstance, pageLoading, disabled, pageType } = state

  const getFormValue = async (validate = true, isDraft = false) => {
    const values = validate ? await formInstance.validateFields() : formInstance.getFieldsValue()
    // 新增/修改商品时，获取转化后的参数
    const dispatchData = await submitTransform(values, state, isDraft)

    return dispatchData
  }

  const handleSubmit = () => {
    formInstance.submit()
  }

  /**
   * 点击保存按钮时会触发
   */
  const handleFinish = async (values: any) => {
    // 新增/修改商品时，获取转化后的参数
    const dispatchData = await submitTransform(values, state)
    if (isDraft) {
      run(dispatchData)
    } else {
      run(id ? { ...dispatchData, id } : dispatchData)
    }
  }

  /**
   * 点击保存并直接提交审核
   */
  const handleCheck = async () => {
    const dispatchData = await getFormValue()
    if (isDraft) {
      run({
        ...dispatchData,
        isApplyCheck: true,
      })
    } else {
      run({
        ...dispatchData,
        id,
        isApplyCheck: true,
      })
    }
  }

  const handleSaveDraft = async () => {
    const dispatchData = await getFormValue(false, true)
    const draft: any = dispatchData
    const isDraft = pageType === COMMODITY_PAGE_STATUS.DRAFT

    let params: any = {
      draft,
    }
    if (isDraft) {
      if (id) {
        params.id = id
      }
    }
    runDraft(params)
  }
  const extraButton = (
    <Space>
      <Button onClick={handleCheck}>{translate('web.resource.commodity.zhijieshenhe')}</Button>
      <Button type="primary" onClick={handleSubmit} loading={loading}>
        {translate('web.common.save')}
      </Button>
      <Button onClick={handleSaveDraft}>{translate('web.resource.commodity.baocuncaogao')}</Button>
    </Space>
  )
  return (
    <PageHeaderWrapper backDom items={tabItems} extra={disabled ? null : extraButton} loading={pageLoading}>
      <FormContextProvider preview={disabled}>
        <Form
          form={formInstance}
          onFinish={handleFinish}
          labelAlign="left"
          validateTrigger="onChange"
          wrapperCol={{ span: 14 }}
          labelCol={{ span: 6 }}
          disabled={disabled}
        >
          <BasicInfo />
          <ProductSetting />
          <ProductAttr />
          <SpecsSetting />
          <CameraBinding />
          <ProductDetail />
          <LogisticInfo />
          <OtherInfo />
          <Seo />
        </Form>
      </FormContextProvider>
    </PageHeaderWrapper>
  )
}

export default ({ type }) => (
  <ProductFormProvider type={type}>
    <ProductCtlWrapper />
  </ProductFormProvider>
)

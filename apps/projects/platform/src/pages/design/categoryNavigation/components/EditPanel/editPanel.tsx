import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  changeProps,
  clearSelectedStatus,
  PageConfigType,
  SelectedInfoType,
  StateType,
  STATE_PROPS,
} from '@apps/design-react'
import { useSelector } from '@apps/design-react'
import cs from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import { usePrevious, useToggle } from '@linkseeks/hooks'
import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Button, Space, Spin, message } from 'antd'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import styles from './editPanel.less'
import {
  tabTitleSchema,
  secondaryTabSchema,
  blockSchema,
  flashSaleSchema,
  saleRankSchema,
  branchSchema,
  productListSchema,
  commoditySchema,
} from './schema'
import FormilyProduct from '../FormilyProduct'
import FormilyRadio from '../FormilyRadio'
import FormilyBrand from '../FormilyBrand'
import { context } from '../../common/context/context'
import FormilyCommodity from '../FormilyCommodity'
import NiceForm from '@/components/NiceForm'
import FormilyUpload from '@/components/UploadFiles/FormilyUploadFiles'

import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { authService } from '@apps/services'
import { useFilterSameOption } from '../../common/hooks/useFilterSameOption'
import {
  getProductCommodityTemplateGetFirstCategoryListByMemberId,
  getProductCommodityTemplateGetSecondCategoryListByMemberId,
} from '@apps/apis'

type SettingPanelType = {
  selectedInfo: SelectedInfoType
  pageConfig: PageConfigType
  activeKey?: string
  domKey?: string
}

const ComponentSchema = {
  // tabItem: tabTitleSchema,
  secondaryItem: secondaryTabSchema,
  flashSale: blockSchema,
  flashSaleItem: flashSaleSchema,
  saleRanking: blockSchema,
  saleRankingItem: saleRankSchema,
  brandItem: branchSchema,
  suggestProduct: productListSchema,
  suggestProductItem: commoditySchema,
}

const formActions = createFormActions()
const { onFieldInputChange$ } = FormEffectHooks

const EditPanel = () => {
  const userAuth = authService.getAuth()
  const sameKeyState = useFilterSameOption()
  const fixtureContext = useContext(context)

  const isSelfMall = useMemo(() => fixtureContext.isSelfMall, [fixtureContext.isSelfMall])
  const { selectedInfo, pageConfig, activeKey, domKey } = useSelector<
    SettingPanelType,
    STATE_PROPS | 'activeKey' | 'domKey'
  >(['selectedInfo', 'pageConfig', 'activeKey', 'domKey'])
  const [visible, setVisible] = useToggle(true)
  const [schema, setSchema] = useState<any>(null)
  const [formValue, setFormValue] = useState({})
  /** 精选商品type */
  const [type, setType] = useState<number>(0)
  const intl = useIntl()
  /**
   * 当每次点击selectInfo 时，都把selectInfo.props 映射到formily 的value 上
   * 但当一级类型没有被选择的时候，那么必须选择一级导航类型
   */

  useEffect(() => {
    if (selectedInfo === null) {
      setVisible(false)
      return
    }
    if (activeKey === null && selectedInfo !== null) {
      message.info(intl.formatMessage({ id: 'editor.category.select.navtype.required' }))
      const primaryTabProps = pageConfig[domKey!].props
      setFormValue({
        primary: primaryTabProps?.id,
        title: primaryTabProps?.name,
      })
      setSchema(tabTitleSchema)
      setVisible(true)
      return
    }
    const componentType: keyof typeof ComponentSchema = (selectedInfo as any)?.otherProps?.type
    const targetSchema = ComponentSchema[componentType] || null

    if (targetSchema) {
      /** 这里需要处理一下FormVlaue */
      const tempFormValue = {
        tabItem: {
          primary: selectedInfo?.props?.id,
          title: selectedInfo?.props?.title,
        },
        secondaryItem: {
          secondary: selectedInfo?.props?.id,
          title: selectedInfo?.props?.name,
          icon: [{ name: selectedInfo?.props?.name, url: selectedInfo?.props?.icon }].filter(
            (_item) => _item.url !== '',
          ),
        },
        flashSale: {
          blockTitle: selectedInfo?.props.title,
        },
        flashSaleItem: {
          product: {
            ...selectedInfo.props,
          },
        },
        saleRanking: {
          blockTitle: selectedInfo?.props.title,
        },
        saleRankingItem: {
          rankProduct: {
            ...selectedInfo.props,
          },
          sale: selectedInfo.props.sale,
        },
        brandItem: {
          brand: {
            id: selectedInfo.props.id,
            name: selectedInfo.props.name,
            icon: selectedInfo.props.logoUrl,
          },
        },
        suggestProduct: {
          type: selectedInfo?.props?.type || 1,
          num: selectedInfo?.props?.num || 50,
          title: selectedInfo.props.title,
        },
        suggestProductItem: {
          commodity: {
            ...selectedInfo.props,
            label: selectedInfo.props.label,
          },
        },
      }
      if (type === 0 && componentType.includes('suggestProduct')) {
        setSchema(productListSchema)
        setVisible(true)
        message.info(intl.formatMessage({ id: 'editor.category.select.showtype.required' }))
        return
      }

      if (type !== 3 && componentType === 'suggestProductItem') {
        message.info(intl.formatMessage({ id: 'editor.category.tip.type' }))
        return
      }
      setFormValue(tempFormValue[componentType])
      setSchema(targetSchema)
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [selectedInfo, activeKey, domKey])

  /** 这里直接筛选出 domKey-${5} 下的type */
  useEffect(() => {
    if (pageConfig?.[`${domKey}-5`]?.props?.type) {
      setType(pageConfig?.[`${domKey}-5`]?.props?.type)
    }
  }, [domKey])

  const handleOnClose = () => {
    clearSelectedStatus()
    setVisible(false)
  }

  const className = cs(styles.editPanel, {
    [styles.hide]: !visible,
    [styles.show]: visible,
  })

  const renderUploadChild = (value) => {
    const target = value[0]
    return (
      <div className={styles.image}>
        <div className={styles.uploadImage}>{intl.formatMessage({ id: 'editor.form.btn.upload.img' })}</div>
        <div className={styles.imageIcon}>
          <Spin spinning={target?.status === 'uploading'}>
            {target?.url ? <img src={target?.url} style={{ width: '100%', height: '96px' }} /> : <PlusCircleOutlined />}
          </Spin>
        </div>
      </div>
    )
  }

  const handleSubmit = (values) => {
    /** 如果是tab 类型修改 */
    const key = activeKey === null ? domKey : selectedInfo?.selectedKey || domKey
    const componentType: keyof typeof ComponentSchema =
      activeKey === null ? 'tabItem' : (selectedInfo as any)?.otherProps?.type

    const formValueToProps = {
      tabItem: {
        name: values.title,
        id: values.primary,
      },
      secondaryItem: {
        id: values.secondary,
        name: values.title,
        icon: values.icon?.[0].url,
      },
      flashSale: {
        title: values.blockTitle,
      },
      flashSaleItem: {
        ...values.product,
      },
      saleRanking: {
        title: values.blockTitle,
      },
      saleRankingItem: {
        ...values.rankProduct,
        sale: values.sale,
      },
      brandItem: {
        id: values?.brand?.id,
        name: values?.brand?.name,
        logoUrl: values?.brand?.icon,
      },
      suggestProduct: {
        num: values.num,
        type: values.type,
      },
      suggestProductItem: {
        ...values.commodity,
      },
    }

    const currentProps =
      type === 0 && componentType.includes('suggestProduct')
        ? formValueToProps['suggestProduct']
        : formValueToProps[componentType]
    if (componentType.includes('suggestProduct') && values.type) {
      setType(values.type)
    }
    changeProps({
      treeKey: key,
      props: currentProps,
      title:
        values?.title ||
        values?.name ||
        values?.rankProduct?.name ||
        values?.brand?.name ||
        values?.blockTitle ||
        values?.product?.productName,
    })
    setVisible(false)
    handleOnClose()
    /** 这里reset 是为了修改自定义组件在mutator.change 之后无法setValue 的bug */
    // formActions.reset();
  }

  /** 获取一级导航 */
  const fetchPrimaryOption = async () => {
    const service = getProductCommodityTemplateGetFirstCategoryListByMemberId

    /** 如果是自营商城，那么带上memberID, 和memberRoleId, 其实后台可以自己查 */
    const commonPostData = {
      shopId: fixtureContext!.shopId?.toString(),
      memberId: userAuth.memberId.toString(),
    }
    const postData = isSelfMall ? { ...commonPostData, memberRoleId: userAuth.memberRoleId.toString() } : commonPostData

    const { data, code } = await service(postData)
    return data
  }

  /**
   * 当tab 修改时，这里要把已经添加的tab 给禁用掉
   */
  useEffect(() => {
    const sameKeyStateKeys = Object.keys(sameKeyState)
    if (sameKeyStateKeys.length === 0) {
      return
    }
    const hasSelectedTabKeys = sameKeyState['tab']
    formActions.setFieldState('layout.primary', (state) => {
      const tempData = state.originAsyncData || []
      FormPath.setIn(
        state,
        'props.enum',
        tempData.map((_item) => {
          return {
            // ..._item,
            label: _item.name,
            value: _item.id,
            disabled: hasSelectedTabKeys.includes(_item.id),
          }
        }),
      )
    })
  }, [activeKey, sameKeyState])

  useEffect(() => {
    if (!activeKey) {
      return
    }
    /** 获取二级导航 */
    async function fetchSecondaryOption() {
      const service = getProductCommodityTemplateGetSecondCategoryListByMemberId

      const common = {
        shopId: fixtureContext!.shopId?.toString(),
        categoryId: activeKey!.toString(),
        memberId: userAuth.memberId.toString(),
      }
      const postData = isSelfMall ? { ...common, memberRoleId: userAuth.memberRoleId.toString() } : common

      const { data, code } = await service(postData as any)
      if (code === 1000) {
        // const source = data.map((_item) => ({label: _item.name, value: _item.id}));
        const source =
          data?.map((_item) => ({
            label: _item.name,
            value: _item.id,
            disabled: sameKeyState[`tabItem_${activeKey}_secondary`].includes(_item.id),
          })) || []
        formActions.setFieldState('secondary', (state) => {
          state.originAsyncData = source
          FormPath.setIn(state, 'props.enum', source)
        })
      }
    }
    fetchSecondaryOption()
  }, [activeKey, sameKeyState])

  /** 这样写纯粹是为了区分修改tab 跟修改该 二级菜单的，因为如果form 挂载了，那么二级菜单在一级菜单修改时就不会再请求接口了，没想到好的方法 */
  const renderForm = () => {
    const props = {
      value: formValue,
      onSubmit: handleSubmit,
      expressionScope: {
        renderUploadChild,
      },
      actions: formActions,
      components: { FormilyUpload, FormilyProduct, FormilyRadio, FormilyBrand, FormilyCommodity },
    }
    return (
      <NiceForm
        {...props}
        schema={schema}
        effects={($, actions) => {
          useAsyncSelect('primary', fetchPrimaryOption, ['name', 'id'])
          onFieldInputChange$('*(primary, secondary)').subscribe((fieldState) => {
            const { originAsyncData } = fieldState
            const target = originAsyncData.filter(
              (_item) => _item.id === fieldState.value || _item.value === fieldState.value,
            )[0]
            actions.setFieldValue('title', target?.name || target?.label)
          })
        }}
      />
    )
  }
  return (
    <div style={{ position: 'relative', width: '400px' }}>
      <div className={className}>
        <div className={styles.header}>
          <span className={styles.title}>{intl.formatMessage({ id: 'editor.category.content' })}</span>
          <CloseOutlined onClick={handleOnClose} />
        </div>
        <div className={styles.content}>{renderForm()}</div>
        <div className={styles.footer}>
          <Space>
            <Button onClick={handleOnClose}>{intl.formatMessage({ id: 'common.button.cancel' })}</Button>
            <Button type="primary" onClick={() => formActions.submit()}>
              {intl.formatMessage({ id: 'common.button.confirm' })}
            </Button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default EditPanel

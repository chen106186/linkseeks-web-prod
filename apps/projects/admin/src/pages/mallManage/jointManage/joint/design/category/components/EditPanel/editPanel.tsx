import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  changeProps,
  clearSelectedStatus,
  PageConfigType,
  SelectedInfoType,
  StateType,
  STATE_PROPS,
} from '@apps/design-core'
import { useSelector } from '@apps/design-react'
import cs from 'classnames'
import { usePrevious, useToggle } from '@linkseeks/hooks'
import { CloseOutlined, PlusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Space, Spin, message, Tooltip } from 'antd'
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
import { useFilterSameOption } from '../../common/hooks/useFilterSameOption'
import NiceForm from '@/components/NiceForm'
import FormilyUpload from '@/components/UploadFiles/FormilyUploadFiles'

import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
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

const createRichTextUtils = () => {
  return {
    text(...args) {
      return React.createElement('span', {}, ...args)
    },
    help(text: string, offset = 3) {
      return React.createElement(
        Tooltip,
        { title: text },
        <QuestionCircleOutlined style={{ margin: '0 3px', cursor: 'default', marginLeft: offset }} />,
      )
    },
  }
}

const formActions = createFormActions()
const { onFieldInputChange$ } = FormEffectHooks
const EditPanel = () => {
  const fixtureContext = useContext(context)
  const { selectedInfo, pageConfig, activeKey, domKey } = useSelector<
    SettingPanelType,
    STATE_PROPS | 'activeKey' | 'domKey'
  >(['selectedInfo', 'pageConfig', 'activeKey', 'domKey'])
  const sameKeyState = useFilterSameOption()
  const [visible, setVisible] = useToggle(true)
  const [schema, setSchema] = useState<any>(null)
  const previousActiveKey = usePrevious(activeKey)
  const [formValue, setFormValue] = useState({})
  /** 精选商品type */
  const [type, setType] = useState<number>(0)
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
      message.info({ content: '请先选择一级导航类型', key: 'first' })
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
        secondaryItem: {
          secondary: selectedInfo?.props?.id,
          title: selectedInfo?.props?.name,
          icon: [{ name: selectedInfo?.props?.name, url: selectedInfo?.props?.icon }],
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
          type: selectedInfo.props.type || 1,
          num: selectedInfo.props.num || 50,
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
        message.info('请先选择展示类型')
        return
      }

      if (type !== 3 && componentType === 'suggestProductItem') {
        message.info('当前商品展示类型为自动排序，不能进行单个商品设置')
        setVisible(false)
        return
      }
      setFormValue(tempFormValue[componentType])
      setSchema(targetSchema)
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [selectedInfo, activeKey])

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
        <div className={styles.uploadImage}>上传图片</div>
        <div className={styles.imageIcon}>
          <Spin spinning={target?.status === 'uploading'}>
            {target?.url ? <img src={target?.url} style={{ width: '100%', height: '96px' }} /> : <PlusCircleOutlined />}
          </Spin>
        </div>
      </div>
    )
  }

  /**
   * 提交时要做类型映射
   */
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
    if (componentType === 'suggestProduct' && typeof values.type !== 'undefined') {
      setType(values.type)
    }
    changeProps({
      treeKey: key,
      props: currentProps,
      title:
        values?.title ||
        values?.name ||
        values?.rankProduct?.name ||
        values.productName ||
        values?.brand?.name ||
        values?.blockTitle,
    })
    handleOnClose()
    /** 这里reset 是为了修改自定义组件在mutator.change 之后无法setValue 的bug */
    formActions.reset()
  }

  const fetchPrimaryOption = async () => {
    const { data, code } = await getProductCommodityTemplateGetFirstCategoryListByMemberId({
      shopId: fixtureContext!.shopId?.toString(),
    })
    return data
  }

  /**
   * 当tab 修改时，这里要把已经添加的tab 给禁用掉
   */
  useEffect(() => {
    const sameKeyStateKeys = Object.keys(sameKeyState)
    if (!activeKey || sameKeyStateKeys.length === 0) {
      return
    }
    const hasSelectedTabKeys = Object.keys(sameKeyState).filter((_item) => /tabItem_\d+$/.test(_item))
    formActions.setFieldState('layout.primary', (state) => {
      const tempData = state.originAsyncData
      FormPath.setIn(
        state,
        'props.enum',
        tempData?.map((_item) => {
          return {
            ..._item,
            disabled: hasSelectedTabKeys.includes(`tabItem_${_item.value}`),
          }
        }),
      )
    })
  }, [activeKey, sameKeyState])

  useEffect(() => {
    if (!activeKey) {
      return
    }
    async function fetchSecondaryOption() {
      const { data, code } = await getProductCommodityTemplateGetSecondCategoryListByMemberId({
        shopId: fixtureContext!.shopId?.toString(),
        categoryId: activeKey!.toString(),
      })
      // console.log(sameKeyState, activeKey, sameKeyState[`tabItem_${activeKey}_secondary`]);
      if (code === 1000) {
        const source = data?.map((_item) => ({
          label: _item.name,
          value: _item.id,
          disabled: sameKeyState[`tabItem_${activeKey}_secondary`].includes(_item.id),
        }))
        formActions.setFieldState('secondary', (state) => {
          state.originAsyncData = source
          FormPath.setIn(state, 'props.enum', source)
        })
      }
    }
    fetchSecondaryOption()
  }, [activeKey])

  useEffect(() => {
    if (!activeKey || sameKeyState?.[`tabItem_${activeKey}_secondary`].length === 0) {
      return
    }
    formActions.setFieldState('layout.secondary', (state) => {
      const originAsyncData = state.originAsyncData?.map((_item) => ({
        label: _item.label,
        value: _item.value,
        disabled: sameKeyState[`tabItem_${activeKey}_secondary`].includes(_item.value),
      }))
      FormPath.setIn(state, 'props.enum', originAsyncData)
    })
  }, [sameKeyState, activeKey])

  const renderForm = () => {
    const formProps = {
      onSubmit: handleSubmit,
      expressionScope: {
        renderUploadChild,
        ...createRichTextUtils(),
      },
      actions: formActions,
      components: { FormilyUpload, FormilyProduct, FormilyRadio, FormilyBrand, FormilyCommodity },
    }
    return (
      <NiceForm
        value={formValue}
        {...formProps}
        schema={schema}
        effects={($, actions) => {
          useAsyncSelect('primary', fetchPrimaryOption, ['name', 'id'])
          onFieldInputChange$('*(primary, secondary)').subscribe((fieldState) => {
            const { originAsyncData } = fieldState
            const target = originAsyncData.filter((_item) => _item.value === fieldState.value)[0]
            actions.setFieldValue('title', target.label)
          })
        }}
      />
    )
  }
  return (
    <div style={{ position: 'relative', width: '400px' }}>
      <div className={className}>
        <div className={styles.header}>
          <span className={styles.title}>内容</span>
          <CloseOutlined onClick={handleOnClose} />
        </div>
        <div className={styles.content}>{renderForm()}</div>
        <div className={styles.footer}>
          <Space>
            <Button onClick={handleOnClose}>取消</Button>
            <Button type="primary" onClick={() => formActions.submit()}>
              确认
            </Button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default EditPanel

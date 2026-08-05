import React, { useState, useEffect, useMemo } from 'react'
import { changeProps, clearSelectedStatus, SelectedInfoType, STATE_PROPS } from '@apps/design-core'
import { useSelector } from '@apps/design-react'
import { PageConfigType } from '@lingxi-design/utils'
import cs from 'classnames'
import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { useToggle } from '@linkseeks/hooks'
import { Space, Button, Spin } from 'antd'
import { createFormActions, FormPath } from '@apps/formily'
import styles from './index.less'
import { activityImageSchema, couponSchema, activityProducts, cardSchema } from './schema'
import FormilyCoupon from '../EditPanelFormily/Coupon'
import FormilyProduct from '../EditPanelFormily/FormilyProduct'
import useGetSameKeys from '../../common/hooks/useGetSameKeys'
import NiceForm from '@/components/NiceForm'
import FormilyUpload from '@/components/UploadFiles/FormilyUploadFiles'
import { useIntl } from '@linkseeks/i18n'

type SettingPanelType = {
  selectedInfo: SelectedInfoType
  pageConfig: PageConfigType
}
const formActions = createFormActions()

/** 请求借口type， 请求列表接口需要带上type */
const ACTIVITY_MAP = {
  specialOfferItem: 1,
  /** 直降促销 */
  plummetItem: 2,
  /** 折扣促销 */
  discountItem: 3,
  /** 满量促销--满量减 */
  fullQuantitySubItem: 4,
  /** 满量促销--满量折  */
  fullQuantityDiscountItem: 4,
  /** 满额促销--满额减 */
  fullMoneySubItem: 5,
  /** 满额促销--满额折 */
  fullMoneyDiscountItem: 5,
  /** "赠送促销--赠送商品(满额赠+买商品赠)  */
  giveProductItem: 6,
  /** "赠送促销--赠送优惠券(满额赠+买商品赠)*/
  giveCouponItem: 6,
  /** 多件促销 */
  morePieceItem: 7,
  /** 组合促销  */
  combinationItem: 8,
  /** 拼团 */
  groupPurchaseItem: 9,
  luckDrawItem: 10,
  /** 砍价 */
  bargainItem: 11,
  /** 秒杀 */
  secKillItem: 12,
  /** 组合促销  */
  fullSwapItem: 13,
  /** 换购-买商品换购*/
  buySwapItem: 13,
  /** 预售 */
  preSaleItem: 14,
  /** 套餐 */
  setMealItem: 15,
  /** 适用 */
  attemptItem: 16,
}
/** 满量减/满额减、赠商品、满额换购， minType = 1 请求接口时带上 */
const minTypeToOne = ['fullQuantitySubItem', 'fullMoneySubItem', 'giveProductItem', 'fullSwapItem']
const minTypeToTwo = ['fullQuantityDiscountItem', 'fullMoneyDiscountItem', 'giveCouponItem', 'buySwapItem']

const activityListItem = Object.keys(ACTIVITY_MAP)
const activityList = activityListItem.map((_item) => _item.substring(0, _item.length - 4))

const EditPanelForm = () => {
  const intl = useIntl()
  const { selectedInfo, pageConfig } = useSelector<SettingPanelType, STATE_PROPS>(['selectedInfo', 'pageConfig'])
  const [visible, setVisible] = useToggle(false)
  const activityImage = useMemo(() => pageConfig[1]?.props?.imageUrl, [pageConfig])
  const { sameKeys } = useGetSameKeys()
  const [formValue, setFormValue] = useState<any>(null)
  const [schema, setSchema] = useState<any>(null)
  const className = cs(styles.editPanel, {
    [styles.hide]: !visible,
    [styles.show]: visible,
  })

  const handleOnClose = () => {
    clearSelectedStatus()
    setVisible(false)
  }

  useEffect(() => {
    if (selectedInfo === null) {
      setVisible(false)
      return
    }
    const componentType = (selectedInfo as any)?.otherProps?.type
    if (componentType === 'combinationItemProduct') {
      handleOnClose()
      return
    }

    const propsMapToValue = {
      top: {
        imageUrl: [
          { name: intl.formatMessage({ id: 'activityPage.advertisingMap' }), url: selectedInfo?.props?.imageUrl },
        ],
      },
      couponItem: {
        coupon: {
          ...selectedInfo.props,
        },
      },
      hotItem: {
        product: {
          ...selectedInfo.props,
        },
      },
      hot: {
        title: selectedInfo.props?.title,
      },
    }
    /** 如果是活动子集, 那么现实选择活动商品 */
    if (
      activityListItem.includes(componentType) ||
      componentType === 'hotItem' ||
      componentType === 'suggestProductItem'
    ) {
      setFormValue({
        product: {
          ...selectedInfo.props,
        },
        /** 当selectedInfo.props 未空对象的时候就不会更新当前value， 所有添加uuid */
        uuid: Math.random(),
      })
      setSchema(activityProducts)
    } else {
      const schemaMap = {
        top: activityImageSchema,
        couponItem: couponSchema,
      }
      /** 如果是 suggestProduct， 或者是hot 或者是活动父级，那么直接设置他的卡片名称 */
      const tempSchema =
        activityList.includes(componentType) || componentType === 'hot' || componentType === 'suggestProduct'
          ? cardSchema
          : schemaMap?.[componentType]
      const tempFormValue =
        activityList.includes(componentType) || componentType === 'hot' || componentType === 'suggestProduct'
          ? {
              title: selectedInfo.props.title,
            }
          : propsMapToValue?.[componentType]

      setSchema(tempSchema)
      setFormValue({ ...tempFormValue, uuid: Math.random() })
    }
    /** 16 种活动，请求是需要带上活动类型 */
    const activityType = ACTIVITY_MAP[componentType] ? { activityType: ACTIVITY_MAP[componentType] } : {}
    const isWithLabels = componentType === 'suggestProductItem' ? { isWithLabels: true } : { isWithLabels: false }
    const isWithMinType = minTypeToOne.includes(componentType) ? 1 : minTypeToTwo.includes(componentType) ? 2 : null

    formActions.setFieldState('product', (fieldState) => {
      let parentKeyString = selectedInfo.parentKey
      if (!parentKeyString) {
        parentKeyString = selectedInfo.selectedKey.split('-').slice(0, -1).join('-')
      }
      const [, parentKey] = parentKeyString.split('-')
      const isCombination = componentType === 'combinationItem'
      /** 如果是组合促销， 要是已经选择了一个组合促销数据，那么搜索活动商品列表时需要添加当前活动id */
      let withActivityId = {}
      if (isCombination && parentKey) {
        const [, currentCombinationActivityId] = sameKeys[`combination_${+parentKey - 1}`][0].split('_')
        withActivityId = currentCombinationActivityId === 'undefined' ? {} : { id: currentCombinationActivityId }
      }

      const disabledKeys =
        componentType === 'suggestProductItem'
          ? sameKeys[`suggestProduct_${+parentKey - 1}`]
          : isCombination
          ? sameKeys[`combination_${+parentKey - 1}`]
          : sameKeys[`${componentType?.substring(0, componentType.length - 4)}`] || []

      FormPath.setIn(fieldState, 'props.x-component-props', {
        ...activityType,
        ...isWithLabels,
        ...withActivityId,
        activityImage: activityImage,
        disabledKeys: disabledKeys,
        minType: isWithMinType,
      })
    })
    setVisible(true)
  }, [selectedInfo])

  const handleSubmit = (values) => {
    console.log('Submit', values)
    const componentType = (selectedInfo as any)?.otherProps?.type
    const valueMapToProps = {
      top: {
        imageUrl: values?.imageUrl?.[0].url,
      },
      couponItem: {
        ...values.coupon,
      },
      hot: {
        title: values.title,
      },
      suggestProduct: {
        title: values.title,
      },
    }
    let currentProps = {}
    if (
      activityListItem.includes(componentType) ||
      componentType === 'suggestProductItem' ||
      componentType === 'hotItem'
    ) {
      currentProps = values.product
    } else if (activityList.includes(componentType)) {
      currentProps = {
        title: values.title,
      }
    } else {
      currentProps = valueMapToProps[componentType]
    }
    changeProps({
      treeKey: selectedInfo.selectedKey,
      props: {
        ...selectedInfo.props,
        ...currentProps,
      },
      title: (currentProps as any)?.title || (currentProps as any)?.productName || (currentProps as any)?.name,
    })
    handleOnClose()
    // formActions.reset();
  }

  const renderUploadChild = (value) => {
    const target = value[0]
    return (
      <div className={styles.image}>
        <div className={styles.uploadImage}>{intl.formatMessage({ id: 'activityPage.uploadPic' })}</div>
        <div className={styles.imageIcon}>
          <Spin spinning={target?.status === 'uploading'}>
            {target?.url ? <img src={target?.url} style={{ width: '100%' }} /> : <PlusCircleOutlined />}
          </Spin>
        </div>
      </div>
    )
  }

  const renderForm = () => {
    const formProps = {
      onSubmit: handleSubmit,
      expressionScope: {
        renderUploadChild,
      },
      actions: formActions,
      components: { FormilyUpload, FormilyCoupon, FormilyProduct },
    }
    return <NiceForm value={formValue} {...formProps} schema={schema} />
  }

  return (
    <div style={{ position: 'relative', width: '400px' }}>
      <div className={className}>
        <div className={styles.header}>
          <span className={styles.title}>{intl.formatMessage({ id: 'activityPage.content' })}</span>
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

export default EditPanelForm

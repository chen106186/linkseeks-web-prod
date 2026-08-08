import React, { useState, useEffect, useMemo } from 'react'
import { changeProps, clearSelectedStatus, SelectedInfoType, STATE_PROPS } from '@apps/design-core'
import { useSelector } from '@apps/design-react'
// import { PageConfigType } from '@lingxi-design/utils';
import cs from 'classnames'
import { CloseOutlined, LeftOutlined, PlusCircleOutlined, RightOutlined } from '@ant-design/icons'
import { useToggle } from '@linkseeks/hooks'
import { Space, Button, Spin } from 'antd'
import { createFormActions, FormPath } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import { activityImageSchema, couponSchema, activityProducts, cardSchema } from './schema'
import FormilyCoupon from '../EditPanelFormily/Coupon'
import FormilyProduct from '../EditPanelFormily/FormilyProduct'
import useGetSameKeys from '../../common/hooks/useGetSameKeys'
import FormilyUpload from '@/components/UploadFiles/FormilyUploadFiles'
import styles from './index.less'

type SettingPanelType = {
  selectedInfo: SelectedInfoType
  pageConfig: any
}

const formActions = createFormActions()

/** 请求接口type， 请求列表接口需要带上type */
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
} as const

/**
 * selectInfo 的 otherProps属性的 type 类型，
 * 此属性表达的意思是某个活动或者组件属性类型
 * 比如 coupon 表示的是优惠券, "top" 表示的是广告图
 * */
type OtherPropsComponentType =
  | 'top'
  | 'coupon'
  | 'hot'
  | 'plummet'
  | 'specialOffer'
  | 'discount'
  | 'fullQuantitySub'
  | 'fullQuantityDiscount'
  | 'fullMoneySub'
  | 'fullMoneyDiscount'
  | 'giveProduct'
  | 'giveCoupon'
  | 'morePiece'
  | 'combination'
  | 'groupPurchase'
  | 'bargain'
  | 'secKill'
  | 'fullSwap'
  | 'buySwap'
  | 'preSale'
  | 'setMeal'
  | 'attempt'
  | 'suggestProduct'
  | 'suggestProductItem'
  | 'hotItem'
  | keyof typeof ACTIVITY_MAP
/** 满量减/满额减、赠商品、满额换购， minType = 1 请求接口时带上 */
const minTypeToOne = ['fullQuantitySubItem', 'fullMoneySubItem', 'giveProductItem', 'fullSwapItem']
const minTypeToTwo = ['fullQuantityDiscountItem', 'fullMoneyDiscountItem', 'giveCouponItem', 'buySwapItem']

const activityListItem = Object.keys(ACTIVITY_MAP)
const activityList = activityListItem.map((_item) => _item.substring(0, _item.length - 4))

/**
 * TODO 有时间将EditPanel 合并
 */

const EditPanelForm = () => {
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
  console.log(selectedInfo)

  useEffect(() => {
    if (selectedInfo === null) {
      setVisible(false)
      return
    }
    const componentType: OtherPropsComponentType = (selectedInfo as any)?.otherProps?.type
    console.log(componentType)

    const propsMapToValue = {
      top: {
        imageUrl: [{ name: '广告图', url: selectedInfo?.props?.imageUrl }],
      },
      couponItem: {
        coupon: { ...selectedInfo.props },
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
        uuid: Math.random(),
      })
      setSchema(activityProducts)
    } else {
      const schemaMap = {
        top: activityImageSchema,
        couponItem: couponSchema,
      }

      const isContainer =
        activityList.includes(componentType) ||
        componentType === 'hot' ||
        componentType === 'suggestProduct' ||
        componentType === 'coupon'
      /** 如果是 suggestProduct， 或者是hot 或者是活动父级，那么直接设置他的卡片名称 */
      const tempSchema = isContainer ? cardSchema : schemaMap?.[componentType]
      const tempFormValue = isContainer ? { title: selectedInfo.props.title } : propsMapToValue?.[componentType]
      setSchema(tempSchema)
      // 这里加uuid 是为了解决这个bug http://chandao.shushangyun.com/index.php?m=bug&f=view&bugID=19739，formily value 改变不触发更新，
      setFormValue({ ...tempFormValue, uuid: Math.random() })
    }
    /** 16 种活动，请求是需要带上活动类型 */
    const activityType = ACTIVITY_MAP[componentType] ? { activityType: ACTIVITY_MAP[componentType] } : {}
    const isWithLabels = componentType === 'suggestProductItem' ? { isWithLabels: true } : { isWithLabels: false }
    const isWithMinType = minTypeToOne.includes(componentType) ? 1 : minTypeToTwo.includes(componentType) ? 2 : null
    // console.log(hotItem".substring(0, 1));
    formActions.setFieldState('product', (fieldState) => {
      const [, parentKey] = selectedInfo.parentKey.split('-')
      FormPath.setIn(fieldState, 'props.x-component-props', {
        activityImage: activityImage,
        ...activityType,
        disabledKeys:
          componentType === 'suggestProductItem'
            ? sameKeys[`suggestProduct_${parseInt(parentKey) - 1}`]
            : sameKeys[`${componentType?.substring(0, componentType.length - 4)}`] || [],
        ...isWithLabels,
        minType: isWithMinType,
        // fetchOptions: fetchMemberOptions,
      })
    })
    setVisible(true)
  }, [selectedInfo])

  const handleSubmit = (values) => {
    console.log(values)
    const componentType: OtherPropsComponentType = (selectedInfo as any)?.otherProps?.type
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
      coupon: {
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
      <>
        <div className={styles.image}>
          <div className={styles.uploadImage}>上传图片</div>
          <div className={styles.imageIcon}>
            <Spin spinning={target?.status === 'uploading'}>
              {target?.url ? <img src={target?.url} style={{ width: '100%' }} /> : <PlusCircleOutlined />}
            </Spin>
          </div>
        </div>
        <div className={styles.imageTips}>建议尺寸 1920 * 460</div>
      </>
    )
  }

  const renderForm = () => {
    const formProps = {
      onSubmit: handleSubmit,
      expressionScope: {
        renderUploadChild,
      },
      actions: formActions,
      components: {
        FormilyUpload,
        FormilyCoupon,
        FormilyProduct,
      },
    }

    return <NiceForm value={formValue} {...formProps} schema={schema} />
  }

  return (
    <div className={cs(styles.panel, className)}>
      <div className={styles['panel-content']}>
        {(selectedInfo && (
          <div className={styles['expand-icon']} onClick={() => setVisible(!visible)}>
            {!visible ? <LeftOutlined /> : <RightOutlined />}
          </div>
        )) ||
          null}
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

export default EditPanelForm

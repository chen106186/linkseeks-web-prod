import React, { useState } from 'react'
import cx from 'classnames'
import { pxTransform, previewImage } from '@apps/mobile-services/utils/taro'
import { View, Text, Modal, Icons, Rate, Image } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

export interface EvaluatedItemData {
  /**
   * 数据id
   */
  id: number
  /**
   * 供应会员名称
   */
  subMemberName: string
  /**
   * 供应会员头像
   */
  subMemberNameAvatar: string
  /**
   * 评分
   */
  star: number
  /**
   * 评价时间
   */
  dealTime: string
  /**
   * 评价内容
   */
  comment: string
  /**
   * 评价图片
   */
  pics: string[]
  /**
   * 商品名称
   */
  product: string
  /**
   * 商品图片
   */
  productImgUrl: string
  /**
   * 商品所在订单类型
   */
  orderType: number
  /**
   * 商品id
   */
  productId: number
  /**
   * 商品skuId
   */
  skuId?: number
  /**
   * 商品所属会员id
   */
  productMemberId: number
  /**
   * 商品所属会员角色id
   */
  productMemberRoleId: number
  //* * *被评价方回复内容* */
  replyContent?: string
  // 右上角展示创建时间
  createTime?: string
}

export interface EvaluatedItemProps {
  /**
   * 数据源
   */
  data: EvaluatedItemData
  /**
   * 自定义样式
   */
  className?: string
  /**
   * 产品点击事件
   */
  onClickProduct?: (id: number) => void
}

const EvaluatedItem: React.FC<EvaluatedItemProps> = (props: EvaluatedItemProps) => {
  const intl = useIntl()
  const { data, className, onClickProduct } = props
  const [currentPics, setCurrentPics] = useState<any[]>([])
  const [currentPicsIndex, setCurrentPicsIndex] = useState<number>(0)
  const [previewVisible, setPreviewVisible] = useState(false)

  const handlePreview = (pics: string[], index: number) => {
    previewImage({ urls: pics, current: pics[index] })
    // setCurrentPics(pics.map((item) => ({ url: item })));
    // setCurrentPicsIndex(index);
    // setPreviewVisible(true);
  }

  const handleJumpProductDetail = (id: number) => {
    if (onClickProduct) {
      onClickProduct(id)
    }
  }

  return (
    <>
      <View className={cx(styles['evaluatedItem'], className)}>
        <View className={styles['evaluatedItem-evaluated-item-head']}>
          <View className={styles['evaluatedItem-evaluated-item-head-left']}>
            <View className={styles['evaluatedItem-evaluated-item-avatar']}>
              {data.subMemberNameAvatar ? (
                <Image src={data.subMemberNameAvatar} className={styles['evaluatedItem-evaluated-item-avatar-image']} />
              ) : (
                <Icons name="user" size={28} color="#FFFFFF" />
              )}
            </View>
          </View>
          <View className={styles['evaluatedItem-evaluated-item-head-center']}>
            <Text className={styles['evaluatedItem-evaluated-item-memberName']}>{data.subMemberName}</Text>
            <View className={styles['evaluatedItem-evaluated-item-head-star']}>
              <Rate value={data.star} size={12} />
            </View>
          </View>
          <View className={styles['evaluatedItem-evaluated-item-head-right']}>
            {/* <Text className={styles['evaluatedItem-evaluated-item-time']}>{data.dealTime}</Text> */}
            <Text className={styles['evaluatedItem-evaluated-item-time']}>{data.createTime}</Text>
          </View>
        </View>
        <Text className={styles['evaluatedItem-evaluated-item-content']}>{data.comment}</Text>
        <View className={styles['evaluatedItem-evaluated-item-pic']}>
          {data.pics &&
            data.pics.map((item, index) => (
              <View
                key={index}
                className={styles['evaluatedItem-evaluated-item-pic-item']}
                onClick={() => handlePreview(data.pics, index)}
              >
                <Image src={item} className={styles['evaluatedItem-evaluated-item-pic-item-image']} />
              </View>
            ))}
        </View>
        <View
          className={styles['evaluatedItem-evaluated-item-product']}
          onClick={() => handleJumpProductDetail(data.id)}
        >
          <View className={styles['evaluatedItem-evaluated-item-product-pic']}>
            <Image src={data.productImgUrl} className={styles['evaluatedItem-evaluated-item-product-pic-image']} />
          </View>
          <Text className={styles['evaluatedItem-evaluated-item-product-name']}>{data.product}</Text>
          <View className={styles['evaluatedItem-evaluated-item-product-arrow']}>
            <Icons name="ChevronRight" size={16} color="#C0C4CC" />
          </View>
        </View>
        {data?.replyContent && (
          <Text className={styles['evaluatedItem-evaluated-item-content']} style={{ marginTop: pxTransform(12) }}>
            <Text style={{ color: '#909399' }}>
              {intl.formatMessage({ id: 'evaluatingManage.shangjia', defaultMessage: '商家' })}：
            </Text>
            {data.replyContent}
          </Text>
        )}
      </View>
    </>
  )
}
export default EvaluatedItem

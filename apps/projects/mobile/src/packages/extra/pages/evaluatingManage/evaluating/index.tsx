import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useRef, useEffect } from 'react'
import { View, Text, ScrollView, Icons, Rate, Image, TextArea, Upload } from '@apps/mobile-ui'
import Router from '@/utils/router'
import uploadFileRequest from '@/utils/uploadFileRequest'
import { useIntl } from '@linkseeks/i18n'
import useStores from '@/store/useStores'
import cn from 'classnames'
import {
  getCurrentInstance,
  previewImage,
  setNavigationBarTitle,
  showLoading,
  hideLoading,
  showToast,
} from '@apps/mobile-services/utils/taro'
import { getMemberMobileCommentOrderProductGet, postMemberMobileCommentSave } from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
interface RouteParams {
  /**
   * 商品所在订单id
   */
  orderId: number
  /**
   * 重新加载
   */
  onRefresh?: () => void
}
const Evaluating: React.FC<RouteParams> = (props: RouteParams) => {
  const intl = useIntl()
  usePageInit()
  // setNavigationBarTitle({
  //   title: intl.formatMessage({ id: 'evaluatingManage.pingjiashangpin', defaultMessage: '评价商品' }),
  // })
  const STAR_TEXT_MAP: {
    [key: string]: string
  } = {
    1: intl.formatMessage({
      id: 'evaluatingManage.feichangbumanyi',
      defaultMessage: '非常不满意',
    }),
    2: intl.formatMessage({
      id: 'evaluatingManage.bumanyi',
      defaultMessage: '不满意',
    }),
    3: intl.formatMessage({
      id: 'evaluatingManage.yiban',
      defaultMessage: '一般',
    }),
    4: intl.formatMessage({
      id: 'evaluatingManage.manyi',
      defaultMessage: '满意',
    }),
    5: intl.formatMessage({
      id: 'evaluatingManage.feichangmanyi',
      defaultMessage: '非常满意',
    }),
  }
  const params = getCurrentInstance().router?.params || {}
  const { orderId } = params
  const [star, setStar] = useState(5)
  const [comment, setComment] = useState('')
  const [fileList, setFileList] = useState<any[]>([])
  const [orderInfoLoading, setOrderInfoLoading] = useState(false)
  const orderInfo = useRef<any>()
  const {
    userStore: { shopAndSite },
  } = useStores()
  const memberInfo: any = {
    upperMemberId: shopAndSite?.isSelf ? shopAndSite?.memberId : '',
    upperRoleId: shopAndSite?.isSelf ? shopAndSite?.memberRoleId : '',
  }
  let timer: NodeJS.Timeout | null = null
  const getOrderDetail = () => {
    setOrderInfoLoading(true)
    getMemberMobileCommentOrderProductGet({
      id: `${orderId}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          orderInfo.current = res.data
        }
      })
      .finally(() => {
        setOrderInfoLoading(false)
      })
  }
  useEffect(() => {
    getOrderDetail()
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [])
  const handleCommentChange = (text: string) => {
    setComment(text)
  }
  const uploadFile = async (result) => {
    showLoading()
    const uploadResult = await uploadFileRequest(result)
    const files = uploadResult.map((_item) => {
      return {
        fileName: _item.name,
        filePath: _item.url,
      }
    })
    hideLoading()
    if (uploadResult.length > 0) {
      const filesList = [...fileList, ...files]
      setFileList(filesList)
    }
    return uploadResult
  }
  const uploadClear = (index) => {
    const newFileList = fileList.filter((_item, idx) => idx !== index)
    setFileList(newFileList)
  }
  const handleSubmit = async () => {
    if (!comment) {
      showToast({
        title: intl.formatMessage({
          id: 'evaluatingManage.qingshurupingjianeirong',
          defaultMessage: '请输入评价内容',
        }),
        icon: 'none',
      })
      return
    }
    if (!orderInfo.current || orderInfoLoading) {
      return
    }
    showLoading()
    const mobileShopVO = {
      shopType: 1,
      shopProperty: shopAndSite?.property,
      ...memberInfo,
    }
    const payload = {
      orderProductId: orderInfo.current?.orderProductId,
      star: star,
      comment,
      pics: fileList.map((item) => item.filePath as string),
      mobileShopVO,
    }
    postMemberMobileCommentSave(payload)
      .then((res) => {
        if (res.code === 1000) {
          showToast({
            title: intl.formatMessage({
              id: 'evaluatingManage.pingjiachenggong',
              defaultMessage: '评价成功',
            }),
            icon: 'none',
          })
          timer = setTimeout(() => {
            hideLoading()
            Router.navigateBack()
          }, 2000)
        } else {
          showToast({
            title: intl.formatMessage({
              id: `${res.code}` as any,
              defaultMessage: res.message,
            }),
            icon: 'none',
          })
          hideLoading()
        }
      })
      .catch(() => {
        hideLoading()
      })
  }
  return (
    <View className={styles['evaluating']}>
      <ScrollView className={styles['evaluating-scrollWrap']}>
        <View className={styles['evaluating-wrap']}>
          <View className={styles['evaluating-product']}>
            <View className={styles['evaluating-product-pic']}>
              <Image src={orderInfo.current?.logo} className={styles['evaluating-image']} />
            </View>
            <Text className={styles['evaluating-product-name']}>{orderInfo.current?.name}</Text>
          </View>
          <View className={styles['evaluating-desc']}>
            <Text className={styles['evaluating-desc-label']}>
              {intl.formatMessage({
                id: 'evaluatingManage.miaoshuxiangfu',
                defaultMessage: '描述相符',
              })}
            </Text>
            <View className={styles['evaluating-desc-star']}>
              <Rate
                value={star}
                size={22}
                className={styles['evaluating-desc-rate']}
                onChange={(value: any) => setStar(value)}
              />
            </View>
            <Text className={styles['evaluating-desc-text']}>{STAR_TEXT_MAP[star]}</Text>
          </View>
          <View className={styles['evaluating-inputWrap']}>
            <View className={styles['evaluating-input-icon']}>
              <Icons name="edit" size={12} color="#C0C4CC" />
            </View>
            <View className={styles['evaluating-input']}>
              <TextArea
                count={false}
                height={125}
                placeholderClass={styles['evaluating-placeholderClass']}
                placeholder={intl.formatMessage({
                  id: 'evaluatingManage.congduogejiaodupingjiashang',
                  defaultMessage: '从多个角度评价商品，可以帮助更多想买的人',
                })}
                value={comment}
                onChange={handleCommentChange}
              />
            </View>
          </View>
          <View>
            <View className={styles['upload-box']}>
              {fileList.map((item, index) => (
                <View className={styles['upload-item__box']} key={`upload-${index}`}>
                  <View className={styles['upload-item']}>
                    <View className={styles['upload-item__clear']} onClick={() => uploadClear(index)}>
                      <Icons color="#C8CACD" name="MinusCircle" className={styles['upload-item__clear-icon']} />
                    </View>
                    <Image
                      className={styles['upload-item__image']}
                      src={item.filePath}
                      onClick={() =>
                        previewImage({
                          urls: [item.filePath],
                          current: fileList[index],
                        })
                      }
                    />
                  </View>
                </View>
              ))}
              {fileList.length < 4 && (
                <View className={styles['upload-item__box']}>
                  <Upload fileList={fileList} actions={uploadFile} pickerMax={4 - fileList.length}>
                    <View className={cn(styles['upload-item'], styles['upload-added'])}>
                      <Icons name="Plus" color="#C8CACD" className={styles['upload-plus-icon']} />
                      <Text className={styles['upload-plus-text']}>
                        {intl.formatMessage({
                          id: 'evaluatingManage.tianjiatupian',
                          defaultMessage: '添加图片',
                        })}
                      </Text>
                    </View>
                  </Upload>
                </View>
              )}
            </View>
          </View>
        </View>
        <View className={styles['evaluating-registerBtn']} onClick={handleSubmit}>
          <Text className={styles['evaluating-registerBtnText']}>
            {intl.formatMessage({
              id: 'evaluatingManage.fabupingjia',
              defaultMessage: '发布评价',
            })}
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
export default GlobalWrapper(Evaluating)

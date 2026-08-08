import React, { useEffect, useState } from 'react'
import {
  getCurrentInstance,
  setNavigationBarTitle,
  setClipboardData,
  preload,
  downloadFile,
  openDocument,
} from '@apps/mobile-services/utils/taro'
import { View, ScrollView, Text, Icons, Toast, Button, Image } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { useSafeArea } from '@apps/mobile-services'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import { dateFormat, dateFmt } from '@/utils/date'
import { GetTradeAppletProductInquiryDetailsResponse, getTradeAppletProductInquiryDetails } from '@apps/apis'
import defaultImage from '@/assets/images/default_img.png'
import styles from './index.module.scss'

const InquiryOfferLayout = () => {
  const params = getCurrentInstance().preloadData as any
  const { id, PAGE } = params
  const { safeBottomHeight } = useSafeArea()
  const [dataSoucre, setDataSoucre] = useState<GetTradeAppletProductInquiryDetailsResponse>()

  /* 头部标题 */
  const scrollView = (evt) => {
    const contentOffsetY: number = evt.detail.scrollTop
    if (Math.round(contentOffsetY) >= 45) {
      setNavigationBarTitle({ title: dataSoucre?.externalStateName || '' })
    } else {
      setNavigationBarTitle({ title: '' })
    }
  }

  const clipboard = (dataText: any) => {
    setClipboardData({
      data: dataText,
      success: () => {
        Toast.show({ title: '内容复制成功', icon: 'none' })
      },
    })
  }

  const handleLink = (code) => {
    preload({
      id,
    })
    Router.navigateTo(code)
  }

  useEffect(() => {
    getTradeAppletProductInquiryDetails({ id } as any).then((res) => {
      if (res.code !== 1000) {
        Toast.show({ title: res.message, icon: 'none' })
        return
      }
      setDataSoucre(res.data)
    })
  }, [])

  const handleStatusLayout = () => {
    preload('params', {
      externalInquiryListStateResponses: dataSoucre?.externalInquiryListStateResponses,
      externalInquiryListLogResponses: dataSoucre?.externalInquiryListLogResponses,
      interiorRequisitionFormStateResponses: dataSoucre?.interiorRequisitionFormStateResponses,
      interiorInquiryListLogResponses: dataSoucre?.interiorInquiryListLogResponses,
    })
    Router.navigateTo('root/statusLayout')
  }

  const handleOpenDocument = (PATH) => {
    downloadFile({
      url: PATH,
      success: function (res) {
        var filePath = res.tempFilePath
        openDocument({
          filePath: filePath,
          success: function (resolve) {
            console.log('打开文档成功')
          },
        })
      },
    })
  }

  return (
    <View className={styles['container']} style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}>
      <View style={{ flex: 1, overflow: 'scroll' }}>
        <ScrollView onScroll={scrollView} className={styles['scrollView']}>
          <View className={styles['scrollView-box']}>
            <View className={styles['scrollView-box-status']}>
              <View className={styles['scrollView-box-status-line']} onClick={() => handleStatusLayout()}>
                <Text className={styles['scrollView-box-status-line-text']}>{dataSoucre?.externalStateName}</Text>
                <Icons name="ChevronRight" size={14} color="#FFFFFF" />
              </View>
            </View>
            {/* 内容 */}
            <View className={styles['scrollView-box-content']}>
              <View className={styles['productInfo']}>
                <View className={styles['productInfoTitle']}>
                  <View className={styles['docLine']} />
                  <Text className={styles['productName']}>{dataSoucre?.details}</Text>
                </View>
                <View className={styles['productInfoNo']}>
                  <Text className={styles['productNo']}>{dataSoucre?.inquiryListNo}</Text>
                  <View>
                    <Text onClick={() => clipboard(dataSoucre?.inquiryListNo)} className={styles['textCopyStyle']}>
                      复制
                    </Text>
                  </View>
                </View>
              </View>
              {/* 基本信息 */}
              <MellowCard
                title="基本信息"
                className={styles['customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <Cell>
                  <Cell.Item
                    title="询价单号"
                    value={
                      <View className={styles['customStyle-box']}>
                        <Text className={styles['customStyle-value']}>{dataSoucre?.inquiryListNo}</Text>
                        <View
                          className={styles['customStyle-copy']}
                          onClick={() => clipboard(dataSoucre?.inquiryListNo)}
                        >
                          <Text className={styles['customStyle-copy-text']}>复制</Text>
                        </View>
                      </View>
                    }
                  />
                  <Cell.Item title="询价会员" value={dataSoucre?.inquiryListMemberName} />
                  <Cell.Item
                    title="单据时间"
                    value={dataSoucre?.voucherTime && dateFormat(new Date(dataSoucre!.voucherTime))}
                  />
                </Cell>
              </MellowCard>
              {/* 商品报价 */}
              <MellowCard
                title="商品报价"
                className={styles['customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                {dataSoucre?.inquiryListProductRequests &&
                  dataSoucre?.inquiryListProductRequests.map((item, index) => (
                    <View className={styles['product-box']} key={item.commodityId * index}>
                      <View className={styles['product-box-left']}>
                        <Image src={item?.imgUrl || defaultImage} className={styles['product-box-left-image']} />
                      </View>
                      <View className={styles['product-box-right']}>
                        <View className={styles['product-box-right-content']}>
                          <Text className={styles['product-box-right-title']}>{item.productName}</Text>
                          <View className={styles['product-box-right-count']}>
                            <View className={styles['product-box-right-count-item']}>
                              <View className={styles['product-box-right-count-label']}>单位：</View>
                              <View className={styles['product-box-right-count-value']}>{item.unit}</View>
                            </View>
                            <View className={styles['product-box-right-count-item']}>
                              <View className={styles['product-box-right-count-label']}>采购数量：</View>
                              <View className={styles['product-box-right-count-value']}>x{item.purchaseCount}</View>
                            </View>
                            <View className={styles['product-box-right-count-item']}>
                              <View className={styles['product-box-right-count-label']}>品类：</View>
                              <View className={styles['product-box-right-count-value']}>{item.category}</View>
                            </View>
                            <View className={styles['product-box-right-count-item']}>
                              <View className={styles['product-box-right-count-label']}>品牌：</View>
                              <View className={styles['product-box-right-count-value']}>{item.brand}</View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
              </MellowCard>
              {/* 交易条件 */}
              <MellowCard
                title="交易条件"
                className={styles['customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <Cell>
                  <Cell.Item
                    title="交付时间"
                    value={dataSoucre?.deliveryTime && dateFmt(new Date(dataSoucre!.deliveryTime))}
                  />
                  <Cell.Item title="交付地址" value={dataSoucre?.fullAddress} />
                  <Cell.Item
                    title="报价截止时间"
                    value={dataSoucre?.quotationAsTime && dateFormat(new Date(dataSoucre!.quotationAsTime))}
                  />
                </Cell>
              </MellowCard>
              {/* 其他条件 */}
              <MellowCard
                title="交易条件"
                className={styles['customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <Cell>
                  <Cell.Item title="报价要求" value={dataSoucre?.offer} />
                  <Cell.Item title="付款方式" value={dataSoucre?.paymentType} />
                  <Cell.Item title="税费要求" value={dataSoucre?.taxes} />
                  <Cell.Item title="物流要求" value={dataSoucre?.logistics} />
                  <Cell.Item title="包装要求" value={dataSoucre?.packRequire} />
                  <Cell.Item title="其他要求" value={dataSoucre?.otherRequire} />
                </Cell>
              </MellowCard>
              {/* 附件 */}
              <MellowCard title="附件" className={styles['customStyle']}>
                <View className={styles['upload']}>
                  {dataSoucre?.enclosureUrls &&
                    dataSoucre?.enclosureUrls.map((item, index) => (
                      <View
                        className={styles['upload-box']}
                        key={index * 1}
                        onClick={() => handleOpenDocument(item.url)}
                      >
                        <View className={styles['upload-box-item']}>
                          <View className={styles['upload-box-item-wrap']}>
                            <View className={styles['upload-box-item-clear']}></View>
                            <Icons name="Production" size={34} />
                          </View>
                          <Text className={styles['upload-box-item-name']}>{item.name}</Text>
                        </View>
                      </View>
                    ))}
                </View>
              </MellowCard>
            </View>
          </View>
        </ScrollView>
      </View>
      {PAGE !== 'PREVIEW' && (
        <View className={styles['operate-box']}>
          <Button type="primary" onClick={() => handleLink('root/inquiry/inquiryOffer')}>
            发起报价
          </Button>
        </View>
      )}
    </View>
  )
}
export default InquiryOfferLayout

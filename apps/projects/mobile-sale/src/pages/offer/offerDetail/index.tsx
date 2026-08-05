import React, { useEffect, useState } from 'react'
import {
  getCurrentInstance,
  setNavigationBarTitle,
  preload,
  downloadFile,
  openDocument,
  setClipboardData,
} from '@apps/mobile-services/utils/taro'
import { View, ScrollView, Text, Icons, Toast, Image } from '@apps/mobile-ui'
import Router from '@/utils/router'
import cx from 'classnames'
import { useSafeArea } from '@apps/mobile-services'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import { dateFormat } from '@/utils/date'
import { GetTradeAppletProductQuotationDetailsResponse, getTradeAppletProductQuotationDetails } from '@apps/apis'
import { STATE_TYPE } from '@/components/AuditLayout'
import defaultImage from '@/assets/images/default_img.png'
import styles from './index.module.scss'

const OfferDetailLayout = () => {
  const params = getCurrentInstance().preloadData as any
  const { id, PAGE, refresh } = params
  const { safeBottomHeight } = useSafeArea()
  const [dataSoucre, setDataSoucre] = useState<GetTradeAppletProductQuotationDetailsResponse>()

  /* 头部标题 */
  const scrollView = (evt) => {
    const contentOffsetY: number = evt.detail.scrollTop
    if (Math.round(contentOffsetY) >= 45) {
      setNavigationBarTitle({ title: dataSoucre?.interiorStateName || '' })
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

  useEffect(() => {
    getTradeAppletProductQuotationDetails({ id } as any).then((res) => {
      if (res.code !== 1000) {
        Toast.show({ title: res.message, icon: 'none' })
        return
      }
      setDataSoucre(res.data)
    })
  }, [])

  const handleStatusLayout = () => {
    preload('params', {
      externalInquiryListStateResponses: dataSoucre?.externalQuotationStateResponses,
      externalInquiryListLogResponses: dataSoucre?.externalRequisitionFormResponses,
      interiorRequisitionFormStateResponses: dataSoucre?.interiorQuotationStateResponses,
      interiorInquiryListLogResponses: dataSoucre?.interiorQuotationLogResponses,
    })
    Router.navigateTo('root/statusLayout')
  }

  const handleAuditLayout = (STATE: STATE_TYPE.NOT_PASS | STATE_TYPE.PASS) => {
    preload({
      id,
      PAGE,
      STATE,
      refresh,
    })
    Router.navigateTo('root/offer/offerAudit')
  }

  const handleLink = (code, inquryid: number, IPAGE: string) => {
    preload({
      id: inquryid,
      PAGE: IPAGE,
    })
    Router.navigateTo(code)
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
                <Text className={styles['scrollView-box-status-line-text']}>{dataSoucre?.interiorStateName}</Text>
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
                  <Text className={styles['productNo']}>{dataSoucre?.quotationNo}</Text>
                  <View>
                    <Text onClick={() => clipboard(dataSoucre?.quotationNo)} className={styles['textCopyStyle']}>
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
                    title="报价单号"
                    value={
                      <View className={styles['customStyle-box']}>
                        <Text className={styles['customStyle-value']}>{dataSoucre?.quotationNo}</Text>
                        <View className={styles['customStyle-copy']} onClick={() => clipboard(dataSoucre?.quotationNo)}>
                          <Text className={styles['customStyle-copy-text']}>复制</Text>
                        </View>
                      </View>
                    }
                  />
                  <Cell.Item
                    title="对应询价单号"
                    value={dataSoucre?.inquiryListNo}
                    hasArrow
                    clickable
                    onPress={() => handleLink('root/inquiry/inquiryDetail', dataSoucre!.inquiryListId, 'PREVIEW')}
                  />
                  <Cell.Item title="询价会员" value={dataSoucre?.memberName} />
                  <Cell.Item
                    title="单据时间"
                    value={dataSoucre?.voucherTime && dateFormat(new Date(dataSoucre!.voucherTime))}
                  />
                  <Cell.Item
                    title="报价截止时间"
                    value={dataSoucre?.quotationAsTime && dateFormat(new Date(dataSoucre!.quotationAsTime))}
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
                {dataSoucre?.products &&
                  dataSoucre?.products.map((item, index) => (
                    <View className={styles['product-box']} key={item.productId * index}>
                      <View className={styles['product-box-left']}>
                        <Image src={item?.imgUrl || defaultImage} className={styles['product-box-left-image']} />
                      </View>
                      <View className={styles['product-box-right']}>
                        <View className={styles['product-box-right-content']}>
                          <Text className={styles['product-box-right-title']}>{item.productName}</Text>
                          <View className={styles['product-box-right-count']}>
                            <View className={styles['product-box-right-count-item']}>
                              <View className={styles['product-box-right-count-label']}>报价单价：</View>
                              <View
                                className={styles['product-box-right-count-value']}
                                style={{ color: '#00A98F', fontWeight: '400' }}
                              >
                                {`￥${Number(item.price).toFixed(2)}/${item.unit}` || '待报价'}
                              </View>
                            </View>
                            <View className={styles['product-box-right-count-item']}>
                              <View className={styles['product-box-right-count-label']}>采购数量：</View>
                              <View className={styles['product-box-right-count-value']}>x{item.purchaseCount}</View>
                            </View>
                          </View>
                          <View className={styles['product-box-right-amount']}>
                            <View className={styles['product-box-right-amount-label']}>金额：</View>
                            <View className={styles['product-box-right-amount-value']}>
                              ￥{Number(item.money).toFixed(2) || '0.00'}
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
              </MellowCard>
              {/* 报价说明 */}
              <MellowCard
                title="报价说明"
                className={styles['customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <Cell>
                  <Cell.Item title="最小起订量" value={dataSoucre?.minimumOrder} />
                  <Cell.Item title="报价联系人" value={dataSoucre?.contactName} />
                  <Cell.Item title="联系电话" value={dataSoucre?.contactPhone} />
                </Cell>
              </MellowCard>
              {/* 其他条件 */}
              <MellowCard
                title="其他说明"
                className={styles['customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <Cell>
                  <Cell.Item title="交付说明" value={dataSoucre?.deliveryInstructions} />
                  <Cell.Item title="付款说明" value={dataSoucre?.paymentType} />
                  <Cell.Item title="税费说明" value={dataSoucre?.taxes} />
                  <Cell.Item title="物流说明" value={dataSoucre?.logistics} />
                  <Cell.Item title="包装说明" value={dataSoucre?.packRequire} />
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
        <View className={styles['inquiryDetailContainer-btnBox']}>
          <View className={styles['inquiryDetailContainer-touchableOpacity']}>
            <View
              className={styles['inquiryDetailContainer-defaultBtn']}
              onClick={() => handleAuditLayout(STATE_TYPE.NOT_PASS)}
            >
              <Text className={styles['inquiryDetailContainer-btnText']}>审核不通过</Text>
            </View>
          </View>
          <View className={styles['inquiryDetailContainer-touchableOpacity']}>
            <View
              className={styles['inquiryDetailContainer-primaryBtn']}
              onClick={() => handleAuditLayout(STATE_TYPE.PASS)}
            >
              <Text
                className={cx(styles['inquiryDetailContainer-btnText'], styles['inquiryDetailContainer-primaryText'])}
              >
                审核通过
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
export default OfferDetailLayout

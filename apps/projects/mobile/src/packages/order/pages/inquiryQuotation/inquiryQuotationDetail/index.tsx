import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useCallback, useEffect } from 'react'
import cx from 'classnames'
import {
  pxTransform,
  getCurrentInstance,
  setNavigationBarTitle,
  setClipboardData,
  preload,
  useRouter,
  downloadFile,
  openDocument,
} from '@apps/mobile-services/utils/taro'
import { View, Text, Icons, Toast, Image, ScrollView } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import { dateFmt } from '@/utils/date'
import ImageBox from '@/components/ImageBox'
import useStores from '@/store/useStores'
import {
  getTradeMobileEnquiryProductAll,
  getTradeMobileNotarizeEnquiryProductQuotationDetails,
  postTradeMobileNotarizeEnquiryQuotedPriceAffirm,
  postTradeMobileNotarizeEnquiryQuotedPriceAudit,
  postTradeMobileNotarizeEnquiryQuotedPriceAuditTwo,
  postTradeMobileNotarizeEnquiryQuotedPriceSubmit,
} from '@apps/apis'
import styles from './index.module.scss'
import { IS_WEB } from '@/constants'
const InquiryQuotationDetail: React.FC<{}> = () => {
  const {
    params: { id, PAGE },
  } = useRouter()
  const params = getCurrentInstance().preloadData as any
  const { refresh } = params
  const intl = useIntl()
  const {
    purchaseOrderStore: { setShopMessageStore },
    userStore: { shopAndSite },
  } = useStores()
  const { safeBottomHeight } = useSafeArea()
  const [dataSource, setDataSource] = React.useState<any>({})

  /* 头部标题 */
  const scrollView = (evt) => {
    const contentOffsetY: number = evt.detail.scrollTop
    if (Math.round(contentOffsetY) >= 45) {
      setNavigationBarTitle({
        title: dataSource?.interiorStateName,
      })
    } else {
      setNavigationBarTitle({
        title: '',
      })
    }
  }
  const fetchGetApi = useCallback(async () => {
    await getTradeMobileNotarizeEnquiryProductQuotationDetails({
      id,
    }).then((res) => {
      if (res.code !== 1000) {
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
          icon: 'none',
        })
        return
      }
      if (res.data?.inquiryListId) {
        getTradeMobileEnquiryProductAll({
          id: res.data?.inquiryListId,
        }).then((_res: any) => {
          if (res.code !== 1000) {
            Toast.show(_res.message)
            return
          }
          console.log(_res.data, '_res.data')
          res.data.products1 = [..._res.data]
        })
      }
      setDataSource(res.data)
    })
  }, [])
  useEffect(() => {
    fetchGetApi()
  }, [])

  /** 审核提交 */
  const handleSubmit = async () => {
    let PostFn
    const param = {
      id,
      state: 1,
    }
    switch (PAGE) {
      case 'WAIT':
        PostFn = await postTradeMobileNotarizeEnquiryQuotedPriceSubmit
        break
      case 'ONE':
        PostFn = await postTradeMobileNotarizeEnquiryQuotedPriceAudit
        break
      case 'TWO':
        PostFn = await postTradeMobileNotarizeEnquiryQuotedPriceAuditTwo
        break
      default:
        PostFn = await postTradeMobileNotarizeEnquiryQuotedPriceAffirm
        break
    }
    FullScreenLoading.show()
    PostFn(param).then((res) => {
      if (res.code !== 1000) {
        FullScreenLoading.hide()
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
        })
        return
      }
      FullScreenLoading.hide()
      refresh()
      Router.navigateBack()
    })
  }
  const clipboard = (dataText: any) => {
    setClipboardData({
      data: dataText,
      success: () => {
        Toast.show({
          title: intl.formatMessage({
            id: 'inquiryQuotation.fuzhichenggong',
            defaultMessage: '内容复制成功',
          }),
          icon: 'none',
        })
      },
    })
  }
  const handleStatusLayout = () => {
    preload('params', {
      externalInquiryListStateResponses: dataSource?.externalQuotationStateResponses,
      externalInquiryListLogResponses: dataSource?.externalRequisitionFormResponses,
      interiorRequisitionFormStateResponses: dataSource?.interiorQuotationStateResponses,
      interiorInquiryListLogResponses: dataSource?.interiorQuotationLogResponses,
    })
    Router.navigateTo('order/statusLayout')
  }

  /** 生成订单 */
  const handleGrowthOrder = () => {
    console.log(dataSource, 'dataSource')
    const payload: any = {
      [`shopId_${dataSource?.products1[0]?.memberId}`]: dataSource.products1.map((productInfo: any) => ({
        quoteId: dataSource.id,
        quoteNo: dataSource.quotationNo,
        brand: productInfo?.brand,
        commodityId: productInfo?.commodityId,
        commodityLogo: productInfo?.imgUrl,
        commoditySku: [],
        count: productInfo?.purchaseCount,
        customerCategoryName: productInfo?.category,
        estimatePrice: 0,
        // 预计到手价，购物车那边说不用传
        id: '',
        // 购物车id，无
        isMemberPrice: '',
        isPublish: true,
        logistics: productInfo?.logistics,
        memberId: productInfo?.memberId,
        memberName: productInfo?.memberName,
        memberRoleId: productInfo?.memberRoleId,
        minOrder: productInfo?.minOrder,
        name: productInfo?.productName,
        newAction: '',
        // 当前阶梯
        newPrice: productInfo?.price,
        // 当前价格，购物车那边说目前只传阶梯价哇
        money: productInfo?.money,
        price: productInfo?.price,
        parameter: '',
        priceType: 1,
        skuId: productInfo?.productId,
        stockCount: productInfo?.stockCount,
        taxRate: productInfo?.taxRate,
        topActivityDetail: {},
        // 购物车那边说是 顶部的活动，不用传哇
        unitName: productInfo?.unit,
        unitPrice: '',
        upperCommodityId: productInfo?.upperCommoditySkuId,
        upperMemberId: productInfo?.upperMemberId,
        upperMemberName: productInfo?.upperMemberName,
        upperMemberRoleId: productInfo?.upperMemberRoleId,
        upperMemberRoleName: productInfo?.upperMemberRoleName,
        storeId: shopAndSite?.id,
        commodityAreaList: productInfo?.commodityAreaList,
        isAllArea: productInfo?.isAllArea,
        isCrossBorder: productInfo.isCrossBorder || false,
      })),
    }
    console.log(payload)
    setShopMessageStore(payload)
    Router.navigateTo('order/ConfirmOrder', {
      quoteId: dataSource.id,
    })
  }
  const handleLink = (code, inquryid: number, IPAGE: string) => {
    preload({
      id: inquryid,
      PAGE: IPAGE,
    })
    Router.navigateTo(code, {
      id,
      PAGE,
    })
  }
  const handleAuditLayout = () => {
    preload({
      id,
      PAGE,
      refresh,
    })
    Router.navigateTo('order/inquiryQuotation/inquiryQuotationAudit')
  }

  /**
   * 文档预览
   * @param url
   */
  const previewDocFile = (url) => {
    if (IS_WEB) {
      window.open(url)
    } else {
      downloadFile({
        url,
        success: (res) => {
          const filePath = res.tempFilePath
          openDocument({
            filePath,
            success: () => {
              console.log('打开文档成功')
            },
          })
        },
      })
    }
  }
  const renderFile = (url: string, name: string) => {
    const index = url.lastIndexOf('.')
    const fileType = url.slice(index + 1)
    if (['bmp', 'jpg', 'jpeg', , 'png', 'gif', 'image'].includes(fileType)) {
      return (
        <View className={styles['inquiryQuotationDetail-uploadBoxItem']} key={url}>
          <View className={styles['inquiryQuotationDetail-uploadItem']}>
            <ImageBox width={78} height={78} source={url} canPreview />
          </View>
        </View>
      )
    } else {
      return (
        <View
          className={styles['inquiryQuotationDetail-uploadBoxFileItem']}
          key={url}
          onClick={() => previewDocFile(url)}
        >
          <View className={styles['inquiryQuotationDetail-fileItem']}>
            <Text>{name}</Text>
          </View>
        </View>
      )
    }
  }
  return (
    <View
      className={styles['inquiryQuotationDetail']}
      style={
        safeBottomHeight
          ? {
              paddingBottom: `${safeBottomHeight}PX`,
            }
          : {}
      }
    >
      <FullScreenLoading />
      <View
        style={{
          flex: 1,
          overflow: 'scroll',
        }}
      >
        <ScrollView onScroll={scrollView} className={styles['inquiryQuotationDetail-scrollView']}>
          <View className={styles['inquiryQuotationDetail-scrollBox']}>
            <View className={styles['inquiryQuotationDetail-status']}>
              <View className={styles['inquiryQuotationDetail-statusLine']} onClick={() => handleStatusLayout()}>
                <Text className={styles['inquiryQuotationDetail-statusText']}>{dataSource?.interiorStateName}</Text>
                <Icons name="ChevronRight" size={14} color="#FFFFFF" />
              </View>
            </View>
            <View className={styles['inquiryQuotationDetail-contextBox']}>
              <View className={styles['inquiryQuotationDetail-productInfo']}>
                <View className={styles['inquiryQuotationDetail-productInfoTitle']}>
                  <View className={styles['inquiryQuotationDetail-docLine']} />
                  <Text className={styles['inquiryQuotationDetail-productName']}>{dataSource?.details}</Text>
                </View>
                <View className={styles['inquiryQuotationDetail-productInfoNo']}>
                  <Text className={styles['inquiryQuotationDetail-productNo']}>{dataSource?.inquiryListNo}</Text>
                  <View>
                    <Text
                      onClick={() => clipboard(dataSource?.inquiryListNo)}
                      className={styles['inquiryQuotationDetail-textCopyStyle']}
                    >
                      {intl.formatMessage({
                        id: 'inquiryQuotation.fuzhi',
                        defaultMessage: '复制',
                      })}
                    </Text>
                  </View>
                </View>
              </View>
              <MellowCard
                title={intl.formatMessage({
                  id: 'inquiryQuotation.jibenxinxi',
                  defaultMessage: '基本信息',
                })}
                className={styles['inquiryQuotationDetail-customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <Cell>
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiryQuotation.baojiadanhao',
                      defaultMessage: '报价单号',
                    })}
                    value={
                      <View className={styles['inquiryQuotationDetail-productInfoNo']}>
                        <Text className={styles['inquiryQuotationDetail-productNo']}>{dataSource?.quotationNo}</Text>
                        <View>
                          <Text
                            onClick={() => clipboard(dataSource?.quotationNo)}
                            className={styles['inquiryQuotationDetail-textCopyStyle']}
                          >
                            {intl.formatMessage({
                              id: 'inquiryQuotation.fuzhi',
                              defaultMessage: '复制',
                            })}
                          </Text>
                        </View>
                      </View>
                    }
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiryQuotation.baojiadanzhaiyao',
                      defaultMessage: '报价单摘要',
                    })}
                    value={dataSource?.details}
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiryQuotation.baojiahuiyuan',
                      defaultMessage: '报价会员',
                    })}
                    value={dataSource?.supplyMembersName}
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiryQuotation.baojiajiezhishijian',
                      defaultMessage: '报价截止时间',
                    })}
                    value={dateFmt(new Date(dataSource?.quotationAsTime))}
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiryQuotation.duiyingxunjiadanhao',
                      defaultMessage: '对应询价单号',
                    })}
                    value={dataSource?.inquiryListNo}
                    hasArrow
                    clickable
                    onPress={() => handleLink('order/inquiry/inquiryDetail', dataSource?.inquiryListId, 'PREVIEW')}
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiryQuotation.danjushijian',
                      defaultMessage: '单据时间',
                    })}
                    value={dateFmt(new Date(dataSource?.voucherTime))}
                  />
                </Cell>
              </MellowCard>
              <MellowCard
                title={intl.formatMessage({
                  id: 'inquiryQuotation.shangpinbaojia',
                  defaultMessage: '商品报价',
                })}
                className={styles['inquiryQuotationDetail-customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                {(dataSource?.products || []).map((item: any) => (
                  <View className={styles['inquiryQuotationDetail-productBox']} key={`box_${item.id}`}>
                    <View className={styles['inquiryQuotationDetail-productImage']}>
                      <Image className={styles['inquiryQuotationDetail-productImageItem']} src={item.imgUrl} />
                    </View>
                    <View className={styles['inquiryQuotationDetail-productWrap']}>
                      <Text className={styles['inquiryQuotationDetail-productWrapTitle']}>{item.productName}</Text>
                      <View className={styles['inquiryQuotationDetail-countBox']}>
                        <View>
                          <Text className={styles['inquiryQuotationDetail-productWrapCount']}>
                            {intl.formatMessage({
                              id: 'inquiryQuotation.baojiadanwei',
                              defaultMessage: '报价单位',
                            })}
                            ：
                          </Text>
                          <Text
                            className={styles['inquiryQuotationDetail-productWrapCount']}
                            style={{
                              color: '#252D37',
                            }}
                          >{`${intl.formatMessage({
                            id: 'currency',
                            defaultMessage: '￥',
                          })}${item.price}/${item.unit}`}</Text>
                        </View>
                        <View>
                          <Text className={styles['inquiryQuotationDetail-productWrapCount']}>
                            {intl.formatMessage({
                              id: 'inquiryQuotation.caigoushuliang',
                              defaultMessage: '采购数量',
                            })}
                            ：
                          </Text>
                          <Text
                            className={styles['inquiryQuotationDetail-productWrapCount']}
                            style={{
                              color: '#252D37',
                            }}
                          >
                            {item.purchaseCount}
                          </Text>
                        </View>
                      </View>
                      <View className={styles['inquiryQuotationDetail-countBoxText']}>
                        <Text className={styles['inquiryQuotationDetail-productWrapCount']}>
                          {intl.formatMessage({
                            id: 'inquiryQuotation.jine',
                            defaultMessage: '金额',
                          })}
                          ：
                        </Text>
                        <Text
                          className={styles['inquiryQuotationDetail-productWrapCount']}
                          style={{
                            color: '#252D37',
                            fontSize: pxTransform(14),
                          }}
                        >{`${intl.formatMessage({
                          id: 'currency',
                          defaultMessage: '￥',
                        })}${item.money}`}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </MellowCard>
              <MellowCard
                title={intl.formatMessage({
                  id: 'inquiryQuotation.jiaoyitiaojian',
                  defaultMessage: '交易条件',
                })}
                className={styles['inquiryQuotationDetail-customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <Cell>
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiryQuotation.jiaofushijian',
                      defaultMessage: '交付时间',
                    })}
                    value={dateFmt(new Date(dataSource?.deliveryTime))}
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiryQuotation.jiaofudizhi',
                      defaultMessage: '交付地址',
                    })}
                    value={dataSource?.fullAddress}
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiryQuotation.baojiajiezhishijian',
                      defaultMessage: '报价截止时间',
                    })}
                    value={dateFmt(new Date(dataSource?.quotationAsTime))}
                  />
                </Cell>
              </MellowCard>
              <MellowCard
                title={intl.formatMessage({
                  id: 'inquiryQuotation.qitashuoming',
                  defaultMessage: '其他说明',
                })}
                className={styles['inquiryQuotationDetail-customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <Cell>
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiryQuotation.baojiayaoqiu',
                      defaultMessage: '报价要求',
                    })}
                    value={
                      dataSource?.offer ||
                      intl.formatMessage({
                        id: 'inquiryQuotation.wu',
                        defaultMessage: '无',
                      })
                    }
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiryQuotation.fukuanfangshi',
                      defaultMessage: '付款方式',
                    })}
                    value={
                      dataSource?.paymentType ||
                      intl.formatMessage({
                        id: 'inquiryQuotation.wu',
                        defaultMessage: '无',
                      })
                    }
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiryQuotation.shuifeiyaoqiu',
                      defaultMessage: '税费要求',
                    })}
                    value={
                      dataSource?.taxes ||
                      intl.formatMessage({
                        id: 'inquiryQuotation.wu',
                        defaultMessage: '无',
                      })
                    }
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiryQuotation.wuliuyaoqiu',
                      defaultMessage: '物流要求',
                    })}
                    value={
                      dataSource?.logistics ||
                      intl.formatMessage({
                        id: 'inquiryQuotation.wu',
                        defaultMessage: '无',
                      })
                    }
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiryQuotation.baozhuangyaoqiu',
                      defaultMessage: '包装要求',
                    })}
                    value={
                      dataSource?.packRequire ||
                      intl.formatMessage({
                        id: 'inquiryQuotation.wu',
                        defaultMessage: '无',
                      })
                    }
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiryQuotation.qitayaoqiu',
                      defaultMessage: '其他要求',
                    })}
                    value={
                      dataSource?.otherRequire ||
                      intl.formatMessage({
                        id: 'inquiryQuotation.wu',
                        defaultMessage: '无',
                      })
                    }
                  />
                </Cell>
              </MellowCard>
              <MellowCard
                title={intl.formatMessage({
                  id: 'inquiryQuotation.fujian',
                  defaultMessage: '附件',
                })}
                className={styles['inquiryQuotationDetail-customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <View className={styles['inquiryQuotationDetail-uploadBox']}>
                  {(dataSource?.enclosureUrls || []).map((item: any) => renderFile(item.url, item.name))}
                </View>
              </MellowCard>
            </View>
          </View>
        </ScrollView>
      </View>
      {PAGE !== 'PREVIEW' && (
        <>
          {(PAGE === 'WAIT' || PAGE === 'ONE' || PAGE === 'TWO') && (
            <View className={styles['inquiryQuotationDetail-btnBox']}>
              <View className={styles['inquiryQuotationDetail-touchableOpacity']} onClick={() => handleAuditLayout()}>
                <View className={styles['inquiryQuotationDetail-defaultBtn']}>
                  <Text className={styles['inquiryQuotationDetail-btnText']}>
                    {intl.formatMessage({
                      id: 'inquiryQuotation.shenhebutongguo',
                      defaultMessage: '审核不通过',
                    })}
                  </Text>
                </View>
              </View>
              <View className={styles['inquiryQuotationDetail-touchableOpacity']} onClick={() => handleSubmit()}>
                <View className={styles['inquiryQuotationDetail-primaryBtn']}>
                  <Text
                    className={cx(
                      styles['inquiryQuotationDetail-btnText'],
                      styles['inquiryQuotationDetail-primaryText'],
                    )}
                  >
                    {intl.formatMessage({
                      id: 'inquiryQuotation.shenhetongguo',
                      defaultMessage: '审核通过',
                    })}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {PAGE === 'SUBMIT' && (
            <View className={styles['inquiryQuotationDetail-btnBox']}>
              <View className={styles['inquiryQuotationDetail-touchableOpacity']} onClick={() => handleAuditLayout()}>
                <View className={styles['inquiryQuotationDetail-defaultBtn']}>
                  <Text className={styles['inquiryQuotationDetail-btnText']}>
                    {intl.formatMessage({
                      id: 'inquiryQuotation.bujieshoubaojia',
                      defaultMessage: '不接受报价',
                    })}
                  </Text>
                </View>
              </View>
              <View className={styles['inquiryQuotationDetail-touchableOpacity']} onClick={() => handleSubmit()}>
                <View className={styles['inquiryQuotationDetail-primaryBtn']}>
                  <Text
                    className={cx(
                      styles['inquiryQuotationDetail-btnText'],
                      styles['inquiryQuotationDetail-primaryText'],
                    )}
                  >
                    {intl.formatMessage({
                      id: 'inquiryQuotation.jieshoubaojia',
                      defaultMessage: '接受报价',
                    })}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {PAGE === 'GROWTH' && (
            <View className={styles['inquiryQuotationDetail-btnBox']}>
              <View className={styles['inquiryQuotationDetail-touchableOpacity']} onClick={() => handleGrowthOrder()}>
                <View className={styles['inquiryQuotationDetail-primaryBtn']}>
                  <Text
                    className={cx(
                      styles['inquiryQuotationDetail-btnText'],
                      styles['inquiryQuotationDetail-primaryText'],
                    )}
                  >
                    {intl.formatMessage({
                      id: 'inquiryQuotation.shengchengdingdan',
                      defaultMessage: '生成订单',
                    })}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  )
}
export default GlobalWrapper(InquiryQuotationDetail)

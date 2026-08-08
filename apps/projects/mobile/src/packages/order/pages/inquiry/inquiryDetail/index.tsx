import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useCallback, useEffect } from 'react'
import cx from 'classnames'
import { View, Text, Icons, Toast, Image, ScrollView } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import {
  setClipboardData,
  downloadFile,
  openDocument,
  getCurrentInstance,
  preload,
  setNavigationBarTitle,
} from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import { dateFmt } from '@/utils/date'
import ImageBox from '@/components/ImageBox'
import {
  getTradeMobileInquiryListDetails,
  postTradeMobileInquiryDocumentsReview,
  postTradeMobileInquiryDocumentsReviewTwo,
  postTradeMobileInquirySubmit,
} from '@apps/apis'
import styles from './index.module.scss'
import { IS_WEB } from '@/constants'
const InquiryDetailLayout: React.FC<{}> = () => {
  const params = getCurrentInstance().preloadData as any
  const { id, PAGE }: any = getCurrentInstance()?.router?.params
  const intl = useIntl()
  const { refresh } = params || {}
  const { safeBottomHeight } = useSafeArea()
  const [dataSoucre, setDataSoucre] = React.useState<any>({})

  /* 头部标题 */
  const scrollView = (evt) => {
    const contentOffsetY: number = evt.detail.scrollTop
    if (Math.round(contentOffsetY) >= 45) {
      setNavigationBarTitle({
        title: dataSoucre?.interiorStateName,
      })
    } else {
      setNavigationBarTitle({
        title: '',
      })
    }
  }
  const fetchGetApi = useCallback(async () => {
    await getTradeMobileInquiryListDetails({
      id: id!,
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
      setDataSoucre(res.data)
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
      case 'ONE':
        PostFn = await postTradeMobileInquiryDocumentsReview
        break
      case 'TWO':
        PostFn = await postTradeMobileInquiryDocumentsReviewTwo
        break
      default:
        PostFn = await postTradeMobileInquirySubmit
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
      Router.navigateBack()
    })
  }
  const clipboard = (dataText: any) => {
    setClipboardData({
      data: dataText,
      success: () => {
        Toast.show({
          title: intl.formatMessage({
            id: 'inquiry.fuzhichenggong',
            defaultMessage: '内容复制成功',
          }),
          icon: 'none',
        })
      },
    })
  }
  const handleStatusLayout = () => {
    preload('params', {
      externalInquiryListStateResponses: dataSoucre?.externalInquiryListStateResponses,
      externalInquiryListLogResponses: dataSoucre?.externalInquiryListLogResponses,
      interiorRequisitionFormStateResponses: dataSoucre?.interiorRequisitionFormStateResponses,
      interiorInquiryListLogResponses: dataSoucre?.interiorInquiryListLogResponses,
    })
    Router.navigateTo('order/statusLayout')
  }
  const handleAuditLayout = () => {
    preload({
      id,
      PAGE,
      refresh,
    })
    Router.navigateTo('order/inquiry/inquiryAudit')
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
        <View className={styles['inquiryDetailContainer-uploadBoxItem']} key={url}>
          <View className={styles['inquiryDetailContainer-uploadItem']}>
            <ImageBox width={78} height={78} source={url} canPreview />
          </View>
        </View>
      )
    } else {
      return (
        <View
          className={styles['inquiryDetailContainer-uploadBoxFileItem']}
          key={url}
          onClick={() => previewDocFile(url)}
        >
          <View className={styles['inquiryDetailContainer-fileItem']}>
            <Text>{name}</Text>
          </View>
        </View>
      )
    }
  }
  return (
    <View
      className={styles['inquiryDetailContainer']}
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
        <ScrollView onScroll={scrollView} className={styles['inquiryDetailContainer-scrollView']}>
          <View className={styles['inquiryDetailContainer-scrollBox']}>
            <View className={styles['inquiryDetailContainer-status']}>
              <View className={styles['inquiryDetailContainer-statusLine']} onClick={() => handleStatusLayout()}>
                <Text className={styles['inquiryDetailContainer-statusText']}>{dataSoucre?.interiorStateName}</Text>
                <Icons name="ChevronRight" size={14} color="#FFFFFF" />
              </View>
            </View>
            <View className={styles['inquiryDetailContainer-contextBox']}>
              <View className={styles['inquiryDetailContainer-productInfo']}>
                <View className={styles['inquiryDetailContainer-productInfoTitle']}>
                  <View className={styles['inquiryDetailContainer-docLine']} />
                  <Text className={styles['inquiryDetailContainer-productName']}>{dataSoucre?.details}</Text>
                </View>
                <View className={styles['inquiryDetailContainer-productInfoNo']}>
                  <Text className={styles['inquiryDetailContainer-productNo']}>{dataSoucre?.inquiryListNo}</Text>
                  <View>
                    <Text
                      onClick={() => clipboard(dataSoucre?.inquiryListNo)}
                      className={styles['inquiryDetailContainer-textCopyStyle']}
                    >
                      {intl.formatMessage({
                        id: 'inquiry.fuzhi',
                        defaultMessage: '复制',
                      })}
                    </Text>
                  </View>
                </View>
              </View>
              <MellowCard
                title={intl.formatMessage({
                  id: 'inquiry.jibenxinxi',
                  defaultMessage: '基本信息',
                })}
                className={styles['inquiryDetailContainer-customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <Cell>
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiry.xunjiadanhao',
                      defaultMessage: '询价单号',
                    })}
                    value={dataSoucre?.inquiryListNo}
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiry.xuqiuzhaiyao',
                      defaultMessage: '需求摘要',
                    })}
                    value={dataSoucre?.details}
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiry.beixunjiahuiyuan',
                      defaultMessage: '被询价会员',
                    })}
                    value={dataSoucre?.memberName}
                  />
                </Cell>
              </MellowCard>
              <MellowCard
                title={intl.formatMessage({
                  id: 'inquiry.xunjiashangpin',
                  defaultMessage: '询价商品',
                })}
                className={styles['inquiryDetailContainer-customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                {(dataSoucre?.inquiryListProductRequests || []).map((item: any) => (
                  <View className={styles['inquiryDetailContainer-productBox']} key={`box_${item.id}`}>
                    <View className={styles['inquiryDetailContainer-productImage']}>
                      <Image className={styles['inquiryDetailContainer-productImageItem']} src={item.imgUrl} />
                    </View>
                    <View className={styles['inquiryDetailContainer-productWrap']}>
                      <Text className={styles['inquiryDetailContainer-productWrapTitle']}>{item.productName}</Text>
                      <Text
                        className={styles['inquiryDetailContainer-productWrapCount']}
                      >{`x${item.purchaseCount}`}</Text>
                    </View>
                  </View>
                ))}
              </MellowCard>
              <MellowCard
                title={intl.formatMessage({
                  id: 'inquiry.jiaoyitiaojian',
                  defaultMessage: '交易条件',
                })}
                className={styles['inquiryDetailContainer-customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <Cell>
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiry.jiaofushijian',
                      defaultMessage: '交付时间',
                    })}
                    value={dateFmt(new Date(dataSoucre?.deliveryTime))}
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiry.jiaofudizhi',
                      defaultMessage: '交付地址',
                    })}
                    value={dataSoucre?.fullAddress}
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiry.baojiajiezhishijian',
                      defaultMessage: '报价截止时间',
                    })}
                    value={dateFmt(new Date(dataSoucre?.quotationAsTime))}
                  />
                </Cell>
              </MellowCard>
              <MellowCard
                title={intl.formatMessage({
                  id: 'inquiry.qitashuoming',
                  defaultMessage: '其他说明',
                })}
                className={styles['inquiryDetailContainer-customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <Cell>
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiry.baojiayaoqiu',
                      defaultMessage: '报价要求',
                    })}
                    value={
                      dataSoucre?.offer ||
                      intl.formatMessage({
                        id: 'inquiry.wu',
                        defaultMessage: '无',
                      })
                    }
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiry.fukuanfangshi',
                      defaultMessage: '付款方式',
                    })}
                    value={
                      dataSoucre?.paymentType ||
                      intl.formatMessage({
                        id: 'inquiry.wu',
                        defaultMessage: '无',
                      })
                    }
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiry.shuifeiyaoqiu',
                      defaultMessage: '税费要求',
                    })}
                    value={
                      dataSoucre?.taxes ||
                      intl.formatMessage({
                        id: 'inquiry.wu',
                        defaultMessage: '无',
                      })
                    }
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiry.wuliuyaoqiu',
                      defaultMessage: '物流要求',
                    })}
                    value={
                      dataSoucre?.logistics ||
                      intl.formatMessage({
                        id: 'inquiry.wu',
                        defaultMessage: '无',
                      })
                    }
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiry.baozhuangyaoqiu',
                      defaultMessage: '包装要求',
                    })}
                    value={
                      dataSoucre?.packRequire ||
                      intl.formatMessage({
                        id: 'inquiry.wu',
                        defaultMessage: '无',
                      })
                    }
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'inquiry.qitayaoqiu',
                      defaultMessage: '其他要求',
                    })}
                    value={
                      dataSoucre?.otherRequire ||
                      intl.formatMessage({
                        id: 'inquiry.wu',
                        defaultMessage: '无',
                      })
                    }
                  />
                </Cell>
              </MellowCard>
              <MellowCard
                title={intl.formatMessage({
                  id: 'inquiry.fujian',
                  defaultMessage: '附件',
                })}
                className={styles['inquiryDetailContainer-customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <View className={styles['inquiryDetailContainer-uploadBox']}>
                  {(dataSoucre?.enclosureUrls || []).map((item: any) => renderFile(item.url, item.name))}
                </View>
              </MellowCard>
            </View>
          </View>
        </ScrollView>
      </View>
      {PAGE !== 'PREVIEW' && (
        <>
          {(PAGE === 'ONE' || PAGE === 'TWO') && (
            <View className={styles['inquiryDetailContainer-btnBox']}>
              <View className={styles['inquiryDetailContainer-touchableOpacity']} onClick={() => handleAuditLayout()}>
                <View className={styles['inquiryDetailContainer-defaultBtn']}>
                  <Text className={styles['inquiryDetailContainer-btnText']}>
                    {intl.formatMessage({
                      id: 'inquiry.shenhebutongguo',
                      defaultMessage: '审核不通过',
                    })}
                  </Text>
                </View>
              </View>
              <View className={styles['inquiryDetailContainer-touchableOpacity']} onClick={() => handleSubmit()}>
                <View className={styles['inquiryDetailContainer-primaryBtn']}>
                  <Text
                    className={cx(
                      styles['inquiryDetailContainer-btnText'],
                      styles['inquiryDetailContainer-primaryText'],
                    )}
                  >
                    {intl.formatMessage({
                      id: 'inquiry.shenhetongguo',
                      defaultMessage: '审核通过',
                    })}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {PAGE === 'SUBMIT' && (
            <View className={styles['inquiryDetailContainer-btnBox']}>
              <View className={styles['inquiryDetailContainer-touchableOpacity']} onClick={() => handleSubmit()}>
                <View className={styles['inquiryDetailContainer-primaryBtn']}>
                  <Text
                    className={cx(
                      styles['inquiryDetailContainer-btnText'],
                      styles['inquiryDetailContainer-primaryText'],
                    )}
                  >
                    {intl.formatMessage({
                      id: 'inquiry.tijiao',
                      defaultMessage: '提交',
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
export default GlobalWrapper(InquiryDetailLayout)

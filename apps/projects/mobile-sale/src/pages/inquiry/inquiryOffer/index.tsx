import React, { useEffect, useRef, useState } from 'react'
import {
  getCurrentPages,
  preload,
  downloadFile,
  openDocument,
  getCurrentInstance,
  setNavigationBarTitle,
  showLoading,
  hideLoading,
  chooseMessageFile,
} from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { View, ScrollView, Text, Icons, Toast, Input, Radio, Button, Image } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import Popup from '@/components/Popup'
import Search from '@/components/Search'
import GenIndicator from '@/components/GenIndicator'
import { getMemberMobileInfoUsersPage } from '@apps/apis'
import {
  GetTradeAppletProductInquiryDetailsResponse,
  getTradeAppletProductInquiryDetails,
  postTradeAppletProductQuotationAdd,
} from '@apps/apis'
import { dateFormat } from '@/utils/date'
import uploadFileRequest, { uuid } from '@/utils/uploadFileRequest'
import defaultImage from '@/assets/images/default_img.png'
import styles from './index.module.scss'
import { useTelCode } from '@apps/services'

export interface Other {
  /** 交付说明 */
  deliveryInstructions?: string
  /** 税费要求 */
  taxes?: string
  /** 物流要求 */
  logistics?: string
  /** 包装要求 */
  packRequire?: string
  /** 其他要求 */
  otherRequire?: string
  /** 付款方式 */
  paymentType?: string
}

let flag: boolean = true

const InquiryOfferLayout = () => {
  const params = getCurrentInstance().preloadData as any
  const { id } = params
  const { safeBottomHeight } = useSafeArea()
  const [visible, setVisible] = useState<boolean>(false)
  const [noMoreDate, setNoMoreData] = useState<boolean>(false)
  const [dataSoucre, setDataSoucre] = useState<GetTradeAppletProductInquiryDetailsResponse>()
  const [other, setOther] = useState<Other>({})
  const [record, setRecord] = useState<any>({})

  const loadMoreLoading = useRef<boolean>(false)
  const [current, setCurrent] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [contentList, setContentList] = useState<any[]>([])
  const [countryList, setCountryList] = useState<any>({})
  const [enclosureUrls, setEnclosureUrls] = useState<any[]>([])
  const { telColOptions } = useTelCode()

  useEffect(() => {
    if (telColOptions && telColOptions.length > 0) {
      setCountryList({
        code: telColOptions[0]?.value,
        phoneLength: telColOptions[0]?.phoneLength,
      })
    }
  }, [telColOptions])

  /* 头部标题 */
  const scrollView = (evt) => {
    const contentOffsetY: number = evt.detail.scrollTop
    if (Math.round(contentOffsetY) >= 45) {
      setNavigationBarTitle({ title: dataSoucre?.externalStateName || '' })
    } else {
      setNavigationBarTitle({ title: '' })
    }
  }

  // const clipboard = (dataText: any) => {
  //   setClipboardData({
  //     data: dataText,
  //     success: () => {
  //       Toast.show({ title: '内容复制成功', icon: 'none' });
  //     }
  //   })
  // }

  const handleCheck = (item) => {
    setRecord({ ...record, ...item })
  }

  const renderItem = ({ item }: { item: any }) => (
    <View className={styles['box']}>
      <View className={styles['box-left']}>
        <Text className={styles['box-left-name']}>{item?.name}</Text>
        <Text className={styles['box-left-phone']}>{item?.phone}</Text>
      </View>
      <View className={styles['box-right']}>
        <Text className={styles['box-right-name']}>{item?.jobTitle}</Text>
        <Radio value={item} size={16} />
      </View>
    </View>
  )

  const renderDataSource = (item) => {
    const data = [...dataSoucre!.inquiryListProductRequests]
    data.forEach((_item) => {
      if (_item.productId === item.productId) {
        _item.money = item.money
        _item.price = item.price
      }
    })
    dataSoucre!.inquiryListProductRequests = [...data]
    setDataSoucre({ ...dataSoucre } as any)
  }

  /** 修改报价或者报价商品 */
  const handleProductOffer = (item) => {
    preload({
      item,
      render: (data) => {
        renderDataSource(data)
      },
    })
    Router.navigateTo('root/inquiry/productOffer')
  }

  const handleStatusLayout = () => {
    preload('params', {
      externalInquiryListStateResponses: dataSoucre?.externalInquiryListStateResponses,
      externalInquiryListLogResponses: dataSoucre?.externalInquiryListLogResponses,
      interiorRequisitionFormStateResponses: dataSoucre?.interiorRequisitionFormStateResponses,
      interiorInquiryListLogResponses: dataSoucre?.interiorInquiryListLogResponses,
    })
    Router.navigateTo('root/statusLayout')
  }

  /**
   * 查看历史报价
   */
  const handleViewHistory = (item: any) => {
    preload({
      commodity: item,
    })
    Router.navigateTo('root/inquiry/viewHistoryOffer')
  }

  const handleOther = () => {
    preload({
      other,
      getOther: (data: Other) => {
        setOther({ ...data })
      },
    })
    Router.navigateTo('root/inquiry/fillinOther')
  }

  const otherFlag = (info, lable1, label2) => {
    let name: string = JSON.stringify(info) === '{}' ? lable1 : label2
    return name
  }

  /** 通过api获取数据 */
  const fetchContentList = (currentPage?: number, merge: boolean = false) => {
    const param: any = {
      current: currentPage || current,
      pageSize,
    }
    if (keyword && flag) param.keyword = keyword

    getMemberMobileInfoUsersPage({ ...param }).then((res: any) => {
      if (res.code === 1000) {
        const { data } = res.data
        if (merge) {
          if (!data || data.length <= 0) {
            setNoMoreData(true)
            setCurrent(current - 1)
          } else {
            setContentList([...contentList, ...data])
            loadMoreLoading.current = false
            setNoMoreData(false)
          }
        } else {
          setContentList(data)
          loadMoreLoading.current = false
          if (data.length < pageSize) {
            setNoMoreData(true)
          } else {
            setNoMoreData(false)
          }
        }
        setRecord({ ...record, ...data[0] })
      }
    })
  }

  /** 加载更多 */
  const loadMoreData = () => {
    if (!loadMoreLoading.current && !noMoreDate) {
      loadMoreLoading.current = true
      setCurrent(current + 1)
      fetchContentList(current + 1, true)
    }
  }

  /** 搜索 */
  const handleSearchSubmit = (val: string) => {
    if (val) {
      setCurrent(1)
      flag = true
      setContentList([])
      loadMoreLoading.current = false
      setNoMoreData(false)
      fetchContentList()
    }
  }

  /** 清除搜索 */
  const handleClearSubmit = (val: string) => {
    setKeyword(val)
    setCurrent(1)
    flag = false
    setContentList([])
    loadMoreLoading.current = false
    setNoMoreData(false)
    fetchContentList()
  }

  useEffect(() => {
    /** 详情 */
    getTradeAppletProductInquiryDetails({ id } as any).then((res) => {
      if (res.code !== 1000) {
        Toast.show({ title: res.message, icon: 'none' })
        return
      }
      setDataSoucre(res.data)
    })
    fetchContentList()
  }, [])

  const handleSubmit = () => {
    const pattern = /^([1-9]\d*(\.\d{1,3})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
    let term: boolean = false
    let pages = getCurrentPages() // 获取当前的页面栈
    let prevPage = pages[pages.length - 3]
    const param = {
      details: record?.details,
      minimumOrder: record?.minimumOrder,
      contactId: record?.userId,
      contactName: record?.name,
      contactPhone: record?.phone,
      phoneCode: countryList?.code,
      inquiryListNo: dataSoucre?.inquiryListNo,
      inquiryListId: dataSoucre?.id,
      ...other,
      inquiryListProductRequests: dataSoucre?.inquiryListProductRequests.map((_item) => {
        return {
          id: _item?.id,
          money: _item?.money,
          price: _item?.price,
        }
      }),
      enclosureUrls,
    }
    if (!record?.details) {
      Toast.show({ title: '请输入报价单摘要', icon: 'none' })
      return
    }
    for (let _item of dataSoucre!.inquiryListProductRequests) {
      if (!_item.price) {
        Toast.show({ title: `请为商品${_item.productName}报价`, icon: 'none' })
        term = true
        break
      } else {
        term = false
      }
    }
    if (term) {
      return
    }
    if (!record?.minimumOrder) {
      Toast.show({ title: '请输入最小起订量', icon: 'none' })
      return
    }
    if (!pattern.test(record?.minimumOrder)) {
      Toast.show({ title: '最小起订量为数字格式,最长保留3位小数', icon: 'none' })
      return
    }
    if (!record?.name) {
      Toast.show({ title: '请选择报价联系人', icon: 'none' })
      return
    }
    if (!record?.phone) {
      Toast.show({ title: '请输入联系人电话', icon: 'none' })
      return
    }
    showLoading()
    postTradeAppletProductQuotationAdd({ ...param } as any).then((res) => {
      if (res.code !== 1000) {
        hideLoading()
        Toast.show({ title: res.message, icon: 'none' })
        return
      }
      hideLoading()
      prevPage.setData({ refresh: true })
      Router.navigateBack({
        delta: 2,
      })
    })
  }

  const handleInput = (e, name) => {
    const reg = /^\d*([.]?\d{0,3})$/
    if (name === 'minimumOrder') {
      if (reg.test(e)) {
        record[name] = e
      } else {
        record[name] = record[name]
      }
    } else {
      record[name] = e
    }
    setRecord({ ...record })
  }

  const handleChooseMessageFile = () => {
    chooseMessageFile({
      count: 1,
      type: 'file',
      success: async function (res) {
        const result = res.tempFiles.map((_item) => {
          return {
            ..._item,
            status: 'ready',
            _id: uuid(),
            path: _item?.path,
            fileName: _item?.name,
          }
        })
        showLoading()
        const uploadResult = await uploadFileRequest(result)

        const files = uploadResult.map((_item) => {
          return { name: _item.name, url: _item.url }
        })
        hideLoading()
        if (uploadResult.length > 0) {
          const filesList = [...enclosureUrls, ...files]
          setEnclosureUrls(filesList)
        }
        console.log(uploadResult)
      },
    })
  }

  const uploadClear = (index) => {
    const newFileList = enclosureUrls.filter((_item, idx) => idx !== index)
    setEnclosureUrls(newFileList)
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

  const handleLink = (code, inquryid: number, IPAGE: string) => {
    preload({
      id: inquryid,
      PAGE: IPAGE,
    })
    Router.navigateTo(code)
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
              {/* 基本信息 */}
              <MellowCard
                title="基本信息"
                className={styles['customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <Cell>
                  {/* <Cell.Item
                    title='报价单号'
                    value={
                      <View className={styles['customStyle-box']}>
                        <Text className={styles['customStyle-value']}>BJ3284723647</Text>
                        <View className={styles['customStyle-copy']} onClick={() => clipboard('BJ3284723647')}>
                          <Text className={styles['customStyle-copy-text']}>复制</Text>
                        </View>
                      </View>
                    }
                  /> */}
                  <Cell.Item
                    title="报价单摘要"
                    value={
                      <Input
                        placeholder="点击输入"
                        value={record?.details}
                        onChange={(e) => handleInput(e, 'details')}
                      />
                    }
                  />
                  <Cell.Item
                    title="对应询价单号"
                    value={dataSoucre?.inquiryListNo}
                    hasArrow
                    clickable
                    onPress={() => handleLink('root/inquiry/inquiryDetail', dataSoucre!.id, 'PREVIEW')}
                  />
                  <Cell.Item title="询价会员" value={dataSoucre?.inquiryListMemberName} />
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
                {dataSoucre?.inquiryListProductRequests &&
                  dataSoucre?.inquiryListProductRequests.map((item, index) => (
                    <View className={styles['product-box']} key={item.id * index}>
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
                        <View className={styles['product-box-right-operate']}>
                          <View
                            className={`${styles['product-box-right-operate-btn']} ${styles['product-box-right-operate-default']}`}
                            onClick={() => handleViewHistory(item)}
                          >
                            <Text className={styles['product-box-right-operate-default-text']}>查看历史报价</Text>
                          </View>
                          <View
                            className={`${styles['product-box-right-operate-btn']} ${styles['product-box-right-operate-success']}`}
                            onClick={() => handleProductOffer(item)}
                          >
                            <Text className={styles['product-box-right-operate-success-text']}>
                              {item.price ? '修改报价' : '报价'}
                            </Text>
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
                  <Cell.Item
                    title="最小起订量"
                    value={
                      <Input
                        placeholder="点击输入"
                        type="digit"
                        value={record?.minimumOrder}
                        onChange={(e) => handleInput(e, 'minimumOrder')}
                      />
                    }
                  />
                  <Cell.Item
                    title="报价联系人"
                    value={otherFlag(record?.name ? { name: record?.name } : {}, '请选择', record?.name)}
                    hasArrow
                    clickable
                    onPress={() => setVisible(true)}
                  />
                  <Cell.Item
                    title="联系电话"
                    value={
                      <Input
                        placeholder="点击输入"
                        value={record?.phone}
                        maxlength={countryList?.phoneLength}
                        onChange={(e) => handleInput(e, 'phone')}
                      />
                    }
                  />
                </Cell>
              </MellowCard>
              {/* 其他说明(选填) */}
              <MellowCard
                title="其他说明(选填)"
                className={styles['customStyle']}
                bodyStyle={{
                  padding: 0,
                }}
                extra={
                  <View className={styles['customStyle-extra']} onClick={() => handleOther()}>
                    <Text className={styles['customStyle-extra-text']}>{otherFlag(other, '点击填写', '点击修改')}</Text>
                    <View className={styles['customStyle-extra-arrow']}>
                      <Icons name="ChevronRight" size={14} color="#C0C4CC" />
                    </View>
                  </View>
                }
              />
              {/* 附件 */}
              <MellowCard title="附件" className={styles['customStyle']}>
                <View className={styles['upload']}>
                  <View className={styles['upload-box']}>
                    <View className={styles['upload-box-item']} onClick={() => handleChooseMessageFile()}>
                      <View className={styles['upload-box-item-wrap']} style={{ backgroundColor: '#ffffff' }}>
                        <Icons name="Plus" color="#C8CACD" className="upload-plus-icon" />
                      </View>
                    </View>
                  </View>
                  <View className={styles['upload-box']}>
                    {enclosureUrls.map((_item, index) => (
                      <View
                        className={styles['upload-box-item']}
                        key={index * 1}
                        onClick={() => handleOpenDocument(_item.url)}
                      >
                        <View className={styles['upload-box-item-wrap']}>
                          <View
                            className={styles['upload-box-item-wrap-clear']}
                            onClick={(e) => {
                              e.stopPropagation()
                              uploadClear(index)
                            }}
                          >
                            <Icons color="#C8CACD" name="MinusCircle" />
                          </View>
                          <Icons name="Production" size={34} color="#87acf7" />
                        </View>
                        <Text className={styles['upload-box-item-name']}>{_item?.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </MellowCard>
            </View>
          </View>
        </ScrollView>
      </View>
      <View className={styles['operate-box']}>
        <Button type="primary" onClick={() => handleSubmit()}>
          发起报价
        </Button>
      </View>
      <Popup
        title="选择联系人"
        visible={visible}
        customTitleStyle={{ borderBottom: 'none' }}
        customClassName={styles['customClassName']}
        onClose={() => setVisible(false)}
      >
        <View
          className={styles['popup-box']}
          style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
        >
          <Search
            clearable
            placeholder="请输入用户名称或者机构"
            onChange={(value) => setKeyword(value)}
            onSearch={(value) => handleSearchSubmit(value)}
            onClear={(value) => handleClearSubmit(value)}
          />
          <View className={styles['popup-scrollView']}>
            <Radio.Group onChange={handleCheck}>
              <ScrollView
                className={styles['flatList']}
                renderItem={renderItem}
                data={contentList}
                keyExtractor={(item: any) => `scrollItem${item.id}`}
                onEndReachedThreshold={50}
                horizontal={false}
                listFooterComponent={<GenIndicator noMoreDate={noMoreDate} />}
                onEndReached={() => {
                  loadMoreData()
                }}
              />
            </Radio.Group>
          </View>
        </View>
      </Popup>
    </View>
  )
}
export default InquiryOfferLayout

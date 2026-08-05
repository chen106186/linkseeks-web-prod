import React, { useEffect, useState, useMemo } from 'react'
import {
  getCurrentInstance,
  setStorageSync,
  navigateTo,
  downloadFile,
  openDocument,
} from '@apps/mobile-services/utils/taro'
import { View, ScrollView, Text, Icons, Toast, Image } from '@apps/mobile-ui'
import Router from '@/utils/router'
import cx from 'classnames'
// import { useSafeArea } from '@apps/mobile-services';
import {
  getProductMobileCommodityGoodsUsing,
  getProductMobileGoodsGetGoodsProcessDetail,
  getProductMobileMaterialProcessIsExistMaterialProcess,
  postProductMobileGoodsFreezeOrEnableGoods,
  postProductMobileGoodsGoodsExamine1,
  postProductMobileGoodsGoodsExamine2,
  postProductMobileGoodsGoodsExamineChange1,
  postProductMobileGoodsGoodsExamineChange2,
  postProductMobileGoodsSubmit,
} from '@apps/apis'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'
import NavBar from '@/components/NavBar'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import VerifyPopup from '@/components/VerifyPopup'

const RequisitionDetail: React.FC = () => {
  const params = getCurrentInstance().preloadData as any
  const { id, pageStatus, refresh, type } = params
  // const { safeBottomHeight } = useSafeArea();
  const [dataSource, setdataSource] = useState<any>({})
  const [title, setTitle] = useState('')

  const [auditLayout, setAuditLayout] = useState<boolean>(false)
  const [agree, setAgree] = useState<boolean>()

  /* 头部标题 */
  const scrollView = (evt) => {
    const contentOffsetY: number = evt.detail.scrollTop
    if (Math.round(contentOffsetY) >= 45) {
      setTitle(dataSource?.interiorStateName)
    } else {
      setTitle('')
    }
  }

  useEffect(() => {
    getProductMobileGoodsGetGoodsProcessDetail({ id } as any).then((res) => {
      if (res.code !== 1000) {
        Toast.show({ title: res.message, icon: 'none' })
        return
      }
      const old_subUnitConversionList =
        res.data?.goodsVersionResponse?.goods?.unitConversions &&
        res.data?.goodsVersionResponse?.goods?.unitConversions[0]?.subUnitConversionList
      const subUnitConversionList = res.data?.unitConversions && res.data?.unitConversions[0]?.subUnitConversionList
      const old_urls = res.data?.goodsVersionResponse?.goods?.urls
      const urls = res.data?.urls
      const old_materialAttributeList = res.data?.goodsVersionResponse?.goods?.materialAttributeList
      const materialAttributeList = res.data?.materialAttributeList
      const fn_ = (old, now, key, type) => {
        if (old) {
          const old_fn = (arr) => {
            arr.forEach((e) => {
              now.push({ ...e, old_: '（删除）' })
            })
          }
          now?.forEach((e, i) => {
            const old_i = old.findIndex((v) => v[key] === e[key])
            if (old_i !== -1) {
              const old_item = old.splice(old_i, 1)[0]
              e.old_ = old_item[type]
            }
            if (i === now.length - 1 && old.length) {
              old_fn(old)
            }
          })
        }
      }
      fn_(old_subUnitConversionList, subUnitConversionList, 'unitId', 'nums')
      fn_(old_urls, urls, 'url', 'url')
      const result: any = []
      if (materialAttributeList) {
        materialAttributeList.map((_item, i) => {
          if (old_materialAttributeList) {
            const old_i = old_materialAttributeList.findIndex(
              (v) => v.customerAttribute.id === _item.customerAttribute.id,
            )
            if (old_i !== -1) {
              const old_item = old_materialAttributeList.splice(old_i, 1)[0]
              result.push({
                title: _item.customerAttribute.name,
                value: _item.customerAttributeValueList
                  .map((_row) => {
                    return _row.value
                  })
                  .join(''),
                old_value: old_item.customerAttributeValueList
                  .map((_row) => {
                    return _row.value
                  })
                  .join(''),
              })
            } else {
              result.push({
                title: _item.customerAttribute.name,
                value: _item.customerAttributeValueList
                  .map((_row) => {
                    return _row.value
                  })
                  .join(''),
                // old_value: '（新增）',
              })
            }
            if (i === materialAttributeList.length - 1 && old_materialAttributeList.length) {
              old_materialAttributeList.forEach((e) => {
                result.push({
                  title: e.customerAttribute.name,
                  value: e.customerAttributeValueList
                    .map((_row) => {
                      return _row.value
                    })
                    .join(''),
                  old_value: '（删除）',
                })
              })
            }
          } else {
            result.push({
              title: _item.customerAttribute.name,
              value: _item.customerAttributeValueList
                .map((_row) => {
                  return _row.value
                })
                .join(''),
            })
          }
        })
      }
      setdataSource({ ...res.data, new_materialAttributeList: result })
    })
  }, [])

  const _submitBtnText = useMemo(() => {
    switch (dataSource?.interiorState) {
      case 99:
        return '冻结'
      case 0:
        return '启用'
      case 1:
      case 51:
        return '提交审核'
      default:
        return '审核通过'
    }
  }, [dataSource])

  /* 审核、冻结 */
  const handleAuditLayout = async (flag?: boolean) => {
    const tj1 = dataSource?.interiorState === 1
    const tj2 = dataSource?.interiorState === 51
    const tj = tj1 || tj2
    if (tj || dataSource?.interiorState === 0) {
      if (tj) {
        const materialGroupId = dataSource?.materialGroup?.id
        const param = {
          materialId: id,
          processType: tj1 ? '1' : '2',
        }
        if (materialGroupId) {
          param.materialGroupId = materialGroupId
        }
        const { data, code } = await getProductMobileMaterialProcessIsExistMaterialProcess(param)
        if (!(code === 1000 && data)) {
          Toast.show({ title: '该物料暂未关联物料审核工作流。', icon: 'none' })
          return
        }
      }
      const _fn =
        dataSource?.interiorState === 0
          ? postProductMobileGoodsFreezeOrEnableGoods({
              goodsId: id,
              status: 1,
            })
          : postProductMobileGoodsSubmit({
              id,
            })
      _fn.then((res) => {
        if (res.code === 1000) {
          Router.navigateBack({
            success: () => {
              refresh()
            },
          })
        }
      })
    } else {
      if (dataSource.interiorState === 99) {
        getProductMobileCommodityGoodsUsing({ idList: id }).then((res) => {
          if (res.code !== 1000 || res.data) {
            Toast.show({ title: '不可冻结', icon: 'none' })
          } else {
            setAuditLayout(true)
            setAgree(false)
          }
        })
      } else {
        setAuditLayout(true)
        setAgree(!flag)
      }
    }
  }
  // 基本信息

  const [cards, setCards] = useState([
    {
      title: '基本信息',
      showMore: true,
      key: 0,
      children: [
        {
          title: '物料编号',
          key: 'code',
        },
        {
          title: '物料名称',
          key: 'name',
        },
        {
          title: '物料组',
          key: 'materialGroup',
          render: (item) => item?.name,
        },
        {
          title: '规格型号',
          key: 'type',
        },
        {
          title: '品类',
          key: 'customerCategory',
          render: (item) => item?.name,
        },
        {
          title: '品牌',
          key: 'brand',
          render: (item) => item?.name,
        },
        {
          title: '单位',
          key: 'unitName',
        },
        {
          title: '目录价',
          key: 'costPrice',
          render: (text) => (text || text === 0 ? `¥ ${text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}` : ''),
        },
        {
          title: '备注',
          key: 'remake',
        },
      ],
    },
    {
      title: '属性信息',
      showMore: true,
      key: 1,
      arrInfo: {
        key: 'new_materialAttributeList',
        title: 'title',
        value: 'value',
        // render: item => {
        //   return <View>
        //     {
        //       item?.map(val => {
        //         return <View><Text>{val.value}</Text></View>
        //       })
        //     }
        //   </View>
        // }
      },
    },
    {
      title: '产地配送',
      showMore: true,
      key: 2,
      children: [
        {
          title: '生产厂家',
          key: 'materialsManufacturer',
        },
        {
          title: '产地',
          key: 'materialsOrigin',
        },
        {
          title: '起运地',
          key: 'materialsDeparture',
        },
        {
          title: '到货周期',
          key: 'materialsDeliverPeriod',
        },
        {
          title: '交货方式',
          key: 'materialsDeliveryMethod',
        },
      ],
    },
    {
      title: '单位换算',
      showMore: true,
      key: 3,
      children: [
        {
          title: '最小单位',
          key: 'unitConversions',
          render: (item) => item && item[0]?.unitName,
        },
      ],
      arrInfoChild: {
        parentKey: 'unitConversions',
        key: 'subUnitConversionList',
        title: 'unitName',
        value: 'nums',
      },
    },
    {
      title: '联系信息',
      showMore: true,
      key: 4,
      children: [
        {
          title: '负责人',
          key: 'chargeName',
        },
        {
          title: '联系人',
          key: 'contactMemberName',
        },
        {
          title: '联系电话',
          key: 'contactMemberPhone',
          render: (text) => text?.replace(/^(.*)(.{4})(.{4})/, '$1 $2 $3'),
        },
      ],
    },
    {
      title: '物料图片',
      showMore: true,
      img: 'goodsPic',
      key: 5,
    },
    {
      title: '附件',
      showMore: true,
      file: 'urls',
      key: 6,
    },
  ])
  /* 展开 */
  const handleOpen = (key) => {
    let _cards = cards
    _cards[key]['showMore'] = !_cards[key]?.['showMore']
    setCards([..._cards])
  }
  /* 卡片项 */
  const cardLi = (title, value, old_val, render?) => {
    const goods = dataSource.goodsVersionResponse?.goods
    const change_ = type === 'auditChange' && (render ? render(old_val) != render(value) : old_val != value)
    return (
      <View
        className={cx(styles['materialItem-box-row'], change_ ? styles['materialItem-box-rowbg'] : undefined)}
        key={title}
      >
        <View className={styles['materialItem-box-row-label']}>
          <Text>{title}</Text>
        </View>
        <View className={styles['materialItem-box-row-text']}>
          <View className={type === 'auditChange' && old_val === '（删除）' ? styles['change_del'] : null}>
            {change_ && (
              <Text style={{ color: '#00A98F' }}>
                {!old_val ? '（变更后新增）' : old_val === '（删除）' ? '（变更后删除）' : '（变更后）'}
              </Text>
            )}
            {render ? render(value) : value}
          </View>
          {goods && change_ && old_val && old_val !== '（删除）' && (
            <View className={styles['change_del_']}>
              <Text>（变更前）</Text>
              <Text>{render ? render(old_val) : old_val}</Text>
            </View>
          )}
        </View>
      </View>
    )
  }
  /* PDF预览 */
  const gotoPDF = (url) => {
    if (process.env.TARO_ENV === 'h5') {
      setStorageSync('pdfUrl', url)
      navigateTo({
        url: '/pages/pdfPage/index',
      })
    } else if (process.env.TARO_ENV === 'weapp') {
      downloadFile({
        url: url,
        success: function (res) {
          var filePath = res.tempFilePath
          // openDocument 新开页面打开文档，支持格式"doc" | "docx" | "xls" | "xlsx" | "ppt" | "pptx" | "pdf" ,支持端weapp
          openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            },
          })
        },
      })
    }
  }

  const _func = useMemo(() => {
    switch (dataSource.interiorState) {
      case 2:
        return postProductMobileGoodsGoodsExamine1
      case 4:
        return postProductMobileGoodsGoodsExamine2
      case 52:
        return postProductMobileGoodsGoodsExamineChange1
      case 54:
        return postProductMobileGoodsGoodsExamineChange2
      case 99:
        return postProductMobileGoodsFreezeOrEnableGoods
      default:
        return postProductMobileGoodsGoodsExamine1
    }
  }, [dataSource])

  /** 审核提交 */
  const handleSubmit = (values) => {
    let param: any = {
      id: dataSource?.id,
      auditOpinion: values.reason,
      state: values.agree,
    }
    if (dataSource.interiorState === 99) {
      param = {
        goodsId: id,
        status: 0,
        freezeReason: values.auditOpinion,
      }
    }
    FullScreenLoading.show()
    _func(param).then((res) => {
      if (res.code !== 1000) {
        FullScreenLoading.hide()
        Toast.show({ title: res.message, icon: 'none' })
        return
      }
      Router.navigateBack({
        delta: 1,
        success: () => {
          refresh()
        },
      })
      FullScreenLoading.hide()
    })
  }

  const getGoodsImage = (imgKey: string) => {
    // 获取所需的值
    const currentItemsImg = dataSource[imgKey]
    const newItemsImg = dataSource.goodsVersionResponse?.goods[imgKey]

    // 判断当前项的图片是否存在
    const isCurrentItemsImgExist = currentItemsImg?.length > 0

    // 判断新版本项的图片是否存在
    const isNewItemsImgExist = newItemsImg?.length > 0

    let result = ''

    // 判断并设置返回值
    if (isCurrentItemsImgExist) {
      if (isNewItemsImgExist) {
        const isSameImages = currentItemsImg.join(',') === newItemsImg.join(',')
        result = isSameImages ? '' : '（变更后）'
      } else {
        result = '（新增）'
      }
    }
    return result
  }

  const statusArr = [0, 99, 1, 2, 4, 51, 52, 54]
  const djArr = [0, 99, 1, 51]
  return (
    <View className={styles['container']}>
      <NavBar title={title} backIconColor="white" titleColor="white" customStyle="background: #00A98F" />
      <View
        className={cx(
          styles['scrollView-outer'],
          !(
            pageStatus === 'OPERATION' &&
            Number(dataSource?.product?.transferQuantity) < Number(dataSource?.product?.quantity)
          )
            ? styles['paddingBottomHide']
            : '',
        )}
      >
        <ScrollView onScroll={scrollView} className={styles['scrollView']}>
          <View className={styles['scrollView-box']}>
            <View className={styles['scrollView-box-status']}>
              <View className={styles['scrollView-box-status-line']}>
                <Text className={styles['scrollView-box-status-line-text']}>{dataSource?.interiorStateName}</Text>
                {dataSource?.innerSteps && <Icons name="ChevronRight" size={14} color="#FFFFFF" />}
              </View>
            </View>
            {/* 内容 */}
            <View className={styles['scrollView-box-content']}>
              <View className={styles['productInfo']}>
                <View className={styles['productInfoTitle']}>
                  <View className={styles['docLine']} />
                  <Text className={styles['productName']}>{dataSource?.name}</Text>
                </View>
                <View className={styles['productInfoNo']}>
                  <Text className={styles['productNo']}>物料编号：{dataSource?.code}</Text>
                </View>
              </View>
              {/* 基本信息 */}
              {cards.map((items) => {
                return (
                  <View className={styles['materialItem']} key={items.key}>
                    <View className={styles['materialItem-tips']}>
                      <Text className={styles['materialItem-tips-text']}>{items.title}</Text>
                      <View
                        className={styles['materialItem-tips-operation']}
                        onClick={() => {
                          handleOpen(items.key)
                        }}
                      >
                        <Text className={styles['materialItem-tips-operation-text']}>
                          {items?.showMore ? '收起' : '展开'}
                        </Text>
                        <Icons name={items?.showMore ? 'ChevronUp' : 'ChevronDown'} size={14} color="#91959B" />
                      </View>
                    </View>
                    {items?.showMore && (
                      <View className={styles['materialItem-box']}>
                        {items.children?.map((item) => {
                          return cardLi(
                            item.title,
                            dataSource[item.key],
                            dataSource?.goodsVersionResponse?.goods &&
                              dataSource?.goodsVersionResponse?.goods[item.key],
                            item.render,
                          )
                        })}
                        {/* 属性 */}
                        {!!items.arrInfo &&
                          dataSource[items.arrInfo.key]?.map((item) => {
                            const arrInfo = items.arrInfo
                            return cardLi(item[arrInfo.title], item[arrInfo.value], item['old_value'])
                          })}
                        {/* 单位 */}
                        {!!items.arrInfoChild &&
                          dataSource[items.arrInfoChild.parentKey] &&
                          dataSource[items.arrInfoChild.parentKey][0] &&
                          dataSource[items.arrInfoChild.parentKey][0][items.arrInfoChild.key]?.map((item) => {
                            const arrInfoChild = items.arrInfoChild
                            return cardLi(item[arrInfoChild.title], item[arrInfoChild.value], item['old_'])
                          })}
                        {/* 图片 */}
                        {!!items.img && dataSource && (
                          <View>
                            {type === 'auditChange' && (
                              <View className={styles['change_type']}>
                                <Text>{getGoodsImage(items.img)}</Text>
                              </View>
                            )}
                            <View className={styles['materialItem-box-bottom']}>
                              {dataSource[items.img]?.map((_src, i) => (
                                <Image key={`${_src}_${i}`} className={styles['materialItem-box-img']} src={_src} />
                              ))}
                              {dataSource.goodsVersionResponse?.goods?.[items.img]?.map((_src, i) => {
                                if (dataSource[items.img].includes(_src)) {
                                  return undefined
                                }
                                return (
                                  <View className={styles['materialItem-box-img']} style={{ position: 'relative' }}>
                                    <Image
                                      key={`${_src}_${i}`}
                                      className={cx(styles['materialItem-box-img'])}
                                      src={_src}
                                    />
                                    <View className={cx(styles['change_del_img'], styles['del_img'])}>已删除</View>
                                  </View>
                                )
                              })}
                            </View>
                          </View>
                        )}
                        {type === 'auditChange' &&
                          !!items.img &&
                          dataSource.goodsVersionResponse?.goods &&
                          dataSource.goodsVersionResponse?.goods[items.img] &&
                          !(
                            dataSource[items.img].join(',') ===
                            dataSource.goodsVersionResponse?.goods[items.img].join(',')
                          ) && (
                            <View>
                              <View
                                className={styles['change_type']}
                                style={
                                  dataSource[items.img]?.length &&
                                  dataSource.goodsVersionResponse?.goods[items.img].length
                                    ? { color: '#91959B' }
                                    : {}
                                }
                              >
                                <Text>
                                  {dataSource[items.img]?.length
                                    ? dataSource.goodsVersionResponse?.goods[items.img].length
                                      ? '（变更前）'
                                      : ''
                                    : dataSource.goodsVersionResponse?.goods[items.img].length
                                    ? '（删除）'
                                    : ''}
                                </Text>
                              </View>
                              <View className={styles['materialItem-box-bottom']}>
                                {dataSource.goodsVersionResponse?.goods[items.img].map((_src, i) => (
                                  <View className={styles['materialItem-box-img']} style={{ position: 'relative' }}>
                                    <Image
                                      key={`${_src}_${i}`}
                                      className={cx(styles['materialItem-box-img'])}
                                      src={_src}
                                    />
                                    <View className={styles['change_del_img']}></View>
                                  </View>
                                ))}
                              </View>
                            </View>
                          )}
                        {/* 文件 */}
                        {!!items.file && (
                          <View className={styles['materialItem-box-bottom']} style={{ flexDirection: 'column' }}>
                            {dataSource[items.file]?.map((fileInfo, i) => (
                              <View
                                className={styles['materialItem-box-pdf']}
                                key={`${fileInfo.url}_${i}`}
                                onClick={() => gotoPDF(fileInfo.url)}
                              >
                                {type === 'auditChange' && (
                                  <Text className={styles['change_type']}>
                                    {fileInfo.old_
                                      ? fileInfo.old_ === '（变更后删除）'
                                        ? fileInfo.old_
                                        : ''
                                      : '（变更后新增）'}
                                  </Text>
                                )}
                                <View className={styles['materialItem-box-pdf_imgs']}>
                                  <Image
                                    className={styles['materialItem-box-pdf_img']}
                                    src={getOssUrlPath(`/Images/pdf_pink.png`)}
                                  />
                                  <Text
                                    className={cx(
                                      styles['pdf_text'],
                                      fileInfo.old_ === '（删除）' ? styles['change_del_'] : '',
                                    )}
                                  >
                                    {fileInfo?.name}
                                  </Text>
                                </View>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )
              })}
            </View>
          </View>
        </ScrollView>
        {statusArr.includes(dataSource?.interiorState) && (
          <View className={styles['scrollView-outer-fixButton']}>
            <View className={styles['scrollView-outer-fixButton-btnBox']}>
              {!!type && !djArr.includes(dataSource?.interiorState) && (
                <View
                  className={cx(
                    styles['scrollView-outer-fixButton-btnBox-btn'],
                    styles['scrollView-outer-fixButton-btnBox-btn__cancel'],
                  )}
                  onClick={() => {
                    handleAuditLayout(true)
                  }}
                >
                  <Text
                    className={cx(
                      styles['scrollView-outer-fixButton-btnBox-btn-text'],
                      styles['scrollView-outer-fixButton-btnBox-btn__cancel-text'],
                    )}
                  >
                    审核不通过
                  </Text>
                </View>
              )}
              {(djArr.includes(dataSource?.interiorState) || !!type) && (
                <View
                  className={styles['scrollView-outer-fixButton-btnBox-btn']}
                  onClick={() => {
                    handleAuditLayout()
                  }}
                >
                  <Text className={styles['scrollView-outer-fixButton-btnBox-btn-text']}>{_submitBtnText}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
      <FullScreenLoading />
      <VerifyPopup
        title1={dataSource?.interiorState === 99 ? '冻结原因' : ''}
        visible={auditLayout}
        agree={!!agree}
        onClose={() => setAuditLayout(false)}
        onConfirm={handleSubmit}
      />
    </View>
  )
}
export default RequisitionDetail

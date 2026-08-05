import React, { useEffect, useState, useMemo } from 'react'
import { getCurrentInstance, useRouter, preload, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, ScrollView, Text, Input, Picker, Icons, Toast } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import Router from '@/utils/router'
import { useSafeArea } from '@apps/mobile-services'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import { formatDecimal } from '@/utils/numberFormat'
import { limitByte, inputBlurMsg } from '@/utils'
import useStores from '@/store/useStores'
import {
  getPurchaseRequisitionDeliveryMethodItems,
  getPurchaseRequisitionSrmDetail,
  postPurchaseRequisitionSrmCreate,
  postPurchaseRequisitionSrmUpdate,
  GetPurchaseRequisitionSrmDetailResponse,
} from '@apps/apis'
import RequisitionProduct from '../../components/requisitionProduct'
import UploadItem from '../../components/uploadItem'
import MixPopup from '../../components/mixPopup'
import DeliveryPopup from '../../components/deliveryPopup'
import { procurmentRenderInit } from '../constants'
import styles from './index.module.scss'

const RequisitionCreate: React.FC = () => {
  const params = getCurrentInstance().preloadData || {}
  const { requisitionId, needReplace } = useRouter().params
  const {
    createStore: {
      vendorMemberId,
      vendorRoleId,
      attachments,
      digest,
      department,
      departmentId,
      requisitioner,
      requisitionerId,
      purpose,
      vendorMemberName,
      products,
      advanceDeliveryDate,
      deliveryMethod,
      deliveryType,
      deliveryAddress,
      deliveryAddressId,
      setCreateValues,
      setCreateValuesMaps,
    },
  } = useStores()
  const { safeBottomHeight } = useSafeArea()
  const [dataSoucre, setDataSoucre] = useState<GetPurchaseRequisitionSrmDetailResponse>()
  const [datas, setDatas] = useState<any>()
  const [showMore, setShowMore] = useState<boolean>(false)
  const [mixPopVisible, setMixPopVisible] = useState<boolean>(false)
  const [mixPopType, setMixPopType] = useState<1 | 2 | 3>(1)
  const [deliveryPopVisible, setDeliveryPopVisible] = useState<boolean>(false)
  const [deliveryPopType, setDeliveryPopType] = useState<1 | 2>(1)
  const [deliveryPopValue, setDeliveryPopValue] = useState<any>()

  useEffect(() => {
    getPurchaseRequisitionDeliveryMethodItems().then((res) => {
      if (res.code === 1000) {
        setDatas(res.data)
      }
    })
    requisitionId &&
      getPurchaseRequisitionSrmDetail({ id: requisitionId } as any).then((res) => {
        if (res.code !== 1000) {
          Toast.show({ title: res.message, icon: 'none' })
          return
        }
        setCreateValuesMaps(procurmentRenderInit(res.data))
        setDataSoucre(res.data)
      })
    setNavigationBarTitle({ title: requisitionId ? '编辑请购单' : '新增请购单' })
  }, [])

  const _productList = useMemo(() => {
    const _list = products
    if (_list) {
      let _toList = showMore ? products : []
      if (!showMore) {
        for (let i = 0; i < 3; i++) {
          if (_list[i]) {
            _toList.push(_list[i])
          } else {
            break
          }
        }
      }
      return _toList
    }
    return []
  }, [products, showMore])

  useEffect(() => {
    if (deliveryType && deliveryType !== 1) {
      setCreateValuesMaps({ deliveryAddress: undefined, deliveryAddressId: undefined })
    }
  }, [deliveryType])

  useEffect(() => {
    let _obj: any = { deliveryType: undefined }
    if (deliveryMethod && deliveryMethod === 3) {
      _obj = { ..._obj, deliveryAddress: undefined, deliveryAddressId: undefined }
    }
    setCreateValuesMaps(_obj)
  }, [deliveryMethod])

  const handleShowMore = () => {
    setShowMore(!showMore)
  }

  const handleInput = (e, name) => {
    setCreateValues(name, e)
  }

  const handleOnBlur = (e, fix, maxByte) => {
    inputBlurMsg(e.detail.value, fix, { allowChineseTransform: true, maxByte })
  }

  const deleteItem = (index: number) => {
    let _list = [...toJS(attachments)]
    _list.splice(index, 1)
    setCreateValues('attachments', _list)
  }

  const handleDateChange = (e): void => {
    setCreateValues('advanceDeliveryDate', e.detail.value)
  }

  const mixOnChoose = (item) => {
    if (mixPopType === 1) {
      setCreateValuesMaps({ departmentId: item.id, department: item.title })
    } else if (mixPopType === 2) {
      setCreateValuesMaps({ requisitionerId: item.userId, requisitioner: item.name })
    } else {
      setCreateValuesMaps({ vendorMemberId: item.memberId, vendorRoleId: item.roleId, vendorMemberName: item.name })
    }
  }

  const onDeliveryPopupOk = (item) => {
    if (item) {
      setCreateValues(deliveryPopType === 1 ? 'deliveryMethod' : 'deliveryType', item.value)
      setDeliveryPopValue({ title: _returnDeliveryText(deliveryPopType, item.value), value: item.value })
    } else {
      setCreateValues(deliveryPopType === 1 ? 'deliveryMethod' : 'deliveryType', undefined)
      setDeliveryPopValue(undefined)
    }
  }

  const handleDeliveryOpen = (type) => {
    const _val = type === 1 ? deliveryMethod : deliveryType
    if (_val) {
      setDeliveryPopValue({ title: _returnDeliveryText(type, _val), value: _val })
    } else {
      setDeliveryPopValue(undefined)
    }
    setDeliveryPopType(type)
    setDeliveryPopVisible(true)
  }

  const handleMixOpen = (type) => {
    setMixPopType(type)
    setMixPopVisible(true)
  }

  const handleAddMaterial = () => {
    Router.navigateTo('requisition/requisitionAddMaterial')
  }

  /** 选择地址 */
  const handleAddress = () => {
    preload('addressList', addressList)
    Router.navigateTo('address/addressList', { hideDeliver: true })
  }

  /* 选择地址回调 */
  const addressList = (address) => {
    setCreateValuesMaps({
      deliveryAddress: `${address.receiverName} ${address.phone} / ${address.provinceName}${address.cityName}${address.districtName}${address.address}`,
      deliveryAddressId: address.id,
    })
  }

  const _returnDeliveryText = (type, value) => {
    const _key = type === 1 ? 'deliveryMethod' : 'deliveryType'
    const _keyName = type === 1 ? 'deliveryMethodName' : 'deliveryTypeName'
    return datas
      ? datas[type === 1 ? 'deliveryMethods' : 'deliveryTypes'].find((item) => item[_key] === value)[_keyName]
      : ''
  }

  const _submit = () => {
    if (!digest) {
      Toast.show({ title: '请输入请购单摘要', icon: 'none' })
      return
    }
    const digestMes = limitByte(digest, { allowChineseTransform: true, maxByte: 60 })
    if (digestMes) {
      Toast.show({ title: `请购单摘要${digestMes}`, icon: 'none' })
      return
    }

    if (!department) {
      Toast.show({ title: '请选择请购部门', icon: 'none' })
      return
    }
    if (!requisitioner) {
      Toast.show({ title: '请选择请购人', icon: 'none' })
      return
    }
    if (!purpose) {
      Toast.show({ title: '请输入请购用途', icon: 'none' })
      return
    }
    const purposeMes = limitByte(purpose, { allowChineseTransform: true, maxByte: 100 })
    if (purposeMes) {
      Toast.show({ title: `请购用途${purposeMes}`, icon: 'none' })
      return
    }
    if (!vendorMemberName) {
      Toast.show({ title: '请选择供应会员', icon: 'none' })
      return
    }
    if (!advanceDeliveryDate) {
      Toast.show({ title: '请选择预交日期', icon: 'none' })
      return
    }
    if (new Date(advanceDeliveryDate).getTime() < new Date().getTime()) {
      Toast.show({ title: '预交日期需要大于当前日期', icon: 'none' })
      return
    }
    const _products: any = []
    for (let _i = 0; _i < products.length; _i++) {
      if (!products[_i].quantity) {
        Toast.show({ title: '请补全物料数量', icon: 'none' })
        return
      }
      _products.push({
        ...products[_i],
        categoryId: products[_i]?.categoryId ? products[_i]?.categoryId : products[_i]?.id,
      })
    }
    const _params: any = {
      vendorMemberId,
      vendorRoleId,
      vendorMemberName,
      departmentId,
      department,
      purpose,
      digest,
      products: _products,
      advanceDeliveryDate,
      deliveryMethod,
      deliveryType,
      deliveryAddress,
      deliveryAddressId,
      requisitionerId,
      requisitioner,
      attachments,
    }

    const _fn = requisitionId ? postPurchaseRequisitionSrmUpdate : postPurchaseRequisitionSrmCreate
    requisitionId && (_params.requisitionId = requisitionId)
    FullScreenLoading.show()
    _fn(_params).then((res) => {
      FullScreenLoading.hide()
      if (res.code !== 1000) {
        Toast.show({ title: res.message, icon: 'none' })
        return
      } else {
        Toast.show({ title: '保存成功', icon: 'none' })
        setTimeout(() => {
          if (needReplace) {
            Router.redirectTo('requisition/requisitionList')
          } else {
            Router.navigateBack({
              success: () => {
                params?.refresh()
              },
            })
          }
        }, 1500)
      }
    })
  }

  const _countTotal = (key) => {
    let _total = 0
    products?.forEach((item) => {
      _total = _total + Number(item[key] ?? 0)
    })
    return _total
  }

  const _countTotal2 = (key1, key2) => {
    let _total = 0
    products?.forEach((item) => {
      _total = _total + Number(item[key1] ?? 0) * Number(item[key2] ?? 0)
    })
    return _total
  }

  const _returnValueId = () => {
    if (mixPopType === 1) {
      return departmentId
    } else if (mixPopType === 2) {
      return requisitionerId
    } else {
      return vendorMemberId
    }
  }

  return (
    <View className={styles['container']}>
      <PageLayout
        style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
        renderHeader={
          <>
            <NavBar title={requisitionId ? '编辑请购单' : '新增请购单'} />
          </>
        }
      >
        <View className={styles['scrollView-outer']}>
          <ScrollView className={styles['scrollView']}>
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
                  title="请购单摘要"
                  value={
                    <Input
                      placeholder="（必填）请输入"
                      value={digest}
                      onChange={(e) => handleInput(e, 'digest')}
                      onBlur={(e) => {
                        handleOnBlur(e, '请购单摘要', 60)
                      }}
                    />
                  }
                />
                <Cell.Item
                  title="请购部门"
                  hasArrow
                  clickable
                  placeholder="（必填）请选择"
                  value={department}
                  onPress={() => {
                    handleMixOpen(1)
                  }}
                />
                <Cell.Item
                  title="请购人"
                  hasArrow
                  clickable
                  placeholder="（必填）请选择"
                  value={requisitioner}
                  onPress={() => {
                    handleMixOpen(2)
                  }}
                />
                <Cell.Item
                  title="请购用途"
                  value={
                    <Input
                      placeholder="（必填）请输入"
                      value={purpose}
                      onChange={(e) => handleInput(e, 'purpose')}
                      onBlur={(e) => {
                        handleOnBlur(e, '请购用途', 100)
                      }}
                    />
                  }
                />
                <Cell.Item
                  title="供应会员"
                  hasArrow
                  clickable
                  placeholder="（必填）请选择"
                  value={vendorMemberName}
                  onPress={() => {
                    handleMixOpen(3)
                  }}
                />
              </Cell>
            </MellowCard>
            {/* 请购物料 */}
            <MellowCard
              title="请购物料"
              className={styles['customStyle']}
              bodyStyle={{
                padding: 0,
              }}
              extra={
                <View className={styles['customStyle-extra']} onClick={handleAddMaterial}>
                  <Text className={styles['customStyle-extra-text']}>添加物料</Text>
                  <View className={styles['customStyle-extra-arrow']}>
                    <Icons name="ChevronRight" size={14} color="#C0C4CC" />
                  </View>
                </View>
              }
            >
              {_productList.map((item, index) => (
                <RequisitionProduct
                  data={item}
                  edit
                  key={item.productId * index}
                  onClick={() => {
                    Router.navigateTo('requisition/requisitionMaterialList')
                  }}
                />
              ))}
              {products && products.length > 3 && (
                <View className={styles['productItem-showMore']} onClick={handleShowMore}>
                  <Text className={styles['productItem-showMore-text']}>{showMore ? '收起' : '展开更多'}</Text>
                </View>
              )}
              {products?.length > 0 && (
                <>
                  <Text className={styles['product-row']}>
                    预估总金额：
                    <Text className={styles['product-row-amount']}>
                      ¥{formatDecimal(_countTotal2('price', 'quantity'))}
                    </Text>
                  </Text>
                  <Text className={styles['product-row']}>
                    总计数量：<Text>{formatDecimal(_countTotal('quantity'), 3)}</Text>
                  </Text>
                </>
              )}
            </MellowCard>
            {/* 送货/交期 */}
            <MellowCard
              title="送货/交期"
              className={styles['customStyle']}
              bodyStyle={{
                padding: 0,
              }}
            >
              <Cell>
                <Cell.Item
                  title="预交时间"
                  value={
                    <Picker mode="date" value={advanceDeliveryDate ?? ''} onChange={handleDateChange}>
                      <Text
                        className={styles['advanceDeliveryDate']}
                        style={{ color: advanceDeliveryDate ? '#252D37' : '#C8CACD' }}
                      >
                        {advanceDeliveryDate ?? '（必填）请选择日期'}
                      </Text>
                    </Picker>
                  }
                  hasArrow
                  clickable
                />
                <Cell.Item
                  title="配送方式"
                  value={deliveryMethod && _returnDeliveryText(1, deliveryMethod)}
                  placeholder="请选择"
                  hasArrow
                  clickable
                  onPress={() => {
                    handleDeliveryOpen(1)
                  }}
                />
                {deliveryMethod !== 3 && (
                  <Cell.Item
                    title="客户配送方式"
                    value={deliveryType && _returnDeliveryText(2, deliveryType)}
                    placeholder="请选择"
                    hasArrow
                    clickable
                    onPress={() => {
                      handleDeliveryOpen(2)
                    }}
                  />
                )}
                {deliveryType === 1 && (
                  <Cell.Item
                    title="送货地址"
                    value={deliveryAddress}
                    placeholder="请选择"
                    hasArrow
                    clickable
                    onPress={handleAddress}
                  />
                )}
              </Cell>
            </MellowCard>
            {/* 附件 */}
            <MellowCard
              title="附件"
              className={styles['customStyle']}
              bodyStyle={{
                padding: 0,
              }}
              extra={
                <View
                  className={styles['customStyle-extra']}
                  onClick={() => {
                    Router.navigateTo('requisition/requisitionAttachments')
                  }}
                >
                  <Text className={styles['customStyle-extra-text']}>上传附件</Text>
                  <View className={styles['customStyle-extra-arrow']}>
                    <Icons name="ChevronRight" size={14} color="#C0C4CC" />
                  </View>
                </View>
              }
            >
              {attachments &&
                attachments.map((item, index) => (
                  <UploadItem
                    data={item}
                    key={index * 1}
                    editAble
                    deleteFunc={() => {
                      deleteItem(index)
                    }}
                  />
                ))}
            </MellowCard>
          </ScrollView>
          <View
            className={styles['scrollView-outer-fixButton']}
            style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
          >
            <View className={styles['scrollView-outer-fixButton-btnBox']}>
              <View className={styles['scrollView-outer-fixButton-btnBox-btn']} onClick={_submit}>
                <Text className={styles['scrollView-outer-fixButton-btnBox-btn-text']}>提交</Text>
              </View>
            </View>
          </View>
        </View>
      </PageLayout>
      <MixPopup
        visible={mixPopVisible}
        type={mixPopType}
        valueId={_returnValueId()}
        onChoose={mixOnChoose}
        onClose={() => {
          setMixPopVisible(false)
        }}
      />
      <DeliveryPopup
        visible={deliveryPopVisible}
        type={deliveryPopType}
        onOk={onDeliveryPopupOk}
        onClose={() => {
          setDeliveryPopVisible(false)
        }}
        datas={datas}
        value={deliveryPopValue}
        deliveryMethodValue={deliveryMethod}
      />
      <FullScreenLoading />
    </View>
  )
}
export default observer(RequisitionCreate)

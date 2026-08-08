import React, { useEffect, useState, useRef } from 'react'
import { showModal, showToast } from '@apps/mobile-services/utils/taro'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { View, Text, Icons, ScrollView, Image, Input, Toast } from '@apps/mobile-ui'
import cx from 'classnames'
import useStores from '@/store/useStores'
import Cell from '@/components/Cell'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import Empty from '@/components/Empty'
import defaultImage from '@/assets/images/default_img.png'
import Router from '@/utils/router'
import { useSafeArea } from '@apps/mobile-services'
import styles from './index.module.scss'

const MaterialList: React.FC<{}> = () => {
  const {
    createStore: { products, setCreateValues },
  } = useStores()
  const { safeBottomHeight } = useSafeArea()

  const handleCreate = () => {
    Router.navigateTo('requisition/requisitionAddMaterial')
  }

  const handleInput = (value, name, index) => {
    let _products = toJS(products)
    let _value = value
    if (name !== 'remark' && _value !== '') {
      /* 限制输入位数，16位为整数的有效位数 */
      if (_value.length > 15) _value = _value.substring(0, _value.length - 1)
      _value = _value.replace(/[^\d.]/g, '')
      /* 第一位为'.'时自动在前面加上0*/
      if (_value[0] == '.') _value = '0.' + _value.split('.')[1]
      /* 去掉整数>0首位为0的情况 */
      if (_value.indexOf('.') == -1) {
        _value = parseFloat(_value).toString()
      } else if (_value.indexOf('.') !== -1) {
        if (_value.split('.').length > 2) {
          /* 有小数的前提下，输入两个'.'时，把最后输入的'.'去掉 */
          _value = _value.substring(0, _value.length - 1)
        }
        /* 仅对整数部分进行parseFloat，因为当输入为'.'时，parseFloat会处理掉 */
        _value = parseFloat(_value.split('.')[0]) + '.' + _value.split('.')[1]
      }
      if (name == 'price') {
        _value = _value.indexOf('.') !== -1 ? _value.slice(0, _value.indexOf('.') + 5) : _value
      } else if (name == 'quantity') {
        _value = _value.indexOf('.') !== -1 ? _value.slice(0, _value.indexOf('.') + 4) : _value
      }
    }
    _products[index][name] = _value
    setCreateValues('products', _products)
    return _value
  }

  const handleOpen = (index) => {
    let _products = toJS(products)
    _products[index]['showMore'] = !_products[index]?.['showMore']
    setCreateValues('products', _products)
  }

  const deleteItem = (index: number) => {
    showModal({
      title: '',
      content: '是否删除',
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          let _list = [...toJS(products)]
          _list.splice(index, 1)
          setCreateValues('products', _list)
          showToast({ title: '删除成功', icon: 'none' })
        }
      },
    })
  }

  const handleSubmit = () => {
    if (products?.length > 0) {
      const flag = products.every((item) => item.quantity)
      if (!flag) {
        Toast.show({ title: '请补全物料数量', icon: 'none' })
        return
      }
      Router.navigateBack()
    }
  }

  /** 列表数据 */
  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View className={styles['materialItem']}>
      <View className={styles['materialItem-head']}>
        <Image src={item?.goodsPic?.[0] || defaultImage} className={styles['materialItem-head-image']} />
        <View className={styles['materialItem-head-info']}>
          <Text className={styles['materialItem-head-info-title']}>{item.name}</Text>
          <Text className={styles['materialItem-head-info-text']}>{item.type}</Text>
        </View>
        <Icons
          name="Trash"
          size={16}
          color="#91959B"
          onClick={() => {
            deleteItem(index)
          }}
        />
      </View>
      <View className={styles['materialItem-tips']}>
        <Text className={styles['materialItem-tips-text']}>物料信息</Text>
        <View
          className={styles['materialItem-tips-operation']}
          onClick={() => {
            handleOpen(index)
          }}
        >
          <Text className={styles['materialItem-tips-operation-text']}>{item?.showMore ? '收起' : '展开'}</Text>
          <Icons name={item?.showMore ? 'ChevronUp' : 'ChevronDown'} size={14} color="#91959B" />
        </View>
      </View>
      {item?.showMore && (
        <View className={styles['materialItem-box']}>
          <View className={styles['materialItem-box-row']}>
            <Text className={styles['materialItem-box-row-label']}>物料编号</Text>
            <Text className={styles['materialItem-box-row-text']}>{item?.productNo}</Text>
          </View>
          <View className={styles['materialItem-box-row']}>
            <Text className={styles['materialItem-box-row-label']}>物料组</Text>
            <Text className={styles['materialItem-box-row-text']}>{item?.materialGroup?.name ?? item?.goodsGroup}</Text>
          </View>
          <View className={styles['materialItem-box-row']}>
            <Text className={styles['materialItem-box-row-label']}>品类</Text>
            <Text className={styles['materialItem-box-row-text']}>
              {item?.customerCategory?.name ?? item?.category}
            </Text>
          </View>
          <View className={styles['materialItem-box-row']}>
            <Text className={styles['materialItem-box-row-label']}>品牌</Text>
            <Text className={styles['materialItem-box-row-text']}>{item?.brand}</Text>
          </View>
          <View className={styles['materialItem-box-row']}>
            <Text className={styles['materialItem-box-row-label']}>单位</Text>
            <Text className={styles['materialItem-box-row-text']}>{item?.unitName ?? item?.unit}</Text>
          </View>
          <View className={styles['materialItem-box-row']}>
            <Text className={styles['materialItem-box-row-label']}>生产厂家</Text>
            <Text className={styles['materialItem-box-row-text']}>{item?.manufacturer}</Text>
          </View>
          <View className={styles['materialItem-box-row']}>
            <Text className={styles['materialItem-box-row-label']}>产地</Text>
            <Text className={styles['materialItem-box-row-text']}>{item?.origin}</Text>
          </View>
        </View>
      )}
      <Cell border={false} customStyle={{ padding: 0 }}>
        <Cell.Item
          title={<Text className={styles['materialItem-labels']}>预估单价(元)</Text>}
          value={
            <Input
              type="digit"
              placeholder="(选填)点击输入"
              value={item?.price || ''}
              name={`price${index}`}
              key={`price${index}`}
              onChange={(e) => handleInput(e, 'price', index)}
            />
          }
        />
        <Cell.Item
          title={<Text className={styles['materialItem-labels']}>请购数量</Text>}
          value={
            <Input
              type="digit"
              placeholder="（必填）点击输入"
              value={item?.quantity || ''}
              name={`quantity${index}`}
              key={`quantity${index}`}
              onChange={(e) => handleInput(e, 'quantity', index)}
            />
          }
        />
        <Cell.Item
          title={<Text className={styles['materialItem-labels']}>备注</Text>}
          value={
            <Input
              placeholder="点击输入"
              value={item?.remark}
              onChange={(e) => handleInput(e, 'remark', index)}
              maxlength={200}
            />
          }
        />
      </Cell>
    </View>
  )

  return (
    <View className={styles['materialList']}>
      <PageLayout
        style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
        renderHeader={
          <>
            <NavBar title="请购物料" />
          </>
        }
      >
        <View className={styles['materialList-scrollView']}>
          <View className={styles.add_btn} onClick={handleCreate}>
            <Icons name="Plus" size={14} color="#00A98F" />
            添加物料
          </View>
          <ScrollView
            className={styles['materialList-flatList']}
            data={toJS(products)}
            renderItem={renderItem}
            keyExtractor={(item: any) => `scrollItem${item.id}`}
            onEndReachedThreshold={50}
            listEmptyComponent={<Empty />}
            horizontal={false}
            refresherEnabled
          />
          <View
            className={styles['materialList-fixButton']}
            style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
          >
            <View className={styles['materialList-fixButton-btn']}>
              <Text className={styles['materialList-fixButton-btn-text']} onClick={() => handleSubmit()}>
                确定
              </Text>
            </View>
          </View>
        </View>
      </PageLayout>
    </View>
  )
}
export default observer(MaterialList)

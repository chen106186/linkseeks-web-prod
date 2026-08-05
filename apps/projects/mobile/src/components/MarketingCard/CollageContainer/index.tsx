import React, { useState, useCallback, useEffect } from 'react'
import { ScrollView, View } from '@apps/mobile-ui'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { getSystemInfoSync, pxTransform } from '@apps/mobile-services/utils/taro'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import CollageContainerItem from '../CollageContainerItem'
import DetailItem from '../DetailItem'

import './index.scss'

interface CollageContainerProps {
  details?: any
  layoutType?: LAYOUT_TYPE
}

const CollageContainer: React.FC<CollageContainerProps> = (props: CollageContainerProps) => {
  const { details, layoutType } = props
  const windowWidth = getSystemInfoSync().windowWidth
  // 第一个16 外层容器的左右边距，第二个16,flatList的左右内边距,8*5是一行展示5个，每个左右边距是4
  const _childWidth = (windowWidth - 16 - 16 - 8 * 5) / 5
  const _bottomScrollWidth = 48
  const _bottomScrollInnerWidth = _bottomScrollWidth / 2
  const [scrollLeft, setScrollLeft] = useState<number>(0)
  const [scrollViewLeft, setScrollViewLeft] = useState<number>(0)
  const [record, setReocrd] = useState<any>('')
  const [actIndex, setActIndex] = useState<any>(0)
  const { jmpProductDetailGroup } = useProductDetailJump()

  const _onScroll = (event: any) => {
    // console.log(event.nativeEvent)
    const _left = (event.detail.scrollLeft / event.detail.scrollWidth) * _bottomScrollWidth
    let _slideLeft = 0
    if (_left < 0) {
      _slideLeft = 0
    } else if (_left >= _bottomScrollInnerWidth) {
      _slideLeft = _bottomScrollInnerWidth
    } else {
      _slideLeft = _left
    }
    // const _current = Math.ceil((event.detail.scrollLeft) / (_childWidth + 8))
    // console.log(_current)
    // setActIndex(_current)
    setScrollLeft(_slideLeft)
  }

  const _onTab = (id: any) => {
    jmpProductDetailGroup({ commodityId: id })
  }

  const _onItemTap = (index: any) => {
    // const _scrollWidth = ((_childWidth + 8) * 4) + (details.length * (_childWidth + 8));
    // const _left = ((index * (_childWidth + 8)) / _scrollWidth) * _bottomScrollWidth;
    // let _slideLeft = 0;
    // if (_left < 0) {
    //   _slideLeft = 0
    // } else if (_left >= _bottomScrollInnerWidth) {
    //   _slideLeft = _bottomScrollInnerWidth
    // } else {
    //   _slideLeft = _left
    // }
    // setScrollViewLeft((index * (_childWidth + 8)))
    setActIndex(index)
    // setScrollLeft(_slideLeft)
  }

  const _renderItem = (item, index) => (
    <View
      style={{ marginLeft: pxTransform(4), marginRight: pxTransform(4) }}
      key={index}
      onClick={() => {
        _onItemTap(index)
      }}
    >
      <CollageContainerItem
        detail={{ ...item }}
        isAct={actIndex === index}
        clientWidth={_childWidth}
        setReocrd={setReocrd}
      />
    </View>
  )

  useEffect(() => {
    let _index = 0
    if (details.length % 2 === 0) {
      _index = details.length / 2 - 1
    } else {
      _index = parseInt(String(details.length / 2))
    }
    _onItemTap(_index)
  }, [details])

  return layoutType !== LAYOUT_TYPE.shop ? (
    <View className="marketingCard-collageContainer-container">
      {record ? (
        <View
          onClick={() => {
            _onTab(record.productId)
          }}
        >
          <DetailItem detailType="collage" detail={record} />
        </View>
      ) : null}
      <View>
        <ScrollView
          horizontal
          key="CollageContainer"
          keyExtractor={(item) => item.id}
          data={details}
          onScroll={_onScroll}
          // listHeaderComponent={_offerView}
          // listFooterComponent={_offerView}
          renderItem={({ item, index }) => _renderItem(item, index)}
          className="marketingCard-collageContainer-container-goodsScrollView"
          style={{ height: pxTransform(_childWidth + 24) }}
          contentContainerStyle={{ alignItems: 'baseline' }}
          // scrollLeft={scrollViewLeft}
        />
        <View className="marketingCard-collageContainer-container-bottomScrollView">
          <View
            className="marketingCard-collageContainer-container-bottomScrollView-bg"
            style={{ width: _bottomScrollWidth }}
          >
            <View
              className="marketingCard-collageContainer-container-bottomScrollView-bg-inner"
              style={{ width: _bottomScrollInnerWidth, left: scrollLeft }}
            />
          </View>
        </View>
      </View>
    </View>
  ) : (
    <ScrollView
      key="CommonContainer"
      keyExtractor={(item) => item.id}
      data={details}
      renderItem={({ item, index }) => (
        <View key={index} style={{ width: '100%', marginLeft: pxTransform(0) }}>
          <View
            onClick={() => {
              _onTab(item.productId)
            }}
          >
            <DetailItem layoutType={layoutType} detailType="collage" detail={item} />
          </View>
        </View>
      )}
    />
  )
}

CollageContainer.defaultProps = {
  details: null,
}

export default CollageContainer

import React, { useState, useEffect } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { Button, Tooltip } from 'antd'
import { cloneDeep } from 'lodash'
import { changeProps, updatePageConfig, PageConfigType } from '@apps/design-core'

import styles from './index.less'

import StatusTag from '@/components/StatusTag'
import {
  GetMarketingAdornPlatformActivityListAdornRequest,
  getMarketingAdornPlatformActivityListAdorn,
  getMarketingAdornActivityGoodsAdorn,
} from '@apps/apis'

import ActivityProductDrawer from '@/pages/marketingManage/marketing/activePage/components/ActivityAreaSetting/activityProductDrawer'
import ActivityImage from '@/assets/activity/ActivityImage.svg'

import { priceFormat } from '@/utils/numberFomat'

import useSamLevelProps from '../../../common/hooks/useSameLevelProps'
import { history } from '@linkseeks/router-manager'
interface MarketingCardGoodProps {
  id?: any
  actType?: any
  exType?: any
  // 当前选中组件的key
  selectedKey?: any
  pageConfig?: PageConfigType
}

const MarketingCardGood: React.FC<MarketingCardGoodProps> = (props: MarketingCardGoodProps) => {
  const { id, actType, exType, pageConfig, selectedKey } = props
  const { shopId } = usePageStatus()
  const [record, setRecord] = useState<any>([])
  const [actVisible, setActVisible] = useState(false)
  const [ignoresfilters] = useState(['activityType'])
  const sameLevelPropsList = useSamLevelProps({ key: selectedKey })

  useEffect(() => {
    if (id && id != record[0]?.id) {
      getMarketingAdornActivityGoodsAdorn({ ids: id })
        .then((res) => {
          if (res.code === 1000) {
            setRecord(res.data)
          }
        })
        .catch((err) => console.log(err))
    } else if (!id) {
      setRecord([])
    }
  }, [id])

  const fetchData = async (params: GetMarketingAdornPlatformActivityListAdornRequest) => {
    const common = {
      ...params,
      shopId,
    }
    const isWithActivityType = actType ? { ...common, activityType: actType } : common
    if (exType) {
      isWithActivityType.minType = exType
    }
    return await getMarketingAdornPlatformActivityListAdorn(isWithActivityType as any)
  }

  /** 查询活动标签 */
  const findActivityTag = (data: any) => {
    if (data && data.activityList.length > 0) {
      const currentActivity = data.activityList.find((item: any) => item.id === data.activityId)
      if (currentActivity) {
        return currentActivity.label
      }
    }
    return ''
  }

  const onOk = (data: any) => {
    setRecord(data)
    const _data = data[0]
    let _exData = {
      ..._data,
      img: _data.productImgUrl,
      direction: 'column',
    }
    const activityPrice = _data.activityPrice || _data.price
    switch (actType) {
      case 1:
        _exData = {
          ..._exData,
          originalPrice: priceFormat(_data.price),
          discountPrice: priceFormat(activityPrice),
          isnull: false,
        }
        break
      case 2:
        _exData = {
          ..._exData,
          info: findActivityTag(_data),
          originalPrice: priceFormat(_data.price),
          discountPrice: priceFormat(activityPrice),
          isnull: false,
        }
        break
      case 3:
        _exData = {
          ..._exData,
          info: findActivityTag(_data),
          originalPrice: priceFormat(_data.price),
          discountPrice: priceFormat(activityPrice),
          isnull: false,
        }
        break
      case 4:
        if (exType === 1) {
          _exData = {
            ..._exData,
            info: findActivityTag(_data),
            originalPrice: priceFormat(_data.price),
            discountPrice: priceFormat(activityPrice),
            isnull: false,
          }
        } else {
          _exData = {
            ..._exData,
            info: findActivityTag(_data),
            discountPrice: priceFormat(activityPrice),
            isnull: false,
          }
        }
        break
      case 5:
        if (exType === 1) {
          _exData = {
            ..._exData,
            info: findActivityTag(_data),
            originalPrice: priceFormat(_data.price),
            discountPrice: priceFormat(activityPrice),
            isnull: false,
          }
        } else {
          _exData = {
            ..._exData,
            info: findActivityTag(_data),
            originalPrice: priceFormat(_data.price),
            discountPrice: priceFormat(activityPrice),
            isnull: false,
          }
        }
        break
      case 6:
        _exData = {
          ..._exData,
          childType: exType === 1 ? 'goods' : 'coupons',
          detail: {
            ..._exData,
            img: _data.productImgUrl,
            title: _data.productName,
            originalPrice: priceFormat(_data.price),
            discountPrice: priceFormat(activityPrice),
          },
          isnull: false,
        }
        break
      case 7:
        _exData = {
          ..._exData,
          info: findActivityTag(_data),
          originalPrice: priceFormat(_data.price),
          discountPrice: priceFormat(activityPrice),
          isnull: false,
        }
        break
      case 8:
        _exData = { ..._exData, info: findActivityTag(_data), discountPrice: priceFormat(activityPrice), isnull: false }
        break
      case 9:
        _exData = {
          ..._exData,
          detail: {
            title: _data.productName,
            img: _data.productImgUrl,
            info: findActivityTag(_data),
            originalPrice: priceFormat(_data.price),
            discountPrice: priceFormat(activityPrice),
            endTime: 1627372487509,
            people: 1,
            id: 5,
          },
          isnull: false,
        }
        break
      case 11:
        _exData = {
          ..._exData,
          info: findActivityTag(_data),
          discountPrice: priceFormat(activityPrice),
          isnull: false,
        }
        break
      case 12:
        _exData = {
          ..._exData,
          direction: 'column',
          originalPrice: priceFormat(_data.price),
          discountPrice: priceFormat(activityPrice),
          isnull: false,
        }
        break
      case 13:
        _exData = { ..._exData, info: findActivityTag(_data), isnull: false }
        break
      case 14:
        _exData = {
          ..._exData,
          info: findActivityTag(_data),
          originalPrice: priceFormat(_data.price),
          discountPrice: priceFormat(activityPrice),
          isnull: false,
        }
        break
      case 15:
        _exData = {
          ..._exData,
          detail: {
            img: _data.productImgUrl,
            title: _data.productName,
            discountPrice: priceFormat(_data.price),
            buy: 10,
          },
          tag: '购买商品',
          isnull: false,
        }
        break
      case 16:
        _exData = {
          ..._exData,
          info: findActivityTag(_data),
          originalPrice: priceFormat(_data.price),
          discountPrice: priceFormat(activityPrice),
          isnull: false,
        }
        break
      default:
        break
    }
    if (actType !== 15) {
      changeProps({
        title: _data.productName,
        props: Object.assign({ ...props }, _exData),
      })
    }
    if (actType === 15) {
      const _pageConfig: any = cloneDeep(pageConfig)
      _pageConfig['11-18-1'].props.id = _data.id
      _pageConfig['11-18-2-1'].title = _data.productName
      _pageConfig['11-18-2-1'].props = Object.assign({ ...props }, _exData)
      _data?.goodsSubsidiaryGroupList?.forEach((item, index) => {
        const _tabKey = `11-18-2-2-${Number(index) + 1}`
        let _groupOriginalPrice = _data.price
        _pageConfig[_tabKey] = {
          title: `套餐${item.groupNo}`,
          canEdit: false,
          canHide: false,
          componentName: 'MarketingCard.PackageContainerTabsTabPane',
          props: {
            title: `套餐${item.groupNo}`,
            groupPrice: priceFormat(item.groupPrice),
            containerScorll: true,
            type: 15,
          },
          childComponentName: 'MarketingCard.GoodsItem',
          childNodes: [],
        }
        item?.goodsSubsidiaryGroupDetailsList?.forEach((child, childIndex) => {
          _groupOriginalPrice = _groupOriginalPrice + Number(child.price)
          const _childKey = `${_tabKey}-${Number(childIndex) + 1}`
          _pageConfig[_childKey] = {
            title: child.productName,
            canEdit: false,
            canHide: false,
            componentName: 'MarketingCard.GoodsItem',
            props: {
              ...child,
              direction: 'column',
              img: child.productImgUrl,
              title: child.productName,
              discountPrice: priceFormat(child.price),
              isnull: false,
            },
          }
          !_pageConfig[_tabKey].childNodes.includes(_childKey) && _pageConfig[_tabKey].childNodes.push(_childKey)
        })
        _pageConfig[_tabKey].props.groupOriginalPrice = priceFormat(_groupOriginalPrice)
        !_pageConfig['11-18-2-2'].childNodes.includes(_tabKey) && _pageConfig['11-18-2-2'].childNodes.push(_tabKey)
      })
      updatePageConfig(cloneDeep(_pageConfig))
    }
    setActVisible(false)
  }

  const _record = record[0]

  return (
    <div className={styles['suggestProductCommodity']}>
      {id && record.length > 0 ? (
        <>
          <div className={styles['suggestProductCommodity-detail']}>
            <img src={_record?.productImgUrl} />
            <div className={styles['suggestProductCommodity-detail-right']}>
              <Tooltip title={_record?.productName}>
                <div className={styles['suggestProductCommodity-detail-right-title']}>{_record?.productName}</div>
              </Tooltip>
              <div className={styles['suggestProductCommodity-detail-right-price']}>
                {_record?.price ? `¥ ${priceFormat(_record?.price)}` : ''}
              </div>
            </div>
            <div
              className={styles['suggestProductCommodity-detail-cover']}
              onClick={() => {
                setActVisible(true)
              }}
            >
              <div className={styles['suggestProductCommodity-detail-cover-bottom']}>更换商品</div>
            </div>
          </div>
          <div className={styles['suggestProductCommodity-box']}>
            <div className={styles['suggestProductCommodity-box-label']}>商品活动</div>
            {_record?.activityList?.map((item, index) => {
              return (
                <div
                  className={styles['suggestProductCommodity-activityList']}
                  key={index}
                  onClick={() => {
                    history.open(`/marketing/marketingSearch/preview?id=${item.id}`)
                  }}
                >
                  <img src={ActivityImage} />
                  <div className={styles['suggestProductCommodity-activityList-name']}>{item.name}</div>
                  <StatusTag title={item.type} type="danger" />
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <Button
          onClick={() => {
            setActVisible(true)
          }}
        >
          选择活动商品
        </Button>
      )}
      <ActivityProductDrawer
        activityImage={ActivityImage}
        products={record}
        onOk={onOk}
        fetchData={fetchData}
        visible={actVisible}
        onCancel={() => setActVisible(false)}
        mode="radio"
        ignoresFilters={ignoresfilters}
        disabledList={sameLevelPropsList ? sameLevelPropsList.map((item) => `${item.id}_${item.activityId}`) : []}
      />
    </div>
  )
}

export default MarketingCardGood

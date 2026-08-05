import React, { useState, useEffect, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Tooltip, Input, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { cloneDeep } from 'lodash'
import { usePageStatus } from '@/hooks/usePageStatus'
import { changeProps, updatePageConfig, PageConfigType } from '@apps/design-core'
import {
  getMarketingAdornActivityGoodsAdorn,
  getMarketingAdornMerchantActivityListAdorn,
  GetMarketingAdornPlatformActivityListAdornRequest,
} from '@apps/apis'
import StatusTag from '@/components/StatusTag'
import ActivityProductDrawer from '@/pages/design/components/drawer/activityProductDrawer/activityProductDrawer'
import ActivityImage from '@/assets/couponIcons/ActivityImage.svg'
import useSamLevelProps from '../../../common/hooks/useSameLevelProps'
import { priceFormat } from '@/utils/numberFomat'
import styles from './index.less'
import { LAYOUT_TYPE } from '@/constants'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
interface MarketingCardGoodProps {
  id?: any
  actType?: any
  exType?: any
  tags?: any
  // 当前选中组件的key
  selectedKey?: any
  pageConfig?: PageConfigType
  layoutType: LAYOUT_TYPE
}

const MarketingCardGood: React.FC<MarketingCardGoodProps> = (props: MarketingCardGoodProps) => {
  const { id, actType, exType, tags = [], layoutType, selectedKey, pageConfig } = props
  const { shopId } = usePageStatus()
  const intl = useIntl()
  const [record, setRecord] = useState<any>([])
  const [actVisible, setActVisible] = useState(false)
  const saveEditInputRef = useRef<any>({})
  const saveInputRef = useRef<any>({})
  const [editInputIndex, setEditInputIndex] = useState(-1)
  const [editInputValue, setEditInputValue] = useState<any>('')
  const [inputValue, setInputValue] = useState<any>('')
  const [inputVisible, setInputVisible] = useState(false)
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
      innerStatusList: [8, 9],
    }
    const isWithActivityType: any = actType ? { ...common, activityType: actType } : common

    if (exType === 1) {
      isWithActivityType.minType = 1
    } else if (exType === 2) {
      isWithActivityType.minType = 2
    }

    return await getMarketingAdornMerchantActivityListAdorn(isWithActivityType as any)
  }

  const onOk = (data: any) => {
    setRecord(data)
    const _data = data[0]
    let _exData = {
      ..._data,
      name: _data.productName,
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
          info: '',
          originalPrice: priceFormat(_data.price),
          discountPrice: priceFormat(activityPrice),
          isnull: false,
        }
        break
      case 3:
        _exData = {
          ..._exData,
          info: '',
          originalPrice: priceFormat(_data.price),
          discountPrice: priceFormat(activityPrice),
          isnull: false,
        }
        break
      case 4:
        if (exType === 1) {
          _exData = {
            ..._exData,
            info: '',
            originalPrice: priceFormat(_data.price),
            discountPrice: priceFormat(activityPrice),
            isnull: false,
          }
        } else {
          _exData = { ..._exData, info: '', discountPrice: priceFormat(activityPrice), isnull: false }
        }
        break
      case 5:
        if (exType === 1) {
          _exData = {
            ..._exData,
            info: '',
            originalPrice: priceFormat(_data.price),
            discountPrice: priceFormat(activityPrice),
            isnull: false,
          }
        } else {
          _exData = {
            ..._exData,
            info: '',
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
          info: ``,
          originalPrice: priceFormat(_data.price),
          discountPrice: priceFormat(activityPrice),
          isnull: false,
        }
        break
      case 8:
        _exData = { ..._exData, info: ``, discountPrice: priceFormat(activityPrice), isnull: false }
        break
      case 9:
        _exData = {
          ..._exData,
          detail: {
            title: _data.productName,
            img: _data.productImgUrl,
            info: '',
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
        _exData = { ..._exData, info: ``, discountPrice: priceFormat(activityPrice), isnull: false }
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
        _exData = { ..._exData, info: ``, isnull: false }
        break
      case 14:
        _exData = {
          ..._exData,
          info: ``,
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
          tag: intl.formatMessage({ id: 'editor.marketing.buy.product' }),
          isnull: false,
        }
        break
      case 16:
        _exData = {
          ..._exData,
          info: ``,
          originalPrice: priceFormat(_data.price),
          discountPrice: priceFormat(activityPrice),
          isnull: false,
        }
        break
      default:
        break
    }
    if (layoutType === LAYOUT_TYPE.shop) {
      _exData.mode = 'horizontal'
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
          title: `${intl.formatMessage({ id: 'editor.marketing.meal' })}${item.groupNo}`,
          canEdit: false,
          canHide: false,
          componentName: 'MarketingCard.PackageContainerTabsTabPane',
          props: {
            title: `${intl.formatMessage({ id: 'editor.marketing.meal' })}${item.groupNo}`,
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

  const _handleEditInputChange = (e: any) => {
    setEditInputValue(e.target.value)
  }

  const _handleEditInputConfirm = () => {
    const newTags = [...tags]
    newTags[editInputIndex] = editInputValue
    setEditInputIndex(-1)
    setEditInputValue('')
    changeProps({
      props: Object.assign({ ...props }, { tags: newTags }),
    })
  }

  const _handleInputChange = (e: any) => {
    setInputValue(e.target.value)
  }

  const _handleClose = (removedTag: any) => {
    const _tags = tags?.filter((tag) => tag !== removedTag)
    changeProps({
      props: Object.assign({ ...props }, { tags: _tags }),
    })
  }

  const _handleInputConfirm = () => {
    let _tags = tags ? [...tags] : []
    if (inputValue && _tags.indexOf(inputValue) === -1) {
      _tags = [..._tags, inputValue]
    }
    setInputVisible(false)
    setInputValue('')
    changeProps({
      props: Object.assign({ ...props }, { tags: _tags }),
    })
  }

  const _showInput = () => {
    setInputVisible(true)
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
                {_record?.price ? `${translate('web.common.currencySymbol')}${priceFormat(_record?.price)}` : ''}
              </div>
            </div>
            <div
              className={styles['suggestProductCommodity-detail-cover']}
              onClick={() => {
                setActVisible(true)
              }}
            >
              <div className={styles['suggestProductCommodity-detail-cover-bottom']}>
                {intl.formatMessage({ id: 'editor.marketing.change.product' })}
              </div>
            </div>
          </div>
          <div className={styles['suggestProductCommodity-box']}>
            <div className={styles['suggestProductCommodity-box-label']}>
              {intl.formatMessage({ id: 'editor.setting.product.activity' })}
            </div>
            {_record?.activityList?.map((item, index) => {
              return (
                <div
                  className={styles['suggestProductCommodity-activityList']}
                  key={index}
                  onClick={() => {
                    history.open(`/marketingAbility/selfManagement/search/detail?id=${item.id}`)
                  }}
                >
                  <img src={ActivityImage} />
                  <div className={styles['suggestProductCommodity-activityList-name']}>{item.name}</div>
                  <StatusTag title={item.type} type="danger" />
                </div>
              )
            })}
          </div>
          {layoutType === LAYOUT_TYPE.shop && (
            <div className={styles['suggestProductCommodity-box']}>
              <div className={styles['suggestProductCommodity-box-label']}>
                {intl.formatMessage({ id: 'editor.marketing.activity.label' })}
              </div>
              <>
                {tags?.map((tag, index) => {
                  if (editInputIndex === index) {
                    return (
                      <Input
                        ref={saveEditInputRef}
                        key={index}
                        size="small"
                        maxLength={16}
                        className={styles['tag-input']}
                        defaultValue={editInputValue}
                        onChange={_handleEditInputChange}
                        onBlur={_handleEditInputConfirm}
                        onPressEnter={_handleEditInputConfirm}
                      />
                    )
                  }

                  const isLongTag = tag.length > 20

                  const tagElem = (
                    <Tag
                      className={styles['edit-tag']}
                      key={tag}
                      closable
                      onClose={() => _handleClose(tag)}
                      color="red"
                    >
                      <span
                        onDoubleClick={(e) => {
                          if (index !== 0) {
                            setEditInputIndex(index)
                            setEditInputValue(tag)
                            e.preventDefault()
                          }
                        }}
                      >
                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                      </span>
                    </Tag>
                  )
                  return isLongTag ? (
                    <Tooltip title={tag} key={tag}>
                      {tagElem}
                    </Tooltip>
                  ) : (
                    tagElem
                  )
                })}
                {inputVisible && (
                  <Input
                    ref={saveInputRef}
                    type="text"
                    size="small"
                    maxLength={16}
                    className={styles['tag-input']}
                    defaultValue={inputValue}
                    onChange={_handleInputChange}
                    onBlur={_handleInputConfirm}
                    onPressEnter={_handleInputConfirm}
                  />
                )}
                {!inputVisible && tags.length < 3 && (
                  <Tag className={styles['site-tag-plus']} onClick={_showInput}>
                    <PlusOutlined /> {intl.formatMessage({ id: 'editor.add.label.btn' })}
                  </Tag>
                )}
              </>
            </div>
          )}
        </>
      ) : (
        <Button
          onClick={() => {
            setActVisible(true)
          }}
        >
          {intl.formatMessage({ id: 'editor.drawer.activity.product.title' })}
        </Button>
      )}
      <ActivityProductDrawer
        activityImage={ActivityImage}
        products={record}
        onOk={onOk}
        fetchData={fetchData}
        visible={actVisible}
        disabledKeys={sameLevelPropsList ? sameLevelPropsList.map((item) => item.id) : []}
        onCancel={() => setActVisible(false)}
        mode="radio"
      />
    </div>
  )
}

export default MarketingCardGood

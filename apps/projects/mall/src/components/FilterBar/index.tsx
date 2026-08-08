import React, { useState } from 'react'
import { Modal, Input, message } from 'antd'
import { useLocation, useParams } from 'react-router-dom'
import { CloseOutlined } from '@ant-design/icons'
import { LinkTo } from '@/utils'
import useHistory from '@/hooks/useHistory'
import { FILTER_TYPE, MroCategoryItemType } from '@/types/commodity'
import { LAYOUT_TYPE } from '@/types/global'
import { changeURLArg, getQueryString, removeURLArg } from '@/utils/getUrlParam'
import { getWebIntl } from '@/utils/locales'
import { AttributeType, FilterValueType, FILTER_PARAM, FILTER_SEARCH_TYPE } from '../CommonFilter/types'
import { CategoryItemType } from '../CommonFilter/Category'
import { BrandItemType } from '../CommonFilter/Brand'
import styles from './index.module.less'

interface FilterBarProps {
  filterList: FilterValueType[]
  layoutType: LAYOUT_TYPE
  isLogin?: boolean
  categoryList?: CategoryItemType[]
  brandList?: BrandItemType[]
  attributeList?: AttributeType[]
  mroCategoryTree: MroCategoryItemType[]
  filterLoading: boolean
  isMro?: boolean
  helmet?: React.ReactNode
  onFilterChange?: (values: FILTER_PARAM | undefined) => void
  onFilterListChange?: (filterList: FilterValueType[]) => void
  onFilterSave?: (name: string) => Promise<boolean>
}

const FilterBar: React.FC<FilterBarProps> = (props) => {
  const { isLogin = false, layoutType, attributeList, filterList, mroCategoryTree, isMro, onFilterSave } = props
  const { pathname, search } = useLocation()
  const { filter = '' } = useParams()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [commonlyUsedName, setCommonlyUsedName] = useState<string>('')
  const history = useHistory()
  const translate = getWebIntl()
  const isSRM =
    layoutType === LAYOUT_TYPE.srm ||
    layoutType === LAYOUT_TYPE.srmEnterprise ||
    layoutType === LAYOUT_TYPE.srmPublicity

  const handleDeleteFilterItem = (filterItem: FilterValueType) => {
    let linkUrl = `${pathname}${search}`
    let useJump = false
    switch (filterItem.type) {
      case FILTER_TYPE.category:
      case FILTER_TYPE.customerCategory:
        if (filter.indexOf('c') > -1 && filter.indexOf('b') > -1) {
          linkUrl = linkUrl.replace(/(c\d{1,}_){1,}/, '')
        } else if (filter.indexOf('c') > -1 && filter.indexOf('b') < 0) {
          linkUrl = linkUrl.replace(/([_/]c\d{1,}){1,}/, '')
        } else {
          linkUrl = linkUrl.replace(/[_/]c\d{1,}/, '')
        }
        if (linkUrl.indexOf('attr') > -1) {
          linkUrl = removeURLArg(linkUrl, 'attr')
          if (linkUrl.endsWith('?')) {
            linkUrl = linkUrl.replace('?', '')
          }
        }
        useJump = true
        break
      case FILTER_TYPE.brand:
        linkUrl = linkUrl.replace(/[_/]b\d{1,}/, '')
        useJump = true
        break
      case FILTER_TYPE.attribute:
        linkUrl = removeURLArg(linkUrl, 'attr')
        useJump = true
        break
      case FILTER_TYPE.minPrice:
        linkUrl = removeURLArg(linkUrl, 'min')
        break
      case FILTER_TYPE.maxPrice:
        linkUrl = removeURLArg(linkUrl, 'max')
        break
      case FILTER_TYPE.minPoints:
        linkUrl = removeURLArg(linkUrl, 'minPoint')
        break
      case FILTER_TYPE.maxPoints:
        linkUrl = removeURLArg(linkUrl, 'maxPoint')
        break
      case FILTER_TYPE.province:
        linkUrl = removeURLArg(linkUrl, 'provinceCode')
        break
      case FILTER_TYPE.city:
        linkUrl = removeURLArg(linkUrl, 'cityCode')
        break
      case FILTER_TYPE.commodityType:
        linkUrl = removeURLArg(linkUrl, 'priceTypeList')
        break
      case FILTER_TYPE.carriageType:
        linkUrl = removeURLArg(linkUrl, 'carriageType')
        break
      case FILTER_TYPE.keyword:
        linkUrl = removeURLArg(linkUrl, 'keyword')
        linkUrl = removeURLArg(linkUrl, 'searchType')
        if (linkUrl.endsWith('?')) {
          linkUrl = linkUrl.replace('?', '')
        }
        useJump = true
        break
      case FILTER_TYPE.shopKeyword:
        linkUrl = removeURLArg(linkUrl, 'keyword')
        linkUrl = removeURLArg(linkUrl, 'searchType')
        if (linkUrl.endsWith('?')) {
          linkUrl = linkUrl.replace('?', '')
        }
        useJump = true
        break
      case FILTER_TYPE.sort:
        linkUrl = removeURLArg(linkUrl, isSRM ? 'srmOrderType' : 'orderType')
        break
      case FILTER_TYPE.shopCreditSortHighToLow:
      case FILTER_TYPE.shopCreditSortLowToHigh:
        linkUrl = removeURLArg(linkUrl, 'sortCreditPoint')
        break
      case FILTER_TYPE.publicStartTime:
        linkUrl = removeURLArg(linkUrl, 'startTime')
        break
      case FILTER_TYPE.publicEndTime:
        linkUrl = removeURLArg(linkUrl, 'endTime')
        break
      case FILTER_TYPE.mroFilter:
        const mroFilter = getQueryString('mroFilter', search)
        let _mroFilter: any = mroFilter?.split('_')
        const _index = _mroFilter?.indexOf(String(filterItem.key))
        if (_index != undefined && _index >= 0) {
          _mroFilter?.splice(_index, 1)
          linkUrl = changeURLArg(linkUrl, 'mroFilter', _mroFilter?.join('_'))
        }
        useJump = true
        break
      default:
        break
    }
    if (useJump) {
      LinkTo(linkUrl)
    } else {
      history.push(linkUrl)
    }
  }

  const handleResetFilter = () => {
    if (pathname) {
      let url = pathname
      if (isMro) {
        LinkTo(url)
        return
      }
      if (filter) {
        url = url.replace(`/${filter}`, '')
        LinkTo(url)
        return
      }
      history.push(url)
    }
  }

  /**
   * 保存常用筛选
   */
  const handleSaveFilter = () => {
    setModalVisible(true)
  }

  const handleSaveConfirm = () => {
    return new Promise(async (resolve, reject) => {
      if (!commonlyUsedName) {
        message.error(translate('web.resource.mall.qingshuruchangyongshaixuandemingchen'))
        reject()
        return
      }
      if (onFilterSave) {
        setConfirmLoading(true)
        try {
          const res = await onFilterSave(commonlyUsedName)
          if (res) {
            resolve(true)
            setCommonlyUsedName('')
            setConfirmLoading(false)
            setModalVisible(false)
          }
        } catch (error) {
          reject()
          setConfirmLoading(false)
        }
      }
    })
  }

  const getSoleTypeByNumber = (type: string): string => {
    switch (type) {
      case 'soldSort':
        return translate('web.resource.mall.soldSort')
      case 'creditSort':
        return translate('web.resource.mall.shopCreditSortHighToLow')
      case 'priceSortHighToLow':
        return translate('web.resource.mall.priceSortHighToLow')
      case 'priceSortLowToHigh':
        return translate('web.resource.mall.priceSortLowToHigh')
      case 'pointSortHighToLow':
        return translate('web.resource.mall.pointSortHighToLow')
      case 'pointSortLowToHigh':
        return translate('web.resource.mall.pointSortLowToHigh')
      case 'creditSortHighToLow':
        return translate('web.resource.mall.shopCreditSortHighToLow')
      case 'creditSortLowToHigh':
        return translate('web.resource.mall.shopCreditSortLowToHigh')
      case 'publicTimeSortHighToLow':
        return translate('web.resource.mall.fabushijiancongzuixindaozuizao')
      case 'publicTimeSortLowToHigh':
        return translate('web.resource.mall.fabushijianzongzuizaodaozuixin')
      case 'dateSort':
        return translate('web.resource.mall.shangjiashijiandaoxu')
      default:
        return ''
    }
  }

  const getDetailById = (attrId: any, attrValId: any, state = 2) => {
    let detail = {}
    if (attributeList) {
      for (const item of attributeList) {
        if (item.id === attrId) {
          if (state === 1) {
            detail = item
          } else {
            for (const childItem of item.attributeValueList) {
              if (childItem.id === attrValId) {
                detail = childItem
              }
            }
          }
        }
      }
    }
    return detail
  }

  const getTitle = (filterItem: FilterValueType) => {
    if (filterItem.title) {
      return filterItem.title
    }

    switch (filterItem.type) {
      case FILTER_TYPE.minPrice:
        return (
          <span className={styles.price_text}>
            {translate('web.resource.mall.zuidi')} {translate('web.common.currencySymbol')}
            {filterItem.key}
          </span>
        )
      case FILTER_TYPE.maxPrice:
        return (
          <span className={styles.price_text}>
            {translate('web.resource.mall.zuigao')} {translate('web.common.currencySymbol')}
            {filterItem.key}
          </span>
        )
      case FILTER_TYPE.minPoints:
        return (
          <span className={styles.price_text}>
            {translate('web.resource.mall.zuidi')}
            {filterItem.key}
          </span>
        )
      case FILTER_TYPE.maxPoints:
        return (
          <span className={styles.price_text}>
            {translate('web.resource.mall.zuigao')}
            {filterItem.key}
          </span>
        )
      case FILTER_TYPE.carriageType:
        return filterItem.key === '1'
          ? translate('web.resource.mall.carriageType1')
          : translate('web.resource.mall.carriageType2')
      case FILTER_TYPE.sort:
        return getSoleTypeByNumber(filterItem.key)
      case FILTER_TYPE.shopCreditSortLowToHigh:
        return translate('web.resource.mall.shopCreditSortLowToHigh')
      case FILTER_TYPE.shopCreditSortHighToLow:
        return translate('web.resource.mall.shopCreditSortHighToLow')
      case FILTER_TYPE.publicStartTime:
        return `${translate('web.resource.system.fabukaishishijian')} ${filterItem.key}`
      case FILTER_TYPE.publicEndTime:
        return `${translate('web.resource.system.fabujieshushijian')} ${filterItem.key}`
      case FILTER_TYPE.mroFilter:
        const _attrName = layoutType === LAYOUT_TYPE.joint ? 'attributeValueList' : 'customerAttributeValueList'
        if (mroCategoryTree && mroCategoryTree.length > 0) {
          const currentMro = mroCategoryTree.find((mroItem) =>
            mroItem[_attrName].some((_arrtItem) =>
              mroItem.id === 'brand999' ? filterItem.key === `b${_arrtItem.id}` : filterItem.key === `c${_arrtItem.id}`,
            ),
          )

          if (currentMro) {
            return currentMro[_attrName]?.find((_arrtItem) =>
              currentMro.id === 'brand999'
                ? filterItem.key === `b${_arrtItem.id}`
                : filterItem.key === `c${_arrtItem.id}`,
            )?.value
          }
        }

        return ''
      case FILTER_TYPE.attribute:
        const selectAttrList = filterItem.key || []
        if (selectAttrList && selectAttrList.length > 0) {
          const list: any[] = []
          for (const selectAttrItem of selectAttrList) {
            const attrInfo: any = getDetailById(
              selectAttrItem.customerAttributeId,
              selectAttrItem.customerAttributeId,
              1,
            )
            const selectAttributeValueList = selectAttrItem.customerAttributeValueList || []

            if (attrInfo && selectAttributeValueList[0]) {
              const tempItem = {
                customerAttributeId: Number(selectAttrItem.customerAttributeId),
                customerAttributeName: attrInfo.name,
                customerAttributeValueList: selectAttributeValueList.map((item: any) => {
                  const detail: any = getDetailById(selectAttrItem.customerAttributeId, Number(item.id))
                  return {
                    id: detail.id,
                    name: detail.value,
                  }
                }),
              }
              list.push(tempItem)
            }
          }
          if (list.length > 0) {
            return `${list
              .map((tsItem) => {
                return `${tsItem.customerAttributeName}：${tsItem.customerAttributeValueList.map(
                  (cabItem: { name: any }) => cabItem.name,
                )}`
              })
              .join('；')}`
          }
        }
        return ''
      default:
        return ''
    }
  }

  return filterList && filterList.length > 0 ? (
    <div className={styles.filter_bar}>
      <div className={styles.filter_bar_list}>
        {filterList.map(
          (item, index) =>
            getTitle(item) && (
              <div className={styles.filter_bar_list_item} key={`filter_bar_list_item_${index}`}>
                <span className={styles.filter_bar_list_item_text}>{getTitle(item)}</span>
                <div className={styles.filter_bar_close_box}>
                  <CloseOutlined
                    translate={undefined}
                    className={styles.filter_bar_list_item_icon}
                    onClick={() => handleDeleteFilterItem(item)}
                  />
                </div>
              </div>
            ),
        )}
        {filterList.length > 0 && (
          <div className={styles.filter_bar_left}>
            {isLogin && layoutType === LAYOUT_TYPE.joint && (
              <>
                <div className={styles.filter_bar_left_text} onClick={() => handleSaveFilter()}>
                  {translate('web.resource.mall.baocunweichangyongshaixuan')}
                </div>
                <div className={styles.filter_bar_left_split}></div>
              </>
            )}
            <div className={styles.filter_bar_left_text} onClick={handleResetFilter}>
              {translate('web.common.reset')}
            </div>
          </div>
        )}
      </div>

      <Modal
        title={translate('web.resource.mall.baocunchangyongshaixuanxiang')}
        centered
        className={styles.modal_confirm}
        confirmLoading={confirmLoading}
        open={modalVisible}
        width={520}
        onOk={() => handleSaveConfirm()}
        onCancel={() => setModalVisible(false)}
      >
        <Input
          placeholder={translate('web.resource.mall.qingshuruchangyongshaixuandemingchen')}
          value={commonlyUsedName}
          onChange={(e) => setCommonlyUsedName(e.target.value)}
          maxLength={6}
        />
      </Modal>
    </div>
  ) : null
}

export default FilterBar

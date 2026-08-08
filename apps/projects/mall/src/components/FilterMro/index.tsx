import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Checkbox } from 'antd'
import cx from 'classnames'
import { LinkTo } from '@/utils'
import { MroCategoryItemType } from '@/types/commodity'
import { LAYOUT_TYPE } from '@/types/global'
import { getWebIntl } from '@/utils/locales'
import { changeURLArg, getQueryString, removeURLArg } from '@/utils/getUrlParam'
import FilterController from './components/Controller'
import styles from './index.module.less'

interface FilterMroPropsType {
  mroCategoryTree: MroCategoryItemType[]
  layoutType: LAYOUT_TYPE
  mroFilterSelected: Record<string, any>
  setMroFilter: (parentId: string, id: number, layoutType: LAYOUT_TYPE) => void
}

const FilterMro: React.FC<FilterMroPropsType> = (props) => {
  const { mroCategoryTree, mroFilterSelected, setMroFilter, layoutType } = props
  // const { clearMroFilterAll } = FilterStore
  const { pathname, search } = useLocation()
  const translate = getWebIntl()
  const _attrName = layoutType === LAYOUT_TYPE.joint ? 'attributeValueList' : 'customerAttributeValueList'

  const [display, setDisplay] = useState<boolean>(false)

  useEffect(() => {
    const initDisplay = getQueryString('display', search)
    if (initDisplay) {
      setDisplay(true)
    }
  }, [])

  const _handleSubmit = () => {
    let _list: any = []
    let url = `${pathname}${search}`
    for (let key in mroFilterSelected['attr']) {
      mroFilterSelected['attr'][key]?.forEach((item: number) => _list.push(`c${item}`))
    }
    for (let key2 in mroFilterSelected['brand']) {
      mroFilterSelected['brand'][key2]?.forEach((item: number) => _list.push(`b${item}`))
    }
    if (url.indexOf('mroFilter') > -1) {
      url = changeURLArg(url, 'mroFilter', _list.join('_'))
    } else {
      url += `${search ? `&` : '?'}mroFilter=${_list.join('_')}`
    }

    if (display) {
      url += '&display=true'
    } else {
      url = removeURLArg(url, 'display')
    }
    LinkTo(url)
  }

  const _handleClear = () => {
    let url = `${pathname}${search}`
    if (url.indexOf('mroFilter') >= 0) {
      url = removeURLArg(url, 'mroFilter')
      LinkTo(url)
    } else {
      // clearMroFilterAll(layoutType)
    }
  }

  return (
    <div className={styles.filterMro}>
      <FilterController
        layoutType={layoutType}
        mroCategoryTree={mroCategoryTree}
        display={display}
        mroFilterSelected={mroFilterSelected}
        setMroFilter={setMroFilter}
      />
      <div className={styles.filterMro_bottom}>
        <div style={{ flex: 1 }}>
          <Checkbox
            checked={display}
            onChange={(e) => {
              setDisplay(e.target.checked)
            }}
          >
            {translate('web.resource.mall.yincangbukexuan')}
          </Checkbox>
        </div>
        <div className={cx(styles.filterMro_bottom_btn, styles.clearBtn)} onClick={_handleClear}>
          {translate('web.resource.mall.qingchushaixuan')}
        </div>
        <div className={cx(styles.filterMro_bottom_btn, styles.useBtn)} onClick={_handleSubmit}>
          {translate('web.resource.mall.yingyongshaixuan')}
        </div>
      </div>
    </div>
  )
}

export default FilterMro

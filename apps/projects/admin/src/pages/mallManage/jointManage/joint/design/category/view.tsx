import React, { useEffect, useState } from 'react'
import { Spin, message, Modal } from 'antd'
import { BrickProvider, createActions, ModuleTree } from '@apps/design-react'
import { history } from '@linkseeks/router-manager'
import styles from './index.less'
import configs from './common/schema'
import useGetLayout from './common/hooks/useGetLayout'
import { EditPanel } from './components/EditPanel'
import { FixtureContentProvider } from './common/context/context'
import MobileDesignPanel from '@/pages/marketingManage/marketing/activePage/components/MobileDesignPanel'
import Toolbar from '@/pages/marketingManage/marketing/activePage/components/Toolbar'
import ToolbarSubmit from '@/pages/marketingManage/marketing/activePage/components/Toolbar/toolbarSubmit'
import { postCommodityAdornManageSave } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'

const customReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'onChangeTabKey':
      return { ...state, index: { ...state.index, ...payload } }
    case 'onChangeShopId': {
      return { ...state, index: { ...state.index, ...payload } }
    }
    default:
      return state
  }
}

const keyFunc = {
  secondary: (_props) => {
    return {
      id: _props.id,
      icon: _props.icon,
      name: _props.name,
    }
  },
  flashSale: (_props) => {
    return _props.id
  },
  saleRanking: (_props) => {
    return {
      id: _props.id,
      sale: _props.sale,
    }
  },
  brand: (_props) => {
    return _props.id
  },
  suggestProduct: (_props) => {
    return {
      id: _props.id,
      label: _props.label || [],
    }
  },
}

const TITLE_MAP = {
  secondary: '二级品类',
  flashSale: '限时抢购',
  saleRanking: '销量排行',
  brand: '品牌精选',
  suggestProduct: '精选商品',
}

const CategoryNavigation = () => {
  const { info, dataSourceFromRequest } = useGetLayout()
  const { shopId, id } = usePageStatus()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!info) {
      return
    }
    createActions({ type: 'onChangeShopId', payload: { shopId: shopId } })
  }, [info])

  /** 这里说明一下， 如果tab 没点击的情况，直接从那后端请求的数据， */
  const onSave = async (pageConfig, otherRest) => {
    const hasRequestTabKey =
      otherRest?.hasRequestTabKey?.map((_item: string) => _item.match(/id_(.*)\/\.\$(\d+)/)?.[1]) || []
    /** domKey 从7开始都是tab 的值 */
    setLoading(true)
    const tabChildren = pageConfig[4].childNodes.slice(1)
    const result = tabChildren.map((_nodeKey: string) => {
      if (!pageConfig[_nodeKey]) {
        return
      }
      const { id, name, visible = true } = pageConfig[_nodeKey].props
      /** 如果没有选择一级品类，那么直接放弃掉 */
      if (!id) {
        return
      }
      /** 如果没有请求过数据，那么直接使用之前装修的数据 */
      if (!hasRequestTabKey?.includes(id.toString()) && dataSourceFromRequest[id]) {
        return dataSourceFromRequest[id]
      }
      const tabProps = {
        id,
        name,
        visible: visible,
        children: {},
      }
      const tabItemData = {}
      const tabItemChild = pageConfig[_nodeKey].childNodes
      tabItemChild.forEach((element, _index) => {
        const {
          otherProps: { type },
          props,
          childNodes,
        } = pageConfig[element]
        const rest = type === 'suggestProduct' ? { type: props.type || 1, num: props.num || 50 } : {}

        tabItemData[type] = {
          title: props?.title || TITLE_MAP[type],
          ...rest,
          status: props?.status ?? true,
          sort: _index + 1,
          children: childNodes
            .map((_son) => {
              const sonData = pageConfig[_son]
              if (!sonData) {
                return
              }
              return keyFunc[type]?.(sonData.props)
            })
            .filter(Boolean),
        }
      })
      tabProps['children'] = tabItemData
      return tabProps
    })
    const postData = { style: 0, category: result.filter(Boolean) }
    const { data, code, ...rest } = await postCommodityAdornManageSave(
      {
        adornId: id,
        categoryAdornContent: postData as any,
      },
      { ctlType: 'none' },
    )
    setLoading(false)
    if (code === 1000) {
      // history.goBack();
      message.success('保存成功')
    } else {
      message.error(rest.message)
    }
    // const { data, code }
  }

  const onBack = () => {
    Modal.confirm({
      title: '确认离开装修页?',
      onOk: () => {
        history.goBack()
      },
    })
  }

  return (
    <Spin spinning={loading}>
      <BrickProvider
        config={configs}
        warn={(msg: string) => {
          message.warning(msg)
        }}
        customReducer={customReducer}
      >
        <div className={styles['wrapper']}>
          <Toolbar
            title="正在编辑：品类导航页"
            extra={
              <ToolbarSubmit dataConfig={['pageConfig', 'hasRequestTabKey']} loading={loading} onSubmit={onSave}>
                保存
              </ToolbarSubmit>
            }
            onBack={onBack}
          />
          <div className={styles['content']}>
            <div className={styles.tree}>
              <ModuleTree />
            </div>
            <div className={styles['app-wrapper']}>
              <div className={styles['app-canvas-container']}>
                <MobileDesignPanel theme={'theme-mall-science'} onlyEidt />
              </div>
            </div>
            <FixtureContentProvider value={{ shopId: shopId }}>
              <EditPanel />
            </FixtureContentProvider>
          </div>
        </div>
      </BrickProvider>
    </Spin>
  )
}

export default CategoryNavigation

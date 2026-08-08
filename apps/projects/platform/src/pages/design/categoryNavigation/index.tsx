import React, { useEffect, useState, useMemo } from 'react'
import { Spin, message } from 'antd'
import { BrickProvider, createActions, ModuleTree } from '@apps/design-react'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'
import configs from './common/schema'
import useGetLayout from './common/hooks/useGetLayout'
import { EditPanel } from './components/EditPanel'
import { FixtureContentProvider } from './common/context/context'
import MobileDesignPanel from './components/MobileDesignPanel'
import Toolbar from './components/Toolbar'
import ToolbarSubmit from './components/Toolbar/toolbarSubmit'
import { usePageStatus } from '@/hooks/usePageStatus'
import { postCommodityAdornManageSave } from '@apps/apis'

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

const CategoryNavigation = () => {
  const { info, dataSourceFromRequest } = useGetLayout()
  const { shopId, id, preview, isSelf } = usePageStatus()
  /** 是否是自营商城 */
  const isSelfMall = useMemo(() => !!isSelf, [isSelf])
  const [loading, setLoading] = useState<boolean>(false)
  const intl = useIntl()

  const TITLE_MAP = {
    secondary: intl.formatMessage({ id: 'editor.category.title.secondary' }),
    flashSale: intl.formatMessage({ id: 'editor.category.title.flashSale' }),
    saleRanking: intl.formatMessage({ id: 'editor.category.title.saleRanking' }),
    brand: intl.formatMessage({ id: 'editor.category.title.brand' }),
    suggestProduct: intl.formatMessage({ id: 'editor.category.title.suggestProduct' }),
  }

  useEffect(() => {
    if (!info) {
      return
    }
    createActions({ type: 'onChangeShopId', payload: { shopId: shopId } })
  }, [info])

  const onSave = async (pageConfig, rest) => {
    const hasRequestTabKey = rest.hasRequestTabKey?.map((_item: string) => _item.match(/id_(.*)\/\.\$(\d+)/)?.[1]) || []
    /** domKey 从7开始都是tab 的值 */
    const tabChildren = pageConfig[4].childNodes.slice(1)
    setLoading(true)
    const result = tabChildren.map((_nodeKey) => {
      if (!pageConfig[_nodeKey]) {
        return
      }
      const { id, name, visible = true } = pageConfig[_nodeKey].props
      if (!id) {
        return
      }
      /** 如果没有请求过数据，那就用原始数据 */
      if (!hasRequestTabKey.includes(id.toString()) && dataSourceFromRequest[id]) {
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
          status: props?.status ?? true,
          sort: _index + 1,
          ...rest,
          children: childNodes
            .map((_son) => {
              const sonData = pageConfig[_son]
              if (sonData && sonData.props && sonData.props.id) {
                return keyFunc[type]?.(sonData.props)
              }
            })
            .filter(Boolean),
        }
      })
      tabProps['children'] = tabItemData
      return tabProps
    })
    const postData = { style: 0, category: result.filter(Boolean) }
    const service = postCommodityAdornManageSave
    const { data, code } = await service({
      adornId: Number(id),
      categoryAdornContent: postData as any,
    })
    setLoading(false)
    // if (code === 1000) {
    //   history.goBack();
    // }
    // const { data, code }
  }

  const isPreview = useMemo(() => typeof preview !== 'undefined', [preview])

  return (
    <Spin spinning={false}>
      <BrickProvider
        config={configs}
        warn={(msg: string) => {
          message.warning(msg)
        }}
        customReducer={customReducer}
      >
        <div className={styles['wrapper']}>
          <Toolbar
            title={intl.formatMessage({ id: 'editor.category.edit.title' })}
            extra={
              <ToolbarSubmit loading={loading} dataConfig={['pageConfig', 'hasRequestTabKey']} onSubmit={onSave}>
                {intl.formatMessage({ id: 'common.button.save' })}
              </ToolbarSubmit>
            }
          />
          <div className={styles['content']}>
            {!isPreview && (
              <div className={styles.tree}>
                <ModuleTree />
              </div>
            )}
            <div className={styles['app-wrapper']}>
              <div className={styles['app-canvas-container']}>
                <MobileDesignPanel isPreview={isPreview} theme={'theme-mall-science'} onlyEidt />
              </div>
            </div>
            {!isPreview && (
              <FixtureContentProvider value={{ shopId: shopId, isSelfMall }}>
                <EditPanel />
              </FixtureContentProvider>
            )}
          </div>
        </div>
      </BrickProvider>
    </Spin>
  )
}

export default CategoryNavigation

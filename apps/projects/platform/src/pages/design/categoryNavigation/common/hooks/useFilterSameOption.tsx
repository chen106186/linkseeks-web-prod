import React, { useMemo, useEffect } from 'react'
import { useSelector } from '@apps/design-react'

const keyFunc = {
  secondary: (_props) => {
    return {
      id: _props.id,
    }
  },
  flashSale: (_props) => {
    return { id: _props.id }
  },
  saleRanking: (_props) => {
    return {
      id: _props.id,
    }
  },
  brand: (_props) => {
    return { id: _props.id }
  },
  suggestProduct: (_props) => {
    return {
      id: _props.id,
    }
  },
}

export function useFilterSameOption() {
  const { pageConfig } = useSelector<any, any>(['pageConfig'])
  const sameKeys = useMemo(() => {
    if (pageConfig === null) {
      return {}
    }
    const tabChildren = pageConfig?.[4]?.childNodes?.slice(1) || []
    if (tabChildren?.lenth === 0) {
      return {}
    }
    const result = {}
    result['tab'] = []
    tabChildren.forEach((_nodeKey) => {
      if (!pageConfig[_nodeKey]) {
        return
      }

      const { id } = pageConfig[_nodeKey].props
      const parentType = pageConfig[_nodeKey].otherProps.type
      if (typeof result[`${parentType}_${id}`] === 'undefined') {
        result[`${parentType}_${id}`] = []
      }
      result['tab'].push(id)
      result[`${parentType}_${id}`].push(id)

      const tabItemChild = pageConfig[_nodeKey].childNodes
      tabItemChild.forEach((element) => {
        const {
          otherProps: { type },
          props,
          childNodes,
        } = pageConfig[element]
        const name = `${parentType}_${id}_${type}`
        if (typeof result[name] === 'undefined') {
          result[name] = []
        }
        childNodes.forEach((_son) => {
          const sonData = pageConfig[_son]
          if (!sonData) {
            return
          }
          const tempData = keyFunc[type]?.(sonData.props)
          result[name].push(tempData.id)
        })
      })
    })
    return result
  }, [pageConfig])
  return sameKeys
}

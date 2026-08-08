import { ACTIVITY_LIST } from '@/constants/const/activity'
import { postMarketingWebActivityPageAdorn } from '@apps/apis'
import { CodeSandboxCircleFilled } from '@ant-design/icons'
import { message } from 'antd'
import { omit, pick } from 'lodash'
import { useState } from 'react'
import { history } from '@linkseeks/router-manager'

type Options = {
  id: number
  environment?: 'app' | 'web'
}

/** 数组转合集 */
type TupleToUnion<T extends readonly any[]> = T[number]

type ACTIVITY_KEYS = TupleToUnion<typeof ACTIVITY_LIST>

type ActivityContent = {
  [key in ACTIVITY_KEYS]?: {
    props: {
      /** 活动商品id */
      childrenData: number[]
      theme: number
      /** 容器名 */
      title: string
      /** 显示或者隐藏 */
      visible: boolean
    }
    /** 排序 */
    sort: number
  }
}

type ResultType = {
  themeStyle?: {
    props: {
      /** 背景颜色 */
      color: string
    }
    sort: number
  }
  top?: {
    props: {
      /** 活动图片 */
      imageUrl: string
    }
    sort: number
  }
  coupon?: {
    props: {
      /** 优惠券， type => 平台或商家 */
      childrenData: { id: number; type: 1 | 2 | (number & {}) }[]
      theme: number
      visible: boolean
    }
    sort: number
  }
} & ActivityContent

function useSaveData(options: Options) {
  const { id, environment = 'app' } = options
  const [saving, setSaving] = useState<boolean>(false)

  // 验证 id 是否有效
  if (!id || isNaN(id)) {
    console.error('Invalid id:', id)
  }

  const generaterData = (source: ResultType, dataIndex: string, assignData: { [key: string]: any }) => {
    const result = Object.assign(source, {
      [dataIndex]: assignData,
    })
    return result
  }

  const onSave = async (pageConfig: any) => {
    if (!id || isNaN(id)) {
      message.error('缺少活动页ID，无法保存')
      return
    }
    if (!pageConfig || !pageConfig[0]) {
      message.error('页面配置数据异常，请刷新页面后重试')
      return
    }
    const childNodes = pageConfig[0].childNodes
    setSaving(true)
    let result: ResultType = {} as ResultType
    childNodes.map((_item, _index) => {
      const target = pageConfig[_item]
      if (!target || !target.otherProps) {
        return
      }
      const childNodes = target.childNodes
      const { props } = target || {}
      const dataIndex: ACTIVITY_KEYS | 'top' | 'coupon' | 'suggestProduct' = target.otherProps.type
      const sort = _index + 1

      if (dataIndex === 'top') {
        const current = { sort: sort, props: omit(props, 'style') }
        result = generaterData(result, 'top', current)
      } else if (dataIndex === 'coupon') {
        const childrenData = childNodes
          .map((_record) => {
            const childTarget = pageConfig[_record]
            if (!childTarget || !childTarget.props || !childTarget.props.id) {
              return null
            }
            return {
              id: childTarget.props.id,
              type: childTarget.props.belongType,
            }
          })
          .filter(Boolean)
        result = generaterData(result, 'coupon', {
          sort: sort,
          props: {
            ...pick(props, ['theme']),
            visible: props.visible ?? true,
            childrenData: childrenData,
          },
        })
      } else if (dataIndex === 'suggestProduct' || (dataIndex === 'combination' && environment === 'app')) {
        const { ...otherProps } = props || {}
        const { childNodes } = target
        const temp = {
          sort: sort,

          props: {
            visible: otherProps.visible ?? true,
            title: otherProps.title,
            childrenData: childNodes
              ?.filter((_record) => /\d+-\d+/.test(_record))
              .map((_row) => {
                const childrenNodeTarget = pageConfig[_row]
                if (!childrenNodeTarget || !childrenNodeTarget.props) {
                  return null
                }
                const { ...childRestProps } = childrenNodeTarget.props
                const childrenData = childrenNodeTarget.childNodes?.map((_listItem) => {
                  const sonNodeTarget = pageConfig[_listItem]
                  if (!sonNodeTarget || !sonNodeTarget.props || !sonNodeTarget.props.id) {
                    return null
                  }
                  if (dataIndex === 'suggestProduct') {
                    return {
                      id: sonNodeTarget.props.id,
                      label: sonNodeTarget.props.label || [],
                    }
                  }
                  return sonNodeTarget.props.id
                })
                return {
                  title: childRestProps.title,
                  theme: childRestProps.theme || 0,
                  childrenData: childrenData?.filter(Boolean) || [],
                }
              })
              .filter(Boolean),
          },
        }
        result = generaterData(result, dataIndex, temp)
      } else if (ACTIVITY_LIST.includes(dataIndex as ACTIVITY_KEYS)) {
        const { ...otherProps } = props || {}
        const childrenData = childNodes
          .map((_record) => {
            const childTarget = pageConfig[_record]
            if (!childTarget || !childTarget.props) {
              return null
            }
            return childTarget.props.id
          })
          .filter(Boolean)
        // const childrenData = products?.map((_item) => _item.id) || [];
        result = generaterData(result, dataIndex, {
          sort: sort,
          props: {
            ...pick(otherProps, ['theme', 'title']),
            visible: props.visible ?? true,
            childrenData: childrenData,
          },
        })
      }
    })
    const withThemeStyle = {
      ...result,
      themeStyle: {
        sort: 0,
        props: {
          color: pageConfig[0]?.props?.backgroundColor || '#E80047',
        },
      },
    }

    const { data, code, ...rest } = await postMarketingWebActivityPageAdorn(
      {
        id: id,
        adornContent: withThemeStyle,
      } as any,
      { ctlType: 'none' },
    )
    setSaving(false)
    if (code === 1000) {
      // history.goBack();
      message.success('保存成功')
    } else {
      message.error(rest.message)
    }
  }

  return { saving, onSave }
}

export default useSaveData

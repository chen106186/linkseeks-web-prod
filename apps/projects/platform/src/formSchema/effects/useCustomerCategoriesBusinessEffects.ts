import { FormEffectHooks, FormPath } from '@apps/formily'
import { getProductCustomerGetCustomerCategoryTree } from '@apps/apis'

const { onFormInit$ } = FormEffectHooks

function convertDataToEnhanced(treeData: CategoryTreeResponseType): CategoryTreeResponseType {
  const ret: CategoryTreeResponseType = []
  // 跳过检查
  if (!treeData || !treeData.length) {
    return ret
  }
  formatedTreeData(treeData, ret)
  return ret
}

function formatedTreeData(treeData: CategoryTreeResponseType, hash: CategoryTreeResponseType) {
  treeData.forEach((item) => {
    const entity = {
      ...item,
      id: +item.id, // 转数值，会员那边需要的数值，不然回填会匹配不上
      children: [],
    }
    if (item.children) {
      formatedTreeData(item.children, entity.children)
    }
    hash.push(entity)
  })
}

type CategoryTreeResponseType = {
  /**
   * id
   */
  id: string | number
  /**
   * 父节点id
   */
  parentId: string
  /**
   * 节点名称
   */
  title: string
  /**
   * 是否选中
   */
  checked: boolean
  /**
   * 图片url路径
   */
  imageUrl: string
  /**
   * 排序
   */
  sort: number
  /**
   * 子节点集合 ,Node
   */
  children: CategoryTreeResponseType
}[]

export type OptionsType = {
  fieldName: string
}

export const useCustomerCategoriesBusinessEffects = (
  context,
  actions,
  options: OptionsType,
  route = 'props.x-component-props.options',
) => {
  const { fieldName } = options

  // 初始会员品类数据
  onFormInit$().subscribe(() => {
    // 请求会员品类数据
    getProductCustomerGetCustomerCategoryTree()
      .then((res) => {
        if (res.code === 1000) {
          const { data = [] } = res
          actions.setFieldState(fieldName, (state) => {
            FormPath.setIn(state, route, convertDataToEnhanced(data as unknown as CategoryTreeResponseType))
          })
        }
      })
      .catch((err) => {
        console.warn(err)
      })
  })
}

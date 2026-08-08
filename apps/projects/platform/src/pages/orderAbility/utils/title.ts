import { useQuery } from '@linkseeks/router-core'

/**
 * 根据页面状态切换标题
 */
export const changeRouterTitleByStatus = () => {
  const { id, page_type } = useQuery()

  if (id) {
    switch (page_type) {
      case '-1':
        return '查看订单'
      case '0':
        return '编辑订单'
      case '1':
        return '订单审核'
      case '2':
        return '订单审核'
      case '3':
        return '提交订单'
      case '4':
        return '确认电子合同'
      case '5':
        return '订单支付'
    }
  } else {
    // id不存在为新增页面
    return '新增订单'
  }
}

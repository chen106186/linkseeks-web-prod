import { useToggle } from '@linkseeks/hooks'

export const useChatPicker = () => {
  const [orderVisible, orderToggle] = useToggle()
  const [commodityVisible, commodityToggle] = useToggle()
  const [afterVisible, afterToggle] = useToggle()

  const extraPicker = [
    { children: '发送订单', onClick: () => orderToggle(), key: 'order' },
    { children: '发送商品', onClick: () => commodityToggle(), key: 'commodity' },
    { children: '发送售后', onClick: () => afterToggle(), key: 'after' },
  ]

  return {
    extraPicker,
    orderVisible,
    orderToggle,
    commodityToggle,
    commodityVisible,
    afterVisible,
    afterToggle,
  }
}

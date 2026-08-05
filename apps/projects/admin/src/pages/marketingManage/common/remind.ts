export type RemindLayoutProps = {
  /** name */
  name?: string
  /** 商品类型 */
  value?: number
  /** 区分选择商品的类型 */
  type?: string
  /** 弹窗标题 */
  modalTitle?: string
  /** 选择商品按钮名称 */
  buttonTitle?: string
  /** 列表标题 */
  listTitle?: string
  /** 列表label */
  label?: { [key: number]: string }
  /** 提醒 */
  message?: { [key: number]: string }
}

export const remindLayout = (int, giveType?, giftType?) => {
  const give = giveType === 1 ? '满额' : '买商品'
  const gift = giftType === 1 ? '商品' : '优惠券'
  switch (int) {
    case 6:
      return {
        name: 'giveValue',
        value: giftType,
        type: 'limitValue',
        modalTitle: `设置赠品-${give}赠${gift}`,
        buttonTitle: `添加赠送${gift}`,
        listTitle: `${give}${gift}`,
        label: {
          1: '优惠门槛',
          2: giveType === 1 ? '元' : '个',
          3: giveType === 1 ? '赠送商品' : '赠送优惠券',
          4: '赠送数量',
          5: '买',
          6: '',
        },
        message: {
          1: giveType === 1 ? '请选择赠送商品!' : '请选择赠送优惠券!',
          2: giveType === 1 ? '请设置赠送商品!' : '请设置赠送优惠券!',
          3: giveType === 1 ? '请选择赠送商品!' : '请选择赠送优惠券!',
          4: '请输入优惠门槛!',
          5: '请输入赠送数量!',
        },
      }
    case 13: {
      return {
        name: 'swapValue',
        value: 1,
        type: 'limitValue',
        modalTitle: `设置换购商品-${give}换购商品`,
        buttonTitle: '添加换购商品',
        listTitle: `${give}换购商品`,
        label: {
          1: '换购门槛',
          2: giveType === 1 ? '元' : '个',
          3: '换购商品',
          4: '换购数量',
          5: '满',
          6: '换购单价',
        },
        message: {
          1: '请选择换购商品!',
          2: '请设置换购商品!',
          3: '请选择换购商品!',
          4: '请输入换购门槛!',
          5: '请输入允许换购数量!',
        },
      }
    }
    case 15:
      return {
        name: 'groupValue',
        value: 1,
        type: 'groupPrice',
        modalTitle: '设置搭配商品',
        buttonTitle: '选择搭配商品',
        listTitle: '套餐搭配商品',
        label: {
          1: '套餐价格',
          2: '元',
          3: '搭配商品',
          4: '搭配数量',
          5: '',
          6: '',
        },
        message: {
          1: '请选择搭配商品!',
          2: '请设置搭配商品!',
          3: '请选择搭配商品!',
          4: '请输入套餐价格!',
          5: '请输入搭配数量!',
        },
      }
  }
}

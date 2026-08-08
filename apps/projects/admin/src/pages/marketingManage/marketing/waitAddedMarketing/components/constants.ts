/**
 * 活动类型
 */
type activityType = {
  lable: string
  value: number
}[]
export const ACTIVITYTYPEARRAY: activityType = [
  { lable: '特价促销', value: 1 },
  { lable: '直降促销', value: 2 },
  { lable: '折价促销', value: 3 },
  { lable: '满量促销', value: 4 },
  { lable: '满额促销', value: 5 },
  { lable: '赠送促销', value: 6 },
  { lable: '多件促销', value: 7 },
  { lable: '组合促销', value: 8 },
  { lable: '拼团', value: 9 },
  { lable: '抽奖', value: 10 },
  { lable: '砍价', value: 11 },
  { lable: '秒杀', value: 12 },
  { lable: '换购', value: 13 },
  { lable: '预售', value: 14 },
  { lable: '套餐', value: 15 },
  { lable: '试用', value: 16 },
]
/** 叠加活动类型 */
export const OVERLAYACTIVITYTYPE = (int) => {
  switch (Number(int)) {
    case 1:
    case 2:
    case 3:
      return {
        B: [
          { label: '满量促销', value: 4 },
          { label: '满额促销', value: 5 },
        ],
        C: [
          { label: '赠送促销', value: 6 },
          { label: '换购', value: 13 },
        ],
      }
    case 4:
    case 5:
      return {
        A: [
          { label: '特价促销', value: 1 },
          { label: '直降促销', value: 2 },
          { label: '折扣促销', value: 3 },
        ],
        B: [{ label: '赠送促销', value: 6 }],
        C: [{ label: '换购', value: 13 }],
      }
    case 6:
      return {
        A: [
          { label: '特价促销', value: 1 },
          { label: '直降促销', value: 2 },
          { label: '折扣促销', value: 3 },
        ],
        B: [
          { label: '满量促销', value: 4 },
          { label: '满额促销', value: 5 },
        ],
        C: [
          { label: '多件促销', value: 7 },
          { label: '组合促销', value: 8 },
          { label: '换购', value: 13 },
        ],
      }
    case 7:
    case 8:
      return {
        B: [{ label: '赠送促销', value: 6 }],
        C: [{ label: '换购', value: 13 }],
      }
    case 13:
      return {
        A: [
          { label: '特价促销', value: 1 },
          { label: '直降促销', value: 2 },
          { label: '折扣促销', value: 3 },
        ],
        B: [
          { label: '满量促销', value: 4 },
          { label: '满额促销', value: 5 },
        ],
        C: [
          { label: '多件促销', value: 6 },
          { label: '组合促销', value: 7 },
          { label: '换购', value: 8 },
        ],
      }
  }
}
/** 超限规则 */
export const OVERRUNRULETYPE = (int) => {
  switch (Number(int)) {
    case 1:
    case 2:
    case 3:
    case 8:
    case 12:
      return [
        { label: '原价购买', value: 1 },
        { label: '不可购买', value: 2 },
      ]
    case 4:
    case 5:
    case 6:
    case 7:
    case 13:
      return [
        { label: '不可购买', value: 2 },
        { label: '按个人限购最高级享受优惠', value: 1 },
      ]
  }
}
/** 满量/满额/赠送促销类型 */
export const PROMOTIONTYPE = (int) => {
  switch (Number(int)) {
    case 4:
      return {
        name: 'type',
        tooltip: '满量减为订单满足要求购买的数量后，订单金额减去设定的优惠金额，满量折则为订单金额乘以设定的折扣',
        label: '满量促销类型',
        message: '请选择满量促销类型',
        radio: [
          { label: '满量减', value: 1 },
          { label: '满量折', value: 2 },
        ],
      }
    case 5:
      return {
        name: 'type',
        tooltip: '满额减为订单满足要求购买的总额后，订单金额减去设定的优惠金额，满额折则为订单金额乘以设定的折扣',
        label: '满额促销类型',
        message: '请选择满额促销类型',
        radio: [
          { label: '满额减', value: 1 },
          { label: '满额折', value: 2 },
        ],
      }
    case 6:
      return {
        name: 'giveType',
        tooltip: '满额赠为订单满足要求购买的金额后，赠送商品或优惠券，买商品赠为购买活动商品时，赠送商品或优惠券',
        label: '赠送促销类型',
        message: '请选择赠送促销类型',
        radio: [
          { label: '满额赠', value: 1 },
          { label: '买商品赠', value: 2 },
        ],
      }
  }
}
/** 满量/额减 */
export const LADDERBOLIST = (int, type = 1) => {
  switch (Number(int)) {
    case 4:
      return {
        tooltip:
          type === 1
            ? '优惠金额为最后订单总额减去的优惠金额'
            : '折扣为最后订单总额的折扣，输入数字，如85折，输入85，9折输入90',
        label: `满量${type === 1 ? '减' : '折'}`,
        message: `请新增满量${type === 1 ? '减' : '折'}`,
        addon: '数量',
        addonAfter: type === 1 ? '减' : '打',
        addonBefore: type === 1 ? '元' : '折',
      }
    case 5:
      return {
        tooltip:
          type === 1
            ? '优惠金额为最后订单总额减去的优惠金额'
            : '折扣为最后订单总额的折扣，输入数字，如85折，输入85，9折输入90',
        label: `满额${type === 1 ? '减' : '折'}`,
        message: `请新增满额${type === 1 ? '减' : '折'}`,
        addon: '元',
        addonAfter: type === 1 ? '减' : '打',
        addonBefore: type === 1 ? '元' : '折',
      }
    case 7:
      return {
        tooltip: '折扣为最后订单总额的折扣，输入数字，如85折，输入85，9折输入90',
        label: '优惠规则',
        addon: '件',
        message: '请新增优惠规则',
        addonAfter: '打',
        addonBefore: '折',
      }
  }
}

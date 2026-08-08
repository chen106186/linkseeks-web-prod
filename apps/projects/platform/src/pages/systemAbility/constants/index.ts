export const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

export enum STATUS {
  Effective = 1, // 有效
  invalid = 0, // 无效
}

/**
 * 状态相关文本
 */
export const STATUS_NAME = {
  [STATUS.Effective]: '有效',
  [STATUS.invalid]: '无效',
}

/**
 * 状态相关颜色码
 */
export const STATUS_COLOR = {
  // 有效
  [STATUS.Effective]: { color: '#EBF9F6', fontColor: '#00A98F' },
  // 无效
  [STATUS.invalid]: { color: '#FFEBE6', fontColor: '#E34D59' },
}

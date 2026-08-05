interface StatusStyle {
  bgColor: string
  fontColor: string
  txt: string
}
type StatusStyleItem = Record<string, StatusStyle>

/**
 *  状态描述
 * - default: 默认
 * - toSubmit: 待提交
 * - toBeConfirmed: 待确认
 * - toBeModified: 待修改
 * - confirmed: 已确认
 * - generated: 已确认
 * - voided: 已确认
 */
const StatusEnum = {
  Default: undefined,
  ToSubmit: 1,
  ToSubmit_: '待提交',
  ToBeConfirmed: 2,
  ToBeConfirmed_: '待确认',
  ToBeModified: 4,
  ToBeModified_: '待收样',
  Confirmed: 5,
  Confirmed_: '已收样',
  Generated: 6,
  Generated_: '已质检',
  Voided: 7,
  Voided_: '已退样',
  Canceled: 101,
  Canceled_: '已取消',
  Refuseed: 3,
  Refuseed_: '已拒绝',
}

class TagStatus {
  /**
   * 默认的Style集合 具体情况，看StatusEnum
   */
  #tagStatusColor: StatusStyleItem = {
    [StatusEnum.Default]: this.defaultStatusStyle(),
    [StatusEnum.ToSubmit]: this.toSubmitStatusStyle(),
    [StatusEnum.ToSubmit_]: this.toSubmitStatusStyle(),
    [StatusEnum.ToBeConfirmed]: this.toBeConfirmedStyle(),
    [StatusEnum.ToBeConfirmed_]: this.toBeConfirmedStyle(),
    [StatusEnum.ToBeModified]: this.toBeConfirmedStyle(),
    [StatusEnum.ToBeModified_]: this.toBeConfirmedStyle(),
    [StatusEnum.Confirmed]: this.confirmedStyle(),
    [StatusEnum.Confirmed_]: this.confirmedStyle(),
    [StatusEnum.Generated]: this.generatedStyle(),
    [StatusEnum.Generated_]: this.generatedStyle(),
    [StatusEnum.Voided]: this.voidedStyle(),
    [StatusEnum.Voided_]: this.voidedStyle(),
    [StatusEnum.Canceled]: this.canceledStyle(),
    [StatusEnum.Canceled_]: this.canceledStyle(),
    [StatusEnum.Refuseed]: this.refuseedStyle(),
    [StatusEnum.Refuseed_]: this.refuseedStyle(),
  }

  defaultStatusStyle() {
    return { bgColor: '#f2f4f5', fontColor: '#000', txt: '默认' }
  }

  toSubmitStatusStyle() {
    return { bgColor: '#F4F5F7', fontColor: '#57616E', txt: '待提交' }
  }

  toBeConfirmedStyle() {
    return { bgColor: '#ECF2FE', fontColor: '#4787F0', txt: '待确认' }
  }

  toBeModifiedStyle() {
    return { bgColor: '#FFF8E8', fontColor: '#E8A044', txt: '待收样' }
  }

  confirmedStyle() {
    return { bgColor: '#EBF9F6', fontColor: '#00A98F', txt: '已收样' }
  }

  generatedStyle() {
    return { bgColor: '#EAE6FF', fontColor: '#9963D8', txt: '已质检' }
  }

  voidedStyle() {
    return { bgColor: '#FFEBE6', fontColor: '#E34D59', txt: '已退样' }
  }

  canceledStyle() {
    return { bgColor: '#F4F5F7', fontColor: '#5C626A', txt: '已取消' }
  }

  refuseedStyle() {
    return { bgColor: '#FFEBE6', fontColor: '#E34D59', txt: '已拒绝' }
  }

  /**
   * 设置Style的属性，相同的key会覆盖
   * @param status
   * @param value
   */
  setStyleToCollection(status: string | number, value: StatusStyle) {
    this.#tagStatusColor = {
      ...this.#tagStatusColor,
      [status]: value,
    }
  }

  /**
   * 获取Tag Style属性
   * @param status 后台的状态值
   * @param value
   */
  getTagStyle(status: string | number) {
    return this.#tagStatusColor[status] ? this.#tagStatusColor[status] : this.defaultStatusStyle()
  }
}

class TagStatusFactory {
  static getInstance() {
    return new TagStatus()
  }
}

export { TagStatus, TagStatusFactory }

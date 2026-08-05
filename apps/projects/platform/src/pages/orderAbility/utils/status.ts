interface StatusStyle {
  bgColor: string
  fontColor: string
  txt: string
}
interface StatusStyleItem {
  [key: string]: StatusStyle
}

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
enum StatusEnum {
  Default = undefined,
  ToSubmit = 1,
  ToBeConfirmed = 2,
  ToBeModified = 3,
  Confirmed = 4,
  Generated = 5,
  Voided = 6,
}

class TagStatus {
  /**
   * 默认的Style集合 具体情况，看StatusEnum
   */
  #tagStatusColor: StatusStyleItem = {
    [StatusEnum.Default]: this.defaultStatusStyle(),
    [StatusEnum.ToSubmit]: this.toSubmitStatusStyle(),
    [StatusEnum.ToBeConfirmed]: this.toBeConfirmedStyle(),
    [StatusEnum.ToBeModified]: this.toBeConfirmedStyle(),
    [StatusEnum.Confirmed]: this.confirmedStyle(),
    [StatusEnum.Generated]: this.generatedStyle(),
    [StatusEnum.Voided]: this.voidedStyle(),
  }

  defaultStatusStyle() {
    return { bgColor: '#f2f4f5', fontColor: '#000', txt: '默认' }
  }

  toSubmitStatusStyle() {
    return { bgColor: '#f4f5f7', fontColor: '#5c626a', txt: '待提交' }
  }

  toBeConfirmedStyle() {
    return { bgColor: '#ecf2fe', fontColor: '#4787f0', txt: '待确认' }
  }

  toBeModifiedStyle() {
    return { bgColor: '#eae6ff', fontColor: '#9963d8', txt: '待修改' }
  }

  confirmedStyle() {
    return { bgColor: '#ebf9f6', fontColor: '#00a98f', txt: '已确认' }
  }

  generatedStyle() {
    return { bgColor: '#ebf9f6', fontColor: '#00a98f', txt: '已确认' }
  }

  voidedStyle() {
    return { bgColor: '#fff2f0', fontColor: '#ff4d4f', txt: '已确认' }
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

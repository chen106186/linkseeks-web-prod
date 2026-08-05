import { cloneDeep } from 'lodash'
import { PRICE_TYPE_ENUM } from '../constants'

/**
 * 标志非阶梯价时，获取单价的key
 */
export const UNIT_PRICE_KEY = '0-0'

interface StepPriceRange {
  numberMin: string | number
  numberMax: string | number
  numberPrice: number
}

class StepPriceRange {
  numberMin: string | number
  numberMax: string | number
  numberPrice: number

  constructor(key: string, value: number) {
    const [numberMin, numberMax] = key.split('-')
    this.numberMin = numberMin
    this.numberMax = numberMax
    this.numberPrice = value
  }
}
export class PriceDataModal {
  /**
   * 当前价格
   */
  price: number
  /**
   * 副单位换算比率
   */
  subPriceRate: number
  /**
   * 是否阶梯价
   */
  isStep = false

  /**
   * 阶梯价格
   */
  stepPrice: StepPriceRange[]

  /**
   * 阶梯副单位价格
   */
  stepSubPrice: StepPriceRange[]

  /**
   * 传入详情的价格对象
   * 自动判断是否是阶梯价格
   */
  initUnitPrice(target: Record<string, any>) {
    const isStep = PriceDataModal.validateStepPrice(target)
    if (isStep) {
      const results = Object.keys(target).map((key) => {
        const stepPriceRange = new StepPriceRange(key, target[key])
        return stepPriceRange
      })
      this.isStep = true
      this.setStepPrice(results)
    } else {
      this.setPrice(target[UNIT_PRICE_KEY])
    }
  }

  initSubUnitPrice(target: Record<string, any>, priceRate: number) {
    const isStep = PriceDataModal.validateStepPrice(target)
    this.setSubPriceRate(priceRate)
    if (isStep) {
      const results = Object.keys(target).map((key) => {
        const stepPriceRange = new StepPriceRange(key, target[key])
        return stepPriceRange
      })
      this.setStepSubPrice(results)
    }
  }
  setPrice(price: number) {
    this.price = price
  }

  setStepPrice(stepPrice: StepPriceRange[]) {
    this.stepPrice = cloneDeep(stepPrice)
  }

  setStepSubPrice(stepSubPrice: StepPriceRange[]) {
    this.stepSubPrice = cloneDeep(stepSubPrice).map((v) => {
      v.numberPrice = this.getSubPrice(v.numberPrice)
      return v
    })
  }

  // 设置副单位换算比率
  setSubPriceRate(priceRate: number) {
    this.subPriceRate = priceRate
  }

  getPrice() {
    return this.price
  }

  getStepPrice() {
    return this.stepPrice
  }

  getSubPriceRate() {
    return this.subPriceRate
  }

  /**
   * 获取副单位价格
   */
  getSubPrice(price?: number) {
    const clurPrice = price || this.price
    // 保留4位小数
    return parseFloat(((clurPrice * this.subPriceRate) / 100).toFixed(4))
  }

  // 输出单价
  outputPrice() {
    return {
      [UNIT_PRICE_KEY]: this.price,
    }
  }

  // 输出阶梯价
  outputStepPrice() {
    return this.stepPrice.reduce((prev, next) => {
      const key = `${next.numberMin}-${next.numberMax}`
      prev[key] = next.numberPrice
      return prev
    }, {} as Record<string, number>)
  }

  // 输出副单位阶梯价
  outputStepSubPrice() {
    return this.stepSubPrice.reduce((prev, next) => {
      const key = `${next.numberMin}-${next.numberMax}`
      prev[key] = next.numberPrice
      return prev
    }, {} as Record<string, number>)
  }

  // 检测传入的对象是否是阶梯价
  static validateStepPrice(validate: any) {
    if (validate[UNIT_PRICE_KEY] !== undefined) {
      return false
    } else {
      return true
    }
  }
  // 获取副单位价格
  getSubPriceWithCurrency(priceTypeValue: PRICE_TYPE_ENUM) {
    if (priceTypeValue === PRICE_TYPE_ENUM.POINT_GOODS_PRICE) {
      return this.getSubPrice()
    }
    return `￥${this.getSubPrice()}`
  }
  // 获取单位价格
  getPriceWithCurrency(priceTypeValue: PRICE_TYPE_ENUM) {
    if (priceTypeValue === PRICE_TYPE_ENUM.POINT_GOODS_PRICE) {
      return this.getPrice()
    }
    return `￥${this.getPrice()}`
  }
}

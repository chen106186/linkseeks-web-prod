/*
 * @Author: XieZhiXiong
 * @Date: 2021-02-01 20:29:33
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-02-22 19:03:40
 * @Description: 相关接口
 */
import React from 'react';

export interface Sku {
  /**
   * 主键id
   */
  id: number
  /**
   * 商品属性 ,GoodsAttributeResponse
   */
  attributeAndValueList: {
    /**
     * 主键id
     */
    id?: number
    /**
     * 会员属性 ,CustomerAttributeResponse
     */
    customerAttribute?: {
      /**
       * 主键id
       */
      id?: number
      /**
       * 属性组名
       */
      groupName?: string
      /**
       * 属性名称
       */
      name?: string
      /**
       * 是否搜索属性
       */
      isSearch?: boolean
    }
    /**
     * 会员属性值 ,CustomerAttributeValueResponse
     */
    customerAttributeValue?: {
      /**
       * 主键id
       */
      id?: number
      /**
       * 属性值
       */
      value?: string
    }
  }[]
  /**
   * 商品单价(该参数为map)
   */
  unitPrice: { [key: string]: any }
  /**
   * 会员商品skuId(用于渠道商品查询库存)
   */
  commodityUnitPriceAndPicId: number
  /**
   * 商品图片 :
   */
  commodityPic: string[]
  /**
   * 库存数量
   */
  stockCount: number
}

export interface ProductInfo {
  /**
   * 数据id
   */
  id: number
  /**
   * 商品名称
   */
  name: string,
  /**
   * 对低价
   */
  min: number,
  /**
   * 最高价
   */
  max: number,
  /**
   * 计量单位
   */
  unitName: string,
  /**
   * 商品主图
   */
  mainPic: string,
  /**
   * 最小起订量
   */
  minOrder: number,
  /**
   * 价格类型
   */
  priceType?: number,
}

export interface ISku {
  /**
   * 数据id
   */
  id: number,
  /**
   * 商品id
   */
  productId: number,
  /**
   * sku 名称
   */
  name: string,
  /**
   * 最低价格
   */
  minPrice: number,
  /**
   * 最小起订量
   */
  minOrder: number,
  /**
   * 库存
   */
  stockCount: number,
  /**
   * 阶梯价格
   */
  ladder: LadderItem[],
  /**
   * 当前活动的阶梯价格
   */
  active: number,
  /**
   * 当前购买数量
   */
  quantity: number,
  /**
   * 是否禁用步进器
   */
  disabled: boolean,
  /**
   * 当前数量选择的数量对应的会员价格
   */
  memberPriceValue: number,
  /**
   * 当前选择数量的数量对应的价格
   */
  priceValue: number,
  /**
   * 会员商品skuId(用于渠道商品查询库存)
   */
  commodityUnitPriceAndPicId: number
}

export interface Iprops {
  /**
   * 商品信息
   */
  productInfo: ProductInfo,
  /**
   * 商品数据
   */
  sku: Sku[],
  /**
   * 会员折扣
   */
  parameter: number | undefined,
  /**
   * 是否可见
   */
  visible: boolean,
  /**
   * 取消事件
   */
  onCancel: () => void,
  /**
   * sku改变触发，value 是 quantity 数量 大于 0 的项
   */
  onChange: (value: ISku[]) => void,
  /**
   * 确定事件
   */
  onConfirm: (value: ISku[], count?: number, amount?: number) => void,
  /**
   * 自定义渲染确定按钮
   */
  customRenderActions?: React.ReactNode,
  isGroup?: boolean,
}

export interface LadderItem {
  /**
   * 数据id，遍历用
   */
  id: string,
  /**
   * 阶梯价格
   */
  price: number,
  /**
   * 会员价格
   */
  memberPrice: number,
  /**
   * 起始值
   */
  star: number,
  /**
   * 结束值
   */
  end: number,
  /**
   * 起订量, eg: (50-99 吨起)
   */
  minimum: string,
}

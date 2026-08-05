/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-13 16:54:26
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-10-13 16:54:26
 * @Description: 过滤的类型声明
 */
export enum FILTER_BAR_TYPE {
  /**
   * 销量从高到低
   */
  soldSort = 'soldSort',
  /**
   * 信用排序
   */
  creditSort = 'creditSort',
  /**
   * 价格排序
   */
  priceSort = 'priceSort',
  /**
   * 发布时间
   */
  publishTime = 'publishTime',
  /**
   * 剩余时间
   */
  remainingTime = 'remainingTime',
	/**
	 * 默认
	 */
	defaultdSort = 'defaultdSort',
	/**
	 * 预估返利
	 */
	rewardSort = 'rewardSort',
}

// export type FILTER_PARAM_KEY = 'categoryId' | 'categoryIdList' | 'customerCategoryId' | 'customerCategoryIdList'

export enum FILTER_PARAM_KEY {
  /**
   * 平台后台品类id
   */
  categoryId = 'categoryId',
  /**
   * 平台后台品类id数组 ,Long
   */
  categoryIdList = 'categoryIdList',
  /**
   * 会员品类id
   */
  customerCategoryId = 'customerCategoryId',
  /**
   * 会员品类id数组 ,Long
   */
  customerCategoryIdList = 'customerCategoryIdList',
  /**
   * 品牌id
   */
  brandId = 'brandId',
  /**
   * 品牌id数组 ,Long
   */
  brandIdList = 'brandIdList',
  /**
   * 产品定价：1-现货价格,2-价格需要询价,3-积分兑换商品 ,Integer
   */
  priceTypeList = 'priceTypeList',
  /**
   * 最小价格
   */
  min = 'min',
  /**
   * 最大价格
   */
  max = 'max',
  /**
   * 省份行政编号
   */
  provinceCode = 'provinceCode',
  /**
   * 城市行政编号
   */
  cityCode = 'cityCode',
}

export type FILTER_PARAM = {
  [key in FILTER_PARAM_KEY]: any
}

export type FILTER_BAR_TYPE_ONE =
  | FILTER_BAR_TYPE.soldSort
  | FILTER_BAR_TYPE.creditSort
  | FILTER_BAR_TYPE.priceSort
  | FILTER_BAR_TYPE.publishTime
  | FILTER_BAR_TYPE.remainingTime
	| FILTER_BAR_TYPE.defaultdSort
	| FILTER_BAR_TYPE.rewardSort

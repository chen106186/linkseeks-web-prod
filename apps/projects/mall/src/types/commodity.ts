/**
 * 品类
 */
export interface CategoryItemType {
  id: number
  categoryId: number
  key: string
  title: string | React.ReactNode
  link?: string
  name: string
  treeName: string
  children?: CategoryItemType[]
  brandList?: {
    brandId: number
    brandLogo: string
    brandName: string
  }[]
}

export interface CategoryDesignConfigItemType {
  /**
   * 品类ID
   */
  categoryId: number
  /**
   * 品类名称
   */
  categoryName: string
  /**
   * 是否选择 1.是 0.否
   */
  selectStatus: number
  /**
   * 品类ID
   */
  id: number
  /**
   * 品类名称
   */
  name: string
  /**
   * 是否展示
   */
  isShow: number
  categoryDetail: {
    /**
     * 品类广告图
     */
    categoryAdvertPicUrl: string
    /**
     * 店铺数量
     */
    shopNum: number
    /**
     * 商品数量
     */
    goodsNum: number
    /**
     * 是否展示
     */
    isShow: number
    /**
     * 三号广告数组
     */
    thirdAdvertList: {
      /**
       * 是否删除(逻辑删除标志:1代表已删除)
       */
      isDeleted: number
      /**
       * 版本号(乐观锁)
       */
      version: number
      /**
       * 创建时间(自动填充)
       */
      createTime: number
      /**
       * 修改时间(自动填充)
       */
      updateTime: number
      id: number
      /**
       * 装修ID
       */
      adornId: number
      /**
       * 平台品类ID 当广告类型为三号广告时才有ID值
       */
      categoryId: number
      /**
       * 广告类型: 1.一号广告 2.二号广告 3.三号广告 4.四号广告
       */
      type: number
      /**
       * 广告名称
       */
      name: string
      /**
       * 广告图片
       */
      picUrl: string
      /**
       * 链接
       */
      link: string
      /**
       * 排序
       */
      sort: number
      /**
       * 会员ID
       */
      memberId: number
      /**
       * 角色ID
       */
      roleId: number
    }[]
    /**
     * 品类数组
     */
    categoryBOList: {
      /**
       * 品类ID
       */
      categoryId: number
      /**
       * 品类名称
       */
      categoryName: string
      /**
       * 是否选择 1.是 0.否
       */
      selectStatus: number
      /**
       * 品类ID
       */
      id: number
      /**
       * 品类名称
       */
      name: string
      /**
       * 是否展示
       */
      isShow: number
      /**
       * 排序
       */
      sort: number
    }[]
    /**
     * 商品数组
     */
    goodsBOList: {
      /**
       * 商品ID
       */
      goodsId: number
      /**
       * 商品名称
       */
      goodsName: string
      /**
       * 商品图片
       */
      goodsPicUrl: string
      /**
       * 商品标语
       */
      goodsSlogan: string
      /**
       * 商品卖点
       */
      goodsPoints: string[]
      /**
       * 商品价格
       */
      goodsPrice: string
      /**
       * 品类名称
       */
      categoryName: string
      /**
       * 品牌名称
       */
      brandName: string
      /**
       * 会员ID
       */
      memberId: number
      /**
       * 会员角色ID
       */
      memberRoleId: number
      /**
       * 店铺ID
       */
      shopId: number
      /**
       * 单价范围
       */
      priceRange: string
      /**
       * 供应会员
       */
      supplier: string
      /**
       * 产品定价：1-现货价格, 2-价格需要询价, 3-积分兑换商品
       */
      priceType: number
      /**
       * 已售数量(会员商品)
       */
      sold: number
      /**
       * 已售数量(渠道商品)
       */
      channelSold: number
      /**
       * 活动标签集合
       */
      tagList: string[]
    }[]
    /**
     * 店铺数组
     */
    storeList: {
      /**
       * 店铺ID
       */
      storeId: number
      /**
       * 公司LOGO
       */
      logo: string
      /**
       * 店铺名称
       */
      name: string
      /**
       * 会员ID
       */
      memberId: number
      /**
       * 角色ID
       */
      roleId: number
    }[]
    /**
     * 品牌数组
     */
    brandBOList: {
      /**
       * 品牌ID
       */
      brandId: number
      /**
       * 品牌Logo
       */
      brandLogo: string
      /**
       * 品牌名称
       */
      brandName: string
    }[]
    /**
     * 品类广告图
     */
    advertPicUrl: string
  }
}

export interface FirstCategoryListType {
  /**
   * 品类ID
   */
  categoryId: number
  /**
   * 品类名称
   */
  categoryName: string
  /**
   * 是否选择 1.是 0.否
   */
  selectStatus: number
  /**
   * 品类ID
   */
  id: number
  /**
   * 品类名称
   */
  name: string
  /**
   * 是否展示
   */
  isShow: number
}

export type CategoryDesignConfigApiResult = CategoryDesignConfigItemType

/**
 * 筛选类型
 */
export enum FILTER_TYPE {
  /**
   * 常用筛选
   */
  commonlyUsed = 'commonlyUsed',
  /**
   * 分类
   */
  category = 'category',
  /**
   * 分类名称
   */
  categoryName = 'categoryName',
  /**
   * 会员品类
   */
  customerCategory = 'customerCategory',
  /**
   * 分类和属性
   */
  categoryAndAttr = 'categoryAndAttr',
  /**
   * 风格
   */
  style = 'style',
  /**
   * 品牌
   */
  brand = 'brand',
  /**
   * 价格
   */
  price = 'price',
  /**
   * 最低价格
   */
  minPrice = 'minPrice',
  /**
   * 最高价格
   */
  maxPrice = 'maxPrice',
  /**
   * 发货地
   */
  useArea = 'useArea',
  /**
   * 发货地省份
   */
  province = 'province',
  /**
   * 发货地市区
   */
  city = 'city',
  /**
   * 商品类型
   */
  commodityType = 'commodityType',
  /**
   * 运费方式:1-卖家承担运费（默认）,2-买家承担运费
   */
  carriageType = 'carriageType',
  /**
   * 活跃店铺
   */
  activeStores = 'activeStores',
  /**
   * 活跃采购商
   */
  activePurchase = 'activePurchase',
  /**
   * 最新加入
   */
  newJoin = 'newJoin',
  /**
   * 最新加入采购商
   */
  newJoinPurchase = 'newJoinPurchase',
  /**
   * 所需积分
   */
  points = 'points',
  /**
   * 最低积分
   */
  minPoints = 'minPoints',
  /**
   * 最高积分
   */
  maxPoints = 'maxPoints',
  /**
   * 商品名称
   */
  name = 'name',
  /**
   * 排序
   */
  sort = 'sort',
  /**
   * 价格排序
   */
  priceSort = 'priceSort',
  /**
   * 价格从高到低
   */
  priceSortHighToLow = 'priceSortHighToLow',
  /**
   * 价格从低到高
   */
  priceSortLowToHigh = 'priceSortLowToHigh',
  /**
   * 销量从高到低
   */
  soldSort = 'soldSort',
  /**
   * 信用排序
   */
  creditSort = 'creditSort',
  /**
   * 信用从高到低
   */
  creditSortHighToLow = 'creditSortHighToLow',
  /**
   * 信用从低到高
   */
  creditSortLowToHigh = 'creditSortLowToHigh',
  /**
   * 店铺信用从高到低
   */
  shopCreditSortHighToLow = 'shopCreditSortHighToLow',
  /**
   * 店铺信用从低到高
   */
  shopCreditSortLowToHigh = 'shopCreditSortLowToHigh',
  /**
   * 时间排序
   */
  dateSort = 'dateSort',
  /**
   * 时间从高到低
   */
  dateSortHighToLow = 'dateSortHighToLow',
  /**
   * 时间从低到高
   */
  dateSortLowToHigh = 'dateSortLowToHigh',
  /**
   * 属性筛选
   */
  attribute = 'attribute',
  /**
   * 店铺地区筛选
   */
  shopArea = 'shopArea',
  /**
   * 关键词搜索
   */
  keyword = 'keyword',
  shopKeyword = 'shopKeyword',
  /**
   * mroFilter
   */
  mroFilter = 'mroFilter',
  /**
   * 忽略选项
   */
  nullFilter = 'nullFilter',
  /**
   * 发布开始时间
   */
  publicStartTime = 'publicStartTime',
  /**
   * 发布结束时间
   */
  publicEndTime = 'publicEndTime',
  /**
   * 项目关键词
   */
  projectKeyword = 'projectKeyword',
  /** 寻源类型 */
  sourceType = 'sourceType',
  /** 只看与我相关 */
  aboutUs = 'aboutUs',
}

export interface CommodityItemType {
  /**
   * 主键id
   */
  id: number
  /**
   * 会员品类 ,CustomerCategoryResponse
   */
  customerCategory: {
    /**
     * 主键id
     */
    id?: number
    /**
     * 会员品类名称
     */
    name?: string
    /**
     * 完整Id
     */
    fullId?: string
    /**
     * 排序
     */
    sort?: number
    /**
     * 平台后台品类 ,CategoryResponse
     */
    category?: {
      /**
       * 主键id
       */
      id?: number
      /**
       * 名称
       */
      name?: string
      /**
       * 排序
       */
      sort?: number
      /**
       * 完整Id
       */
      fullId?: string
    }
  }
  /**
   * 品牌 ,BrandResponse
   */
  brand: {
    /**
     * id
     */
    id?: number
    /**
     * 品牌名称
     */
    name?: string
    /**
     * 品牌logo
     */
    logoUrl?: string
  }
  /**
   * 商品主图
   */
  mainPic: string
  /**
   * 商品名称
   */
  name: string
  /**
   * 商品标语
   */
  slogan: string
  /**
   * 商品卖点 :
   */
  sellingPoint: string[]
  /**
   * 计量单位id
   */
  unitName: string
  /**
   * 最小起订
   */
  minOrder: number
  /**
   * 产品定价：1-现货价格,2-价格需要询价,3-积分兑换商品
   */
  priceType: number
  /**
   * 最小值
   */
  min: number
  /**
   * 最大值
   */
  max: number
  /**
   * 已售
   */
  sold: number
  /**
   * 店铺信用积分
   */
  creditScore: number
  /**
   * 库存数量
   */
  stockCount: number
  /**
   * 会员id
   */
  memberId: number
  /**
   * 会员角色id
   */
  memberRoleId: number
  /**
   * 会员名称
   */
  memberName: string
  /**
   * 店铺id
   */
  storeId: number
  /**
   * 店铺名称
   */
  storeName: string
  /**
   * 店铺logo
   */
  storeLogo: string
  /**
   * 会员商品上架时间
   */
  publishTime: number
  /**
   * 商品优惠价格
   */
  preferentialPrice: number
  /**
   * 活动标签集合 ,String
   */
  tagList: string[]
  /**
   * 商品属性 ,CommodityAttribute
   */
  commodityAttributeList: {
    /**
     * 主键id
     */
    id?: number
    /**
     * 会员属性 ,SimpleCustomerAttribute
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
      /**
       * 后台属性实体 ,SimpleAttribute
       */
      attribute?: {
        /**
         * 主键id
         */
        id?: number
        /**
         * 属性组名
         */
        groupName: string
        /**
         * 属性名称
         */
        name: string
        /**
         * 是否搜索属性
         */
        isSearch?: boolean
      }
    }
    /**
     * 会员属性值 ,SimpleCustomerAttributeValue
     */
    customerAttributeValueList?: {
      /**
       * 主键id
       */
      id?: number
      /**
       * 属性值
       */
      value?: string
      /**
       * 后台属性实体 ,SimpleAttributeValue
       */
      attributeValue?: {
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
  }[]
}

export interface BrandItemType {
  id: number
  /**
   * 品牌名称
   */
  name: string
  /**
   * 品牌logo
   */
  logoUrl: string
}

export interface MroCategoryItemType {
  id: string
  groupId: number
  groupName: string
  name: string
  code?: string
  type: number
  isEnable: boolean
  isEmpty: boolean
  isPrice: boolean
  isSearch: boolean
  isDate?: boolean
  isArea?: boolean
  memberId: number
  memberName: string
  memberRoleId: number
  memberRoleName: string
  userId: number
  userName: string
  createTime: number
  customerAttributeValueList: {
    id: number
    value: string
    imageUrl?: string
    isEnable: boolean
    memberId: number
    memberName: string
    memberRoleId: number
    memberRoleName: string
    userId: number
    userName: string
    createTime: number
    attributeValue: {
      id: number
      value: string
      imageUrl?: string
      isEnable: boolean
    }[]
    able: boolean
  }[]
  attribute: {
    id: number
    groupId: number
    groupName: string
    name: string
    type: number
    isEnable: boolean
    isEmpty: boolean
    isPrice: boolean
    isSearch: boolean
    isDate: boolean
    isArea: boolean
    createTime: number
    attributeValueList: {
      id: number
      value: string
      imageUrl?: string
      isEnable: boolean
    }[]
    sort: number
  }[]
  sort: number
}

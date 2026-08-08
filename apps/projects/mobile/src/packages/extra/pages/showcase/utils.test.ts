import { describe, expect, it } from 'vitest'
import { normalizeShowcaseProductList } from './utils'

describe('normalizeShowcaseProductList', () => {
  it('保留拼团跳转和库存展示依赖字段', () => {
    const list = normalizeShowcaseProductList(
      [
        {
          id: 1001,
          name: '拼团商品',
          slogan: '活动商品',
          min: 12.3,
          max: 18.8,
          unitName: '件',
          sold: 99,
          mainPic: 'https://example.com/pic.png',
          storeId: 2001,
          preferentialPrice: 11.1,
          tagList: ['拼团'],
          priceType: 1,
          activityTypeList: [9, 17],
          stockCount: 8,
          minOrder: 2,
          groupPurchase: true,
        },
      ],
      true,
    )

    expect(list).toHaveLength(1)
    expect(list[0]).toMatchObject({
      saleTags: ['拼团'],
      activityTypeList: [9, 17],
      stockCount: 8,
      minOrder: 2,
      groupPurchase: true,
    })
  })

  it('非自营场景补齐供应商信息', () => {
    const list = normalizeShowcaseProductList(
      [
        {
          id: 1002,
          name: '普通商品',
          slogan: '供应商商品',
          min: 20,
          sold: 10,
          mainPic: 'https://example.com/pic2.png',
          storeId: 2002,
          priceType: 1,
          stockCount: 10,
          minOrder: 1,
          memberId: 3001,
          memberRoleId: 4001,
          storeName: '供应商A',
        },
      ] as any,
      false,
    )

    expect(list[0].supplierInfo).toEqual({
      id: 3001,
      roleId: 4001,
      name: '供应商A',
    })
  })
})

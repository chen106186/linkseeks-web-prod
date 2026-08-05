---
title: 小程序店铺橱窗详情页商品不显示
date: 2026-04-10
category: ui-bugs
module: linkseeks-web/apps/projects/mobile
problem_type: ui_bug
component: frontend_stimulus
related_components:
  - taro-mini-program
  - showcase-routing
symptoms:
  - 小程序商城首页 type=4 店铺橱窗已配置店铺和商品，但进入橱窗详情页后商品不显示
  - 详情页请求 /commodity/mobile/storeMobile/memberShopInCommodityList 缺少 storeInCommodityList 参数
root_cause: logic_error
resolution_type: code_fix
severity: medium
tags:
  - taro
  - mini-program
  - showcase
  - route-query
  - store-products
---

# 小程序店铺橱窗详情页商品不显示

## Problem

小程序端商城首页 `type=4` 店铺橱窗广告进入橱窗详情页后不显示商品。装修数据里店铺 `18900000000` 已选择 3 个商品，但详情页请求没有携带后端需要的 `storeInCommodityList`。

## Symptoms

- 管理端 `/mallManage/jointManage/joint/design/mobile/edit` 的装修数据正常，`docs/小程序装修.json` 和测试环境 `/commodity/adorn/manage/findByShopId?shopId=2` 都能看到店铺 `18900000000`、`id=3`、`productIds: [383, 384, 368]`。
- 破损请求 `/commodity/mobile/storeMobile/memberShopInCommodityList` 的 body 只有分页、地区和 `shopId`，缺少 `storeInCommodityList`。
- 手动带上 `storeInCommodityList: [{ "storeId": 3, "commodityIdList": [383, 384, 368] }]` 后，接口返回店铺 `18900000000` 和 3 个预期商品：`小台芒 500g`、`妃子笑荔枝 1kg`、`精品红富士 _1`。

## What Didn't Work

- 只检查管理端装修配置不够。装修数据和 `findByShopId` 接口返回都是正确的，问题不在 admin 保存链路。
- 只看用户给出的 `packages/extra/pages/showcase/index.wxml` 容易误判，实际 Taro 构建产物在 `apps/projects/mobile/dist/weapp/packages/extra/pages/showcase/index.wxml`。
- 直接把复杂对象数组 `details` 放进 `Router.navigateTo` 查询参数不可靠。小程序路径会经过 `qs.stringify` 和路由 query 序列化，`details` 这种对象数组没有稳定保真，详情页再执行 `details.map` 时拿不到可用结构。

## Solution

在 `apps/projects/mobile/src/packages/extra/pages/mall/b2b/components/ShowCase/index.tsx` 中，不再把完整 `details` 对象数组直接透传到路由 query，而是为 `type=4` 店铺橱窗显式序列化后端真正需要的最小字段：

```ts
const getStoreInCommodityList = (type: number, details?: ShowcaseShopItem[]) => {
  if (type !== 4 || !details || details.length === 0) return undefined

  return JSON.stringify(
    details.map((item) => ({
      storeId: item.id,
      commodityIdList: item.productIds || [],
    })),
  )
}

Router.navigateTo('extra/showcase', {
  name,
  type,
  banner,
  inner,
  storeInCommodityList: getStoreInCommodityList(type, details),
  id: id?.join(','),
})
```

在 `apps/projects/mobile/src/packages/extra/pages/showcase/index.tsx` 中，新增解析逻辑，支持普通 JSON 字符串和被 query 编码后的字符串：

```ts
const parseStoreInCommodityList = (storeInCommodityList?: string | StoreInCommodityItem[]) => {
  if (Array.isArray(storeInCommodityList)) return storeInCommodityList
  if (!storeInCommodityList) return undefined

  const parse = (value: string) => {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : undefined
  }

  try {
    return parse(storeInCommodityList)
  } catch {
    try {
      return parse(decodeURIComponent(storeInCommodityList))
    } catch {
      return undefined
    }
  }
}
```

详情页 `type=4` 分支只在解析结果非空时设置请求参数：

```ts
case 4:
  param.shopId = shopAndSite?.id
  if (storeInCommodityList && storeInCommodityList.length > 0) {
    param.storeInCommodityList = storeInCommodityList
  }
  fetchDataListFn = postCommodityMobileStoreMobileMemberShopInCommodityList
  break
```

分享路径也同步携带 `storeInCommodityList`，避免转发进入时再次丢失店铺橱窗商品参数。

## Why This Works

根因是小程序路由 query 不适合直接承载复杂对象数组。`ShowCase` 原来把 `details` 直接交给 `Router.navigateTo`，但小程序端路径序列化后对象数组结构没有稳定保留，导致 `showcase` 详情页拿不到可用的 `details`，最终请求漏掉 `storeInCommodityList`。

修复后，跳转前就把店铺橱窗需要的 `{ storeId, commodityIdList }` 转成 JSON 字符串，详情页再显式解析并写入接口参数。这样路由只传递字符串，接口请求恢复为后端需要的结构。

## Prevention

- 不要把复杂对象数组直接塞进小程序路由 query。需要跨页面传递时，先提取最小字段，再 `JSON.stringify`，目标页用专门 parser 解析。
- 对路由参数解析提供 `decodeURIComponent` fallback，因为分享路径或 Taro 路由层可能会对 query 做编码。
- 验证装修类问题时，不只看管理端配置，还要抓实际业务接口 payload。这个问题的关键证据是实际请求缺少 `storeInCommodityList`。
- 对 `type=4` 这类特殊业务分支，测试或调试时应断言最终接口参数，而不是只断言页面跳转参数。

```ts
expect(requestBody.storeInCommodityList).toEqual([
  {
    storeId: 3,
    commodityIdList: [383, 384, 368],
  },
])
```

## Related Issues

- Fix commit: `7ac31921c5 fix(mobile): 修复店铺橱窗商品不显示`
- Related files:
  - `apps/projects/mobile/src/packages/extra/pages/mall/b2b/components/ShowCase/index.tsx`
  - `apps/projects/mobile/src/packages/extra/pages/showcase/index.tsx`
  - `docs/小程序装修.json`
- Verification passed: Prettier and ESLint on changed TSX files, `pnpm --filter=@projects/mobile build --type weapp`, and direct curl with `storeInCommodityList` returned the expected store and 3 products.

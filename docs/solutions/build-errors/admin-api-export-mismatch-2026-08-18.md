# Admin 与 Platform 构建 API 导出不匹配修复记录

## 问题现象

执行以下命令时构建失败：

```bash
pnpm build:admin
```

Rollup 报告 `getMarketingPlatformCbgTeamLeaderChangeGet` 未从 `@apps/apis` 导出。该错误发生在社区团购团长变更管理页面。

## 问题原因

团长变更管理页面仍引用带 `Change` 的旧 API 函数名，但当前生成的后台管理服务已经按照实际接口路径导出以下函数：

- `getMarketingPlatformCbgTeamLeaderPage`
- `getMarketingPlatformCbgTeamLeaderGet`
- `postMarketingPlatformCbgTeamLeaderExamine`

页面引用与生成接口不一致，导致 Rollup 在构建阶段无法解析导出。

## 修改内容

### 团长变更详情页

文件：`apps/projects/admin/src/pages/marketingManage/communityGroupBuying/teamLeaderChangeManage/detail.tsx`

| 修改前                                            | 修改后                                      |
| ------------------------------------------------- | ------------------------------------------- |
| `getMarketingPlatformCbgTeamLeaderChangeGet`      | `getMarketingPlatformCbgTeamLeaderGet`      |
| `postMarketingPlatformCbgTeamLeaderChangeExamine` | `postMarketingPlatformCbgTeamLeaderExamine` |

### 团长变更列表页

文件：`apps/projects/admin/src/pages/marketingManage/communityGroupBuying/teamLeaderChangeManage/view.tsx`

| 修改前                                        | 修改后                                  |
| --------------------------------------------- | --------------------------------------- |
| `getMarketingPlatformCbgTeamLeaderChangePage` | `getMarketingPlatformCbgTeamLeaderPage` |

### 平台代收账款结算页

文件：`apps/projects/admin/src/pages/settlementManage/platformSettlement/accountPayable/view.tsx`

| 修改前                                         | 修改后                                      |
| ---------------------------------------------- | ------------------------------------------- |
| `postReportSettlementPlatformManualSettlement` | `postSettlementJobPlatformManualSettlement` |

当前生成接口对应的请求路径仍为 `POST /settlement/job/platformManualSettlement`，请求参数仍为结算数据 `id`，因此本次只调整函数导出名称。

### 平台积分结算页

文件：`apps/projects/admin/src/pages/settlementManage/platformSettlement/score/view.tsx`

| 修改前                                      | 修改后                                   |
| ------------------------------------------- | ---------------------------------------- |
| `postReportSettlementScoreManualSettlement` | `postSettlementJobScoreManualSettlement` |

当前生成接口对应的请求路径仍为 `POST /settlement/job/scoreManualSettlement`，请求参数仍为结算数据 `id`。

### 商家端会员应付账款结算页

文件：`apps/projects/platform/src/pages/balance/accountsPayable/settlementList/view.tsx`

| 修改前                                       | 修改后                                    |
| -------------------------------------------- | ----------------------------------------- |
| `postReportSettlementMemberManualSettlement` | `postSettlementJobMemberManualSettlement` |

当前生成接口对应的请求路径仍为 `POST /settlement/job/memberManualSettlement`，请求参数仍为结算数据 `id`。

### 商家端摄像头管理页

文件：`apps/projects/platform/src/pages/commodityAbility/camera/manage/detail.tsx`

Platform 页面依赖以下摄像头管理函数，但当前生成的 API 服务中没有对应导出：

- `postCommodityWebCameraAdd`
- `postCommodityWebCameraUpdate`
- `postCommodityWebCameraDelete`
- `getCommodityWebCameraPage`

为避免修改自动生成目录，在 `apps/public/apis/src/custom/camera.ts` 中补充稳定的自定义 API 适配，并从 `apps/public/apis/src/index.ts` 统一导出。接口路径与后端 `CameraWebController` 保持一致：

- `POST /commodity/web/camera/add`
- `POST /commodity/web/camera/update`
- `POST /commodity/web/camera/delete`
- `GET /commodity/web/camera/page`

### 商家端分销商品新增页

文件：`apps/projects/platform/src/pages/marketingAbility/distribution/goods/add.tsx`

| 修改前                       | 修改后                      |
| ---------------------------- | --------------------------- |
| `postCommodityWebShopWebAll` | `getCommodityWebShopWebAll` |

当前生成接口使用 `GET /commodity/web/shopWeb/all` 查询商城列表，调用参数保持不变。

### 商家端 e 账户还款弹窗

文件：`apps/projects/platform/src/pages/payandSettle/capitalAccounts/eAccount/components/huankuanModel.tsx`

页面使用的批量退款和会员充值统计接口在后端仍然存在，但当前生成 API 中没有对应导出，因此在 `apps/public/apis/src/custom/eAccount.ts` 中补充以下适配：

- `postPayEAccountAllInPayProxyRechargeBatchRefund`：`POST /pay/eAccount/allInPay/proxy/recharge/batch/refund`
- `getPayEAccountAllInPayProxyRechargeCountMemberGet`：`GET /pay/eAccount/allInPay/proxy/recharge/count/member/get`
- `getPayEAccountAllInPayProxyRechargeMemberPage`：`GET /pay/eAccount/allInPay/proxy/recharge/member/page`

批量退款请求继续传递 `rechargeId` 数组和可选的 `remark`，未改为单笔退款接口。

### 商家端店铺打印机配置

文件：`apps/projects/platform/src/pages/shopAbility/shopManage/view.tsx`

后端打印机配置接口存在，但当前生成 API 中没有对应导出，因此在 `apps/public/apis/src/custom/printer.ts` 中补充以下适配：

- `postCommodityWebPrinterConfigConfig`：`POST /commodity/web/printerConfig/config`
- `getCommodityWebPrinterConfigGet`：`GET /commodity/web/printerConfig/get`
- `getCommodityWebPrinterConfigDelete`：`GET /commodity/web/printerConfig/delete`
- `getCommodityWebPrinterConfigTest`：`GET /commodity/web/printerConfig/test`

同时补充页面原有依赖的 `PostCommodityWebPrinterConfigConfigRequest` 请求类型。

## 修改边界

- 未修改接口请求路径和请求参数。
- 未修改生成的 `apps/public/apis/src/services` 文件。
- 未重新生成 API，仅让业务页面使用当前已生成的正式导出名称。

## 验证方式

```bash
pnpm build:admin
```

前三次构建依次暴露并验证了团长变更管理、平台代收账款结算和平台积分结算中的旧 API 函数名。全部修正后再次执行构建，结果如下：

```text
✓ 9641 modules transformed.
✓ built in 55.20s
```

构建成功。当前仍有 Rollup 循环依赖提示和大体积 chunk 警告，但不影响本次构建完成，且与本次 API 函数名修复无关。

Platform 使用以下命令单独验证：

```bash
pnpm build:platform
```

Platform 构建依次确认会员手动结算旧名称、摄像头管理接口缺失、分销商品页商城查询旧名称、e 账户接口缺失及打印机配置接口缺失，均已完成修复。最终构建结果如下：

```text
✓ 14321 modules transformed.
✓ built in 1m 56s
```

Platform 构建成功。当前仍有空值合并运算符恒定返回左值、Rollup 循环依赖和大体积 chunk 警告，但均未阻止产物生成，与本次 API 导出修复无关。

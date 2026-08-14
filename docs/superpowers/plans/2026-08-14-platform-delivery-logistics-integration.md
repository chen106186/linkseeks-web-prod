# 平台后台"去发货 / 查看物流"前后端对接 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在平台后台订单详情页实现"去发货"和"查看物流"完整链路，打通 order-service 和 logistics-service 的 4 个平台发货接口。

**Architecture:** 前端已全部实现（OrderProductTable 含勾选框、PlatformDeliveryModal、PlatformLogisticsModal、platform.ts 服务层），需补充的是 order-service 中 4 个缺失的 Controller/Service 方法，以及 logistics-service 中 2 个新的支撑接口。`OrderDeliveryDO` 需增加 `logisticsOrderId` 字段用于追踪订阅 ID。

**Tech Stack:** Spring Boot 3 / Spring Cloud / OpenFeign / JPA / React + Ant Design / umi-request

---

## 现状概览

| 层 | 状态 |
| --- | --- |
| 前端 `OrderProductTable` | ✅ 已完成（勾选框、去发货按钮、查看物流按钮） |
| 前端 `PlatformDeliveryModal` | ✅ 已完成，调用 platform.ts 4 个方法 |
| 前端 `PlatformLogisticsModal` | ✅ 已完成，调用 logistics/detail |
| 前端 `apps/projects/admin/src/pages/orderManage/orderDetail/services/platform.ts` | ✅ 已完成，4 个方法指向正确 URL |
| 后端 `PlatformOrderManageController` | ❌ 缺少 4 个发货/物流接口 |
| 后端 `logistics-service` 物流公司全量列表 | ❌ 缺少平台级无 member 上下文的公司列表接口 |
| 后端 `logistics-service` 追踪订阅 feign | ❌ 缺少为平台发货创建订阅的接口 |
| `OrderDeliveryDO` | ❌ 缺少 `logisticsOrderId` 字段 |

---

## File Structure

### order-service 新增/修改

- **新增** `model/req/platform/PlatformDeliveryConfirmReq.java`
- **新增** `model/resp/platform/PlatformLogisticsCompanyResp.java`
- **新增** `model/resp/platform/PlatformOrderLogisticsDetailResp.java`
- **修改** `entity/OrderDeliveryDO.java` — 新增 `logisticsOrderId Long`
- **新增** DB migration: `src/main/resources/db/changelog/add_logistics_order_id_to_delivery.xml`
- **修改** `service/platform/IPlatformOrderManageService.java` — 新增 4 个方法
- **修改** `serviceImpl/platform/PlatformOrderManageServiceImpl.java` — 实现 4 个方法
- **修改** `controller/platform/PlatformOrderManageController.java` — 新增 4 个 endpoint

### logistics-service 新增/修改

- **新增** `model/req/LogisticsTrackingSubscribeForDeliveryReq.java`
- **修改** `controller/feign/LogisticsTrackingFeignController.java` — 新增 `subscribeForDelivery`
- **修改** `api/feign/ILogisticsTrackingFeign.java` — 新增 feign 方法
- **修改** `serviceImpl/LogisticsTrackingServiceImpl.java` — 实现 `subscribeForDelivery`
- **修改** `controller/PlatformSelectController.java` — 新增 `GET /listCompanyWithCode`

### 前端（验证/修复字段映射）

- 验证 `apps/projects/admin/src/pages/orderManage/orderDetail/services/platform.ts`

---

## Task 1: logistics-service — 新增平台物流公司列表接口（含 companyCode）

**Files:**

- Modify: `D:\JTCodes\元琛\micro-services-prod\logistics-service\src\main\java\com\ssy\lingxi\logistics\controller\PlatformSelectController.java`

- [ ] **Step 1: 在 `PlatformSelectController` 新增 `GET /listCompanyWithCode`**

```java
/**
 * 平台后台 - 物流公司全量列表（含编码，供订单发货选择）
 * @return 返回结果：id、company（公司名）、companyCode（快递鸟编码）
 */
@GetMapping(value = "/listCompanyWithCode")
public WrapperResp<List<Map<String, Object>>> listCompanyWithCode() {
    return WrapperUtil.success(selectService.listAllPlatformCompanyWithCode());
}
```

- [ ] **Step 2: 在 `ISelectService` 新增接口方法声明**

文件: `D:\JTCodes\元琛\micro-services-prod\logistics-service\src\main\java\com\ssy\lingxi\logistics\service\ISelectService.java`

```java
List<Map<String, Object>> listAllPlatformCompanyWithCode();
```

- [ ] **Step 3: 在 `SelectServiceImpl` 实现该方法**

文件: `D:\JTCodes\元琛\micro-services-prod\logistics-service\src\main\java\com\ssy\lingxi\logistics\serviceImpl\SelectServiceImpl.java`

```java
@Override
public List<Map<String, Object>> listAllPlatformCompanyWithCode() {
    return logisticsCompanyRepository
        .findAll((Specification<LogisticsCompanyDO>) (root, query, cb) ->
            cb.equal(root.get("status"), CommonStatusEnum.ENABLE.getCode()),
            Sort.by(Sort.Direction.ASC, "id"))
        .stream()
        .map(company -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", company.getId());
            item.put("company", company.getName());
            item.put("companyCode", company.getCode());
            return item;
        })
        .collect(Collectors.toList());
}
```

- [ ] **Step 4: 启动 logistics-service，curl 验证**

```bash
curl http://localhost:8082/logistics/platform/select/listCompanyWithCode
```

期望返回: `[{"id":1,"company":"顺丰速运","companyCode":"SF"},...]`

- [ ] **Step 5: Commit**

```bash
git add logistics-service/src/main/java/com/ssy/lingxi/logistics/controller/PlatformSelectController.java
git add logistics-service/src/main/java/com/ssy/lingxi/logistics/service/ISelectService.java
git add logistics-service/src/main/java/com/ssy/lingxi/logistics/serviceImpl/SelectServiceImpl.java
git commit -m "feat(logistics): add platform company list with companyCode for delivery UI"
```

---

## Task 2: logistics-service — 新增平台发货追踪订阅 feign 接口

当平台后台确认发货时，需在 logistics-service 创建一条最简化的 `LogisticsOrderDO` 并立即订阅快递轨迹。返回 `logisticsOrderId` 供 order-service 存储。

**Files:**

- Create: `D:\JTCodes\元琛\micro-services-prod\logistics-service\src\main\java\com\ssy\lingxi\logistics\model\req\LogisticsTrackingSubscribeForDeliveryReq.java`
- Modify: `D:\JTCodes\元琛\micro-services-prod\logistics-service\src\main\java\com\ssy\lingxi\logistics\controller\feign\LogisticsTrackingFeignController.java`
- Modify: `D:\JTCodes\元琛\micro-services-prod\logistics-service\logistics-service-api\src\main\java\com\ssy\lingxi\logistics\api\feign\ILogisticsTrackingFeign.java`
- Modify: `D:\JTCodes\元琛\micro-services-prod\logistics-service\src\main\java\com\ssy\lingxi\logistics\serviceImpl\LogisticsTrackingServiceImpl.java`

- [ ] **Step 1: 创建 Request 类 `LogisticsTrackingSubscribeForDeliveryReq`**

```java
package com.ssy.lingxi.logistics.model.req;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.io.Serializable;

@Data
public class LogisticsTrackingSubscribeForDeliveryReq implements Serializable {
    /** 关联订单号（orderNo），用于生成物流单 */
    @NotBlank
    private String relevanceOrderCode;

    /** 发货单号（deliveryNo），作为 shipmentOrderCode */
    private String deliveryNo;

    /** 快递运单号 */
    @NotBlank
    private String mailNo;

    /** 快递公司编码（快递鸟识别码，如 SF）*/
    @NotBlank
    private String expressCompanyCode;

    /** 快递公司名称 */
    private String expressCompanyName;
}
```

- [ ] **Step 2: 在 `ILogisticsTrackingFeign` 新增 feign 方法**

文件: `D:\JTCodes\元琛\micro-services-prod\logistics-service\logistics-service-api\src\main\java\com\ssy\lingxi\logistics\api\feign\ILogisticsTrackingFeign.java`

在现有接口中追加：

```java
/** 平台直接发货时：创建最简物流单并订阅轨迹，返回 logisticsOrderId */
@PostMapping(PATH_PREFIX + "subscribeForDelivery")
WrapperResp<Long> subscribeForDelivery(@RequestBody LogisticsTrackingSubscribeForDeliveryReq req);
```

注意：`PATH_PREFIX = ServiceModuleConstant.LOGISTICS_FEIGN_PATH_PREFIX + "/tracking/"` 已定义在该接口中。

- [ ] **Step 3: 在 `LogisticsTrackingFeignController` 实现 feign endpoint**

```java
@PostMapping("/subscribeForDelivery")
public WrapperResp<Long> subscribeForDelivery(
        @RequestBody @Validated com.ssy.lingxi.logistics.model.req.LogisticsTrackingSubscribeForDeliveryReq req) {
    return WrapperUtil.success(trackingService.subscribeForDelivery(req));
}
```

- [ ] **Step 4: 在 `ILogisticsTrackingService` 新增接口声明**

文件: `D:\JTCodes\元琛\micro-services-prod\logistics-service\src\main\java\com\ssy\lingxi\logistics\service\ILogisticsTrackingService.java`

```java
Long subscribeForDelivery(LogisticsTrackingSubscribeForDeliveryReq req);
```

- [ ] **Step 5: 在 `LogisticsTrackingServiceImpl` 实现 `subscribeForDelivery`**

文件: `D:\JTCodes\元琛\micro-services-prod\logistics-service\src\main\java\com\ssy\lingxi\logistics\serviceImpl\LogisticsTrackingServiceImpl.java`

需要注入 `LogisticsOrderRepository` 和 `LogisticsOrderDO`。

```java
@Transactional
@Override
public Long subscribeForDelivery(LogisticsTrackingSubscribeForDeliveryReq req) {
    // 1. 创建最简物流单（用于持有 logisticsOrderId）
    LogisticsOrderDO order = new LogisticsOrderDO();
    order.setRelevanceOrderCode(req.getRelevanceOrderCode());
    order.setShipmentOrderCode(req.getDeliveryNo());
    // 生成物流单号：LD + yyyyMMddHHmmss + 4位随机
    String logisticsOrderNo = "LD" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
            + String.format("%04d", new Random().nextInt(10000));
    order.setLogisticsOrderNo(logisticsOrderNo);
    order.setStatus(4); // 4 = 接受（直接入已接受状态，跳过审批流）
    order.setCreateType(2); // 2 = 销售发货
    LogisticsOrderDO saved = logisticsOrderRepository.save(order);

    // 2. 订阅轨迹
    LogisticsTrackingFillMailNoReq fillReq = new LogisticsTrackingFillMailNoReq();
    fillReq.setLogisticsOrderId(saved.getId());
    fillReq.setLogisticsOrderNo(logisticsOrderNo);
    fillReq.setMailNo(req.getMailNo());
    fillReq.setExpressCompanyCode(req.getExpressCompanyCode());
    fillReq.setExpressCompanyName(req.getExpressCompanyName());
    fillMailNo(fillReq);

    return saved.getId();
}
```

> ⚠️ 注意：`LogisticsOrderDO` 有 NOT NULL 约束字段需要检查，若有 `@NotNull` 字段缺少赋值会报数据库错误。先查看 `LogisticsOrderDO.java` 剩余字段并补充必填项（如 `companyId`、`memberId` 等），用 0 或占位符填充。

- [ ] **Step 6: Commit**

```bash
git commit -m "feat(logistics): add subscribeForDelivery feign for platform direct-ship tracking"
```

---

## Task 3: order-service — `OrderDeliveryDO` 新增 `logisticsOrderId` 字段 + DB 迁移

**Files:**

- Modify: `D:\JTCodes\元琛\micro-services-prod\order-service\src\main\java\com\ssy\lingxi\order\entity\OrderDeliveryDO.java`
- Create: DB migration changelog (查看项目使用的迁移工具：Liquibase 或 Flyway，在 `src/main/resources/db/` 目录下)

- [ ] **Step 1: 查看迁移工具**

```bash
ls D:/JTCodes/元琛/micro-services-prod/order-service/src/main/resources/db/
```

- [ ] **Step 2: 在 `OrderDeliveryDO` 新增字段**

在 `receiptNo` 字段之前插入：

```java
/**
 * 物流服务中对应的物流单Id（用于查询快递鸟轨迹订阅）
 */
@Column(columnDefinition = "int8")
@Comment("物流追踪订阅的物流单Id（logistics-service）")
private Long logisticsOrderId;
```

- [ ] **Step 3: 创建 DB 迁移脚本（根据实际迁移工具路径调整）**

Liquibase 示例 (changelog XML):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
                   http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.8.xsd">
    <changeSet id="add_logistics_order_id_to_delivery_20260814" author="platform">
        <addColumn tableName="os_delivery">
            <column name="logistics_order_id" type="bigint">
                <constraints nullable="true"/>
            </column>
        </addColumn>
        <rollback>
            <dropColumn tableName="os_delivery" columnName="logistics_order_id"/>
        </rollback>
    </changeSet>
</databaseChangeLog>
```

> ⚠️ 表名 `os_delivery` 需与 `@Table(name = ...)` 中定义的一致，根据实际 `TableNameConstant` 确认。

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(order): add logisticsOrderId field to OrderDeliveryDO for tracking"
```

---

## Task 4: order-service — 创建 Request/Response DTOs

**Files:**

- Create: `D:\JTCodes\元琛\micro-services-prod\order-service\src\main\java\com\ssy\lingxi\order\model\req\platform\PlatformDeliveryConfirmReq.java`
- Create: `D:\JTCodes\元琛\micro-services-prod\order-service\src\main\java\com\ssy\lingxi\order\model\resp\platform\PlatformLogisticsCompanyResp.java`
- Create: `D:\JTCodes\元琛\micro-services-prod\order-service\src\main\java\com\ssy\lingxi\order\model\resp\platform\PlatformOrderLogisticsDetailResp.java`

- [ ] **Step 1: 创建 `PlatformDeliveryConfirmReq`**

```java
package com.ssy.lingxi.order.model.req.platform;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
public class PlatformDeliveryConfirmReq implements Serializable {

    @NotBlank(message = "订单号不能为空")
    private String orderNo;

    @NotBlank(message = "发货地址不能为空")
    @Size(max = 200)
    private String address;

    @NotNull(message = "发货地址id不能为空")
    private Long addressId;

    private String deliveryTime;

    @Size(max = 50)
    private String logisticsNo;

    @Size(max = 200)
    private String company;

    @Size(max = 20)
    private String companyCode;

    @NotEmpty(message = "发货商品不能为空")
    @Valid
    private List<ProductItem> products;

    @Data
    public static class ProductItem implements Serializable {
        @NotNull @Positive
        private Long orderProductId;

        @NotNull @PositiveOrZero
        private Long relationId;

        @NotNull @PositiveOrZero
        private BigDecimal deliveryCount;
    }
}
```

- [ ] **Step 2: 创建 `PlatformLogisticsCompanyResp`**

```java
package com.ssy.lingxi.order.model.resp.platform;

import lombok.Data;
import java.io.Serializable;

@Data
public class PlatformLogisticsCompanyResp implements Serializable {
    private Long id;
    private String company;
    private String companyCode;
}
```

- [ ] **Step 3: 创建 `PlatformOrderLogisticsDetailResp`**

```java
package com.ssy.lingxi.order.model.resp.platform;

import lombok.Data;
import java.io.Serializable;
import java.util.List;

@Data
public class PlatformOrderLogisticsDetailResp implements Serializable {
    private Long orderId;
    private String orderNo;
    private Integer batchNo;
    private String deliveryNo;
    private String logisticsNo;
    private String company;
    private String companyCode;
    private Long logisticsOrderId;
    private String logisticsOrderNo;

    /** 快递鸟轨迹详情（可为 null，表示尚未订阅或订阅中） */
    private TrackingDetail trackingDetail;

    @Data
    public static class TrackingDetail implements Serializable {
        private Long logisticsOrderId;
        private String logisticsOrderNo;
        private String mailNo;
        private String expressCompanyCode;
        private String expressCompanyName;
        private Integer subscribeStatus;
        private String lastEventTime;
        private List<TrackingEvent> events;
    }

    @Data
    public static class TrackingEvent implements Serializable {
        private String acceptTime;
        private String acceptStation;
        private String remark;
        private String opCode;
        private Double lat;
        private Double lng;
    }
}
```

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(order): add platform delivery/logistics DTOs"
```

---

## Task 5: order-service — 实现 4 个 Service 方法

**Files:**

- Modify: `D:\JTCodes\元琛\micro-services-prod\order-service\src\main\java\com\ssy\lingxi\order\service\platform\IPlatformOrderManageService.java`
- Modify: `D:\JTCodes\元琛\micro-services-prod\order-service\src\main\java\com\ssy\lingxi\order\serviceImpl\platform\PlatformOrderManageServiceImpl.java`

- [ ] **Step 1: 在 `IPlatformOrderManageService` 新增 4 个方法声明**

在接口末尾追加：

```java
/** 查询订单可发货商品列表 */
List<VendorDeliveryProductResp> getPlatformDeliveryProducts(String orderNo);

/** 平台直接发货确认 */
void platformDeliveryConfirm(UserLoginCacheDTO loginUser, PlatformDeliveryConfirmReq req);

/** 获取物流公司列表（含 companyCode） */
List<PlatformLogisticsCompanyResp> getLogisticsCompanyList();

/** 查询订单物流轨迹详情 */
PlatformOrderLogisticsDetailResp getOrderLogisticsDetail(String orderNo, Integer batchNo);
```

需要的 import：

```java
import com.ssy.lingxi.order.model.req.platform.PlatformDeliveryConfirmReq;
import com.ssy.lingxi.order.model.resp.platform.PlatformLogisticsCompanyResp;
import com.ssy.lingxi.order.model.resp.platform.PlatformOrderLogisticsDetailResp;
import com.ssy.lingxi.order.model.resp.vendor.VendorDeliveryProductResp;
import java.util.List;
```

- [ ] **Step 2: 在 `PlatformOrderManageServiceImpl` 注入所需依赖**

在类顶部注入：

```java
@Resource
private OrderRepository orderRepository;

@Resource
private OrderDeliveryRepository orderDeliveryRepository;

@Resource
private IBaseOrderProductService baseOrderProductService;

@Resource
private IBaseOrderDeliveryService baseOrderDeliveryService;

@Resource
private ILogisticsTrackingFeign logisticsTrackingFeign;

// 用于获取物流公司列表（直接 HTTP 调用 logistics-service 的 platform select 端点）
// 方法见 Step 5
```

- [ ] **Step 3: 实现 `getPlatformDeliveryProducts`**

```java
@Override
public List<VendorDeliveryProductResp> getPlatformDeliveryProducts(String orderNo) {
    OrderDO order = orderRepository.findByOrderNo(orderNo)
        .orElseThrow(() -> new BusinessException(ResponseCodeEnum.ORDER_DOES_NOT_EXIST));
    // 检查订单发货条件（不校验 member 归属）
    baseOrderProductService.checkOrderDelivery(order, null);
    return baseOrderProductService.listVendorDeliveryProducts(order);
}
```

> ⚠️ 需确认 `orderRepository.findByOrderNo(String)` 方法是否存在。如不存在，改用:
>
> ```java
> OrderDO order = orderRepository.findAll((Specification<OrderDO>)(root, q, cb) ->
>     cb.equal(root.get("orderNo"), orderNo))
>     .stream().findFirst()
>     .orElseThrow(() -> new BusinessException(ResponseCodeEnum.ORDER_DOES_NOT_EXIST));
> ```

- [ ] **Step 4: 实现 `platformDeliveryConfirm`**

```java
@Override
@Transactional
public void platformDeliveryConfirm(UserLoginCacheDTO loginUser, PlatformDeliveryConfirmReq req) {
    OrderDO order = orderRepository.findByOrderNo(req.getOrderNo())
        .orElseThrow(() -> new BusinessException(ResponseCodeEnum.ORDER_DOES_NOT_EXIST));

    // 构建 VendorDeliveryReq 复用现有发货逻辑
    VendorDeliveryReq deliveryVO = new VendorDeliveryReq();
    deliveryVO.setOrderId(order.getId());
    deliveryVO.setAddress(req.getAddress());
    deliveryVO.setAddressId(req.getAddressId());
    deliveryVO.setDeliveryTime(req.getDeliveryTime());
    deliveryVO.setLogisticsNo(req.getLogisticsNo());
    deliveryVO.setCompany(req.getCompany());
    deliveryVO.setCompanyCode(req.getCompanyCode());
    deliveryVO.setProducts(req.getProducts().stream().map(p -> {
        VendorToDeliveryProductReq item = new VendorToDeliveryProductReq();
        item.setOrderProductId(p.getOrderProductId());
        item.setRelationId(p.getRelationId());
        item.setDeliveryCount(p.getDeliveryCount());
        return item;
    }).collect(Collectors.toList()));

    // Step 1: 校验并创建发货记录
    OrderDeliveryBO checkResult = baseOrderDeliveryService.checkVendorOrderDelivery(order, deliveryVO);
    if (checkResult.getNoDeliveryProducts()) {
        return;
    }

    // Step 2: 自动出库（与 vendor 流程一致）
    if (!order.getOrderKind().equals(OrderSourceKindEnum.SRM.getCode())
            && !OrderSourceKindEnum.REQUISITION.getCode().equals(order.getOrderKind())) {
        baseOrderDeliveryService.autoCreateOutOfStockOrder(order, deliveryVO, checkResult.getDeliveryNo());
    }

    // Step 3: 触发物流订阅（若填写了运单号）
    if (StringUtils.hasLength(req.getLogisticsNo()) && StringUtils.hasLength(req.getCompanyCode())) {
        try {
            LogisticsTrackingSubscribeForDeliveryReq subscribeReq = new LogisticsTrackingSubscribeForDeliveryReq();
            subscribeReq.setRelevanceOrderCode(req.getOrderNo());
            subscribeReq.setDeliveryNo(checkResult.getDeliveryNo());
            subscribeReq.setMailNo(req.getLogisticsNo());
            subscribeReq.setExpressCompanyCode(req.getCompanyCode());
            subscribeReq.setExpressCompanyName(req.getCompany());
            WrapperResp<Long> subscribeResp = logisticsTrackingFeign.subscribeForDelivery(subscribeReq);
            if (subscribeResp != null && subscribeResp.getData() != null) {
                // 将 logisticsOrderId 回写到 deliveryNo 对应的发货记录
                orderDeliveryRepository.findByOrderAndDeliveryNo(order, checkResult.getDeliveryNo())
                    .ifPresent(delivery -> {
                        delivery.setLogisticsOrderId(subscribeResp.getData());
                        orderDeliveryRepository.save(delivery);
                    });
            }
        } catch (Exception e) {
            log.warn("平台发货订阅物流失败，orderNo={}, 不影响发货流程", req.getOrderNo(), e);
        }
    }
}
```

> ⚠️ `OrderDeliveryBO.getDeliveryNo()` 和 `OrderDeliveryBO.getNoDeliveryProducts()` 需确认存在，若不存在查看 `checkVendorOrderDelivery` 的实际返回类型并调整。 `orderDeliveryRepository.findByOrderAndDeliveryNo(order, deliveryNo)` 需检查 Repository 是否有该方法，没有的话用 `findAll(Specification)` 代替。

- [ ] **Step 5: 实现 `getLogisticsCompanyList`**

通过 `RestTemplate` 或已有 WebClient 调用 logistics-service（网关路由 `/logistics/platform/select/listCompanyWithCode`），或直接注入一个内部 Feign：

最简方案：直接在 `order-service` 通过 `RestTemplate` 调用（gateway 转发）。推荐方案：在 `ILogisticsSelectFeign` 新增方法（需改 logistics-service-api）。

**本计划使用 RestTemplate 方案，避免修改 API 模块：**

注入（在 ServiceImpl 里）：

```java
@Resource
private RestTemplate restTemplate; // 假设已配置，否则新增 @Bean
```

实现：

```java
@Override
public List<PlatformLogisticsCompanyResp> getLogisticsCompanyList() {
    // 内部 feign 调用 logistics-service
    // 网关前缀: http://logistics-service (service discovery)
    WrapperResp<List<Map>> resp = restTemplate.getForObject(
        "http://logistics-service/logistics/platform/select/listCompanyWithCode",
        WrapperResp.class
    );
    if (resp == null || resp.getData() == null) return new ArrayList<>();
    return ((List<Map<String, Object>>) resp.getData()).stream().map(item -> {
        PlatformLogisticsCompanyResp company = new PlatformLogisticsCompanyResp();
        company.setId(item.get("id") != null ? ((Number) item.get("id")).longValue() : null);
        company.setCompany((String) item.get("company"));
        company.setCompanyCode((String) item.get("companyCode"));
        return company;
    }).collect(Collectors.toList());
}
```

> ⚠️ 若 order-service 已有 LoadBalanced RestTemplate，直接用。若无，查看项目是否使用 OpenFeign，若是则在 `ILogisticsSelectFeign` 新增方法更优雅。根据实际项目结构选一种。

- [ ] **Step 6: 实现 `getOrderLogisticsDetail`**

```java
@Override
public PlatformOrderLogisticsDetailResp getOrderLogisticsDetail(String orderNo, Integer batchNo) {
    // 1. 找到订单
    OrderDO order = orderRepository.findByOrderNo(orderNo)
        .orElseThrow(() -> new BusinessException(ResponseCodeEnum.ORDER_DOES_NOT_EXIST));

    // 2. 找到发货记录（按 batchNo 或最新一条）
    List<OrderDeliveryDO> deliveries = orderDeliveryRepository.findByOrder(order,
        Sort.by(Sort.Direction.DESC, "batchNo"));
    OrderDeliveryDO delivery = (batchNo != null)
        ? deliveries.stream().filter(d -> batchNo.equals(d.getBatchNo())).findFirst().orElse(null)
        : deliveries.stream().findFirst().orElse(null);

    if (delivery == null) {
        throw new BusinessException(ResponseCodeEnum.DATA_DOES_NOT_EXIST);
    }

    // 3. 组装基本信息
    PlatformOrderLogisticsDetailResp resp = new PlatformOrderLogisticsDetailResp();
    resp.setOrderId(order.getId());
    resp.setOrderNo(orderNo);
    resp.setBatchNo(delivery.getBatchNo());
    resp.setDeliveryNo(delivery.getDeliveryNo());
    resp.setLogisticsNo(delivery.getLogisticsNo());
    resp.setCompany(delivery.getCompany());
    resp.setCompanyCode(delivery.getCompanyCode());
    resp.setLogisticsOrderId(delivery.getLogisticsOrderId());

    // 4. 获取追踪详情（若有 logisticsOrderId）
    if (delivery.getLogisticsOrderId() != null) {
        try {
            WrapperResp<LogisticsTrackingDetailResp> trackingResp =
                logisticsTrackingFeign.getTrackingDetail(delivery.getLogisticsOrderId());
            if (trackingResp != null && trackingResp.getData() != null) {
                LogisticsTrackingDetailResp src = trackingResp.getData();
                PlatformOrderLogisticsDetailResp.TrackingDetail detail =
                    new PlatformOrderLogisticsDetailResp.TrackingDetail();
                detail.setLogisticsOrderId(src.getLogisticsOrderId());
                detail.setLogisticsOrderNo(src.getLogisticsOrderNo());
                detail.setMailNo(src.getMailNo());
                detail.setExpressCompanyCode(src.getExpressCompanyCode());
                detail.setExpressCompanyName(src.getExpressCompanyName());
                detail.setSubscribeStatus(src.getSubscribeStatus());
                detail.setLastEventTime(src.getLastEventTime() != null
                    ? src.getLastEventTime().toString() : null);
                if (src.getEvents() != null) {
                    detail.setEvents(src.getEvents().stream().map(e -> {
                        PlatformOrderLogisticsDetailResp.TrackingEvent event =
                            new PlatformOrderLogisticsDetailResp.TrackingEvent();
                        event.setAcceptTime(e.getAcceptTime() != null ? e.getAcceptTime().toString() : null);
                        event.setAcceptStation(e.getAcceptStation());
                        event.setRemark(e.getRemark());
                        event.setOpCode(e.getOpCode());
                        return event;
                    }).collect(Collectors.toList()));
                }
                resp.setTrackingDetail(detail);
            }
        } catch (Exception e) {
            log.warn("获取物流轨迹失败，logisticsOrderId={}", delivery.getLogisticsOrderId(), e);
        }
    }
    return resp;
}
```

> ⚠️ `LogisticsTrackingDetailResp` 的字段路径需根据 `logistics-service-api` 的实际定义确认：文件: `D:\JTCodes\元琛\micro-services-prod\logistics-service\logistics-service-api\src\main\java\com\ssy\lingxi\logistics\api\model\resp\LogisticsTrackingDetailResp.java`

- [ ] **Step 7: Commit**

```bash
git commit -m "feat(order): implement 4 platform delivery/logistics service methods"
```

---

## Task 6: order-service — 新增 4 个 Controller Endpoints

**Files:**

- Modify: `D:\JTCodes\元琛\micro-services-prod\order-service\src\main\java\com\ssy\lingxi\order\controller\platform\PlatformOrderManageController.java`

- [ ] **Step 1: 在 `PlatformOrderManageController` 新增 4 个接口**

在现有 `/export` 接口之后追加：

```java
/**
 * 平台后台 - 查询订单可发货商品列表
 * @param orderNo 订单号
 * @return 可发货商品列表
 */
@PostMapping("/delivery/products")
public WrapperResp<List<VendorDeliveryProductResp>> getPlatformDeliveryProducts(
        @RequestBody @Valid Map<String, String> body) {
    String orderNo = body.get("orderNo");
    if (!StringUtils.hasLength(orderNo)) {
        throw new BusinessException(ResponseCodeEnum.PARAM_INVALID);
    }
    return WrapperUtil.success(platformOrderManageService.getPlatformDeliveryProducts(orderNo));
}

/**
 * 平台后台 - 确认发货（落库 + 生成发货批次 + 触发物流订阅）
 * @param req 发货参数
 * @return 操作结果
 */
@PostMapping("/delivery/confirm")
public WrapperResp<Void> platformDeliveryConfirm(@RequestBody @Valid PlatformDeliveryConfirmReq req) {
    platformOrderManageService.platformDeliveryConfirm(getPlatformUser(), req);
    return WrapperUtil.success(null);
}

/**
 * 平台后台 - 获取物流公司列表（含快递鸟编码）
 * @return 物流公司列表
 */
@GetMapping("/logistics/company/list")
public WrapperResp<List<PlatformLogisticsCompanyResp>> getLogisticsCompanyList() {
    return WrapperUtil.success(platformOrderManageService.getLogisticsCompanyList());
}

/**
 * 平台后台 - 查询订单物流轨迹
 * @param body 包含 orderNo、可选 batchNo
 * @return 物流详情
 */
@PostMapping("/logistics/detail")
public WrapperResp<PlatformOrderLogisticsDetailResp> getOrderLogisticsDetail(
        @RequestBody Map<String, Object> body) {
    String orderNo = (String) body.get("orderNo");
    Integer batchNo = body.get("batchNo") != null ? ((Number) body.get("batchNo")).intValue() : null;
    return WrapperUtil.success(platformOrderManageService.getOrderLogisticsDetail(orderNo, batchNo));
}
```

需要的 import（追加到文件顶部）：

```java
import com.ssy.lingxi.order.model.req.platform.PlatformDeliveryConfirmReq;
import com.ssy.lingxi.order.model.resp.platform.PlatformLogisticsCompanyResp;
import com.ssy.lingxi.order.model.resp.platform.PlatformOrderLogisticsDetailResp;
import com.ssy.lingxi.order.model.resp.vendor.VendorDeliveryProductResp;
import java.util.List;
import java.util.Map;
```

- [ ] **Step 2: 编译 order-service，修复所有 import/编译错误**

```bash
cd D:/JTCodes/元琛/micro-services-prod/order-service
./gradlew compileJava 2>&1
```

- [ ] **Step 3: Commit**

```bash
git commit -m "feat(order): add 4 platform delivery/logistics controller endpoints"
```

---

## Task 7: 验证前端字段映射

**Files:**

- Read: `apps/projects/admin/src/pages/orderManage/orderDetail/services/platform.ts`
- Read: `apps/projects/admin/src/pages/orderManage/orderDetail/components/platformDeliveryModal/index.tsx`
- Read: `apps/projects/admin/src/pages/orderManage/orderDetail/components/platformLogisticsModal/index.tsx`

- [ ] **Step 1: 验证 `delivery/products` 响应字段**

前端 `PlatformDeliveryProductItem` 期望：

```typescript
{
  orderProductId,
    relationId,
    productId,
    skuId,
    productNo,
    name,
    category,
    brand,
    spec,
    unit,
    quantity,
    delivered,
    leftCount
}
```

后端 `VendorDeliveryProductResp` 返回：✅ 字段一致，无需修改。

- [ ] **Step 2: 验证 `delivery/confirm` 请求字段**

前端发送：

```typescript
{ orderNo, addressId, address, deliveryTime, logisticsNo, company, companyCode, products: [{orderProductId, relationId, deliveryCount}] }
```

后端 `PlatformDeliveryConfirmReq` 接收：✅ 字段一致。

- [ ] **Step 3: 验证 `logistics/company/list` 响应字段**

前端 `PlatformLogisticsCompanyItem` 期望：`{ id, company, companyCode }` 后端 `PlatformLogisticsCompanyResp` 返回：✅ 字段一致。

- [ ] **Step 4: 验证 `logistics/detail` 响应字段**

前端 `PlatformOrderLogisticsResp` 期望：

```typescript
{
  orderId, orderNo, batchNo, deliveryNo, logisticsNo, company, companyCode,
  logisticsOrderId, logisticsOrderNo,
  trackingDetail: { logisticsOrderId, mailNo, expressCompanyCode, expressCompanyName,
    subscribeStatus, lastEventTime, events: [{acceptTime, acceptStation, remark, opCode, lat, lng}] }
}
```

后端 `PlatformOrderLogisticsDetailResp` 返回：✅ 字段一致。

- [ ] **Step 5: 检查 `getLogisticsSelectListShipperAddress` 是否已生效**

该接口在共享 API 层（yapi 自动生成），路由为 `GET /logistics/select/listShipperAddress`。确认 `AbilitySelectController.listShipperAddress()` 已有该路由 ✅。前端期望字段：`{ id, consignee, phone, fullAddress }` — 检查 `ShipperAddressSelectResp` 是否包含这些字段。

文件路径: `D:\JTCodes\元琛\micro-services-prod\logistics-service\src\main\java\com\ssy\lingxi\logistics\model\resp\ShipperAddressSelectResp.java`

若字段名不一致，在 `PlatformDeliveryModal` 中调整 `addressOptions.map` 的字段访问路径。

- [ ] **Step 6: Commit（若有前端修改）**

```bash
git commit -m "fix(frontend): align platform.ts field mapping with backend responses"
```

---

## Task 8: 启动并端到端测试

- [ ] **Step 1: 启动 logistics-service**

```bash
cd D:/JTCodes/元琛/micro-services-prod
./gradlew :logistics-service:bootRun
```

- [ ] **Step 2: 启动 order-service**

```bash
./gradlew :order-service:bootRun
```

- [ ] **Step 3: 启动前端**

```bash
cd D:/JTCodes/linkseeks-web-prod
pnpm dev:admin
```

- [ ] **Step 4: 测试"去发货"完整链路**

1. 打开浏览器，进入订单列表 `/orderManage/list`
2. 点击一个有未发货商品的订单 → 进入订单详情
3. 验证"订单商品"表格显示勾选框，未发货商品可勾选，已发货商品不可勾选
4. 勾选 1 个或多个未发货商品 → "去发货"按钮变为可点击
5. 点击"去发货" → Drawer 打开
6. 验证：发货地址下拉框有数据（来自 `getLogisticsSelectListShipperAddress`）
7. 验证：物流公司下拉框有数据（来自 `getLogisticsCompanyList`）
8. 填写物流单号、选择物流公司 → 点击"确认发货"
9. 期望：发货成功，Drawer 关闭，订单详情刷新

- [ ] **Step 5: 测试"查看物流"链路**

1. 在已发货商品的操作列点击"查看物流"
2. Drawer 打开，显示物流基本信息（orderId, batchNo, deliveryNo, logisticsNo）
3. 若快递鸟已回调轨迹，Timeline 显示轨迹事件
4. 若尚未有轨迹，显示"暂未获取到物流轨迹"

- [ ] **Step 6: 检查网络请求日志**

在浏览器 Network 面板确认：

- `POST /api/order/platform/manage/delivery/products` → 200，有商品列表
- `GET /api/order/platform/manage/logistics/company/list` → 200，有公司列表
- `POST /api/order/platform/manage/delivery/confirm` → 200
- `POST /api/order/platform/manage/logistics/detail` → 200，有 batchNo 和 trackingDetail

- [ ] **Step 7: 最终 Commit**

```bash
git commit -m "feat: complete platform delivery/logistics integration end-to-end"
```

---

## 已知风险与注意事项

| 风险 | 处置建议 |
| --- | --- |
| `LogisticsOrderDO` 有 NOT NULL 字段（如 memberId, roleId）在 Task 2 Step 5 中未赋值 | 读取 `LogisticsOrderDO.java` 完整字段，补充必填字段（用平台 member ID 或 0） |
| `orderRepository.findByOrderNo` 方法可能不存在 | 改用 Specification 查询，见 Task 5 Step 3 注意事项 |
| `OrderDeliveryBO` 的方法名需确认 | 读取 `OrderDeliveryBO.java` 确认字段名 |
| `orderDeliveryRepository.findByOrderAndDeliveryNo` 可能不存在 | 用 `findAll(Specification)` 替代 |
| 物流订阅失败不影响发货主流程（`try-catch` 包裹） | 已处理，订阅失败只打 warn 日志 |
| `ShipperAddressSelectResp` 字段名与前端期望不一致 | 见 Task 7 Step 5 |
| logistics-service 和 order-service 的 `LogisticsTrackingSubscribeForDeliveryReq` 类名冲突 | logistics-service-api 中可复用同一个 DTO，order-service 通过 feign 调用时用 api 模块的 DTO |

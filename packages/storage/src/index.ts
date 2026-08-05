/**
 * 储存模块
 *
 * 应当做到可支持以下方式的存储
 * localStorage
 * sessionStorage
 * cookie
 *
 * 可添加自定义前缀 - 为解决在cookie验证的环节下，测试环境和uat环境都使用了.shushangyun.com，导致cookie串在一起
 * 可添加自定义分隔符
 *
 * 可自主解析数据格式 - 让开发者无需考虑是否要将字符串转对象
 * 字符串 -> 是否是json
 *
 * 若数据不存在，统一返回undefined
 *
 */

export * from './Storage'

export * from './storageModules/CookieStorageModule'
export * from './storageModules/LocalStorageModule'
export * from './storageModules/SessionStorageModule'
export * from './storageModules/MemoryStorageModule'
export * from './modules'

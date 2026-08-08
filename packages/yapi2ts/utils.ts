import axios from 'axios'
import jsonSchemaGenerator from 'json-schema-generator'
import Mock from 'mockjs'
import path from 'path'
import rateLimit from 'axios-rate-limit'
import { castArray, forOwn, isArray, isEmpty, isObject, randomString } from 'vtils'
import { compile, Options } from 'json-schema-to-typescript'
import { FileData } from './helpers'
import { JSONSchema4 } from 'json-schema'
import { PropDefinitions } from './types'

/**
 * 抛出错误。
 *
 * @param msg 错误信息
 */
export function throwError(...msg: string[]): never {
  /* istanbul ignore next */
  throw new Error(msg.join(''))
}

/**
 * 将路径统一为 unix 风格的路径。
 *
 * @param path 路径
 * @returns unix 风格的路径
 */
export function toUnixPath(path: string) {
  return path.replace(/[/\\]+/g, '/')
}

/**
 * 获得规范化的相对路径。
 *
 * @param from 来源路径
 * @param to 去向路径
 * @returns 相对路径
 */
export function getNormalizedRelativePath(from: string, to: string) {
  return toUnixPath(path.relative(path.dirname(from), to))
    .replace(/^(?=[^.])/, './')
    .replace(/\.(ts|js)x?$/i, '')
}

const transformNumbers = ['Long', 'long', 'Double', 'double', 'int', 'BigDecimal', 'Float', 'float']

/**
 * 原地处理 JSONSchema。
 *
 * @param jsonSchema 待处理的 JSONSchema
 * @returns 处理后的 JSONSchema
 */
export function processJsonSchema<T extends JSONSchema4>(jsonSchema: T): T {
  /* istanbul ignore if */
  if (!isObject(jsonSchema)) return jsonSchema
  // 去除 title 和 id，防止 json-schema-to-typescript 提取它们作为接口名
  delete jsonSchema.title
  delete jsonSchema.id

  // 忽略数组长度限制
  delete jsonSchema.minItems
  delete jsonSchema.maxItems

  // 将识别不到的类型转化
  if (jsonSchema.type) {
    // @ts-ignore
    if (transformNumbers.includes(jsonSchema.type)) {
      jsonSchema.type = 'number'
    }
    if (typeof jsonSchema.type === 'string') {
      // 大小写转化
      // @ts-ignore
      jsonSchema.type = jsonSchema.type.toLocaleLowerCase()
    }
  }

  // 将 additionalProperties 设为 false
  jsonSchema.additionalProperties = false

  // Mock.toJSONSchema 产生的 properties 为数组，然而 JSONSchema4 的 properties 为对象
  if (isArray(jsonSchema.properties)) {
    jsonSchema.properties = (jsonSchema.properties as JSONSchema4[]).reduce<
      Exclude<JSONSchema4['properties'], undefined>
    >((props, js) => {
      props[js.name] = js
      return props
    }, {})
  }

  // 移除字段名称首尾空格
  if (jsonSchema.properties) {
    forOwn(jsonSchema.properties, (_, prop) => {
      const propDef = jsonSchema.properties![prop]
      // 替换掉不识别的Long类型
      // @ts-ignore
      if (
        propDef.type === 'Long' ||
        propDef.type === 'Double' ||
        propDef.type === 'int' ||
        propDef.type === 'BigDecimal'
      ) {
        propDef.type = 'number'
      }
      if (typeof propDef.type === 'string') {
        // 大小写转化
        // @ts-ignore
        propDef.type = propDef.type.toLocaleLowerCase()
      }
      delete jsonSchema.properties![prop]
      jsonSchema.properties![(prop as string).trim()] = propDef
    })
    //@ts-ignore
    jsonSchema.required = jsonSchema.required && jsonSchema.required.map((prop) => prop.trim())
  }

  // 继续处理对象的子元素
  if (jsonSchema.properties) {
    forOwn(jsonSchema.properties, processJsonSchema)
  }

  // 继续处理数组的子元素
  if (jsonSchema.items) {
    castArray(jsonSchema.items).forEach(processJsonSchema)
  }
  return jsonSchema
}

/**
 * 将 JSONSchema 字符串转为 JSONSchema 对象。
 *
 * @param str 要转换的 JSONSchema 字符串
 * @returns 转换后的 JSONSchema 对象
 */
export function jsonSchemaStringToJsonSchema(str: string): JSONSchema4 {
  return processJsonSchema(JSON.parse(str))
}

export function makeJsonSchemaToRequired<T extends JSONSchema4>(jsonSchema: T): T {
  // @ts-ignore
  if (jsonSchema.items && jsonSchema.items.type === 'object') {
    // @ts-ignore
    for (const item in jsonSchema.items.properties) {
      // @ts-ignore
      jsonSchema.items.required = jsonSchema.items.required ? [...jsonSchema.items.required, item] : [item]
    }
  }
  if (jsonSchema.properties) {
    for (const item in jsonSchema.properties) {
      //@ts-ignore
      jsonSchema.required = jsonSchema.required ? [...jsonSchema.required, item] : [item]
      makeJsonSchemaToRequired(jsonSchema.properties[item])
    }
  }
  return jsonSchema
}

/**
 * 获得 JSON 数据的 JSONSchema 对象。
 *
 * @param json JSON 数据
 * @returns JSONSchema 对象
 */
export function jsonToJsonSchema(json: object): JSONSchema4 {
  return processJsonSchema(jsonSchemaGenerator(json))
}

/**
 * 获得 mockjs 模板的 JSONSchema 对象。
 *
 * @param template mockjs 模板
 * @returns JSONSchema 对象
 */
export function mockjsTemplateToJsonSchema(template: object): JSONSchema4 {
  return processJsonSchema(Mock.toJSONSchema(template) as any)
}

/**
 * 获得属性定义列表的 JSONSchema 对象。
 *
 * @param propDefinitions 属性定义列表
 * @returns JSONSchema 对象
 */
export function propDefinitionsToJsonSchema(propDefinitions: PropDefinitions): JSONSchema4 {
  return processJsonSchema({
    type: 'object',
    required: propDefinitions.reduce<string[]>((res, prop) => {
      if (prop.required) {
        res.push(prop.name)
      }
      return res
    }, []),
    properties: propDefinitions.reduce<Exclude<JSONSchema4['properties'], undefined>>((res, prop) => {
      res[prop.name] = {
        type: prop.type,
        description: prop.comment,
        ...(prop.type === ('file' as any) ? { tsType: FileData.name } : {}),
      }
      return res
    }, {}),
  })
}

const JSTTOptions: Partial<Options> = {
  bannerComment: '',
  style: {
    bracketSpacing: false,
    printWidth: 120,
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'none',
    useTabs: false,
  },
  declareExternallyReferenced: true,
  enableConstEnums: true,
  unreachableDefinitions: false,
  strictIndexSignatures: false,
}

/**
 * 根据 JSONSchema 对象生产 TypeScript 类型定义。
 *
 * @param jsonSchema JSONSchema 对象
 * @param typeName 类型名称
 * @returns TypeScript 类型定义
 */
export async function jsonSchemaToType(jsonSchema: JSONSchema4, typeName: string): Promise<string> {
  if (isEmpty(jsonSchema)) {
    return `export interface ${typeName} {}`
  }
  // JSTT 会转换 typeName，因此传入一个全大写的假 typeName，生成代码后再替换回真正的 typeName
  const fakeTypeName = `FAKE${randomString()}`.toUpperCase()
  const code = await compile(jsonSchema, fakeTypeName, JSTTOptions)
  return code.replace(fakeTypeName, typeName).trim()
}

interface EmptyFunc<T> {
  (...args: any): Promise<T>
}
/**
 * @description 将多个异步请求分块执行
 * @author xjm
 * @date 2021-11-11
 * @export
 * @template T
 * @param {Promise<T>[]} requestList
 * @param {number} splitNum
 * @param {boolean} allowLog
 */
export async function splitAsyncRquest<T>(requestList: T[], splitNum: number, allowLog: boolean = true) {
  const splitQueues = requestList.reduce((prev, next, current) => {
    const index = Math.floor(current / splitNum)
    if (prev[index]) {
      prev[index].push(next)
    } else {
      prev[index] = [next]
    }
    return prev
  }, [] as any[][])
  const results: T[] = []
  // allowLog && console.log(`准备拆分请求...\n`)
  for (let item = 0; item < splitQueues.length; item++) {
    // allowLog && console.log(`开始执行第${item + 1}次, 存在${splitQueues[item].length}个服务\n`)
    const res = await Promise.all(splitQueues[item].map(async (req: any) => await req))
    results.push(...res)
  }

  return results
}

const MAX_REQUEST_NUM = 5

class QueueRequest {
  requestCount = 0

  maxLimit = MAX_REQUEST_NUM

  blockQueues: any[] = []

  constructor(maxLimit?: number) {
    this.maxLimit = maxLimit || MAX_REQUEST_NUM
  }

  async fetchApi(req: any) {
    if (!req) {
      throw new Error(`req is not work`)
    }

    if (typeof req !== 'function') {
      throw new Error(`req must be function`)
    }

    if (this.requestCount >= this.maxLimit) {
      await new Promise((resolve: any) => this.blockQueues.push(resolve))
    }

    return this._selfRquest(req)
  }

  async _selfRquest(req: any) {
    this.requestCount++
    try {
      return await req()
    } catch (err) {
      return Promise.reject(err)
    } finally {
      this.requestCount--
      if (this.blockQueues.length) {
        this.blockQueues[0]()
        this.blockQueues.shift()
      }
    }
  }
}

export const limitRequest = new QueueRequest(20)

const errors: any[] = []

const requestApi = axios.create({
  // 部分同事在请求yapi接口时会超时导致接口abort，现在设置300s超时
  timeout: 300 * 1000,
  // 添加keepAlive以重用连接
  httpAgent: new (require('http').Agent)({ keepAlive: true }),
  httpsAgent: new (require('https').Agent)({ keepAlive: true }),
  // 添加连接池设置
  maxRedirects: 5,
  validateStatus: (status) => status >= 200 && status < 300,
})

// 移除详细的请求日志，只保留错误信息
requestApi.interceptors.response.use(
  (config) => {
    if (config.status === 200) {
      return config.data
    }
    errors.push({
      url: config.request?.url,
      data: JSON.stringify(config.request?.params),
    })
    throwError(config.statusText)
  },
  (error) => {
    // 只在发生错误时记录日志
    if (
      error.code === 'ETIMEDOUT' ||
      error.code === 'ECONNRESET' ||
      error.code === 'ECONNABORTED' ||
      error.message.includes('socket hang up')
    ) {
      error.isNetworkError = true
    }
    return Promise.reject(error)
  },
)

// 调整请求频率限制
const http = rateLimit(requestApi, {
  maxRequests: 3, // 降低频率以减少服务器压力
  perMilliseconds: 1000,
})

// 优化带重试机制的请求函数，减少日志输出
export async function greatFetchApiWithRetry<T = any>(
  url: string,
  query: Record<string, any>,
  maxRetries: number = 3,
  currentRetry: number = 0,
): Promise<T> {
  try {
    // 只在重试时输出日志，首次请求不输出
    if (currentRetry > 0) {
      console.log(`[重试] 尝试请求 ${url}, 重试次数: ${currentRetry}/${maxRetries}`)
    }
    const res = await http.get(url, { params: query })
    return res.data || res
  } catch (error: any) {
    // 如果是网络错误且未达到最大重试次数，则重试
    if (error.isNetworkError && currentRetry < maxRetries) {
      const delay = Math.pow(2, currentRetry) * 1000 // 指数退避
      // 只在需要重试时输出错误信息
      console.log(`[网络错误] ${error.message}, ${delay}ms后重试...`)
      await new Promise((resolve) => setTimeout(resolve, delay))
      return greatFetchApiWithRetry(url, query, maxRetries, currentRetry + 1)
    }
    // 其他错误或达到最大重试次数则抛出
    if (currentRetry >= maxRetries) {
      console.error(`[请求失败] ${url} 已达到最大重试次数 (${maxRetries})`)
    }
    throw error
  }
}

// 修改现有函数以使用重试机制
export async function greatFetchApi<T = any>(url: string, query: Record<string, any>, pResolve?: any): Promise<T> {
  return greatFetchApiWithRetry(url, query)
}

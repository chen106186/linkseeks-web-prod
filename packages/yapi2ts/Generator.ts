import * as changeCase from 'change-case'
import dayjs from 'dayjs'
import fs from 'fs-extra'
import JSON5 from 'json5'
import path from 'path'
import prettier from 'prettier'
import request from 'request-promise-native'
import { castArray, dedent, isArray, isEmpty, isFunction, memoize, omit, unique } from 'vtils'
import {
  CategoryList,
  Config,
  ExtendedInterface,
  Interface,
  InterfaceList,
  Method,
  PropDefinition,
  RequestBodyType,
  RequestFormItemType,
  Required,
  ResponseBodyType,
  ServerConfig,
  SyntheticalConfig,
} from './types'
import {
  getNormalizedRelativePath,
  greatFetchApi,
  jsonSchemaStringToJsonSchema,
  jsonSchemaToType,
  jsonToJsonSchema,
  makeJsonSchemaToRequired,
  mockjsTemplateToJsonSchema,
  propDefinitionsToJsonSchema,
  throwError,
} from './utils'
import { JSONSchema4 } from 'json-schema'

interface OutputFileList {
  [outputFilePath: string]: {
    syntheticalConfig: SyntheticalConfig
    content: string[]
    requestFunctionFilePath: string
    requestHookMakerFilePath: string
  }
}

const YAPI_MAPS_FILE = 'yapi_hashmaps.json'

const YAPI_GEN_URL = path.resolve(process.cwd(), YAPI_MAPS_FILE)
const YAPI_HASH_MAPS: { [key: string]: number } = {}

const errors: any[] = []

// const SPLIT_NUM = 5

export class Generator {
  /** 配置 */
  private config: ServerConfig[] = []

  constructor(config: Config, private options: { cwd: string } = { cwd: process.cwd() }) {
    this.config =
      // config 可能是对象或数组，统一为数组
      castArray(config).map((item) => {
        if (item.serverUrl) {
          // 去除地址后面的 /
          // fix: https://github.com/fjc0k/yapi-to-typescript/issues/22
          item.serverUrl = item.serverUrl.replace(/\/+$/, '')
        }
        return item
      })
  }

  async generate(): Promise<OutputFileList> {
    // const asyncRequests = this.config.length > 10 ? splitAsyncRquest : Promise.all
    // const asyncRequests = Promise.all
    const outputFileList: OutputFileList = Object.create(null)
    const isAllowMaps = this.config.every((v) => v.yapiMaps)

    await Promise.all(
      this.config.map(async (serverConfig, serverIndex) =>
        Promise.all(
          serverConfig.projects.map(async (projectConfig, projectIndex) => {
            const projectInfo = await Generator.fetchProjectInfo({
              ...serverConfig,
              ...projectConfig,
            })
            try {
              await Promise.all(
                projectConfig.categories.map(async (categoryConfig, categoryIndex) => {
                  // 分类处理
                  // 数组化
                  let categoryIds = castArray(categoryConfig.id)
                  // 全部分类
                  if (categoryIds.includes(0)) {
                    categoryIds.push(...projectInfo.cats.map((cat) => cat._id))
                  }
                  // 唯一化
                  categoryIds = unique(categoryIds)
                  // 去掉被排除的分类
                  const excludedCategoryIds = categoryIds.filter((id) => id < 0).map(Math.abs)
                  categoryIds = categoryIds.filter((id) => !excludedCategoryIds.includes(Math.abs(id)))
                  // 删除不存在的分类
                  categoryIds = categoryIds.filter((id) => !!projectInfo.cats.find((cat) => cat._id === id))

                  serverConfig.allowAutoSpitFile = serverConfig.allowAutoSpitFile || true

                  const allItfList = await Promise.all(
                    categoryIds.map(async (id, categoryIndex2) => {
                      categoryConfig = {
                        ...categoryConfig,
                        id: id,
                      }
                      const syntheticalConfig: SyntheticalConfig = {
                        ...serverConfig,
                        ...projectConfig,
                        ...categoryConfig,
                        mockUrl: projectInfo.getMockUrl(),
                      }
                      syntheticalConfig.devUrl = projectInfo.getDevUrl(syntheticalConfig.devEnvName!)
                      syntheticalConfig.prodUrl = projectInfo.getProdUrl(syntheticalConfig.prodEnvName!)

                      const interfaceList = syntheticalConfig.interfaceList
                        ? await this.fetchInterfaceList(syntheticalConfig)
                        : await this.fetchInterfaceListByCate(syntheticalConfig)

                      if (interfaceList.length === 0) {
                        return null
                      }
                      const outputFilePath = syntheticalConfig.allowAutoSpitFile
                        ? path.resolve(this.options.cwd, syntheticalConfig.outputFilePath!, `id${id}.ts`)
                        : path.resolve(this.options.cwd, syntheticalConfig.outputFilePath!)

                      const categoryUID = `_${serverIndex}_${projectIndex}_${categoryIndex}_${categoryIndex2}`
                      let categoryCode = ''
                      categoryCode =
                        interfaceList.length === 0
                          ? ''
                          : [
                              ...(await Promise.all(
                                interfaceList.map(async (interfaceInfo) => {
                                  interfaceInfo = isFunction(syntheticalConfig.preproccessInterface)
                                    ? syntheticalConfig.preproccessInterface(interfaceInfo, changeCase)
                                    : interfaceInfo
                                  return Generator.generateInterfaceCode(syntheticalConfig, interfaceInfo, categoryUID)
                                }),
                              )),
                            ].join('\n\n')
                      if (!outputFileList[outputFilePath]) {
                        outputFileList[outputFilePath] = {
                          syntheticalConfig,
                          content: [],
                          requestFunctionFilePath: syntheticalConfig.requestFunctionFilePath
                            ? path.resolve(this.options.cwd, syntheticalConfig.requestFunctionFilePath)
                            : path.join(path.dirname(outputFilePath), 'request.ts'),
                          requestHookMakerFilePath:
                            syntheticalConfig.reactHooks && syntheticalConfig.reactHooks.enabled
                              ? syntheticalConfig.reactHooks.requestHookMakerFilePath
                                ? path.resolve(this.options.cwd, syntheticalConfig.reactHooks.requestHookMakerFilePath)
                                : path.join(path.dirname(outputFilePath), 'makeRequestHook.ts')
                              : '',
                        }
                      }
                      if (categoryCode) {
                        outputFileList[outputFilePath].content.push(categoryCode)
                      }
                      return interfaceList
                    }),
                  )

                  // 开启自动分割时， 需要清理当前使用的文件夹
                  if (serverConfig.allowAutoSpitFile) {
                    const removePath = path.resolve(this.options.cwd, serverConfig.outputFilePath!)
                    await fs.remove(removePath)

                    // 在生成的目录下 加入index.ts用于导出
                    const tempArr: number[] = []
                    const mainIndexExport = allItfList.reduce((prev: any, next: any) => {
                      if (next && next.length > 0) {
                        next.forEach((n: any) => {
                          if (!tempArr.includes(n.catid)) {
                            prev += `export * from './id${n.catid}';\n`
                            tempArr.push(n.catid)
                          }
                        })
                      }
                      return prev
                    }, '')
                    const outCwdPath = path.resolve(this.options.cwd, serverConfig.outputFilePath!, 'index.ts')

                    fs.ensureFile(outCwdPath).then(() => {
                      fs.writeFile(outCwdPath, mainIndexExport)
                    })
                  }
                }),
              )
            } catch (err) {
              console.log('\n')
              console.log('----------出现异常----------')
              console.log(projectInfo)
              console.log('出错的服务 ——>')
              console.log(projectConfig)
              console.log('-------错误信息-------')
              console.log(err)
              throw err
            }
          }),
        ),
      ),
    )

    if (isAllowMaps) {
      fs.writeFile(YAPI_GEN_URL, JSON.stringify(YAPI_HASH_MAPS))
    }
    return outputFileList
  }

  async write(outputFileList: OutputFileList) {
    return Promise.all(
      Object.keys(outputFileList).map(async (outputFilePath) => {
        const { content, requestFunctionFilePath, requestHookMakerFilePath, syntheticalConfig } =
          outputFileList[outputFilePath]

        const requestPath = syntheticalConfig.requestFunctionFilePath
          ? syntheticalConfig.requestFunctionFilePath
          : '@/utils/request'
        // 始终写入主文件
        const rawOutputContent = dedent`
          /* tslint:disable */
          /* eslint-disable */

          /* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

          /* 修改该插件模板内容!!! */
          /* @version v1 */
          /* @auth xujiamin */

          ${
            syntheticalConfig.typesOnly
              ? content.join('\n\n').trim()
              : dedent`
            // @ts-ignore
            // prettier-ignore
            import request, { IApiRequest } from '${requestPath}'
            // @ts-ignore

            ${content.join('\n\n').trim()}
          `
          }
        `
        // ref: https://prettier.io/docs/en/options.html
        const prettyOutputContent = prettier.format(rawOutputContent, {
          parser: 'typescript',
          printWidth: 120,
          tabWidth: 2,
          singleQuote: true,
          semi: false,
          trailingComma: 'all',
          bracketSpacing: false,
          endOfLine: 'lf',
        })
        const outputContent = `${dedent`
          /* prettier-ignore-start */
          ${prettyOutputContent}
          /* prettier-ignore-end */
        `}\n`
        await fs.outputFile(outputFilePath, outputContent)
      }),
    )
  }

  /** 生成请求数据类型 */
  static async generateRequestDataType({
    interfaceInfo,
    typeName,
  }: {
    interfaceInfo: Interface
    typeName: string
  }): Promise<string> {
    let jsonSchema!: JSONSchema4

    switch (interfaceInfo.method) {
      case Method.GET:
      case Method.HEAD:
      case Method.OPTIONS:
        jsonSchema = propDefinitionsToJsonSchema(
          interfaceInfo.req_query.map<PropDefinition>((item) => ({
            name: item.name,
            required: item.required === Required.true,
            type: 'string',
            comment: item.desc,
          })),
        )
        break
      default:
        switch (interfaceInfo.req_body_type) {
          case RequestBodyType.form:
            jsonSchema = propDefinitionsToJsonSchema(
              interfaceInfo.req_body_form.map<PropDefinition>((item) => ({
                name: item.name,
                required: item.required === Required.true,
                type: (item.type === RequestFormItemType.file ? 'file' : 'string') as any,
                comment: item.desc,
              })),
            )
            break
          case RequestBodyType.json:
            if (interfaceInfo.req_body_other) {
              jsonSchema = interfaceInfo.req_body_is_json_schema
                ? jsonSchemaStringToJsonSchema(interfaceInfo.req_body_other)
                : jsonToJsonSchema(JSON5.parse(interfaceInfo.req_body_other))
            }
            break
          default:
            /* istanbul ignore next */
            break
        }
        break
    }

    if (isArray(interfaceInfo.req_params) && interfaceInfo.req_params.length) {
      const paramsJsonSchema = propDefinitionsToJsonSchema(
        interfaceInfo.req_params.map<PropDefinition>((item) => ({
          name: item.name,
          required: true,
          type: 'string',
          comment: item.desc,
        })),
      )
      /* istanbul ignore else */
      if (jsonSchema) {
        jsonSchema.properties = {
          ...jsonSchema.properties,
          ...paramsJsonSchema.properties,
        }
        jsonSchema.required = [...(jsonSchema.required || []), ...(paramsJsonSchema.required || [])]
      } else {
        jsonSchema = paramsJsonSchema
      }
    }

    return jsonSchemaToType(jsonSchema, typeName)
  }

  /** 生成响应数据类型 */
  static async generateResponseDataType({
    interfaceInfo,
    typeName,
    dataKey,
  }: {
    interfaceInfo: Interface
    typeName: string
    dataKey?: string
  }): Promise<string> {
    let jsonSchema: JSONSchema4 = {}
    switch (interfaceInfo.res_body_type) {
      case ResponseBodyType.json:
        if (interfaceInfo.res_body) {
          jsonSchema = interfaceInfo.res_body_is_json_schema
            ? jsonSchemaStringToJsonSchema(interfaceInfo.res_body)
            : mockjsTemplateToJsonSchema(JSON5.parse(interfaceInfo.res_body))
        }
        break
      default:
        return `export type ${typeName} = any`
    }

    /* istanbul ignore if */
    if (dataKey && jsonSchema && jsonSchema.properties && jsonSchema.properties[dataKey]) {
      jsonSchema = jsonSchema.properties[dataKey]
    }
    // @auth xjm
    // 给未定义的列表数据加入类型定义
    if (jsonSchema.properties && jsonSchema.properties.data && jsonSchema.properties.totalCount) {
      if (jsonSchema.properties.data.items) {
        // @ts-ignore
        jsonSchema.properties.data.items.title = `${typeName}Detail`
      }
    }

    // 将所有的response数据变成必选的 required
    jsonSchema = makeJsonSchemaToRequired(jsonSchema)
    return jsonSchemaToType(jsonSchema, typeName)
  }

  static async fetchApi<T = any>(url: string, query: Record<string, any>): Promise<T> {
    return await greatFetchApi(url, query)
    const res = await request.get(url, { qs: query, json: true, timeout: 30 * 1000 })
    /* istanbul ignore next */
    if (res && res.errcode) {
      errors.push({
        url,
        data: JSON.stringify(query),
      })
      console.log(errors)
      throwError(res.errmsg)
    }
    return res.data || res
  }

  fetchExport = memoize(
    ({ serverUrl, token }: SyntheticalConfig) => {
      return Generator.fetchApi<CategoryList>(`${serverUrl}/api/plugin/export`, {
        type: 'json',
        status: 'all',
        isWiki: 'false',
        token: token!,
      })
    },
    {
      serializer: ({ serverUrl, token }) => `${serverUrl}|${token}`,
    },
  )

  fetchInterface = memoize(
    ({ serverUrl, token, id }: any) => {
      return Generator.fetchApi<any>(`${serverUrl}/api/interface/get`, {
        type: 'json',
        status: 'all',
        isWiki: 'false',
        token: token!,
        id,
      })
    },
    {
      serializer: ({ serverUrl, token, id }) => `${serverUrl}|${token}|${id}`,
    },
  )

  /** 获取接口列表 */
  async fetchInterfaceList({ serverUrl, token, id, interfaceList }: SyntheticalConfig): Promise<InterfaceList> {
    if (!interfaceList) {
      return []
    }
    let fetchRes = await Promise.all(
      interfaceList.map(async (v) => await this.fetchInterface({ serverUrl, token, id: v })),
    )

    const category = (fetchRes || []).find((cat) => !isEmpty(cat) && cat.catid === id)

    // 接口id和分类对不上
    if (!category) {
      return []
    }
    fetchRes.forEach((interfaceInfo) => {
      // 实现 _category 字段
      interfaceInfo._category = omit(category, ['list'])
    })

    fetchRes = fetchRes.filter((v) => v.catid === id)
    return fetchRes ? fetchRes : []
  }

  /** 获取分类的接口列表 */
  async fetchInterfaceListByCate({ serverUrl, token, id, interfaceList }: SyntheticalConfig): Promise<InterfaceList> {
    const fetchRes = await this.fetchExport({ serverUrl, token })
    const category = (fetchRes || []).find((cat) => !isEmpty(cat) && !isEmpty(cat.list) && cat.list[0].catid === id)

    if (category) {
      /**
       * @auth xujiamin
       * 新增interfaceList属性，传入对应的接口id，即可控制是否需要获取对应的接口
       */
      if (interfaceList) {
        category.list = category.list.reduce((prev, next) => {
          if (interfaceList.includes(next._id)) {
            prev.push(next)
          }
          return prev
        }, [] as any)
      }
      category.list.forEach((interfaceInfo) => {
        // 实现 _category 字段
        interfaceInfo._category = omit(category, ['list'])
      })
    }

    return category ? category.list : []
  }

  /** 获取项目信息 */
  static async fetchProjectInfo(syntheticalConfig: SyntheticalConfig) {
    try {
      const projectInfo = await this.fetchApi<{
        _id: number
        name: string
        basepath: string
        env: Array<{
          name: string
          domain: string
        }>
      }>(`${syntheticalConfig.serverUrl}/api/project/get`, { token: syntheticalConfig.token! })
      const projectCats = await this.fetchApi<
        Array<{
          _id: number
          name: string
          desc: string
        }>
      >(`${syntheticalConfig.serverUrl}/api/interface/getCatMenu`, {
        token: syntheticalConfig.token!,
        project_id: projectInfo._id,
      })
      return {
        ...projectInfo,
        ...syntheticalConfig,
        cats: projectCats,
        getMockUrl: () => `${syntheticalConfig.serverUrl}/mock/${projectInfo._id}`,
        getDevUrl: (devEnvName: string) => {
          const env = projectInfo.env.find((e) => e.name === devEnvName)
          return (env && env.domain) /* istanbul ignore next */ || ''
        },
        getProdUrl: (prodEnvName: string) => {
          const env = projectInfo.env.find((e) => e.name === prodEnvName)
          return (env && env.domain) /* istanbul ignore next */ || ''
        },
      }
    } catch (err) {
      return {
        ...err,
        ...syntheticalConfig,
      }
    }
  }

  /** 生成接口代码 */
  static async generateInterfaceCode(
    syntheticalConfig: SyntheticalConfig,
    interfaceInfo: Interface,
    categoryUID: string,
  ) {
    const extendedInterfaceInfo: ExtendedInterface = {
      ...interfaceInfo,
      parsedPath: path.parse(interfaceInfo.path),
    }
    const requestFunctionName = isFunction(syntheticalConfig.getRequestFunctionName)
      ? await syntheticalConfig.getRequestFunctionName(extendedInterfaceInfo, changeCase)
      : /* istanbul ignore next */
        changeCase.camelCase(interfaceInfo.parsedPath.name)

    const requestConfigName = changeCase.camelCase(`${requestFunctionName}RequestConfig`)
    const requestConfigTypeName = changeCase.pascalCase(requestConfigName)
    const requestDataTypeName = isFunction(syntheticalConfig.getRequestDataTypeName)
      ? await syntheticalConfig.getRequestDataTypeName(extendedInterfaceInfo, changeCase)
      : changeCase.pascalCase(`${requestFunctionName}Request`)
    const responseDataTypeName = isFunction(syntheticalConfig.getResponseDataTypeName)
      ? await syntheticalConfig.getResponseDataTypeName(extendedInterfaceInfo, changeCase)
      : changeCase.pascalCase(`${requestFunctionName}Response`)
    const requestDataType = await Generator.generateRequestDataType({
      interfaceInfo: interfaceInfo,
      typeName: requestDataTypeName,
    })
    const responseDataType = await Generator.generateResponseDataType({
      interfaceInfo: interfaceInfo,
      typeName: responseDataTypeName,
      dataKey: syntheticalConfig.dataKey,
    })

    const isRequestDataOptional = /(\{\}|any)$/s.test(requestDataType)
    const requestHookName =
      syntheticalConfig.reactHooks && syntheticalConfig.reactHooks.enabled
        ? isFunction(syntheticalConfig.reactHooks.getRequestHookName)
          ? /* istanbul ignore next */
            await syntheticalConfig.reactHooks.getRequestHookName(extendedInterfaceInfo, changeCase)
          : `use${changeCase.pascalCase(requestFunctionName)}`
        : ''

    // 支持路径参数
    const paramNames = (interfaceInfo.req_params /* istanbul ignore next */ || []).map((item) => item.name)

    // 转义标题中的 /
    const escapedTitle = String(interfaceInfo.title).replace(/\//g, '\\/')

    // 接口标题
    const interfaceTitle: string = `[${escapedTitle}↗](${syntheticalConfig.serverUrl}/project/${interfaceInfo.project_id}/interface/api/${interfaceInfo._id})`

    // 接口摘要
    const interfaceSummary: Array<{
      label: string
      value: string | string[]
    }> = [
      {
        label: '分类',
        value: `[${interfaceInfo._category.name}↗](${syntheticalConfig.serverUrl}/project/${interfaceInfo.project_id}/interface/api/cat_${interfaceInfo.catid})`,
      },
      {
        label: '标签',
        value: interfaceInfo.tag.map((tag) => `\`${tag}\``),
      },
      {
        label: '请求头',
        value: `\`${interfaceInfo.method.toUpperCase()} ${interfaceInfo.path}\``,
      },
    ]
    const interfaceExtraComments: string = interfaceSummary
      .filter((item) => !isEmpty(item.value))
      .map((item) => `* @${item.label} ${castArray(item.value).join(', ')}`)
      .join('\n')

    /**
     * @auth xujiamin
     * 为按需引入 做的一层优化， 如果需要获得maps文件， 只需将yapiMaps设为true
     */
    if (syntheticalConfig.yapiMaps) {
      YAPI_HASH_MAPS[requestFunctionName] = interfaceInfo.catid
    }
    return dedent`
      /**
       * 接口 ${interfaceTitle} 的 **请求类型**
       *
       ${interfaceExtraComments}
       */
      ${requestDataType.trim()}

      /**
       * 接口 ${interfaceTitle} 的 **返回类型**
       *
       ${interfaceExtraComments}
       */
      ${responseDataType.trim()}

      ${dedent`

        /**
         * 接口 ${interfaceTitle} 的 **请求函数**
         *
         ${interfaceExtraComments}
         */
        export const ${requestFunctionName} = async (params?: ${requestDataTypeName}, config?: IApiRequest) => {
          return request<${responseDataTypeName}>('${extendedInterfaceInfo.path}', {
            ${extendedInterfaceInfo.method.toLocaleLowerCase() === 'get' ? 'params' : `data: params`},
            method: '${extendedInterfaceInfo.method}',
            ctlType: '${extendedInterfaceInfo.method.toLocaleLowerCase() === 'get' ? 'none' : 'message'}',
            ...config
          })
        }
      `}
    `
  }

  /** 生成接口导出 */
  async writeApiExport(outputFileList: OutputFileList) {
    const outputFileListPath = Object.keys(outputFileList)

    // 使用reduce方法将文件路径分组
    const groupedServices = outputFileListPath.reduce((groups: any, filePath) => {
      const mathPath = filePath.match(/\/api-(\S+?)\//)
      if (mathPath) {
        const serviceName = mathPath[1]
        if (!groups[serviceName]) {
          groups[serviceName] = []
        }
        groups[serviceName].push(filePath)
      }

      return groups
    }, {})

    if (groupedServices && Object.keys(groupedServices).length > 0) {
      Object.keys(groupedServices).forEach(async (serviceKey) => {
        const groupedFilePaths = groupedServices[serviceKey]
        let outputContent = ''
        for (const itemPath of groupedFilePaths) {
          const itemContent = fs.readFileSync(itemPath, 'utf8')
          // 使用正则表达式匹配默认导出的函数名
          const exportFunctionRegex = /export\s+(?:const)\s+(\w+)/g
          const exportTypeRegex = /export\s+(?:type|interface)\s+(\w+)/g
          // 使用正则表达式的exec方法来逐个匹配导出的方法名
          let match
          const exportedMethods = []
          const exportTypes = []
          while ((match = exportFunctionRegex.exec(itemContent)) !== null) {
            // 将匹配到的方法名添加到exportedMethods数组中
            exportedMethods.push(match[1])
          }

          while ((match = exportTypeRegex.exec(itemContent)) !== null) {
            // 将匹配到的方法名添加到exportedMethods数组中
            exportTypes.push(match[1])
          }

          let temp = itemPath.split('/')
          const tempPath = temp.pop()
          const indexPath = `${temp.join('/')}/index.ts`
          // 始终写入文件内容
          outputContent += 'export type {'
          for (const methodItem of exportTypes) {
            outputContent += `${methodItem},`
          }
          outputContent += `} from './${tempPath?.replace('.ts', '')}';\n`

          outputContent += 'export {'
          for (const methodItem of exportedMethods) {
            outputContent += `${methodItem},`
          }
          outputContent += `} from './${tempPath?.replace('.ts', '')}';\n`

          const prettyOutputContent = prettier.format(outputContent, {
            parser: 'typescript',
            printWidth: 120,
            tabWidth: 2,
            singleQuote: true,
            semi: false,
            trailingComma: 'all',
            bracketSpacing: false,
            endOfLine: 'lf',
          })
          await fs.outputFile(indexPath, prettyOutputContent)
        }
      })
    }
  }
}

'use strict'
Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
const U = require('change-case'),
  P = require('fs-extra'),
  v = require('json5'),
  y = require('path'),
  A = require('prettier')
require('request-promise-native')
const c = require('vtils'),
  f = require('./index.js'),
  H = require('axios'),
  J = require('json-schema-generator'),
  C = require('mockjs'),
  W = require('axios-rate-limit'),
  B = require('json-schema-to-typescript')
function j(t) {
  const e = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } })
  if (t) {
    for (const s in t)
      if (s !== 'default') {
        const r = Object.getOwnPropertyDescriptor(t, s)
        Object.defineProperty(e, s, r.get ? r : { enumerable: !0, get: () => t[s] })
      }
  }
  return (e.default = t), Object.freeze(e)
}
const q = j(U)
function z(...t) {
  throw new Error(t.join(''))
}
const I = ['Long', 'long', 'Double', 'double', 'int', 'BigDecimal', 'Float', 'float']
function T(t) {
  return (
    c.isObject(t) &&
      (delete t.title,
      delete t.id,
      delete t.minItems,
      delete t.maxItems,
      t.type &&
        (I.includes(t.type) && (t.type = 'number'), typeof t.type == 'string' && (t.type = t.type.toLocaleLowerCase())),
      (t.additionalProperties = !1),
      c.isArray(t.properties) && (t.properties = t.properties.reduce((e, s) => ((e[s.name] = s), e), {})),
      t.properties &&
        (c.forOwn(t.properties, (e, s) => {
          const r = t.properties[s]
          ;(r.type === 'Long' || r.type === 'Double' || r.type === 'int' || r.type === 'BigDecimal') &&
            (r.type = 'number'),
            typeof r.type == 'string' && (r.type = r.type.toLocaleLowerCase()),
            delete t.properties[s],
            (t.properties[s.trim()] = r)
        }),
        (t.required = t.required && t.required.map((e) => e.trim()))),
      t.properties && c.forOwn(t.properties, T),
      t.items && c.castArray(t.items).forEach(T)),
    t
  )
}
function O(t) {
  return T(JSON.parse(t))
}
function L(t) {
  if (t.items && t.items.type === 'object')
    for (const e in t.items.properties) t.items.required = t.items.required ? [...t.items.required, e] : [e]
  if (t.properties)
    for (const e in t.properties) (t.required = t.required ? [...t.required, e] : [e]), L(t.properties[e])
  return t
}
function Q(t) {
  return T(J(t))
}
function S(t) {
  return T(C.toJSONSchema(t))
}
function x(t) {
  return T({
    type: 'object',
    required: t.reduce((e, s) => (s.required && e.push(s.name), e), []),
    properties: t.reduce(
      (e, s) => (
        (e[s.name] = {
          type: s.type,
          description: s.comment,
          ...(s.type === 'file' ? { tsType: f.FileData.name } : {}),
        }),
        e
      ),
      {},
    ),
  })
}
const Y = {
  bannerComment: '',
  style: {
    bracketSpacing: !1,
    printWidth: 120,
    semi: !0,
    singleQuote: !0,
    tabWidth: 2,
    trailingComma: 'none',
    useTabs: !1,
  },
  declareExternallyReferenced: !0,
  enableConstEnums: !0,
  unreachableDefinitions: !1,
  strictIndexSignatures: !1,
}
async function D(t, e) {
  if (c.isEmpty(t)) return `export interface ${e} {}`
  const s = `FAKE${c.randomString()}`.toUpperCase()
  return (await B.compile(t, s, Y)).replace(s, e).trim()
}
const E = [],
  M = H.create()
M.interceptors.response.use((t) => {
  if (t.status == 200) return t.data
  E.push({ url: t.request.url, data: JSON.stringify(t.request.params) }), console.log(E), z(t.statusText)
})
const K = W(M, { maxRequests: 2, perMilliseconds: 1e3 })
async function V(t, e, s) {
  const r = await K.get(t, { params: e })
  return r.data || r
}
const X = 'yapi_hashmaps.json',
  Z = y.resolve(process.cwd(), X),
  N = {}
class b {
  constructor(e, s = { cwd: process.cwd() }) {
    ;(this.options = s),
      (this.config = []),
      (this.fetchExport = c.memoize(
        ({ serverUrl: r, token: a }) =>
          b.fetchApi(`${r}/api/plugin/export`, { type: 'json', status: 'all', isWiki: 'false', token: a }),
        { serializer: ({ serverUrl: r, token: a }) => `${r}|${a}` },
      )),
      (this.fetchInterface = c.memoize(
        ({ serverUrl: r, token: a, id: i }) =>
          b.fetchApi(`${r}/api/interface/get`, { type: 'json', status: 'all', isWiki: 'false', token: a, id: i }),
        { serializer: ({ serverUrl: r, token: a, id: i }) => `${r}|${a}|${i}` },
      )),
      (this.config = c.castArray(e).map((r) => (r.serverUrl && (r.serverUrl = r.serverUrl.replace(/\/+$/, '')), r)))
  }
  async generate() {
    const e = Object.create(null),
      s = this.config.every((r) => r.yapiMaps)
    return (
      await Promise.all(
        this.config.map(async (r, a) =>
          Promise.all(
            r.projects.map(async (i, p) => {
              const n = await b.fetchProjectInfo({ ...r, ...i })
              try {
                await Promise.all(
                  i.categories.map(async (u, _) => {
                    let l = c.castArray(u.id)
                    l.includes(0) && l.push(...n.cats.map((d) => d._id)), (l = c.unique(l))
                    const F = l.filter((d) => d < 0).map(Math.abs)
                    ;(l = l.filter((d) => !F.includes(Math.abs(d)))),
                      (l = l.filter((d) => !!n.cats.find((m) => m._id === d))),
                      (r.allowAutoSpitFile = r.allowAutoSpitFile || !0)
                    const w = await Promise.all(
                      l.map(async (d, m) => {
                        u = { ...u, id: d }
                        const o = { ...r, ...i, ...u, mockUrl: n.getMockUrl() }
                        ;(o.devUrl = n.getDevUrl(o.devEnvName)), (o.prodUrl = n.getProdUrl(o.prodEnvName))
                        const g = o.interfaceList
                          ? await this.fetchInterfaceList(o)
                          : await this.fetchInterfaceListByCate(o)
                        if (g.length === 0) return null
                        const h = o.allowAutoSpitFile
                            ? y.resolve(this.options.cwd, o.outputFilePath, `id${d}.ts`)
                            : y.resolve(this.options.cwd, o.outputFilePath),
                          $ = `_${a}_${p}_${_}_${m}`
                        let k = ''
                        return (
                          (k =
                            g.length === 0
                              ? ''
                              : [
                                  ...(await Promise.all(
                                    g.map(
                                      async (R) => (
                                        (R = c.isFunction(o.preproccessInterface) ? o.preproccessInterface(R, q) : R),
                                        b.generateInterfaceCode(o, R, $)
                                      ),
                                    ),
                                  )),
                                ].join(`

`)),
                          e[h] ||
                            (e[h] = {
                              syntheticalConfig: o,
                              content: [],
                              requestFunctionFilePath: o.requestFunctionFilePath
                                ? y.resolve(this.options.cwd, o.requestFunctionFilePath)
                                : y.join(y.dirname(h), 'request.ts'),
                              requestHookMakerFilePath:
                                o.reactHooks && o.reactHooks.enabled
                                  ? o.reactHooks.requestHookMakerFilePath
                                    ? y.resolve(this.options.cwd, o.reactHooks.requestHookMakerFilePath)
                                    : y.join(y.dirname(h), 'makeRequestHook.ts')
                                  : '',
                            }),
                          k && e[h].content.push(k),
                          g
                        )
                      }),
                    )
                    if (r.allowAutoSpitFile) {
                      const d = y.resolve(this.options.cwd, r.outputFilePath)
                      await P.remove(d)
                      const m = [],
                        o = w.reduce(
                          (h, $) => (
                            $ &&
                              $.length > 0 &&
                              $.forEach((k) => {
                                m.includes(k.catid) ||
                                  ((h += `export * from './id${k.catid}';
`),
                                  m.push(k.catid))
                              }),
                            h
                          ),
                          '',
                        ),
                        g = y.resolve(this.options.cwd, r.outputFilePath, 'index.ts')
                      P.ensureFile(g).then(() => {
                        P.writeFile(g, o)
                      })
                    }
                  }),
                )
              } catch (u) {
                throw (
                  (console.log(`
`),
                  console.log('----------出现异常----------'),
                  console.log(n),
                  console.log('出错的服务 ——>'),
                  console.log(i),
                  console.log('-------错误信息-------'),
                  console.log(u),
                  u)
                )
              }
            }),
          ),
        ),
      ),
      s && P.writeFile(Z, JSON.stringify(N)),
      e
    )
  }
  async write(e) {
    return Promise.all(
      Object.keys(e).map(async (s) => {
        const { content: r, requestFunctionFilePath: a, requestHookMakerFilePath: i, syntheticalConfig: p } = e[s],
          n = p.requestFunctionFilePath ? p.requestFunctionFilePath : '@/utils/request',
          u = c.dedent`
          /* tslint:disable */
          /* eslint-disable */

          /* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

          /* 修改该插件模板内容!!! */
          /* @version v1 */
          /* @auth xujiamin */

          ${
            p.typesOnly
              ? r
                  .join(
                    `

`,
                  )
                  .trim()
              : c.dedent`
            // @ts-ignore
            // prettier-ignore
            import request, { IApiRequest } from '${n}'
            // @ts-ignore

            ${r
              .join(
                `

`,
              )
              .trim()}
          `
          }
        `,
          _ = A.format(u, {
            parser: 'typescript',
            printWidth: 120,
            tabWidth: 2,
            singleQuote: !0,
            semi: !1,
            trailingComma: 'all',
            bracketSpacing: !1,
            endOfLine: 'lf',
          }),
          l = `${c.dedent`
          /* prettier-ignore-start */
          ${_}
          /* prettier-ignore-end */
        `}
`
        await P.outputFile(s, l)
      }),
    )
  }
  static async generateRequestDataType({ interfaceInfo: e, typeName: s }) {
    let r
    switch (e.method) {
      case f.Method.GET:
      case f.Method.HEAD:
      case f.Method.OPTIONS:
        r = x(
          e.req_query.map((a) => ({
            name: a.name,
            required: a.required === f.Required.true,
            type: 'string',
            comment: a.desc,
          })),
        )
        break
      default:
        switch (e.req_body_type) {
          case f.RequestBodyType.form:
            r = x(
              e.req_body_form.map((a) => ({
                name: a.name,
                required: a.required === f.Required.true,
                type: a.type === f.RequestFormItemType.file ? 'file' : 'string',
                comment: a.desc,
              })),
            )
            break
          case f.RequestBodyType.json:
            e.req_body_other && (r = e.req_body_is_json_schema ? O(e.req_body_other) : Q(v.parse(e.req_body_other)))
            break
        }
        break
    }
    if (c.isArray(e.req_params) && e.req_params.length) {
      const a = x(e.req_params.map((i) => ({ name: i.name, required: !0, type: 'string', comment: i.desc })))
      r
        ? ((r.properties = { ...r.properties, ...a.properties }),
          (r.required = [...(r.required || []), ...(a.required || [])]))
        : (r = a)
    }
    return D(r, s)
  }
  static async generateResponseDataType({ interfaceInfo: e, typeName: s, dataKey: r }) {
    let a = {}
    switch (e.res_body_type) {
      case f.ResponseBodyType.json:
        e.res_body && (a = e.res_body_is_json_schema ? O(e.res_body) : S(v.parse(e.res_body)))
        break
      default:
        return `export type ${s} = any`
    }
    return (
      r && a && a.properties && a.properties[r] && (a = a.properties[r]),
      a.properties &&
        a.properties.data &&
        a.properties.totalCount &&
        a.properties.data.items &&
        (a.properties.data.items.title = `${s}Detail`),
      (a = L(a)),
      D(a, s)
    )
  }
  static async fetchApi(e, s) {
    return await V(e, s)
  }
  async fetchInterfaceList({ serverUrl: e, token: s, id: r, interfaceList: a }) {
    if (!a) return []
    let i = await Promise.all(a.map(async (n) => await this.fetchInterface({ serverUrl: e, token: s, id: n })))
    const p = (i || []).find((n) => !c.isEmpty(n) && n.catid === r)
    return p
      ? (i.forEach((n) => {
          n._category = c.omit(p, ['list'])
        }),
        (i = i.filter((n) => n.catid === r)),
        i || [])
      : []
  }
  async fetchInterfaceListByCate({ serverUrl: e, token: s, id: r, interfaceList: a }) {
    const p = ((await this.fetchExport({ serverUrl: e, token: s })) || []).find(
      (n) => !c.isEmpty(n) && !c.isEmpty(n.list) && n.list[0].catid === r,
    )
    return (
      p &&
        (a && (p.list = p.list.reduce((n, u) => (a.includes(u._id) && n.push(u), n), [])),
        p.list.forEach((n) => {
          n._category = c.omit(p, ['list'])
        })),
      p ? p.list : []
    )
  }
  static async fetchProjectInfo(e) {
    try {
      const s = await this.fetchApi(`${e.serverUrl}/api/project/get`, { token: e.token }),
        r = await this.fetchApi(`${e.serverUrl}/api/interface/getCatMenu`, { token: e.token, project_id: s._id })
      return {
        ...s,
        ...e,
        cats: r,
        getMockUrl: () => `${e.serverUrl}/mock/${s._id}`,
        getDevUrl: (a) => {
          const i = s.env.find((p) => p.name === a)
          return (i && i.domain) || ''
        },
        getProdUrl: (a) => {
          const i = s.env.find((p) => p.name === a)
          return (i && i.domain) || ''
        },
      }
    } catch (s) {
      return { ...s, ...e }
    }
  }
  static async generateInterfaceCode(e, s, r) {
    const a = { ...s, parsedPath: y.parse(s.path) },
      i = c.isFunction(e.getRequestFunctionName)
        ? await e.getRequestFunctionName(a, q)
        : q.camelCase(s.parsedPath.name),
      p = q.camelCase(`${i}RequestConfig`)
    q.pascalCase(p)
    const n = c.isFunction(e.getRequestDataTypeName)
        ? await e.getRequestDataTypeName(a, q)
        : q.pascalCase(`${i}Request`),
      u = c.isFunction(e.getResponseDataTypeName)
        ? await e.getResponseDataTypeName(a, q)
        : q.pascalCase(`${i}Response`),
      _ = await b.generateRequestDataType({ interfaceInfo: s, typeName: n }),
      l = await b.generateResponseDataType({ interfaceInfo: s, typeName: u, dataKey: e.dataKey })
    e.reactHooks &&
      e.reactHooks.enabled &&
      (c.isFunction(e.reactHooks.getRequestHookName)
        ? await e.reactHooks.getRequestHookName(a, q)
        : `${q.pascalCase(i)}`),
      (s.req_params || []).map((o) => o.name)
    const w = `[${String(s.title).replace(/\//g, '\\/')}↗](${e.serverUrl}/project/${s.project_id}/interface/api/${
        s._id
      })`,
      m = [
        {
          label: '分类',
          value: `[${s._category.name}↗](${e.serverUrl}/project/${s.project_id}/interface/api/cat_${s.catid})`,
        },
        { label: '标签', value: s.tag.map((o) => `\`${o}\``) },
        { label: '请求头', value: `\`${s.method.toUpperCase()} ${s.path}\`` },
      ]
        .filter((o) => !c.isEmpty(o.value))
        .map((o) => `* @${o.label} ${c.castArray(o.value).join(', ')}`).join(`
`)
    return (
      e.yapiMaps && (N[i] = s.catid),
      c.dedent`
      /**
       * 接口 ${w} 的 **请求类型**
       *
       ${m}
       */
      ${_.trim()}

      /**
       * 接口 ${w} 的 **返回类型**
       *
       ${m}
       */
      ${l.trim()}

      ${c.dedent`

        /**
         * 接口 ${w} 的 **请求函数**
         *
         ${m}
         */
        export const ${i} = async (params?: ${n}, config?: IApiRequest) => {
          return request<${u}>('${a.path}', {
            ${a.method.toLocaleLowerCase() === 'get' ? 'params' : 'data: params'},
            method: '${a.method}',
            ctlType: '${a.method.toLocaleLowerCase() === 'get' ? 'none' : 'message'}',
            ...config
          })
        }
      `}
    `
    )
  }
  async writeApiExport(e) {
    const r = Object.keys(e).reduce((a, i) => {
      const p = i.match(/\/api-(\S+?)\//)
      if (p) {
        const n = p[1]
        a[n] || (a[n] = []), a[n].push(i)
      }
      return a
    }, {})
    r &&
      Object.keys(r).length > 0 &&
      Object.keys(r).forEach(async (a) => {
        const i = r[a]
        let p = ''
        for (const n of i) {
          const u = P.readFileSync(n, 'utf8'),
            _ = /export\s+(?:const)\s+(\w+)/g,
            l = /export\s+(?:type|interface)\s+(\w+)/g
          let F
          const w = [],
            d = []
          for (; (F = _.exec(u)) !== null; ) w.push(F[1])
          for (; (F = l.exec(u)) !== null; ) d.push(F[1])
          let m = n.split('/')
          const o = m.pop(),
            g = `${m.join('/')}/index.ts`
          p += 'export type {'
          for (const $ of d) p += `${$},`
          ;(p += `} from './${o == null ? void 0 : o.replace('.ts', '')}';
`),
            (p += 'export {')
          for (const $ of w) p += `${$},`
          p += `} from './${o == null ? void 0 : o.replace('.ts', '')}';
`
          const h = A.format(p, {
            parser: 'typescript',
            printWidth: 120,
            tabWidth: 2,
            singleQuote: !0,
            semi: !1,
            trailingComma: 'all',
            bracketSpacing: !1,
            endOfLine: 'lf',
          })
          await P.outputFile(g, h)
        }
      })
  }
}
exports.Generator = b

'use strict'
Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
const f = require('ts-node'),
  o = require('consola'),
  a = require('fs-extra'),
  d = require('ora'),
  m = require('path'),
  g = require('prompts'),
  u = require('vtils'),
  q = require('./Generator.js')
require('change-case')
require('json5')
require('prettier')
require('request-promise-native')
require('./index.js')
require('axios')
require('json-schema-generator')
require('mockjs')
require('axios-rate-limit')
require('json-schema-to-typescript')
function y(t) {
  const i = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } })
  if (t) {
    for (const e in t)
      if (e !== 'default') {
        const s = Object.getOwnPropertyDescriptor(t, e)
        Object.defineProperty(i, e, s.get ? s : { enumerable: !0, get: () => t[e] })
      }
  }
  return (i.default = t), Object.freeze(i)
}
const h = y(f)
h.register({
  skipProject: !0,
  transpileOnly: !0,
  compilerOptions: {
    strict: !1,
    target: 'es2017',
    module: 'commonjs',
    moduleResolution: 'node',
    declaration: !1,
    removeComments: !1,
    esModuleInterop: !0,
    allowSyntheticDefaultImports: !0,
    importHelpers: !1,
    lib: ['es2017'],
  },
})
async function l(t = process.cwd()) {
  const i = require('../package.json'),
    e = m.join(t, 'ytt.config.ts'),
    s = process.argv[2]
  if (s === 'version') console.log(`${i.name} v${i.version}`)
  else if (s === 'help')
    console.log(`
${u.dedent`
      # 用法
        初始化配置文件: ytt init
        生成代码: ytt
        查看版本: ytt version
        查看帮助: ytt help

      # GitHub
        https://github.com/fjc0k/yapi-to-typescript
    `}
`)
  else if (s === 'init') {
    if (
      (await a.pathExists(e)) &&
      (o.info(`检测到配置文件: ${e}`),
      !(await g({ type: 'confirm', name: 'override', message: '是否覆盖已有配置文件?' })).override)
    )
      return
    await a.outputFile(
      e,
      u.dedent`
      import { Config } from 'yapi-to-typescript'

      const config: Config = [
        {
          serverUrl: 'http://foo.bar',
          typesOnly: false,
          reactHooks: {
            enabled: false,
          },
          prodEnvName: 'production',
          outputFilePath: 'src/api/index.ts',
          requestFunctionFilePath: 'src/api/request.ts',
          dataKey: 'data',
          projects: [
            {
              token: 'hello',
              categories: [
                {
                  id: 50,
                  getRequestFunctionName(interfaceInfo, changeCase) {
                    return changeCase.camelCase(
                      interfaceInfo.parsedPath.name,
                    )
                  },
                },
              ],
            },
          ],
        },
      ]

      export default config
    `,
    ),
      o.success('写入配置文件完毕')
  } else {
    if (!(await a.pathExists(e))) return o.error(`找不到配置文件: ${e}`)
    o.success(`找到配置文件: ${e}`)
    try {
      let r = require(e).default
      typeof r == 'function' && (r = await r())
      const n = new q.Generator(r, { cwd: t }),
        p = d('正在获取数据并生成代码...').start(),
        c = await n.generate()
      p.stop(),
        o.success('获取数据并生成代码完毕'),
        await n.write(c),
        await n.writeApiExport(c),
        o.success('写入文件完毕')
    } catch (r) {
      return o.error(r)
    }
  }
}
require.main === module && l()
exports.run = l

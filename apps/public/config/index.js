const devEnv = require('./env.dev')
const testEnv = require('./env.site')
const uatEnv = require('./env.uat')
const prodEnv = require('./env.prod')
const path = require('path')
const DEFAULT_ENV_TYPE = 'dev'

const getEnvDefine = (type) => {
  const envType = type || process.env.ENV_TYPE || DEFAULT_ENV_TYPE
  switch (envType) {
    case 'dev':
      return devEnv.define
    case 'test':
      return testEnv.define
    case 'uat':
      return uatEnv.define
    case 'prod':
      return prodEnv.define
    default:
      return devEnv.define
  }
}

exports.getEnvDefine = getEnvDefine

exports.getVersionInfo = (project, mode) => {
  if (mode === 'production') {
    try {
      console.log(path.resolve(__dirname, '../../../.build-version'))

      const projectInfo = require('../../../.build-version')[project]

      return projectInfo
    } catch (err) {
      throw '未找到版本文件，请检查代码'
    }
  } else {
    return {}
  }
}

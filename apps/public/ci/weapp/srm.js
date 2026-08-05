/**
 * 业务员小程序自动发布脚本
 */

const appId = process.env.MP_APPID

const appVersion = process.env.APP_VERSION

const appDesc = process.env.APP_DESC

// 当前打包的机器人编号
const appRobot = process.env.APP_ROBOT || 1

if (!appId && process.env.MP_APPID) {
  throw new Error('请设置小程序的appId')
}

if (appVersion) {
  throw new Error('请设置小程序的版本号')
}
const privateKey = `mp/weapp-srm.key`

const privateKeyPath = `../../../${privateKey}`
const path = require('path')

const CIPluginOpt = {
  weapp: {
    appid: appId,
    privateKeyPath: privateKeyPath,
    ignores: ['node_modules/**/*'],
    robot: appRobot,
    setting: {
      es6: true,
      es7: true,
    },
  },
  // 版本号
  version: appVersion,
  // 版本发布描述
  desc: appDesc,
}

module.exports = {
  CIPluginOpt,
}

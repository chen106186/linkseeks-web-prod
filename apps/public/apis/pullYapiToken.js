const axios = require('axios')
const fse = require('fs-extra')
const AppConfig = require('@apps/config')

const defaultDefine = AppConfig.getEnvDefine()
const BACK_GATEWAY = defaultDefine.OUT_YAPI_REQUEST_BACK_GATEWAY || defaultDefine.OUT_BACK_GATEWAY

// 是否强制更新
const isForce = process.argv[2] === '--force'

const OUT_PATH = './yapiToken.json'
async function getToken() {
  try {
    const res = await axios(BACK_GATEWAY + '/manage/deploy/yapi/token/list', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })

    console.log('~~~~~~~~~获取token接口得到的数据\n', res.data, '\n网关:', BACK_GATEWAY)
    if (res.status == 200) genarateData(res.data.data)
    else {
      console.log('\n获取yapi-token接口失败!!!!!!')
      process.exit(1)
    }
  } catch (err) {
    console.log('\n请求接口地址为', `${BACK_GATEWAY}/manage/deploy/yapi/token/list`)
    console.log(err, '\n获取yapi-token接口失败!!!!!!')
    process.exit(1)
  }
}
const listToMap = async (list) => {
  const obj = {}
  let originObj = null

  try {
    originObj = require('./yapiToken.json')
  } catch (err) {}

  list.forEach((element) => {
    obj[element.name] = isForce
      ? {
          token: element.token,
          updateTime: element.updateTime,
          needUpdate: true,
        }
      : {
          token: element.token,
          updateTime: element.updateTime,
          needUpdate:
            originObj && originObj[element.name] ? originObj[element.name].updateTime !== element.updateTime : true,
        }
  })
  return obj
}
const genarateData = async (list) => {
  const obj = await listToMap(list)
  fse.writeJsonSync(OUT_PATH, obj, (err, data) => {
    if (err) console.log(err, '\n获取yapi-token失败!!!!!!')
  })
}

getToken()

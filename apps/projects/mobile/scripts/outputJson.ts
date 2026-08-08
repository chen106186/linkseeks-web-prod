// 请在本地安装ts-node  然后替换里面对应的语言包 ts-node ./scripts/outputJson.ts
import { writeFileSync, mkdirSync, rmdirSync, existsSync, readdirSync, statSync, unlinkSync } from 'fs'
import { resolve } from 'path'

import { LOCAL_VERSION } from '../src/constants/locales'

// 这里将来如果再增加别的语言包需要增加引入
// import zh_CN from '../src/locales/zh_CN'
// import zh_CHT from "../src/locales/zh_CHT";
// import en_US from '../src/locales/en_US'
// import ko_KR from '../src/locales/ko_KR'
// import jp_JA from "../src/locales/jp";

import { zh_CN as zhCN, en_US as enUS, ko_KR as koKR } from '@apps/locales/mobile'
import oldLocales from '@apps/locales/oldMobile'

function flattenObject(obj, parentKey = '') {
  let result = {}

  for (let key in obj) {
    let propName = parentKey ? `${parentKey}.${key}` : key

    if (typeof obj[key] === 'object') {
      Object.assign(result, flattenObject(obj[key], propName))
    } else {
      result[propName] = obj[key]
    }
  }

  return result
}

const localeResource: any = {
  'zh-CN': {
    ...oldLocales.zh_CN,
    ...flattenObject(zhCN),
  },
  // zh_CHT: zh_CHT,
  'en-US': {
    // ...en_US,
    ...flattenObject(enUS),
  },
  'ko-KR': {
    // ...ko_KR,
    ...flattenObject(koKR),
  },
  // jp_JA: jp_JA
}

function main() {
  if (existsSync(resolve(__dirname, `./${LOCAL_VERSION}`))) {
    const _outPutDir = readdirSync(resolve(__dirname, `./${LOCAL_VERSION}`))
    for (let i = 0; i < _outPutDir.length; i++) {
      const _dirPath = resolve(__dirname, `./${LOCAL_VERSION}/${_outPutDir[i]}`)
      const _dirData = statSync(_dirPath)
      if (_dirData.isFile()) {
        unlinkSync(_dirPath)
      } else if (_dirData.isDirectory()) {
        const _jsonDirPath = resolve(__dirname, `./${LOCAL_VERSION}/${_outPutDir[i]}`)
        const _jsonDirData = readdirSync(_jsonDirPath)
        for (let d = 0; d < _jsonDirData.length; d++) {
          const _jsonPath = resolve(__dirname, `./${LOCAL_VERSION}/${_outPutDir[i]}/${_jsonDirData[d]}`)
          unlinkSync(_jsonPath)
        }
        rmdirSync(_jsonDirPath)
      }
    }
    rmdirSync(resolve(__dirname, `./${LOCAL_VERSION}`))
  }
  mkdirSync(resolve(__dirname, `./${LOCAL_VERSION}`))
  for (const child in localeResource) {
    mkdirSync(resolve(__dirname, `./${LOCAL_VERSION}/${child}`))
    writeFileSync(
      resolve(__dirname, `./${LOCAL_VERSION}/${child}/translation.json`),
      JSON.stringify(localeResource[child]),
    )
    // for (const key in localeResource[child]) {
    //   writeFileSync(
    //     resolve(__dirname, `./${LOCAL_VERSION}/${child}/${key}.json`),
    //     JSON.stringify(localeResource[child][key])
    //   );
    // }
  }
}

main()

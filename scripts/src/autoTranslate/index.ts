// import ko_KR from '../../../apps/projects/platform/src/locales/ko-KR'
// import zh_CN from '../../../apps/projects/platform/src/locales/en-US'
// import en_US from '../../../apps/projects/platform/src/locales/zh-CN'
import zh_TW from '../../../apps/projects/platform/src/locales/zh-TW'
import { translateText } from './translate'
import { diffLocale } from './parseLocaleFile'
import { writeFile } from './utils'

const handleWorkQueue = async (workLocale: Record<string, string>, options: any = {}) => {
  const results: any = {}
  // 由于百度翻译API有限流问题，所以每次100条进行翻译，同时1秒间隔一次
  let limit = 100
  let count = 1
  const dispatchObj: Record<string, string>[] = []

  for (const key in workLocale) {
    const index = Math.floor(count / limit)
    count++
    if (dispatchObj[index]) {
      dispatchObj[index][key] = workLocale[key]
    } else {
      dispatchObj[index] = {
        [key]: workLocale[key],
      }
    }
  }

  for (const index in dispatchObj) {
    const item = dispatchObj[index]

    const dispatchValues = Object.values(item).join('\n')
    const target = await translateText(dispatchValues, options)

    if (target) {
      const dst = target.map((v) => v.dst)
      Object.keys(item).forEach((key, index) => {
        results[key] = dst[index]
      })
    } else {
      console.log(target)
      throw '翻译异常'
    }
  }
  return results
}

// 按目录结构输出国际化文件
const translateDirLocales = (dirs, output) => {}

interface workQueueOption {
  locales: Record<string, string>
  from: string
  to: string
  name: string
}
const run = async (queues: workQueueOption[]) => {
  for (const key in queues) {
    const item = queues[key]
    const name = item.name
    console.log(`${name}，开始请求...`)
    const target = await handleWorkQueue(item.locales, { from: item.from, to: item.to })
    console.log(`开始写入${name}`)
    await writeFile(`../../dist/${item.to}.json`, target)
    console.log('写入成功!')
  }
}
const main = async () => {
  console.log('-------- 开始翻译 ---------\n')
  // 英文的缺失翻译对象
  // const enDiffLocale = diffLocale(zh_CN, en_US)
  // const koDiffLocale = diffLocale(zh_CN, ko_KR)

  const workQueues: workQueueOption[] = [
    { locales: zh_TW, from: 'zh', to: 'cht', name: '韩文' },
    // { locales: koDiffLocale, from: 'zh', to: 'kor', name: '韩文' },
  ]

  await run(workQueues)

  console.log('-------- 翻译结束 ---------\n')
}

main()

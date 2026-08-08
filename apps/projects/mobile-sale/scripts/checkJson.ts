// 此脚本执行需要先执行outputJson.ts脚本
import { promises as fs, readdirSync, statSync } from 'fs'
import { resolve, join } from 'path'

import { LOCAL_VERSION } from '../src/constants/locales'

// 异步读取目录中的所有JSON文件
async function readJsonFiles(directory) {
  // const files = await fs.readdir(directory);
  const _outPutDir = readdirSync(directory)
  // const filePaths = jsonFiles.map(file => path.join(directory, file));

  const filePaths: any = []

  for (let i = 0; i < _outPutDir.length; i++) {
    const _dirPath = resolve(__dirname, `./${LOCAL_VERSION}/${_outPutDir[i]}`)
    const _dirData = statSync(_dirPath)
    if (_dirData.isFile()) {
      // filePaths.push(path.join(_dirPath, _dirPath))
    } else if (_dirData.isDirectory()) {
      const _jsonDirPath = resolve(__dirname, `./${LOCAL_VERSION}/${_outPutDir[i]}`)
      const _jsonDirData = readdirSync(_jsonDirPath)
      filePaths.push(join(_jsonDirPath, _jsonDirData[0]))
    }
  }

  return filePaths
}

// 异步读取并解析JSON文件，返回key的集合
async function getKeysFromJson(filePath) {
  const data = await fs.readFile(filePath, 'utf8')
  const jsonObject = JSON.parse(data)
  return new Set(Object.keys(jsonObject))
}

// 找出所有key的并集
function getAllKeys(keySets) {
  const allKeysSet = new Set()
  keySets.forEach((keySet) => {
    keySet.forEach((key) => {
      allKeysSet.add(key)
    })
  })
  return allKeysSet
}

// 比较key集合，输出缺少的key值
function compareKeySets(allKeysSet, fileKeysSet, fileName) {
  const missingKeys = Array.from(allKeysSet).filter((key) => !fileKeysSet.has(key))
  if (missingKeys.length > 0) {
    console.log(`文件 ${fileName} 缺少以下key: ${missingKeys.join(', ')}`)
  } else {
    console.log(`文件 ${fileName} 的key数量与其他文件一致`)
  }
}

// 主函数
async function main() {
  try {
    // 读取JSON文件路径
    const filePaths = await readJsonFiles(resolve(__dirname, `./${LOCAL_VERSION}`))

    // 读取并解析JSON文件，得到key集合的数组
    const keySetsPromises = filePaths.map((filePath) => getKeysFromJson(filePath))
    const keySets = await Promise.all(keySetsPromises)

    // 获取所有key的并集
    const allKeysSet = getAllKeys(keySets)

    // 比较每个文件的key集合，并输出缺少的key值
    filePaths.forEach((filePath, index) => {
      // const fileName = basename(filePath);
      const fileKeysSet = keySets[index]
      compareKeySets(allKeysSet, fileKeysSet, filePath)
    })
  } catch (error) {
    console.error('发生错误:', error)
  }
}

// 执行主函数
main()

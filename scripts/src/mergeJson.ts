import fs from 'fs'
import path from 'path'

// 合并文件夹下所有的 JSON 文件
const mergeJsonFiles = (folderPath: string, outputFile: string) => {
  try {
    const mergedData: any = {}

    const traverseDirectory = (dir: string) => {
      const files = fs.readdirSync(dir)

      for (const file of files) {
        const filePath = path.join(dir, file)
        const fileStat = fs.statSync(filePath)

        if (fileStat.isFile() && file.endsWith('.json')) {
          const fileContent = fs.readFileSync(filePath, 'utf-8')
          const jsonData = JSON.parse(fileContent)
          Object.assign(mergedData, jsonData)
        } else if (fileStat.isDirectory()) {
          traverseDirectory(filePath) // 递归遍历子文件夹
        }
      }
    }

    traverseDirectory(folderPath)

    fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2))
    console.log(`Merged JSON files in ${folderPath} to ${outputFile}`)
  } catch (error) {
    console.error('Error merging JSON files:', error)
  }
}

// 使用示例
const getSourcePath = (p) => path.resolve(__dirname, '../../', p)
const sourceDir = getSourcePath('localeDemo/zh-TW') // 替换为实际的源目录路径
const outputDir = getSourcePath('apps/demo.json') // 替换为实际的输出目录路径

mergeJsonFiles(sourceDir, outputDir)

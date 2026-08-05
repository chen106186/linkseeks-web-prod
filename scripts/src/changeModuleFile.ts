import fs from 'fs'
import path from 'path'
import ts from 'typescript'
import os from 'os'
const getSourcePath = (p) => path.resolve(__dirname, '../../', p)
const sourceDir = getSourcePath('apps/projects/mobile/src/locales') // 替换为实际的源目录路径
const outputDir = getSourcePath('apps/demo') // 替换为实际的输出目录路径

const ensureDirectoryExistence = (filePath: string) => {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirectoryExistence(dirname)
  fs.mkdirSync(dirname)
}

const transformTsToJson = (filePath: string) => {
  if (path.basename(filePath) === 'index.ts') {
    console.log(`Skipping ${filePath}`)
    return
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true)

  let defaultExportObject: any = null

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isExportAssignment(node) && ts.isObjectLiteralExpression(node.expression)) {
      defaultExportObject = node.expression
    }
  })

  if (defaultExportObject) {
    const jsonFileName = path.basename(filePath, path.extname(filePath)) + '.json'
    const jsonFilePath = path.join(outputDir, path.relative(sourceDir, filePath.replace(/\.ts$/, '.json')))
    ensureDirectoryExistence(jsonFilePath) // 确保目标文件夹存在
    const target: any = {}
    for (const item in defaultExportObject) {
      target[item] = defaultExportObject[item]
    }
    const printer = ts.createPrinter({
      removeComments: true, // 不输出注释
    })
    let jsonContent = printer.printNode(ts.EmitHint.Unspecified, target, sourceFile)
    jsonContent = jsonContent.replace(/\'/g, '"').replace(/,(?=\s*?[\]}])/g, '') // 移除结尾处的逗号
    fs.writeFileSync(jsonFilePath, jsonContent)
    console.log(`Converted ${filePath} to ${jsonFilePath}`)
  }
}

const traverseDirectory = (dir: string) => {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isFile() && filePath.endsWith('.ts')) {
      transformTsToJson(filePath)
    } else if (fs.statSync(filePath).isDirectory()) {
      traverseDirectory(filePath) // 递归遍历子文件夹
    }
  })
}

const main = () => {
  traverseDirectory(sourceDir)
}

main()

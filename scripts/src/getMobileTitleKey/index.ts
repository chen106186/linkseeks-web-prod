import fs from 'fs'
import path from 'path'

const rootDir = '../../../'

const packageDir = 'apps/projects/mobile/src/packages' // 替换为实际的根目录路径

const traverseDirectory = (dir: string) => {
  const files = fs.readdirSync(dir)
  const foldersWithIndexConfig: any[] = []

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      const hasIndexConfig = fs.existsSync(path.join(filePath, 'index.config.tsx'))
      if (hasIndexConfig) {
        foldersWithIndexConfig.push(filePath)
      }

      foldersWithIndexConfig.push(...traverseDirectory(filePath)) // 递归遍历子文件夹
    }
  })

  return foldersWithIndexConfig
}

const main = () => {
  const dispatchPath = path.resolve(__dirname, rootDir, packageDir)
  const folders = traverseDirectory(dispatchPath)

  const results = folders
    .map((v: string) => {
      return v.substring(v.indexOf('packages/')).replace('packages/', '').replace(/\//g, '.')
    })
    .reduce((prev, next) => {
      prev[next] = ''
      return prev
    }, {} as any)
  fs.writeFile('./demo.json', JSON.stringify(results), (err) => {
    if (err) {
      throw err
    }
  })
  // folders.forEach((folder) => {
  //   const relativePath = path.relative(rootDir, folder);
  //   console.log(relativePath.replace(/\\/g, '/')); // 将路径中的反斜杠替换为斜杠
  // });
}

main()

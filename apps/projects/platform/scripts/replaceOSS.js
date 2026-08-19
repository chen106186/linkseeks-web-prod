const fs = require('fs')
const path = require('path')

const fileDir = path.join(__dirname, '../dist-platform/index.html')
fs.readFile(fileDir, 'UTF-8', function (err, data) {
  if (err) {
    throw err
  }

  const repData = data.replace(
    /\=\"\/umi\.(\w+)\.(\w+)\"/g,
    `="https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/web/umi.$1.$2"`,
  )

  fs.writeFile(fileDir, repData, function (err) {
    if (err) {
      throw err
    }

    console.log('oss file write success')
  })
})

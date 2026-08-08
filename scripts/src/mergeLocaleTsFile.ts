import * as GlobalData from '../../apps/projects/platform/src/locales'
import fs from 'fs'
import path from 'path'

const dirname = path.resolve()

Object.keys(GlobalData).forEach((key) => {
  fs.writeFile(path.resolve(dirname, `./dist/${key}.json`), JSON.stringify(GlobalData[key]), function (err) {
    if (err) throw err
  })
})

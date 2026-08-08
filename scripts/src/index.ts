import path from 'path'
import { importMetaGlob } from './utils'

function resolve(p: string) {
  return path.resolve(__dirname, '../../projects', p)
}

// 使用示例
importMetaGlob<{ [key: string]: any }>(resolve(`admin/src/pages/**/page.config.{ts,tsx}`))
  .then((files) => {
    console.log('file', files)
  })
  .catch((error) => {
    console.error(error)
  })

import fs from 'fs'
import glob from 'glob'
import path from 'path'

interface MetaGlobOptions {
  /**
   * 是否需要解析default
   */
  eager?: boolean

  /**
   * 只解析路径，会导致返回的content是null值
   */
  onlyPath?: boolean
}

interface FileWithContent<T> {
  filePath: string
  content: T
}

/**
 * 根据传入的路径表达式进行文件解析并返回
 *
 * 可配置 eager: true， 则解析文件时会返回其default属性值
 */
export async function importMetaGlob<T>(pattern: string, options?: MetaGlobOptions): Promise<FileWithContent<T>[]> {
  const { eager, onlyPath } = options || {}
  const basePath = path.dirname(require.main?.filename || '')
  const files = glob.sync(pattern, { cwd: basePath, absolute: true })
  const fileContents: FileWithContent<T>[] = []

  for (const file of files) {
    if (onlyPath) {
      fileContents.push({
        filePath: file,
        content: null as any,
      })
    } else {
      const content = await import(file)
      fileContents.push({
        filePath: file,
        content: eager ? content.default : content,
      })
    }
  }

  return fileContents
}

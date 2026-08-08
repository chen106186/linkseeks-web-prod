import { FormatExtension } from './format'
import { mergeClassObj } from '../utils'

export const createLocaleExtension = <T>(translate: T): T & FormatExtension => {
  const formatExtension = new FormatExtension(translate as any)

  mergeClassObj(translate, formatExtension)

  return translate as any
}

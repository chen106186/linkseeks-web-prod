import { init } from '@linkseeks/i18n'

/**
 * 国际化的翻译注入
 *
 * 这里应该把所有的国际化翻译都写入，pc端共用一个preset
 */
export const presetI18n = async (locales: any) => {
  const { i18n } = await init()
  Object.keys(locales).forEach((key) => {
    const resource = locales[key]
    i18n.addResources(key.replace('_', '-'), 'translation', resource)
  })

  console.log(i18n)
  return {
    i18n,
  }
}

export default presetI18n

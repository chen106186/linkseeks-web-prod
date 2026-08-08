import { getCommodityLanguageGetLanguagePage } from '@apps/apis'
import { BaseService } from '../BaseService'

export interface LanguageInfo {
  language: string
  img: string
  key: string
}

export class LanguageService extends BaseService {
  languageList: LanguageInfo[]

  async getLanguageList(force?: boolean) {
    if (this.languageList && !force) {
      return this.languageList
    }

    const { data } = await this.getData('getLanguageList', async () => await getCommodityLanguageGetLanguagePage())
    this.languageList = data.data
      .filter((v) => v.status)
      .map((v) => {
        return {
          language: v.name,
          img: '',
          key: v.nameEn,
        } as LanguageInfo
      })
    // 状态为1的是有效
    return this.languageList
  }

  /**
   * 通过指定的key，获取对应的语言列表
   */
  findLanguage(key: string) {
    if (this.languageList.length === 0) {
      return null
    }
    return this.languageList.find((v) => v.key === key)
  }
}

const languageServiceInstance = new LanguageService()

export default languageServiceInstance

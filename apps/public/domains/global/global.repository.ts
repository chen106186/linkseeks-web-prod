import GlobalConfig from '../../fixed/base.config.json'
import { BaseRepository } from '../BaseRepository'
import { TERMINAL_ENUMS, BUSINESS_SOURCE_ENUMS } from './global.enum'
import { getTelCodeOptions } from '@apps/services'

type SiteInfo = typeof GlobalConfig.global.siteInfo
export class GlobalRepository extends BaseRepository {
  private terminal: TERMINAL_ENUMS
  private businessTerminal: BUSINESS_SOURCE_ENUMS

  private siteInfo: SiteInfo

  /**
   * 目前系统可以使用的手机区号
   */
  private telCodes: string[]

  constructor() {
    super()
    this.siteInfo = GlobalConfig.global.siteInfo
  }

  setTerminal(terminal: TERMINAL_ENUMS) {
    this.terminal = terminal
  }

  getTerminal() {
    return this.terminal
  }

  setBusinessTerminal(businessTerminal: BUSINESS_SOURCE_ENUMS) {
    this.businessTerminal = businessTerminal
  }

  getBusinessTerminal() {
    return this.businessTerminal
  }

  setSiteInfo(siteInfo: SiteInfo) {
    this.siteInfo = siteInfo
  }

  getSiteInfo() {
    return this.siteInfo
  }

  setTelCodes(telCodes: string[]) {
    this.telCodes = telCodes
  }

  async getTelCodes() {
    const data = await this.getData('getTelCode', async () => await getTelCodeOptions())
    this.telCodes = data

    return this.telCodes
  }
}

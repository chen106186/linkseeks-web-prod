import { FormatMessageOptions } from '@linkseeks/i18n'

interface getMessageFn<LanguageKeys> {
  (key: LanguageKeys, options?: Partial<FormatMessageOptions>): string
}

export class BaseExtension<LanguageKeys> {
  protected translate: getMessageFn<LanguageKeys>
  constructor(instanceFn: getMessageFn<LanguageKeys>) {
    this.translate = instanceFn
  }
}

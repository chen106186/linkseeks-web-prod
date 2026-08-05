interface ValidateBaseOptions {
  message?: string
}

export interface ValidateNumberOptions extends ValidateBaseOptions {
  min?: number
  max?: number
  length?: number
}

export interface ValidateRequiredOptions extends ValidateBaseOptions {}

export interface ValidateTextLengthOptions extends ValidateBaseOptions {
  length?: number
}

export interface ValidateCNLangaugeOptions extends ValidateBaseOptions {
  length?: number
}

export interface validateLanguageRequiredOptions extends ValidateBaseOptions {
  required?: boolean
  length?: number
}

export interface validateDecimalOptions extends ValidateBaseOptions {
  /**
   * 校验小数的长度
   */
  length?: number
}

export interface validateNumberRangeOptions extends ValidateBaseOptions {
  min: number
  max: number
}

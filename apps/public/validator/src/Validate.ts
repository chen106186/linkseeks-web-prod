import { FormInstance } from '@linkseeks/ui'

interface ValidateRule {
  field: string
  type: string
}

interface ValidateCallback {
  (value: any, formInstance: FormInstance, rule: ValidateRule): any
}

export class Validate {
  private callback: ValidateCallback
  constructor(callback: ValidateCallback) {
    this.callback = callback
  }
  init(): any {
    return (formInstance: FormInstance) => ({
      validator: (rule: ValidateRule, value: any) => this.callback(value, formInstance, rule),
    })
  }
}
